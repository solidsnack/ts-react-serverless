import * as React from "react"
import * as ReactDOM from "react-dom"

import { Hello } from "./hello"


ReactDOM.render(
    <Hello headline="Welcome to Landing Page!"
           tagline="Sign up to learn more..." />,
    document.getElementById("hello")
);
