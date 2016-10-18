/*!
 * jQuery TableOe - A Table Plugin
 * ------------------------------------------------------------------
 *
 * searchpeople是一款搜索插件，支持键盘事件
 *
 * Licensed under liyuanqing License
 *
 * @version        1.0
 * @since          2016.08.30
 * @author         liyuanqing
 * @mail		   1069795183@qq.com
 *
 * ------------------------------------------------------------------
 *
 */
(function ($) {
    //插件入口
    $.fn.searchpeople = function(){
        var method = arguments[0];
        if(methods[method]){
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments,1);
        }else if(typeof(method) == 'object' || !method){
            method = methods.init;
        }else{
            $.error('Method'+method+'does not exist on jQuery.toTop');
            return this;
        }
        return method.apply(this,arguments);
    };

    //默认参数
    $.fn.searchpeople.defaults = {
        //postion
        url: "", //ajax请求地址
        data:"" , //获取ajax data函数
        callback: "", //ajax成功返回函数
        search:"",  //搜索
        part:0 , //0:搜索出的数据全部填到input  ，1：部分填充
        wordlength:2
    };
    var methods = {
        init: function(options){
            //合并参数
            var options = $.extend({},$.fn.searchpeople.defaults,options);

            var mythis = $(this);
            var  myid=$(this).attr("id");
            var li= $(this).next("ul").children("li");
            function funBind(){
                //$(document).on(".searchul li",function(){   //搜索li 点击复制
                $(" .searchul li").on('click',function(){
                    if($(this).attr("class")!="active"){
                        $(this).parent("ul").prev().val("");
                    }
                    $(".searchul").remove();
                });
            }
            $(document).on("mouseover",".searchul li",function(){  //悬浮于li,增添class="active"
                $(".searchul li").removeClass("active");
                $(this).addClass("active");
            });

            $(document).click(function(){     //点击其他地方 搜索结果ul隐藏清除
                mythis.next("ul").remove()
            });
            //var index=0;
            //var nextindex=0;
            $(this).click(function(){  //绑定元素点击
                $(".searchul").remove();
                var val = $(this).val();
                var datas=options.data.call(this);
                if(val.length>= options.wordlength){
                    setTimeout(function(){performSearch(val,datas,options.url)},600);
                }
            });

            function performSearch(vals,datas,url){
                if (vals.length>=options.wordlength && vals==$("#"+myid).val()){
                    $.ajax({
                        url: url,
                        type: 'post',
                        data: datas,
                        dataType: "json",
                        success: function(data){
                            if( $("#"+myid).val() ==vals ){
                                options.callback.call(this,data);
                            }else {
                                performSearch($("#"+myid).val());
                            }
                            funBind();
                        }
                    });
                }
            }
            mythis.keyup(function(event) {
                if(event.keyCode==40){    //键盘up
                    var index = $(".searchul li.active").index()+1;
                    $(".searchul li").eq(index).addClass('active').siblings().removeClass('active');
                }else if(event.keyCode==38){ //键盘down
                    var index = $(".searchul li.active").index()-1;
                    if(index<0){
                        index = $(".searchul li").length-1;
                    }
                    $(".searchul li").eq(index).addClass('active').siblings().removeClass('active');
                }else if(event.keyCode==13){ //键盘enter
                    event.stopPropagation();
                    mythis.parent("ul").prev().val($(this).text());
                    $(".searchul").remove();
                    return false;
                }else{
                    mythis.trigger("click");
                }
            });
        }
    };
})(jQuery);