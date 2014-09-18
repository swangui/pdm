var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pdm.db');

var tb = 'item_meal_name,pic_path,seller_nick,buyer_nick,refund_status,outer_iid,snapshot_url,snapshot,timeout_action_time,buyer_rate,seller_rate,seller_type,cid,oid,status,iid,title,price,num_iid,item_meal_id,sku_id,num,outer_sku_id,order_from,total_fee,payment,discount_fee,adjust_fee,modified,sku_properties_name,refund_id,is_oversold,is_service_order,end_time,consign_time,shipping_type,bind_oid,logistics_company,invoice_no,is_daixiao,divide_order_fee,part_mjz_discount,ticket_outer_id,ticket_expdate_key,store_code,is_www';

db.serialize(function() {
  var tbs = tb.split(',').map(function(t){return t + ' text'}).join(',');
  var sql = 'create table tb_order ('+tbs+');';
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
