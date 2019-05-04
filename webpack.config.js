const path = require("path");

module.exports = (env, argv) => ({
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: `index.${argv.mode}.js`,
    path: path.resolve(__dirname, "dist"),
    library: "PanZoom",
    libraryTarget: "umd"
  }
});
