const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    entry: {
      popup: './src/popup/index.tsx',
      options: './src/options/index.tsx',
      content: './src/content/index.tsx',
      background: './src/background/index.ts',
      welcome: './src/welcome/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        // TypeScript and JSX handling
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },
        // CSS handling
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        // Asset handling
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: true,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      // Generate HTML files
      new HtmlWebpackPlugin({
        template: './src/popup/popup.html',
        filename: 'popup.html',
        chunks: ['popup'],
      }),
      new HtmlWebpackPlugin({
        template: './src/options/options.html',
        filename: 'options.html',
        chunks: ['options'],
      }),
      new HtmlWebpackPlugin({
        template: './src/welcome/welcome.html',
        filename: 'welcome.html',
        chunks: ['welcome'],
      }),
      // Copy static files
      new CopyWebpackPlugin({
        patterns: [
          { from: './public', to: '.' },
          { from: './src/manifest.json', to: '.' },
          { from: './src/assets', to: 'assets', noErrorOnMissing: true },
        ],
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendor',
      },
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };
};