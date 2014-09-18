var pdm = angular.module('pdm', [])

.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{%').endSymbol('%}');
    }
)

.controller('HomeCtrl', function($scope) {
  $scope.hello = 'hello world';
  $scope.conf = conf;
  $scope.conf.app_loginurl = $scope.conf.app_loginurl.replace(/&amp;/g,'&');
  var item_fields = 'cid,seller_cids,props,input_pids,input_str,pic_url,num,list_time,delist_time,stuff_status,location,price,post_fee,express_fee,ems_fee,has_discount,freight_payer,has_invoice,has_warranty,has_showcase,modified,increment,approve_status,postage_id,product_id,item_imgs,prop_imgs,is_virtual,is_taobao,is_ex,is_timing,videos,is_3D,score,one_station,second_kill,violation,is_prepay,ww_status,wap_desc,wap_detail_url,cod_postage_id,sell_promise,detail_url,num_iid,title,nick,type,desc,skus,props_name,created,promoted_service,is_lightning_consignment,is_fenxiao,auction_point,property_alias,template_id,after_sale_id,is_xinpin,sub_stock,inner_shop_auction_template_id,outer_shop_auction_template_id,food_security,features,locality_life,desc_module_info,item_weight,item_size,with_hold_quantity,change_prop,delivery_time,paimai_info,sell_point,valid_thru,outer_id,auto_fill,desc_modules,custom_made_type_id,wireless_desc,is_offline,barcode,is_cspu,newprepay,sub_title,video_id,mpic_video,sold_quantity,second_result,global_stock_type,global_stock_country';
  var sku_fields = 'sku_id,iid,num_iid,properties,quantity,price,created,modified,status,properties_name,sku_spec_id,with_hold_quantity,sku_delivery_time,change_prop,outer_id,barcode';

  $scope.import_item_by_id = function(){
    var item_id = $('#item-id').val();
    use('taobao.item.get',
        {num_iid: item_id},
        item_fields,
        function(res){
          console.log(res);
          console.log('item actual field length', Object.keys(res.item).length);
          console.log('item expected field length', item_fields.split(',').length);
        });

    use('taobao.item.skus.get',
        {num_iids: item_id},
        sku_fields,
        function(res){
          console.log(res);
          console.log('sku actual field length', Object.keys(res.skus.sku[0]).length);
          console.log('sku expected field length', sku_fields.split(',').length);
        });
  }
})
