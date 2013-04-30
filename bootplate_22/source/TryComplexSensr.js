enyo.kind({
    name: "TryComplexSensr",
    style: "background-color: #254048;",
    published: {
        complex: !1
    },
    events: {
        onSubmisisonMade: "",
        on2DrawerClick: "",
        onRenderScroller: "",
    },
    handlers: {
        onSenseOpened: "openNext",
        onPhotoOk: "photoOk",
        onDeviceReady: "setReady",
        onGPSSet: "currentLocation",
        onDrawerOk: "openDrawer2",
        onRenderDrawer: "renderDrawer2"
    },
    components: [
        {kind: "enyo.Signals", onGPSSet: "currentLocation", onPinClicked: "chosenLocation", onPhotoData: "photoData", onButtonGroupChosen: "renderSubmitButton"},
    ],
    create: function(a, b) {
        this.inherited(arguments);
        /*this.recreate();
        this.doRenderScroller();*/
    },
    rendered: function(inSender, inEvent) {
        this.inherited(arguments);
        this.log();
        this.resized();
        this.reflow();
    },
    recreate: function() {
        this.log();
        this.createComponent({name: "formDiv", /*classes: "enyo-fit",*/ components: []});
        if(this.complex) {
            this.$.formDiv.createComponent({/*kind: "enyo.FittableRows", fit: true, */name: "acc", components: []});
            this.$.formDiv.$.acc.createComponent({content: "Questions about you",ontap: "activateFormDrawer",classes: "accordionHeader"}, {owner: this});
            this.$.formDiv.$.acc.createComponent({name: "qs",kind: "onyx.Drawer",open: false, /*layoutKind: "enyo.FittableRowsLayout",*/ components: [],style: "white-space: nowrap; overflow: scroll;"});
            this.$.formDiv.$.acc.$.qs.createComponent({kind: "enyo.Scroller",/* fit: true, layoutKind: "enyo.FittableRowsLayout", */vertical: "scroll", strategyKind: "TranslateScrollStrategy", name: "accordionItemContent", components: []}) 
        } else {
            this.$.formDiv.createComponent({name: "qbody", fit: true, components: []});
            this.$.formDiv.$.qbody.createComponent({name: "imgDiv",classes: "imgDiv",components: []});
            this.$.formDiv.$.qbody.$.imgDiv.createComponent({name: "photoButton",kind: "onyx.Button",content: "Take Photo",style: "width: 100%;",ontap: "retakePhoto",classes: "onyx-affirmative"}, {owner: this});
        }
        this.$.formDiv.createComponents([{fit: true},{kind: "onyx.Button", classes: "onyx-negative", content: "Cancel", ontap: "close", style: "width: 50%; bottom: 0px; clear: left;"},{name: "submit", kind: "onyx.Button", classes: "onyx-affirmative", content: "Submit", ontap: "buildAndSendSubmission", style: "width: 50%; bottom: 0px; clear: right;"}], {owner: this});
    },
    activateFormDrawer: function(a, b) {
        a.addRemoveClass("accordionHeaderHighlight", !this.$.formDiv.$.acc.$.qs.open), this.$.formDiv.$.acc.$.qs.setOpen(!this.$.formDiv.$.acc.$.qs.open);
    },
    activateFormDrawer2: function(a, b) {
        this.waterfall("on2DrawerClick");
    },
    openDrawer2: function(a, b) {
        return this.$.draw2.addRemoveClass("accordionHeaderHighlight", !this.$.formDiv.$.acc.$.qs1.open), this.$.formDiv.$.acc.$.qs1.setOpen(!this.$.formDiv.$.acc.$.qs1.open), !0;
    },
    currentLocation: function(a, b) {
        this.gps_location = b.prop;
    },
    chosenLocation: function(a, b) {
        this.chosen_location = b;
    },
    photoData: function(a, b) {
        LocalStorage.set("image", JSON.stringify(b));
    },
    takePhoto: function() {
        this.log();
        var a = this.$, b = {
            quality: 25,
            destinationType: Camera.DestinationType.FILE_URI,
            EncodingType: Camera.EncodingType.JPEG
        };
        navigator.camera.getPicture(enyo.bind(a, this.onPhotoSuccess), enyo.bind(a, this.onPhotoFail), b);
    },
    onPhotoSuccess: function(a) {
        var b = a;
        this.$.formDiv.$.qbody.$.imgDiv.createComponent({
            name: "myImage",
            kind: "enyo.Image",
            src: "./assets/leaf-2.jpg"
        }), this.$.formDiv.$.qbody.$.imgDiv.render(), this.$.submit.setDisabled(!1), this.camComplete = !0, enyo.Signals.send("onPhotoData", a);
    },
    renderSubmitButton: function(a, b) {
        this.$.submit.setDisabled(!1);
    },
    renderDrawer2: function(inSender, inEvent) {
        this.$.draw2.render();
    },
    onPhotoFail: function(a) {
        console.log(a);
    },
    retakePhoto: function() {
        !this.complex && this.$.formDiv.$.qbody.$.imgDiv.getComponents().length > 0 && this.$.formDiv.$.qbody.$.imgDiv.destroyComponents(), this.onPhotoSuccess();
    },
    viewChanged: function(a, b) {},
    openNext: function() {
        return !this.complex, !0;
    },
    photoOk: function() {
        return this.log(), !0;
    },
    setTaskData: function(a) {
        this.task = a.tasks[0];
        this.campTitle = a.title;
        questionBody = [];
        if(this.$.formDiv != undefined && this.$.formDiv.getComponents().length > 0 ) {
            this.$.formDiv.destroyClientControls();
            this.$.formDiv.destroy()
        }
        this.recreate();
        if(this.complex)
            questionBody.push(this.$.formDiv.$.acc.$.qs.$.accordionItemContent);
        else
            questionBody.push(this.$.formDiv.$.qbody);

        for (i in this.task.questions) {
            var b = this.task.questions[i], c = "name_" + b.id;
            type = b.type;
            if (type.indexOf("complex") != -1) {
                type = "counter";
                var d = type.search(/\d/), e = 0;
                if (d != -1) var e = type.charAt(d);
                if (e != questionBody.length && this.complex) {
                    var f = "qs" + (e + 1);
                    this.$.formDiv.$.acc.createComponent({
                        name: "draw2",
                        content: "Count Bicycles and/or Pedestrians",
                        ontap: "activateFormDrawer2",
                        classes: "accordionHeader"
                    }, {
                        owner: this
                    });
                    this.$.formDiv.$.acc.createComponent({
                        name: f,
                        kind: "onyx.Drawer",
                        open: !1,
                        components: [],
                        style: "white-space: nowrap; overflow: hidden;"
                    });
                    this.$.formDiv.$.acc.$[f].createComponent({
                        name: "accordionItemContent",
                        components: []
                    });
                    /*this.$.formDiv.resized();
                    this.$.formDiv.reflow();
                    this.render();*/
                    questionBody.push(this.$.formDiv.$.acc.$[f].$.accordionItemContent);
                }
            }
            switch (type) {
                case "text":
                    questionBody[0].createComponent({
                    name: c,
                    style: "clear: both;",
                    content: b.question
                }), this.newFormText(b);
                break;
                case "exclusive_multiple_choice":
                    questionBody[0].createComponent({
                    name: c,
                    style: "clear: both;",
                    content: b.question
                }), this.newFormExclusiveChoice(b);
                break;
                case "multiple_choice":
                    questionBody[0].createComponent({
                    name: c,
                    style: "clear: both;",
                    content: b.question
                }), this.newFormMultipleChoice(b);
                break;
                case "counter":
                    this.newFormCounter(b);
                break;
                case "cur_time":
                    this.newTime(b);
                break;
                default:
            }
        }
        this.render();
        /*this.$.formDiv.resized();
        this.$.formDiv.reflow();*/
    },
    fileEntry: function(a) {
        window.resolveLocalFileSystemURI(a, this.getImageData, null);
    },
    getImageData: function(a) {
        read = new FileReader, console.log(a), read.onloadend = function(a) {
            console.log(a.target.result);
        };
        var b = read.readAsDataURL(a);
        console.log(b);
    },
    makeImageSend: function(a, b) {
        var c = btoa(this.utf8_encode(b));
        this.$.senses.createComponent({
            kind: "enyo.Image",
            src: "data:image/jpeg;base64," + c
        });
        //this.render();
        var d = "image?", e = new Date, f = (e.getMonth() + 1).toString();
        while (f.length < 2) f = "0" + f;
        var g = e.getDate().toString();
        while (g.length < 2) g = "0" + g;
        var h = e.getFullYear().toString() + f.toString() + g.toString() + "_" + e.getHours().toString() + e.getMinutes().toString() + e.getSeconds().toString();
        d += "userName=" + Data.getUserName(LocalStorage.get("user")) + "&", d += "imageFileName=" + this.campTitle.replace(/ /g, "%20") + "_" + h + ".jpg&";
        var i = Data.getURL() + d, j = new enyo.Ajax({
            method: "POST",
            url: i,
            contentType: "image/jpeg"
        });
        j.response(this, "imageSubmission");
    },
    buildAndSendSubmission: function() {
        if (!this.$.submit.disabled) {
            this.complex || this.fileEntry(this.$.imgDiv.$.myImage.src);
            if (this.imageOK ? !this.complex : this.complex) {
                var a = {
                    submission: {
                        task_id: this.task.id,
                        gps_location: "testy test",
                        user_id: 5,
                        img_path: "test",
                        answers: []
                    }
                }, b = this.gps_location.latitude + "|" + this.gps_location.longitude;
                a.submission.gps_location = b, a.submission.user_id = LocalStorage.get("user");
                for (i in this.task.questions) {
                    var c = this.task.questions[i];
                    type = c.type;
                    if (type.indexOf("complex") != -1) {
                        type = "counter";
                        var d = type.search(/\d/), e = 0;
                        if (d != -1) var e = type.charAt(d);
                        if (e != questionBody.length && this.complex) var f = "qs" + (e + 1);
                    }
                    var g = {
                        answer: "BOOM",
                        type: c.type,
                        q_id: c.id,
                        sub_id: 0
                    };
                    switch (type) {
                        case "text":
                            g.answer = this.readFormText(c);
                        break;
                        case "exclusive_multiple_choice":
                            g.answer = this.readFormExclusiveChoice(c);
                        break;
                        case "multiple_choice":
                            g.answer = this.readFormMultipleChoice(c);
                        break;
                        case "counter":
                            g.answer = this.readFormCounter(c);
                        break;
                        case "cur_time":
                            g.answer = this.readTime(c);
                        break;
                        default:
                            continue;
                    }
                    a.submission.answers.push(g);
                }
                this.log("SENDING TO SERVER: " + JSON.stringify(a));
                var h = Data.getURL() + "submission.json", j = new enyo.Ajax({
                    contentType: "application/json",
                    method: "POST",
                    url: h,
                    postBody: JSON.stringify(a),
                    cacheBust: !1,
                    handleAs: "json"
                });
                j.response(this, "handlePostResponse"), j.go();
            }
        }
    },
    handlePostResponse: function(a, b) {
        this.log("SERVER RESPONSE CAME BACK"), this.bubble("onSubmissionMade"), this.camComplete = !1, this.$.submit.setDisabled(!0), this.chosen_location = undefined, LocalStorage.remove("image"), this.imageOK = !1, !this.complex && this.$.imgDiv.getComponents().length > 0 && this.$.imgDiv.destroyComponents();
    },
    imageSubmission: function(a, b) {
        this.log(JSON.stringify(a)), this.log(JSON.stringify(b));
    },
    close: function() {
        this.bubble("onSubmissionMade");
    },
    testButtons: function(a, b) {
        enyo.Signals.send("onButtonGroupChosen", a);
    },
    newFormText: function(a) {
        var b = "inputDec_" + a.id, c = "input_" + a.id;
        questionBody[0].createComponent({
            name: b,
            style: "clear: both;",
            kind: "onyx.InputDecorator",
            classes: "onyx-input-decorator",
            components: [ {
                name: c,
                kind: "onyx.Input",
                classes: "onyx-input"
            } ]
        }, {
            owner: questionBody[0]
        });
        /*this.$.formDiv.resized();
        this.$.formDiv.reflow();*/
        /*questionBody[0].resized();
        questionBody[0].reflow();
        questionBody[0].render();*/
    },
    newFormExclusiveChoice: function(a) {
        var b = "input_" + a.id, c = a.options.split("|"), d = [];
        for (i in c) i == 0 ? d.push({
            content: c[i],
            active: !0,
            ontap: "testButton"
        }) : d.push({
            content: c[i],
            ontap: "testButtons"
        });
        questionBody[0].createComponent({
            name: b,
            kind: "onyx.RadioGroup",
            components: d
        }, {
            owner: this
        });
        /*this.$.formDiv.resized();
        this.$.formDiv.reflow();*/
        /*questionBody[0].resized();
        questionBody[0].reflow();
        questionBody[0].render();*/
    },
    newTime: function(a) {
        var b = new Date, c = b.toTimeString().split(" ")[0], d = "time_" + a.id;
        questionBody[0].createComponent({
            content: a.question
        }), questionBody[0].createComponent({
            name: d,
            content: c,
            time: b.toTimeString()
        });
        /*this.$.formDiv.resized();
        this.$.formDiv.reflow();*/
        /*questionBody[0].resized();
        questionBody[0].reflow();
        questionBody[0].render();*/
    },
    newFormMultipleChoice: function(a) {
        var b = a.options.split("|");
        questionBody[0].createComponent({
            name: "groupbox",
            kind: "onyx.Groupbox",
            components: []
        }, {
            owner: questionBody[0]
        });
        for (i in b) {
            var c = "checkbox_" + i, d = "content_" + i, e = [];
            questionBody[0].$.groupbox.createComponent({
                name: c,
                kind: "onyx.Checkbox",
                onchange: "testButtons",
                style: "float: left; clear: left;"
            }, {
                owner: this
            }), questionBody[0].$.groupbox.createComponent({
                name: d,
                content: b[i],
                style: "float: left; clear: right;"
            }), questionBody[0].$.groupbox.createComponent({
                tag: "br"
            });
        }
        /*this.$.formDiv.resized();
        this.$.formDiv.reflow();*/
        /*questionBody[0].resized();
        questionBody[0].reflow();
        questionBody[0].render();*/
    },
    newFormCounter: function(a) {
        var b = "name_" + a.id, c = "counter_" + a.id, d;
        for (x in this.task.questions) if (this.task.questions[x].type === "exclusive_multiple_choice") {
            d = this.task.questions[x].id.toString();
            break;
        }
        var e = "input_" + d;
        if (a.type.split("_")[1].indexOf("2") === -1) {
            questionBody[1].createComponent({
            name: c,
            kind: "BikeCounter",
            title: a.question,
            style: "clear: both;"
        }); 
        /*questionBody[1].resized();
        questionBody[1].reflow();
        questionBody[1].render();*/
        } else {
            questionBody[2].createComponent({
            name: c,
            kind: "BikeCounter",
            title: a.question,
            style: "clear: both;"
        });
        /*questionBody[2].resized();
        questionBody[2].reflow();
        questionBody[2].render();*/
        }
    },
    readFormText: function(a) {
        var b = "input_" + a.id;
        return questionBody[0].$[b].getValue();
    },
    readFormExclusiveChoice: function(a) {
        var b = "input_" + a.id, c = this.$[b].children;
        for (x in c) if (c[x].hasClass("active")) return c[x].getContent();
    },
    readFormMultipleChoice: function(a) {
        var b = [];
        for (i in a.options.split("|")) {
            var c = "checkbox_" + i, d = "content_" + i;
            this.$[c].getValue() && b.push(questionBody[0].$.groupbox.$[d].getContent());
        }
        return b.join("|");
    },
    readFormCounter: function(a) {
        var out;
        c = "counter_" + a.id;
        for (var d in questionBody) {
            var e = questionBody[d].$[c];
            if (e === undefined) continue;
            out = e.getData();
            //this.log(f);
        }

        return out.join("|");
    },
    readTime: function(a) {
        var b = "time_" + a.id;
        return questionBody[0].$[b].time;
    }
});
