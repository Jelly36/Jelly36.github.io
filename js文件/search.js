
    //出现搜索框
    var oInput=document.querySelector(".search_input_wrap")
    var oSearch=document.querySelector('#seaBtn');
    var oSearch_btn=document.querySelector('.search_icon');
    var oHide_input=document.querySelector('.search_input');
    var oKeyWord=document.querySelector(".keyword");
    //第一个定时器
    var timer1=null;
    //第二个定时器
    var timer2=null;
    //步长
    var step=0;
    var left_b=fetchComputedStyle(oHide_input,"left");
    var signal=false;
    oSearch_btn.addEventListener("click",search);

    function search(){
        timer1=setInterval(function(){
            if(signal==true){return;}
            // signal=true;
            oHide_input.style.display='block';
            step+=3;
            left_b-=3
            oHide_input.style.width=step+"px";
            oHide_input.style.left=left_b+"px";
            
            if(step>260&&left_b<=0)
            {   
                clearInterval(timer1);
                oHide_input.style.width=260+"px";
                oHide_input.style.left=6+"px";
                //如果input里面有关键字单击就不能收回
                
                // oSearch_btn.onclick=function(){
                    
                //     timer2=setInterval(function(){
                        
                //         step-=3;
                //         left_b+=3;
                //         oHide_input.style.width=step+"px";
                //         oHide_input.style.left=left_b+"px";
                //         if(step<=0&&left_b>=266){
                //             clearInterval(timer2);
                //             // signal=false;
                //             oHide_input.style.width=0+"px";
                //             oHide_input.style.left=266+"px";
                            
                            
                //         }
                //     },6)
                // }




            }
        },5)
        
       

    
    }


    //定义全局路径
var urlHttp="http://www.wjian.top/shop/";

//拿search的值
var searchV = decodeURI(getUrlVal('search'));

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
        data:{'page':page,'pagesize':9,'search_text':searchV},
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



//获得地址栏参数值
function getUrlVal(property){
    //地址栏
    var urlStr = window.location.search.substring(1);
    var re = new RegExp('(^|&)'+ property +'=([^&]*)(&|$)');
    var result = urlStr.match(re);
    if(result == null){return null};
    return result[2];
  };


