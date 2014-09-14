/**
 *
 * @type {Object}
 */
exports.Config={
    /**
     * IsSandBox 1=沙箱开启 0=非沙箱(正式环境)
     */
    SanBox:0,
    /**
     * AppKey
     */
    AppKey:"23017402",
    /**
     * AppSecret
     */
    AppSecret:"557376c615b0b57133891989e028f781",

    ContainerUrl:function(feature){
       if(this.SanBox===0)
           return "http://container.open.taobao.com/container?redirect_uri=http://flower-from.us:3002/"+feature+"&appkey="+this.AppKey;
        else if(this.SanBox===1)
           return "http://container.api.tbsandbox.com/container?appkey="+this.AppKey ;
        else
           return "https://oauth.taobao.com/authorize?response_type=code&redirect_uri=http://flower-from.us:3002/"+feature+"&client_id="+this.AppKey ;
    },
    /**
     * 请求环境URL ，默认为沙箱环境地址
     * @return {*}
     * @constructor
     */
     RestUrl:function(){
         if(this.SanBox===0)
             return "http://gw.api.taobao.com/router/rest";
         else
             return "http://gw.api.tbsandbox.com/router/rest";
     }



};
