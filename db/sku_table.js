var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pdm.db');

var tb = 'sku_id,iid,num_iid,properties,quantity,price,created,modified,status,properties_name,sku_spec_id,with_hold_quantity,sku_delivery_time,change_prop,outer_id,barcode';

db.serialize(function() {
  var tbs = tb.split(',').map(function(t){return t + ' text'}).join(',');
  var sql = 'create table sku ('+tbs+');';
  console.log(sql);
  db.run(sql);

/*
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
*/
});

db.close();

