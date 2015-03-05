var webpack = require('webpack');
var path = require('path');

var bower_dir = path.join(__dirname, 'bower_components');
var node_modules_dir = path.join(__dirname, 'node_modules');

var port = process.env.HOT_LOAD_PORT || 8888;

//var AngularPlugin = require('angular-webpack-plugin');
//var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    cache: true,
    addVendor: function (name, path) {
        this.resolve.alias[name] = path;
        this.module.noParse.push(path);
        //this.entry.vendor.push(name);
    },
    entry: [
        'webpack-dev-server/client?http://localhost:' + port,
        'webpack/hot/dev-server',
        //'webpack/hot/only-dev-server',
        './src/main.js'
    ],
    externals: {
        //angular: 'angular'
    },
    output: {
        publicPath: 'http://localhost:' + port + '/build/',
        path: path.join(__dirname, '/build/'),
        filename: 'main.js'
    },
    resolve: {
        extensions: ['', '.js', '.coffee', '.scss', '.css'],
        fallback: node_modules_dir
    },
    resolveLoader: {
        fallback: node_modules_dir
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                //loader: 'jsx-loader',
                loaders: ['react-hot', 'jsx?harmony'],
                exclude: [bower_dir, node_modules_dir]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.ng-tpl\.html$/,
                loader: "ng-cache?prefix=[dir]/[dir]"
            },
            {
                test: /\.(scss|sass)$/,
                // Query parameters are passed to node-sass
                loader: "style!css!sass?outputStyle=expanded&" +
                "includePaths[]=" +
                (path.resolve(__dirname, "./bower_components")) + "&" +
                "includePaths[]=" +
                (path.resolve(__dirname, "./node_modules")) +
                "includePaths[]=" +
                (path.resolve(__dirname, "./src/css"))
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
        //new webpack.NoErrorsPlugin()
    ]
};

if (process.env.NODE_ENV === "development") {
    config.devtool = 'eval'; // This is not as dirty as it looks. It just generates source maps without being crazy slow.
}

//config.addVendor('angular', bower_dir + '/angular/angular.min.js');
//config.addVendor('angular-animate', bower_dir + '/angular-animate/angular-animate.min.js');

//config.addVendor('angular-ui-router', bower_dir + '/angular-ui-router/release/angular-ui-router.min.js');

//if (process.env.NODE_ENV === "production") {
//    config.resolve.alias = {'react-a11y': function() {}}; // Aliases react-a11y to nothing in production
//}


module.exports = config;