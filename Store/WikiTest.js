/// <reference path="Store.js" />
/// <reference path="../qunit/qunit.js" />


var testData = [
{ 'date': '2010-11-03', 'devname': '设备1', 'pkg': 132 },
{ 'date': '2010-11-04', 'devname': '设备1', 'pkg': 44 },
{ 'date': '2010-11-04', 'devname': '设备2', 'pkg': 243 },
{ 'date': '2010-11-05', 'devname': '设备1', 'pkg': 78 },
{ 'date': '2010-11-05', 'devname': '设备2', 'pkg': 345 },
{ 'date': '2010-11-06', 'devname': '设备1', 'pkg': 112}];


test("test", function () {
    var store = kino.Store(testData);
    var result = store.where("date='2010-11-04' and pkg>100").query();
    //var result = store.orderby("date desc").query();
    //var result = store.skip(1).take(3).query(); 
    //var result = store.select("date,sum(pkg) totalpkg").groupby("date").query();
    //var result = store.select("sum(pkg) totalpkg").groupby("totalpkg").query();
    notEqual(result, null);
});