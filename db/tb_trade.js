var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pdm.db');

var tb = 'seller_nick,iid,pic_path,payment,snapshot_url,snapshot,seller_rate,post_fee,buyer_alipay_no,receiver_name,receiver_state,receiver_address,receiver_zip,receiver_mobile,receiver_phone,consign_time,seller_alipay_no,seller_mobile,seller_phone,seller_name,seller_email,available_confirm_fee,received_payment,timeout_action_time,is_3D,orders,promotion,promotion_details,tid,num,num_iid,status,title,type,price,seller_cod_fee,discount_fee,point_fee,has_post_fee,total_fee,is_lgtype,is_brand_sale,is_force_wlb,lg_aging,lg_aging_type,created,pay_time,modified,end_time,buyer_message,alipay_id,alipay_no,alipay_url,buyer_memo,buyer_flag,seller_memo,seller_flag,invoice_name,invoice_type,buyer_nick,buyer_area,buyer_email,has_yfx,yfx_fee,yfx_id,yfx_type,has_buyer_message,area_id,credit_card_fee,nut_feature,step_trade_status,step_paid_fee,mark_desc,eticket_ext,send_time,shipping_type,buyer_cod_fee,express_agency_fee,adjust_fee,buyer_obtain_point_fee,cod_fee,trade_from,alipay_warn_msg,cod_status,can_rate,service_orders,commission_fee,trade_memo,buyer_rate,trade_source,seller_can_rate,is_part_consign,is_daixiao,real_point_fee,receiver_city,receiver_district,arrive_interval,arrive_cut_time,consign_interval,async_modified,service_tags,o2o,o2o_guide_id,o2o_shop_id,o2o_guide_name,o2o_shop_name,o2o_delivery,zero_purchase,alipay_point,pcc_af,o2o_out_trade_id,is_wt';

db.serialize(function() {
  var tbs = tb.split(',').map(function(t){return t + ' text'}).join(',');
  var sql = 'create table trade ('+tbs+');';
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

