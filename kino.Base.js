(function (window) {
    var k = {
        rnum: 0
    };

    /**********************************************************************************************
    Private
    *********************************************************************************************/
    var p = {
        loadHash: {}
    };


    p.aLoad = function (options) {
        ///<summary>
        ///异步加载脚本
        ///</summary>

        //判断脚本是否已经加载
        var scriptBlock = p.getCurrentScriptBlock();
        var fullUrl = p.handleUrl(options.url);
        var newScript = document.createElement("script");
        newScript.src = fullUrl;
        newScript.type = "text/javascript";
        //scriptBlock.parentNode.appendChild(newScript);
        scriptBlock.parentNode.insertBefore(newScript, scriptBlock);
        newScript.onload = newScript.onreadystatechange = function () {
            k.rnum++;
            scriptBlock.parentNode.removeChild(newScript);
            if (typeof (options.callback) !== "undefined" && typeof (options.callback) === "function")
                options.callback.call();
        };
    };

    p.getCurrentScriptBlock = function () {
        ///<summary>
        ///获取当前脚本块
        ///</summary>
        var ss = document.getElementsByTagName("script");
        return ss[ss.length - 1];
    };

    p.handleUrl = function (url) {
        var currentScript = p.getCurrentScriptBlock();
        if (typeof (currentScript.src) == "undefined")
            return url;
        else {
            //匹配完整url模式
            if (/^https?:\/\//.test(url))
                return url;
            //匹配根目录模式
            else if (url.substr(0, 1) == "/") {
                var host = /^(https?:\/\/[^\/]+)/.exec(window.location.href)[0];
                return host + url;
            }
            //匹配父目录模式
            else if (/^\.\.\//.test(url)) {
                var filePath = /\.\.\/((?:[^\.][^\/]*(?:\/|$))+)$/.exec(url)[1];
                var rstr = url.replace(/\.\.\/((?:[^\.][^\/]*(?:\/|$))+)$/, "../")
                .replace(/\.\.\//g, "[^/]+/") + "[^\/]+$";

                var r = new RegExp(rstr, "g");
                return currentScript.src.replace(r, "") + filePath;

            }
            //当前页面模式
            else
                return document.location.href.replace(/[^\/]+$/, url);
        }
    };

    p.requireListHandle = function (item, callback, i) {
        var _i;
        if (i === undefined)
            _i = 0;
        else
            _i = i + 1;
        var _url;
        var hasLoaded = false;

        //string mode
        if (Object.prototype.toString.call(item[_i]) === '[object String]')
            _url = item[_i];

        //json mode
        else if (item[_i] != null && typeof item[_i] === 'object') {
            for (var json in item[_i]) {
                _url = item[_i][json];
                if (typeof p.loadHash[json] !== 'undefined')
                    hasLoaded = true;
                else
                    p.loadHash[json] = true;
                break;
            }
        }

        if (hasLoaded) {
            if (_i < item.length - 1)
                p.requireListHandle(item, callback, _i);
            else {
                if (callback !== undefined && typeof (callback) === 'function')
                    callback.call();
            }
        }
        else {
            p.aLoad({
                url: _url,
                callback: function () {
                    if (_i < item.length - 1)
                        p.requireListHandle(item, callback, _i);
                    else {
                        if (callback !== undefined && typeof (callback) === 'function')
                            callback.call();
                    }
                }
            });
        }


    };



    /**********************************************************************************************
    Public
    *********************************************************************************************/
    k.resetLoadHash = function () {
        ///<summary>
        ///清空哈希加载列表
        ///</summary>
        k.rnum = 0;
        p.loadHash = {};
    };

    k.require = function (item, callback) {
        ///<summary>
        ///动态加载
        ///</summary>
        ///<param name='item' type='String|Json|Array'>加载项</param>
        ///<param name='callback' type='Function'>回调函数</param>
        if (Object.prototype.toString.call(item) === '[object String]')
            p.aLoad({
                url: item,
                callback: callback
            });
        else if (Object.prototype.toString.call(item) === '[object Array]')
            p.requireListHandle(item, callback);

        //single json object handle
        else if (item != null && typeof item === 'object') {
            for (var i in item) {
                if (typeof p.loadHash[i] === 'undefined')
                    p.loadHash[i] = true;
                else {
                    if (typeof (callback) === "function")
                        callback();
                    return;
                }
                p.aLoad({
                    url: item[i],
                    key: i,
                    callback: callback
                });
                break;
            }
        }
    };

    k.define = function (className, construct) {
        ///<summary>
        ///类定义帮助函数
        ///</summary>
        ///<param name='className' type='String'>类名</param>
        ///<param name='construct' type='Function'>构造函数</param>
        ///<returns type='Class' />

        var ns = className.split('.');
        var temp = window;
        for (var i = 0; i < ns.length; i++) {
            if (i == ns.length - 1) {
                if (construct != null)
                    temp[ns[i]] = construct;
                else
                    temp[ns[i]] = function () { };
                return temp[ns[i]];
            }
            else if (typeof temp[ns[i]] === 'undefined') {
                temp[ns[i]] = {};
                temp = temp[ns[i]];
            }
            else if (typeof temp[ns[i]] !== 'undefined') {
                temp = temp[ns[i]];
            }

        }

    };


    window.kino = k;
})(window);