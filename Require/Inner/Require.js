(function () {
    var kino;
    if (typeof window.kino === "undefined")
        window.kino = {};

    kino = window.kino;

    var p = {};
    p.loadHash = {};
    var r = kino.Require = function (url, key, callback) {
        ///<summary>
        ///动态加载javascript
        ///</summary>
        ///<param name="url" type="String">
        ///javascript文件链接
        ///</param>
        ///<param name="key" type="String">
        ///文件加载标识名称
        ///</param>
        ///<param name="callback" type="Function">
        ///回调函数
        ///</param>
        ///<returns/>
        if (key != null) {
            if (typeof (p.loadHash[key]) != "undefined" && p.loadHash[key] == true)
                return;

            if (p.storageLoad(key))
                return;
        }


        var xr = p.getXMLHttpRequest();
        xr.onreadystatechange = function () {
            if (xr.readyState == 4 && ((xr.status >= 200 && xr.status < 300) || xr.status == 304 || xr.status == 1223)) {
                try {
                    eval(xr.responseText);
                    if (key != null) {
                        p.loadHash[key] = true;
                        window.localStorage.setItem(key, xr.responseText);
                    }
                }
                catch (e) {
                    if (key != null)
                        p.loadHash[key] = false;
                }
                finally {
                    if (typeof (callback) != "undefined" && typeof (callback) == "function")
                        callback.call();
                }
            }

        };
        xr.open("GET", p.handleUrl(url), false);
        xr.send(null);
    }

    p.handleUrl = function (url) {
        var ss = document.getElementsByTagName("script");
        var currentScript = ss[ss.length - 1];
        if (typeof (currentScript.src) == "undefined")
            return url;
        else {
            //匹配完整url模式
            if (/^https?:\/\//.test(url))
                return url;
            //匹配根目录模式
            else if (url.substr(0, 1) == "/") {
                var host = /^(https?:\/\/[^\/]+)/.exec(currentScript.src)[0];
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
            //匹配单文件模式
            else
                return currentScript.src.replace(/[^\/]+$/, url);
        }
    };
    p.getXMLHttpRequest = function () {
        return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    };

    p.storageLoad = function (key) {
        var hasLoaded = false;
        if (window.localStorage) {
            var item = window.localStorage.getItem(key);
            if (item != null) {
                try {
                    eval(item);
                    p.loadHash[key] = true;
                    hasLoaded = true;
                }
                catch (e) {
                    if (key != null)
                        p.loadHash[key] = false;
                }
                finally {
                    if (typeof (callback) != "undefined" && typeof (callback) == "function")
                        callback.call();
                }
            }
        }

        return hasLoaded;
    };

})();