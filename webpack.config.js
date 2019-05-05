const path = require("path");

module.exports = (env, argv) => ({
  entry: "./src/index.ts",
  devtool: argv.mode === "development" ? "inline-source-map" : "none",
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
    filename: `pannzoom${argv.mode === "development" ? "" : ".min"}.js`,
    path: path.resolve(__dirname, "dist"),
    library: "PanZoom",
    libraryTarget: "umd"
  }
});
