enyo.kind({
    name: "BikeCounter",
    kind: "enyo.Control",
    fit: true,
    published: {
        type: "bikes"
    },
    components: [
        {kind: "enyo.Signals", onButtonGroupChosen: "fixIt"},
        {kind: "enyo.FittableRows",components: [
            {name: "timer", kind: "enyo.FittableColumns", components: [
                {kind: "onyx.Button", content: "Start Counting!", style: "width: 50%;", ontap: "startTimer"},
                {name: "columnsDrawer",style: "white-space: nowrap; overflow: hidden;", orient: "h", kind: "onyx.Drawer", open: false, components: [
                    {name: "counter", content: "00:00:00"}
                ]}
            ]},
            {name: "cont",kind: "enyo.FittableRows",classes: "bikeTable",components: [
                {name: "tabula",tag: "table",style: "width: 100%;, height: 100%; border-width: 0px;",components: [
                    {tag: "tr",components: [
                    ]},
                    {tag: "tr",components: [
                        {tag: "td"},
                        {tag: "td",classes: "tableCell tableBike",colspan: 1,components: [
                            {kind: "enyo.Image",src: "assets/man_small.png"}
                        ]},
                        {tag: "td",classes: "tableCell tableBike",components: [
                            {kind: "enyo.Image",src: "assets/woman_small.png"}
                        ]},
                        {tag: "td",classes: "tableCell tablePed",components: [
                            {kind: "enyo.Image",src: "assets/man_small.png"}
                        ]},
                        {tag: "td",classes: "tableCell tablePed",components: [
                            {kind: "enyo.Image",src: "assets/woman_small.png"}
                        ]}
                    ]},
                    {tag: "tr",components: [
                        {name: "adultTitle",tag: "td",components: [
                            {kind: "enyo.Image",src: "assets/adult_small.png"}
                        ]},
                        {tag: "td",classes: "tableBike tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/helmet_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tableBike tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/helmet_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/assistive2_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/assistive2_small.png"}
                            ]}
                        ]}
                    ]},
                    {tag: "tr",components: [
                        {tag: "td",classes: "tableBike tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/bike_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tableBike tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/bike_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/ped_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/ped_small.png"}
                            ]}
                        ]}
                    ]},
                    {tag: "tr",components: [
                        {name: "kidTitle",tag: "td",classes: "tableChild",components: [
                            {kind: "enyo.Image",src: "assets/child_small.png"}
                        ]},
                        {tag: "td",classes: "tableBike tableChild tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/helmet_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tableBike tableChild tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/helmet_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableChild tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/assistive2_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableChild tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/assistive2_small.png"}
                            ]}
                        ]}
                    ]},
                    {tag: "tr",components: [
                        {tag: "td",classes: "tableBike tableChild tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/bike_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tableBike tableChild tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/bike_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableChild tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/ped_small.png"}
                            ]}
                        ]},
                        {tag: "td",classes: "tablePed tableChild tableCell",components: [
                            {kind: "CountButton",components: [
                                {kind: "onyx.Icon",src: "assets/ped_small.png"}
                            ]}
                        ]}
                    ]}
                ]},
                {name: "ticker", fit: true, style: "clear: both;", kind: "TickerList"} 
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
        onCountButtonTapped: "storeCountData"
    },
    create: function(a, b) {
        this.inherited(arguments);
        this.$.tabula.setAttribute("border-width", 0);
        //this.$.bikeTitle.setAttribute("colspan", 2);
        //this.$.pedTitle.setAttribute("colspan", 2);
        this.$.adultTitle.setAttribute("rowspan", 2);
        this.$.kidTitle.setAttribute("rowspan", 2);

        this.gender = false;
        this.age = false;

        this.bike = true;
        this.ped = true;

        this.assisted = false;
        this.helmet = false;

        this.timerCounter = 0;
        this.dataArray = [];
    },
    build: function(a, b) {
        var rows = this.$.tabula.children;
        for (var i in rows) {
            var cols = rows[i].children;
            for (var j in cols) {
                if(i == 0) {
                    if(!this.bike && this.ped && j == 1)
                        cols[j].addRemoveClass("tableHide", !this.bike);
                    if(this.bike && !this.ped && j == 2)
                        cols[j].addRemoveClass("tableHide", !this.ped) 
                } else if (this.gender && i == 1) {
                    if(this.age ? j > 0 : true) {
                        if(!this.bike && this.ped && j <= 2)
                            cols[j].addRemoveClass("tableHide", !this.bike);
                        if(this.bike && !this.ped && j >= 3)
                            cols[j].addRemoveClass("tableHide", !this.ped) 
                    }
                } else if ((i == 2 || i == 4) && this.age && j > 0) {
                    if(!this.bike && this.ped && j < 3 && !this.assisted)
                        cols[j].addRemoveClass("tableHide", !this.bike) 
                    if(this.bike && !this.ped && !this.helmet)
                        cols[j].addRemoveClass("tableHide", !this.ped) 
                } else if (i == 3 || i == 5) {
                    if(!this.bike && this.ped && j <= 1)
                        cols[j].addRemoveClass("tableHide", !this.bike) 
                    if(this.bike && !this.ped && j >= 2)
                        cols[j].addRemoveClass("tableHide", !this.ped) 
                }
                if(!this.gender) {
                    if(i == 1) {
                        cols[j].addRemoveClass("tableHide", !this.gender);
                    } else if (j == 1 || j == 3) {
                        if(i >=2)
                            cols[j].addRemoveClass("tableHide", !this.gender);
                    }
                }
                //SOME WEIRD CODE HERE, LOOK LATER
                if(!this.age) {
                    if(((i <= 2 || i == 4) && j == 0) || i >=4)
                        cols[j].addRemoveClass("tableHide", !this.age);
                }
                if((i == 2 || i == 4) && j > 0) {
                    if(!this.assisted) {
                        if(!this.helmet)
                            cols[j].addRemoveClass("tableHide", !this.helmet);
                        else if (j < 3)
                            cols[j].applyStyle("visibility", "hidden");
                    } else {
                        if(!this.helmet) {
                            if (j < 3)
                                cols[j].applyStyle("visibility", "hidden");
                        }
                        /*if (j > 2)
                            cols[j].addRemoveClass("tableHide", !this.assisted);*/
                    }
                }
            }
        }
        this.render();
        this.doDrawerOk()
        return true;
    },
    startTimer: function(a, b) {
        var c = false, 
        d;
        this.waterfall("onStartTimer"), enyo.job("sendTimerEvent", enyo.bind(this, "sendTimerEvent"), 9e5), c ? (clearInterval(d), c = false, this.$.button.setContent("Start Counting!")) : (d = setInterval(enyo.bind(this, "sendSeconds"), 1e3), c = true, this.$.button.setContent("Stop Counting!")), this.openDrawer(null, null);
    },
    openDrawer: function(a, b) {
        return this.$.columnsDrawer.setOpen(!this.$.columnsDrawer.open), true;
    },
    sendTimerEvent: function() {
        this.timerCounter < 8 ? this.timerCounter++ : enyo.job.stop("sendTimerEvent"), this.waterfall("onFifteenMinutes");
    },
    sendSeconds: function() {
        this.log();
        var a = this.$.counter.getContent(), 
        b = a.split(":");
        if (Number(b[2]) === 59) {
            b[2] = "00";
            if (Number(b[1]) === 59) {
                b[1] = "00";
                var c = (Number(b[0]) + 1).toString();
                c.length < 2 && (c = "0" + c), b[0] = c;
            } else {
                var c = (Number(b[1]) + 1).toString();
                c.length < 2 && (c = "0" + c), b[1] = c;
            }
        } else {
            var c = (Number(b[2]) + 1).toString();
            c.length < 2 && (c = "0" + c), b[2] = c;
        }
        this.$.counter.setContent(b.join(":"));
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
                this.bike = e;
            this.ped = e;
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
       return this.dataArray;
    },
    storeCountData: function(inSender, inEvent) {
        //this.log(inEvent.originator.name);
        var inName = inEvent.originator.parent.name;
        var rows = this.$.tabula.children;
        for (var i in rows) {
            var columns = rows[i].children;
            for (var j in columns) {
                if (columns[j].name === inName) {
                    tmp = Data.getBikeData(i, j, this.age, this.gender, this.helmet, this.assisted, this.bike, this.ped);
                    this.$.ticker.addToArray(1 + " " +  tmp.join(", "));;
                    tmp.unshift((new Date()).getTime());
                    this.dataArray.push(tmp);
                    this.render();
                } else
                    continue;
            }
        }
    }
});


