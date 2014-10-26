var fs = require('fs');
var md5 = require('MD5');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/var/www/ffuwww/taobao/db/survey.db');
var survey_fields = 'id,shopname,contactperson,tel,email,province,city,district,scope,shop,boughtfromus,majorsource,monthlyquota,currentbrands,created';

db.run("BEGIN TRANSACTION");




exports.receive = function(req, res){
    var data = req.param('data');
    var insert = [];
    var id = md5(JSON.stringify(data));
    survey_fields.split(',').forEach(function(f){
      if(f == 'id'){
        insert.push(id);
      }else if(f == 'created'){
        insert.push(Date.now());
      }else{
        insert.push(data[f]||null);
      }
    });
    insert = insert.map(function(f){return '"'+f+'"'}).join(',');
    var sql = 'insert into survey values('+insert+');';
    db.run(sql);

    res.writeHead(200, {
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*' });
    res.write(JSON.stringify({status:'survey received', coupon:id}));
    res.end();
};

exports.lookup = function(req, res){
    var data = req.param('data');

    db.serialize(function() {
      var survey = {};
      db.each('select * from survey where id = "'+data+'";',
        function(err, result){
          survey = result;
        },
        function(){
          res.writeHead(200, {
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*' });
          res.write(JSON.stringify(survey));
          res.end();
        }
      )
    })

}



db.run("END");
