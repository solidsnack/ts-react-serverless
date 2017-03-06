import Err from "./err"


export class SignUp {
    constructor(readonly firstName: string,
                readonly lastName: string,
                readonly phone: Phone,
                readonly zip: ZIP) {}

    static fromJSON(json: any): SignUp {
        try {
            const phone = new Phone(json.phone)
            const zip = new ZIP(json.zip)
            return new SignUp(json.firstName, json.lastName, phone, zip)
        } catch (e) {
            if (e instanceof SignUpDataError) {
                throw e
            }
            throw new SignUpDataError(e.message)       // Wrap other exceptions
        }
    }

    key(): string {
        return this.phone.normed
    }
}


export class ZIP {
    public static readonly re = /^[0-9]{5}([+-][0-9]{4})?$/
    public readonly normed: string
    public readonly original: string

    constructor(digits: string) {
        const trimmed = digits.trim()
        if (ZIP.re.test(trimmed)) {
            this.original = trimmed
            this.normed = `${trimmed.replace(/[+]/, "-")}`
        } else {
            throw new ZIPError("Please input a valid ZIP code or ZIP+4.")
        }
    }

    toJSON(): string {
       return this.normed
    }
}


export class Phone {
    // E.164 format: https://support.twilio.com/hc/en-us/articles/223179888
    public static readonly international = /^[+]([0-9] *){11,15}$/
    public readonly normed: string
    public readonly original: string

    constructor(digits: string) {
        const trimmed = digits.trim()
        const justDigits = trimmed.replace(/[^0-9]/g, "")
        if (Phone.international.test(trimmed)) {
            this.original = trimmed
            this.normed = `+${justDigits}`

            return
        }
        if (justDigits.length == 10) {
            this.original = trimmed
            this.normed = `+1${justDigits}`                // Assume US, add +1
            return
        }
        throw new PhoneError("Please input a valid phone number " +
                             "(10 digit with area code, or `+1 ...`).")
    }

    toJSON(): string {
       return this.normed
    }
}


export class SignUpDataError extends Err {}

class ZIPError extends SignUpDataError {}

class PhoneError extends SignUpDataError {}


export class Envelope<T> {
    public constructor(readonly event: string,
                       readonly timestamp: Date,
                       readonly data: T) {}
}


export class Result {
    public constructor(readonly ok: boolean, readonly message: string) {}

    static fromJSON(json: any): Result {
        try {
            return new Result(json.status, json.message)
        } catch (e) {
            throw new SignUpDataError(e.message)       // Wrap other exceptions
        }
    }
}
