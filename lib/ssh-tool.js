var ssh = require('simple-ssh'),
    extend = require('util')._extend,
    dconsole = require('./console-tool.js'),
    sshTool = {};

module.exports = function () {
    var that = Object.create(sshTool);
    return that;
};

function _open( options ) {
    var that = this;

    // Create the connection
    that.ssh = new ssh(options);
};

function _close(cb) {
    var that = this;
    that.end();
    cb();
};

sshTool.connect = function (options, cb) {
    var that = this;

    _open.call(that, options);

    that.ssh.on('end', function(err) {
        _close.call(that, cb);
    });

    that.ssh.on('error', function(err) {
        dconsole.error('Oops, something went wrong.');
        dconsole.error(err);
        _close.call(that, cb);
    });

    return that;
};

sshTool.exec = function (command, options) {
    var that = this;

    options = extend({
        out: function ( msg ) {
            dconsole.log(msg);
        },
        err: function ( msg ) {
            dconsole.error(msg);
            that.end();
        }
    }, options);

    that.ssh.exec(command, options);

    return that;
};

sshTool.start = function () {
    var that = this;

    that.ssh.start();

    return that;
};

sshTool.end = function () {
    var that = this;

    that.ssh.end();

    return that;
};