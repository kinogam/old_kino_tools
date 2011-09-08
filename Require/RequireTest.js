/// <reference path="Require.js" />
/// <reference path="../qunit/qunit.js" />

test("clear page test", function () {
    kino.Require("TestClass.js");
    notEqual(window.TestClass, null);
    kino.Require("../Store/Store.js");
    notEqual(window.kino.Store, null);
    //kino.Require("/TestClass2.js");
    //notEqual(window.TestClass2, null);
//    kino.Require("http://localhost:8239/kino/Window/Window.js");
//    notEqual(window.kino.Window, null);
});

test("repetition load test", function () {
    var i = 0;
    kino.Require("TestClass.js", "tc", function () {
        i++;
    });
    kino.Require("TestClass.js", "tc", function () {
        i++;
    });
    equal(i, 1);

});


