$.fn.kDrag = function (s) {
    ///<summay>
    ///kinogam拖动插件
    ///</summary>

    var dragObj = window.dragObj = null;
    var ix = window.ix = 0;
    var iy = window.iy = 0;
    var ktempStyle = "";

    /*鼠标容差器*/
    var movecount = window.movecount = 0;

    $(this.selector).live("mousedown", function (event) {
        var e = event || window.event;

        this.mousedown_event = null;
        this.moving_event = null;
        this.beforemove_event = null;
        this.mouseup_event = null;
        this.doReset = false;

        /*成员匹配赋值*/
        if (s != null) {
            for (var i in s) {
                this[i] = s[i];
            }
        }

        ix = e.clientX - $(this).offset().left;
        iy = e.clientY - $(this).offset().top;

        dragObj = this;
        dragObj.isDrag = false;

        ktempStyle = dragObj.getAttribute("style");
        /*处理鼠标点下事件*/
        if (this.mousedown_event != null && typeof (this.mousedown_event) == "function")
            this.mousedown_event.call(this, e);

        $(document).bind("mousemove", function (event) {
            if (movecount < 1) {
                movecount++;
                return;
            }
            var e = event || window.event;
            if (dragObj.isDrag == false) {
                dragObj.isDrag = true;
                $(dragObj).css({ width: $(dragObj).width(), height: $(dragObj).height() });
                dragObj.style.position = "absolute";
                dragObj.style.top = (e.clientY - iy) + "px";
                dragObj.style.left = (e.clientX - ix) + "px";

                /*处理鼠标拖动事件*/
                if (dragObj.beforemove_event != null && typeof (dragObj.beforemove_event) == "function")
                    dragObj.beforemove_event.call(dragObj, e);

            }
            dragObj.style.top = (e.clientY - iy) + "px";
            dragObj.style.left = (e.clientX - ix) + "px";

            /*处理正在拖动事件*/
            if (dragObj.moving_event != null && typeof (dragObj.moving_event) == "function")
                dragObj.moving_event.call(dragObj, e);

        });
    });
    $(document).mouseup(function (event) {

        var e = event || window.event;
        if (dragObj == null)
            return;

        movecount = 0;

        if (dragObj.mouseup_event != null && typeof (dragObj.mouseup_event) == "function")
            dragObj.mouseup_event.call(dragObj, e);


        $(document).unbind("mousemove");

        /*处理鼠标松开事件*/
        if (dragObj.doReset) {
            $(dragObj).attr("style", ktempStyle);
        }

        dragObj.isDrag = false;
        dragObj = null;
    });


};