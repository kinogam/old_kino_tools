/// <reference path="../Require/Inner/Require.js" />
kino.Package("form_pkg");
kino.Require("../Script/jquery-1.6.1.min.js", "jquery");
kino.Require("form.js", "kino.Form.js");
kino.Require("css/kino-form.css", "kino.Form.css");
kino.Require({
    url:"My97DatePicker/WdatePicker.js", 
    key:"WdatePicker.js",
    isAsyn:true
});
