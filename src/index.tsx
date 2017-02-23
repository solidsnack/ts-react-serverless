import * as React from "react"
import * as ReactDOM from "react-dom"

import Err from "./err"
import { Phone, SignUp, SignUpDataError, ZIP } from "./signup"


ReactDOM.render(<Hello headline="Welcome to Landing Page!"
                       tagline="Sign up to learn more..." />,
                document.getElementById("hello"))


interface ContentProps {
    headline: string
    tagline: string
}


class Hello extends React.Component<ContentProps, undefined> {
    render() {
        return <article>
            <Content headline={this.props.headline}
                     tagline={this.props.tagline} />
            <Form/>
        </article>
    }
}


class Content extends React.Component<ContentProps, undefined> {
    render() {
        return <section>
            <h1>{this.props.headline}</h1>
            <p>{this.props.tagline}</p>
        </section>
    }
}


class Form extends React.Component<undefined, undefined> {
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


class FormError extends Err {}

class FormNotBound extends SignUpDataError {}

class FormNotValid extends SignUpDataError {}
