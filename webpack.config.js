const HTML = require("html-webpack-plugin")
const HTMLInlineSource = require("html-webpack-inline-source-plugin")
const pkg = require("./package.json")

module.exports = [{
    entry: "./src/index.tsx",
    output: {
        filename: "client.js",
        library: "Application",
        path: __dirname + "/dist",
    },
    plugins: [
        new HTML({
            title: pkg.description,
            inlineSource: /[.](js|css)$/,
            template: "src/index.html"
        }),
        new HTMLInlineSource(),
    ],

    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by
            // 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ],
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
},
{
    entry: "./src/lambda.tsx",
    output: {
        filename: "lambda.js",
        path: __dirname + "/dist",
        library: "[name]",
        libraryTarget: "commonjs2",
    },
    // target: "node",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by
            // 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ],
    },

    externals: {
        "aws-sdk": "aws-sdk"
    },
}]
