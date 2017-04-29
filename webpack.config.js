module.exports = {
  entry: './build/examples/App.js',
  output: {
		filename: './build/bundle.js',
	},
	externals: {
		"react": "React",
		"react-dom": "ReactDOM",
    "katex": "katex"
	}
};
