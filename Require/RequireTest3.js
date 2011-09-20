test("new pkg test", function () {
    kino.Require.clear();
    kino.Package("newpkg");
    equal($("head script[pkg='newpkg']").length, 1);
    kino.Require({
        url: "a/TestClass5.js",
        isAsyn: true
    });

    kino.Require("TestClass6.js", "tc6");
    notEqual(window.TestClass6, null);

});
