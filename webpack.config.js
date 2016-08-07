// Existing Code ....
module.exports = {
  entry: './dist/client/main.js',
  output: {
    path: './dist/client',
    filename: 'main.js',

  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.(otf|eot|svg|ttf|woff|woff2)$/, loader: 'url-loader?limit=8192'}
    ]
  },
  externals:{
  },
}
