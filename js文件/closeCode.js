closeRight();
function closeRight(){
    var oRight=document.querySelector(".qrCodeimg")
    var oClose=document.querySelector(".closeBtn");
    oClose.onclick=function(){
        oRight.style.display="none";
    }
}
//鼠标可以拖动右边的二维码
var oQr=document.querySelector(".qrCodeimg");
(function(){
    oQr.onmousedown=function(event){
        var event=Event||window.event;
        console.log(event);
    }
})()