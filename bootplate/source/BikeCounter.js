enyo.kind({
    name: "BikeCounter",
    kind: "enyo.Control",
    fit: true,
    published: {
        type: "bikes"
    },
    components: [
        {kind: "enyo.Signals", onButtonGroupChosen: "fixIt", onDataRemove: "removeItem"},
        {kind: "enyo.FittableRows",components: [
            {name: "timer", kind: "Timer", length: 7200000, resetInterval: 900000},
            {kind: "onyx.Button", content: "Undo", ontap: "popup"},
            {name: "cont",kind: "enyo.FittableRows", fit: true, classes: "bikeTable",components: [
                {name: "tabula",tag: "table", style: "width: 100%; border-width: 0px;",components: [
                    {tag: "tr",components: [
                        {tag: "td"},
                        {tag: "td",classes: "tableCell tableBike",colspan: 1,components: [
                            {kind: "enyo.Image", src: "assets/man_small.png"}
                        ]},
                        {tag: "td",classes: "tableCell tableBike",components: [
                            {kind: "enyo.Image", src: "assets/woman_small.png"}
                        ]},
                        {tag: "td",classes: "tableCell tablePed",components: [
                            {kind: "enyo.Image", src: "assets/man_small.png"}
                        ]},
                        {tag: "td",classes: "tableCell tablePed",components: [
                            {kind: "enyo.Image", src: "assets/woman_small.png"}
                        ]}
                    ]},
                    {tag: "tr",components: [
                        {name: "adultTitle", classes: "ageTitle", tag: "td",components: [
                            {kind: "enyo.Image", src: "assets/adult_small.png"}
                        ]},
                        {tag: "td",classes: "tableBike tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/helmet_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tableBike tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/helmet_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/assistive2_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/assistive2_small.png"}
                            ]}
                        ]}
                    ]},
                    {tag: "tr",components: [
                        {tag: "td",classes: "tableBike tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/bike_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tableBike tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/bike_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/ped_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/ped_small.png"}
                            ]}
                        ]}
                    ]},
                    {tag: "tr",components: [
                        {name: "kidTitle",tag: "td",classes: "ageTitle",components: [
                            {kind: "enyo.Image", src: "assets/child_small.png"}
                        ]},
                        {tag: "td",classes: "tableBike tableChild tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/helmet_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tableBike tableChild tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/helmet_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableChild tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/assistive2_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableChild tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/assistive2_small.png"}
                            ]}
                        ]}
                    ]},
                    {tag: "tr",components: [
                        {tag: "td",classes: "tableBike tableChild tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/bike_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tableBike tableChild tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/bike_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableChild tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/ped_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableChild tableCell",components: [
                            {kind: "CountButton", components: [
                                {kind: "onyx.Icon", src: "assets/ped_small.png"}
                            ]}
                        ]}
                    ]}
                ]},
                {name: "popup", kind: "onyx.Popup", scrim: true, scrimWhenModal: false, centered: true, modal: true, autoDismiss: true, floating: true, style: "width: 80%; height: 80%;", /*layoutKind: "enyo.FittableRowsLayout",*/ components: [
                    {kind: "onyx.Button", content: "Close", ontap: "popdown", style: "width: 100%; clear: both;"},
                    {name: "ticker", fit: true, style: "clear: both;", kind: "TickerList"}
                ]}
            ]}
        ]}
    ],
    events: {
        onTimer: "",
        onStartTimer: "",
        onDrawerOk: ""
    },
    handlers: {
        on2DrawerClick: "build",
        ontap: "storeCountData",
        onDataRemove: "removeItem"
    },
    create: function(a, b) {
        this.inherited(arguments);
        this.$.tabula.setAttribute("border-width", 0);
        this.$.adultTitle.setAttribute("rowspan", 2);
        this.$.kidTitle.setAttribute("rowspan", 2);

        this.gender = false;
        this.age = false;

        this.bike = true;
        this.ped = true;

        this.assisted = false;
        this.helmet = false;

        LocalStorage.set("dataArray", []);
        LocalStorage.remove("countData");
    },
    reset: function() {
        var rows = this.$.tabula.children;
        for (var i in rows) {
            var cols = rows[i].children;
            for(var j in cols) {
                cols[j].addRemoveClass("tableHide", false);
                cols[j].applyStyle("visibility", null);
            }
        }
    },
    popup: function(inSender, inEvent) {
        this.$.popup.resized();
        this.$.popup.render();
        this.$.popup.show();
    },
    popdown: function(inSender, inEvent) {
        this.$.popup.hide();
    },
    build: function(a, b) {
        var rows = this.$.tabula.children;
        this.reset();
        for (var i in rows) {
            var cols = rows[i].children;
            for (var j in cols) {
                if (this.gender && i == 0) {
                    if(this.age ? j > 0 : true) {
                        if(!this.bike && this.ped && j <= 2)
                            cols[j].addRemoveClass("tableHide", !this.bike);
                        if(this.bike && !this.ped && j >= 3)
                            cols[j].addRemoveClass("tableHide", !this.ped);
                    }
                } else if ((i == 1 || i == 3) && j > 0) {
                    if(this.bike && !this.ped && j > 2) {
                        cols[j].addRemoveClass("tableHide", this.bike);
                    } else if (!this.bike && this.ped && j < 3) {
                        cols[j].addRemoveClass("tableHide", this.ped);
                    } else {
                        if(this.age) {
                            if(!this.bike && this.ped && j < 3 && !this.assisted)
                                cols[j].addRemoveClass("tableHide", !this.bike);
                            if(this.bike && !this.ped && !this.helmet)
                                cols[j].addRemoveClass("tableHide", !this.ped);
                        }
                        if(!this.assisted) {
                            if(!this.helmet)
                                cols[j].addRemoveClass("tableHide", !this.helmet);
                            if(j > 2 && this.bike)
                                cols[j].addRemoveClass("tableHide", !this.assisted);
                        } else {
                            if(!this.helmet && !this.ped) {
                                if (j < 3) {
                                    if(this.bike)
                                        cols[j].applyStyle("visibility", "hidden");
                                    else
                                        cols[j].addRemoveClass("tableHide", !this.bike) 
                                }
                            }
                        }
                    }
                } else if (i == 2 || i == 4) {
                    if(!this.bike && this.ped && j < 2)
                        cols[j].addRemoveClass("tableHide", !this.bike) 
                    if(this.bike && !this.ped && j >= 2)
                        cols[j].addRemoveClass("tableHide", !this.ped) 
                }
                if(!this.gender) {
                    if(i == 0) {
                        cols[j].addRemoveClass("tableHide", !this.gender);
                    } else if (j == 1 || j == 3) {
                        if(i >=1)
                            cols[j].addRemoveClass("tableHide", !this.gender);
                    }
                }
                //SOME WEIRD CODE HERE, LOOK LATER
                if(!this.age) {
                    if(((i <= 1 || i == 3) && j == 0) || i >=3)
                        cols[j].addRemoveClass("tableHide", !this.age);
                }
            }
        }
        this.render();
        /*if(this.parent.parent.parent.getOpen())
            this.doDrawerOk();*/
        this.doDrawerOk();
        return true;
    },
    fixIt: function(a, b) {
        var c, d, e;
        if(b.name.indexOf("checkbox") != -1) {
            c = b.name.split("_")[1];
            d = b.parent.$["content_" + c].getContent();
            e = b.getValue();
        } if (b.name.indexOf("radioButton") != -1) {
            d = b.content;
        }
        this.log(d);

        switch (d) {
            case "Age":
                this.age = e;
            break;
            case "Gender":
                this.gender = e;
            break;
            case "Assistive":
                this.assisted = e;
            break;
            case "Helmet":
                this.helmet = e;
            break;
            case "Both":
                this.bike = true;
                this.ped = true;
            break;
            case "Bicycles":
                this.bike = true;
                this.ped = false;
            break;
            case "Pedestrians":
                this.bike = false;
                this.ped = true;
            break;
        }
        this.build();
        this.reflow();
        this.render();
    },
    getData: function() {
        /*var a = this.$.tabula.children, 
        b = [];
        for (var c = 2; c < a.length; c++) {
            b.push([]);
            var d = a[c].children;
            for (var i = 1; e < d.length; e++)
            b[c - 2].push(d[i].children[0].getCount());
        }
        this.log(b);*/
       return LocalStorage.get("countData");//this.dataArray;
    },
    storeCountData: function(inSender, inEvent) {
        //this.log();
        var inKind = inEvent.originator.kind.toString();
        var inName;
        //column siblings
        var sibs;
        //column name
        var sibName;
        //row siblings
        var uncles;
        var us;
        var i, j; //indices

        if(inKind === "onyx.Icon") {
            us = inEvent.originator.parent;
            inName = inEvent.originator.parent.parent.name;
            uncles = inEvent.originator.parent.parent.parent.parent.children;
            sibs = inEvent.originator.parent.parent.parent.children;
            sibName = inEvent.originator.parent.parent.parent.name;
        }
        if(inKind === "CountButton") {
            us = inEvent.originator;
            inName = inEvent.originator.parent.name;
            uncles = inEvent.originator.parent.parent.parent.children;
            sibs = inEvent.originator.parent.parent.children;
            sibName = inEvent.originator.parent.parent.name;
        }
        if(us != undefined && us.kind.toString() === "CountButton") {
            for(var k in sibs) {
                if(sibs[k].name === inName)
                    j = k;
            }
            for(var l in uncles) {
                if(uncles[l].name === sibName)
                    i = l;
            }
            tmp = Data.getBikeData(i, j, this.age, this.gender, this.helmet, this.assisted, this.bike, this.ped);
            //this.$.ticker.addToArray(inName + " " + 1 + " " +  tmp.join(", "));;
            tmp.unshift((new Date()).getTime());
            //var t = LocalStorage.get("dataArray");
            //t.push(tmp);
            //LocalStorage.set("dataArray", t);
            tmp.unshift(inName);
            Data.countAdd(tmp);
            this.$.ticker.refreshList();
            return true;
        }
    },
    removeItem: function(inSender, inEvent) {
        this.$[inEvent.name].children[0].decrement();
    }
});


