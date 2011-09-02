/// <reference path="../qunit/qunit.js" />
/// <reference path="../Script/jquery-1.6.1.min.js" />
/// <reference path="Window.js" />

var mockBody;
var mockWin;

QUnit.testStart = function () {
    mockBody = document.createElement("div");

    mockWin = {
        kino: {
            Window: kino.Window
        },
        document: {
            getElementById: function () {
                return $(mockBody).find(".kino-window")[0];
            },
            getElementsByTagName: function () {
                var list = new Array();
                list.push(mockBody);
                return list;
            }
        }
    };


    kino.Window.instanceList = {};
    kino.Window.setCenterStyle = function () { };
    kino.Window.zindex = 100;
};

test("default options test", function () {
    var w = new kino.Window({
        winobj: mockWin
    });
    w.open();
    equal(w.title, "new window");
    equal(w.type, "html");
    equal(w.value, "hello window");
    equal(w.width, 450);
    equal(w.btn.length, 1);
    equal(w.btn[0], "close");

    var kw = $(mockBody).find(".kino-window");
    //notEqual(kw.css("top"), "auto");
});



test("open test", function () {
    var w = new kino.Window({
        winobj: mockWin,
        title: "测试标题",
        type: "iframe",
        value: "ShowClientEdit"
    });

    w.open();
    var kw = $(mockBody).find(".kino-window");
    equal(kw.length > 0, true);
    notEqual(kw[0].id, "");
    notEqual(kw.html(), "");

//    var mask = $(mockBody).find("#kinomask");
//    equal(mask.length, 1);
});

test("check instanceList", function () {
    var w = new kino.Window({
        winobj: mockWin
    });
    w.open();
    var count = 0;
    for (var i in kino.Window.instanceList) {
        count++;
    }
    equal(count, 1);
});

//test("opener test", function () {
//    var w = new kino.Window({
//        winobj: mockWin
//    });
//    w.open();
//    var opener = kino.Window.getOpener();
//    equal(opener, window);

//    var fw = new kino.Window({
//        winobj: mockWin,
//        type:"iframe",
//        value:"hello.html"
//    });
//    fw.open();
//    var opener = kino.Window.getOpener();
//    equal(opener, window);
//});

test("close test", function () {
    var w = new kino.Window({
        winobj: mockWin
    });
    w.open();
    var id = "";

    for (var i in kino.Window.instanceList) {
        id = i;
    }

    kino.Window.toolClose(id);
    var kw = $(mockBody).find(".kino-window");
    equal(kw.length, 0, "window has been removed");
});

test("window z-index start from 100", function () {
    var w = new kino.Window({
        winobj: mockWin
    });
    w.open();
    var kw = $(mockBody).find(".kino-window");
    equal(kw.css("z-index"), "100");

    var y = new kino.Window({
        winobj: mockWin
    });
    y.open();
    var ydom = $(mockBody).find(".kino-window")[1];
    equal($(ydom).css("z-index"), "101", "it is increasing");
});
