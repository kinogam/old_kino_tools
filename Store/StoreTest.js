/// <reference path="Store.js" />
/// <reference path="../qunit/qunit.js" />


var testData = [
{ 'day': '2010-11-03', 'hour': '08', 'module': '新闻中心', 'avg': 5.52500994805195, 'max': 12.861917, 'median': 7.024529, 'min': 0.061435 },
{ 'day': '2010-11-03', 'hour': '09', 'module': '新闻中心', 'avg': 6.15429159259259, 'max': 16.604351, 'median': 7.51210250, 'min': 0.170413 },
{ 'day': '2010-11-03', 'hour': '10', 'module': '新闻中心', 'avg': 6.79429638297872, 'max': 33.337116, 'median': 7.54214050, 'min': 0.004180 },
{ 'day': '2010-11-03', 'hour': '11', 'module': '新闻中心', 'avg': 6.46341196190476, 'max': 17.961029, 'median': 7.518489, 'min': 0.120847 },
{ 'day': '2010-11-03', 'hour': '12', 'module': '新闻中心', 'avg': 5.86279765909091, 'max': 19.174879, 'median': 7.11531150, 'min': 0.195533 },
{ 'day': '2010-11-03', 'hour': '13', 'module': '新闻中心', 'avg': 4.3706916750, 'max': 10.541010, 'median': 3.979333, 'min': 0.120062 },
{ 'day': '2010-11-03', 'hour': '14', 'module': '新闻中心', 'avg': 5.60741086792453, 'max': 27.702854, 'median': 6.73082250, 'min': 0.071742 },
{ 'day': '2010-11-03', 'hour': '15', 'module': '新闻中心', 'avg': 6.42095193220339, 'max': 37.783340, 'median': 7.181584, 'min': 0.206708 },
{ 'day': '2010-11-03', 'hour': '16', 'module': '新闻中心', 'avg': 6.67259212820513, 'max': 19.355579, 'median': 7.444116, 'min': 0.067864 },
{ 'day': '2010-11-03', 'hour': '17', 'module': '新闻中心', 'avg': 6.345807718750, 'max': 27.396004, 'median': 7.27908950, 'min': 0 },
{ 'day': '2010-11-03', 'hour': '18', 'module': '新闻中心', 'avg': 5.07251247368421, 'max': 11.996570, 'median': 6.756501, 'min': 0 },
{ 'day': '2010-11-03', 'hour': '19', 'module': '新闻中心', 'avg': 5.71861647826087, 'max': 31.220196, 'median': 1.053068, 'min': 0.000415 },
{ 'day': '2010-11-03', 'hour': '20', 'module': '新闻中心', 'avg': 4.56002211111111, 'max': 10.527709, 'median': 4.392370, 'min': 0.241367 },
{ 'day': '2010-11-03', 'hour': '21', 'module': '新闻中心', 'avg': 2.25000692857143, 'max': 8.459681, 'median': 0.56771450, 'min': 0.173103 },
{ 'day': '2010-11-03', 'hour': '22', 'module': '新闻中心', 'avg': 2.36454463636364, 'max': 12.270436, 'median': 0.623318, 'min': 0.145269 },
{ 'day': '2010-11-03', 'hour': '23', 'module': '新闻中心', 'avg': 3.26515661538462, 'max': 15.298494, 'median': 0.605437, 'min': 0.273880 },
{ 'day': '2010-11-03', 'hour': '07', 'module': '业务地图', 'avg': 8.438306, 'max': 8.438306, 'median': 8.438306, 'min': 8.438306 },
{ 'day': '2010-11-03', 'hour': '08', 'module': '业务地图', 'avg': 7.76888105555556, 'max': 15.085409, 'median': 8.452668, 'min': 2.1739 },
{ 'day': '2010-11-03', 'hour': '09', 'module': '业务地图', 'avg': 8.63816592307692, 'max': 34.190521, 'median': 6.847818, 'min': 0.001493 },
{ 'day': '2010-11-03', 'hour': '10', 'module': '业务地图', 'avg': 7.06733806666667, 'max': 12.840239, 'median': 7.858181, 'min': 1.236134 },
{ 'day': '2010-11-03', 'hour': '11', 'module': '业务地图', 'avg': 6.4484521250, 'max': 10.111867, 'median': 6.63735050, 'min': 2.723632 },
{ 'day': '2010-11-03', 'hour': '12', 'module': '业务地图', 'avg': 5.06361750, 'max': 10.177692, 'median': 4.46570650, 'min': 1.145365 },
{ 'day': '2010-11-03', 'hour': '13', 'module': '业务地图', 'avg': 6.90931020, 'max': 15.485836, 'median': 5.918685, 'min': 3.135624 },
{ 'day': '2010-11-03', 'hour': '14', 'module': '业务地图', 'avg': 8.45688141666667, 'max': 30.251970, 'median': 6.98633350, 'min': 0.137469 },
{ 'day': '2010-11-03', 'hour': '15', 'module': '业务地图', 'avg': 6.04456192857143, 'max': 9.299577, 'median': 7.69709050, 'min': 1.013691 },
{ 'day': '2010-11-03', 'hour': '16', 'module': '业务地图', 'avg': 5.66790978571429, 'max': 13.664091, 'median': 4.83345350, 'min': 0.068557 },
{ 'day': '2010-11-03', 'hour': '17', 'module': '业务地图', 'avg': 7.67551928571429, 'max': 10.702638, 'median': 8.398093, 'min': 0.803595 },
{ 'day': '2010-11-03', 'hour': '18', 'module': '业务地图', 'avg': 3.177466, 'max': 8.332766, 'median': 1.190243, 'min': 0.009389 },
{ 'day': '2010-11-03', 'hour': '19', 'module': '业务地图', 'avg': 8.35695120, 'max': 10.727188, 'median': 8.074511, 'min': 6.727035 },
{ 'day': '2010-11-03', 'hour': '21', 'module': '业务地图', 'avg': 16.010416, 'max': 16.010416, 'median': 16.010416, 'min': 16.010416 },
{ 'day': '2010-11-03', 'hour': '22', 'module': '业务地图', 'avg': 6.879193, 'max': 6.922313, 'median': 6.879193, 'min': 6.836073 },
{ 'day': '2010-11-03', 'hour': '23', 'module': '业务地图', 'avg': 6.16365625, 'max': 8.055892, 'median': 7.28212250, 'min': 2.034488 },
{ 'day': '2010-11-03', 'hour': '08', 'module': '业务体验', 'avg': 8.096824, 'max': 8.748293, 'median': 8.096824, 'min': 7.445355 },
{ 'day': '2010-11-03', 'hour': '09', 'module': '业务体验', 'avg': 4.677098, 'max': 7.503780, 'median': 4.677098, 'min': 1.850416 },
{ 'day': '2010-11-03', 'hour': '10', 'module': '业务体验', 'avg': 5.39570660, 'max': 9.130896, 'median': 6.066425, 'min': 1.0303 },
{ 'day': '2010-11-03', 'hour': '11', 'module': '业务体验', 'avg': 7.9264291250, 'max': 10.345819, 'median': 7.81662550, 'min': 4.910618 },
{ 'day': '2010-11-03', 'hour': '12', 'module': '业务体验', 'avg': 7.47183525, 'max': 11.127899, 'median': 8.54491950, 'min': 1.669603 },
{ 'day': '2010-11-03', 'hour': '13', 'module': '业务体验', 'avg': 5.42413650, 'max': 7.407330, 'median': 5.42413650, 'min': 3.440943 },
{ 'day': '2010-11-03', 'hour': '14', 'module': '业务体验', 'avg': 5.7093611250, 'max': 9.745165, 'median': 6.90201850, 'min': 0.118305 },
{ 'day': '2010-11-03', 'hour': '15', 'module': '业务体验', 'avg': 2.04020516666667, 'max': 6.750992, 'median': 1.30011850, 'min': 0.0202 },
{ 'day': '2010-11-03', 'hour': '16', 'module': '业务体验', 'avg': 5.35763220, 'max': 9.250424, 'median': 6.941746, 'min': 1.222275 },
{ 'day': '2010-11-03', 'hour': '17', 'module': '业务体验', 'avg': 3.80119966666667, 'max': 8.125324, 'median': 1.699864, 'min': 1.578411 },
{ 'day': '2010-11-03', 'hour': '19', 'module': '业务体验', 'avg': 8.622691, 'max': 8.914226, 'median': 8.622691, 'min': 8.331156 },
{ 'day': '2010-11-03', 'hour': '20', 'module': '业务体验', 'avg': 7.378662, 'max': 7.378662, 'median': 7.378662, 'min': 7.378662 },
{ 'day': '2010-11-03', 'hour': '21', 'module': '业务体验', 'avg': 2.3942, 'max': 2.3942, 'median': 2.3942, 'min': 2.3942 },
{ 'day': '2010-11-03', 'hour': '22', 'module': '业务体验', 'avg': 6.772733, 'max': 6.772733, 'median': 6.772733, 'min': 6.772733 },
{ 'day': '2010-11-03', 'hour': '23', 'module': '业务体验', 'avg': 8.822961, 'max': 15.282056, 'median': 7.675882, 'min': 6.709738 },
{ 'day': '2010-11-03', 'hour': '05', 'module': '工作与生活', 'avg': 1.958048, 'max': 1.958048, 'median': 1.958048, 'min': 1.958048 },
{ 'day': '2010-11-03', 'hour': '08', 'module': '工作与生活', 'avg': 4.63618366666667, 'max': 14.863865, 'median': 2.574981, 'min': 1.537417}];

function getStore() {
    var store = new kino.Store();
    store.data = testData;
    return store;
}


module("loaction query");

test("normal select test", function () {
    var store = getStore();
    var result = store.query();
    equal(result.length, store.data.length, "do nothing but select,length is the same");

    result = store.select("day,hour,module").query();
    var colCount = 0;
    var x = result[0];
    for (var i in x) {
        colCount++;
    }
    equal(colCount, 3, "select 3 cols");
    equal(result[0].module, "新闻中心", "data check");

    result = store.select("day anewday").query();
    notEqual(result[0].anewday, null, "set a alias for col");
});

test("pure string column select test", function () {
    var store = getStore();
    var result = store.select("'test'").query();
    equal(result[0]["test"], "test");
    result = store.select("'test1','kkk'").query();
    equal(result[0]["test1"], "test1");
    equal(result[0]["kkk"], "kkk");
});

test("select column join string test", function () {
    var store = getStore();
    var data = store.select("day || hour || ',|%|,' k").query();
    equal(data[0].k, "2010-11-0308,|%|,", "data check");
    data = store.select("day || hour || ',|%|,'").query();
    equal(data[0]["day || hour || ',|%|,'"], "2010-11-0308,|%|,", "data check");
});


test("distinct test", function () {
    var store = getStore();
    var data = store.select("distinct day dayalias").query();
    equal(data.length, 1, "length check");
    equal(data[0].dayalias, "2010-11-03", "data check");
    var data = store.select("distinct day,module").query();
    equal(data.length, 4, "distinct day,module");
    var data = store.select("distinct day dayalias,module || 'text'").query();
    equal(data.length, 4, "distinct day dayalias,module || 'text'");
    var data = store.select("distinct day dayalias,module || 'text'").where("module='新闻中心'").query();
    equal(data.length, 1);
});



test("sum test", function () {
    var store = getStore();
    var data = store.select("day,sum(avg) avgsum").groupby("day").query();
    equal(String(data[0].avgsum).substr(0,7), "298.700", "day,sum(avg) avgsum");

    data = store.select("day,module,sum(avg) avgsum").groupby("day,module").query();
    equal(data[2].avgsum, 6.59423166666667, "day,module,sum(avg) avgsum");
});

test("avg test", function () {
    var store = getStore();
    var count = 0;
    for (var i = 0; i < store.data.length; i++) {
        count = (count + store.data[i].avg);
    }
    count = count / store.data.length; 

    var data = store.select("day,avg(avg) totalavg").groupby("day").query();
    equal(String(data[0].totalavg).substr(0, 6), String(count).substr(0, 6), "day,avg(avg) totalavg");

    data = store.select("day,module,avg(avg) moduleavg").groupby("day,module").query();
    equal(String(data[2].moduleavg).substr(0, 6), "3.2971", "day,module,avg(avg) moduleavg");
});

test("max test", function () {
    var store = getStore();
    var data = store.select("day,max(avg) maxavg").groupby("day").query();
    equal(data[0].maxavg, 16.010416, "day,max(avg) maxavg");

    data = store.select("day,module,max(avg) moduleavgmax").groupby("day,module").query();
    equal(data[2].moduleavgmax, 4.63618366666667, "day,module,max(avg) moduleavgmax");
});

test("min test", function () {
    var store = getStore();
    var data = store.select("day,min(avg) minavg").groupby("day").query();
    equal(data[0].minavg, 1.958048, "day,min(avg) minavg");

    data = store.select("day,module,min(avg) moduleavgmin").groupby("day,module").query();
    equal(data[2].moduleavgmin, 1.958048, "day,module,min(avg) moduleavgmin");
});


test("skip test", function () {
    var store = getStore();
    var result = store.skip(1).query();
    equal(result.length, store.data.length - 1, "skip 1 row");
});

test("take test", function () {
    var store = getStore();
    var result = store.skip(1).take(3).query();
    equal(result.length, 3, "skip 1 and take 3,result length is 3");
    equal(result[0].hour, "09", "check data");
});

test("every filter result is different", function () {
    var store = getStore();
    var result = store.skip(1).take(3).query();
    var r2 = store.query();
    notEqual(r2[0].hour, result[0].hour);
});

test("single column orderby test", function () {
    var store = getStore();
    var result = store.orderby("hour desc").query();
    equal(result[0].hour, 23);
    result = store.orderby("hour asc").query();
    equal(result[0].hour, "05");
    result = store.orderby("hour").query();
    equal(result[0].hour, "05", "asc is default");

});

test("multi-columns orderby test", function () {
    //'hour': '00', 'module': '统一搜索', 'avg': 0.164872, 'max': 0.164872, 'median': 0.164872, 'min': 0.164872 
    var store = getStore();
    var data = store.orderby("hour,avg").query();
    equal(data[0].hour, "05");
    equal(data[0].avg, 1.958048);
    equal(data[0].module, "工作与生活");
});

test("where test", function () {
    var store = getStore();
    var result = store.where("avg=5.52500994805195").query();
    equal(result.length, 1);
    var result = store.where("hour='08' and module='新闻中心'").query();
    equal(result.length, 1);
    var result = store.where("module='新闻中心'").query();
    equal(result.length, 16);

});


test("maxture test", function () {
    var store = getStore();
    var result = store.where("day='2010-11-03' and hour>'22'").orderby("hour desc").
select("day xd,hour || ':00:00' datetime").query();
    notEqual(result, null);

    result = store.select("day,module,avg(avg) totalavg")
    .groupby("day,module").orderby("module").query();

    notEqual(result, null);
});

var pdata = [
[1, 0.3],
[1, 0.1],
[2, 1.3],
[2, 0.6],
[1, 3.3],
[1,0.2]];

function getPStore() {
    var store = new kino.Store();
    store.data = pdata;
    return store;
}
test("pure array,select index test", function () {
    var store = getPStore();
    var data = store.select("{0},{1}").orderby("{0} desc").query();
    notEqual(data, null);
    equal(data[0][0], 2);

});

test("pure array, aggregation test", function () {
    var store = getPStore();
    var data = store.select("{0},sum({1}) sumcol").groupby("{0}").query();
    notEqual(data, null);
});

test("pure array, distinct test", function () {
    var store = getPStore();
    var data = store.select("distinct {0}").orderby("{0} desc").query();
    notEqual(data, null);
});


module("ajax query");

function getAjaxStore() {
    var store = new kino.Store();
    store.ajax.enable = true;
    store.ajax.action = "test";

    //mock ajax handle method
    store.ajaxHandle = function (s) {
        s.success.call(null, pdata, s);
    }

    return store;
}


test("check ajax request", function () {
    var store = getAjaxStore();
    store.ajax.size = 3;
    
    store.select("{0} a,sum({1}) b").orderby("{0}").groupby("{0}").where("{1} > 1").query(function (data, s) {
        notEqual(s.type, null, "type");
        notEqual(s.param.index, null, "index");
        notEqual(s.param.size, null, "size");
        notEqual(s.param.orderby, null,"orderby");
        notEqual(s.param.groupby, null, "groupby");
        notEqual(s.param.select, null, "select");
        notEqual(s.param.where, null, "where");
    });
});

module("other");
test("create new object with constructor", function () {
    var store = kino.Store(testData);
    var qdata = store.where("day='2010-11-03' and hour='08' and module='业务地图'").query();
    notEqual(qdata, null);
    equal(qdata.length, 1, "length is 1");
    equal(qdata[0].day, "2010-11-03");
    equal(qdata[0].hour, "08");

});


