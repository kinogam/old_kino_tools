(function () {
    var _escape = function (str) {
        return ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
    };

    var _unescape = function (code) {
        return code.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
    };
    var t = function (templateStr, data, setting) {
        ///<summary>
        ///kino模板工具
        ///</summary>
        ///<param name="templateStr" type="String">模板字符串</param>
        ///<param name="data" type="Json">变量容器</param>
        ///<param name="setting" type="Json">
        ///[option]可选设置
        ///&#10;1.enableCleanMode type="Boolean" 设置是否清空未匹配变量
        ///&#10;2.enableEscape type="Boolean" 设置是否使用字符转换
        ///</param>
        ///<returns type="String" />
        var logic = /@((?:if|for|while)\s*\([^\)]+\)\s*{)/g;
        var block = /@{([^}]*)}/g;
        var variable = /@([a-zA-Z0-9\.\[\]\(\)]+)/g;
        var s = "var __p='';with(obj||{}){__p=__p+'" + templateStr.replace(/\r/g, '\\r')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
            .replace(/@@/g, '%$a$%')
            .replace(/@}/g, '%$b$%')
            .replace(block, function (match, $1) {
                return "';" + _unescape($1) + "__p=__p+'";
            })
            .replace(logic, function (match, $1) {
                return "';" + _unescape($1) + "__p=__p+'";
            })
            .replace(variable, function (match, $1) {
                var str = "';";
                if (typeof setting !== 'undefined' && setting.enableCleanMode === true)
                    str = str + "if(typeof " + $1 + " === 'undefined')" + $1 + "='';";
                if (typeof setting !== 'undefined' && setting.enableEscape === false)
                    str = str + "__p=__p+" + $1 + ";__p=__p+'";
                else
                    str = str + "__p=__p+_escape(" + $1 + ");__p=__p+'";
                return str;
            })
            .replace(/}/g, "';}__p=__p+'")
            .replace(/%\$b\$%/g, '}')
            .replace(/%\$a\$%/g, '@')
             + "';};return __p;";

            var func = new Function('_escape', 'obj', s);
            return func.call(null, _escape, data);
    };

    // Module
    if (typeof module != 'undefined' && module.exports) {
        module.exports = t;
    }
    else {
        this.kino = this.kino ? this.kino : {};
        this.kino.template = t;
    }
})();