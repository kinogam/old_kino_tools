/// <reference path="jquery-1.3.2-vsdoc2.js" />
/// <reference path="citySelectorData.js" />
/// <reference path="JQueryAddIn/jquery.bgiframe.js" />
/**
 * 城市选择器
 * 数据为citySelectorData
 * @name citySelector
 * @type jQuery
 * @cat Plugins/citySelector
 * @author WanHongbo
 */
//待改造

$.fn.citySelector = function () {

    $(this).attr("autocomplete", "off");
    $(this).focus(function () {
        var $selector = $(format('#address_hot_{0}', this.id));
        var x = $(this).offset().left;
        var y = $(this).offset().top + $(this).outerHeight();
        $selector.css({ left: x, top: y, position: 'absolute' }).bgiframe().show();

        $.fn.citySelector.currentSelector = $selector; //保存当前的引用,为事件监控提供服务
    });

    //监视用户动作,使得选择器在合适的时机隐藏
    $(document).keydown(function () {
        if ($.fn.citySelector.currentSelector) {
            $.fn.citySelector.currentSelector.hide();
        }
    });
    $(document).mousedown(checkExternalClick);
    this.each(function () {//预加载
        loadSelector(this);
    });
    return this;
};
$.fn.clearCitySelector = function(){
	$(format('#address_hot_{0}',this[0].id)).remove();
}
/**
    加载城市选择器   
*/
function loadSelector(obj) {
    if (obj.id == null || obj.id == '')
        obj.id = 'rid_' + new Date().getTime();
    var $selector=null;
    var from = $(obj).attr("from") === undefined ? "" :  $(obj).attr("from");//接数据源
    var citySelectorData=toCitySelectorData(eval(from + "citys"),eval(from + "commoncitys"),from);
    $selector=bulidSelector(obj,parseData(citySelectorData));
    $selector.appendTo("body");
    $selector.css('display','none');
    return $selector;
}

/**
  构造城市选择器
*/
function bulidSelector(obj,dataSource){
    var $selector=$(format('<div id="address_hot_{0}"></div>',obj.id))
                   .addClass('address_hot')
                   .attr('target',obj.id);
    var $title=$('<div class="address_hotcity"><strong>热门城市</strong>（可直接输入城市或城市拼音）</div>');
    $selector.append($title);
    var $tabs=$('<div></div>').addClass('address_hotlist');
    $selector.append($tabs);
    $tabs.append(bulidTabTitles(dataSource));
    for(var i=0;i<dataSource.length;i++){
        $tabs.append(buildTabContent(dataSource[i]));
    } 
    
    //选择城市时,返回所选城市
    $selector.find('a').click(function(){
        var $target=$(format('#{0}',$selector.attr('target')));
        $target.val($(this).html());
        $target.change();//触发输入框改变事件
        
        $selector.hide();
    });
    
    //切换Tab
    $selector.find('ol li').click(function(){
        $(this).find('span').addClass('hot_selected');
        $(this).siblings().find('span').removeClass('hot_selected');
        var group=$(this).find('span').html();
        var $uls=$(this).parent().siblings();
        $uls.filter(format("ul[group='{0}']",group)).css('display','');
        $uls.not(format("ul[group='{0}']",group)).css('display','none');
    });
    $selector.find('ol li :eq(0)').click();//设置默认项目   
    
    return $selector;
}
/**
  构造城市选择器标题头
*/
function bulidTabTitles(groupCitys){
    var $ol=$('<ol></ol>');
    $ol.addClass('address_hot_abb');
    for(var i=0;i<groupCitys.length;i++){
        var $li=$(format('<li><span>{0}</span></li>',groupCitys[i].GroupName));
        $ol.append($li);
    } 
    
    return $ol;
}
/**
  构造城市选择器Tab页面
*/
function buildTabContent(groupCity){
    var $ul=$('<ul></ul>');
    $ul.attr('group',groupCity.GroupName);
    $ul.addClass('address_hot_adress').addClass('layoutfix');
    for(var i=0;i<groupCity.Cities.length;i++){
        var $li=$('<li></li>').append(format('<a data="{0}" href="###">{1}</a>',
                                            groupCity.Cities[i].CityCode,
                                            groupCity.Cities[i].CityName
                                           )
									);
        $ul.append($li);
    }
    
    return $ul;
}

/**
 解析数据
*/
function parseData(citySelectorData){
    var groupCitys=[];
    for(var p in citySelectorData){
        if(typeof citySelectorData[p]=='function'){
            continue;
        }
        var groupCity=new GroupCity();
        groupCity.GroupName=p;
        groupCity.Cities=parseCities(citySelectorData[p]);
        groupCitys.push(groupCity); 
    }
    
    return groupCitys;
}

/**
 解析城市
*/
function parseCities(citySource){
    var cities=[];
    var citySlice=citySource.split('@');
    for(var i=0;i<citySlice.length;i++){
        if(citySlice[i]==null||citySlice[i]==''){
            continue;
        }
        var cityEntry=new CityEntry();
        cityEntry.CityCode=citySlice[i].split('|')[0];
        cityEntry.CityName=citySlice[i].split('|')[1];
        cities.push(cityEntry); 
    }
    return cities;
}

/**
 城市数据结构
*/
function CityEntry(){
    this.CityCode=null;
    this.CityName=null;
}

/**
 城市分组数据结构
*/
function GroupCity(){
    this.GroupName=null;
    this.Cities=[];
}

function format(str) {
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return str.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
}

function checkExternalClick(event) {
    if ($.fn.citySelector.currentSelector) {
        var eventObject = $(event.target);
        $.fn.citySelector.currentSelector.attr('id')!=eventObject[0].id
        &&$.fn.citySelector.currentSelector.attr('target')!=eventObject[0].id
        &&eventObject.parents(format('#{0}',$.fn.citySelector.currentSelector.attr('id'))).length==0
        &&$.fn.citySelector.currentSelector.hide();
    }
}

/**
* 数据源转换器
*/
function toCitySelectorData(cities,hotcities,from){
    var citySelectorData = {
        '热门': '',
        '亚洲': '',
        '美洲': '',
        '欧洲': '',
        '非洲': '',
        '大洋洲': ''
        
    };
    if(from == undefined || from == ""){
		citySelectorData = {
			'热门': '',
			'A-F': '',
			'G-J': '',
			'K-N': '',
			'P-W': '',
			'X-Z': ''
		};
		toCitySelectorDataFromHotelCity(citySelectorData,cities);
    }
    else if(from=='hotel' || from == 'iflight'){
        //toCitySelectorDataFromHotelCity(citySelectorData,cities);
        citySelectorData={ '热门': ''};
    }
    else{
        toCitySelectorDataFromFlightCity(citySelectorData,cities);
    }
    
    for(var i=0;i<hotcities.length;i++){
    citySelectorData['热门']=format('{0}@{1}|{2}@',
                            citySelectorData['热门'],
                            hotcities[i][0],
                            hotcities[i][1]);
    }
    
    return citySelectorData;
}

function toCitySelectorDataFromFlightCity(citySelectorData,cities){
    for(var j=0;j<cities.length;j++){
        switch(cities[j][3].toUpperCase()){
            case 'AS':
                citySelectorData['亚洲'] = format('{0}@{1}|{2}@',
                                        citySelectorData['亚洲'],
                                        cities[j][0],
                                        cities[j][1]);
                break;
            case 'OC':
                citySelectorData['大洋洲'] = format('{0}@{1}|{2}@',
                                        citySelectorData['大洋洲'],
                                        cities[j][0],
                                        cities[j][1]);
                break;
            case 'AM':
                citySelectorData['美洲'] = format('{0}@{1}|{2}@',
                                        citySelectorData['美洲'],
                                        cities[j][0],
                                        cities[j][1]);
                break;
            case 'EU':
                citySelectorData['欧洲'] = format('{0}@{1}|{2}@',
                                        citySelectorData['欧洲'],
                                        cities[j][0],
                                        cities[j][1]);
                break;
            case 'AF':
                citySelectorData['非洲'] = format('{0}@{1}|{2}@',
                                        citySelectorData['非洲'],
                                        cities[j][0],
                                        cities[j][1]);
                break;
        }
    }
}

function toCitySelectorDataFromHotelCity(citySelectorData,cities){
    for(var p in cities){
		if(cities[p][2] == undefined) return;
        switch(cities[p][2].charAt(0).toUpperCase()){
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
                citySelectorData['A-F'] = format('{0}@{1}|{2}@',
                                        citySelectorData['A-F'],
                                        cities[p][0],
                                        cities[p][1]);
                break;
            case 'G':
            case 'H':
            case 'I':
            case 'J':
                citySelectorData['G-J'] = format('{0}@{1}|{2}@',
                                        citySelectorData['G-J'],
                                        cities[p][0],
                                        cities[p][1]);
                break;
            case 'K':
            case 'L':
            case 'M':
            case 'N':
                citySelectorData['K-N'] = format('{0}@{1}|{2}@',
                                        citySelectorData['K-N'],
                                        cities[p][0],
                                        cities[p][1]);
                break;
            case 'P':
            case 'Q':
            case 'R':
            case 'S':
            case 'T':
            case 'U':
            case 'V':
            case 'W':
                citySelectorData['P-W'] = format('{0}@{1}|{2}@',
                                        citySelectorData['P-W'],
                                        cities[p][0],
                                        cities[p][1]);
                break;
            case 'X':
            case 'Y':
            case 'Z':
                citySelectorData['X-Z'] = format('{0}@{1}|{2}@',
                                        citySelectorData['X-Z'],
                                        cities[p][0],
                                        cities[p][1]);
                break;
        }
    }
}