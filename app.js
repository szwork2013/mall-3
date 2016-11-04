var express = require('express');
var path = require('path');
var fs = require('fs');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var bodyParser = require('body-parser');

var app = express();

var Conf = require('./api/util/conf');

var route = require('./api/routes/route');
var common = require('./api/routes/common');
var user = require('./api/routes/user');
var index = require('./api/routes/index');
var goods = require('./api/routes/goods');
var cart = require('./api/routes/cart');
var order = require('./api/routes/order');
var address = require('./api/routes/address');
var area = require('./api/routes/area');

app.set('port', process.env.PORT || 3300);

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'html');


app.use(favicon(__dirname + '/favicon.ico'));
//app.use(logger('dev'));
app.use(methodOverride());

app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'moon',   //cookie的name，默认cookie的name是：connect.sid
    cookie: {
        maxAge: 20 * 60 * 1000
    },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'statics')));

//app.use(route);

app.use('/', function (req, res, next) {
    if(!req.url.startsWith('/api/') && !req.url.startsWith('/css/') && !req.url.startsWith('/fonts/') && !req.url.startsWith('/images/') && !req.url.startsWith('/public/')) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(fs.readFileSync('index.html'));
    } else {
        next();
    }
});

app.use(Conf.API_PATH, common);
app.use(Conf.API_PATH, user);
app.use(Conf.API_PATH, index);
app.use(Conf.API_PATH, goods);
app.use(Conf.API_PATH, cart);
app.use(Conf.API_PATH, order);
app.use(Conf.API_PATH, address);
app.use(Conf.API_PATH, area);

app.listen(app.get('port'), function(){
console.log("listing port is: localhost:" + app.get("port"));
});
