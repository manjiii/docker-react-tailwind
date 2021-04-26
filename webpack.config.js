const path = require('path');

const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyFilePlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {

    const build_dir = 'build';
    const static_dir = "static";
    const dev_envfile = '.env';
    const pro_envfile = '.env.pro';

    const isDevelopment = process.env.NODE_ENV !== 'production';

    const dev_configfile = path.join(__dirname, dev_envfile);
    const app_env = dotenv.config({ path: dev_configfile }).parsed;

    // overwrite pro setting if is not development
    if (!isDevelopment) {

        const pro_configfile = path.join(__dirname, pro_envfile);
        const pro_env = dotenv.config({ path: pro_configfile }).parsed;
        Object.assign(app_env, pro_env);
    }

    return {
        watchOptions: {
            ignored: /node_modules/
        },
        mode: isDevelopment ? 'development' : 'production',
        devtool: isDevelopment ? 'inline-source-map' : false,
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
                'process.env': JSON.stringify(app_env),
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                inject: 'body',
                // hash: true,
            }),
            new InterpolateHtmlPlugin(app_env),
            isDevelopment && new ReactRefreshWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: static_dir + '/css/main-[contenthash].css'
            }),
            new CopyFilePlugin({
                patterns: [
                    {
                        context: "public",
                        from: "**/*",
                        to: path.resolve(__dirname, build_dir),
                        globOptions: {
                            dot: true,
                            gitignore: true,
                            ignore: ["**/index.html"],
                        },
                    }
                ]}
            ),
        ].filter(Boolean),
        optimization: {
            minimizer: [
                `...`,
                new CssMinimizerPlugin(),
            ],
        },

    }

};