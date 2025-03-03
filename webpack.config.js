const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

// Check if directories and files exist
const hasOptionsDir = fs.existsSync(path.resolve(__dirname, 'src/options'));
const hasPublicDir = fs.existsSync(path.resolve(__dirname, 'public'));

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  // Define entry points (exclude options if it doesn't exist)
  const entry = {
    popup: './src/popup/index.tsx',
    content: './src/content/index.tsx',
    background: './src/background/index.ts',
    welcome: './src/welcome/index.tsx',
  };
  
  // Only add options entry if the directory exists
  if (hasOptionsDir) {
    entry.options = './src/options/index.tsx';
  }
  
  // Define HTML plugins
  const htmlPlugins = [
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
      scriptLoading: 'defer',
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      template: './src/welcome/welcome.html',
      filename: 'welcome.html',
      chunks: ['welcome'],
      scriptLoading: 'defer',
      inject: 'body',
    })
  ];
  
  // Add options HTML plugin if directory exists
  if (hasOptionsDir) {
    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: './src/options/options.html',
        filename: 'options.html',
        chunks: ['options'],
        scriptLoading: 'defer',
        inject: 'body',
      })
    );
  }
  
  // Define copy patterns
  const copyPatterns = [
    { from: './src/manifest.json', to: '.' }
  ];
  
  // Add public directory copy if it exists
  if (hasPublicDir) {
    copyPatterns.push({ from: './public', to: '.' });
  }
  
  // Copy content.css directly
  copyPatterns.push({ 
    from: './src/content/content.css', 
    to: './content.css' 
  });
  
  // Check if src/assets exists and add it to copy patterns if it does
  if (fs.existsSync(path.resolve(__dirname, 'src/assets'))) {
    copyPatterns.push({ from: './src/assets', to: 'assets' });
  }
  
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    entry: entry,
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
        // CSS handling for global styles
        {
          test: /\.css$/,
          exclude: /content\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
        // Special handling for content.css
        {
          test: /content\.css$/,
          use: [
            'css-loader'
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
        cleanStaleWebpackAssets: false, // Keep copied assets
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      // Add HTML plugins
      ...htmlPlugins,
      // Copy static files
      new CopyWebpackPlugin({
        patterns: copyPatterns,
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