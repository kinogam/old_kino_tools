(function () {
    /**命名空间**/
    var kino;
    if (typeof window.kino === "undefined")
        window.kino = {};
    kino = window.kino;


    var p = {
        currentBlock: null,
        pkg: null
    };
    p.loadHash = {};

    kino.Package = function (pkgName) {
        p.pkg = pkgName;
    }

    var r = kino.Require = function (_url, _key, _callback, _type, _isAsyn, _disableCache) {
        var options;
        /**加入json参数模式**/
        if (arguments.length == 1 && typeof (arguments[0]) != "string")
            options = arguments[0];
        else
            options = {
                url: _url,
                key: _key,
                callback: _callback,
                type: _type,
                isAsyn: _isAsyn,
                disableCache: _disableCache
            };

        /**确认资源类型**/
        if (options.type == undefined && /\.css$/.test(options.url))
            options.type = "css";


        /**判断已加载情况**/
        if (options.key != null) {
            if (typeof (p.loadHash[options.key]) != "undefined" && p.loadHash[options.key] == true) {
                if (typeof (options.callback) != "undefined" && typeof (options.callback) == "function")
                    options.callback.call();
                return;
            }

            if (options.type != "css" && !options.disableCache && p.storageLoad(options.key))
                return;
        }
        if (options.isAsyn)
            p.aLoad(options);
        else
            p.sLoad(options);
    }

    kino.Require.clear = function () {
        if (window.localStorage)
            for (var i in p.loadHash) {
                window.localStorage.removeItem(i);
            }
        p.loadHash = {};
    };

    p.aLoad = function (options) {
        var scriptBlock = p.getCurrentScriptBlock();
        var newScript = document.createElement("script");
        newScript.src = p.handleUrl(options.url);
        newScript.type = "text/javascript";
        scriptBlock.parentNode.appendChild(newScript);

        newScript.onload = newScript.onreadystatechange = function () {
            if (typeof (options.callback) != "undefined" && typeof (options.callback) == "function")
                options.callback.call();
        };
    };

    p.sLoad = function (options) {
        var xr = p.getXMLHttpRequest();
        xr.onreadystatechange = function () {
            if (xr.readyState == 4 && ((xr.status >= 200 && xr.status < 300) || xr.status == 304 || xr.status == 1223)) {
                try {
                    if (options.type == "css")
                        p.loadCss(options.url);
                    else
                        eval(xr.responseText);

                    /**如果有key参数的话则标记为已加载，并创建storage缓存**/
                    if (options.key != null) {
                        p.loadHash[options.key] = true;
                        if (window.localStorage && !options.disableCache)
                            window.localStorage.setItem(options.key, xr.responseText);
                    }
                }
                catch (e) {
                    if (options.key != null)
                        p.loadHash[options.key] = false;
                }
                finally {
                    if (typeof (options.callback) != "undefined" && typeof (options.callback) == "function")
                        options.callback.call();
                }
            }

        };
        xr.open("GET", p.handleUrl(options.url), false);
        xr.send(null);
    }


    p.loadCss = function (url) {
        var currentScript = p.getCurrentScriptBlock();
        var link = document.createElement("link");
        link.href = p.handleUrl(url);
        link.rel = "stylesheet";
        link.type = "text/css"
        currentScript.parentNode.appendChild(link);
    }


    p.getCurrentScriptBlock = function () {
        if (p.currentBlock != null && p.currentBlock.getAttribute("pkg") == p.pkg)
            return p.currentBlock;
        var ss = document.getElementsByTagName("script");
        if (p.pkg == null)
            return ss[ss.length - 1];
        for (var i = 0; i < ss.length; i++) {
            if (ss[i].getAttribute("pkg") == p.pkg) {
                p.currentBlock = ss[i];
                return ss[i];
            }
        }
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