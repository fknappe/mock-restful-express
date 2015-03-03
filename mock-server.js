var express = require('express'),
    http = require('http'),
    path = require('path'),
    DynamicRoutes = require('dynamic-routes'),
    app = express();

global.__base = __dirname + '/';    
 
app.set('port', process.env.PORT || 3000);

// Authenticator
app.use(express.basicAuth('services', '123456'));
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
 
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
 
DynamicRoutes(app, {
    src: __dirname + '/routes/',
    ignore: [],
    pattern: /\.js$/
});
 
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
 