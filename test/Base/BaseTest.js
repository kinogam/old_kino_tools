﻿/// <reference path="../../kino.Base.js" />
/// <reference path="../qunit/qunit.js" />

module('kino.Require');

asyncTest("load one js file", function () {
    expect(1);
    kino.Require("TestClass.js", function () {
        start();
        notEqual(window.TestClass, null);
    });
});

asyncTest("load multiple js files", function () {
    expect(2);
    kino.Require(['TestClass.js', 'TestClass2.js'] , function () {
        start();
        notEqual(window.TestClass, null);
        notEqual(window.TestClass2, null);
    });
});

asyncTest("repetition load test", function () {
    expect(1);
    kino.resetLoadHash();
    kino.Require({ 'TestClass': "TestClass.js" }, function () {
        kino.Require({ 'TestClass': "TestClass.js" }, function () {
            start();
            equal(kino.rnum, 1);
        });
    });
});

asyncTest("repetition load with array argument", function () {
    expect(1);
    kino.resetLoadHash();
    kino.Require([{ 'TestClass': "TestClass.js" }], function () {
        kino.Require([{ 'TestClass': "TestClass.js" }], function () {
            start();
            equal(kino.rnum, 1);
        });
    });
});

module('kino.define');

test('kino.define test', function () {
    expect(2);
    var D = kino.define('Do.Not.Naming.A.ClassName.Like.ThisOne', function () {
        alert("xx");
    });

    notEqual(Do.Not.Naming.A.ClassName.Like.ThisOne, null, 'class has defined');
    notEqual(D, null, 'return value test');
});