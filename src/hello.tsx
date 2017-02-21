import * as React from "react"

import {Form} from "./signup"


export interface ContentProps {
    headline: string
    tagline: string
}


export class Hello extends React.Component<ContentProps, undefined> {
    render() {
        return <article>
            <Content headline={this.props.headline}
                     tagline={this.props.tagline} />
            <Form/>
        </article>
    }
}


export class Content extends React.Component<ContentProps, undefined> {
    render() {
        return <section>
            <h1>{this.props.headline}</h1>
            <p>{this.props.tagline}</p>
        </section>
    }
}
