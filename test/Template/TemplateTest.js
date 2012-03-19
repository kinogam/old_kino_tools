/// <reference path="Template.js" />
/// <reference path="../qunit/qunit.js" />


var template;


module("Template", {
    setup: function () {
        template = new kino.Template("Hey, ${one}, ${two}, ${three}!");
        template.set("one", "1");
        template.set("two", "2");
        template.set("three", "3"); 
    }
});

test("multiple variables", function () {
    equal(template.evaluate(), "Hey, 1, 2, 3!");
});

test("missing value raises exception", function () {
    raises(function () {
        new kino.Template("Hello, ${name}").evaluate();
    }, "a variable was left without a value!");
});

test("variables value like ${...}", function () {
    template = new kino.Template("Hey, ${one}, ${two}, ${three}!");
    template.set("one", "${x1}");
    template.set("two", "${three}");
    template.set("three", "${x3}");
    equal(template.evaluate(), "Hey, ${x1}, ${three}, ${x3}!");
});

test("set variables with json", function () {
    template = new kino.Template("Hey, ${one}, ${two}, ${three}!");
    template.set({
        "one": "${x1}",
        "two": "${three}",
        "three": "${x3}"
    });
    equal(template.evaluate(), "Hey, ${x1}, ${three}, ${x3}!");
});

module("Parse");

test("parsing empty string", function () {
    var segments = kino.TemplateParse.parse("");
    equal(segments.length, 1);
});

test("parsing plain text", function () {
    var segments = kino.TemplateParse.parse("a plain text test");
    equal(segments.length, 1);
    equal(segments[0], "a plain text test");
});

test("parsing variables", function () {
    var segments = kino.TemplateParse.parse("Hey, ${one}, ${two}, ${three}!");
    equal(segments.length, 7);
    equal(segments[0], "Hey, ");
    equal(segments[1], "${one}");
    equal(segments[2], ", ");
    equal(segments[3], "${two}");
    equal(segments[4], ", ");
    equal(segments[5], "${three}");
    equal(segments[6], "!");
});


