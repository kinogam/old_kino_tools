function sort(s) {
    var newdata = s.data.slice(0) ;
    
    var mlist = new Array();
    var slist;
    var templist;

    //single col handle
    if (s.cols.length != null) {
        for (var j = 0; j < s.cols.length - 1; j++) {
            //处理第一次排序
            if (j == 0) {
                if (s.cols[j].isASC)
                    newdata.sort(function (a, b) { return a[s.cols[j].name] > b[s.cols[j].name] ? 1 : -1; });
                else
                    newdata.sort(function (a, b) { return a[s.cols[j].name] > b[s.cols[j].name] ? -1 : 1; });
                mlist = newdata;

            }

            var tval = null;
            slist = new Array();
            templist = new Array();

            for (var i = 0; i < mlist.length; i++) {
                var cval = "";
                for (var k = 0; k < j + 1; k++) {
                    cval += mlist[i][s.cols[k].name] + ",";
                }
                cval = cval.replace(/,$/, "");

                if (tval == null) {
                    tval = cval;
                    slist.push(mlist[i]);
                }
                else if (tval == cval) {
                    slist.push(mlist[i]);
                }
                else {
                    //将子列排序后合并到临时数组
                    if (s.cols[j+1].isASC)
                        slist.sort(function (a, b) { return a[s.cols[j + 1].name] > b[s.cols[j + 1].name] ? 1 : -1; });
                    else
                        slist.sort(function (a, b) { return a[s.cols[j + 1].name] > b[s.cols[j + 1].name] ? -1 : 1; });

                    templist = templist.concat(slist);

                    cval = "";
                    for (var k = 0; k < j + 1; k++) {
                        cval += mlist[i][s.cols[k].name] + ",";
                    }
                    cval = cval.replace(/,$/, "");
 

                    slist = new Array();
                    tval = cval;
                    slist.push(mlist[i]);
                }

            }
            if (slist.length > 0) {
                //将子列排序后合并到临时数组
                if (s.cols[j + 1].isASC)
                    slist.sort(function (a, b) { return a[s.cols[j + 1].name] > b[s.cols[j + 1].name] ? 1 : -1; });
                else
                    slist.sort(function (a, b) { return a[s.cols[j + 1].name] > b[s.cols[j + 1].name] ? -1 : 1; });

                mlist = templist.concat(slist);
        
            }

        }
        return mlist;
    }
    else {
        if (s.cols.isASC)
            newdata.sort(function (a, b) { return a[s.cols.name] > b[s.cols.name] ? 1 : -1; });
        else
            newdata.sort(function (a, b) { return a[s.cols.name] > b[s.cols.name] ? -1 : 1; });

        return newdata;
    }

}