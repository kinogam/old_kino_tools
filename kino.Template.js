﻿(function () {
    var Html = {
        escape: function (value) {
            return ('' + value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
        }
    };

    var _unescape = function (code) {
        return code.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
    };

    var gf = function (templateStr, setting) {
        ///<summary>
        ///获取模板函数
        ///</summary>
        ///<param name="templateStr" type="String">模板字符串</param>
        ///<param name="setting" type="Json">
        ///[option]可选设置
        ///&#10;1.enableCleanMode type="Boolean" 设置是否清空未匹配变量
        ///&#10;2.enableEscape type="Boolean" 设置是否使用字符转换
        ///</param>
        ///<returns type="Function" />
        var logic = /@((?:if|for|while)\s*\([^\)]+\)\s*{)/g;
        var block = /@{([^}]*)}/g;

        var variable = /@((?:new\s+[a-z0-9]+\([^\)]*\)|[a-z0-9]+)(?:\.|\([^\)]*\)|[a-z0-9\[\]]+)*)/ig;
        var elseblock = new RegExp("([}\\s])(else\\s*(?:if\\s*\\([^\\)]+\\))?{)", "g");
        var s = "var __p='';with(obj||{}){__p=__p+'" + templateStr.replace(/\r/g, '\\r')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '')
            .replace(/\\\\r/g, '')
            .replace(/\t/g, '')
            .replace(/@@/g, '%$a$%')
            .replace(/@}/g, '%$b$%')
            .replace(block, function (match, $1) {
                return "';" + _unescape($1) + "__p=__p+'";
            })
            .replace(logic, function (match, $1) {
                return "';" + _unescape($1) + "__p=__p+'";
            })
            .replace(elseblock, function (match, $1, $2) {
                return "';" + $1 + _unescape($2) + "__p=__p+'";
            })
            .replace(variable, function (match, $1) {
                var str = "';";
                if (typeof setting !== 'undefined' && setting.enableCleanMode === true)
                    str = str + "if(typeof " + $1 + " === 'undefined')" + $1 + "='';";
                str = str + "__p=__p+" + $1 + ";__p=__p+'";
                return str;
            })
            .replace(/}(?!\s*else)/g, "';}__p=__p+'")
            .replace(/%\$b\$%/g, '}')
            .replace(/%\$a\$%/g, '@')
             + "';};return __p;";

            return new Function('Html', 'obj', s);
    };

    var t = function (temp, data, setting) {
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

        var func;
        if (typeof temp === 'function')
            func = temp;
        else
            func = gf(temp, setting);
        return func.call(null, Html, data);
    };


    // Module
    if (typeof module != 'undefined' && module.exports) {
        module.exports = {
            template: t,
            getTemplateFunc: gf
        };
    }
    else {
        this.kino = this.kino ? this.kino : {};
        this.kino.template = t;
        this.kino.getTemplateFunc = gf;
    }
})();