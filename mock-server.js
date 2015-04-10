#!/usr/bin/env node

var express = require('express'),
    http = require('http'),
    path = require('path'),
    DynamicRoutes = require('dynamic-routes'),
    app = express(),
    pkginfo = require('pkginfo')(module, 'version');
    program = require('commander');

// Command Line menu
program
    .version(module.exports.version)
    .usage('[options]')
    .option('-U, --user [username]', 'Port to execute the server (default: services)')
    .option('-P, --pass [password]', 'Port to execute the server (default: 123456)')
    .option('-p, --port [number]', 'Port to execute the server (default: 8880)')
    .option('-m, --mocksSourcePath [path]', 'Path to mocks')
    .option('-r, --routesSourcePath [path]', 'Path to routes')
    .parse(process.argv);

global.__base = __dirname + '/';
global.__mocksPath = program.mocksSourcePath || process.cwd();
global.__routesPath = program.routesSourcePath || process.cwd(); 

app.set('port', program.port || 8880);

// Authenticator
app.use(express.basicAuth(program.user || 'services', program.pass || '123456'));
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.cookieParser('secrets secrets, we got extra'));

// Cookie setup
app.use(express.cookieSession({
    secret: 'obobo',
}));

app.use(app.router);

app.use(function (req, res, next) {
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.set("Cache-Control", "no-cache, must-revalidate");
    res.set("Expires", "Sat, 26 Jul 1997 05:00:00 GMT");
    next();
});

// Error Handler
app.use(function(err, req, res, next) {
    console.error('ERROR: %s', err);
    res.status(err.status || 500);
    res.send(err.message);
});
  
DynamicRoutes(app, {
    src: global.__routesPath + '/routes/',
    ignore: [],
    pattern: /\.js$/
});
 
http.createServer(app).listen(app.get('port'), function(){
    console.log('Mock server listening on port ' + app.get('port'));
}); 