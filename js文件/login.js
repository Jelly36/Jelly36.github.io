// 账号输入框
var oNum=document.querySelector("#num");
//密码输入框
var oPas=document.querySelector("#pass");
//登录按钮
var loginBtn=document.querySelector(".login_bu");
//提示
var oTipsNum=document.querySelector(".tipsNum");
var oTipsPa=document.querySelector(".tipsPass");



loginBtn.onclick=function(){
    //发起登录请求
    $.ajax({
        type:"post",
        url:"http://www.wjian.top/shop/api_user.php",
        data:{'status':'login','username':oNum.value,'password':oPas.value},
        dataType:"json",
        success:function(result){
            console.log(result);
            if(result.code==2002){
                oTipsNum.style.display="block";
                return;
            }
            if(result.code==1001){
                oTipsPa.style.display="block";
                return
            }
            if(result.code==0){
                //登录成功之后把信息存储到本地
                localStorage.setItem("username",result.data.username);
                localStorage.setItem("token",result.data.token);
                //登录成功跳到首页
                var goodsId=getUrlVal("goods_id");
                if(goodsId){
                    window.location.href="酒时浪的酒详情.html?goods_id="+goodsId;
                }else{
                    window.location.href="index.html";
                }
            }
        }
    })
}



function getUrlVal(property){
    //地址栏
    var urlStr = window.location.search.substring(1);
    var re = new RegExp('(^|&)'+ property +'=([^&]*)(&|$)');
    var result = urlStr.match(re);
    if(result == null){return null};
    return result[2];
  };