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

            if (typeof s.extend !== 'undefined') {
                var extend = this._itemTypeHash[s.extend];
                for (var i in extend)
                    if (typeof s[i] === 'undefined')
                        s[i] = extend[i];
            }
            //check if the new type implement getValue and getHtml method
            if (typeof s.getValue === "undefined" || typeof s.getHtml === "undefined")
                throw new Error("not yet emplement getValue or getHtml method");
            this._itemTypeHash[s.type] = s;
            return this;
        },
        removeType: function (typeName) {
            delete this._itemTypeHash[typeName];
        },
        getType: function (typeName) {
            return this._itemTypeHash[typeName];
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
        this.afterList = new Array();
        this.groups = new Array();
        this.initValues = {};
        this.itemMap = {};
        this.colnum = 1;
        this.enableEmptyFix = true;
        this.isView = false;

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
        var that = this;


        if (typeof item.type !== 'undefined') {
            var itemType = fi.getType(item.type);
            //初始化item
            if (typeof itemType.init === 'function')
                itemType.init.call(item);

            //添加到绑定后触发队列
            if (typeof itemType.after === 'function')
                this.afterList.push(function () {
                    var _item = this.get(item.name);
                    itemType.after.call(this, _item);
                });
        }

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
        var that = this;
        this.render = render || this.render;

        var itemList = new Array();
        for (var itemName in this.itemMap) {
            var item = this.itemMap[itemName];

            //判断类型来决定是否生成UI
            if (typeof item.type !== 'undefined')
                itemList[itemList.length] = {
                    obj: item,
                    html: p.getCellHtml.call(this, item)
                }

            //监听事件
            if (typeof item.event !== 'undefined') {
                for (var itemEvent in item.event) {
                    var currentEvent = item.event[itemEvent];
                    $(this.render).on(itemEvent, "[name='" + item.name + "']", function (e) {
                        currentEvent.call(this, e, that);
                    });
                }
            }
        }
        var html = kino.template(f.templateStr, { items: itemList }, { enableCleanMode: true, enableEscape: false });
        this.render.innerHTML = html;

        //处理after列表
        for (var i = 0; i < this.afterList.length; i++)
            this.afterList[i].call(this);
    };

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
        var templateText = fi.getType(item.type).getHtml();

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

    p.isAddCell2Row = function (colnum, len, j, vcount) {
        return colnum == 1 || vcount % colnum == 0 || j == len - 1;
    };

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
                    var itemType = fi.getType(items[j].type);
                    json[mn + items[j].name] = itemType.getValue.call({ form: this, item: items[j] });
                }
            }
        }

        return json;
    };

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
                if (Object.prototype.toString.call(this.data[0]) == '[object Array]') {
                    this.dataField = 0;
                    this.textField = 1;
                }
                else if (typeof this.data[0].text !== 'undefined' && typeof this.data[0].value !== 'undefined') {
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