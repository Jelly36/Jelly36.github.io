//   登录之后显示用户名和头像
//拿到token从本地存储中
var token=localStorage.getItem("token");
var username=localStorage.getItem("username");



var oLogBtn=document.querySelector(".logBtn");
var oRegBtn=document.querySelector(".regBtn");
var oUser=document.querySelector(".user-display");

//退出按钮
var exit=document.querySelector(".back");
// 模板
var oUserTem=document.querySelector("#userTem").innerHTML;
//容器 
var oBox=document.querySelector(".user");
var userinfo=document.querySelector(".user");
// 验证是否登录
if(token){
    oLogBtn.style.display="none";
    oRegBtn.style.display="none";
    oUser.style.display="block";
    var str="";
    var comple=_.template(oUserTem);
    var str=comple(username);
    oBox.innerHTML=str;
}
// 退出
exit.onclick=function(){
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("goods_id");;
}
