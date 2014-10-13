/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path');

routes.pdm = require('./routes/pdm');

var app = express();


// all environments

app.engine('hbs', require('hbs').__express);
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

console.log(routes);
app.get('/', routes.index);
app.get('/pdm', routes.pdm.index);
app.post('/item_insert', routes.pdm.item_insert);
app.post('/trade_insert', routes.pdm.trade_insert);
app.post('/blacklist_insert', routes.pdm.blacklist_insert);
app.post('/blacklist_delete', routes.pdm.blacklist_delete);
app.get('/sales_stats', routes.pdm.sales_stats);
app.get('/get_items', routes.pdm.get_items);
app.get('/get_sales', routes.pdm.get_sales);
app.get('/get_blacklist', routes.pdm.get_blacklist);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
