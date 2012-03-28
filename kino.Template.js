(function () {

    var t = function (templateText) {
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
        ///<returns type="kino.Template"/>
        if (arguments.length == 1 && typeof arguments[0] == 'object') {
            var json = arguments[0];
            for (var i in json)
                this.variableMap[i] = json[i];
        }
        else
            this.variableMap[variable] = value;
        return this;
    }

    t.prototype.evaluate = function (isClean) {
        ///<summary>
        ///执行转换
        ///</summary>
        ///<param name="isClean" type="Boolean">是否清空未匹配变量</param>
        ///<returns type="String"/>
        var result = private.replaceVariables.call({
            template: this,
            isClean: isClean
        });
        return result;
    }




    var tp = function () { };
    tp.parse = function (templateText) {
        if (templateText == "") {
            return private.getSegmentsEmptyString();
        }
        return private.getParseSegments(templateText);
    };

    var private = {
        replaceVariables: function () {
            var template = this.template;
            var isClean = this.isClean;
            var segments = kino.TemplateParse.parse(template.templateText);
            for (var i = 0; i < segments.length; i++) {
                if (/^\${[^}]+}$/.test(segments[i])) {
                    var variable = segments[i].replace(/^\${|}$/g, "");
                    if (template.variableMap[variable] == null) {
                        if (isClean)
                            segments[i] = "";
                        else
                            throw new Error("a variable was left without a value!");
                    }
                    else
                        segments[i] = template.variableMap[variable];
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


    this.kino = this.kino || {};
    this.kino.Template = t;
    this.kino.TemplateParse = tp;

})();