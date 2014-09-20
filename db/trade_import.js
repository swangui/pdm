fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pdm.db');

var data = fs.readFileSync('json/trades.json').toString();
    data = JSON.parse(data);

var tb = fs.readFileSync('trade_schema.js').toString();

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
      })
    })
  });
}

trade_import(data.trades.trade);
db.close();
