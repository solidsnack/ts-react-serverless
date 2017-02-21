import * as React from "react"


export class Form extends React.Component<{}, {}> {
    private form: HTMLFormElement | null = null

    static validate<T>(input: HTMLInputElement,
                       constructor: {new(s: string): T}): T {
        try {
            const data = new constructor(input.value)
            input.setCustomValidity("")               // Empty string means: OK
            return data
        } catch (e) {
            if (e instanceof DataError) {
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

    validateFields(): SignUp {
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
            const signUp = this.validateFields()
            const json = JSON.stringify(signUp)
            console.log(`SignUp: ${json}`)
        } catch (e) {
            if (e instanceof DataError) {
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


export class SignUp {
    constructor(readonly firstName: string, readonly lastName: string,
                readonly phone: Phone, readonly zip: ZIP) {}
}


export class ZIP {
    public static readonly re = /^[0-9]{5}(-[0-9]{4})?$/
    public readonly original: string

    constructor(digits: string) {
        const trimmed = digits.trim()
        if (ZIP.re.test(trimmed)) {
            this.original = trimmed
        } else {
            throw new ZIPError(`Not a valid ZIP code: "${trimmed}"`)
        }
    }

    toJSON(): string {
       return this.original
    }
}


export class Phone {
    public static readonly international = /^[+]([0-9] *){10,}$/
    public readonly normed: string
    public readonly original: string

    constructor(digits: string) {
        const trimmed = digits.trim()
        if (Phone.international.test(trimmed)) {
            this.original = trimmed
            this.normed = `+${trimmed.replace(/[^0-9]/, "")}`
        } else {
            throw new PhoneError(`Not a valid phone number: "${trimmed}"`)
        }
    }

    toJSON(): string {
       return this.normed
    }
}


class DataError implements Error {
    readonly name: string = "DataError"

    constructor(public message: string) {}
}

class ZIPError extends DataError {}

class PhoneError extends DataError {}

class FormNotBound extends DataError {}

class FormNotValid extends DataError {}
