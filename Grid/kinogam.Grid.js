(function () {
    /*命名空间*/
    var kinogam;
    if (!window.kinogam)
        kinogam = window.kinogam = new Object();
    else
        kinogam = window.kinogam;







    kinogam.Grid = function (s) {
        /// <summary>
        /// kinogam Grid
        /// </summary>
        this.init();
        this.setStyle();
        if (arguments.length > 0 && s != null)
            this.setMember(s);
    }


    /*************************************************************************************
    *
    初始化和成员变量设置
    *
    *************************************************************************************/


    kinogam.Grid.prototype = {
        init: function () {
            /// <summary>
            /// 初始化
            /// </summary>
            /*绑定的dom对象*/
            this.render = null;
            /*标题名称*/
            this.title = "";
            /*2维数组数据源*/
            this.source = null;
            /*列数据源*/
            this.columns = null;
            /*当前页索引*/
            this.pageIndex = 0;
            /*总页数*/
            this.totalRow = 0;
            /*页面行数*/
            this.pageSize = 15;
            /*最大页数*/
            this.maxPage = 10;
            /*是否启用最大页数*/
            this.enableMaxPage = false;
            /*排序的列索引*/
            this.sortColumnIndex = "";
            /*排序的类型*/
            this.sortColumnType = "";
            /*除当前所有页之外是否存在下一个页面*/
            this.hasNext = false;
            /*当次数据请求索引*/
            this.tpIndex = 0;
            /*是否启用aja分页*/
            this.enableAjaxPaging = false;
            /*当前paging类型是否是ajax操作*/
            this.ajaxPaging = true;
            /*ajax请求地址*/
            this.ajaxUrl = "";
            /*完整的类名(包括命名空间)*/
            this.strbll = "";
            /*查询条件,%%分割键值,%%%分割查询条件*/
            this.filter = "";
        },
















        setMember: function (s) {
            /// <summary>
            /// 设置报表成员
            /// </summary>
            if (s != null) {
                for (var i in s) {
                    this[i] = s[i];
                }
            }
        },





        setPagingInfo: function () {
            /// <summary>
            /// 设置分页属性
            /// </summary>

            if (this.source == null)
                return;

            if (this.pageIndex == -1)
                this.pageIndex = 0;

            /*获取总行数和总页数*/
            if (this.enableMaxPage || this.source.length < this.pageSize * this.maxPage) {

                this.totalRow = this.source.length;
                this.pageCount = Math.ceil(this.totalRow / this.pageSize);
            }
            else {
                this.totalRow = this.pageSize * this.maxPage;
                this.pageCount = this.maxPage;
            }

            /*获取页索引和当前分页行数*/

            /*判断当前页是最后一页的行数显示*/
            if (this.pageIndex == this.pageCount - 1) {
                var lr = this.totalRow % this.pageSize;
                this.currentRow = (lr == 0) ? this.pageSize : lr;
            }
            /*数据操作过后当前页索引比分页数大的情况处理*/
            else if (this.pageIndex > this.pageCount - 1) {
                this.pageIndex = this.pageCount - 1
                this.currentRow = this.pageSize;
            }
            else
                this.currentRow = this.pageSize;


            /*是否还有下一个ajax请求分页*/
            if (this.ajaxPaging == true) {
                if (this.enableAjaxPaging && (this.source.length > this.pageSize * this.maxPage) && !this.enableMaxPage) {
                    this.hasNext = true;
                    this.source = this.source.slice(0, this.pageSize * this.maxPage);
                }
                else {
                    this.hasNext = false;
                }
            }
            else {
                this.ajaxPaging = true;
            }

        },













        /*************************************************************************************
        *
        样式设置和HTML设置
        *
        *************************************************************************************/



        setStyle: function () {

            /*标题html*/
            this.titleHtml = "<div class='kgrid_title'>{title}</div>";
            this.rowHtml = "<tr>{cells}</tr>";
            this.cellHtml = "<td><div  class='cell col{n}'>{celltext}</div></td>";
            this.bodyHtml = "<tbody>{rows}</tbody>";
            this.wrapHtml = "<div class='kgrid'>{tp}<table>{hp}{bp}</table></div>";

            /*表头行*/
            this.headHtml = "<thead class='headrow'><tr>{ths}</tr></thead>";
            /*表头单元格*/
            this.thHtml = "<th class='headcell cell col{n} {sort}'><div><span>{coltxt}</span></div></th>";

            /*分页模板*/

            /*ajax prev*/
            this.bppHtml = "<a href='javascript:void(0)' class='bprev disable'>前{maxRow}条</a>";
            /*上一页*/
            this.ppHtml = "<a href='javascript:void(0)' class='prev'>上1页</a>";
            /*第一页*/
            this.fpHtml = "<a href='javascript:void(0)' class='first disable'>第{firstPage}页</a>";
            /*当前页*/
            this.cpHtml = "<span>当前第{currentPage}页</span>";
            /*下一页*/
            this.npHtml = "<a href='javascript:void(0)' class='next'>下1页</a>";
            /*最后一页*/
            this.lpHtml = "<a href='javascript:void(0)' class='last'>第{lastPage}页</a>";
            /*ajax next*/
            this.bnpHtml = "<a href='javascript:void(0)' class='bnext'>后{maxRow}条</a>";
            /*分页容器*/
            this.pagingHtml = "<div class='pagingControl'>{pageItem}</div>";

        },






















        getTitleHtml: function () {
            /// <summary>
            /// 设置报表标题
            /// </summary>
            return this.titleHtml.replace("{title}", this.title);
        },















        getHeadHtml: function () {
            /// <summary>
            /// 设置报表头
            /// </summary>
            var tempHtml = new Array();
            var sort = "";

            for (var i = 0; i < this.columns.length; i++) {
                /*获取排序class*/
                if (i == this.sortColumnIndex)
                    sort = this.sortColumnType;
                else
                    sort = "";

                tempHtml.push(this.thHtml.replace("{coltxt}", this.columns[i].text).replace("{n}", i).replace(
                    "{sort}", sort));

            }
            return this.headHtml.replace("{ths}", tempHtml.join(""));
        },





















        getBodyHtml: function () {
            /// <summary>
            /// 设置报表主体
            /// </summary>
            var tempHtml = new Array();
            var tdstr = "";
            for (var j = 0; j < this.currentRow; j++) {
                if (this.source == null || this.source.length == 0)
                    break;
                for (var i = 0; i < this.columns.length; i++) {

                    if (this.columns[i].handle != null) {


                        //如果自定义列因为某些情况只能使用字符串，那么将字符串转换成函数
                        var hf;
                        if (typeof (this.columns[i].handle) == "string") {
                            eval("hf=" + this.columns[i].handle);
                            this.columns[i].handle = hf;
                        }

                        tdstr += this.cellHtml.replace("{n}", i).replace("{celltext}",
                        this.columns[i].handle(this.source[this.pageIndex * this.pageSize + j],
                        this.pageIndex * this.pageSize + j));
                    }
                    else {

                        tdstr += this.cellHtml.replace("{n}", i).replace("{celltext}",
                            this.source[this.pageIndex * this.pageSize + j][this.columns[i].mapping]);

                    }
                }
                tempHtml.push(this.rowHtml.replace("{cells}", tdstr));
                tdstr = "";

            }
            return this.bodyHtml.replace("{rows}", tempHtml.join(""));

        },








        getPagingHtml: function () {
            /// <summary>
            /// 设置分页html
            /// </summary>
            var maxRow = this.pageSize * this.maxPage;
            var tds = new Array();
            if (this.tpIndex != 0 && this.enableAjaxPaging)
                tds.push(this.bppHtml.replace("{maxRow}", maxRow));

            if (this.pageIndex != 0) {
                tds.push(this.fpHtml.replace("{firstPage}", String(this.tpIndex * this.maxPage + 1)));
                tds.push(this.ppHtml);
            }

            tds.push(this.cpHtml.replace("{currentPage}", String(this.tpIndex * this.maxPage + this.pageIndex + 1)));

            if (this.pageIndex != this.pageCount - 1 && this.source != null) {
                tds.push(this.npHtml);
                tds.push(this.lpHtml.replace("{lastPage}", String(this.tpIndex * this.maxPage + this.pageCount)));
            }

            if (this.hasNext && this.enableAjaxPaging)
                tds.push(this.bnpHtml.replace("{maxRow}", maxRow));

            return this.pagingHtml.replace("{pageItem}", tds.join(""));
        },



























        setGridHtml: function () {
            /// <summary>
            /// 设置报表整体HTML
            /// </summary>
            this.render.innerHTML = this.wrapHtml.replace("{title}", this.getTitleHtml()).replace("{head}",
            this.getHeadHtml()).replace("{body}", this.getBodyHtml()).replace("{paging}", this.getPagingHtml());

        },












        /*************************************************************************************
        *
        事件
        *
        *************************************************************************************/
        unBindSortEvent: function () {
            /// <summary>
            /// 解除排序事件绑定
            /// </summary>
            if (this.render == null)
                return;
            var thead = kinogam.getElementsByClassName(this.render, "headrow")[0];
            var ths = kinogam.getElementsByClassName(this.render, "headcell");

            for (var i = 0; i < ths.length; i++) {
                ths[i].controlGrid = null;
                ths[i].onclick = null;
            }

        },


        bindSortEvent: function () {
            /// <summary>
            /// 设置客户端排序事件
            /// </summary>
            if (this.source == null) return;
            var thead = kinogam.getElementsByClassName(this.render, "headrow")[0];
            thead.grid = this;

            var ths = kinogam.getElementsByClassName(this.render, "headcell");


            for (var i = 0; i < ths.length; i++) {
                if (this.columns[i].doSort == false)
                    return;

                ths[i].controlGrid = thead.grid;
                ths[i].mapping = this.columns[i].mapping;
                ths[i].onclick = function () {
                    var kgrid = this.controlGrid;
                    //var columnIndex = kinogam.getIndex(this);
                    //var column = kgrid.columns[columnIndex];

                    var column;
                    for (var j = 0; j < kgrid.columns.length; j++) {
                        if (kgrid.columns[j].mapping == this.mapping)
                            column = kgrid.columns[j]
                    }

                    if (column == null || column.mapping == null) {
                        return;
                    }
                    if (kgrid.sortColumnIndex == column.mapping && kgrid.sortColumnType == "desc")
                        kgrid.sortColumnType = "asc";
                    else
                        kgrid.sortColumnType = "desc";

                    kgrid.sortColumnIndex = column.mapping;

                    if (kgrid.sortColumnType == "desc") {
                        if (kgrid.enableAjaxPaging && (kgrid.tpIndex > 0 || kgrid.hasNext))
                            kinogam.Grid.bindAjaxData(kgrid, 0);
                        else
                            kinogam.quickSort(kgrid.source, column.mapping, true, thead.grid);
                    }
                    else {
                        if (kgrid.enableAjaxPaging && (kgrid.tpIndex > 0 || kgrid.hasNext))
                            kinogam.Grid.bindAjaxData(kgrid, 0);
                        else
                            kinogam.quickSort(kgrid.source, column.mapping, false, thead.grid);
                    }
                    kgrid.bindGrid();
                }


            }

        },
















        unBindPagingEvent: function () {
            /// <summary>
            /// 解除分页事件绑定
            /// </summary>
            if (this.render == null) return;

            var bprev = kinogam.getElementsByClassName(this.render, "bprev")[0];
            if (bprev) {
                bprev.controlGrid = null;
                bprev.onclick = null;
            }

            var first = kinogam.getElementsByClassName(this.render, "first")[0];
            if (first) {
                first.controlGrid = null;
                first.onclick = null;
            }

            /*prev*/
            var prev = kinogam.getElementsByClassName(this.render, "prev")[0];
            if (prev) {
                prev.controlGrid = null;
                prev.onclick = null;
            }

            var next = kinogam.getElementsByClassName(this.render, "next")[0];
            if (next) {
                next.controlGrid = null;
                next.onclick = null;
            }

            var last = kinogam.getElementsByClassName(this.render, "last")[0];
            if (last) {
                last.controlGrid = null;
                last.onclick = null;
            }

            var bnext = kinogam.getElementsByClassName(this.render, "bnext")[0];
            if (bnext) {
                bnext.controlGrid = null;
                bnext.onclick = null;
            }
        },















        bindPagingEvent: function () {
            /// <summary>
            /// 分页事件绑定
            /// </summary>

            var bprev = kinogam.getElementsByClassName(this.render, "bprev")[0];
            if (bprev) {
                bprev.controlGrid = this;
                bprev.onclick = this.ajaxPrev;
            }

            var first = kinogam.getElementsByClassName(this.render, "first")[0];
            if (first) {
                first.controlGrid = this;
                first.onclick = function () {
                    this.controlGrid.pageIndex = 0;
                    this.controlGrid.ajaxPaging = false;
                    this.controlGrid.bindGrid();
                }
            }


            var prev = kinogam.getElementsByClassName(this.render, "prev")[0];
            if (prev) {
                prev.controlGrid = this;
                prev.onclick = function () {
                    if (this.controlGrid.pageIndex - 1 >= 0) this.controlGrid.pageIndex--;
                    this.controlGrid.ajaxPaging = false;
                    this.controlGrid.bindGrid();
                }
            }

            var next = kinogam.getElementsByClassName(this.render, "next")[0];
            if (next) {
                next.controlGrid = this;
                next.onclick = function () {
                    if (this.controlGrid.pageIndex + 1 < this.controlGrid.pageCount) this.controlGrid.pageIndex++;
                    this.controlGrid.ajaxPaging = false;
                    this.controlGrid.bindGrid();
                }
            }

            var last = kinogam.getElementsByClassName(this.render, "last")[0];
            if (last) {
                last.controlGrid = this;
                last.onclick = function () {
                    this.controlGrid.pageIndex = this.controlGrid.pageCount - 1;
                    this.controlGrid.ajaxPaging = false;
                    this.controlGrid.bindGrid();
                }
            }

            var bnext = kinogam.getElementsByClassName(this.render, "bnext")[0];
            if (bnext) {
                bnext.controlGrid = this;
                bnext.onclick = this.ajaxNext;
            }
        },























        /*************************************************************************************
        *
        Ajax
        *
        *************************************************************************************/



        beforeBind: function () {

        },
        afterBind: function () {

        },
        ajaxPrev: function () {
            /// <summary>
            /// ajax分页，前n条数据
            /// </summary>
            this.controlGrid.pageIndex = 0;
            kinogam.Grid.bindAjaxData(this.controlGrid, -1);
        },
        ajaxNext: function () {
            /// <summary>
            /// ajax分页，后n条数据
            /// </summary>
            this.controlGrid.pageIndex = 0;

            kinogam.Grid.bindAjaxData(this.controlGrid, 1);
        },
        errorHandle: function () {
        },
        noDataHandle: function () {
        },
        beforeAjaxLoad: function () {
            /// <summary>
            /// 预留，ajax读取前事件
            /// </summary>
        },

        afterAjaxLoad: function () {
            /// <summary>
            /// 预留，ajax读取后事件
            /// </summary>
        },

        ajaxLoad: function () {
            kinogam.Grid.bindAjaxData(this, 0);
        },

        ajaxSearch: function () {
            this.ajaxLoad();
            this.pageIndex = 0;
            this.tpIndex = 0;
        },




















        /*************************************************************************************
        *
        绑定Grid
        *
        *************************************************************************************/



        bindGrid: function (s) {
            /// <summary>
            /// 绑定数据源。
            /// </summary>
            /// <param name="json" type="json">
            ///  1: json Grid的属性配置;
            ///  title:设置Grid的标题;
            ///  pageSize:设置每页的显示的行数;
            ///  dom:该控件绑定的dom对象;
            ///  source:数据源,一个2维数组,例子 [[0，'k'],[1,'i']];
            ///  columns:表头设置，例子 [{text:'开始时间',mapping:1} 还有可以扩展的handle;
            /// </param>

            this.beforeBind();

            if (arguments.length > 0 && s != null)
                this.setMember(s);

            if (this.source != null && this.columns != null) {
                this.unBindSortEvent();
                this.unBindPagingEvent();
                this.setPagingInfo();
                this.setGridHtml();
                /*this.render.innerHTML += this.getPagingHtml();*/
                this.bindSortEvent();
                this.bindPagingEvent();

                this.afterBind();

            }

        }


























    };


    /*************************************************************************************
    *
    静态方法
    *
    *************************************************************************************/




    kinogam.quickSort = function (arr, ci, uod) {
        /// <summary>
        /// 排序
        /// </summary>
        /// <param name="arr">进行排序的数组源</param>
        /// <param name="ci">对比列索引,json的话为json成员名</param>
        /// <param name="uod">true为升序,false为降序</param> 

        /*注意判断列必须同一类型，尽量在生成2维数组时判断处理，不然就应该在下面判断的地方强制转换 Number(a[ci]) 或者 String(a[ci])*/
        if (uod)
            arr.sort(function (a, b) { return a[ci] > b[ci] ? -1 : 1; });
        else
            arr.sort(function (a, b) { return a[ci] > b[ci] ? 1 : -1; });
    }





    kinogam.Grid.bindAjaxData = function (obj, aod) {
        /// <summary>
        /// ajax调用
        /// <param type="Object" name="obj">
        /// kinogam.ExGrid对象
        ///</param>
        /// <param type="Integer" name="aod">
        /// +1 表示增加页索引 -1则减少
        ///</param>
        /// <param type="String" name="_sortType">
        /// 排序类型
        ///</param>
        /// </summary>
        if (obj.ajaxUrl == "") return;
        if (aod < 0 && obj.tpIndex - 1 < 0) return;
        if (aod > 0 && !obj.hasNext) return;

        obj.beforeAjaxLoad.call();

        /*dc和filter预留来做查询类反射和查询条件字符串(最好使用键值映射)*/
        kinogam.ajax({
            url: obj.ajaxUrl,
            type: 'POST',
            data: {
                strbll: obj.strbll,
                filter: obj.filter,
                index: obj.tpIndex + aod,
                maxlength: (obj.pageSize * obj.maxPage),
                sortColumnIndex: obj.sortColumnIndex,
                sortType: obj.sortColumnType
            },
            error: function (result) {
                obj.errorHandle(result);
            },
            success: function (result) {
                if (result.length == 0 || result == "[]" || result == "null") {
                    obj.noDataHandle();
                    return;
                }

                eval("var json = " + result + ";");

                obj.source = json;

                if (json.columns)
                    obj.columns = json.columns;

                //obj.pageIndex = 0;
                obj.tpIndex = obj.tpIndex + aod;
                //obj.setPagingInfo();
                obj.bindGrid();
                obj.afterAjaxLoad(result);
            }
        });
    }

    kinogam.getIndex = function (obj) {
        /// <summary>
        /// 获取当前对象在父节点的index，不包括文本节点
        /// </summary>
        /// <param name="obj">dom对象</param>
        /// <return>-1表示没父节点，下标0</return>

        var p = obj.parentNode;
        var nodes = p.childNodes;
        var index = 0;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName) {
                if (nodes[i] == obj) {
                    return index;
                }
                index++;
            }
        }
        return -1;
    }

    kinogam.getElementsByClassName = function (obj, className) {
        /// <summary>
        /// 获取当前对象子节点的特定标签
        /// </summary>
        /// <param name="obj">dom对象</param>
        /// <param name="className">标签名</param>
        /// <return>dom对象数组</return>
        if (document.getElementsByClassName && document.documentElement.getElementsByClassName) {
            return obj.getElementsByClassName(className);
        }
        var doms = new Array();
        var tags = obj.getElementsByTagName("*");
        var r = new RegExp("\\b" + className + "\\b", "i");
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].className && r.test(tags[i].className))
                doms.push(tags[i]);
        }
        return doms;
    }




















})();