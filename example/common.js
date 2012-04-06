/// <reference path="jquery-1.3.2-vsdoc2.js" />

/* Browser Version */
var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version(); // Opera
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);   // FF
var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);   // IE
var is_mac = userAgent.indexOf('mac') != -1;

function $getId() {
    return document.getElementById(arguments[0]);
}

function $getName() {
    return document.getElementsByName(arguments[0]);
}

function evalJSON(jsonStr) {
    return eval('(' + jsonStr + ')');
}

function format(str) {
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return str.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
}

//基于jQuery的表单验证 begin
var checkRules = {
    required: function(element) {
        return $.trim($(element).val()).length > 0;
    },
    ischecked: function(element) {
        return $("input[name='" + element.name + "']:checked").length > 0;
    },
    number: function(element) {
        var value = $(element).val();
        return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
    },
    minnumber: function(element) {
        var val = $(element).val();
        if (!checkRules.number(element)) {
            return false;
        }
        return Number(val) >= Number($(element).attr("min"));
    },
    maxnumber: function(element) {
        var val = $(element).val();
        if (!checkRules.number(element)) {
            return false;
        }
        return Number(val) < Number($(element).attr("max"));
    },
    minlen: function(element) {
        var val = $(element).val();
        return val.length >= $(element).attr("minlen");
    },
    maxlen: function(element) {
        var val = $(element).val();
        return val.length < $(element).attr("maxlen");
    },
    equalto: function(element) {
        var jObj = $(element);
        var val = jObj.val();
        var compareval = $(jObj.attr("equalto")).val();
        return $.trim(val) == $.trim(compareval);
    },
    firsten: function(element) {
        return /^([a-zA-Z]([a-zA-Z0-9]|(-)|(_))*)$/i.test($(element).val());
    },
    mobile: function(element) {
        //  return /^(13[0-9]|15[0|2|3|6|7|8|9]|18[6|7|8|9])\d{8}$/.test($(element).val());
        if($.trim($(element).val()).length == 0)    return true;
        return /^(\+86|86|0)?(13|15|18)\d{9}$/.test($(element).val());
    },
    email: function(element) {
        var value = $(element).val();
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(value);
    },
    ajax: function(element) {
        var jObj = $(element);
        return AjaxMethods.InvokeMethod(jObj.attr('method'), { 'parm': jObj.val() }).value == "ok";
    },
    regexcheck: function(element) {
        var jObj = $(element);
        var val = jObj.val();
        var regex = jObj.attr("regexcheck");
        return new RegExp(regex).test(val);
    },
    idcheck:function(element){
        var jObj = $(element);
        var val = jObj.val();
        return IDCard(val).validated;
    },
    errormsg:
    {
        "required": "请输入值",
        "ischecked": "请选择正确的值",
        "minnumber": "请输入的正确的数字",
        "maxnumber": "请输入的正确的数字",
        "minlen": "请输入的正确长度的值",
        "maxlen": "请输入的正确长度的值",
        "email": "请输入正确的格式",
        "ajax": "请输入正确的值",
        "regexcheck": "格式不对",
        "mobile": "请输入正确的手机号码",
        "idcheck":"请输入正确的身份证号码"
    }
};

function IDCard(num) {
    num = $.trim(num).toUpperCase();
    if (IDCard.re18.test(num)) {
        var c = 0, i = 0;
        for (var i = 0; i < 17; i++) { c += parseInt(num[i]) * IDCard.wi[i]; }
        var date = new Date(parseInt(RegExp.$4, 10), (parseInt(RegExp.$5, 10) || 1) - 1, parseInt(RegExp.$6, 10));
        var vali = num[17] === IDCard.lastCode[c % 11] && date >= IDCard.dateRange[0] && date < IDCard.dateRange[2];
        return { pc: RegExp.$3, cc: RegExp.$2 + "00", dc: RegExp.$1, birthday: date, sex: parseInt(RegExp.$7) % 2, validated: vali }
    }
    else if (IDCard.re15.test(num)) {
        var date = new Date(parseInt("19" + RegExp.$4, 10), (parseInt(RegExp.$5, 10) || 1) - 1, parseInt(RegExp.$6, 10));
        var vali = date >= IDCard.dateRange[0] && date < IDCard.dateRange[1];
        return { pc: RegExp.$3, cc: RegExp.$2 + "00", dc: RegExp.$1, birthday: date, sex: parseInt(RegExp.$7) % 2, validated: vali }
    }
    else {
        return { pc: "", cc: "", dc: "", birthday: new Date(1900, 0, 1), sex: -1, validated: false };
    }
}
IDCard.wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
IDCard.lastCode = "10X98765432";
IDCard.re15 = /^(((\d{2})\d{2})\d{2})(\d{2})(\d{2})(\d{2})\d{2}(\d)$/i;
IDCard.re18 = /^(((\d{2})\d{2})\d{2})(\d{4})(\d{2})(\d{2})\d{2}(\d)[\dX]$/i;
IDCard.dateRange = [new Date(1900, 0, 1), new Date(2000, 0, 1), new Date(2099, 12, 31)];

function getAge(birthday, now) {
    now = now || new Date();
    if (!birthday) return null;
    age = now.getFullYear() - birthday.getFullYear();
    if (now.getMonth() < birthday.getMonth()) { age--; }
    else if (now.getMonth() == birthday.getMonth() && now.getDate() < birthday.getDate()) { age--; }
    return age;
}

function showErrorMsg(isAlert, errorMsg, obj, height) {
    if (isAlert) {
        alert(errorMsg);
        return;
    }
    
    height = height || 0;
    var divAlert = $('<div style="position: absolute; z-index: 1000; overflow: hidden; background-color: #ffefde;border:solid 1px #666;color:#666;padding-left:4px;">' + errorMsg + '</div>');
    var jObj = $(obj);
    var offset = jObj.offset();
    divAlert.attr("id", "div" + jObj.attr("id"));
    if (jObj.attr("type") == 'radio') {
        divAlert.css({ left: jObj.nextAll().last().offset().left + jObj.nextAll().last().outerWidth(), top: jObj.nextAll().last().offset().top, height: jObj.outerHeight() }).css("line-height", "20px");
    }
    else {
        divAlert.css({ left: offset.left + jObj.outerWidth(), top: offset.top, height: jObj.outerHeight() + height}).css("line-height", "20px");
    }        
    if (divAlert.bgIframe) {
        divAlert.bgiframe().show().appendTo(document.body);
    }
    else
    {
        divAlert.appendTo(document.body);
    }
}

function checkForm(objForm) {
    if (typeof objForm == "string") {
        objForm = document.forms[objForm];
    } else if (typeof objForm == "object") {

    } else {
        objForm = document.forms[0];
    }

    var isOk = true;
    var jForm = $(objForm);
    jForm.find("input:visible:enabled,select:visible:enabled").each(function() {
        isOk = checkObj.call(this);
        if (!isOk) {
            this.focus();
            $(this).one("blur", function() { 
                if(this.id != undefined)
                    $("#div" + this.id).remove(); 
            });
            return false;
        } //终止循环
    });

    return isOk;
}

function checkObj() {
    var isOk = true;
    for (var name in checkRules) {
        var rule = $(this).attr(name);
        if (rule) {
            isOk = checkRules[name](this);
        }

        if (!isOk) {
            var errorMsg = $(this).attr(name + "msg");
            if (errorMsg === undefined) {
                errorMsg = checkRules["errormsg"][name];
            }
            showErrorMsg(false, errorMsg, this);
            return false;
        } else {
            $("#div" + this.id).remove();
        }
    }
    return isOk;
}
//end

//设置jquery日期控件 传入对象名即可
//机票用的
function setDatePick() {
    $.each(arguments, function(i, item) {
        $("#" + item).datepicker({ numberOfMonths: 2, showAnim: '', prevText: "", nextText: "", minDate: new Date(), constrainInput: true });
        $("#" + item).attr("readonly", true);
    });
}
//其他页面用的
function setDatePicker() {
    $.each(arguments, function(i, item) {
        $("#" + item).datepicker({ showAnim: '', prevText: "", nextText: "", constrainInput: true });
        $("#" + item).attr("readonly", true);
    });
}
function datePickerChain() {
    var pickers = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        pickers[i] = $("#" + arguments[i]).datepicker({ showAnim: "", prevText: "", nextText: "", constrainInput: true, minDate: new Date() });
    }
    $.each(pickers, function(i, o) {
        o.datepicker("option", "onSelect", function() {
            if (pickers[i + 1]) {
                pickers[i + 1].datepicker("option", "minDate", o.datepicker("getDate"));
            }
        })
    })
}
function datePickerByObject(){
     $.each(arguments, function(i, item) {
        item.datepicker({ showAnim: '', prevText: "", nextText: "", constrainInput: true });
        item.attr("readonly", true);
    });
}
//end

function checkLogin() {
    var res = AjaxMethods.InvokeMethod("CheckUserIsLogin").value; //检测是否已登录

    if (!res || res == null) {
        $("#quickLoginID").load(getRootPath() +  "/Shared/Html/QuickLogin.htm", function() {
            showlogin();
        }); //online www.clt198.com window.location.protocol + "//" + window.location.host +
//        $("#quickLoginID").load(basePath + "Shared/Html/QuickLogin.htm", function() {

//        $("#quickLoginID").load(window.location.protocol + "//" + window.location.host + "/Shared/Html/QuickLogin.htm", function() {
//            showlogin();
//        });
//        $("#quickLoginID").load(basePath + "Shared/Html/QuickLogin.htm", function() {
//            showlogin();
//        });
        return false;
    }
    return true;
}

//显示遮挡层
function showMask() {
    $(document.body).append('<div class="mask"></div><div class="maskmsg">加载中...<img src="../../Images/loading.gif" /></div>');
}

function hideMask() {
    $(".mask").hide();
} 

if (typeof jQuery != 'undefined') {
    //jquery watermark begin
    if (jQuery) {
        (function($) {
            var map = new Array();
            $.Watermark = {
                ShowAll: function() {
                    for (var i = 0; i < map.length; i++) {
                        if (map[i].obj.val() == "") {
                            map[i].obj.val(map[i].text);
                            map[i].obj.css("color", map[i].WatermarkColor);
                        } else {
                            map[i].obj.css("color", map[i].DefaultColor);
                        }
                    }
                },
                HideAll: function() {
                    for (var i = 0; i < map.length; i++) {
                        if (map[i].obj.val() == map[i].text)
                            map[i].obj.val("");
                    }
                }
            }


            $.fn.Watermark = function(text, color) {
                if (!color)
                    color = "#aaa";
                return this.each(
			function() {
			    var input = $(this);
			    var defaultColor = input.css("color");
			    map[map.length] = { text: text, obj: input, DefaultColor: defaultColor, WatermarkColor: color };
			    function clearMessage() {
			        if (input.val() == text)
			            input.val("");
			        input.css("color", defaultColor);
			    }

			    function insertMessage() {
			        if (input.val().length == 0 || input.val() == text) {
			            input.val(text);
			            input.css("color", color);
			        } else
			            input.css("color", defaultColor);
			    }

			    input.focus(clearMessage);
			    input.blur(insertMessage);
			    input.change(insertMessage);

			    insertMessage();
			}
		);
            };
        })(jQuery);
        //end

        (function($) {
            $.fn.findParent = function(className) {
                var obj = this.parent();
                while (obj.attr("nodeName") != "BODY") {
                    if ("." + obj.attr("className") == className) {
                        return obj;
                    }
                    obj = obj.parent();
                }
                return null;
            }
        })(jQuery);
    }
}

///created by hxb
///2010.8.20
function Tip_init(arg,tipcls) {
    var arg = arg || "a.highlight_link_2";
    var tipcls = tipcls || "tips_box_7";
//    $(arg).click(function() {
//        $(this).removeAttr("href");
//        Tip_show($(this), tipcls);
//    });
    $(arg).hover(function() {
        $(this).removeAttr("href");
        Tip_show($(this), tipcls);
    }, function() {
        var showDiv = $(this).data("cacheDiv");
        if (showDiv === undefined) {
            showDiv = $($(this).attr("divId"));
        }
        showDiv.hide();
        $(this).removeData("cacheDiv");
    });
}

function Tip_showframe(jObj) {
    if (jObj.bgIframe) {
        jObj.bgIframe().show();
    } else {
        jObj.show();
    }
}

function Tip_show(jObj,tipcls) {
    var jDiv = jObj.data("cacheDiv");
    if (jDiv !== undefined) {
        Tip_showframe(jDiv);
        return;
    }

    jDiv = $(jObj.attr("divId"));
    
    var objX = jObj.offset().left-30;
    var objY = jObj.offset().top + jObj.height();

    if (jDiv.size() > 0) {
        //jObj.data("cacheDiv", jDiv);
        jDiv.css({ position: 'absolute', left: objX, top: objY, cursor: "default" }).appendTo(document.body);
        Tip_showframe(jDiv);
        return;
    }

    jDiv = $('<div class="tooltips_box"><div class="'+ tipcls +'" style="margin-top:5px;">Loading...</div></div>').css({ position: 'absolute', left: objX, top: objY, cursor: "default" }).appendTo(document.body);
//    var child=jDiv.find("div.tips_box_7");
//    child.append("<iframe style=\"position:absolute;width:100%;height:100%;left:0;top:0px;z-index:-2;border:none;background:none;\"></iframe> ")
//         .css({'position':'relative',border:'none'});
//    child.find('iframe').height(20);
    
    var dw = jObj.attr("divWidth");
    
    if (dw !== undefined) {
        dw.indexOf("px")>-1?jDiv.width(dw):jDiv.width(dw + "px");
    }
    
    var dl = jObj.attr("divLeft");
    if(dl !== undefined){
        jDiv.css({left: jObj.offset().left + parseInt(dl)});
    }

    jObj.data("cacheDiv", jDiv);
    
    if (jObj.attr("content") !== undefined) {
        jDiv.children("div").html(jObj.attr("content"));
        Tip_showframe(jDiv);
        return;
    }

    if(jObj.attr("jsparms") !=undefined  && jObj.attr("jsparms") !="")
    {   
        var jsparms = jObj.attr("jsparms").split('|');
        if(jsparms.length == 2){
            jDiv.children("div").html(createBuyLimit(jsparms[0], jsparms[1]));
            Tip_showframe(jDiv);
            return;
        }
    }
    
    Tip_showframe(jDiv);
    
    var cachekey = jObj.attr("cachekey");
    if(cachekey !== undefined){
       var cacheValue = jObj.data("cachekey");
       if (cacheValue !== undefined)
       {
		showAjaxResult(jDiv,cacheValue);
        return;
       }
    }
    AjaxMethods.InvokeMethod(jObj.attr("method"), { "parms": jObj.attr("parms") }, function(res) {
        showAjaxResult(jDiv,res.value);
        if(cachekey !== undefined){
          jObj.data("cachekey",res.value);
        } 
    });
    return;
}
function showAjaxResult(jDiv,value){
	jDiv.children("div").html(value);
    var child=jDiv.find("div.tips_box_7");
    child.append("<iframe style=\"position:absolute;width:100%;height:100%;left:0;top:2px;z-index:-1;border:none;background:none;\"></iframe> ")
         .css('position','relative');
    child.find('iframe').height(child.height());  
}
Tip_show.resetPos = function(jObj, jDiv) {
    return;
    var objY = jObj.position().top + jObj.height();
    var objX = jObj.position().left;
    var h = objY + jDiv.height();
    var w = objX + jDiv.width();
    var parent = jDiv[0].offsetParent;
    if (w + 10 > (parent.clientWidth || parent.offsetWidth)) {
        objX -= (jObj.width() / 2)
    }
    if (h + 10 > (parent.clientHeight || parent.offsetHeight)) {
        objY -= jDiv.height() + 10;
        objX += jObj.width();
    }
    jDiv.css({ left: objX, top: objY, cursor: "default" });
    //IE6修复a标签click事件
    if ($.browser.msie && $.browser.version == "6.0") {
        var maskLayer = jObj.data("maskLayer");
        if (!maskLayer) { maskLayer = $("<iframe frameborder='0' scrolling='no' style='position:absolute;z-index:1;'></iframe>"); jObj.data("maskLayer", maskLayer) }
        jDiv.parent().append(maskLayer);
        maskLayer.css({ left: objX, top: objY, width: jDiv.width(), height: jDiv.height() });
    }
}

function openDialog(url, title, width, height, replace) {
    if (width === undefined) {
        width = screen.availWidth;
    }

    if (height === undefined) {
        height = screen.availHeight - 20;
    }

    /*channelmode=yes|no|1|0	是否使用剧院模式显示窗口。默认为 no。
    directories=yes|no|1|0	是否添加目录按钮。默认为 yes。
    fullscreen=yes|no|1|0	是否使用全屏模式显示浏览器。默认是 no。处于全屏模式的窗口必须同时处于剧院模式。
    height=pixels	窗口文档显示区的高度。以像素计。
    left=pixels	窗口的 x 坐标。以像素计。
    location=yes|no|1|0	是否显示地址字段。默认是 yes。
    menubar=yes|no|1|0	是否显示菜单栏。默认是 yes。
    resizable=yes|no|1|0	窗口是否可调节尺寸。默认是 yes。
    scrollbars=yes|no|1|0	是否显示滚动条。默认是 yes。
    status=yes|no|1|0	是否添加状态栏。默认是 yes。
    titlebar=yes|no|1|0	是否显示标题栏。默认是 yes。
    toolbar=yes|no|1|0	是否显示浏览器的工具栏。默认是 yes。
    top=pixels	窗口的 y 坐标。
    width=pixels	窗口的文档显示区的宽度。以像素计。*/
    window.open(url, title, "toolbar=no,width=" + width + ",height=" + height + "," + replace);
}

function getCookie(name) {
    var start = document.cookie.indexOf(name + "=");
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length))) {
        return null;
    }
    if (start == -1) return null;
    var end = document.cookie.indexOf(';', len);
    if (end == -1) end = document.cookie.length;
    return unescape(document.cookie.substring(len, end));
}

function setCookie(name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + '=' + escape(value) +
                        ((expires) ? ';expires=' + expires_date.toGMTString() : '') + //expires.toGMTString()        
                        ((path) ? ';path=' + path : '') +
                        ((domain) ? ';domain=' + domain : '') +
                        ((secure) ? ';secure' : '');
}

function deleteCookie(name, path, domain) {
    if (getCookie(name)) {
        document.cookie = name + '=' +
        ((path) ? ';path=' + path : '') +
        ((domain) ? ';domain=' + domain : '') +
        ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
    }
}

//Date相关函数
//时间比较(d1和d2为string) d1>d2返回1 <返回-1 =返回0
function DateCompare(d1, d2) {
    d1 = Date.parse(d1.replace(/\-/g, '/'));
    d2 = Date.parse(d2.replace(/\-/g, '/'));
    if (d1 > d2) {
        return 1;
    } else if (d1 < d2) {
        return -1;
    }
    return 0;
}

//Date 比较并返回相差数(flag:h 小时 m:分 s:秒)
function DateInterval(d1, d2, flag) {
    d1 = Date.parse(d1.replace(/\-/g, '/'));
    d2 = Date.parse(d2.replace(/\-/g, '/'));

    var d3 = d1 - d2;

    var h = Math.floor(d3 / 3600000);
    var m = Math.floor((d3 - h * 3600000) / 60000);
    var s = (d3 - h * 3600000 - m * 60000) / 1000;
    if (flag == "h") {
        return h;
    } else if (flag == "m") {
        return m;
    } else if (flag == "s") {
        return s;
    }
}

//---------------------------------------------------  
// 日期格式化  
// 格式 YYYY/yyyy/YY/yy 表示年份  
// MM/M 月份  
// W/w 星期  
// dd/DD/d/D 日期  
// hh/HH/h/H 时间  
// mm/m 分钟  
// ss/SS/s/S 秒  
//---------------------------------------------------
Date.prototype.Format = function(format) {
    var o =
        {
            "M+": this.getMonth() + 1, //month  
            "d+": this.getDate(),    //day  
            "h+": this.getHours(),   //hour  
            "m+": this.getMinutes(), //minute  
            "s+": this.getSeconds(), //second  
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter  
            "S": this.getMilliseconds() //millisecond  
        }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//+---------------------------------------------------  
//| 日期输出字符串，重载了系统的toString方法  
//+---------------------------------------------------  
Date.prototype.toString = function(showWeek) {
    var myDate = this;
    var str = myDate.toLocaleDateString();
    if (showWeek) {
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        str += ' 星期' + Week[myDate.getDay()];
    }
    return str;
}

///增加日期
Date.prototype.DateAdd = function(strInterval, Number) {
    var date = this;
    switch (strInterval) {
        case 'y': //年
            date.setYear(date.getYear() + Number)
            break;
        case 's': //季度
            date.setMonth(date.getMonth() + (Number * 3))
            break;
        case 'm': //月
            date.setMonth(date.getMonth() + Number)
            break;
        case 'd': //天
            date.setDate(date.getDate() + Number)
            break
        case 'h': //时
            date.setHours(date.getHours() + Number)
            break
        case 'mm': //分
            date.setMinutes(date.getMinutes() + Number)
            break
        case 'ss': //秒
            date.setSeconds(date.getSeconds() + Number)
            break;
        default:
            break;
    }
    return this;
}

//iframe自适应高度
function SetIframeAdapter(obj) {
    if (document.getElementById) {
        if (obj && !window.opera) {
            if (obj.contentDocument && obj.contentDocument.body.offsetHeight)
                obj.height = obj.contentDocument.body.offsetHeight + 20; //FF NS
            else if (obj.document && obj.document.body.scrollHeight)
                obj.height = obj.document.body.scrollHeight + 10; //IE
        }
        else {
            if (obj.contentWindow.document && obj.contentWindow.document.body.scrollHeight)
                obj.height = obj.contentWindow.document.body.scrollHeight; //Opera
        }
    }
}

function SetIframeAdapterWidth(obj) {
    if (document.getElementById) {
        if (obj && !window.opera) {
            if (obj.contentDocument && obj.contentDocument.body.offsetWidth)
                obj.width = obj.contentDocument.body.offsetWidth + 20; //FF NS
            else if (obj.document && obj.document.body.scrollWidth)
                obj.width = obj.document.body.scrollWidth + 10; //IE
        }
        else {
            if (obj.contentWindow.document && obj.contentWindow.document.body.scrollWidth)
                obj.width = obj.contentWindow.document.body.scrollWidth; //Opera
        }
    }
}


//获取绝对路径
function getUrlAbsolutePath() {
    var url = unescape(window.location.href).replace("file:///", "");
    url = url.substring(0, url.lastIndexOf("/") + 1).replace("\\", "/");
    return url;
}

//获取url参数
function QueryString(fieldName) {
    var urlString = document.location.search;
    if (urlString != null) {
        var typeQu = fieldName + "=";
        var urlEnd = urlString.indexOf(typeQu);
        if (urlEnd != -1) {
            var paramsUrl = urlString.substring(urlEnd + typeQu.length);
            var isEnd = paramsUrl.indexOf('&');
            if (isEnd != -1) {
                return decodeURIComponent(paramsUrl.substring(0, isEnd));
            }
            else {
                return decodeURIComponent(paramsUrl);
            }
        }
        else {
            return "";
        }
    }
    else {
        return "";
    }
}

//获取伪静态URL地址参数 add by liangmc
function QueryStringStatic(fieldName, arg){
//    var urlString = document.location.search;
//    if (urlString != null) {
//        var typeQu = fieldName + "=";
//        var urlEnd = urlString.indexOf(typeQu);
//        if (urlEnd != -1) {
//            var paramsUrl = urlString.substring(urlEnd + typeQu.length);
//            var isEnd = paramsUrl.indexOf('&');
//            if (isEnd != -1) {
//                return decodeURIComponent(paramsUrl.substring(0, isEnd));
//            }
//            else {
//                return decodeURIComponent(paramsUrl);
//            }
//        }
//        else {
//            return "";
//        }
//    }
//    else {
//        return "";
//    }
    var paramsPrototype = arg || [['flightType',0],['fromCity',1],['toCity',2],['DDate',3],['RDate',4],['fromCity2',5],['toCity2',6],['DDate2',7],['carrierCode',8],['cabinClass',9],['policyID',10],['SubKey',11]];

    if((arg == "" || arg == undefined) && fieldName.toLowerCase() == paramsPrototype[paramsPrototype.length-1][0].toLowerCase() )//SubKey特殊处理
        return QueryString(fieldName);
        
    var urlString = document.location.href;
    if(urlString != null){
        var urlBegin = urlString.lastIndexOf("/") + 1;
        var urlEnd = urlString.lastIndexOf(".html");
        if(urlEnd != -1 && urlBegin != -1){
            var paramsUrl = urlString.substring(urlBegin, urlEnd);
            var params = paramsUrl.split('_');
            for(var i=0; i<paramsPrototype.length; i++){
                if(paramsPrototype[i][0].toLowerCase() == fieldName.toLowerCase())
                {
                    return params[paramsPrototype[i][1]];
                }
            }
        }
        else{
            return "";
        }
    }
     return "";
}




//修改Url(区分大小写)
function changeUrlPar(url, par, par_value) {
    var destiny = url;
    var pattern = par + '=([^&]*)';
    var replaceText = par + '=' + par_value;

    if (destiny.match(pattern)) {
        var tmp = '/\\' + par + '=[^&]*/';
        tmp = destiny.replace(eval(tmp), replaceText);
        return (tmp);
    }
    else {
        if (destiny.match('[\?]')) {
            return destiny + '&' + replaceText;
        }
        else {
            return destiny + '?' + replaceText;
        }
    }

    return destiny + '\n' + par + '\n' + par_value;
}

//lzg add 
function checkAreaValid(objArea) {
    var isOk = true;
    var jArea = $(objArea);
    jArea.find("input:visible,select:visible").each(function() {
        isOk = checkObj.call(this);

        if (!isOk) {
            this.focus();
            $(this).one("blur", function() { $("#div" + this.id).remove(); });
            return false;
        } //终止循环
    });

    return isOk;
}


//end

//限制输入数字
function limitNum(event) {
    if (!event) { event = window.event; }
    return (((event.keyCode >= 48) && (event.keyCode <= 57)));
}

//效率高,不需要多次分配内存
function StringBuilder() {
    this._stringArray = new Array();
}
StringBuilder.prototype.append = function(str) {
    this._stringArray[this._stringArray.length] = str;
}
StringBuilder.prototype.appendFormat = function(str) {
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    var retStr = str.replace(/\{(\d+)\}/g, function(m, i) {
        return args[parseInt(i, 10)];
    });
    this._stringArray.push(retStr);
}
StringBuilder.prototype.toString = function(joinGap) {
    return this._stringArray.join(joinGap || "");
}

//HashTable
function Hashtable() {
    this._hash = {};
}
Hashtable.prototype = {
    add: function(key, value) {
        if (typeof (key) == "undefined") return false;
        if (this.contains(key) == false) {
            this._hash[key] = value;
            return true;
        } else {
            return false;
        }
    }
    , remove: function(key) { delete this._hash[key]; }
    , count: function() { var i = 0; for (var k in this._hash) { i++; } return i; }
    , items: function(key) { return this._hash[key]; }
    , contains: function(key) { return typeof (this._hash[key]) != "undefined"; }
    , clear: function() { for (var k in this._hash) { delete this._hash[k]; } }
}
function look(id) {
    id = document.getElementById(id);
    if (id.style.display == "none") {
        id.style.display = "block";
    }
    else {
        id.style.display = "none"
    }
}

//只允许数字、回车输入、小数点及小数点后两位
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/^\./g, "");  //验证第一个字符是数字而不是.
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
}
//只允许数字、回车输入、小数点及小数点后1位
function clearNoNum2(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/^\./g, "");  //验证第一个字符是数字而不是.
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$2$1.$3'); //只能输入1个小数

}
//切换显示与不显示 obj对象
function upShow(obj, obj1) {
    $("#" + obj).focus(function() {
        $("#" + obj).val("");
        $(this).keyup(function() {
            if (obj == 1) {
                clearNoNum2(this);
            } else {
                clearNoNum(this);
            }
        });
    });
    $("#" + obj).blur(function() {
        if ($("#" + obj).val().length < 1) {
            $("#" + obj).val("不限");
        }
    });
}

//flash 代码开始
function writeflashhtml(arg) {
    var parm = []
    var _default_version = "8,0,24,0";
    var _default_quality = "high";
    var _default_align = "middle";
    var _default_menu = "false";

    for (i = 0; i < arguments.length; i++) {
        parm[i] = arguments[i].split(' ').join('').split('=')
        for (var j = parm[i].length - 1; j > 1; j--) {
            parm[i][j - 1] += "=" + parm[i].pop();
        }
        switch (parm[i][0]) {
            case '_version': var _version = parm[i][1]; break;
            case '_swf': var _swf = parm[i][1]; break;
            case '_base': var _base = parm[i][1]; break;
            case '_quality': var _quality = parm[i][1]; break;
            case '_loop': var _loop = parm[i][1]; break;
            case '_bgcolor': var _bgcolor = parm[i][1]; break;
            case '_wmode': var _wmode = parm[i][1]; break;
            case '_play': var _play = parm[i][1]; break;
            case '_menu': var _menu = parm[i][1]; break;
            case '_scale': var _scale = parm[i][1]; break;
            case '_salign': var _salign = parm[i][1]; break;
            case '_height': var _height = parm[i][1]; break;
            case '_width': var _width = parm[i][1]; break;
            case '_hspace': var _hspace = parm[i][1]; break;
            case '_vspace': var _vspace = parm[i][1]; break;
            case '_align': var _align = parm[i][1]; break;
            case '_class': var _class = parm[i][1]; break;
            case '_id': var _id = parm[i][1]; break;
            case '_name': var _name = parm[i][1]; break;
            case '_style': var _style = parm[i][1]; break;
            case '_declare': var _declare = parm[i][1]; break;
            case '_flashvars': var _flashvars = parm[i][1]; break;
            default: ;
        }
    }
    var thtml = ""
    thtml += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=" + ((_version) ? _version : _default_version) + "'"
    if (_width) thtml += " width='" + _width + "'"
    if (_height) thtml += " height='" + _height + "'"
    if (_hspace) thtml += " hspace='" + _hspace + "'"
    if (_vspace) thtml += " vspace='" + _vspace + "'"
    if (_align) thtml += " align='" + _align + "'"
    else thtml += " align='" + _default_align + "'"
    if (_class) thtml += " class='" + _class + "'"
    if (_id) thtml += " id='" + _id + "'"
    if (_name) thtml += " name='" + _name + "'"
    if (_style) thtml += " style='" + _style + "'"
    if (_declare) thtml += " " + _declare
    thtml += ">"
    if (_swf) thtml += "<param name='movie' value='" + _swf + "'>"
    if (_quality) thtml += "<param name='quality' value='" + _quality + "'>"
    else thtml += "<param name='quality' value ='" + _default_quality + "'>"
    if (_loop) thtml += "<param name='loop' value='" + _loop + "'>"
    if (_bgcolor) thtml += "<param name='bgcolor' value='" + _bgcolor + "'>"
    if (_play) thtml += "<param name='play' value='" + _play + "'>"
    if (_menu) thtml += "<param name='menu' value='" + _menu + "'>"
    else thtml += "<param name='menu' value='" + _default_menu + "'>"
    if (_scale) thtml += "<param name='scale' value='" + _scale + "'>"
    if (_salign) thtml += "<param name='salign' value='" + _salign + "'>"
    if (_wmode) thtml += "<param name='wmode' value='" + _wmode + "'>"
    if (_base) thtml += "<param name='base' value='" + _base + "'>"
    if (_flashvars) thtml += "<param name='flashvars' value='" + _flashvars + "'>"
    thtml += "<embed pluginspage='http://www.macromedia.com/go/getflashplayer'"
    if (_width) thtml += " width='" + _width + "'"
    if (_height) thtml += " height='" + _height + "'"
    if (_hspace) thtml += " hspace='" + _hspace + "'"
    if (_vspace) thtml += " vspace='" + _vspace + "'"
    if (_align) thtml += " align='" + _align + "'"
    else thtml += " align='" + _default_align + "'"
    if (_class) thtml += " class='" + _class + "'"
    if (_id) thtml += " id='" + _id + "'"
    if (_name) thtml += " name='" + _name + "'"
    if (_style) thtml += " style='" + _style + "'"
    thtml += " type='application/x-shockwave-flash'"
    if (_declare) thtml += " " + _declare
    if (_swf) thtml += " src='" + _swf + "'"
    if (_quality) thtml += " quality='" + _quality + "'"
    else thtml += " quality='" + _default_quality + "'"
    if (_loop) thtml += " loop='" + _loop + "'"
    if (_bgcolor) thtml += " bgcolor='" + _bgcolor + "'"
    if (_play) thtml += " play='" + _play + "'"
    if (_menu) thtml += " menu='" + _menu + "'"
    else thtml += " menu='" + _default_menu + "'"
    if (_scale) thtml += " scale='" + _scale + "'"
    if (_salign) thtml += " salign='" + _salign + "'"
    if (_wmode) thtml += " wmode='" + _wmode + "'"
    if (_base) thtml += " base='" + _base + "'"
    if (_flashvars) thtml += " flashvars='" + _flashvars + "'"
    thtml += "></embed>"
    thtml += "</object>"
    document.write(thtml)
}

var getRootPath = function(){
var strFullPath=window.document.location.href;
var strPath=window.document.location.pathname;
var pos=strFullPath.indexOf(strPath);
var prePath=strFullPath.substring(0,pos);
var strHost = window.location.host;
if(strHost.indexOf('.com')>-1 ||  strHost.indexOf('.net')>-1 ||  strHost.indexOf('0.cn')>-1 )
    return prePath;
var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
prePath = prePath + postPath;
return(prePath);
} 
//代码结束




var isloadBind = false;

function checkBind(margintop) {
	margintop == margintop || 0;
   
	var res = AjaxMethods.InvokeMethod("CheckAccoutState").value; //检测是否已登录
	
	if(res != "1"){
	   if(res == "2"){
		   $("#quickBindID").load(getRootPath() +  "/Shared/Html/BindAccount.htm", function() {
		     InitEnterEvent("#binding_wallet","#btnconfirm");
             showBindAccount(margintop);
           });
	   }
	   else if(res == "3"){
	       $("#quickBindID").load(getRootPath() +  "/Shared/Html/BindAccount.htm", function() {
             showAcitveAccount(margintop);
           });
	   }
	   return false;
	}

    return true;
}

//注册回车事件
function InitEnterEvent(obj,target){
    $(obj).unbind("keydown");
	$(obj).keydown(function(e) {
		e = e || event;
		if (e.keyCode == 13) {
			$(target).click();
		}
	});
}

//自动绑定选择器
function autoInputCity() {
    $.each(arguments, function(i, item) {
        $("#" + item).autocomplete().citySelector();
    });
}

//选择对象隐藏显示
function switch_obj(params){
	
	var _params = {
		target_obj : null,
		bind_obj : null,
		expand_class :"", 
		contraction_class : "",
		bind: null,
		expand_text:"",
		contraction_text:"",
		expand_title:"",
		contraction_title:"",
		callback : null
	};
	
	init();
	
/*	if (typeof _params.callback === "function"){
			_params.callback();
	}*/
	
	$(_params.bind_obj).bind(_params.bind, function(){
		if ($(_params.target_obj).css("display") == "none") {
			$(_params.target_obj).show();
			$(this).removeClass(_params.expand_class)
			$(this).addClass(_params.contraction_class)
			$(this).text(_params.expand_text)
			$(this).attr("title",_params.expand_title)
			$(this).attr("href","javascript:void(0)");
		} else {
			$(_params.target_obj).hide();
			$(this).removeClass(_params.contraction_class)
			$(this).addClass(_params.expand_class)
			$(this).text(_params.contraction_text)
			$(this).attr("title",_params.contraction_title)
			$(this).attr("href","javascript:void(0)");
		}
		if (typeof _params.callback === "function"){
			_params.callback();
		}
	});
		
	function init(){
		for(var i in params){
			_params[i] = params[i];
		}
	}
}