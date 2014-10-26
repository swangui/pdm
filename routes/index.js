/*
 * GET home page.
 */

var url = require("url");
var csv = require("fast-csv");
var price_ladder = [];
csv
 .fromPath("sku-set.csv")
 .on("data", function(data){
     price_ladder.push(data);
 })
 .on("end", function(){
     console.log("price ladder loaded");
 });

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


    res.render('index', {
        app_loginurl:config.ContainerUrl(''),
        app_key:config.AppKey,
        app_secret:config.AppSecret,
        sign:SignInfo.sign,
        timestamp:SignInfo.timestamp,
        params: params,
        price_ladder: JSON.stringify(price_ladder)
    })


};
