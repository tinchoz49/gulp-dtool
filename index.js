var deployTool = require('./lib/deploy-tool.js')

module.exports = function ( gulp ) {
    return deployTool(gulp);
};