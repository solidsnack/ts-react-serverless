import * as React from "react"


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
}


export class Form extends React.Component<{}, {}> {
    private form: HTMLFormElement | null = null

    static validate<T>(input: HTMLInputElement,
                       constructor: {new(s: string): T}): T {
        try {
            const data = new constructor(input.value)
            input.setCustomValidity("")
            return data
        } catch (e) {
            if (e instanceof SignUpDataError) {
                input.setCustomValidity(e.message)
            }
            throw e
        }
    }

    element(name: string): HTMLInputElement {
        if (!this.form) {
            throw new FormNotBound("Form not bound.")
        }
        return this.form.elements.namedItem(name) as HTMLInputElement
    }

    validateFields() {
        try {
            this.getSignUp()
            return true
        } catch (e) {
            if (e instanceof SignUpDataError) {
                return false
            }
            throw e
        }
    }

    getSignUp(): SignUp {
        if (!this.form) {
            throw new FormNotBound("Form not bound.")
        }
        let firstName = this.element("firstName").value
        let lastName = this.element("lastName").value
        let phone = Form.validate(this.element("phone"), Phone)
        let zip = Form.validate(this.element("zip"), ZIP)
        if (!this.form.checkValidity()) {
            throw new FormNotValid("Form not valid.")
        }
        return new SignUp(firstName, lastName, phone, zip)
    }

    handleSubmit(event: any) {
        event.preventDefault()
        try {
            const signUp = this.getSignUp()
            const json = JSON.stringify(signUp)
            console.log(`SignUp: ${json}`)
        } catch (e) {
            if (e instanceof SignUpDataError) {
                console.error(`${e.name}: ${e.message}`)
                return
            }
            throw e
        }
    }

    render() {
        const len = 128
        return <section>
            <form onSubmit={(event) => this.handleSubmit(event)}
                  ref={(el) => {this.form = el}}>
                <input name="firstName" type="text" maxLength={len} required
                       placeholder="First Name" />
                <input name="lastName" type="text" maxLength={len} required
                       placeholder="Last Name" />
                <input name="phone" type="tel" required
                       placeholder="Phone"
                       onChange={(ev) => this.validateFields()} />
                <input name="zip" type="text" required
                       pattern="[0-9]{5}(-[0-9]{4})?"
                       placeholder="ZIP"
                       onChange={(ev) => this.validateFields()} />
                <input type="submit" name="submit" />
            </form>
        </section>
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


export class SignUpDataError implements Error {
    readonly name: string = (this.constructor as any).name

    constructor(public message: string) {}
}

class ZIPError extends SignUpDataError {}

class PhoneError extends SignUpDataError {}

class FormNotBound extends SignUpDataError {}

class FormNotValid extends SignUpDataError {}
