// console.log(oBtn);
    function moving(obj,targetJson,times,runWay,callBack){
        if(arguments.length<3||typeof arguments[0]!='object'||typeof arguments[1]!='object'||typeof arguments[2]!='number'){
            throw new Error("必须有三个参数，第一个为对象，第二个为对象，第三个为数值类型");
        }
       
        else if(arguments.length==3){
            runWay="linear";
            callBack=null;
        }else if(arguments.length==4){
            switch(typeof arguments[3]){
                case 'string':
                    callBack=null;
                    break;
                case 'function':
                    callBack=arguments[3];
                    arguments[3]='linear';//默认为linear方式
                    break;
                    default:
                        throw new Error("第四个要么是缓冲名，要么是回调函数");
            }
        }

        obj.lock=true;//节流
        var interval=window.navigator.userAgent.indexOf('MSIE')==-1?5:50;
        // console.log(obj);
        var startJson={};
        for(var k in targetJson){
            startJson[k]=fetchComputedStyle(obj,k);
        }

        //总帧数
        var maxCount=parseInt(times/interval);
         //步长
         var stepJson={};
         for(var k in targetJson){
             stepJson[k]=targetJson[k]-startJson[k];
         }

         //开始运动
         var timer = null;
         var count=0;
         clearInterval(timer);
         timer=setInterval(function(){
            for(var k in targetJson){
             if(k=='opacity'){
                 obj.style[k]=Tween[runWay](count,startJson[k],stepJson[k],maxcount);
                 obj.style.filter='alpha(opacity)='+Tween[runWay](count,startJson[k],stepJson[k],maxCount)*100+')';
             }else{
                //  console.log(runWay,count,startJson[k],stepJson[k],maxCount)
                 obj.style[k]=Tween[runWay](count,startJson[k],stepJson[k],maxCount)+'px';
             }
         }
         count++;
         if(count==maxCount){
             clearInterval(timer);
             for(var k in targetJson){
                 if(k == 'opacity'){
                    obj.style[k]=targetJson[k];
                    obj.style.filter="alpha(opacity="+targetJson[k]*100+")";
                 }
                 else{
                    obj.style[k]=targetJson[k]+'px';
                 }
             }
             obj.lock=false;
             callBack&&callBack.call(obj);
         }
         },interval)
        }

    //计算后样式的封装
    function fetchComputedStyle(obj,property){
        if(window.getComputedStyle){
            return parseFloat(getComputedStyle(obj)[property]);
        }
        else return parseFloat(obj.currentStyle[property]);
    }



    //各种类型的缓冲
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
