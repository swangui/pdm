/*
 * GET home page.
 */

var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/var/www/ffuwww/taobao/db/pdm.db');
var trade_fields = fs.readFileSync('/var/www/ffuwww/taobao/db/trade_schema.js').toString();
var item_fields = fs.readFileSync('/var/www/ffuwww/taobao/db/item_schema.js').toString();

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
    var data = req.param('data');

    var item_import = function(data){
      var row = data.item;
      db.parallelize(function() {
        var num_iid = row.num_iid;
        console.log(num_iid)
        db.each('select count(num_iid) from item where num_iid = "'+num_iid+'";', function(err, result){
          if(result['count(num_iid)'] == 0){
            var values = item_fields.split(',').map(function(f){
              if(typeof row[f] == 'object'){
                return '"NOT_COMPATIBLE"';
              }else if(f == 'wireless_desc' || f == 'wap_desc' || f == 'desc'){
                return '"NOT_COMPATIBLE"';
              }else{
                return '"'+row[f]+'"';
              }
            }).join(',');
            var sql = 'insert into item values('+values+');';
            db.run(sql);
            console.log(sql);
          }
        })
      });
    }
    item_import(data);
// Shall return the count of duplicated
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({status:'completed'}));
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
              var values = trade_fields.split(',').map(function(f){
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
    var items = {};
    db.each('select num_iid,count(num_iid) as value from tb_order group by num_iid;',
      function(err, result){
        results.push(result);
      },
      function(){
        db.each('select title, num_iid from item;',
          function(err, row){
            items[row.num_iid] = row.title;
          }, 
          function(){
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({results:results, items:items}));
            res.end();
          }
        )
      }
    )
  })
};
