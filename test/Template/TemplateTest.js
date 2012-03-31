﻿/// <reference path="Template.js" />
/// <reference path="../qunit/qunit.js" />

test("replace test", function () {
    var str = kino.template("Hey, @name!", { name: 'kino' });
    equal(str, "Hey, kino!");
});

test("multiple variables", function () {
    var str = kino.template("Hey, @a, @b, @c!", { a: 1, b: 2, c: 3 });
    equal(str, "Hey, 1, 2, 3!");
});

test("missing value raises exception", function () {
    raises(function () {
        var templateStr = "Hey, @xxx";
        var str = kino.template(templateStr, {});
    }, "a variable was left without a value!");
});

test("handle missing vlaue", function () {
    var templateStr = "Hey, @xxx";
    var str = kino.template(templateStr, {}, true);
    equal(str, "Hey, ");
});

test("variables value like @abc", function () {
    var str = kino.template("Hey, @a, @b, @c!", { a: "@b", b: "@c", c: "@a" });
    equal(str, "Hey, @b, @c, @a!");
});

test("javascript block test", function () {
    var templateStr = "@{var name='kino';}this is @name";
    var str = kino.template(templateStr);
    equal(str, "this is kino");
});

test("@if @for @while test", function () {
    var templateStr = "@if(1==0){<span>if you see this word,your test is fail</span>}";
    var str = kino.template(templateStr);
    equal(str, "");

    templateStr = "@for(var i = 0; i < 3; i++){<span>@i</span>}";
    str = kino.template(templateStr);
    equal(str, "<span>0</span><span>1</span><span>2</span>");

    templateStr = "@{var i = 3;}@while(i--){<span>@i</span>}";
    str = kino.template(templateStr);
    equal(str, "<span>2</span><span>1</span><span>0</span>");
});

test("escape test", function () {
    var templateStr = "<input yyy='@test' xxx=\"@otherAttr\" />";
    var str = kino.template(templateStr, { test: "kino's test", otherAttr: "\"one more test\"" });
    equal(str, "<input yyy='kino&#x27;s test' xxx=\"&quot;one more test&quot;\" />");
});

test("array param test", function () {
    var templateStr = "@for(var i = 0; i < data.length; i++){<span>@data[i]</span>}";
    var str = kino.template(templateStr, {
        data:[1, 2, 3]
    });
    equal(str, "<span>1</span><span>2</span><span>3</span>");
});