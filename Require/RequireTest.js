/// <reference path="Require.js" />
/// <reference path="../qunit/qunit.js" />

test("clear page test", function () {
    kino.Require("TestClass.js");
    notEqual(window.TestClass, null);
    kino.Require("../Store/Store.js");
    notEqual(window.kino.Store, null);
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