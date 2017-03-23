import * as ExtractTextPlugin from "extract-text-webpack-plugin"

const StaticSiteGenerator = require("static-site-generator-webpack-plugin")
const pkg = require("./package.json")

module.exports = [{
    entry: "./src/index.tsx",
    output: {
        filename: "index.js",
        path: __dirname + "/dist/client/",
        library: "LandingPage",
        libraryTarget: "umd"
    },

    plugins: [
        new StaticSiteGenerator({locals: pkg.landingPage}),
        new ExtractTextPlugin("styles.css")
    ],

    devtool: "source-map",

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js",
                     ".css", ".png"]
    },

    module: {
        loaders: [{
            test: /[.]tsx?$/,
            loader: "awesome-typescript-loader",
        }, {
            test: /[.]css?$/,
            loader: ExtractTextPlugin.extract({
                use: {
                    loader: "typings-for-css-modules-loader",
                    options: {
                        modules: true,
                        namedExport: true,
                        camelCase: true
                    }
                }
            })
        }, {
            test: /[.]png$/,
            loader: require.resolve("file-loader")
        }],
    }
},
{
    entry: "./src/lambda.tsx",
    output: {
        filename: "lambda.js",
        path: __dirname + "/dist/serverless/",
        library: "LandingPage",
        libraryTarget: "commonjs2"
    },
    target: "node",

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [{
            test: /[.]tsx?$/,
            loader: "awesome-typescript-loader"
        }],
    },

    externals: {
        "aws-sdk": "aws-sdk"
    }
}];
