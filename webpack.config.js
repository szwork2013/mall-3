var webpack = require('webpack');
var path = require('path');

var buildPath = path.resolve(__dirname,"public");
var nodemodules = path.resolve(__dirname,'node_modules');

//var deps = [
//    'util/name_space.js',
//    'util/conf.js',
//    'util/api.js',
//    'util/util.js'
//];
// 通过在第一部分路径的依赖和解压
// 就是你像引用 node 模块一样引入到你的代码中
// 然后使用完整路径指向当前文件，然后确认 Webpack 不会尝试去解析它

var config = {
    entry: {
        //vendors: [
        //    path.resolve(__dirname,'src/util/name_space.js'),
        //    path.resolve(__dirname,'src/util/conf.js'),
        //    path.resolve(__dirname,'src/util/api.js'),
        //    path.resolve(__dirname,'src/util/util.js')
        //],
        app: path.resolve(__dirname,'index.js')
    },
    output: {
        path: buildPath,
        filename: 'app.js',
		publicPath:"./build/"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false  // remove all comments
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ],
    module: {
        noParse: [],
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style!css',include:[path.resolve(__dirname,"src")],exclude:[nodemodules]},
			{ test: /\.js$/, loader: 'babel-loader?presets[]=es2015&presets[]=react',exclude:[nodemodules]},
            { test: /\.less$/, loader: 'style!css!less?sourceMap',include:[path.resolve(__dirname,"src/static/less")]},
            { test: /\.(png|jpg|eot|svg|ttf|woff|woff2)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['', '.js', '.json', '.scss','.css'],
        alias: {}
    }
};

//deps.forEach(function (dep) {
//    var depPath = path.resolve(nodemodules, dep);
//    config.resolve.alias[dep.split(path.sep)[0]] = depPath;
//    config.module.noParse.push(depPath);
//});

module.exports = config;