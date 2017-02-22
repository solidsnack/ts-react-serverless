import * as AWS from "aws-sdk"

import { SignUp, SignUpDataError } from "./signup"


const ddb = new AWS.DynamoDB()

const thanks = "Thanks for signing up for Landing Page!"


export function handler(event: any, context: any) {
    try {
        const signUp = SignUp.fromJSON(JSON.parse(event.body))
        save(signUp, context)
    } catch (e) {
        if (e instanceof SignUpDataError) {
             context.fail(`400 // SignUpDataError: ${e.message}`)
        }
    }
}


function save(signUp: SignUp, context: any) {
    console.log(`Trying to store: ${signUp}`)
    ddb.putItem(signUpDynamoFormat(signUp), (err, result) => {
        if (err) {
            console.error(`DynamoDB error: ${err.code} ${err.message}`)
            context.fail("500 // ImpossibleError")
        } else {
            console.log("Stored object.")
            context.success({thanks})
        }
    })
}


function signUpDynamoFormat(signUp: SignUp,
                            nominalDate?: Date,
                            table: string = "LandingPageEvents"): any {
    const date = nominalDate ? nominalDate : new Date()
    const utcString = date.toISOString()           // Seems to do UTC *and* ISO
    return {
        Item: {
            firstName: { S: signUp.firstName },
            lastName: { S: signUp.lastName },
            phone: { S: signUp.phone },
            zip: { S: signUp.zip },
            asOf: { S: utcString }
        },
        TableName: table
    }
}