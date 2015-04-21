var deployTool = {},
    extend = require('util')._extend,
    constants = {},
    sshTool = require('./ssh-tool.js');

// constants
var COMPARE_MODE = 'checksum';

module.exports = function ( gulp ) {
    var that = Object.create(deployTool);
    that.gulp = gulp;
    return that;
};

deployTool.sshTool = sshTool;

deployTool.options = {};

deployTool.environments = function ( options ) {
    var that = this;

    if ( options && options.default ) {
        that.options = extend(that.options, options.default);
        delete options.default;
    }
    that.options.compareMode = COMPARE_MODE;

    that.environments = options.environments;

    _defineCurrentEnvironment.call(that);

    require('./gulp-tasks.js')(that);

    return that;
};

function _defineCurrentEnvironment() {
    var that = this,
        list = process.argv[2].split(':'),
        env = (list.length > 0) ? list[0] : '';

    if ( that.environments[env] ) {
        that.env = env;
        that.current = that.environments[env];
    }
}

function _extendCallback( func ) {
    var that = this;
    return function ( cb ) {
        that.cb = cb;
        func(cb);
    };
};

deployTool.ssh = function ( options ) {
    var that = this;

    options = extend({
        host: that.current.host.split('@')[1],
        user: that.current.host.split('@')[0],
        agent: process.env.SSH_AUTH_SOCK,
        agentForward: true
    }, options);

    return sshTool().connect( options, that.cb );
};

deployTool.task = function () {
    var that = this;
    arguments[0] = that.env + ':' + arguments[0];
    if ( typeof arguments[1] === 'function' ) {
        arguments[1] = _extendCallback.call(that, arguments[1]);
    } else {
        arguments[2] = _extendCallback.call(that, arguments[2]);
    }
    that.gulp.task.apply(that.gulp, arguments);
};
