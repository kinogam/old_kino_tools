/// <reference path="Form.js" />
/// <reference path="../qunit/qunit.js" />
/// <reference path="../Script/jquery-1.6.1.min.js" />
/// <reference path="My97DatePicker/WdatePicker.js" />


module("bind");


test("set render in constrator agurment", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "item1",
            label: "名字",
            type: "txt"
        }]
    });

    f.bind();

    notEqual(f.render.innerHTML, null);
});

test("use addItem method for adding", function () {
    var f = new kino.Form();
    f.addItem({
        name: "item1",
        label: "名字",
        type: "txt"
    });

    f.addItem({
        name: "item2",
        label: "名字2",
        type: "txt"
    });

    equal(f.groups[0].items.length, 2);
});

test("item name test", function () {
    var f = new kino.Form();
    f.render = document.createElement("div");
    f.addItem({
        name: "item1",
        label: "名字",
        type: "txt"
    });

    f.addItem({
        name: "item2",
        label: "名字2",
        type: "txt"
    });

    f.bind();

    equal($(f.render).find("[name=item1]").length, 1);
    equal($(f.render).find("[name=item2]").length, 1);
});



test("display none test", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "label",
            label: "标签",
            type: "txt"
        },
        {
            name: "tips",
            label: "提示",
            type: "txt",
            display: false
        }]
    });

    f.bind();
    var display = $(f.render).find(".kf-txt-tips")[0].style.display;

    equal(display, "none");
});

test("no type no display still can use getParams", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [
        {
            name: "show",
            type: "txt",
            label: "txt item"
        },
        {
            name: "col1",
            value: "hv1"
        },
        {
            name: "col2",
            value: "hv2"
        }]
    });

    f.bind();
    notEqual(f.render.innerHTML, "");
    var param = f.getParams();
    equal(param.col1, "hv1");
    equal(param.col2, "hv2");
});

test("no type item with setValues test", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [
        {
            name: "show",
            type: "txt",
            label: "txt item"
        },
        {
            name: "col1"
        },
        {
            name: "col2"
        }]
    });

    f.setValues({
        col1: "hv1",
        col2: "hv2"
    });

    f.bind();

    var param = f.getParams();
    equal(param.col1, "hv1");
    equal(param.col2, "hv2");

    var model = f.getModelParam();
    equal(model["model.col1"], "hv1");
    equal(model["model.col2"], "hv2");
});

module("item type");

test("msg type test", function () {
    var f = new kino.Form({
        items: [{
            name: "item1",
            label: "名字",
            type: "msg",
            value: "hellomsg"
        }]
    });
    var render = document.createElement("div");
    f.bind(render);
    equal($(render).find("span.kf-msg-item1").html(), "hellomsg");
});

test("txt test", function () {
    var f = new kino.Form({
        items: [{
            name: "item1",
            label: "名字",
            type: "txt"
        }]
    });
    var render = document.createElement("div");
    f.bind(render);

    notEqual(render.innerHTML, null);

    equal($(render).find("span.kf-label").length, 1);
    equal($(render).find("span.kf-label-item1").length, 1);
    equal($(render).find("input.kf-txt").length, 1);
    equal($(render).find("input.kf-txt-item1").length, 1);
});

test("txt default value test", function () {
    var f = new kino.Form({
        items: [{
            name: "item1",
            label: "名字",
            type: "txt",
            value: "hello"
        }]
    });
    var render = document.createElement("div");
    f.bind(render);
    notEqual(render.innerHTML, null);
    equal($(render).find(".kf-txt").val(), "hello");
});

test("list test", function () {
    var f = new kino.Form();
    f.renderTo(document.createElement("div"));
    f.addItem({
        type: "list",
        name: "list1",
        label: "下拉列表",
        data: [{ a: "1", b: "2" }, { a: "a1", b: "b2"}],
        dataField: "a",
        textField: "b"
    });

    f.bind();

    notEqual(f.render.innerHTML, null);
    equal($(f.render).find(".kf-list-list1").length, 1);
});

test("list default field test", function () {
    var f = new kino.Form();
    f.renderTo(document.createElement("div"));
    f.addItem({
        type: "list",
        name: "list1",
        label: "下拉列表",
        data: [{ ax: "a11", b: "b22", c: "3" }, { ax: "a1", b: "b2", c: "c3"}]
    });

    f.bind();

    notEqual(f.render.innerHTML, null);
    equal($(f.render).find(".kf-list-list1 option")[0].value, "a11");
    equal($(f.render).find(".kf-list-list1 option")[0].innerHTML, "b22");
});

test("list default use text and value column for textField and dataField", function () {
    var f = new kino.Form();
    f.renderTo(document.createElement("div"));
    f.addItem({
        type: "list",
        name: "list1",
        label: "下拉列表",
        data: [{ ax: "a11", value: "b22", text: "c33" }, { ax: "a1", value: "bx2", text: "cx3"}]
    });

    f.bind();

    notEqual(f.render.innerHTML, null);
    equal($(f.render).find(".kf-list-list1 option")[0].value, "b22");
    equal($(f.render).find(".kf-list-list1 option")[0].innerHTML, "c33");
});

test("ajax list bind test", function () {
    var f = new kino.Form();
    //mock ajax请求函数
    f.postHandle = function (action, param, callback) {
        callback.call(null, [{ ax: "a11", b: "b22", c: "3" }, { ax: "a111", b: "b222", c: "c3"}]);
    };

    f.renderTo(document.createElement("div"));
    f.addItem({
        name: "al1",
        label: "AJAX下拉列表",
        type: "list",
        action: "GetListData"
    });

    f.bind();
    notEqual(f.render.innerHTML, null);
    equal($(f.render).find(".kf-list-al1 option")[0].value, "a11");
    //    equal($(f.render).find(".kf-list_al1 option")[0].innerHTML, "b22");
});


test("combo bind test", function () {
    var f = new kino.Form();

    f.postHandle = function (action, param, callback) {
        callback([{ id: "id1", name: "testname1" }, { id: "id2", name: "testname2"}]);
    }

    f.renderTo(document.createElement("div"));
    f.addItem({
        type: "combo",
        name: "list1",
        comboTo: "list2",
        label: "关联列表1",
        data: [{ value: "1", text: "1" }, { value: "2", text: "2"}]
    });

    f.addItem({
        type: "list",
        name: "list2",
        label: "关联列表2",
        action: "GetComboList",
        isAutoGet: false,
        pname: "id",
        dataField: "id",
        textField: "name",
        display: "none"
    });

    f.bind();
    equal($(f.render).find(".kf-list-list2").html(), "", "auto get is false");

    $(f.render).find(".kf-combo-list1 option:nth-child(2)").attr("selected", true);
    $(f.render).find(".kf-combo-list1").trigger("change");
    notEqual($(f.render).find(".kf-list-list2").html(), "", "combo trigger");

});






test("set default selected index", function () {
    var f = new kino.Form();
    f.renderTo(document.createElement("div"));
    f.addItem({
        type: "list",
        name: "list1",
        label: "下拉列表",
        data: [{ ax: "a11", value: "b22", text: "c33" },
        { ax: "a1", value: "bx2", text: "cx3" },
        { ax: "a12", value: "bx22", text: "cx32"}],
        selectedIndex: 2
    });

    f.bind();

    notEqual(f.render.innerHTML, null);
    equal($(f.render).find(".kf-list-list1 option:selected")[0].value, "bx22");
    equal($(f.render).find(".kf-list-list1 option:selected")[0].innerHTML, "cx32");
});

test("set default selected value", function () {
    var f = new kino.Form();
    f.renderTo(document.createElement("div"));
    f.addItem({
        type: "list",
        name: "list1",
        label: "下拉列表",
        data: [{ ax: "a11", value: "b22", text: "c33" },
        { ax: "a1", value: "bx2", text: "cx3" },
        { ax: "a12", value: "bx22", text: "cx32"}],
        selectedValue: "bx2"
    });

    f.bind();

    notEqual(f.render.innerHTML, null);
    equal($(f.render).find(".kf-list-list1 option:selected")[0].value, "bx2");
    equal($(f.render).find(".kf-list-list1 option:selected")[0].innerHTML, "cx3");
});


test("date type test", function () {
    var f = new kino.Form();
    f.renderTo(document.createElement("div"));
    f.addItem({
        type: "date",
        name: "datetime",
        label: "日期",
        realformat: "yyyymmdd",
        showformat: "yyyy-mm-dd",
        value: "20100101"
    });
    f.bind();
    equal($(f.render).find(".kf-date-datetime").length > 0, true);
    equal($(f.render).find(".kf-date-datetime").attr("realvalue"), "20100101");
    equal($(f.render).find(".kf-date-datetime").attr("value"), "2010-01-01");
});

test("use Date Object for date type value", function () {
    var testDate = new Date("");
    testDate.setFullYear(2011);
    testDate.setMonth(0);
    testDate.setDate(1);
    var f = new kino.Form();
    f.renderTo(document.createElement("div"));

    f.addItem({
        type: "date",
        name: "datetime",
        label: "日期",
        realformat: "yyyymmdd",
        showformat: "yyyy-mm-dd",
        value: testDate
    });
    f.bind();
    equal($(f.render).find(".kf-date-datetime").length > 0, true);
    equal($(f.render).find(".kf-date-datetime").attr("realvalue"), "20110101");
    equal($(f.render).find(".kf-date-datetime").attr("value"), "2011-01-01");
});

test("use Number for date type value", function () {
    var f = new kino.Form();
    f.renderTo(document.createElement("div"));

    f.addItem({
        type: "date",
        name: "datetime",
        label: "日期",
        realformat: "yyyymmdd",
        showformat: "yyyy-mm-dd",
        value: -1
    });
    f.bind();
    equal($(f.render).find(".kf-date-datetime").length > 0, true);
    notEqual($(f.render).find(".kf-date-datetime").attr("realvalue"), "");
    notEqual($(f.render).find(".kf-date-datetime").attr("value"), "");
});





test("password test", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "item1",
            label: "名字",
            type: "pwd"
        }]
    });

    f.bind();
    equal($(f.render).find(".kf-pwd-item1").length > 0, true);
});

module("validate");

test("txt required test", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "item1",
            label: "名字",
            type: "txt",
            required: true
        }]
    });

    f.bind();

    var result = f.check();
    equal(result.isSuccess, false, "required item cannot be empty");

    $(f.render).find("input").val("ddd");

    result = f.check();
    equal(result.isSuccess, true, "required item has been set");
});



test("use regular expression to validate item value", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "item1",
            label: "名字",
            type: "txt",
            regex: {
                rstr: "^\\d"
            }
        }]
    });

    f.bind();
    $(f.render).find("input").val("ddd");
    var result = f.check();
    equal(result.isSuccess, false, "must start with a number");

    $(f.render).find("input").val("123d");
    var result = f.check();
    equal(result.isSuccess, true);
});

test("maxtrue varidate test", function () {
    var f = new kino.Form({
                render: document.createElement("div"),
                items: [
                    {
                        name : "txt1",
                        type : "txt",
                        label : "文本",
                        value : "测试文本",
                    },
                    {
                        name: "txt2",
                        type: "txt",
                        label: "必填文本",
                        required: true
                    },
                    {
                        name: "list1",
                        type: "list",
                        label: "下拉列表",
                        data:[
                            {text:"请选择", value:""},
                            {text:"v1", value:"v1"},
                            {text:"v2", value:"v2"},
                        ],
                        required: true
                    },
                    {
                        name: "txt2",
                        type: "txt",
                        label: "数字文本",
                        regex:{
                            rstr:"^\\d+$"
                        }
                    },
                    {
                        name: "date1",
                        type: "date",
                        label: "日期",
                        value: -1
                    },
                ]
            });
        f.bind();
        equal(f.check().isSuccess, false);
        $(f.render).find(".kf-txt-txt1").val("ddd");
        $(f.render).find(".kf-list-list1 option:nth-child(2)").attr("selected", true);
        $(f.render).find(".kf-txt-txt2").val("123");
        equal(f.check().isSuccess, true, "all check!");
});


//test("validate event test", function () {
//    var f = new kino.Form({
//        render: document.createElement("div"),
//        items: [{
//            name: "item1",
//            label: "名字",
//            type: "txt",
//            required: true
//        }]
//    });

//    f.bind();
////    $(f.render).find(".kf-txt-item1").triggerHandler("blur");
////    equal($(f.render).find(".kf-txt-item1~.kf-alarm").css("visibility"), "visible"); 
//    equal($(f.render).find(".kf-error-box").length, 1);   
//    equal($(f.render).find(".kf-error-box").css("display"), "none");
//    $(f.render).find(".kf-txt-item1~.kf-alarm").trigger("mouseover");
//    equal($(f.render).find(".kf-error-box").css("display"), "block");
//});


module("get parameters");

test("text get parameter json", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "label",
            label: "标签",
            type: "txt",
            value: "val1"
        },
        {
            name: "tips",
            label: "提示",
            type: "txt",
            value: "val2"
        },
        {
            name: "date",
            label: "日期",
            type: "date",
            value: -1
        },
        {
            name: "col",
            label: "字段",
            type: "txt",
            value: "val3"
        }]
    });

    f.bind();

    var json = f.getParams();
    equal(json.label, "val1");
    equal(json.tips, "val2");
    notEqual(json.date, null);
    equal(json.col, "val3");

});


test("list get parameter json", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "list1",
            label: "标签",
            type: "list",
            data: [{ a: "a1", b: "b1" }, { a: "a2", b: "b2"}]
        }]
    });

    f.bind();

    var json = f.getParams();
    equal(json.list1, "a1");

});

test("get model param for asp.net mvc", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "item1",
            label: "名字1",
            type: "txt",
            value: "value1"
        },
        {
            name: "item2",
            label: "名字2",
            type: "txt",
            value: "value2"
        }]
    });
    f.bind();
    var param = f.getModelParam();
    equal(param["model.item1"], "value1", "default test");

    var param = f.getModelParam("clientInfo");
    equal(param["clientInfo.item1"], "value1", "set model parameter name");
});


test("get paramters in the case of item name with special char", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "model.a",
            label: "标签",
            type: "list",
            data: [{ a: "a1", b: "b1" }, { a: "a2", b: "b2"}]
        }]
    });

    f.bind();

    var json = f.getParams();

    equal(json["model.a"], "a1");
});

module("other");
test("group test", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        groups: [{
            name: "group1",
            items: [
                {
                    name: "item1",
                    label: "名字1",
                    type: "txt",
                    value: "value1"
                },
                {
                    name: "item2",
                    label: "名字2",
                    type: "txt",
                    value: "value2"
                }
            ]
        },
        {
            name: "group2",
            items: [
                {
                    name: "item3",
                    label: "名字3",
                    type: "txt",
                    value: "value3"
                },
                {
                    name: "item4",
                    label: "名字4",
                    type: "txt",
                    value: "value4"
                }
            ]
        }
        ]
    });

    f.bind();

    notEqual(f.render.innerHTML, "<div></div>");
    var json = f.getParams();
    equal(json.item1, "value1");

});

test("setValues test", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "item1",
            label: "名字1",
            type: "txt"
        },
        {
            name: "item2",
            label: "名字2",
            type: "txt"
        }]
    });
    //use setValues before bind
    f.setValues({
        item1: "value1",
        item2: "value2"
    });

    f.bind();

    var json = f.getParams();
    equal(json.item1, "value1");
    equal(json.item2, "value2");
});

test("view mode test", function () {
    var f = new kino.Form({
        render: document.createElement("div"),
        items: [{
            name: "item1",
            label: "名字1",
            type: "txt"
        },
        {
            name: "item2",
            label: "名字2",
            type: "txt"
        }]
    });
    //use setValues before bind
    f.setValues({
        item1: "value1",
        item2: "value2"
    });

    f.enableViewMode();

    f.bind();

    equal($(f.render).find(".kf-msg-item1").length > 0, true);
});
//module("event manage");






