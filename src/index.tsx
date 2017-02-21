import * as React from "react"
import * as ReactDOM from "react-dom"

import { Hello } from "./hello"


ReactDOM.render(
    <Hello headline="Land on your landing page"
           tagline="Submit the form to learn more" />,
    document.getElementById("hello")
);
