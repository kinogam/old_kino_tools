/// <reference path="../Script/jquery-1.6.1.min.js" />
/// <reference path="My97DatePicker/WdatePicker.js" />

(function () {
    var kino;
    if (typeof window.kino === "undefined")
        window.kino = {};

    kino = window.kino;
    var p = {
    };

    var f = window.kino.Form = function (s) {
        p.init.call(this);
        for (var i in s)
            this[i] = s[i];
        p.InitItemMap.call(this, s);
    }

    p.InitItemMap = function (s) {
        if (s == null)
            return;
        if (s.items != null && s.items.length > 0) {
            for (var i = 0; i < s.items.length; i++)
                this.itemMap[s.items[i].name] = s.items[i];
        }
        if (s.groups != null && s.groups.length > 0) {
            for (var j = 0; j < s.groups.length; j++)
                for (var i = 0; i < s.groups[j].items.length; i++)
                    this.itemMap[s.groups[j].items[i].name] = s.groups[j].items[i];
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
        this.bodyhtml = "@{groups}";
        this.gthtml = "<div class='kf-title'>@{gtitle}</div>";
        this.grouphtml = "@{gthtml}<table>@{rows}</table>";
        this.rowhtml = "<tr>@{cells}</tr>";
        this.cellhtml = "<td><span class='@{labelclass}'>@{label}:</span></td>";
        this.cellhtml += "<td>@{item}</td>";
        this.emptyCellHtml = "<td></td><td></td>";
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

    f.prototype.bind = function (render) {
        ///<summary>
        ///绑定到引用对象,设置HTML
        ///</summary>
        ///<param name="render" type="dom">引用对象</param>
        p.items2group.call(this);
        var html = new Array();
        for (var i = 0; i < this.groups.length; i++) {
            var gh;
            if (this.groups[i].name == "") {
                gh = this.grouphtml.replace("@{gthtml}", "");
            }
            else {
                var gthtml = this.gthtml.replace("@{gtitle}", this.groups[i].name);
                gh = this.grouphtml.replace("@{gthtml}", gthtml);
            }
            var items = this.groups[i].items;
            var ch = "";
            var rh = new Array();
            var vcount = 0;
            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                if (item.type != undefined) {
                    ch += p.getCellHtml.call(this, item);
                    vcount++;
                }

                //空白填充
                if (this.colnum != 1 && this.enableEmptyFix &&
                 j == items.length - 1 && vcount % this.colnum != 0) {
                    var fixnum = vcount % this.colnum;
                    for (var k = 0; k < fixnum; k++)
                        ch += this.emptyCellHtml;
                }

                if (p.isAddCell2Row(this.colnum, items.length, j, vcount)) {
                    //去掉空行
                    if (ch != "") {
                        rh.push(this.rowhtml.replace("@{cells}", ch));
                        ch = "";
                    }
                }
            }
            html.push(gh.replace("@{rows}", rh.join("")));
        }

        if (render != null)
            this.render = render;
        this.render.innerHTML = this.bodyhtml.replace("@{groups}", html.join(""));
    }

    p.isAddCell2Row = function (colnum, len, j, vcount) {
        return colnum == 1 || vcount % colnum == 0 || j == len - 1;
    };

    p.getCellHtml = function (item) {
        var type = item.type;
        if (this.isView)
            type = "msg";
        return this.cellhtml
                .replace("@{labelclass}", "k_f_label k_f_label_" + item.name)
                .replace("@{label}", item.label)
                .replace("@{item}", p.itemHtml[type].getHtml.call(this, item));
    }

    f.prototype.check = function () {
        var allCheck = true;

        for (var i = 0; i < this.groups.length; i++) {
            var items = this.groups[i].items;
            for (var j = 0; j < items.length; j++) {
                var item = items[i];
                var val = p.itemHtml[item.type].getValue.call(this, item);

                //非空约束
                if (item.required && item.required == true) {
                    allCheck = p.validate.required(val);
                    if (!allCheck)
                        break;
                }
                //正则约束
                if (item.regex != undefined && item.regex.rstr != null) {
                    allCheck = p.validate.regex(val, item.regex);
                    if (!allCheck)
                        break;
                }

            }
        }
        return {
            isSuccess: allCheck
        };
    }

    f.prototype.getParams = function () {
        ///<summary>
        ///根据表单内容获取请求json
        ///</summary>
        ///<returns type="Json" />
        var json = {};
        for (var i = 0; i < this.groups.length; i++) {
            var items = this.groups[i].items;
            for (var j = 0; j < items.length; j++) {
                if (items[j].type == undefined) {
                    if (typeof (items[j].value) == "undefined") {
                        if (this.initValues[items[j].name] != null)
                            json[items[j].name] = this.initValues[items[j].name];
                    }
                    else
                        json[items[j].name] = items[j].value;
                }
                else
                    json[items[j].name] = p.itemHtml[items[j].type].getValue.call(this, items[j]);
            }
        }
        return json;
    };

    f.prototype.getModelParam = function (modelName) {
        var json = {};
        var mn = modelName;
        if (mn == null)
            mn = "model";

        for (var i = 0; i < this.groups.length; i++) {
            var items = this.groups[i].items;
            for (var j = 0; j < items.length; j++) {
                if (items[j].type == undefined) {
                    if (typeof (items[j].value) == "undefined") {
                        if (this.initValues[items[j].name] != null)
                            json[mn + "." + items[j].name] = this.initValues[items[j].name];
                    }
                    else
                        json[mn + "." + items[j].name] = items[j].value;
                }
                else
                    json[mn + "." + items[j].name] = p.itemHtml[items[j].type].getValue.call(this, items[j]);
            }
        }

        return json;
    };




    //设置或获取html内容
    p.itemHtml = {
        msg: {
            getHtml: function (item) {
                var html = new Array();
                html.push("<span name='" + item.name + "' class='k_f_msg k_f_msg_" + item.name + "'");
                if (item.display != null && item.display == false)
                    html.push(" style='display:none' ");
                html.push(">");
                if (this.initValues[item.name] != null)
                    html.push(this.initValues[item.name]);
                else if (item.value != null)
                    html.push(item.value);

                html.push("</span>");
                return html.join("");
            },
            getValue: function (item) {
                return $(this.render).find(".k_f_msg_" + item.name).val();
            }
        },
        txt: {
            getHtml: function (item) {
                var html = new Array();
                html.push("<input type='text' name='" + item.name + "' class='k_f_txt k_f_txt_" + item.name + "'");
                if (item.display != null && item.display == false)
                    html.push(" style='display:none' ");

                if (this.initValues[item.name] != null)
                    html.push(" value='" + this.initValues[item.name] + "'");
                else if (item.value != null)
                    html.push(" value='" + item.value + "'");

                html.push(" />");
                return html.join("");
            },
            getValue: function (item) {
                return $(this.render).find(".k_f_txt_" + item.name).val();
            }
        },
        pwd: {
            getHtml: function (item) {
                var html = new Array();
                html.push("<input type='password' name='" + item.name + "' class='k_f_pwd k_f_pwd_" + item.name + "'");
                if (item.display != null && item.display == false)
                    html.push(" style='display:none' ");

                if (this.initValues[item.name] != null)
                    html.push(" value='" + this.initValues[item.name] + "'");
                else if (item.value != null)
                    html.push(" value='" + item.value + "'");

                html.push(" />");
                return html.join("");
            },
            getValue: function (item) {
                return $(this.render).find(".k_f_pwd_" + item.name).val();
            }
        },
        list: {
            getHtml: function (item) {
                return p.getListHtml.call(this, item);
            },
            getValue: function (item) {
                return $(this.render).find(".k_f_list_" + item.name + " option:selected").val();
            }
        },
        combo: {
            getHtml: function (item) {
                var render = this.render;
                var fobj = this;
                var jdom = $(this.render).find(".k_f_combo_" + item.name);
                var comboTo = this.itemMap[item.comboTo];
                jdom.live("change", function () {
                    var param = {};
                    param[comboTo.pname] = $(this).find("option:selected").val();
                    var dom = p.findDomByItem.call(fobj, comboTo);
                    fobj.postHandle(comboTo.action, param, function (result) {
                        dom.innerHTML = p.getOptionHtml.call(fobj, result, comboTo);

                    });

                });
                return p.getListHtml.call(this, item);
            },
            getValue: function () {
                return $(this.render).find(".k_f_list_" + item.name + " option:selected").val();
            }
        },
        date: {
            getHtml: function (item) {
                /**set format**/
                var html = new Array();
                var defaultRF = "yyyy-mm-dd";
                var defaultSF = "yyyy-mm-dd";
                if (item.realformat != null)
                    defaultRF = item.realformat;
                if (item.showformat != null)
                    defaultSF = item.showformat;

                /**set value**/
                var value = null;
                if (this.initValues[item.name] != null)
                    value = this.initValues[item.name];
                else if (item.value != null)
                    value = item.value;

                html.push("<input name='" + item.name + "' class='k_f_date k_f_date_" + item.name + "' type='text' ");
                html.push("onfocus=\"WdatePicker({realDateFmt:'" + DateHelper.t2my97(defaultRF) + "',")
                html.push("dateFmt:'" + DateHelper.t2my97(defaultSF) + "',readOnly:true})\"");
                if (value != null) {
                    html.push("  realvalue='");
                    if (p.isDateType(value))
                        html.push(DateHelper.date2String(value, defaultRF));
                    else if (p.isNumber(value))
                        html.push(DateHelper.getFormatDateByAddDay(value, defaultRF));
                    else
                        html.push(value);

                    html.push("'  value='");
                    if (p.isDateType(value))
                        html.push(DateHelper.date2String(value, defaultSF));
                    else if (p.isNumber(value))
                        html.push(DateHelper.getFormatDateByAddDay(value, defaultSF));
                    else
                        html.push(DateHelper.formatDateStr(value, defaultRF, defaultSF));
                    html.push("' ");
                }
                html.push(">");

                return html.join("");
            },
            getValue: function (item) {
                return $(this.render).find(".k_f_date_" + item.name).attr("realvalue");
            }
        }
    };

    p.isDateType = function (obj) {
        return Object.prototype.toString.call(obj) == "[object Date]";
    }
    p.isNumber = function (obj) {
        return typeof (obj) == "number";
    }
    p.findDomByItem = function (item) {
        return $(this.render).find(".k_f_" + item.type + "_" + item.name)[0];
    };

    //验证函数
    p.validate = {
        required: function (value) {
            return (value != undefined && value != "");
        },
        regex: function (value, rs) {
            var r = (rs.option == undefined) ? new RegExp(rs.rstr) :
                new RegExp(rs.rstr, rs.option);

            return r.test(value)
        }
    }

    p.getListHtml = function (item, noContainer) {
        var html = new Array();
        var fobj = this;
        if (noContainer == null || noContainer == false)
            html.push("<select name='" + item.name + "' class='k_f_" + item.type + " k_f_" + item.type + "_" + item.name + "'>");

        //判断是否自动获取数据并且有action属性，是则采用ajax请求数据填充列表

        if ((item.isAutoGet == undefined || item.isAutoGet == true) &&
            item.action != undefined && item.action != "") {
            var dom = $(this.render).find(".k_f_list_" + item.name)[0];

            this.postHandle(item.action, null, function (result) {
                html.push(p.getOptionHtml.call(fobj, result, item));
            });
        }
        else
            html.push(p.getOptionHtml.call(this, item.data, item));

        if (noContainer == null || noContainer == false)
            html.push("</select>");
        return html.join("");
    };



    p.getOptionHtml = function (data, item) {
        if (data == null)
            return;

        var html = new Array();
        //使用的字段textField表示显示字段，dataField表示数据字段
        var textField, dataField;

        if (item.dataField != null && item.textField != null) {
            dataField = item.dataField;
            textField = item.dataField;
        }
        else if (data[0].text != null && data[0].value != null) {
            dataField = "value";
            textField = "text";
        }
        else {
            var i = 0;
            for (var j in data[0]) {
                if (i < 2) {
                    if (i == 0)
                        dataField = j;
                    else if (i == 1)
                        textField = j;
                    i++;
                }
                else
                    break;
            }
        }

        for (var i = 0; i < data.length; i++) {
            html.push("<option value='" + data[i][dataField] + "'");
            if (this.initValues[item.name] != null && this.initValues[item.name] == data[i][dataField])
                html.push(" selected='selected' ");
            else if (item.selectedIndex != null && item.selectedIndex == i)
                html.push(" selected='selected' ");
            else if (item.selectedValue != null && item.selectedValue == data[i][dataField])
                html.push(" selected='selected' ");
            html.push(">");
            html.push(data[i][textField]);
            html.push("</option>");
        }

        return html.join("");

    };



    var DateHelper = window.DateHelper = {
        string2Date: function (datestr, format) {
            ///<summary>
            ///日期字符串转换成Date类型
            ///</summary>
            ///<param name="datestr" type="String">时间字符串</param>
            ///<param name="format" type="String">时间格式，如 yyyy-mm-dd hh24:mi</param>
            ///<returns type="Date"/>

            var date = p.getInitDate();

            var list = new Array();
            list.push({ txt: "yyyy", index: format.indexOf("yyyy"), len: 4 });
            list.push({ txt: "mm", index: format.indexOf("mm"), len: 2 });
            list.push({ txt: "dd", index: format.indexOf("dd"), len: 2 });
            list.push({ txt: "hh24", index: format.indexOf("hh24"), len: 2 });
            list.push({ txt: "mi", index: format.indexOf("mi"), len: 2 });
            list.push({ txt: "ss", index: format.indexOf("ss"), len: 2 });

            //清除不存在的格式
            var templist = new Array();
            for (var i = 0; i < list.length; i++) {
                if (list[i].index != -1)
                    templist.push(list[i]);
            }

            list = templist;



            for (var i = 0; i < list.length; i++) {
                var rstr = p.getCurrentRStr(list, format, list[i].txt);
                var r = new RegExp(rstr);
                p.setDate[list[i].txt].call(null, date, r.exec(datestr)[1]);
            }

            return date;
        },

        date2String: function (date, format) {
            ///<summary>
            ///Date类型转换成日期字符串
            ///</summary>
            ///<param name="date" type="Date"/>
            ///<param name="format" type="String"/>
            ///<returns type="Date"/>
            var str = format.replace("yyyy", date.getFullYear());
            str = str.replace("mm", /\d{2}$/.exec("0" + String(date.getMonth() + 1)));
            str = str.replace("dd", /\d{2}$/.exec("0" + String(date.getDate())));
            str = str.replace("hh24", /\d{2}$/.exec("0" + String(date.getHours())));
            str = str.replace("mi", /\d{2}$/.exec("0" + String(date.getMinutes())));
            str = str.replace("ss", /\d{2}$/.exec("0" + String(date.getSeconds())));
            return str;
        },
        addDays: function (date, i) {
            var tempdate = new Date();
            tempdate.setTime(date.getTime() + i * 86400000);
            return tempdate;
        },
        formatDateStr: function (dateStr, oldformat, newformat) {
            var date = DateHelper.string2Date(dateStr, oldformat);
            return DateHelper.date2String(date, newformat);
        },
        getFormatDateByAddDay: function (i, format) {
            ///<summary>
            ///通过输入天数和日期格式字符串来获取转换后的日期字符串
            ///</summary>
            ///<param name="i" type="Number">天数，小时使用 n/24，分钟试用　n/1440</param>
            ///<param name="format" type="String">日期格式字符串，如yyyy-mm-dd</param>
            ///<returns type="String"/>
            if (!/^-?\d+$/.test(String(i)))
                return;

            var date = new Date();
            date = DateHelper.addDays(date, i);
            return DateHelper.date2String(date, format);
        },
        t2my97: function (oformat) {
            return oformat.replace("mm", "MM").replace("hh24", "HH").replace("mi", "mm");
        }
    };

    p.getCurrentRStr = function (list, format, dtype) {
        var newformat = format;

        for (var i = 0; i < list.length; i++) {
            if (list[i].txt == dtype)
                newformat = newformat.replace(dtype, "(\\d{1," + list[i].len + "})");
            else
                newformat = newformat.replace(list[i].txt, "\\d{1," + list[i].len + "}");
        }
        return newformat;
    };
    p.getInitDate = function () {
        var date = new Date();
        date.setFullYear(0);
        date.setMonth(-1);
        date.setDate(0);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    };

    p.setDate = {
        "yyyy": function (date, value) {
            date.setFullYear(value);
        },
        "mm": function (date, value) {
            var mnum = Number(value) - 1;
            date.setMonth(mnum);
        },
        "dd": function (date, value) {
            date.setDate(value);
        },
        "hh24": function (date, value) {
            date.setHours(value);
        },
        "mi": function (date, value) {
            date.setMinutes(value);
        },
        "ss": function (date, value) {
            date.setSeconds(value);
        }
    };



})();
