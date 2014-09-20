/*
 * GET home page.
 */

var url = require("url");

var config = require("../appconfig").Config,
    appkey = config.AppKey,
    appsecret = config.AppSecret,

    SignTaobao = require("../util/sign").SignTaobao;
exports.index = function (req, res) {
    var params = url.parse(req.url, true).query;

    var SignInfo= SignTaobao(appkey,appsecret);
     res.cookie("timestamp",SignInfo.timestamp);
     res.cookie("sign",SignInfo.sign);

//     res.render('index', { title: 'Express','AppKey':config.AppKey });


    res.render('pdm', {
        app_loginurl:config.ContainerUrl('pdm'),
        app_key:config.AppKey,
        app_secret:config.AppSecret,
        sign:SignInfo.sign,
        timestamp:SignInfo.timestamp,
        params: params
    })


};

exports.item_insert = function (req, res) {
    var params = req.param('data');

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('hello json' + JSON.stringify(params));
    res.end();
};
