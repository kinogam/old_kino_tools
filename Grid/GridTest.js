/// <reference path="Grid.js" />
/// <reference path="../Store/Store.js" />
/// <reference path="../qunit/qunit.js" />
/// <reference path="../Script/jquery-1.6.1.min.js" />

test("bind test", function () {
    var columns = [
            { text: '集团编码', mapping: "Code" },
            { text: '客户名称', mapping: "Name" }
        ];
    var data = [{ "Code": "001", "Name": "Kino" },
     { "Code": "002", "Name": "Jackson" },
     { "Code": "003", "Name": "Charming" },
     { "Code": "004", "Name": "Sarly"}];

    var grid = new kino.Grid({
        columns: columns,
        data: data,
        render: document.createElement("div")
    });

    grid.bind();

    notEqual(grid.render.innerHTML, "");
});