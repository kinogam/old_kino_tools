(function () {
    var bm = function (fn, loop) {
        var _loop = loop || 1;
        var startTime = new Date();
        for (var i = 0; i < _loop; i++)
            fn();
        var endTime = new Date();
        return { startTime: startTime, endTime: endTime, timespan: endTime.getTime() - startTime.getTime() };
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = bm;
    }
    else {
        this.kino = this.kino || {};
        this.kino.benchmark = bm;
    }
})();