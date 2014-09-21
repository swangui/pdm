fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pdm.db');


var tb = fs.readFileSync('order_schema.js').toString();

  db.run("BEGIN TRANSACTION");
var order_import = function(){
  db.serialize(function() {
    db.each('select orders from trade;', function(err, row){
      var orders = JSON.parse(row.orders).order;
      //console.log(orders);
      orders.forEach(function(order){
        var values = tb.split(',').map(function(f){
          return '"'+order[f]+'"';
        }).join(',');
        var oid = order.oid;
        db.serialize(function() {
          db.each('select count(oid) from tb_order where oid = "'+oid+'";', function(err, result){
            if(result && result['count(oid)'] == 0){
              var sql = 'insert into tb_order values('+values+');';
              db.run(sql);
            }
          });
          console.log(oid);
        });
      })
    })
  });
}

order_import();

  db.run("END");
