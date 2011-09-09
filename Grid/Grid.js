/// <reference path="../Store/Store.js" />
/// <reference path="../Require/Inner/Require.js" />
(function () {
    kino.Require("../Store/Store.js", "kino.Store");

    var g = kino.Grid = function () {
        var store = kino.Store([
            { a: "1", b: "2" },
            { a: "3", b: "4" }
        ]);
        alert(store);
    }

})();