var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pdm.db');

var tb = 'cid,seller_cids,props,input_pids,input_str,pic_url,num,list_time,delist_time,stuff_status,location,price,post_fee,express_fee,ems_fee,has_discount,freight_payer,has_invoice,has_warranty,has_showcase,modified,increment,approve_status,postage_id,product_id,item_imgs,prop_imgs,is_virtual,is_taobao,is_ex,is_timing,videos,is_3D,one_station,second_kill,violation,wap_desc,wap_detail_url,cod_postage_id,sell_promise,detail_url,num_iid,title,nick,type,desc,skus,props_name,created,is_lightning_consignment,is_fenxiao,auction_point,property_alias,template_id,after_sale_id,is_xinpin,sub_stock,inner_shop_auction_template_id,outer_shop_auction_template_id,food_security,features,locality_life,desc_module_info,item_weight,item_size,with_hold_quantity,paimai_info,sell_point,valid_thru,outer_id,auto_fill,custom_made_type_id,wireless_desc,barcode,video_id,mpic_video,global_stock_type,global_stock_country';

db.serialize(function() {
  var tbs = tb.split(',').map(function(t){return t + ' text'}).join(',');
  var sql = 'create table item ('+tbs+');';
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

