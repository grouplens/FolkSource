enyo.kind({
    name: "BikeCounter",
    kind: "enyo.Control",
    published: {
        type: "bikes"
    },
    components: [{
        kind: "enyo.Signals",
        onButtonGroupChosen: "fixIt"
    }, {
        kind: "enyo.FittableRows",
        components: [{
            name: "timer",
            kind: "enyo.FittableColumns",
            components: [{
                kind: "onyx.Button",
                content: "Start Counting!",
                style: "width: 50%;",
                ontap: "startTimer"
            }, {
                name: "columnsDrawer",
                style: "white-space: nowrap; overflow: hidden;",
                orient: "h",
                kind: "onyx.Drawer",
                open: !1,
                components: [{
                    name: "counter",
                    content: "00:00:00"
                }]
            }]
        }, {
            name: "cont",
            kind: "enyo.FittableRows",
            classes: "bikeTable",
            components: [{
                name: "tabula",
                tag: "table",
                style: "width: 100%;, height: 100%; border-width: 0px;",
                components: [{
                    tag: "tr",
                    components: [{
                        tag: "td"
                    }, {
                        name: "bikeTitle",
                        tag: "td",
                        classes: "tableBike tableCell",
                        components: [{
                            kind: "enyo.Image",
                            src: "assets/bike_small.png"
                        }]
                    }, {
                        name: "pedTitle",
                        tag: "td",
                        classes: "tablePed tableCell",
                        components: [{
                            kind: "enyo.Image",
                            src: "assets/ped_small.png"
                        }]
                    }]
                }, {
                    tag: "tr",
                    components: [{
                        tag: "td"
                    }, {
                        tag: "td",
                        classes: "tableCell",
                        colspan: 1,
                        components: [{
                            kind: "enyo.Image",
                            classes: "tableBike",
                            src: "assets/male_small.png"
                        }]
                    }, {
                        tag: "td",
                        classes: "tableCell",
                        components: [{
                            kind: "enyo.Image",
                            classes: "tableBike",
                            src: "assets/female_small.png"
                        }]
                    }, {
                        tag: "td",
                        classes: "tableCell",
                        components: [{
                            kind: "enyo.Image",
                            classes: "tablePed",
                            src: "assets/male_small.png"
                        }]
                    }, {
                        tag: "td",
                        classes: "tableCell",
                        components: [{
                            kind: "enyo.Image",
                            classes: "tablePed",
                            src: "assets/female_small.png"
                        }]
                    }]
                }, {
                    tag: "tr",
                    components: [{
                        name: "adultTitle",
                        tag: "td",
                        components: [{
                            kind: "enyo.Image",
                            src: "assets/adult_small.png"
                        }]
                    }, {
                        tag: "td",
                        classes: "tableBike tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/helmet_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tableBike tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/helmet_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tablePed tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/assistive_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tablePed tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/assistive_small.png"
                            }]
                        }]
                    }]
                }, {
                    tag: "tr",
                    components: [{
                        tag: "td",
                        classes: "tableBike tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/plus_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tableBike tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/plus_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tablePed tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/plus_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tablePed tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/plus_small.png"
                            }]
                        }]
                    }]
                }, {
                    tag: "tr",
                    components: [{
                        name: "kidTitle",
                        tag: "td",
                        classes: "tableChild",
                        components: [{
                            kind: "enyo.Image",
                            src: "assets/child_small.png"
                        }]
                    }, {
                        tag: "td",
                        classes: "tableBike tableChild tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/helmet_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tableBike tableChild tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/helmet_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tablePed tableChild tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/assistive_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tablePed tableChild tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/assistive_small.png"
                            }]
                        }]
                    }]
                }, {
                    tag: "tr",
                    components: [{
                        tag: "td",
                        classes: "tableBike tableChild tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/plus_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tableBike tableChild tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/plus_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tablePed tableChild tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/plus_small.png"
                            }]
                        }]
                    }, {
                        tag: "td",
                        classes: "tablePed tableChild tableCell",
                        components: [{
                            kind: "CountButton",
                            components: [{
                                kind: "onyx.Icon",
                                src: "assets/plus_small.png"
                            }]
                        }]
                    }]
                }]
            }]
        }]
    }],
    events: {
        onTimer: "",
        onStartTimer: "",
        onDrawerOk: ""
    },
    handlers: {
        on2DrawerClick: "build"
    },
    create: function (a, b) {
        this.inherited(arguments), this.$.tabula.setAttribute("border-width", 0), this.$.bikeTitle.setAttribute("colspan", 2), this.$.pedTitle.setAttribute("colspan", 2), this.$.adultTitle.setAttribute("rowspan", 2), this.$.kidTitle.setAttribute("rowspan", 2), this.gender = !1, this.age = !1, this.bike = !0, this.ped = !0, this.assisted = !1, this.helmet = !1, this.timerCounter = 0;
    },
    build: function (a, b) {
        var c = this.$.tabula.children,
            d;
        for (var e in c) {
            var f = c[e].children;
            for (var g in f) {
                e == 0 && (!this.bike && g == 1 && f[g].addRemoveClass("tableHide", !this.bike), !this.ped && g == 2 && f[g].addRemoveClass("tableHide", !this.ped));
                if (e == 1 || e > 1 && (g == 1 || g == 3)) this.gender || (e == 1 && (this.$.bikeTitle.setAttribute("colspan", null), this.$.pedTitle.setAttribute("colspan", null)), f[g].addRemoveClass("tableHide", !this.gender));
                if (e == 2 || e == 4)!this.helmet && (g == 1 || g == 2) && (f[g].children.length != 0 && this.assisted ? f[g].applyStyle("visibility", "hidden") : f[g].addRemoveClass("tableHide", !this.helmet)), !this.assisted && (g == 3 || g == 4) && (f[g].children.length != 0 && this.helmet ? f[g].applyStyle("visibility", "hidden") : f[g].addRemoveClass("tableHide", !this.assisted));
                if (e >= 4 || (e == 0 || e == 1 || e == 2 || e == 4) && g == 0) this.age || f[g].addRemoveClass("tableHide", !this.age);
            }
        }
        return this.render(), this.doDrawerOk(), !0;
    },
    startTimer: function (a, b) {
        var c = !1,
            d;
        this.waterfall("onStartTimer"), enyo.job("sendTimerEvent", enyo.bind(this, "sendTimerEvent"), 9e5), c ? (clearInterval(d), c = !1, this.$.button.setContent("Start Counting!")) : (d = setInterval(enyo.bind(this, "sendSeconds"), 1e3), c = !0, this.$.button.setContent("Stop Counting!")), this.openDrawer(null, null);
    },
    openDrawer: function (a, b) {
        return this.$.columnsDrawer.setOpen(!this.$.columnsDrawer.open), !0;
    },
    sendTimerEvent: function () {
        this.timerCounter < 8 ? this.timerCounter++ : enyo.job.stop("sendTimerEvent"), this.waterfall("onFifteenMinutes");
    },
    sendSeconds: function () {
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
    fixIt: function (a, b) {
        var c, d, e;
        b.name.indexOf("checkbox") != -1 ? (c = b.name.split("_")[1], d = b.parent.$["content_" + c].getContent(), e = b.getValue()) : b.name.indexOf("radioButton") != -1 && (d = b.content);
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
            this.bikes = e, this.peds = e;
            break;
        case "Bicycles":
            this.bikes = e, this.peds = !e;
            break;
        case "Pedestrians":
            this.bikes = !e, this.peds = e;
        }
        this.render();
    },
    getData: function () {
        var a = this.$.tabula.children,
            b = [];
        for (var c = 2; c < a.length; c++) {
            b.push([]);
            var d = a[c].children;
            for (var e = 1; e < d.length; e++) b[c - 2].push(d[e].children[0].getCount());
        }
        this.log(b);
    }
});

