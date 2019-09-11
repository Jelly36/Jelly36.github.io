
// 轮播图
   
  function lunbo(){
    var oLunbo=document.getElementById("lunbo");
    var aLi=oLunbo.getElementsByTagName("li");
    var oBox=document.getElementById("L_box");
    var oPre=document.getElementById("pre");
    var oNext=document.getElementById("next");
    var oPt=document.getElementById("actionOpt")
    var aSquare=oPt.getElementsByTagName("a");
   
 
    
    var n=0;//信号量
  
    var imgW=aLi[0].offsetWidth;//li的单个宽度值
    
    var liCount=aLi.length;
    oLunbo.style.width=imgW*liCount;
    
    oNext.onclick=rightBtn;
    oPre.onclick=leftBtn;
    // console.log(rightBtn);
    
    

    var targetJson=[];

    //获取Json里面的值
    for(var i=0;i<aLi.length;i++){
        targetJson.push({
            'left':fetchComputedStyle(aLi[i],"left")
        })
       
    }   
    //在数组的前面插入一个元素
    targetJson.unshift({
        'left':-1000
    })
   
    var temp=0;
    //右边按钮
    function rightBtn(){
        n++;
        if(n>2) {n=0;}
        if(aLi[2].lock){return;}
        for(var i=0;i<aLi.length;i++){
            
            moving(aLi[i],targetJson[i],600,function(){
                temp++;

                if(temp==3){
                    temp=0;
                    for(var k in targetJson[0]){
                        aLi[0].style[k]=targetJson[3][k]+"px";
                    }
                    
                    oLunbo.appendChild(aLi[0]);
                }
            });
           
        }
        square();
        
    }

    //左边按钮
    function leftBtn(){
        n--;
        if(n<0){n=2;}
        if(aLi[2].lock){return}

        for(var k in targetJson[3]){
            aLi[2].style[k]=targetJson[0][k]+"px";
        }
        oLunbo.insertBefore(oLunbo.lastElementChild,aLi[0])

        for(var i=0;i<aLi.length;i++){
            moving(aLi[i],targetJson[i+1],600);
        }
        
        square();
    }

    

    //灰色小矩型跟随图片
    function square(){
        for(var i=0;i<aSquare.length;i++){
        aSquare[i].className="";
        }

        aSquare[n].className="checkedV1";
    }

    var timer;
    //自动播放
    autoPlay();
    function autoPlay(){
        timer=setInterval(rightBtn,5000);
    }

    //图片移入移出显示按钮
    oBox.onmouseover=function(){
        oPre.style.opacity=1;
        oNext.style.opacity=1;
        clearInterval(timer);
        }
    oBox.onmouseout=function(){
            oPre.style.opacity=0;
            oNext.style.opacity=0;
            autoPlay();
       }
   
  }
//定义全局路径
var urlHttp="http://www.wjian.top/shop/";
//请求广告位
var oLunbo=document.getElementById("lunbo");
(function(){
    $.ajax({
        type:'get',
        url:urlHttp+'api_position.php',
        dataType:'json',
        success:function(result){
            if(result.code!=0){console.log("数据错误！");return;}
            var positionId=result.data[0].position_id;
            //去请求当前广告位的数据
            $.ajax({
                type:'get',
                url:urlHttp+"api_ad.php",
                data:{'position_id':positionId},
                dataType:'json',
                success:function(result){
                    if(result.code!=0){return;}
                    var obj=result.data;
                    var str='';
                    for(var i=0;i<3;i++){
                        str+='<li class="item'+(i+1)+'"><a href="#"><img src="../images/public/loading.jpg" lazyLoadSrc="'+obj[i].url+'"></a></li>';
                    }
                    oLunbo.innerHTML=str;
                    //调用插件
                    $('[lazyLoadSrc]').YdxLazyLoad();
                    lunbo();
                }
                
            })
        }
    })
})()

//请求商品

//拿到商品的容器
var oShoplist=document.querySelector(".shopList");
//拿到模板容器
var oBox_goods=document.querySelector("#box_goods").innerHTML;
//更多按钮
var oMore=document.querySelector(".more");
//ajax发起请求
(function(){
    $.ajax({
        type:'get',
        url:urlHttp+"api_goods.php",
        data:{'page':1,'pagesize':9},
        dataType:'json',
        success:function(result){
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
            //图片加载完后显示“更多”
            oMore.style.display="block";
        }
    })
})()
var page=1;
//点击more加载更多
(function(){
    oMore.onclick=function(){
        page++;
        //请求数据
        $.ajax({
            type:'get',
            url:urlHttp+"api_goods.php",
            data:{'page':page,'pagesize':9},
            dataType:'json',
            success:function(result){
                console.log(result);
                if(result.code!=0){return;}
                var obj=result.data;
                var comple=_.template(oBox_goods);
                var str="";
                for(var i=0;i<obj.length;i++){
                    str+=comple(obj[i]);
                }
                //添加到DOM树上
                oShoplist.innerHTML+=str;
                //绑定0和3的倍数的div特别类名
                if(oShoplist.innerHTML!=''){
                    var oDiv=oShoplist.querySelectorAll(".item");
                   
                    for(var i=0;i<obj.length*page;i++){
                        if((i!=1&&i==0)||(i!=1&&i%3==0)){
                            oDiv[i].className="item first";
                        }
                    }
                }
                
                //调用预加载
                $('[lazyLoadSrc]').YdxLazyLoad();
            }
        })
    }
    

})()

//请求商品分类数据
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

    var oSearch = document.querySelector('.keyword');
    var oSearchBtn = document.querySelector('.search_icon');
//点击搜索按钮
(function(){
    
    
    //点击按钮，拿到用户输入的文本数据，带着这个文本数据跳转
    oSearchBtn.onclick = function(){
        console.log("dgdg");
      var oSearchText = oSearch.value;
      //验证
      if(oSearchText == ''){
        return;
      };
      //跳转
      window.location.href = 'classify.html?search=' + oSearchText;
    };
  })();
    



 

