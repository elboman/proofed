var path = require('path');
var webpack = require('webpack');

const webpackProduction = {
  entry: {
    "react-proofed": ['./code/index.ts'],
    "react-proofed.min": ['./code/index.ts'] 
  },
  output: {
    path: path.resolve(__dirname, '_bundles'),
    filename: '[name].js',
    libraryTarget: "umd",
    library: "react-proofed",
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx']
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      include: /\.min\.js$/,
    })
  ],
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
}

const webpackDevelopment = {
  entry: ['./example/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader?tsconfig=./tsconfig.example.json",
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = process.env.NODE_ENV == 'production'
  ? webpackProduction
  : webpackDevelopment;