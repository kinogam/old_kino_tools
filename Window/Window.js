/// <reference path="../Script/jquery-1.6.1.min.js" />
/// <reference path="jquery.kDrag.js" />

(function () {
    var kino;
    if (typeof window.kino === "undefined")
        window.kino = {};

    kino = window.kino;


    var p = {};


    var w = kino.Window = function (s) {
        p.init.call(this);
        for (var i in s)
            this[i] = s[i];
    };

    w.zindex = 100;

    w.instanceList = {};

    w.prototype.open = function () {
        ///<summary>
        ///打开一个新窗口
        ///</summary>        
        p.setWindow.call(this);
        p.setMask.call(this);
        this.opener = window;
        this.winobj.kino.Window.instanceList[this.winid] = this;
    }

    w.getOpener = function () {
        var instanceList = window.parent.kino.Window.instanceList;
        for (var i in instanceList) {
            var wi = instanceList[i];
            if (wi.type == "html") {
                return window;
            }
            else if (wi.type == "iframe") {
                var vStr = p.toRegexStr(wi.value);
                var lStr = String(window.location);
                var r = new RegExp(vStr + "$");
                if (r.test(lStr)) {
                    return wi.opener;
                }
            }
        }
        return null;
    }

    p.toRegexStr = function (str) {
        return str.replace(".", "\\.").replace(" ", "\\s").replace("?", "\\?");
    }

    w.prototype.getWindowHtml = function () {
        var html = new Array();
        html.push("<div class='tlp'><div class='trp'><div class='tcp'>");
        html.push("<span>" + this.title + "</span>");
        html.push("<div class='cp'>");
        html.push(p.getBtnHtml.call(this));
        html.push("</div>");
        html.push("<div style='clear: both'></div></div></div></div>");
        html.push("<div class='mlp'><div class='mrp'><div class='mcp'>");
        html.push(p.getContext[this.type].call(this));
        html.push("</div></div></div><div class='blp'><div class='brp'><div class='bcp'></div></div></div>");
        return html.join("");
    };

    w.setCenterStyle = function (dom) {
        var ww = $(this.winobj).width();
        var wh = $(this.winobj).height();
        var dw = $(dom).width();
        var dh = $(dom).height();
        if (dh > wh)
            $(dom).css({ left: (ww - dw) / 2, top: 0 });
        else
            $(dom).css({ left: (ww - dw) / 2, top: (wh - dh) / 2 });

    };


    w.updateIndex = function (dom) {
        dom.style.zIndex = w.zindex + 1;
        w.zindex++;
    };

    w.toolClose = function (id) {
        var instance = w.instanceList[id];
        var winBody = instance.winobj.document.getElementsByTagName("body")[0];
        var dom = instance.winobj.document.getElementById(id);
        winBody.removeChild(dom);
    };


    p.init = function () {
        this.winid = "";
        this.winobj = window;
        this.title = "new window";
        this.type = "html";
        this.value = "hello window";
        this.width = 450;
        //this.height = 350;
        this.btn = ["close"];
        this.opener = null;
    }

    p.getBtnHtml = function () {
        var html = new Array();
        for (var i = 0; i < this.btn.length; i++) {
            html.push("<a  href='javascript:void(0);' class='tools ");
            html.push(p.itemBtn[this.btn[i]].call(this));
            html.push("></a>");
        }
        return html.join("");
    };

    p.itemBtn = {
        "close": function () {
            return "tool-close' onclick=\"kino.Window.toolClose('" + this.winid + "')\"";
        },
        "toggle": function () {
            return "tool-toggle-hidden' onclick=\"kino.Window.toolToggle('" + this.winid + "')\"";
        }
    };

    p.getContext = {
        "html": function () {
            return this.value;
        },
        "iframe": function () {
            return "<iframe class='item-frame' allowtransparency='true' src='"
            + this.value + "' frameborder='0' width='" + String(this.width - 10) + "'></iframe>";
        }
    };

    p.setWindow = function () {
        this.winid = "kw" + new Date().getTime();
        var winBody = this.winobj.document.getElementsByTagName("body")[0];
        var newWin = document.createElement("div");
        newWin.setAttribute("class", "kino-window");
        newWin.setAttribute("id", this.winid);
        newWin.setAttribute("onmousedown", "kino.Window.updateIndex(this)");
        newWin.style.width = this.width + "px";
        newWin.style.zIndex = this.winobj.kino.Window.zindex++;
        newWin.innerHTML = this.getWindowHtml();
        winBody.appendChild(newWin);
        w.setCenterStyle.call(this, newWin);
    };

    p.setMask = function () {
        var winBody = this.winobj.document.getElementsByTagName("body")[0];
        var mask = this.winobj.document.getElementById("kinomask");
        if (mask == null) {
            mask = document.createElement("div");
            mask.setAttribute("id", "kinomask");
            winBody.appendChild(mask);
        }
    };


})();


$(function () {
    (function () {
        ///<summary>
        ///处理ie下的屏蔽层高度
        ///</summary>
        /*@cc_on@*/
        /*@if(@_jscript)
        $("#kinomask").height($(window).height());
        @end@*/
    })();

    $(".kino-window").kDrag({
        beforemove_event: function () {
            $("#kinomask").css({ display: "block" });
            $("body").addClass("ffnosel");
        },
        mouseup_event: function () {
            $("#kinomask").css({ display: "none" });
            $("body").removeClass("ffnosel");
        }
    });
});
