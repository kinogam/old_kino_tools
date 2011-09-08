(function () {
    var ci = window.ClientInfo = {};
    var p = {};

    p.gridInit = function () {
        var kgridColumns = [
        {
            text: "操作", handle: function (row) {
                var list = new Array();
                list.push("<a href='#' onclick=\"showClientBusSource('");
                list.push(row.ID + "','" + row.Name);
                list.push("')\">业务信息</a>");
                list.push("<a href='#' onclick=\"showClientEdit('");
                list.push(row.ID);
                list.push("')\">修改</a>");
                list.push("<a href='#' onclick=\"deleteClient('");
                list.push(row.ID);
                list.push("')\">删除</a>");
                return list.join("");
            }
        },
        { text: '内外部分类', mapping: "Class" },
        { text: '集团编码', mapping: "Code" },
        { text: '客户名称', mapping: "Name" },
        { text: '客户类别', mapping: "ClientType" },
        { text: '客户省市属性', mapping: "AreaAttribute" },
        { text: '所属区域分公司', mapping: "Area" },
        { text: '客户地址', mapping: "Address" },
        { text: '客户地址的经度', mapping: "Longitude" },
        { text: '客户地址的维度', mapping: "Latitude" },
        { text: '客户经理', mapping: "ClientManager" },
        { text: '联系电话', mapping: "ClientManagerPhone" },
        { text: '客户技术联系人', mapping: "ClientContact" },
        { text: '客户技术联系人电话', mapping: "ClientContactPhone" },
        { text: '客户技术联系人E—MAIL', mapping: "ClientContactEmail" },
        { text: '所属代维公司', mapping: "ServiceCompany" },
        { text: '代维人员', mapping: "CheckMan" },
        { text: '代维人员电话', mapping: "CheckManPhone" },
        { text: '备注', mapping: "Remark" }
        ];

        var grid = window.grid = new kinogam.Grid({
            title: "集团客户的信息",
            render: document.getElementById("grid"),
            pageSize: 10,
            maxPage: 10,
            columns: kgridColumns
        });
        grid.noDataHandle = function () {
            alert("无数据!");
        }
        grid.afterAjaxLoad = function () {
            autoFrameHeight();
        }
        grid.afterBind = function () {
            autoFrameHeight();
        };
    };



    p.gridHandle = function (ds) {
        if (ds == []) {
            alert("无相关集团客户数据。");
            return;
        }
        grid.source = ds;
        grid.bindGrid();
    };

    ci.setGrid = function () {
        $.post("FindClient", queryForm.getParams(), p.gridHandle);
    };


    ci.setQueryText = function () {
        var f = window.queryForm = new kino.Form();
        //模板样式
        f.grouphtml = "@{rows}";
        f.rowhtml = "<div class='fi'>@{cells}</div>";
        f.cellhtml = "<span class='@{labelclass}'>@{label}:</span>@{item}";

        f.renderTo(document.getElementById("querytext"));

        f.addItem({ type: "list", name: "clientClass", label: "内外部分类",
            data: [{ text: "全部", value: "" }, { text: "内部客户", value: "内部客户" }, { text: "外部客户", value: "外部客户"}]
        });

        f.addItem({ type: "list", name: "ClientType", label: "客户类别",
            data: [
             { text: "所有类别", value: "" },
             { text: "A+", value: "A+" },
             { text: "A1", value: "A1" },
             { text: "A2", value: "A2" },
             { text: "B1", value: "B1" },
             { text: "B2", value: "B2" },
             { text: "C", value: "C" },
             { text: "D", value: "D"}]
        });

        f.addItem({
            type: "txt",
            name: "clientCode",
            label: "集团编码"
        });
        f.addItem({
            type: "txt",
            name: "clientName",
            label: "客户名称"
        });

        f.bind();
    }

    $(function () {
        p.gridInit();
    });

})();



