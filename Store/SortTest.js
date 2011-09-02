/// <reference path="Sort.js" />
/// <reference path="../qunit/qunit.js" />


var testData = [
{ a: 1, b: 'zzz', c: 0.3 },
{ a: 1, b: 'xxx', c: 0.1 },
{ a: 2, b: 'zzz', c: 1.3 },
{ a: 2, b: 'zzz', c: 0.6 },
{ a: 1, b: 'xxx', c: 3.3 },
{ a: 1, b: 'yyf', c: 0.2 }
];

test("one col sort test", function () {
    var td = testData.slice(0);
    var ntd = sort({
        data: td,
        cols: { name: "c", isASC: true }
    });
    equal(ntd[0].c, 0.1);
});

test("multi-sort test", function () {
    var td = testData.slice(0);
    var ntd = sort({
        data: td,
        cols: [{ name: "a", isASC: true }, { name: "b", isASC: true }, { name: "c", isASC: true}]
    });
    equal(ntd[0].a, 1);
    equal(ntd[0].b, "xxx");
    equal(ntd[0].c, 0.1);
});