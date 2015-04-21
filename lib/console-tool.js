var chalk = require('chalk');

module.exports = {
    log: function () {
        for (var i = 0, len = arguments.length; i < len; i++) {
            console.log(chalk.green(arguments[i]));
        }
    },
    error: function () {
        for (var i = 0, len = arguments.length; i < len; i++) {
            console.error(chalk.red(arguments[i]));
        }
    }
};