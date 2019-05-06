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
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader", // creates style nodes from JS strings
					"css-loader", // translates CSS into CommonJS
					"sass-loader" // compiles Sass to CSS, using Node Sass by default
				]
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
