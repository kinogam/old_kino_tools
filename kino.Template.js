(function () {
    this.kino = this.kino || {};
    var t = this.kino.template = function (templateStr, data, isCleanMode) {
        var variable = new RegExp("@([a-zA-Z0-9\._]+)(?!\\()", "g");
        var block = new RegExp("@{([^}]+)}", "g");
        var logic = new RegExp("@(if|for|while)(\\([^\\)]+\\){)([^}]+)}", "g");
        var temp = "var $$p=[];with(json||{}){$$p.push('";
        temp = temp + templateStr.replace(logic, function (match, $0, $1, $2) {
            return "'); " + $0 + $1 + " $$p.push('" + $2 + "');};$$p.push('";
        }).replace(variable, function (match, code) {
            var str = "');";
            if(isCleanMode)
                str = str + "if(typeof " + code + " === 'undefined')" + code + "='';";
            return str + "$$p.push(" + code + ");$$p.push('";
        }).
        replace(block, function (match, code) {
            return "'); " + code + " $$p.push('";
        });
        temp = temp + "')}; return $$p.join('');";
        return new Function('json', temp).call(null, data);
    };
})();