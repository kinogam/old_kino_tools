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
        var variable = new RegExp("@([a-zA-Z0-9\._\\[\\]]+)(?!\\()", "g");
        var block = new RegExp("@{([^}]+)}", "g");
        var logic = new RegExp("@(if|for|while)(\\([^\\)]+\\){)([^}]+)}", "g");
        var temp = "var $$p=[];with(json||{}){$$p.push('";
        temp = temp + templateStr
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
         .replace(logic, function (match, $0, $1, $2) {
             return "'); " + $0 + $1 + " $$p.push('" + $2 + "');};$$p.push('";
         }).replace(variable, function (match, code) {
             var str = "');";
             if (typeof setting !== 'undefined' && setting.enableCleanMode === true)
                 str = str + "if(typeof " + code + " === 'undefined')" + code + "='';";
             if (typeof setting !== 'undefined' && setting.enableEscape === false)
                 str = str + "$$p.push(" + code + ");$$p.push('";
             else
                 str = str + "$$p.push(_escape(" + code + "));$$p.push('";
             return str;
         })
        .replace(block, function (match, code) {
            return "'); " + _unescape(code) + " $$p.push('";
        })
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t');
        temp = temp + "');}; return $$p.join('');";
        var func = new Function('_escape', 'json', temp);
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