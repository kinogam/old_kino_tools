/// <reference path="jquery.js" />
/// <reference path="kino.Template.js" />


(function () {

    this.kino = this.kino || {};

    var p = {
    };

    var f = function (s) {
        p.init.call(this);
        for (var i in s)
            this[i] = s[i];
        p.initItemMap.call(this, s);
    }


    var fi = {
        _itemTypeHash: {},
        addType: function (s) {
            ///<summary>
            ///添加控件类型
            ///</summary>
            ///<param name="s" type="Json">控件属性</param>
            //check if the new type implement getValue and getHtml method
            if (typeof s.getValue === "undefined" || typeof s.getHtml === "undefined")
                throw new Error("not yet emplement getValue or getHtml method");
            this._itemTypeHash[s.type] = s;
            return this;
        }
    };

    this.kino.Form = f;

    this.kino.Item = fi;

    p.initItemMap = function (s) {
        if (s == null)
            return;
        if (s.items != null && s.items.length > 0) {
            for (var i = 0; i < s.items.length; i++) {
                this.addItem(s.items[i]);
            }
        }
    }


    p.init = function () {
        ///<summary>
        ///初始化
        ///</summary>
        this.render = null;
        this.items = new Array();
        this.groups = new Array();
        this.initValues = {};
        this.itemMap = {};
        this.colnum = 1;
        this.enableEmptyFix = true;
        this.isView = false;
        //        this.bodyhtml = "@{groups}";
        //        this.gthtml = "<div class='kf-title'>@{gtitle}</div>";
        //        this.grouphtml = "@{gthtml}<table class='kino-form'>@{rows}</table>";
        //        this.rowhtml = "<tr>@{cells}</tr>";
        //        this.cellhtml = "<td><span class='kf-require' @{require}>*</span>";
        //        this.cellhtml += "<span class='kf-label kf-label-@{name}'>@{label}:</span></td>";
        //        this.cellhtml += "<td>@{item}<span class='kf-alarm' style='visibility:hidden'></span></td>";
        //        this.emptyCellHtml = "<td></td><td></td>";
        this.postHandle = $.post;
        this.events = {};
    }

    f.prototype.renderTo = function (dom) {
        ///<summary>
        ///绑定容器
        ///</summary>
        ///<param name="dom" type="dom">容器DOM</param>
        this.render = dom;
    }

    f.prototype.addItem = function (item) {
        ///<summary>
        ///增加表单元素
        ///</summary>
        ///<param name="item" type="json">表单元素</param>

        //初始化item
        if (typeof item.type !== 'undefined' && typeof fi._itemTypeHash[item.type].init === 'function')
            fi._itemTypeHash[item.type].init.call(item);

        var len = this.groups.length;
        if (len != 0 && this.groups[len - 1].name == "")
            this.groups[len - 1].items.push(item);
        else {
            var newgroup = {
                name: "",
                items: [item]
            }
            this.groups.push(newgroup);
        }
        this.itemMap[item.name] = item;
    }

    f.prototype.setValues = function (s) {
        this.initValues = s;
    };

    f.prototype.enableViewMode = function () {
        this.isView = true;
    };

    p.items2group = function () {
        if (this.items == null || this.items.length == 0)
            return;

        var len = this.groups.length;
        if (len != 0 && this.groups[len - 1].name == "")
            this.groups[len - 1].items = this.groups[len - 1].items.concat(this.items);
        else {
            var newgroup = {
                name: "",
                items: this.items
            }
            this.groups.push(newgroup);
            this.items = null;
        }
    };

    f.templateStr = (function () {
        var str = "<table>";
        str = str + "@for(var i = 0; i < items.length; i++){"
        str = str + "<tr><td>@items[i].obj.label</td><td>@items[i].html</td></tr>"
        str = str + "}</table>";
        return str;
    })();

    f.prototype.bind = function (render) {
        this.render = render || this.render;

        var itemList = new Array();
        for (var item in this.itemMap) {
            if (typeof this.itemMap[item].type !== 'undefined')
                itemList[itemList.length] = {
                    obj: this.itemMap[item],
                    html: p.getCellHtml.call(this, this.itemMap[item])
                }
        }
        var html = kino.template(f.templateStr, { items: itemList }, { enableCleanMode: true, enableEscape: false });
        this.render.innerHTML = html;
    };


    //    f.prototype.bind = function (render) {
    //        ///<summary>
    //        ///绑定到引用对象,设置HTML
    //        ///</summary>
    //        ///<param name="render" type="dom">引用对象</param>
    //        p.items2group.call(this);
    //        var html = new Array();
    //        for (var i = 0; i < this.groups.length; i++) {
    //            var gh;
    //            if (this.groups[i].name == "") {
    //                gh = this.grouphtml.replace("@{gthtml}", "");
    //            }
    //            else {
    //                var gthtml = this.gthtml.replace("@{gtitle}", this.groups[i].name);
    //                gh = this.grouphtml.replace("@{gthtml}", gthtml);
    //            }
    //            var items = this.groups[i].items;
    //            var ch = "";
    //            var rh = new Array();
    //            var vcount = 0;
    //            for (var j = 0; j < items.length; j++) {
    //                var item = items[j];
    //                if (item != undefined && item.type != undefined) {
    //                    ch += p.getCellHtml.call(this, item);
    //                    vcount++;
    //                }

    //                //空白填充
    //                if (this.colnum != 1 && this.enableEmptyFix &&
    //                 j == items.length - 1 && vcount % this.colnum != 0) {
    //                    var fixnum = vcount % this.colnum;
    //                    for (var k = 0; k < fixnum; k++)
    //                        ch += this.emptyCellHtml;
    //                }

    //                if (p.isAddCell2Row(this.colnum, items.length, j, vcount)) {
    //                    //去掉空行
    //                    if (ch != "") {
    //                        rh.push(this.rowhtml.replace("@{cells}", ch));
    //                        ch = "";
    //                    }
    //                }
    //            }
    //            html.push(gh.replace("@{rows}", rh.join("")));
    //        }

    //        if (render != null)
    //            this.render = render;
    //        this.render.innerHTML = this.bodyhtml.replace("@{groups}", html.join(""));// +p.getErrorBoxHtml();
    //    };

    f.prototype.get = function (name) {
        ///<summary>
        ///根据name属性获取对应的item
        ///</summary>
        ///<param name="name" type="String">item的name属性</param>
        ///<returns type="Item"/>
        var item = this.itemMap[name];
        if (typeof item.$el === 'undefined')
            item.$el = $(this.render).find("[name='" + name + "']");
        if (typeof item.el === 'undefined')
            item.el = item.$el[0];
        return item;
    };

    p.getCellHtml = function (item) {
        //获取模板文本
        var templateText = fi._itemTypeHash[item.type].getHtml();

        if (typeof this.initValues[item.name] !== 'undefined')
            item.value = this.initValues[item.name];

        //获取自定义属性字符串
        var attrStr = "";

        for (var i in item.attr) {
            attrStr = attrStr + i + "=\"" + item.attr[i] + "\" ";
        }

        //使用替换掉attr的json配置
        var _item = {};
        for (var i in item) {
            if (i != 'attr')
                _item[i] = item[i];
        };
        _item.attr = attrStr;

        return kino.template(templateText, _item, {
            enableCleanMode: true,
            enableEscape: false
        });
    };

    //    p.getErrorBoxHtml = function () {
    //        var html = new Array();
    //        html.push("<div class='kf-error-box' style='display:none;'>")

    //        html.push("<div class='kf-error-box-tl'>");
    //        html.push("<div class='kf-error-box-tr'>");
    //        html.push("<div class='kf-error-box-tc'>");
    //        html.push("</div>");
    //        html.push("</div>");
    //        html.push("</div>");
    //        html.push("<div class='kf-error-box-cl'>");
    //        html.push("<div class='kf-error-box-cr'>");
    //        html.push("<div class='kf-error-box-body'></div>");
    //        html.push("</div>");
    //        html.push("</div>");
    //        html.push("<div class='kf-error-box-bl'>");
    //        html.push("<div class='kf-error-box-br'>");
    //        html.push("<div class='kf-error-box-bc'>");
    //        html.push("</div>");
    //        html.push("</div>");
    //        html.push("</div>");

    //        html.push("</div>");

    //        return html.join("");
    //    };
    p.isAddCell2Row = function (colnum, len, j, vcount) {
        return colnum == 1 || vcount % colnum == 0 || j == len - 1;
    };

    //    p.getErrorMsg = function (item) {
    //        if (item.required && item.errorMsg == null)
    //            return "必填项不能为空";
    //        else if (item.regex != null && item.errorMsg == null)
    //            return "格式不正确";

    //        return item.errorMsg;
    //    }


    //    p.addVilidateEvent = function (item) {
    //        if (item.type == undefined || item.name == undefined)
    //            return;
    //        var formObj = this;

    //        $(".kf-" + item.type + "-" + p.replaceSC(item.name)).live("blur", function () {
    //            if (p.checkItem.call(formObj, formObj.itemMap[p.getItemNameByDom(this)]))
    //                $(this).find("~.kf-alarm").css({ visibility: "hidden" });
    //            else
    //                $(this).find("~.kf-alarm").css({ visibility: "visible" });
    //        });

    //        $(".kf-" + item.type + "-" + p.replaceSC(item.name) + "~.kf-alarm").live({
    //            mouseenter: function () {
    //                var eb = $(formObj.render).find(".kf-error-box");

    //                var ci = formObj.itemMap[p.getItemNameByDom($(this).prev()[0])];
    //                eb.find(".kf-error-box-body").html(p.getErrorMsg(ci));
    //                eb.css({
    //                    position: "absolute",
    //                    top: $(this).offset().top,
    //                    left: $(this).offset().left - eb.width(),
    //                    display: "block"
    //                });
    //            },
    //            mouseleave: function () {
    //                $(formObj.render).find(".kf-error-box").css("display", "none");
    //            }
    //        });
    //    };

    //    p.getItemNameByDom = function (dom) {
    //        return /kf-[^\-\s]+-([^\s]+)/.exec(dom.className)[1];
    //    };

    //    p.checkItem = function (item) {
    //        var val = p.itemHtml[item.type].getValue.call(this, item);

    //        //非空约束
    //        if (item.required && item.required == true
    //        && !p.validate.required(val))
    //            return false;

    //        //正则约束
    //        if (item.regex != undefined && item.regex.rstr != null
    //        && !p.validate.regex(val, item.regex))
    //            return false;

    //        return true;
    //    };

    //    f.prototype.check = function () {
    //        ///<summary>
    //        ///验证内容
    //        ///</summary>
    //        ///<returns type="JSON" />
    //        var allCheck = true;
    //        for (var i in this.itemMap) {
    //            var item = this.itemMap[i];
    //            var isCheck = p.checkItem.call(this, item);
    //            allCheck = allCheck && isCheck;
    //            if (!isCheck) {
    //                $(this.render).find(".kf-" + item.type + "-" + p.replaceSC(item.name))
    //                .find("~.kf-alarm").css({ visibility: "visible" });
    //            }
    //        }
    //        return {
    //            isSuccess: allCheck
    //        };
    //    }

    f.prototype.getParams = function () {
        ///<summary>
        ///根据表单内容获取请求json
        ///</summary>
        ///<returns type="JSON" />
        return this.getModelParam("");
    };

    f.prototype.getModelParam = function (modelName) {
        ///<summary>
        ///根据表单内容获取请求json
        ///</summary>
        ///<param name="nodelName" type="String">model名</param>
        ///<returns type="JSON" />
        var json = {};
        var mn = modelName;
        if (mn == null)
            mn = "model.";
        else if (mn != '')
            mn = mn + ".";

        for (var i = 0; i < this.groups.length; i++) {
            var items = this.groups[i].items;
            for (var j = 0; j < items.length; j++) {
                if (items[j].type == undefined) {
                    if (typeof (items[j].value) == "undefined") {
                        if (this.initValues[items[j].name] != null)
                            json[mn + items[j].name] = this.initValues[items[j].name];
                    }
                    else
                        json[mn + items[j].name] = items[j].value;
                }
                else {
                    var itemType = fi._itemTypeHash[items[j].type];
                    json[mn + items[j].name] = itemType.getValue.call({ form: this, item: items[j] });
                }
            }
        }

        return json;
    };




    //设置或获取html内容
    //    p.itemHtml = {
    //        msg: {
    //            getHtml: function (item) {
    //                var html = new Array();
    //                html.push("<span name='" + item.name + "' class='kf-msg kf-msg-" + item.name + "'");
    //                if (item.display != null && item.display == false)
    //                    html.push(" style='display:none' ");
    //                html.push(">");
    //                if (this.initValues[item.name] != null)
    //                    html.push(this.initValues[item.name]);
    //                else if (item.value != null)
    //                    html.push(item.value);

    //                html.push("</span>");
    //                return html.join("");
    //            },
    //            getValue: function (item) {
    //                return $(this.render).find(".kf-msg-" + p.replaceSC(item.name)).val();
    //            }
    //        },


    //        pwd: {
    //            getHtml: function (item) {
    //                var html = new Array();
    //                html.push("<input type='password' name='" + item.name);
    //                html.push("' class='kf-pwd kf-pwd-" + item.name + "'");
    //                if (item.display != null && item.display == false)
    //                    html.push(" style='display:none' ");

    //                if (this.initValues[item.name] != null)
    //                    html.push(" value='" + this.initValues[item.name] + "'");
    //                else if (item.value != null)
    //                    html.push(" value='" + item.value + "'");

    //                html.push(" />");
    //                return html.join("");
    //            },
    //            getValue: function (item) {
    //                return $(this.render).find(".kf-pwd-" + p.replaceSC(item.name)).val();
    //            }
    //        },
    //        list: {
    //            getHtml: function (item) {
    //                return p.getListHtml.call(this, item);
    //            },
    //            getValue: function (item) {
    //                return $(this.render).find(".kf-list-" + p.replaceSC(item.name) + " option:selected").val();
    //            }
    //        },
    //        combo: {
    //            getHtml: function (item) {
    //                var render = this.render;
    //                var fobj = this;
    //                var jdom = $(this.render).find(".kf-combo-" + item.name);
    //                var comboTo = this.itemMap[item.comboTo];
    //                jdom.live("change", function () {
    //                    var param = {};
    //                    param[comboTo.pname] = $(this).find("option:selected").val();
    //                    var dom = p.findDomByItem.call(fobj, comboTo);
    //                    fobj.postHandle(comboTo.action, param, function (result) {
    //                        dom.innerHTML = p.getOptionHtml.call(fobj, result, comboTo);

    //                    });

    //                });
    //                return p.getListHtml.call(this, item);
    //            },
    //            getValue: function () {
    //                return $(this.render).find(".kf-list-" + p.replaceSC(item.name) + " option:selected").val();
    //            }
    //        }
    //        ,
    //        date: {
    //            getHtml: function (item) {
    //                /**set format**/
    //                var html = new Array();
    //                var defaultRF = "yyyy-mm-dd";
    //                var defaultSF = "yyyy-mm-dd";
    //                if (item.realformat != null)
    //                    defaultRF = item.realformat;
    //                if (item.showformat != null)
    //                    defaultSF = item.showformat;

    //                /**set value**/
    //                var value = null;
    //                if (this.initValues[item.name] != null)
    //                    value = this.initValues[item.name];
    //                else if (item.value != null)
    //                    value = item.value;

    //                html.push("<input name='" + item.name + "' class='kf-date kf-date-" + item.name + "' type='text' ");
    //                html.push("onfocus=\"WdatePicker({realDateFmt:'" + DateHelper.t2my97(defaultRF) + "',")
    //                html.push("dateFmt:'" + DateHelper.t2my97(defaultSF) + "',readOnly:true})\"");
    //                if (value != null) {
    //                    html.push("  realvalue='");
    //                    if (p.isDateType(value))
    //                        html.push(DateHelper.date2String(value, defaultRF));
    //                    else if (p.isNumber(value))
    //                        html.push(DateHelper.getFormatDateByAddDay(value, defaultRF));
    //                    else
    //                        html.push(value);

    //                    html.push("'  value='");
    //                    if (p.isDateType(value))
    //                        html.push(DateHelper.date2String(value, defaultSF));
    //                    else if (p.isNumber(value))
    //                        html.push(DateHelper.getFormatDateByAddDay(value, defaultSF));
    //                    else if (value != "")
    //                        html.push(DateHelper.formatDateStr(value, defaultRF, defaultSF));
    //                    html.push("' ");
    //                }
    //                html.push(">");

    //                return html.join("");
    //            },
    //            getValue: function (item) {
    //                return $(this.render).find(".kf-date-" + p.replaceSC(item.name)).attr("realvalue");
    //            }
    //        }
    //    };

    //    p.replaceSC = function (value) {
    //        return value.replace(/\./g, "\\.");
    //    };


    //    p.isDateType = function (obj) {
    //        return Object.prototype.toString.call(obj) == "[object Date]";
    //    }
    //    p.isNumber = function (obj) {
    //        return typeof (obj) == "number";
    //    }
    //    p.findDomByItem = function (item) {
    //        return $(this.render).find(".kf-" + item.type + "-" + item.name)[0];
    //    };

    //验证函数
    //    p.validate = {
    //        required: function (value) {
    //            return (value != undefined && value.replace(/^\s+|\s+$/g, "") != "");
    //        },
    //        regex: function (value, rs) {
    //            var r = (rs.option == undefined) ? new RegExp(rs.rstr) :
    //                new RegExp(rs.rstr, rs.option);

    //            return r.test(value)
    //        }
    //    }

    //    p.getListHtml = function (item, noContainer) {
    //        var html = new Array();
    //        var fobj = this;
    //        if (noContainer == null || noContainer == false)
    //            html.push("<select name='" + item.name + "' class='kf-" + item.type + " kf-" + item.type + "-" + item.name + "'>");

    //        //判断是否自动获取数据并且有action属性，是则采用ajax请求数据填充列表

    //        if ((item.isAutoGet == undefined || item.isAutoGet == true) &&
    //            item.action != undefined && item.action != "") {
    //            var dom = $(this.render).find(".kf-list-" + item.name)[0];

    //            this.postHandle(item.action, null, function (result) {
    //                html.push(p.getOptionHtml.call(fobj, result, item));
    //            });
    //        }
    //        else
    //            html.push(p.getOptionHtml.call(this, item.data, item));

    //        if (noContainer == null || noContainer == false)
    //            html.push("</select>");
    //        return html.join("");
    //    };



    //    p.getOptionHtml = function (data, item) {
    //        if (data == null)
    //            return;

    //        var html = new Array();
    //        //使用的字段textField表示显示字段，dataField表示数据字段
    //        var textField, dataField;

    //        if (item.dataField != null && item.textField != null) {
    //            dataField = item.dataField;
    //            textField = item.dataField;
    //        }
    //        else if (data[0].text != null && data[0].value != null) {
    //            dataField = "value";
    //            textField = "text";
    //        }
    //        else {
    //            var i = 0;
    //            for (var j in data[0]) {
    //                if (i < 2) {
    //                    if (i == 0)
    //                        dataField = j;
    //                    else if (i == 1)
    //                        textField = j;
    //                    i++;
    //                }
    //                else
    //                    break;
    //            }
    //        }

    //        for (var i = 0; i < data.length; i++) {
    //            html.push("<option value='" + data[i][dataField] + "'");
    //            if (this.initValues[item.name] != null && this.initValues[item.name] == data[i][dataField])
    //                html.push(" selected='selected' ");
    //            else if (item.selectedIndex != null && item.selectedIndex == i)
    //                html.push(" selected='selected' ");
    //            else if (item.selectedValue != null && item.selectedValue == data[i][dataField])
    //                html.push(" selected='selected' ");
    //            html.push(">");
    //            html.push(data[i][textField]);
    //            html.push("</option>");
    //        }

    //        return html.join("");

    //    };











    //增加类型
    fi.addType({
        type: 'txt',
        getHtml: function () {
            return "<input name='@name' type='text' value='@value' @attr />"
        },
        getValue: function () {
            return this.form.get(this.item.name).$el.val();
        }
    }).addType({
        type: 'msg',
        getHtml: function () {
            return "<span  name='@name' @attr>@value</span>";
        },
        getValue: function () {
            return this.form.get(this.item.name).$el.html();
        }
    }).addType({
        type: 'list',
        init: function () {
            if (typeof this.dataField === 'undefined' && typeof this.textField === 'undefined') {
                if (Object.prototype.toString.call(this.data) == '[object Array]') {
                    this.dataField = 0;
                    this.textField = 1;
                }
                else if (typeof this.text !== 'undefined' && typeof this.value !== 'undefined') {
                    this.dataField = 'value';
                    this.textField = 'text';
                }
            }
        },
        getHtml: function () {
            return "<select name='@name' @attr>@for(var i = 0; i < data.length; i++){<option value='@data[i][dataField]'>@data[i][textField]</option>}</select>";
        },
        getValue: function () {
            return this.form.get(this.item.name).$el.find("option:selected").val();
        }
    });




})();