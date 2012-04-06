/// <reference path="jquery-1.3.2-vsdoc2.js" />

var KEYUP = 38; var KEYDOWN = 40; var ENTER = 13;
var highLightIndex = 0;

$.fn.autocomplete = function() {
    $(this).attr("autocomplete", "off");
    $(this).keyup(function(event) {
        switch (event.keyCode) {
            case KEYUP:
                autoCommon.keyUp();
                break;
            case KEYDOWN:
                autoCommon.keyDown();
                break;
            case ENTER:
                autoCommon.mouseDown();
                break;
            default:
                highLightIndex = 0;
                autoCommon.complete(this);
                break;
        }
        return false;
    }).blur(function() {
        $("#tabCity").remove();
        highLightIndex = 0;
    }).change(function() {
        if ($(this).val() != "中文/拼音") {
            autoCommon.mouseDown();
            $(this).blur();
        }
    });
    return this;
};

var autoCommon = {
    complete: function(obj) {
        var jObj = $(obj);

        $("#tabCity").remove();
        var table = $("<table id='tabCity' cellspacing='0' class='colspan_tb'><tr><td colspan='2' class='colspan_th'>输入中文/拼音或↑↓选择.</td></tr></table>").css("width", jObj.outerWidth() + 80).attr("dstid", obj.id);

        var objVal = $.trim(jObj.val());
        if (objVal != "") {
            table.find("td").eq(0).html(objVal + ",按拼音排序");
        }

        var from = jObj.attr("from") === undefined ? "" : jObj.attr("from");
        var tmpCity = (objVal != "" ? eval(from + "citys") : eval(from + "commoncitys"));
        if(from == "hotel" && tmpCity == hotelcitys){
            table.css("width", jObj.outerWidth() + 170);
        }
        var matchOrder = [1, 2, 0]; //过滤顺序，中文-首字母-3字码
        var index = 1;
        var tmpCache = {}; //已匹配的城市(如果中文匹配，则不再匹配其他)
        $.each(matchOrder, function(i, matchIndex) {
            if (index != 1 && objVal == "") return false;
            $.each(tmpCity, function(j, item) {
                if (tmpCache[item] || item[matchIndex].toUpperCase().indexOf(objVal.toUpperCase()) != 0) return true;

                tmpCache[item] = true;
                var tr = $("<tr id=" + index + "></tr>");
                tr.append("<td>" + item[2] + "</td>");
                tr.append("<td align='right'>" + item[1] + "</td>");
                tr.mousedown(autoCommon.mouseDown).hover(autoCommon.mouseOver, autoCommon.mouseOut);
                table.append(tr);
                index++;
            });
        });

        if (index == 1) {
            table.empty();
            var tr = format("<tr><td>抱歉找不到:{0}</td></tr>", objVal);
            table.append(tr);
        }

        var x = jObj.offset().left;
        var y = jObj.offset().top + jObj.outerHeight();
        table.css({ left: x, top: y ,position: 'absolute' }).bgiframe().show().appendTo("body");
    },
    keyUp: function() {
        var trLst = $("#tabCity").find("tr");
        if (highLightIndex != 0) {
            trLst.eq(highLightIndex).removeClass("colspen_seleted");
            highLightIndex--;
        } else {
            highLightIndex = trLst.size() - 1;
        }

        if (highLightIndex == 0) {
            highLightIndex = trLst.size() - 1;
        }

        trLst.eq(highLightIndex).addClass("colspen_seleted");
    },
    keyDown: function() {
        var trLst = $("#tabCity").find("tr");
        if (highLightIndex != 0) {
            trLst.eq(highLightIndex).removeClass("colspen_seleted");
        }

        highLightIndex++;
        if (highLightIndex == trLst.size()) {
            highLightIndex = 1;
        }
        trLst.eq(highLightIndex).addClass("colspen_seleted");
    },
    mouseOver: function() {
        if (highLightIndex != 0) {
            $("#tabCity").find("tr").eq(highLightIndex).removeClass("colspen_seleted");
        }

        $(this).addClass("colspen_seleted");
        highLightIndex = $(this).attr("id");
    },
    mouseOut: function() {
        $(this).removeClass("colspen_seleted");
    },
    mouseDown: function() {
        var dstid = $("#tabCity").attr("dstid");
        var selectIndex = highLightIndex == 0 ? 1 : highLightIndex;
        $("#" + dstid).val($("#tabCity").find("tr").eq(selectIndex).children("td").eq(1).text());
        $("#tabCity").hide();
        highlightindex = 0;
    }
};
