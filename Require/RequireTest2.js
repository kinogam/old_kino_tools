test("pkg test", function () {
    kino.Require.clear();
    kino.Package("testpkg");
    equal($("head script[pkg='testpkg']").length, 1);
    kino.Require({
        url: "a/TestClass3.js",
        isAsyn: true
    });

    kino.Require("TestClass4.js", "tc4");
    notEqual(window.TestClass, null);

});
