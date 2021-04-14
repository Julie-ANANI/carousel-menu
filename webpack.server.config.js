const path = require('path');
const {ContextReplacementPlugin} = require('webpack');

module.exports = {
  entry: { server: './server.ts' },
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node',
  mode: 'production',
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  },
  // TODO: remove the optimization block once minimize work with angular-cli 6+
  optimization: {
    minimize: false
  },
  plugins: [
    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for 'WARNING Critical dependency: the request of a dependency is an expression'
    new ContextReplacementPlugin(
      /(.+)?angular([\\/])core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new ContextReplacementPlugin(
      /(.+)?express([\\/])(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )
  ]
};
