const path = require('path');

module.exports = {
  entry: './src/main.ts', // Entry point of your application
  mode: 'production',    // 'development' or 'production' for optimized output
  target: 'node',         // For Node.js environment
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        // exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src') // Adjust the path as needed
    },
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
