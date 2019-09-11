/*
 * 作者：wj
 * 版本：1.0.1
 * 日期：2019-04-28
 * 联系：3228798988@qq.com
 * 
 * 功能：
 *    1,动画方法：调用animate(对象, {目标点}, 时间, ‘缓冲名’, 回调函数)
 *                缓冲和回调用函数为可选参数
 *    2,计算后样式处理：fetchComputedStyle(对象, 样式属性);
 *    3,缓冲公式对象   Tween
 * */


//封装
function animate(obj, targetJSON, times, tweenString, callBack){
  //验证这些参数
  //如果只传三个参数：第一个必须为对象  第二个对象  第三个number
  if(arguments.length < 3 || typeof arguments[0] != 'object' || typeof arguments[1] != 'object' || typeof arguments[2] != 'number'){
    //console.log(1111);
    //逆向思维
    //告诉用户
    throw new Error('必须传三个参数，第一个为对象，第二个为对象，第三个为number');
  }else if(arguments.length == 3){
    tweenString = 'linear';
    callBack = null;
  }else if(arguments.length == 4){

    //那么第四个参数有两种可能性：缓冲  函数
    switch(typeof arguments[3]){
      case 'string':
        //下面运行还是得有5个参数， 没有要补上
        callBack = null;
        //tweenString = arguments[3];
        break;
      case 'function':
      //console.log(typeof arguments[3])
      
        //tweenString = 'linear';
        callBack = arguments[3];
        arguments[3] = 'linear';
        break;
      default:
        throw new Error('第四个参数要么是缓冲名要么为回调函数');        
    };
    
  };
  
  //开一个锁,上锁
  obj.lock = true;
  //时间间隔  兼容！！！
  var interval = window.navigator.userAgent.indexOf('MSIE') == -1 ? 5 : 50;
  
  //初始值  {'left':0, 'top':0}
  //var start = fetchComputedStyle(obj, property);
  var startJSON = {};
  //遍历
  for(var k in targetJSON){
    startJSON[k] = fetchComputedStyle(obj, k);
  };
  //console.log(startJSON);
  
  //总帧数
  var maxCount = parseInt(times / interval);
  
  //步长
  //step = (target - start) / maxCount;
  var changeJSON = {};
  for(var k in targetJSON){
    //stepJSON.left(top) = 800 - 0  / 
    //stepJSON[k] = (targetJSON[k] - startJSON[k]) / maxCount;
    changeJSON[k] = targetJSON[k] - startJSON[k];
  };
  //targetJSON  startJSON  stepJSON
  
  //开始运动
  var timer;
  //计数器
  var count = 0;
  clearInterval(timer);
  timer = setInterval(function(){     
    for(var k in targetJSON){
      if(k == 'opacity'){
        //去单位，写兼容
        obj.style[k] = Tween[tweenString](count, startJSON[k], changeJSON[k], maxCount);
        obj.style.filter = 'alpha(opacity=' + Tween[tweenString](count, startJSON[k], changeJSON[k], maxCount)*100 + ')';
      }else{
        obj.style[k] = Tween[tweenString](count, startJSON[k], changeJSON[k], maxCount) + 'px';       
      };  
    };
    
    count++;
    //验证
    if(count == maxCount){
      //停表
      clearInterval(timer);
      //拉回
      for(var k in targetJSON){
        if(k == 'opacity'){
          //去单位，写兼容
          obj.style[k] = targetJSON[k];
          obj.style.filter = 'alpha(opacity=' + targetJSON[k]*100 + ')';
        }else{
          obj.style[k] = targetJSON[k] + 'px';       
        };  
      };
      //开锁
      obj.lock = false;
      //调用函数  如果有就执行，没不
      //console.log(callBack);
      callBack && callBack.call(obj);
    };
 
  }, interval);  
};

//封装计算后样式
function fetchComputedStyle(ele, property){
  //判断方法浏览器支不支持
  if(window.getComputedStyle){
    //就这个方法
    return parseFloat(getComputedStyle(ele)[property]); //string
  }else{
    //IE低版本   678
    return parseFloat(ele.currentStyle[property]);
  };
};

//拿到所有子节点方法
function children(obj, num){
  //兼容问题处理  拿到想要的
  var nodeOk = [];
  for(var i = 0; i < obj.childNodes.length; i++){
    if(obj.childNodes[i].nodeType == 1){
      nodeOk.push(obj.childNodes[i]);
    };
  };
  //返回结果
  return num ? nodeOk[num] : nodeOk;
};

//拿到最后一个子节点方法
function childLast(obj){
  //兼容问题处理  拿到想要的
  var nodeOk = [];
  for(var i = 0; i < obj.childNodes.length; i++){
    if(obj.childNodes[i].nodeType == 1){
      nodeOk.push(obj.childNodes[i]);
    };
  };
  //返回结果
  return nodeOk[nodeOk.length - 1];
};



var Tween = {
  linear: function(t, b, c, d) {
      return c * t / d + b;
  },
  //二次的
  quadEaseIn: function(t, b, c, d) {
      return c * (t /= d) * t + b;
  },
  quadEaseOut: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
  },
  quadEaseInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b;
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },
  //三次的
  qubicEaseIn: function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
  },
  qubicEaseOut: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  qubicEaseInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
      return c / 2 * ((t -= 2) * t * t + 2) + b;
  },
  //四次的
  quartEaseIn: function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
  },
  quartEaseOut: function(t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  quartEaseInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  },
  quartEaseIn: function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
  },
  quartEaseOut: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  quartEaseInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  //正弦的
  sineEaseIn: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  },
  sineEaseOut: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
  },
  sineEaseInOut: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },
  expoEaseIn: function(t, b, c, d) {
      return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  expoEaseOut: function(t, b, c, d) {
      return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  expoEaseInOut: function(t, b, c, d) {
      if (t == 0) return b;
      if (t == d) return b + c;
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  circEaseIn: function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  circEaseOut: function(t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  circEaseInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
  elasticEaseIn: function(t, b, c, d, a, p) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * .3;
      if (!a || a < Math.abs(c)) {
          a = c;
          var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  elasticEaseOut: function(t, b, c, d, a, p) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * .3;
      if (!a || a < Math.abs(c)) {
          a = c;
          var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
  },
  elasticEaseInOut: function(t, b, c, d, a, p) {
      if (t == 0) return b;
      if ((t /= d / 2) == 2) return b + c;
      if (!p) p = d * (.3 * 1.5);
      if (!a || a < Math.abs(c)) {
          a = c;
          var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  },
  //冲过头系列
  backEaseIn: function(t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  backEaseOut: function(t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  backEaseInOut: function(t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
      return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },
  //弹跳系列
  bounceEaseIn: function(t, b, c, d) {
      return c - Tween.bounceEaseOut(d - t, 0, c, d) + b;
  },
  bounceEaseOut: function(t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
      } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
      } else {
          return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
      }
  },
  bounceEaseInOut: function(t, b, c, d) {
      if (t < d / 2) return Tween.bounceEaseIn(t * 2, 0, c, d) * .5 + b;
      else return Tween.bounceEaseOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  }
}