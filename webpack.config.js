const path = require('path');

const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {

    const build_dir = 'build';
    const static_dir = "static";

    const isDevelopment = process.env.NODE_ENV !== 'production';
    const envfile = isDevelopment ? '.env': '.env.pro'
    const configfile = path.join(__dirname, envfile);
    const d_env = dotenv.config({ path: configfile }).parsed;

    return {
        watchOptions: {
            ignored: /node_modules/
        },
        mode: isDevelopment ? 'development' : 'production',
        devtool:  isDevelopment ? 'inline-source-map' : false,
        entry: './src/index.js',
        output: {
            path: path.join(__dirname, build_dir),
            filename: static_dir + '/js/main-[contenthash].js',
            publicPath: "/",
        },
        module: {
            rules: [
                {
                    test: /\.js[x]?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                            ],
                            plugins: [
                                '@babel/plugin-syntax-jsx',
                                isDevelopment && require.resolve('react-refresh/babel'),
                            ].filter(Boolean),
                        }
                    }
                },
                {
                    test: /\.css/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        },
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            watchContentBase: true,
            // open: true,
            hot: true,
            host: '0.0.0.0',
            port: 3000,
            // before(app, server, compiler) {
            //     // console.log('before')
            // }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': JSON.stringify(d_env),
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                inject: 'body',
                // hash: true,
            }),
            isDevelopment && new ReactRefreshWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: static_dir + '/css/main-[contenthash].css'
            }),
        ].filter(Boolean),
        optimization: {
            minimizer: [
               `...`,
                new CssMinimizerPlugin(),
            ],
        },

    }

};