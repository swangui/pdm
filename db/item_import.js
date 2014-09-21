fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pdm.db');

var data = fs.readFileSync('json/item.json').toString();
    data = JSON.parse(data);

var tb = fs.readFileSync('item_schema.js').toString();

var item_import = function(data){
  var row = data.item;
  db.parallelize(function() {
    var num_iid = row.num_iid;
    console.log(num_iid)
    db.each('select count(num_iid) from item where num_iid = "'+num_iid+'";', function(err, result){
      if(result['count(num_iid)'] == 0){
        var values = tb.split(',').map(function(f){
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
db.close();
