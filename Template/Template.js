(function () {
    var kino;
    if (typeof window.kino === "undefined")
        window.kino = {};

    kino = window.kino;

    var t = kino.Template = function (templateText) {
        ///<summary>
        ///转换模板类
        ///</summary>
        ///<param name="templateText">
        ///转换模板字符串
        ///</param>
        this.templateText = templateText;
        this.variableMap = {};
    }

    t.prototype.set = function (variable, value) {
        ///<summary>
        ///设置模板变量和对应值
        ///</summary>
        ///<param name="variable">
        ///模板变量名
        ///</param>
        ///<param name="value">
        ///模板变量值
        ///</param>
        this.variableMap[variable] = value;
    }

    t.prototype.evaluate = function () {
        ///<summary>
        ///执行转换
        ///</summary>
        ///<returns type="String"/>
        var result = private.replaceVariables.call(this);
        return result;
    }




    var tp = kino.TemplateParse = function () { };
    tp.parse = function (templateText) {
        if (templateText == "") {
            return private.getSegmentsEmptyString();
        }
        return private.getParseSegments(templateText);
    };

    var private = {
        replaceVariables: function () {
            var segments = kino.TemplateParse.parse(this.templateText);
            for (var i = 0; i < segments.length; i++) {
                if (/^\${[^}]+}$/.test(segments[i])) {
                    var variable = segments[i].replace(/^\${|}$/g, "");
                    if (this.variableMap[variable] == null)
                        throw new Error("a variable was left without a value!");
                    segments[i] = this.variableMap[variable];
                }
            }
            return segments.join("");
        },
        getSegmentsEmptyString: function () {
            var segments = new Array();
            segments.push("");
            return segments;
        },
        getParseSegments: function (templateText) {
            var segments = new Array();
            var r = new RegExp("(.*?)(\\${[^}]+}|$)", "g");
            var mathlist;
            while ((mathlist = r.exec(templateText))[0] != "") {
                if (mathlist[1] != null && mathlist[1] != "")
                    segments.push(mathlist[1]);
                if (mathlist[2] != null && mathlist[2] != "")
                    segments.push(mathlist[2]);
            }
            return segments;
        }
    };

})();