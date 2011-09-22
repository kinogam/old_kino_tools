/*!
* KStore JavaScript Library
* Copyright 2011, Kinogam
* Date: 2011-04-04
*/
(function () {

    var store = function (data) {
        if (data !== null && Object.prototype.toString.call(data) == "[object Array]") {
            var store = new kino.Store();
            store.data = data;
            return store;
        }
        else
            this.initStore();
    }


    store.prototype = {
        initStore: function () {
            this.data = null;
            this.initController();
            this.initAjax();
            this.ajaxHandle = KAjax;
        },
        initController: function () {
            ///<summary>
            ///init kstore's controller
            ///</summary>
            this.controller = {
                skipNum: 0,
                takeNum: 0,
                sortCols: null,
                groupbyCols: null,
                orderbyExp: "",
                whereExp: "",
                selectExp: "",
                groupbyExp: ""
            };
        },
        initAjax: function () {
            ///<summary>
            ///init kstore's ajax property
            ///</summary>
            this.ajax = {
                action: null,
                type: "POST",
                enable: false,
                index: 0,
                size: 100,
                hasNext: false
            }
        },
        query: function (callback) {
            ///<summary>
            ///get data by query,every call will init controller's property
            ///when ajax.enable = true, it send ajax request and get data
            //</summary>
            ///<param name="callback" type="Function">
            ///callback function,after query
            ///</param>
            try {
                if (this.ajax.enable) {
                    if (this.ajax.index == 0 && this.data != null && !this.ajax.hasNext)
                        return this.localQuery(callback);
                    else
                        return this.ajaxQuery(callback);
                }
                else
                    return this.localQuery(callback);

            }
            catch (e) {
                throw e.Message;
            }
            finally {
                this.initController();
            }
        },
        localQuery: function (callback) {
            ///<summary>
            ///execute a local query
            ///</summary>
            ///<param name="callback" type="Function">
            ///callback function,after query
            ///</param>
            ///<return type="Array"></return>
            var result = this.data;

            result = private.filteHandle(this, result);
            result = private.selectHandle(this, result);
            result = private.sortHandle(this, result);
            result = private.skipTakeHandle(this, result);
            if (callback != null)
                callback.call(null, result);
            return result;
        },
        ajaxQuery: function (callback) {
            ///<summary>
            ///execute a ajax query
            ///</summary>
            ///<param name="callback" type="Function">
            ///callback function,after query
            ///</param>
            ///<return type="Array"></return>

            this.ajax.controller = this.controller;
            private.getAjaxData(this, callback);
        },
        select: function (exp) {
            ///<summary>
            ///set select expression
            ///</summary>
            ///<param name="exp" type="String">
            ///select expression, format like "col1,col2,col3"
            ///</param>
            ///<return type="KStore"></return>
            if (exp != null)
                this.controller.selectExp = exp;
            return this;
        },
        skip: function (num) {
            ///<summary>
            ///set skip number
            ///</summary>
            ///<param name="num" type="Number">
            ///skip number
            ///</param>
            ///<return type="KStore"></return>
            this.controller.skipNum = num;
            return this;
        },
        take: function (num) {
            ///<summary>
            ///set how much data row you want to get
            ///</summary>
            ///<param name="num" type="Number">
            ///row length
            ///</param>
            ///<return type="KStore"></return>
            this.controller.takeNum = num;
            return this;
        },
        orderby: function (exp) {
            ///<summary>
            ///set data column's sort
            ///</summary>
            ///<param name="exp" type="String">
            ///sort expression, format like "hour desc,module,avg asc"
            ///</param>
            ///<return type="KStore"></return>

            var exsp = exp.split(/\s*,\s*/);
            var orderCols = new Array();

            for (var i = 0; i < exsp.length; i++) {
                var item = exsp[i].split(/\s+/);
                var _isASC = true;
                if (item[1] != null && item[1].toLowerCase() == "desc") {
                    _isASC = false;
                }

                orderCols.push({
                    name: item[0].replace(/^{|}$/g, ""),
                    isASC: _isASC
                });
            }

            this.controller.sortCols = orderCols;
            //let server page handle this expression
            this.controller.orderbyExp = exp;
            return this;
        },
        groupby: function (exp) {
            ///<summary>
            ///set aggregation columns
            ///</summary>
            ///<param name="exp" type="String">
            ///aggregation expression, format like "hour,module"
            ///</param>
            ///<return type="KStore"></return>

            if (!/^(?:\s*[^\s]+\s*(?:,|$))+$/.test(exp))
                throw "wrong group by expression";

            var exsp = exp.split(/\s*,\s*/);
            var _groupbyCols = new Array();

            for (var i = 0; i < exsp.length; i++) {
                _groupbyCols.push({
                    name: exsp[i],
                    isASC: true
                });
            }

            this.controller.groupbyCols = _groupbyCols;
            this.controller.groupbyExp = exp;
            return this;
        },
        where: function (exp) {
            ///<summary>
            ///set data condition
            ///</summary>
            ///<param name="exp" type="String">
            ///filte expression, format like "hour='08' and num=6"
            ///</param>
            ///<return type="KStore"></return>
            if (exp != null)
                this.controller.whereExp = exp;
            return this;
        },
        getNext: function (callback) {
            this.ajax.index++;
            private.getAjaxData(this, callback);
        },
        getPrev: function (callback) {
            this.ajax.index--;
            private.getAjaxData(this, callback);
        }

    }

    var private = {

        ///<summary>
        ///inner private class
        ///</summary>
        selectHandle: function (store, result) {
            if (store.controller.selectExp == "")
                return result;
            var ss = private.getSelectStruct(store.controller.selectExp);

            if (ss.isDistinct)
                return private.distinct(ss, result);
            else if (ss.isAgr)
                return private.aggregation(store.controller.groupbyCols, ss, result);
            else
                return private.normalSelect(ss, result);
        },
        getSelectStruct: function (exp) {
            //expitem struct is {method:null,params:new Array(),alias:null}
            var ss = {
                isAgr: false,
                isDistinct: false,
                expItems: new Array()
            };

            //check select expression format,  prefixion(option) col1,col2 alias2,cols || 'text' alias, 
            //or use sum,avg,max,min by gourpby columns
            var format = /^\s*(?:(distinct)\s+)?((?:(?:\s*(?:(?:[^|\s,']+|'[^']+')\s*\|\|\s*)*(?:[^|\s,']+|'[^']+')(?:\s+[^|\s,']+)?\s*)(?:,|$))+)$/;
            if (format.test(exp)) {
                var sp = format.exec(exp);
                if (sp[1] != null && sp[1] != "")
                    ss.isDistinct = true
                var sr = /(?:((?:\s*(?:(?:[^|\s,']+|'[^']+')\s*\|\|\s*)*(?:[^|\s,']+|'[^']+')(?:\s+[^|\s,']+)?\s*))(?:,|$))/g;

                var ci;
                var cols = new Array();
                while ((ci = sr.exec(sp[2])) != null && ci != "") {
                    cols.push(ci[1]);
                }
                var _params = new Array();

                //set expItems
                for (var i = 0; i < cols.length; i++) {

                    //check aggregation
                    var r1 = /^(avg|sum|count|max|min)\(([^)]+)\)(?:\s+([^|\s']+))?$/;

                    //check columns and string join
                    var r2 = /^((?:(?:[^|\s,']+|'[^']+')\s*\|\|\s*)+(?:[^|\s,']+|'[^']+'))(?:\s+([^|\s']+))?$/;

                    //most normal format
                    var r3 = /^([^\s]+|'[^']+')(?:\s+(.*))?$/;

                    if (r1.test(cols[i])) {
                        ss.isAgr = true;

                        var ps = r1.exec(cols[i]);

                        ss.expItems.push({
                            method: ps[1],
                            params: [{ type: "col", val: ps[2].replace(/^{|}$/g, "")}],
                            alias: ps[3]
                        });

                    }
                    else if (r2.test(cols[i])) {
                        var ps = r2.exec(cols[i]);
                        var item = {};
                        item.method = "join";

                        if (ps[2] != null && ps[2] != "")
                            item.alias = ps[2];
                        else
                            item.alias = ps[1];

                        var r = /(?:([^\s]+)\s*(?:\|\||$))+/g;

                        var x;
                        var _params = new Array();

                        while ((x = r.exec(ps[1])) != null && x != "") {
                            var _type;
                            var _val = x[1];
                            if (/^'[^']+'$/.test(_val)) {
                                _type = "string";
                                _val = _val.replace(/^'|'$/g, "");
                            }
                            else {
                                _type = "col";
                                _val = _val.replace(/^{|}$/g, "");
                            }

                            _params.push({
                                type: _type,
                                val: _val
                            });
                        }
                        item.params = _params;
                        ss.expItems.push(item);
                    }
                    else {
                        var ps = r3.exec(cols[i]);
                        var item = {};
                        item.method = null;
                        item.alias = ps[2];

                        var _type;
                        var _val = ps[1];
                        if (/^'[^']+'$/.test(_val)) {
                            _type = "string";
                            _val = _val.replace(/^'|'$/g, "");
                        }
                        else {
                            _type = "col";
                            _val = _val.replace(/^{|}$/g, "");
                        }
                        item.params = [{ type: _type, val: _val}];
                        ss.expItems.push(item);
                    }
                }
            }
            else {
                throw "wrong select expression !!";
            }

            return ss;
        },
        normalSelect: function (selectStruct, result) {
            var newdata = new Array();
            for (var i = 0; i < result.length; i++) {
                newdata.push(private.getItem(selectStruct, result[i]));
            }
            return newdata

        },
        getItem: function (selectStruct, dataRow) {
            var item;
            if (Object.prototype.toString.call(dataRow) == "[object Array]")
                item = new Array();
            else
                item = {};
            for (var j = 0; j < selectStruct.expItems.length; j++) {

                var val = "";
                var key = "";
                var expItem = selectStruct.expItems[j];

                if (expItem.alias != null && expItem.alias != "")
                    key = expItem.alias;
                else
                    key = expItem.params[0].val;

                for (var k = 0; k < expItem.params.length; k++) {
                    var param = expItem.params[k];
                    if (param.type == "col")
                        val += dataRow[param.val];
                    else if (param.type == "string")
                        val += param.val;

                }
                item[key] = val;
            }
            return item;
        },

        distinct: function (selectStruct, result) {
            var dcols = new Array();
            var newdata = new Array();
            for (var i = 0; i < selectStruct.expItems.length; i++) {
                var item = selectStruct.expItems[i];
                for (var j = 0; j < item.params.length; j++) {
                    if (item.params[j].type == "col")
                        dcols.push(item.params[j].val);
                }
            }

            var colNames = new Array();
            for (var i = 0; i < dcols.length; i++) {
                colNames.push({
                    name: dcols[i],
                    isASC: false
                });
            }

            //get a sorted array
            var tempdata = private.kmSort({
                data: result,
                cols: colNames
            });


            var lv = null;

            for (var i = 0; i < tempdata.length; i++) {
                var cv = "";
                for (var j = 0; j < dcols.length; j++) {
                    cv += tempdata[i][dcols[j]];
                }

                if (lv != cv) {
                    lv = cv;
                    newdata.push(private.getItem(selectStruct, result[i]));
                }
            }
            return newdata;
        },
        aggregation: function (groupbyCols, selectStruct, result) {
            var newdata = new Array();
            var sortdata = private.kmSort({
                data: result,
                cols: groupbyCols
            });

            var lv = null;
            var crow = null;
            var gl = 0;
            for (var i = 0; i < sortdata.length; i++) {
                var cv = "";
                for (var j = 0; j < groupbyCols.length; j++) {
                    cv += sortdata[i][groupbyCols[j].name];
                }

                if (crow == null) {
                    crow = private.getItem(selectStruct, sortdata[i]);
                }



                if (lv != cv) {
                    if (lv != null && crow != null) {
                        newdata.push(crow);
                        crow = private.getItem(selectStruct, sortdata[i]);
                        gl = 0;
                    }
                    lv = cv;
                }
                else {
                    for (var k = 0; k < selectStruct.expItems.length; k++) {
                        if (selectStruct.expItems[k].method != null)
                            private["setagr_" + selectStruct.expItems[k].method].call(null,
                             crow, selectStruct.expItems[k], sortdata[i], gl);
                    }
                }

                gl++;
            }

            newdata.push(crow);

            return newdata;
        },
        setagr_sum: function (crow, expItem, rowdata) {
            crow[expItem.alias] =
            Number(crow[expItem.alias]) +
            Number(rowdata[expItem.params[0].val]);
        },
        setagr_avg: function (crow, expItem, rowdata, gl) {
            crow[expItem.alias] = (Number(crow[expItem.alias]) * gl +
            Number(rowdata[expItem.params[0].val])) / (gl + 1);
        },
        setagr_max: function (crow, expItem, rowdata) {
            if (rowdata[expItem.params[0].val] > crow[expItem.alias])
                crow[expItem.alias] = rowdata[expItem.params[0].val];
        },
        setagr_min: function (crow, expItem, rowdata) {
            if (rowdata[expItem.params[0].val] < crow[expItem.alias])
                crow[expItem.alias] = rowdata[expItem.params[0].val];
        },
        skipTakeHandle: function (store, result) {
            if (store.controller.takeNum == 0)
                return result.slice(store.controller.skipNum);
            else
                return result.slice(store.controller.skipNum, store.controller.skipNum + store.controller.takeNum);
        },
        sortHandle: function (store, result) {
            if (store.controller.sortCols != null) {
                return private.kmSort({
                    data: result,
                    cols: store.controller.sortCols
                });
            }
            return result;
        },
        kmSort: function (s) {
            var newdata = s.data.slice(0);

            var mlist = new Array();
            var slist;
            var templist;

            //single col handle
            if (s.cols != null && s.cols.length > 1) {
                for (var j = 0; j < s.cols.length - 1; j++) {

                    if (j == 0) {
                        if (s.cols[j].isASC)
                            newdata.sort(function (a, b) { return a[s.cols[j].name] > b[s.cols[j].name] ? 1 : -1; });
                        else
                            newdata.sort(function (a, b) { return a[s.cols[j].name] > b[s.cols[j].name] ? -1 : 1; });
                        mlist = newdata;

                    }

                    var tval = null;
                    slist = new Array();
                    templist = new Array();

                    for (var i = 0; i < mlist.length; i++) {
                        var cval = "";
                        for (var k = 0; k < j + 1; k++) {
                            cval += mlist[i][s.cols[k].name] + ",";
                        }
                        cval = cval.replace(/,$/, "");

                        if (tval == null) {
                            tval = cval;
                            slist.push(mlist[i]);
                        }
                        else if (tval == cval) {
                            slist.push(mlist[i]);
                        }
                        else {
                            if (s.cols[j + 1].isASC)
                                slist.sort(function (a, b) { return a[s.cols[j + 1].name] > b[s.cols[j + 1].name] ? 1 : -1; });
                            else
                                slist.sort(function (a, b) { return a[s.cols[j + 1].name] > b[s.cols[j + 1].name] ? -1 : 1; });

                            templist = templist.concat(slist);

                            cval = "";
                            for (var k = 0; k < j + 1; k++) {
                                cval += mlist[i][s.cols[k].name] + ",";
                            }
                            cval = cval.replace(/,$/, "");


                            slist = new Array();
                            tval = cval;
                            slist.push(mlist[i]);
                        }

                    }
                    if (slist.length > 0) {
                        if (s.cols[j + 1].isASC)
                            slist.sort(function (a, b) { return a[s.cols[j + 1].name] > b[s.cols[j + 1].name] ? 1 : -1; });
                        else
                            slist.sort(function (a, b) { return a[s.cols[j + 1].name] > b[s.cols[j + 1].name] ? -1 : 1; });

                        mlist = templist.concat(slist);

                    }

                }
                return mlist;
            }
            else {
                if (s.cols[0].isASC)
                    newdata.sort(function (a, b) { return a[s.cols[0].name] > b[s.cols[0].name] ? 1 : -1; });
                else
                    newdata.sort(function (a, b) { return a[s.cols[0].name] > b[s.cols[0].name] ? -1 : 1; });

                return newdata;
            }
        },
        filteHandle: function (store, result) {

            if (store.controller.whereExp == "")
                return result;

            var newdata = new Array();
            var operator = {
                "=": function (a, b) { return a == b; },
                "<": function (a, b) { return a < b; },
                ">": function (a, b) { return a > b; }
            }
            var explist = store.controller.whereExp.split(/\s*and\s*/);
            var checklist = new Array();
            for (var i = 0; i < explist.length; i++) {
                if (/\s*([^<=>]+)\s*([<=>])\s*([^<=>]+)\s*/.test(explist[i])) {
                    var rs = /\s*([^<=>]+)\s*([<=>])\s*([^<=>]+)\s*/.exec(explist[i]);
                    checklist.push({ a: rs[1].replace(/^\s+|\s+$/g, ""), b: rs[3].replace(/^\s+|\s+$/g, ""), opr: rs[2] });
                }
            }


            for (var i = 0; i < result.length; i++) {
                var cc = true;
                for (var j = 0; j < checklist.length; j++) {
                    var a = result[i][checklist[j].a];
                    var b = checklist[j].b;

                    a = typeof (a) == "string" ? a.replace(/^'|'$/g, "") : a;
                    b = typeof (b) == "string" ? b.replace(/^'|'$/g, "") : b;
                    if (!operator[checklist[j].opr].call(null, a, b)) {
                        cc = false;
                        break;
                    }
                }
                if (cc)
                    newdata.push(result[i]);
            }
            return newdata;
        },
        getAjaxData: function (store, callback) {
            var setting = {
                type: store.ajax.type,
                action: store.ajax.action,
                param: {
                    index: store.ajax.index,
                    size: store.ajax.size,
                    orderby: store.ajax.controller.orderbyExp,
                    where: store.ajax.controller.whereExp,
                    select: store.ajax.controller.selectExp,
                    groupby: store.ajax.controller.groupbyExp
                },
                success: function (result, setting) {
                    if (typeof (result) == "string")
                        eval("store.data = " + result);
                    else
                        store.data = result;

                    if (store.data.length > store.ajax.size) {
                        store.ajax.hasNext = true;
                        store.data.pop();
                    }
                    else
                        store.hasNext = false;

                    if (callback != null)
                        callback.call(null, result, setting);
                }
            };

            store.ajaxHandle(setting);
        }
    }



    var KAjax = function (s) {
        ///<summary>
        ///a function for calling ajax
        ///</summary>
        ///<param name="s" type="Json">
        ///json format: {
        //action : "";
        //type : "POST";
        //param : null;
        //async : true;
        //success : null;
        //error : null;
        //xmlHttp : KAjaxHandler.getXmlHttpRequest();
        //}

        var x = new KAjaxHandler();
        x.setMember(s);

        x.xmlHttp.onreadystatechange = function () {
            if (x.xmlHttp.readyState == 4 && ((x.xmlHttp.status >= 200 && x.xmlHttp.status < 300)
                 || x.xmlHttp.status == 304 || x.xmlHttp.status == 1223)) {
                if (x.success)
                    x.success.call(x, x.xmlHttp.responseText);
            }
            else if (x.xmlHttp.readyState == 4) {
                if (x.error)
                    x.error.call(x, x.xmlHttp.responseText);
            }
        }
        x.xmlHttp.open(x.type, x.action, x.async);
        try {
            x.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            x.xmlHttp.send(KAjaxHandler.json2url(x.param));
        }
        catch (e) {
        }
    }

    var KAjaxHandler = function () {
        this.action = "";
        this.type = "POST";
        this.param = null;
        this.async = true;
        this.success = null;
        this.error = null;
        this.xmlHttp = KAjaxHandler.getXmlHttpRequest();
    }
    KAjaxHandler.prototype.setMember = function (s) {
        if (s != null) {
            for (var i in s) {
                this[i] = s[i];
            }
        }
    }
    KAjaxHandler.getXmlHttpRequest = function () {
        return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

    }
    KAjaxHandler.json2url = function (json) {
        var url = "";
        for (var i in json) {
            if (json[i] != null)
                url += "&" + encodeURIComponent(i) + "=" + encodeURIComponent(json[i]);
            else
                url += "&" + encodeURIComponent(i) + "=";
        }
        return url.replace(/^&/, "");
    }

    // Module
    if (typeof module != 'undefined' && module.exports) {
        module.exports = store;
    }
    else {
        this.kino = this.kino ? this.kino : {};
        this.kino.Store = store;
    }

})();