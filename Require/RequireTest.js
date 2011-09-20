/// <reference path="Inner/Require.js" />

/// <reference path="../qunit/qunit.js" />


test("require test", function () {
    kino.Require("TestClass.js");
    notEqual(window.TestClass, null);
    kino.Require("../Store/Store.js");
    notEqual(window.kino.Store, null);


    kino.Require("../Script/jquery-1.6.1.min.js", "jquery");
    notEqual(window.$, null, "jquery has been loaded");
});

//test("repetition load test", function () {
//    if (window.localStorage)
//        window.localStorage.removeItem("tc");

//    var i = 0;
//    stop();
//    kino.Require("TestClass.js", "tc", function () {
//        i++;
//    });
//    kino.Require("TestClass.js", "tc", function () {
//        i++;
//    });
//    start();
//    equal(i, 1);

//});


test("local storage support", function () {
if (window.localStorage)
    window.localStorage.removeItem("tc");
    stop();
    kino.Require("TestClass.js", "tc");
    start();
    if (window.localStorage)
        notEqual(window.localStorage.getItem("tc"), null, "has been stored");
});




test("css require", function () {

    stop();
    kino.Require("css/test.css", "testcss");
    start();
    equal($("head link[href$=css\\/test\\.css]").length, 1);
});

test("json argument test", function () {
if (window.localStorage)
    window.localStorage.removeItem("tc");
    kino.Require({
        url: "TestClass.js",
        key: "tc"
    });
    notEqual(window.TestClass, null);
});

test("asynchronous load", function () {
    if (window.localStorage)
        window.localStorage.removeItem("tc2");

    stop();
    kino.Require("TestClass2.js", "tc2", function () {
        start();
        equal($("head script[src$=TestClass2\\.js]").length, 1);
    }, null, true);
});

test("json argument asynchronous load", function () {
    stop();
    kino.Require.clear();
    kino.Require({
        url: "TestClass.js",
        key: "tc",
        callback: function () {
            start();
            equal($("head script[src$=TestClass\\.js]").length, 1);
        },
        isAsyn: true
    });

});


test("disable cache test", function () {
    kino.Require.clear();
    kino.Require("TestClass.js", "tc", null, null, true);
    equal(window.localStorage.getItem("tc"), null, "will not be stored");

    kino.Require.clear();
    kino.Require({
        url: "TestClass.js",
        key: "tc",
        disableCache: true
    });
    equal(window.localStorage.getItem("tc"), null, "will not be stored");
})
