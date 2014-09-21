/*
 * GET home page.
 */

var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/var/www/ffuwww/taobao/db/pdm.db');
var tb = fs.readFileSync('/var/www/ffuwww/taobao/db/trade_schema.js').toString();

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

exports.trade_insert = function (req, res) {
    var data = req.param('data');
    var trade_import = function(data){
      db.parallelize(function() {
        data.forEach(function(row, index){
          var tid = row.tid;
          //console.log(index, tid)
          db.each('select count(tid) from trade where tid = "'+tid+'";', function(err, result){
            //console.log(tid, index, result['count(tid)'])
            if(result['count(tid)'] == 0){
              var values = tb.split(',').map(function(f){
                if(f == 'orders'){
                  return "'"+JSON.stringify(row[f])+"'";
                }else{
                  return '"'+row[f]+'"';
                }
              }).join(',');
              var sql = 'insert into trade values('+values+');';
              db.run(sql);
              //console.log(sql);
            }
          });
        });
      });
    };
    trade_import(data);
// Shall return the count of duplicated
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({status:'completed'}));
    res.end();
};

exports.sales_stats = function (req, res) {
  db.serialize(function() {
    var results = [];
    db.each('select num_iid,count(num_iid) as value from tb_order group by num_iid;',
      function(err, result){
        results.push(result);
      },
      function(){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(results));
        res.end();
      }
    )
  })
};
