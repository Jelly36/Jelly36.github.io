//定义全局路径
var urlHttp="http://www.wjian.top/shop/";
//拿到cat_id的值
var catId=getUrlVal('cat_id');

//定义商品总页数
var pageMax=20;
var nowPage=1;

//请求商品

//拿到商品的容器
var oShoplist=document.querySelector(".shopList");
//拿到模板容器
var oBox_goods=document.querySelector("#box_goods").innerHTML;
// //ajax发起请求
function getGlassfiy(page){
    $.ajax({
        type:'get',
        url:urlHttp+"api_goods.php",
        data:{'page':page,'pagesize':9,'cat_id':catId},
        dataType:'json',
        success:function(result){
            if(result.code==1){oShoplist.innerHTML="上新中...";return;}
            if(result.code!=0){return;}
            var obj=result.data;
            //用模板插件编译
            var strOK='';
            var comple=_.template(oBox_goods);
            for(var i=0;i<obj.length;i++){
                strOK +=comple(obj[i]);
            }
            //把创建的节点添加到容器中
            oShoplist.innerHTML=strOK;
            if(oShoplist.innerHTML!=''){
                var oDiv=oShoplist.querySelectorAll(".item");
               
                for(var i=0;i<obj.length;i++){
                    if((i!=1&&i==0)||(i!=1&&i%3==0)){
                        oDiv[i].className="item first";
                    }
                    
                }
            }
            //调用图片预加载
            $('[lazyLoadSrc]').YdxLazyLoad();

        }
    })

}
    
    getGlassfiy(nowPage)

//调用分页器
function pageNav(){
    //调用分页
    $('#pager').pagination({
      pageCount : pageMax,//总页数
      current : 1,//当前默认页
      prevContent : '上一页',
      nextContent : '下一页',
      mode : 'fixed',
      count : 5, //单纯的页码数，不包上下页按钮和本本身
      isHide : true,
      keepShowPN : true,
      jump : true,
      callback:function(api){
        nowPage = api.getCurrent();
        //点击5就要去请求第5页数据
        getGlassfiy(nowPage);     
      }
    });
  };
  pageNav();



//在商店中请求商品分类数据
var oHideStore=document.querySelector('.hideStore');
(function(){
    $.ajax({
        type:'get',
        url:urlHttp+"api_cat.php",
        dataType:'json',
        success:function(result) {
            if(result.code!=0){return;}
            var obj=result.data;
            var str="";
            for(var i=0;i<obj.length;i++){
                str+='<a href="classify.html?cat_id='+obj[i].cat_id+'">'+obj[i].cat_name+'</a>';
            }
            oHideStore.innerHTML=str;
        }
    })
})()

//获得地址栏参数值
function getUrlVal(property){
    //地址栏
    var urlStr = window.location.search.substring(1);
    var re = new RegExp('(^|&)'+ property +'=([^&]*)(&|$)');
    var result = urlStr.match(re);
    if(result == null){return null};
    return result[2];
  };


//如果要进入购物车，先查看用户是否登录
var oCart=document.querySelector(".cart-wrapper");
var oToken=localStorage.getItem("token");
    oCart.onclick=function(){
        if(!oToken){
            oCart.href="login.html";
            alert("请先登录");
        }
    }



 