enyo.kind({
    name: "Sensr",
    kind: "enyo.Control",
    style: "min-height: 100%;",
    published: {},
    events: {
        onSubmisisonMade: ""
    },
    handlers: {
        onSenseOpened: "openNext",
        onPhotoOk: "photoOk"
    },
    components: [{
        kind: "Accordion",
        style: "min-height: 100%;",
        headerHeight: 40,
        onViewChange: "viewChanged",
        components: [{
            kind: "AccordionItem",
            headerTitle: "Senses",
            contentComponents: [{
                kind: "onyx.Button",
                content: "-",
                style: "float: left;",
                classes: "onyx-negative",
                ontap: "retakePhoto"
            }, {
                kind: "onyx.Button",
                content: "+",
                style: "float: right;",
                classes: "onyx-affirmative",
                ontap: "photoOk"
            }],
            photoOk: function (a, b) {
                this.bubble("onPhotoOk");
            },
            retakePhoto: function () {}
        }, {
            name: "qs",
            kind: "AccordionItem",
            headerTitle: "Questions",
            contentComponents: [{
                name: "qbody",
                components: []
            }]
        }]
    }, {
        kind: "onyx.Button",
        classes: "onyx-negative",
        content: "Cancel",
        ontap: "close",
        style: "width: 50%;"
    }, {
        name: "submit",
        kind: "onyx.Button",
        classes: "onyx-affirmative",
        content: "Submit",
        ontap: "buildAndSendSubmission",
        disabled: !0,
        style: "width: 50%;"
    }],
    create: function (a, b) {
        this.inherited(arguments);
    },
    viewChanged: function (a, b) {},
    openNext: function () {
        var a = this.$.accordion.getItems(),
            b = this.$.accordion.getActiveView();
        return this.log(this.$.accordion.getActiveView()), b === !1 && this.$.accordion.toggleItem(a[0]), !0;
    },
    photoOk: function () {
        var a = this.$.accordion.getActiveView(),
            b = this.$.accordion.getItems();
        for (x in b) if (b[x] === a) {
            var c = ++x;
            this.$.accordion.toggleItem(b[c]), a.$.accordionItemHeader.addStyles("background-color: green;"), this.camComplete = !0, this.$.submit.setDisabled(!1);
        }
        return !0;
    },
    setTaskData: function (a) {
        this.task = a, this.$.qs.$.qbody.getComponents().length > 0 && this.$.qs.$.qbody.destroyComponents();
        for (i in this.task.questions) {
            var b = this.task.questions[i],
                c = "name_" + b.id;
            this.$.qs.$.qbody.createComponent({
                name: c,
                content: b.question
            });
            switch (b.type) {
            case "text":
                this.newFormText(b);
                break;
            case "exclusive_multiple_choice":
                this.newFormExclusiveChoice(b);
                break;
            case "multiple_choice":
                this.newFormMultipleChoice(b);
                break;
            case "counter":
                this.newFormCounter(b);
                break;
            default:
            }
            this.$.qs.$.qbody.createComponent({
                tag: "hr"
            });
        }
        this.$.qs.render();
    },
    buildAndSendSubmission: function () {
        var a = {
            submission: {
                task_id: this.task.id,
                gps_location: "testy test",
                user_id: 5,
                img_path: "test",
                answers: []
            }
        };
        a.submission.user_id = LocalStorage.get("user");
        for (i in this.task.questions) {
            var b = this.task.questions[i],
                c = {
                    answer: "BOOM",
                    type: b.type,
                    q_id: b.id,
                    sub_id: 0
                };
            switch (b.type) {
            case "text":
                c.answer = this.readFormText(b);
                break;
            case "exclusive_multiple_choice":
                c.answer = this.readFormExclusiveChoice(b);
                break;
            case "multiple_choice":
                c.answer = this.readFormMultipleChoice(b);
                break;
            case "counter":
                c.answer = this.readFormCounter(b);
                break;
            default:
            }
            a.submission.answers.push(c);
        }
        this.log("SENDING TO SERVER: " + JSON.stringify(a));
        var d = Data.getURL() + "submission.json",
            e = new enyo.Ajax({
                contentType: "application/json",
                method: "POST",
                url: d,
                postBody: JSON.stringify(a)
            });
        e.response(this, "handlePostResponse"), e.go();
    },
    handlePostResponse: function (a, b) {
        this.log("SERVER RESPONSE CAME BACK"), this.bubble("onSubmissionMade");
    },
    close: function () {
        this.bubble("onSubmissionMade");
    },
    newFormText: function (a) {
        var b = "inputDec_" + a.id,
            c = "input_" + a.id;
        this.$.qs.$.qbody.createComponent({
            name: b,
            kind: "onyx.InputDecorator",
            classes: "onyx-input-decorator",
            components: [{
                name: c,
                kind: "onyx.Input",
                classes: "onyx-input",
                defaultFocus: !0
            }]
        });
    },
    newFormExclusiveChoice: function (a) {
        var b = "input_" + a.id,
            c = a.options.split("|"),
            d = [];
        for (i in c) d.push({
            content: c[i]
        });
        this.$.qs.$.qbody.createComponent({
            name: b,
            kind: "onyx.RadioGroup",
            components: d
        });
    },
    newFormMultipleChoice: function (a) {
        var b = a.options.split("|");
        this.$.qs.$.qbody.createComponent({
            name: "groupbox",
            kind: "onyx.Groupbox",
            components: []
        });
        for (i in b) {
            var c = "checkbox_" + i,
                d = "content_" + i,
                e = [];
            this.$.qs.$.qbody.$.groupbox.createComponent({
                name: c,
                kind: "onyx.Checkbox",
                style: "float: left; clear: left;"
            }), this.$.qs.$.qbody.$.groupbox.createComponent({
                name: d,
                content: b[i],
                style: "float: left; clear: right;"
            }), this.$.qs.$.qbody.$.groupbox.createComponent({
                tag: "br"
            });
        }
    },
    newFormCounter: function (a) {
        var b = "counter_" + a.id;
        this.$.qs.$.qbody.createComponent({
            name: b,
            kind: "Counter",
            title: a.question
        });
    },
    readFormText: function (a) {
        var b = "input_" + a.id;
        return this.$.qs.$.qbody.$[b].getValue();
    },
    readFormExclusiveChoice: function (a) {
        var b = a.options.split("|"),
            c = "input_" + a.id,
            d = this.$.qs.$.qbody.$[c].children;
        for (x in d) if (d[x].hasClass("active")) return d[x].getContent();
    },
    readFormMultipleChoice: function (a) {
        var b = [];
        this.log(this.$.qs.$.qbody.$.groupbox.$);
        for (i in a.options.split("|")) {
            var c = "checkbox_" + i,
                d = "content_" + i;
            this.$.qs.$.qbody.$.groupbox.$[c].getValue() && b.push(this.$.qs.$.qbody.$.groupbox.$[d].getContent());
        }
        return b.join("|");
    },
    readFormCounter: function (a) {
        var b = "counter_" + a.id;
        return this.$.qs.$.qbody.$[b].getCount();
    }
});
