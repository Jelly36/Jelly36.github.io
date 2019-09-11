
//定义全局路径
var urlHttp="http://www.wjian.top/shop/";
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

//拿到goods_id
var goodsId=getUrlVal('goods_id');
var oProduct=document.querySelector(".goodsImg");
var oDetail_tem=document.querySelector("#detail_template").innerHTML;
//请求单个商品
(function(){
    $.ajax({
        type:"get",
        url:urlHttp + "api_goods.php",
        data:{'goods_id':goodsId},
        dataType:'json',
        success:function(result){
            // console.log(result);
         if(result.code!=0){return;}
         var obj=result.data[0];
         var str='';
         var comple=_.template(oDetail_tem);
         str=comple(obj);
         oProduct.innerHTML=str;
         if(oProduct.innerHTML!=null){
             var oBox=document.querySelector("#bigImg");
             var oBig=oBox.querySelectorAll(".bigImg");
             var oLittle=document.querySelectorAll(".littleImg")
             for(var i=0;i<oBig.length;i++){
                 oBig[i].style.backgroundImage="url("+obj.goods_thumb+")";
                 oLittle[i].style.backgroundImage="url("+obj.goods_thumb+")";
             }
         }

         var oAddCart=document.querySelector(".addCar");
         oAddCart.onclick=function(){
             addCart("a");
         }
         var oBuyNow=document.querySelector("#buyNow");
         oBuyNow.onclick=function(){
             addCart("b");
             
         }
         //轮播图
        var oPrev=document.querySelector("#prev");
        var oNext=document.querySelector("#next");
        var aLiImg=document.querySelectorAll(".littleImg");
        var aBigImg=document.querySelectorAll(".bigImg");
        var oBigHeader=document.querySelector("#bigImg");
        var oCf=document.querySelector(".cf");
        var n=0;
        var k=0;
        //每个li的宽度
        var liWidth=aBigImg[1].offsetWidth;
        //元素个数
        var liCount=aBigImg.length;
        oNext.onclick=function(){
            //小图黑框的切换
            n++;//1
            if(n>liCount-1){n=0;}
            if(aBigImg[1].lock){return;}
            aBigImg[1].lock=true;
            var j = 1;
            for(var i=0;i<aLiImg.length;i++){
                aLiImg[i].className = "littleImg item"+(j++);
            }
            aLiImg[n].className="check_black littleImg item"+(n+1);
            moving(oBigHeader,{"left":-n*liWidth},300);
            aBigImg[1].lock=false;
        }
        oPrev.onclick=function(){
            n--;
            if(n<0){n=liCount-1};
            if(aBigImg[1].lock){return;}
            aBigImg[1].lock=true;
            var j=1;
            for(var i=0;i<aLiImg.length;i++){
                aLiImg[i].className = "littleImg item"+(j++);
            }
            aLiImg[n].className="check_black littleImg item"+(n+1);
            moving(oBigHeader,{"left":-n*liWidth},300);
            aBigImg[1].lock=false;
        }
        // 单击小图显示大图
        for(var i=0;i<aLiImg.length;i++){
            aLiImg[i].index=i;
            aLiImg[i].onclick=function(){
                n=this.index;
                for(var i=0;i<aLiImg.length;i++){
                    aLiImg[i].className="littleImg item"+(i+1);
                }
                aLiImg[n].className="check_black littleImg item"+(n+1);
                moving(oBigHeader,{"left":-n*liWidth},300);
            }
        }
     
        }
    });
  })();





  //如果要进入购物车，先查看用户是否登录
var oCart=document.querySelector(".cart-wrapper");
var oToken=localStorage.getItem("token");
var oBuyNow=document.querySelector("#buyNow");

//加入购物车
function addCart(data){
        if(!localStorage.getItem("token")){
            alert("请先登录");
            window.location.href="login.html?goods_id="+goodsId;
        }
        else{
            //如果API没问题  请求这个接口  加入购物车成功
            //现在API有问题,自己模拟下   把当前对应的这个商品的goods_id 存在本地存储里面
            var beforeGoods = localStorage.getItem('goods_id');
            if(!beforeGoods){
              localStorage.setItem('goods_id',goodsId);
              //判断是“加入购物车”还是“马上购买”
              if(data == 'a'){
                alert('加车成功');               
              }else{
                //跳到购物车
                alert('加车成功，点击购物车结算');
                window.location.href = 'cart.html';
              };
            }else{
                var beforeArr=beforeGoods.split("&");
                for(var i=0;i<beforeArr.length;i++){
                    if(beforeArr[i]==goodsId){
                        alert("此商品已加入购物车，请查看购物车");
                        return;
                    }
                }
                //没有重复商品就加入到本地存储
                localStorage.setItem("goods_id",beforeGoods+"&"+goodsId);
                if(data=="a"){
                    alert("加车成功");
                }else{
                    alert("加车成功，点击购物车结算");
                    window.location.href="cart.html";
                }
            }
          };         
    }


//获得地址栏参数值
function getUrlVal(property){
    //地址栏
    var urlStr = window.location.search.substring(1);
    var re = new RegExp('(^|&)'+ property +'=([^&]*)(&|$)');
    var result = urlStr.match(re);
    if(result == null){return null};
    return result[2];
  };
  

