const StaticSiteGenerator = require("static-site-generator-webpack-plugin")
const pkg = require("./package.json")

module.exports = [{
    entry: "./src/index.tsx",
    output: {
        filename: "index.js",
        path: __dirname + "/dist/client/",
        library: "LandingPage",
        libraryTarget: "commonjs2"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

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
    }
},
{
    entry: "./src/index.tsx",
    output: {
        filename: "index.js",
        path: __dirname + "/dist/client/",
        library: "LandingPage",
        libraryTarget: "commonjs2"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    plugins: [
        new StaticSiteGenerator({locals: pkg.landingPage})
    ],

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
    }
}];
