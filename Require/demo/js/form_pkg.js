/// <reference path="../../Inner/Require.js" />
/// <reference path="My97DatePicker/WdatePicker.js" />
/// <reference path="Form.js" />
/// <reference path="jquery-1.6.1.min.js" />
kino.Package("formpkg");
kino.Require({
    url: "My97DatePicker/WdatePicker.js",
    key: "WdatePicker",
    isAsyn: true
});

kino.Require("jquery-1.6.1.min.js", "jquery");
kino.Require("Form.js", "form");

