var goodsList=localStorage.getItem("goods_id").split("&");
var oCartmei=document.querySelector("#cartmei");
// 容器
var oTable=document.querySelector(".table");
var carTab=document.querySelector(".carTab");
var oShoppList=document.querySelector("#shoppingcarList");
var temCar=document.querySelector(".cartGoods").innerHTML;
var oMain=document.querySelector("#main");
(function(){
    if(!goodsList){
        return;
    }
    oCartmei.style.display="none";
    oShoppList.style.display="block";
    //保存表头结构
    var th=`
    <tr class="lineFirst">
    <th  class="txtL" width="110">
        <input type="checkbox" id="allBtn">
        <span>全选</span>
    </th>
    <th width="300">良品</th>
    <th width="120">数量</th>
    <th width="160">单价（元）</th>
    <th width="160">小计（元）</th>
    <th>操作</th>
    </tr>
    `;
    oTable.innerHTML=th;
    //商品结构
    var tr="";

    //每个商品发起请求
    for(var i=0;i<goodsList.length;i++){
        $.ajax({
            type:"get",
            url:"http://www.wjian.top/shop/api_goods.php",
            dataType:"json",
            data:{'goods_id':goodsList[i]},
            success:function(result){
                if(result.code!=0){console.log("数据错误");return;}
                var obj=result.data[0];
                //组装数据
                var comple=_.template(temCar);
                tr=comple(obj);
                oTable.innerHTML+=tr;
                oMain.onclick=function(event){
                    var event=event||window.event;
                    //减法
                    if(event.target.className=="reduceOpt"){
                        //拿到商品数量
                        var num=event.target.nextElementSibling;
                        var numValue=num.value;
                        //拿到单价和小计
                        var unitPrice=event.target.parentNode.nextElementSibling;
                        var subtotal=event.target.parentNode.nextElementSibling.nextElementSibling;
                        

                        //每单击一次数量减一
                        numValue--
                        //数量最少为1
                        numValue=numValue<1?1:numValue;
                        num.value=numValue;
                        //计算小计
                        subtotal.innerHTML=unitPrice.innerHTML*numValue;
                    }
                    if(event.target.className=="addOpt"){
                        var num = event.target.previousElementSibling;
                        var numValue=num.value;
                        var unitPrice=event.target.parentNode.nextElementSibling;
                        var subtotal=event.target.parentNode.nextElementSibling.nextElementSibling;

                        numValue++;
                        //数量最多为20件
                        numValue=numValue>20?20:numValue;
                        num.value=numValue;
                        //计算小计
                        subtotal.innerHTML=unitPrice.innerHTML*numValue;
                        allPrice()
                    }

                    //全选
                    if(event.target.id=="allBtn"){
                        // 判断全选按钮是否已勾选
                        var checks=event.target.checked?true:false;
                        var checksAll=document.querySelectorAll(".chkbox")
                        console.log(checksAll);
                        if(checks==true){
                            for(i=0;i<goodsList.length;i++){
                                checksAll[i].checked=checks;
                                if(checks){
                                    //可以给所有选中的去设置个标记
                                    checksAll[i].setAttribute('mark', 'active');  
                                  }else{
                                    //去掉标记
                                    checksAll[i].setAttribute('mark', '');  
                                  };     
                            }
                            
                        }else{
                            for(i=0;i<goodsList.length;i++){
                                checksAll[i].checked=checks;}
                        }
                    }

                //点击单个选择
                    if(event.target.className == 'chkbox'){
                    //点击单个根据情况设置标记
                        if(event.target.checked){
                            event.target.setAttribute('mark', 'active');
                        }else{
                            event.target.setAttribute('mark', '');
                        };
                        //调用求总价方法
                        allPrice();
                    };
   
                    //删除操作
                    if(event.target.className=="blueOpt"){
                        var goodsId = event.target.getAttribute("data_goods");
                       var tag = event.target.parentNode.parentNode;
                       //找到父节点的孩子节点并删除
                       tag.parentNode.removeChild(tag);
                       //获取本地存储的goods_id
                       var localData=localStorage.getItem("goods_id");
                        //转换为数组
                       var aa=localData.split("&");
                       for(var i=0;i<aa.length;i++){
                           //删除相同goodsId
                            if(goodsId==aa[i]){
                                aa.splice(i,1);
                            }
                       }
                       var bb=aa.join("&");
                       localStorage.setItem("goods_id",bb);
                       var a = window.localStorage.getItem("goods_id");
                       if(a == null || a == ""){
                           localStorage.removeItem("goods_id");
                           oCartmei.style.display="block";
                           carTab.style.display="none";
                            console.log("jk");
                       }
                    }            
            }
        }
        })
    }
})()
    
    //计算总价
    function allPrice(){
        
        var aCheckActive = document.querySelectorAll('[mark="active"]');
        //求和
        var sum = 0;
        for(var i = 0; i < aCheckActive.length; i++){
            var oSubtotals = aCheckActive[i].parentNode.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
            sum += parseFloat(oSubtotals.innerHTML);
        };
        //渲染
        var total=document.querySelector("#show_price");
        total.innerHTML = sum + '.00';
        
    }


