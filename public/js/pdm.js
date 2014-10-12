var pdm = angular.module('pdm', [])

.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
})

.controller('HomeCtrl', function($scope, $http) {
  $scope.init_predict = function(){
    $scope.predict = {
      blacklist: [],
      data: {items:{}, results:[]},
      chartType: 'popularity', //or demand
      viewType: 'bubble', //or grid
      isIdOn: false, //or true
      filteringMode: 'blacklist' //or whitelist
    };

/*
 * fix is needed for table head
 *
    $(window).scroll(function(){
      if($('body').scrollTop() >= 318){
        $('.fixed-header').width($('.data-body').width()).show();
      }else{
        $('.fixed-header').hide();
      }
    });
*/


    $('.filter-toggler').click(function(){
      var toggler = $(this);
      var panel = toggler.next();
      if(panel.is(':visible')==true){
        panel.hide();
        toggler.find('.fa').removeClass('fa-caret-down').addClass('fa-caret-right');
      }else{
        panel.show();
        toggler.find('.fa').removeClass('fa-caret-right').addClass('fa-caret-down');
      }
    });

    $scope.op_mode = 'drilldown';
    $scope.set_op_mode = function(mode){
      if(mode=='blacklist'){
        $('.f-blacklist').next().hide().prev().trigger('click').effect('highlight', {color: '#428BCA'}, 500);
      }
      $scope.op_mode = mode;
      console.log('operating mode', $scope.op_mode);
    }
    console.log('init op_mode', $scope.op_mode);

    $.get('/get_blacklist', function(res){
      console.log('blacklist', res.blacklist);
      $scope.predict.blacklist = res.blacklist;
      $scope.$apply();
      $scope.gen_sales_bubble();
    })
  }


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

  /* graph settings */
  var width = 900,
      height = 800,
      margin_left = -70,
      margin_top = -50,
      format = d3.format(",d"),
      color = d3.scale.category20c();

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

  $scope.set_chart_type = function(chartType){
    $scope.predict.chartType = chartType;
    if($scope.predict.viewType == 'bubble'){
      if($scope.predict.chartType=='popularity'){
        $scope.predict.data.results.map(function(el){ el.value = el.popularity; return el; })
      }else if($scope.predict.chartType=='demand'){
        $scope.predict.data.results.map(function(el){ el.value = el.demand; return el; })
      }
      if($('svg').size()>0){
        $scope.trans_bubble();
      }else{
        $scope.gen_sales_bubble();
      }
    }
  }

  $scope.selectSku = function(){
    var circle = $(this);
    num_iid = circle.attr('num_iid');
    if($scope.op_mode == 'blacklist'){
      var url = 'blacklist_insert';
      $.post(url, {data:[num_iid]});
      $scope.predict.blacklist.push(num_iid);
      circle.remove();
      var updated = $.grep($scope.predict.data.results, function(d){ return d.num_iid!=num_iid });
      $scope.predict.data.results = updated;
      $scope.$apply();
      $scope.trans_bubble();
    }
  };

  $scope.trans_bubble = function(){
      var bubble = $scope.bubble;
      var svg = $scope.svg;
      var classes = $scope.classes;
      var node = svg.selectAll(".node")
          .data(bubble.nodes(classes($scope.predict.data.results))
          .filter(function(d) { return !d.children; }))
          .transition()
            .attr("transform", function(d) {
               return "translate(" + (d.x + margin_left) + "," + (d.y + margin_top) + ")"; })
          .select("circle")
          .transition()
            .attr("r", function(d) { return d.r; });

          svg.selectAll(".node").select("text")
            .text(function(d) { 
              var title = d.title;
              //return title;
              return title.substring(0, d.r / 3);
            });
            
  }

  $scope.gen_sales_bubble = function(){
    $("[data-toggle='tooltip']").tooltip();

    console.log('generating bubble')
    $("#bubble-body").html('');
    
    var bubble = d3.layout.pack()
        .sort(null)
        .size([width, height])
        .padding(3);
    $scope.bubble = bubble;
    
    var svg = d3.select("#bubble-body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bubble");
    $scope.svg = svg;

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
            .attr("num_iid", function(d){return d.num_iid})
            .attr("title", function(d){return d.title})
            .attr("transform", function(d) {
               return "translate(" + (d.x + margin_left) + "," + (d.y + margin_top) + ")"; })
            .on("click", $scope.selectSku)
            .on("mouseover", function(){
              d3.select(this).selectAll("circle")
                .style("stroke", "#428BCA")
            })
            .on("mouseout", function(){
              d3.select(this).selectAll("circle")
                .style("stroke", "#ccc")
            });

      node.append("circle")
          .attr("r", function(d) { return d.r; })
          .style("stroke", "#ccc")
          .style("stroke-width", 2)
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
    $scope.classes = classes;

    if($scope.predict.data.results.length > 0 || $scope.predict.data.items.length > 0){
        generate_bubble($scope.predict.data);
    }else{
      d3.json('/sales_stats', function(error, root) {
        root = $scope.kickout_blacklist(root);
        $scope.predict.data = root;
        generate_bubble(root);
        $scope.$apply();
      });
    }

  }

  $scope.kickout_blacklist = function(data){
    console.log('before kickout', data);
    data.results = $.grep(data.results, function(el){
      return $scope.predict.blacklist.indexOf(el.num_iid)<0;
    });
    console.log('after kickout', data);
    return data;
  };

  $scope.init_chart = function(container, num_iid){
    console.log('init-ing chart');
    
    var canvas = container.html('')
                 .append('<div class="canvas"></div>')
                 .find('.canvas');
    
    var url = '/get_sales';
    $.get(url, {num_iid:num_iid}).success(function(res){
      console.log('get_sales', res);
      var ymd = [];
      var demand = [];
      var popularity = [];
      res.sales.map(function(s){
        var y = parseInt(s.ym.replace(/\d{2}$/,''));
        var m = parseInt(s.ym.replace(/^\d{4}/,''));
        var ymdate = new Date(y, m-1, 1);
        s.ym = ymdate;
        ymd.push(ymdate);
        demand.push(s.demand);
        popularity.push(s.popularity);
      })
      var dx_min = d3.min(ymd);
          dx_min = new Date(dx_min.getFullYear(), dx_min.getMonth()-1, 14);
      var dx_max = new Date();
          dx_max = new Date(dx_max.getFullYear(), dx_max.getMonth()+6, 1);
      console.log(dx_min, dx_max, dx_max);
      var domainX = [dx_min, dx_max];

      var dyDemand_max = d3.max(demand)*3;
      var domainYDemand = [0, dyDemand_max];

      var dyPopularity_max = d3.max(popularity)*3;
      var domainYPopularity = [0, dyPopularity_max];
      $scope.line_chart(canvas.get(0), domainX, domainYDemand, domainYPopularity, res.sales);
    });

  }

  $scope.toggle_chart = function($event, num_iid){
    var handler = $($event.target).parents('tr')
    var sibling = handler.next();
    if(sibling.is(':visible')==true){
      sibling.hide();
    }else if(sibling.is(':visible')==false){
      sibling.show();
    };
    if(sibling.find('div').size()==0){
      setTimeout(function(){
        $scope.init_chart(sibling.find('td:first'), num_iid);
      }, 200)
    }
  }

  $scope.line_chart = function(canvas, domainX, domainYDemand, domainYPopularity, data){
    var margin = {top: 20, right: 30, bottom: 30, left: 30},
        width = 550 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;
    
    var x = d3.time.scale().range([0, width]);
    var yDemand = d3.scale.linear().range([height, 0]);
    var yPopularity = d3.scale.linear().range([height, 0]);
    
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(12).tickSize(10,10);
    
    var yAxisDemand = d3.svg.axis().scale(yDemand)
        .orient("left").ticks(5);

    var yAxisPopularity = d3.svg.axis().scale(yPopularity)
        .orient("right").ticks(5);

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.ym); })
        .y(function(d) { return yDemand(d.demand); });

    var svg = d3.select(canvas)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        x.domain(domainX);
        yDemand.domain(domainYDemand);
        yPopularity.domain(domainYPopularity);
    
        svg.append("g")         // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    
        svg.append("g")         // Add the Y Axis
            .attr("class", "y axis")
            .call(yAxisDemand);

        svg.append("g")         // Add the Y Axis
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + " ,0)")
            .call(yAxisPopularity);

        var bar_width = (width-margin.left-margin.right)/(data.length+6)*0.9;
        console.log(bar_width);
        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
              .style("fill", "MediumTurquoise")
              .attr("x", function(d) { return x(d.ym) - (bar_width/2) })
              .attr("width", bar_width)
              .attr("y", function(d) { return yPopularity(d.popularity); })
              .attr("height", function(d) { return height - yPopularity(d.popularity); });

        svg.append("path")      // Add the valueline path.
        .attr("d", valueline(data));

        svg.append("text")
            .attr("y",0-margin.top)
            .attr("x",0)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Demand");

        svg.append("text")
            .attr("y",0-margin.top)
            .attr("x",width)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Popularity");
  }







})
