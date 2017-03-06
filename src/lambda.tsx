import * as AWS from "aws-sdk"

import Err from "./err"
import { Envelope, SignUp, SignUpDataError, Result } from "./signup"


const s3 = new AWS.S3()

const thanks = "Thanks for signing up for Landing Page!"


export function handler(event: any, context: any, callback: LambdaCallback) {
    try {
        const uuid: string = context.awsRequestId
        const signUp = SignUp.fromJSON(JSON.parse(event.body))
        const [bucket, prefix] = envS3Settings()
        const store = new S3Store(bucket, prefix)
        store.save(signUp, uuid).then(() => {
            console.log("Stored object.")
            sendResult(200, thanks, callback)
        }).catch((err) => {
            console.error(`Storage error: ${err.code} "${err.message}"`)
            sendResult(500, "Impossible error!", callback)
        })
    } catch (e) {
        if (e instanceof SignUpDataError) {
            sendResult(400, e.message, callback)
        }
    }
}


function sendResult(code: number, message: string, callback: LambdaCallback) {
    callback(null, {
        statusCode: code,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(new Result(code == 200, message))
    })
}


type LambdaCallback = (err: Error | null, result: object) => never


class S3Store {
    readonly bucket: string
    readonly prefix: string

    constructor(bucket: string, prefix: string) {
        this.bucket = bucket
        this.prefix = prefix.replace(/(^[/]+)|([/]+$)/, "")
    }

    key_and_envelope(signUp: SignUp, uuid: string): [string,
                                                     Envelope<SignUp>] {
        const t = new Date()
        const utc_timestamp = t.toISOString()
        const ymd = utc_timestamp.slice(0, 10)
        const hms = utc_timestamp.slice(11, 19)
        const f = signUp.key().replace(/(^[/]+)|([/]+$)/, "") + ".json"
        const key = `${this.prefix}/${ymd}/${hms}/${f}`
        return [key, new Envelope(uuid, t, signUp)]
    }

    async save(signUp: SignUp, uuid: string): Promise<AWS.S3.PutObjectOutput> {
        const bucket = this.bucket
        const [key, envelope] = this.key_and_envelope(signUp, uuid)
        const body = JSON.stringify(envelope, null, 2) + "\n"
        const req = s3.putObject({Bucket: bucket, Key: key, Body: body})
        console.log(`Storing object as: s3://${bucket}/${key}`)
        return req.promise()
    }
}


function envS3Settings(): [string, string] {
    if (process.env.S3URL) {
        return splitS3URL(process.env.S3URL)
    }
    throw new LambdaError("Please define: S3URL=s3://<bucket>/<prefix>")
}


function splitS3URL(url: string): [string, string] {
    const match = /^s3:[/][/]([^/]+)[/](.*)$/.exec(url)
    if (!match) {
        throw new LambdaError("Invalid S3 URL.")
    }
    return [match[1], match[2].replace(/(^[/]+)|([/]+$)/, "")]
}


class LambdaError extends Err {}
