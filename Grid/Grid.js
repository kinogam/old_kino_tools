/// <reference path="../Store/Store.js" />
/// <reference path="../Require/Inner/Require.js" />
/// <reference path="../Script/jquery-1.6.1.min.js" />

(function () {
    kino.Require("../Script/jquery-1.6.1.min.js", "jquery");
    kino.Require("../Store/Store.js", "kino.Store");

    var p = {};

    var g = kino.Grid = function () {
        //        var store = kino.Store([
        //            { a: "1", b: "2" },
        //            { a: "3", b: "4" }
        //        ]);
    };

    p.init = function () {
        this.render = null;
        this.column = null;
        this.data = null;
    }

    g.prototype.bind = function () {

    };

})();