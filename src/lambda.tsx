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
             context.fail(new LambdaResult(400, {error: e.message}))
        }
    }
}


function save(signUp: SignUp, context: any) {
    console.log(`Trying to store: ${JSON.stringify(signUp)}`)
    ddb.putItem(signUpDynamoFormat(signUp), (err, result) => {
        if (err) {
            console.error(`DynamoDB error: ${err.code} ${err.message}`)
            const error = "Impossible error!"
            context.fail(new LambdaResult(500, {error}))
        } else {
            console.log("Stored object.")
            context.succeed(new LambdaResult(200, {message: thanks}))
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
            phone: { S: signUp.phone.normed },
            zip: { S: signUp.zip.normed },
            asOf: { S: utcString }
        },
        TableName: table
    }
}


class LambdaResult {
    readonly statusCode: number
    readonly headers: object
    readonly body: string

    constructor(statusCode: number = 200,
                data: object = {},
                headers: object = {"Content-Type": "application/json"}) {
        this.statusCode = statusCode
        this.headers = headers
        this.body = JSON.stringify(data)
    }
}
