module.exports = {
    plugins: [
        'plugins/markdown',
    ],
    opts: {
        template: "node_modules/clean-jsdoc-theme",
        recurse: true,
        destination: "docs",
        readme: './README.md',
    },
};
