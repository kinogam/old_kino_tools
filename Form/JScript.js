function addErrorBox(s) {
    var param = {
        width: "150px",
        render: null,
        msg: null
    };

    for (var i in s) {
        param[i] = s[i];
    }

    var html = new Array();
    html.push("<div class='error-box-tl'>");
    html.push("<div class='error-box-tr'>");
    html.push("<div class='error-box-tc'>");
    html.push("</div>");
    html.push("</div>");
    html.push("</div>");
    html.push("<div class='error-box-cl'>");
    html.push("<div class='error-box-cr'>");
    html.push("<div class='error-box-body'>{body}</div>");
    html.push("</div>");
    html.push("</div>");
    html.push("<div class='error-box-bl'>");
    html.push("<div class='error-box-br'>");
    html.push("<div class='error-box-bc'>");
    html.push("</div>");
    html.push("</div>");
    html.push("</div>");

    var el = document.createElement("div");
    el.setAttribute("class", "error-box");
    el.innerHTML = html.join("").replace("{body}", param.msg);
    el.style.width = param.width;
    el.style.position = "absolute";
    el.style.display = "inline"; //hack
    param.render.parentNode.appendChild(el);
}