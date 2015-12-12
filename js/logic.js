jsPlumb.ready(function() {
    var instance = window.jsp = jsPlumb.getInstance();

    instance.importDefaults({
        DragOptions: {
            cursor: 'crosshair',
            zIndex: 2000
        },
        PaintStyle: {
            strokeStyle: '#110B11'
        }, //元素的默认颜色
        EndpointStyle: {
            width: 20,
            height: 16,
            strokeStyle: '#110B11'
        }, //连接点的默认颜色
        Endpoint: "Rectangle", //连接点的默认形状
        connector: ["Flowchart", {
            stub: [40, 60],
            gap: 70,
            cornerRadius: 5,
            alwaysRespectStubs: false
        }],
        ConnectionOverlays: [
            ["Arrow", {
                location: 0.8,
                width: 15,
                height: 7,
                foldback: 0.85,
            }]
        ],
        Container : "container",
    });

    // this is the paint style for the connecting lines..
    var momConPaintStyle = {
            lineWidth: 2,
            outlineWidth: 3,
            strokeStyle: "#576CA8",
            joinstyle: "round",
            outlineColor: "transparent",
        },
        // .. and this is the hover style.
        momConHoverStyle = {
            lineWidth: 2,
            strokeStyle: "#274690",
            outlineWidth: 2,
            outlineColor: "white"
        },
        momEndPointHS = {
            fillStyle: "#274690",
            strokeStyle: "#274690"
        },
        // the definition of source endpoints (the small blue ones)
        momSourceEP = {
            endpoint: "Dot",
            anchor: "BottomCenter",
            paintStyle: {
                strokeStyle: "#1B264F",
                fillStyle: "transparent",
                radius: 7,
                lineWidth: 3
            },
            isSource: true,
            connector: ["Flowchart", {
                stub: [40, 60],
                gap: 10,
                cornerRadius: 5
            }],
            connectorStyle: momConPaintStyle,
            hoverPaintStyle: momEndPointHS,
            connectorHoverStyle: momConHoverStyle,
            dragOptions: {},
            maxConnections: -1,
            scope : "mom2child",
        },
        // the definition of target endpoints (will appear when the user drags a connection)
        momTargetEP = {
            endpoint: "Dot",
            anchor: "TopCenter",
            paintStyle: {
                fillStyle: "#1B264F",
                radius: 7
            },
            hoverPaintStyle: momEndPointHS,
            maxConnections: 1,
            dropOptions: {
                hoverClass: "hover",
                activeClass: "active"
            },
            isTarget: true,
            scope : "mom2child",
        };
        var wifeConPaintStyle = {
            lineWidth: 2,
            outlineWidth: 3,
            strokeStyle: "#576CA8",
            joinstyle: "round",
            outlineColor: "transparent",
        },
        // .. and this is the hover style.
        wifeConHoverStyle = {
            lineWidth: 2,
            strokeStyle: "#274690",
            outlineWidth: 2,
            outlineColor: "white"
        },
        wifeEndPointHS = {
            fillStyle: "#274690",
            strokeStyle: "#274690"
        },
        // the definition of source endpoints (the small blue ones)
        wifeSourceEP = {
            endpoint: "Rectangle",
            anchor: "RightMiddle",
            paintStyle: {
                width: 15,
                height: 15,
                strokeStyle: "#1B264F",
                lineWidth: 5
            },
            isSource: true,
            connector: ["Flowchart", {
                stub: [40, 60],
                gap: 10,
                cornerRadius: 5
            }],
            connectorStyle: wifeConPaintStyle,
            hoverPaintStyle: wifeEndPointHS,
            connectorHoverStyle: wifeConHoverStyle,
            dragOptions: {},
            maxConnections: -1,
            scope : "hus2wife",
        },
        // the definition of target endpoints (will appear when the user drags a connection)
        wifeTargetEP = {
            endpoint: "Rectangle",
            anchor: "LeftMiddle",
            paintStyle: {
                width: 15,
                height: 15,
                strokeStyle: "#1B264F",
                fillStyle: "transparent",
                lineWidth: 15
            },
            hoverPaintStyle: wifeEndPointHS,
            maxConnections: 1,
            dropOptions: {
                hoverClass: "hover",
                activeClass: "active"
            },
            isTarget: true,
            scope : "hus2wife",
        };

    var showBox = function(obj, event) {
        var box = $('<div>').addClass("modify-box");
        var title = $('<h3>').text("Select");
        var nameDiv = $('<div>').addClass("input-group");
        var nameInput = $("<input>").attr("type", "text").attr("aria-describedby", "basic-addon1").addClass("form-control").attr("id", "name").val(obj.attr("name"));
        var nameBtn = $("<a>").attr("href", "#").addClass("input-group-addon").attr("id", "basic-addon1");
        var nameSpan = $("<span>").addClass("glyphicon glyphicon-pencil").attr("aria-hidden", "true");
        nameBtn.append(nameSpan);
        nameBtn.click(function(){
            var n = nameInput.val();
            if(n.length) {
                var child = $(".item-active").children();
                $(".item-active").attr("name",n);
                $(".item-active").text(n);
                $(".item-active").append(child);
            }
        });
        nameInput.keydown(function(event){
            if (event.which === 13) {
                nameBtn.click();
            }
        })
        nameDiv.append(nameInput).append(nameBtn);

        var ageDiv = $('<div>').addClass("input-group");
        var ageInput = $("<input>").attr("type", "text").attr("aria-describedby", "basic-addon2").addClass("form-control").attr("id", "age").val(obj.attr("age"));
        var ageBtn = $("<a>").attr("href", "#").addClass("input-group-addon").attr("id", "basic-addon2");
        var ageSpan = $("<span>").addClass("glyphicon glyphicon-pencil").attr("aria-hidden", "true");
        ageBtn.append(ageSpan);
        ageBtn.click(function(){
            var n = ageInput.val();
            if(n.length) {
                var n = ageInput.val();
                if(n.length) {
                    setAge($(".item-active"), n);
                }
            }
        });
        ageInput.keydown(function(event){
            if (event.which === 13) {
                ageBtn.click();
            }
        })
        ageDiv.append(ageInput).append(ageBtn);
        box.append(title).append(nameDiv).append(ageDiv);
        box.css({
            "left": event.pageX - parseInt($("#container").css("margin-left"), 10),
            "top": event.pageY
        })
        box.click(function(event){
            event.stopPropagation();
        });
        box.dblclick(function(event){
            event.stopPropagation();
        });
        box.hide();
        $("#container").append(box);
        box.fadeIn(200);
        nameInput.focus();

    }

    var EndpintsUuid = 0;
    var createPerson = function(X, Y, iden, type, name, a) {
        if(!type) return false;

        if(iden != "root") {
            switch(type) {
                case "man": {
                    iden = "Man" + i;
                    break;
                }
                case "wife": {
                    iden = "Woman" + i;
                    break;
                }
                case "daut": {
                    iden = "Girl" + i;
                    break;
                }
                default: {
                    return false;
                }
            }
        }
        name = (name)?name:iden;
        a = (a)?a:"xxxx - xxxx";
        var newState = $('<div>').attr('id', iden).addClass('item').addClass(type).text(name);
        var age = $('<div>').addClass('item-age').text(a);
        newState.attr('name', name);
        newState.attr('age', a);
        newState.append(age);
        var closeBtn = $('<button class="close close-btn" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        newState.css({
            'top': Y,
            'left': X
        });
        newState.attr('root', iden); // The root of this tree
        newState.attr('type', type);
        $(".btn-list").remove();
        $('#container').append(newState);
        newState.hide();
        newState.fadeIn("slow", done=function() {
            switch(type) {
                case "root": {
                    instance.addEndpoint(iden, wifeSourceEP, {uuid:"ep"+EndpintsUuid});
                    newState.attr('source-uuid', "ep"+EndpintsUuid);
                    EndpintsUuid++;
                    break;
                }
                case "man": {
                    newState.append(closeBtn);
                    instance.addEndpoint(iden, wifeSourceEP, {uuid:"ep"+EndpintsUuid});
                    newState.attr('source-uuid', "ep"+EndpintsUuid);
                    EndpintsUuid++;
                    instance.addEndpoint(iden, momTargetEP, {uuid:"ep"+EndpintsUuid});
                    newState.attr('target-uuid', "ep"+EndpintsUuid);
                    EndpintsUuid++;
                    break;
                }
                case "wife": {
                    newState.append(closeBtn);
                    instance.addEndpoint(iden, momSourceEP, {uuid:"ep"+EndpintsUuid});
                    newState.attr('source-uuid', "ep"+EndpintsUuid);
                    EndpintsUuid++;
                    instance.addEndpoint(iden, wifeTargetEP, {uuid:"ep"+EndpintsUuid});
                    newState.attr('target-uuid', "ep"+EndpintsUuid);
                    EndpintsUuid++;
                    break;
                }
                case "daut": {
                    newState.append(closeBtn);
                    instance.addEndpoint(iden, momTargetEP, {uuid:"ep"+EndpintsUuid});
                    newState.attr('target-uuid', "ep"+EndpintsUuid);
                    EndpintsUuid++;
                    break;
                }
            }

            instance.draggable(newState, {
                containment: 'parent'
            });

            closeBtn.click(function(e) {
                e.stopPropagation();
                if($(this).parent().attr('id') === "root") {
                    return false;
                }
                instance.detachAllConnections($(this).parent());
                instance.remove($(this).parent());
            });

            newState.dblclick(function(event){
                $(".modify-box").remove();
                showBox($(this), event);
                $(".item-active").removeClass("item-active");
                $(this).addClass("item-active");
                event.stopPropagation();
            });

            newState.click(function(event){
                event.stopPropagation();
            });
        });
        i++;
        return newState;
    };


    var showBtnList = function(X, Y, iden) {
        X -= parseInt($("#container").css("margin-left"), 10);
        Y += $("#container").scrollTop();

        var list = $('<div>').addClass('btn-list');
        var btn1 = $('<button>').addClass("btn btn-default").attr("aria-label", "Left Align");
        var span1 = $('<span>').addClass("glyphicon glyphicon-king").attr("aria-hidden", "true");
        var btn2 = $('<button>').addClass("btn btn-default").attr("aria-label", "Left Align");
        var span2 = $('<span>').addClass("glyphicon glyphicon-queen").attr("aria-hidden", "true");
        var btn3 = $('<button>').addClass("btn btn-default").attr("aria-label", "Left Align");
        var span3 = $('<span>').addClass("glyphicon glyphicon-pawn").attr("aria-hidden", "true");
        btn1.append(span1);
        btn2.append(span2);
        btn3.append(span3);
        list.append(btn1);
        list.append(btn2);
        list.append(btn3);

        btn1.click(function(){
            createPerson(X, Y, iden, "man");
        });
        btn2.click(function(){
            createPerson(X, Y, iden, "wife");
        });
        btn3.click(function(){
            createPerson(X, Y, iden, "daut");
        });
        list.css({
            'left': X,
            'top': Y 
        });
        $('#container').append(list);
        list.hide();
        list.fadeIn(300);
    };


    var check = function(info) {
        if(info.sourceId === info.targetId) {
            return false;
        } else if($("#"+info.targetId).attr('root') === $("#"+info.sourceId).attr('root')) {
            return false;
        } else if($("#"+info.sourceId).attr('root') != "root") {
            return false;
        } else if($("#"+info.targetId).attr('root') === "root"){
            return false;
        } else {
            return true;
        }
    };


    instance.bind('beforeDrop', function(info) {
        return check(info);
    });


    instance.bind("connection", function (info, originalEvent) {
        $("#"+info.targetId).attr('root', $("#"+info.sourceId).attr('root'));
    });


    var getDetachableCon = function(target) {
        var con = null;
        $.each(instance.getAllConnections(), function(index, connection) {
            if(connection.targetId === target) {
                con = connection;
            }
        });
        return con;
    };


    var detachAll = function dta(root) {
        var list = getList(root);
        if(list) {
            $.each(list, function(n, el){
                dta(el);
            });
        }
        var con = getDetachableCon(root);
        if(con) {
            instance.detach(con);
        }
    };


    var beginDetachAll = function(root) {
        familyTree = {};
        var saveFlag = SaveConnectionSet();
        if(saveFlag) {
            detachAll(root);
        }
    };


    instance.bind("connectionDetached", function(info, originalEvent) {
        var tar = $("#"+info.targetId)
        tar.attr('root', tar.attr('id'));
        beginDetachAll(info.targetId);
        return true;
    });


    instance.bind("connectionMoved", function(info, originalEvent) {
        var tar = $("#"+info.originalTargetId)
        tar.attr('root', tar.attr('id'));
        beginDetachAll(info.originalTargetId);
    });


    var i = 0;
    $("#new-btn").click(function(event){
        createPerson(event.pageX, event.pageY, "Human" + i);
    });

    $("#show-links-btn").click(function(event){
        $("#links-list-area").val("");
        $.each(instance.getAllConnections(), function(index, el) {
            var name1 = $("#"+el.sourceId).attr("name");
            var name2 = $("#"+el.targetId).attr("name");
            $("#links-list-area").val($("#links-list-area").val() + name1 + " -> " + name2 + "\n");
        });
        if($("#links-list-area").val() === "") {
            $("#links-list-area").val("No connection...");
        }
        $("#links-list").fadeIn(400);
    });

    $("#container").dblclick(function(event){
        showBtnList(event.pageX, event.pageY, "Human" + i);
    });

    $("#container").click(function() {
        $(".item-active").removeClass("item-active");
        $(".light-up").removeClass("light-up");
        $(".high-light").removeClass("high-light");
        $(".btn-list").fadeOut(300, done=function(){
            $(".btn-list").remove();
        });
        $(".modify-box").fadeOut(200);
        $("#links-list").fadeOut(200);
    });

    var setAge = function(target, age) {
        target.attr("age",age);
        target.children("div").text(age);
    }

    var levNum = [];
    var setCoorPerson= function(level,info) {
        while(level>=levNum.length) {
            levNum.push(0);
        }
        var X = levNum[level]*120 + 40;
        var Y = level*150 + 40;
        levNum[level]++;
        return createPerson(X, Y, info["iden"], info["type"], info["name"]);
    };
    
    var myConnect = function(sou, tar) {
        setTimeout(function(){
            instance.connect({
                uuids: [sou.attr('source-uuid'), tar.attr('target-uuid')]
            });
        }, 1000);
    };

    var buildTree = function bt(person, level) {
        if(person["info"]["type"] === "root" || person["info"]["type"] === "man") {
            if(!person["wife"]) {
                var me = setCoorPerson(level, person["info"]);
            } else {
                var me = setCoorPerson(level, person["info"]);
                $.each(person["wife"], function(index, wf) {
                    var wife = bt(wf, level);
                    myConnect(me,wife);
                });
            }
        } else if(person["info"]["type"] === "wife") {
            if(!person["children"]) {
                var me = setCoorPerson(level, person["info"]);
            } else {
                var me = setCoorPerson(level, person["info"]);
                $.each(person["children"], function(index, ch) {
                    var child = bt(ch, level+1);
                    myConnect(me,child);
                });            }
        } else if(person["info"]["type"] === "daut") {
            var me = setCoorPerson(level, person["info"]);
        } else {
            return;
        }
        me.attr('root', 'root');
        setAge(me, person["info"]["age"]);
        return me;
    };

    $("#load-btn").click(function(event) {
        instance.empty("container");
        levNum = [];
        i = 0;
        try {
            var txt = $("#json-data").val();
            var json = $.parseJSON(txt);
            buildTree(json, 0);
            setTimeout(function(){
                $("#close-btn").click();
            }, 1500);
        } catch(e) {
            setTimeout(function(){$("#destroy-btn").click();}, 300);
            alert("Data error!");
        }
    });

    var familyTree = {};
    var saveTree = function st(person) {
        var me = {};
        var obj = $("#" + person);
        me["info"] = {
            "type": obj.attr("type"),
            "iden": obj.attr("id"),
            "name": obj.attr("name"),
            "age" : obj.attr("age")
        };
        if(obj.attr("type") === "root" || obj.attr("type") === "man") {
            me["wife"] = [];
            if(familyTree[person]) {
                $.each(familyTree[person], function(index, wife) {
                    me["wife"].push(st(wife));
                });
            }
        } else if (obj.attr("type") === "wife") {
            me["children"] = [];
            if(familyTree[person]) {
                $.each(familyTree[person], function(index, child) {
                    me["children"].push(st(child));
                });
            }
        }
        return me;
    };

    var SaveConnectionSet = function() {
        $.each(instance.getAllConnections(), function(index, el) {
            if(familyTree[el.sourceId]) {
                familyTree[el.sourceId].push(el.targetId);
            } else {
                familyTree[el.sourceId] = [el.targetId];
            }
        });
        return true;
    };

    var changeFlag = true;
    $("#save-btn").click(function(event) {
        $("#json-data").val("");
        familyTree = {};
        var saveFlag = SaveConnectionSet();
        var tree = saveTree("root");
        if(saveFlag && changeFlag) {
            $("#json-data").val(JSON.stringify(tree, null, 4));
        }
    });

    $("#rebuild-btn").click(function(){
        var text = $("#json-data").val();
        $("#save-btn").click();
        instance.detachAllConnections($("#root"));
        instance.deleteEveryEndpoint();
        var moveList = [];
        $.each($(".item"), function(n, el){
            moveList.push($(el).attr("id"));
        });
        $.each(moveList, function(n,el){
            $("#"+el).animate({
                left: "-100px",
                top: "-100px"
            }, 500);
        });
        setTimeout(function(){
            $("#load-btn").click();
            $("#json-data").val(text);
        }, 600);
        
    });

    $("#close-btn").click(function(){
        var w = -($(".sidebar").width()+40);
        $(".sidebar").animate({
            left: w+"px",
        },300);
        $("#open-btn").animate({
            right: "10px",
        },300);
        $("#container").animate({
            "margin-left": "0px",
        },260);
        $("#help-text").fadeOut('fast');
        $("#help-conn").fadeOut('fast');
    });

    $("#open-btn").click(function(){
        var w = ($(".sidebar").width()+40);
        $(".sidebar").animate({
            left: 0+"px",
        },300);
        $("#open-btn").animate({
            right: "300px",
        },300);
        $("#container").animate({
            "margin-left": w+"px",
        },340);
    });

    $("#json-data").click(function(){
        this.select();
    });

    $("#clear-btn").click(function(){
        $("#json-data").val("");
    });

    /////////// Search begin //////////////
    var stack = []; // Stack object
    var getTop = function(sk) {
        return sk.length?sk[sk.length-1]:null;
    }

    var getList = function(iden) {
        var type = $("#"+iden).attr("type");
        return familyTree[iden];
    }

    var lightUp = function(sk) {
        $.each(sk, function(n, val){
            $("#"+val).addClass("light-up");
        });
        $("#"+getTop(sk)).removeClass("light-up");
        $("#"+getTop(sk)).addClass("high-light");
        return;
    }

    var checkMatch = function(visiting, target) {
        if($("#"+visiting).attr("name").toLowerCase().indexOf(target.toLowerCase()) >= 0) {
            lightUp(stack);
            return true;
        } else {
            return false;
        }
    };

    var findTarget = function ft(visiting, target) {
        stack.push(visiting);
        checkMatch(visiting, target);
        var list = getList(visiting);
        if(list && list.length) {
            $.each(list, function(n, val){
                ft(val, target);
            });
        } else {
            // stack.pop();
        }
        stack.pop();
    };


    $("#search-btn").click(function(event){
        $("#container").click();
        familyTree = {};
        var saveFlag = SaveConnectionSet();
        var target = $("#search-input").val();
        if(saveFlag && target) {
            findTarget("root", target);
        }
    });

    var realTimeSearch = true;
    $("#search-input").keyup(function(event){
        if(event.which === 13) {
            $("#search-btn").click();
        }
        if(realTimeSearch) {
            $("#search-btn").click();
        }
    });
    /////////// Search end ///////////

    ////// New functions begin //////////
    var newBg = function(imgNum) {
        $("#container").css('background-image', "url(img/bg" + imgNum + ".png)");
    };


    var bgimg = 0;
    var imgMax = 8;
    $("#change-bg-btn").click(function(){
        bgimg = (bgimg+1) % imgMax;
        newBg(bgimg);
    });

    $("#destroy-btn").click(function(){
        instance.detachAllConnections($("#root"));
        instance.deleteEveryEndpoint();
        var moveList = [];
        $.each($(".item"), function(n, el){
            moveList.push($(el).attr("id"));
        });
        $.each(moveList, function(n,el){
            $("#"+el).fadeOut(500);
        });
        setTimeout(function(){
            instance.empty("container");
            createPerson(40, 40, "root", "root");
        }, 600);
    });

    $("#real-time-btn").click(function() {
        realTimeSearch = !realTimeSearch;
        if(realTimeSearch) {
            $("#real-time-btn").text("Real time on");
        } else {
            $("#real-time-btn").text("Real time off");
        }
    });

    ////// New functions end ////////////

    ////// help text begin ////////////

    $("#show-help-btn").click(function(event) {
        $("#help-conn").fadeOut(200);
        $("#help-text").fadeIn(400);
    });

    $("#detail-btn").click(function(event) {
        $("#help-text").fadeOut(200);
        $("#help-conn").fadeIn(400);
    });

    ////// help text end ////////////
    bgimg = parseInt(Math.random()*100)%imgMax;
    newBg(bgimg);
    setTimeout(function() {
        $("#close-btn").click();
    },500);
    createPerson(40, 40, "root", "root");
    console.log("Done.");
});


// 2015 12 09 18 07
// 2015 12 09 22 25
// 2015 12 11 16 31