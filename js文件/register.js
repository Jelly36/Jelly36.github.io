//input框中的账号
var userName=document.querySelector(".regInpt");
var oPass=document.querySelector("#passW");

//input框后的提示
var oTipNum=document.querySelector(".tipsNum");
var oTipPas=document.querySelector(".tipsPas");
var oTipRes=document.querySelector(".tipsRes");
//注册按钮
var oRigBtn=document.querySelector(".regBtn");

//确认密码框
var oRes=document.querySelector("#reassure");

//同意条例
var agree=document.querySelector("#vertPos");

var userValue="";
var passValue="";
var resValue="";
var userOK;
var pasOK;
var resOK;
var agrOK;
(function(){
    userName.onkeyup=function(){
        userValue=userName.value;
        var re=/^\w{3,20}$/g;
        if(!re.test(userValue)){
            oTipNum.innerHTML="用户名不可用";
            oTipNum.style.color="red";
            oTipNum.style.display="block";
            registerGo();
        }else{
            oTipNum.innerHTML="用户名可用";
            oTipNum.style.color="yellowgreen";
            oTipNum.style.display="block";
            userOK=true;
            registerGo();
        }

        
        
    }
    
    oPass.onkeyup=function(){
        passValue=oPass.value;
        // 最小长度为6位,最长20
        var re=/^\w{6,20}$/g;
        if(!re.test(passValue)||passValue==""){
            oTipPas.innerHTML="密码不可用";
            oTipPas.style.color="red";
            oTipPas.style.display="block";
        //     pasOK=false;
        //     registerGo();
        }else{
            oTipPas.innerHTML="密码可用";
            oTipPas.style.color="yellowgreen";
            oTipPas.style.display="block";
            pasOK=true;
            registerGo();
        }
    }
    oRes.onkeyup=function(){
        resValue=oRes.value;
        if(resValue==passValue){
            oTipRes.innerHTML="正确";
            oTipRes.style.color="yellowgreen";
            resOK=true;
            registerGo();
        }else{
            oTipRes.innerHTML="两次输入的密码不同";
            oTipRes.style.color="red";
            // resOK=false;
            // registerGo();
        }
    }

    agree.onclick=function(){
        if(agree.checked==true){
            // console.log("已选");
            agrOK=true;
            registerGo();
        }
        else{
            agrOK=false;
            registerGo();
        }
    }
    
})()

// console.log(userOK,pasOK,resOK);
// 注册按钮可用与禁用
function registerGo(){
    console.log(userOK,pasOK,resOK,agrOK);
    if(userOK&&pasOK&&resOK&&agrOK){
        oRigBtn.disabled=false;
        console.log(oRigBtn.disabled);
    }else{
        oRigBtn.disabled=true;
        console.log(oRigBtn.disabled);
    }
}

oRigBtn.onclick=function(){
    console.log("nihao");
    //发送注册请求
    $.ajax({
        type:"post",
        url:"http://www.wjian.top/shop/api_user.php",
        dataType:"json",
        data:{'status':'register', 'username':userValue, 'password':passValue},
        success:function(result){
            console.log(result);
            if(result.code!=0){
                oTipNum.innerHTML="用户名已存在";
                oTipNum.style.color="red";
                oTipNum.style.display="block";
                return;
            }
            alert("恭喜您注册成功，点击确定跳转登录");
            window.location="login.html";
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
