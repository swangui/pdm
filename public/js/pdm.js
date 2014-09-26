var pdm = angular.module('pdm', [])

.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
})

.controller('HomeCtrl', function($scope, $http) {
  $(window).scroll(function(){
    if($('body').scrollTop() >= 318){
      $('.fixed-header').width($('.data-body').width()).show();
    }else{
      $('.fixed-header').hide();
    }
  })

  $http.get('/get_items').success(function(res){
    $scope.items = res.items;
    console.log('get_items', res);
    var page_size = 20;
    var sync_batches = [];
    var temp_batch = [];
    res.items.forEach(function(el, index){
      if(index%page_size==0 && index>0){
        sync_batches.push(temp_batch);
        temp_batch = [];
      }
      temp_batch.push(el);
      if(index==res.items.length-1){
        sync_batches.push(temp_batch);
        temp_batch = [];
      }
    })
    $scope.sync_batches = sync_batches;
  })

  $scope.hello = 'hello world';
  $scope.conf = conf;
  $scope.conf.app_loginurl = $scope.conf.app_loginurl.replace(/&amp;/g,'&');
  var item_fields = 'cid,seller_cids,props,input_pids,input_str,pic_url,num,list_time,delist_time,stuff_status,location,price,post_fee,express_fee,ems_fee,has_discount,freight_payer,has_invoice,has_warranty,has_showcase,modified,increment,approve_status,postage_id,product_id,item_imgs,prop_imgs,is_virtual,is_taobao,is_ex,is_timing,videos,is_3D,score,one_station,second_kill,violation,is_prepay,ww_status,wap_desc,wap_detail_url,cod_postage_id,sell_promise,detail_url,num_iid,title,nick,type,desc,skus,props_name,created,promoted_service,is_lightning_consignment,is_fenxiao,auction_point,property_alias,template_id,after_sale_id,is_xinpin,sub_stock,inner_shop_auction_template_id,outer_shop_auction_template_id,food_security,features,locality_life,desc_module_info,item_weight,item_size,with_hold_quantity,change_prop,delivery_time,paimai_info,sell_point,valid_thru,outer_id,auto_fill,desc_modules,custom_made_type_id,wireless_desc,is_offline,barcode,is_cspu,newprepay,sub_title,video_id,mpic_video,sold_quantity,second_result,global_stock_type,global_stock_country';
  var sku_fields = 'sku_id,iid,num_iid,properties,quantity,price,created,modified,status,properties_name,sku_spec_id,with_hold_quantity,sku_delivery_time,change_prop,outer_id,barcode';
  var trade_fields = 'seller_nick,iid,pic_path,payment,snapshot_url,snapshot,seller_rate,post_fee,buyer_alipay_no,receiver_name,receiver_state,receiver_address,receiver_zip,receiver_mobile,receiver_phone,consign_time,seller_alipay_no,seller_mobile,seller_phone,seller_name,seller_email,available_confirm_fee,received_payment,timeout_action_time,is_3D,orders,promotion,promotion_details,tid,num,num_iid,status,title,type,price,seller_cod_fee,discount_fee,point_fee,has_post_fee,total_fee,is_lgtype,is_brand_sale,is_force_wlb,lg_aging,lg_aging_type,created,pay_time,modified,end_time,buyer_message,alipay_id,alipay_no,alipay_url,buyer_memo,buyer_flag,seller_memo,seller_flag,invoice_name,invoice_type,buyer_nick,buyer_area,buyer_email,has_yfx,yfx_fee,yfx_id,yfx_type,has_buyer_message,area_id,credit_card_fee,nut_feature,step_trade_status,step_paid_fee,mark_desc,eticket_ext,send_time,shipping_type,buyer_cod_fee,express_agency_fee,adjust_fee,buyer_obtain_point_fee,cod_fee,trade_from,alipay_warn_msg,cod_status,can_rate,service_orders,commission_fee,trade_memo,buyer_rate,trade_source,seller_can_rate,is_part_consign,is_daixiao,real_point_fee,receiver_city,receiver_district,arrive_interval,arrive_cut_time,consign_interval,async_modified,service_tags,o2o,o2o_guide_id,o2o_shop_id,o2o_guide_name,o2o_shop_name,o2o_delivery,zero_purchase,alipay_point,pcc_af,o2o_out_trade_id,is_wt';
  var item, skus;

  $scope.import_items = function(batch_no){
    var num_iids = $scope.sync_batches[batch_no].map(function(el){return el.num_iid}).join(',');
    use('taobao.items.list.get', {
        num_iids: num_iids
        },
        item_fields,
        function(res){
          console.log(res);
          console.log(JSON.stringify(res));
          item = res;
          var url = '/item_insert';
          $.post(url, {data:item})
        })
  }

  $scope.import_item_by_id = function(){
    var item_id = $('#item-id').val();
    use('taobao.item.get',
        {num_iid: item_id},
        item_fields,
        function(res){
          console.log(res);
          console.log(JSON.stringify(res));
          console.log('item actual field length', Object.keys(res.item).length);
          console.log('item expected field length', item_fields.split(',').length);
          item = res;
          var url = '/item_insert';
          $.post(url, {data:item})
        });
    /*
    use('taobao.item.skus.get',
        {num_iids: item_id},
        sku_fields,
        function(res){
          console.log(res);
          console.log(JSON.stringify(res));
          console.log('sku actual field length', Object.keys(res.skus.sku[0]).length);
          console.log('sku expected field length', sku_fields.split(',').length);
          skus = res.skus.sku;
        });
    */

  };

  $scope.import_trades = function(page_no){
    use('taobao.trades.sold.get',{
           start_created: '2014-01-01 00:00:00',
           status: 'TRADE_FINISHED',
           page_size: '100',
           page_no: page_no
        },
        trade_fields,
        function(res){
          console.log(res)
          var url = '/trade_insert';
          $.post(url, {data:res.trades.trade})
        })
  };

  $scope.predict = {
    data: {items:{}, results:[]},
    chartType: 'popularity', //or demand
    viewType: 'bubble', //or grid
    isIdOn: false, //or true
    filteringMode: 'blacklist' //or whitelist
  };

  $scope.setChartType = function(chartType){
    $scope.predict.chartType = chartType;
    if($scope.predict.viewType == 'bubble'){
      $scope.gen_sales_bubble();
    }
  }

  $scope.gen_sales_bubble = function(){
    $("[data-toggle='tooltip']").tooltip();

    console.log('generating bubble')
    $("#bubble-body").html('');
    var width = 900,
        height = 800,
        margin_left = -80,
        margin_top = -50,
        format = d3.format(",d"),
        color = d3.scale.category20c();
    
    var bubble = d3.layout.pack()
        .sort(null)
        .size([width, height])
        .padding(1);
    
    var svg = d3.select("#bubble-body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bubble")

    var generate_bubble = function(root){
      if($scope.predict.chartType=='popularity'){
        root.results.map(function(el){ el.value = el.popularity; return el; })
      }else if($scope.predict.chartType=='demand'){
        root.results.map(function(el){ el.value = el.demand; return el; })
      }
      var dict = root.items;
      root.results.map(function(el){
        var title = dict[el.num_iid] || el.num_iid;
        if(!/^\d+$/.test(title)){
          title = title.replace(/^([a-zA-Z0-9]+).*/, '$1');
        };
        el.title = title;
        return el;
      });
      var node = svg.selectAll(".node")
          .data(bubble.nodes(classes(root.results))
          .filter(function(d) { return !d.children; }))
          .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
               return "translate(" + (d.x + margin_left) + "," + (d.y + margin_top) + ")"; });

      node.append("circle")
          .attr("r", function(d) { return d.r; })
          .style("fill", function(d) { return "#ccc"; });
          //.style("fill", function(d) { return color(d.num_iid); });
    
      node.append("text")
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) { 
            var title = d.title;
            //return title;
            return title.substring(0, d.r / 3);
          });
          //.text(function(d) { return d.num_iid.substring(0, d.r / 3); });
    }

    var classes = function(root) {
      var classes = root;
    
      return {children: classes};
    }

    if($scope.predict.data.results.length > 0 || $scope.predict.data.items.length > 0){
        generate_bubble($scope.predict.data);
    }else{
      d3.json('/sales_stats', function(error, root) {
        generate_bubble(root);
        $scope.predict.data = root;
        $scope.$apply();
      });
    }
  }









})
