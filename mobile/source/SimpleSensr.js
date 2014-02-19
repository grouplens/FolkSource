enyo.kind({
    name: "SimpleSensr",
    kind: "enyo.Control",
    style: "min-height: 100%;",
    published: {
        complex: !1
    },
    events: {
        onSubmisisonMade: ""
    },
    handlers: {
        onSenseOpened: "openNext",
        onPhotoOk: "photoOk",
        onDeviceReady: "setReady",
        onGPSSet: "currentLocation"
    },
    components: [{
        kind: "enyo.Signals",
        onGPSSet: "currentLocation",
        onPinClicked: "chosenLocation",
        onPhotoData: "photoData"
    }, {
        name: "senses",
        components: [{
            name: "imgDiv",
            classes: "imgDiv",
            components: []
        }, {
            name: "photoButton",
            kind: "onyx.Button",
            content: "Take Photo",
            style: "width: 100%;",
            ontap: "retakePhoto",
            classes: "onyx-affirmative"
        }]
    }, {
        tag: "hr",
        style: "clear: both;"
    }, {
        name: "qs",
        style: "clear: both;",
        components: [{
            name: "qbody",
            components: []
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
        this.devReady = !1, this.inherited(arguments), !this.complex;
    },
    currentLocation: function (a, b) {
        this.gps_location = b.prop;
    },
    chosenLocation: function (a, b) {
        this.chosen_location = b;
    },
    photoData: function (a, b) {
        LocalStorage.set("image", JSON.stringify(b));
    },
    takePhoto: function () {
        this.log();
        var a = this.$,
            b = {
                quality: 25,
                destinationType: Camera.DestinationType.FILE_URI,
                EncodingType: Camera.EncodingType.JPEG
            };
        navigator.camera.getPicture(enyo.bind(a, this.onPhotoSuccess), enyo.bind(a, this.onPhotoFail), b);
    },
    onPhotoSuccess: function (a) {
        var b = a;
        this.$.imgDiv.createComponent({
            name: "myImage",
            kind: "enyo.Image",
            src: "./assets/leaf-2.jpg"
        }), this.$.imgDiv.render(), this.$.submit.setDisabled(!1), this.camComplete = !0, enyo.Signals.send("onPhotoData", a);
    },
    onPhotoFail: function (a) {
        console.log(a);
    },
    retakePhoto: function () {
        this.$.imgDiv.getComponents().length > 0 && this.$.imgDiv.destroyComponents(), this.onPhotoSuccess();
    },
    viewChanged: function (a, b) {},
    openNext: function () {
        return !0;
    },
    photoOk: function () {
        return this.log(), !0;
    },
    utf8_encode: function (a) {
        if (a === null || typeof a == "undefined") return "";
        var b = a + "",
            c = "",
            d, e, f = 0;
        d = e = 0, f = b.length;
        for (var g = 0; g < f; g++) {
            var h = b.charCodeAt(g),
                i = null;
            h < 128 ? e++ : h > 127 && h < 2048 ? i = String.fromCharCode(h >> 6 | 192) + String.fromCharCode(h & 63 | 128) : i = String.fromCharCode(h >> 12 | 224) + String.fromCharCode(h >> 6 & 63 | 128) + String.fromCharCode(h & 63 | 128), i !== null && (e > d && (c += b.slice(d, e)), c += i, d = e = g + 1);
        }
        return e > d && (c += b.slice(d, f)), c;
    },
    encodeAsBase64: function (a) {
        var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            c, d, e, f, g, h, i, j, k = 0,
            l = 0,
            m = "",
            n = [];
        if (!a) return a;
        a = this.utf8_encode(a + "");
        do c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e, f = j >> 18 & 63, g = j >> 12 & 63, h = j >> 6 & 63, i = j & 63, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i);
        while (k < a.length);
        m = n.join("");
        var o = a.length % 3;
        return (o ? m.slice(0, o - 3) : m) + "===".slice(o || 3);
    },
    setTaskData: function (a) {
        this.task = a.tasks[0], this.campTitle = a.title, this.$.qbody.getComponents().length > 0 && this.$.qbody.destroyComponents();
        for (i in this.task.questions) {
            var b = this.task.questions[i],
                c = "name_" + b.id;
            this.$.qbody.createComponent({
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
            this.$.qbody.createComponent({
                tag: "hr"
            });
        }
        this.$.qs.render();
    },
    fileEntry: function (a) {
        window.resolveLocalFileSystemURI(a, this.getImageData, null);
    },
    getImageData: function (a) {
        read = new FileReader, console.log(a), read.onloadend = function (a) {
            console.log(a.target.result);
        };
        var b = read.readAsDataURL(a);
        console.log(b);
    },
    makeImageSend: function (a, b) {
        var c = btoa(this.utf8_encode(b));
        this.$.senses.createComponent({
            kind: "enyo.Image",
            src: "data:image/jpeg;base64," + c
        }), this.render();
        var d = "image?",
            e = new Date,
            f = (e.getMonth() + 1).toString();
        while (f.length < 2) f = "0" + f;
        var g = e.getDate().toString();
        while (g.length < 2) g = "0" + g;
        var h = e.getFullYear().toString() + f.toString() + g.toString() + "_" + e.getHours().toString() + e.getMinutes().toString() + e.getSeconds().toString();
        d += "userName=" + Data.getUserName(LocalStorage.get("user")) + "&", d += "imageFileName=" + this.campTitle.replace(/ /g, "%20") + "_" + h + ".jpg&";
        var i = Data.getURL() + d,
            j = new enyo.Ajax({
                method: "POST",
                url: i,
                contentType: "image/jpeg"
            });
        j.response(this, "imageSubmission");
    },
    buildAndSendSubmission: function () {
        if (!this.$.submit.disabled) {
            this.fileEntry(this.$.imgDiv.$.myImage.src);
            if (this.imageOK) {
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
                    var c = this.task.questions[i],
                        d = {
                            answer: "BOOM",
                            type: c.type,
                            q_id: c.id,
                            sub_id: 0
                        };
                    switch (c.type) {
                    case "text":
                        d.answer = this.readFormText(c);
                        break;
                    case "exclusive_multiple_choice":
                        d.answer = this.readFormExclusiveChoice(c);
                        break;
                    case "multiple_choice":
                        d.answer = this.readFormMultipleChoice(c);
                        break;
                    case "counter":
                        d.answer = this.readFormCounter(c);
                        break;
                    default:
                    }
                    a.submission.answers.push(d);
                }
                this.log("SENDING TO SERVER: " + JSON.stringify(a));
                var e = Data.getURL() + "submission.json",
                    f = new enyo.Ajax({
                        contentType: "application/json",
                        method: "POST",
                        url: e,
                        postBody: JSON.stringify(a),
                        handleAs: "json"
                    });
                f.response(this, "handlePostResponse"), f.go();
            }
        }
    },
    handlePostResponse: function (a, b) {
        this.log("SERVER RESPONSE CAME BACK"), this.bubble("onSubmissionMade"), this.camComplete = !1, this.$.submit.setDisabled(!0), this.chosen_location = undefined, LocalStorage.remove("image"), this.imageOK = !1, this.$.imgDiv.getComponents().length > 0 && this.$.imgDiv.destroyComponents();
    },
    imageSubmission: function (a, b) {
        this.log(JSON.stringify(a)), this.log(JSON.stringify(b));
    },
    close: function () {
        this.bubble("onSubmissionMade");
    },
    setReady: function () {
        this.devReady = !0;
    },
    newFormText: function (a) {
        var b = "inputDec_" + a.id,
            c = "input_" + a.id;
        this.$.qbody.createComponent({
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
        this.$.qbody.createComponent({
            name: b,
            kind: "onyx.RadioGroup",
            components: d
        });
    },
    newFormMultipleChoice: function (a) {
        var b = a.options.split("|");
        this.$.qbody.createComponent({
            name: "groupbox",
            kind: "onyx.Groupbox",
            components: []
        });
        for (i in b) {
            var c = "checkbox_" + i,
                d = "content_" + i,
                e = [];
            this.$.qbody.$.groupbox.createComponent({
                name: c,
                kind: "onyx.Checkbox",
                style: "float: left; clear: left;"
            }), this.$.qbody.$.groupbox.createComponent({
                name: d,
                content: b[i],
                style: "float: left; clear: right;"
            }), this.$.qbody.$.groupbox.createComponent({
                tag: "br"
            });
        }
    },
    newFormCounter: function (a) {
        var b = "counter_" + a.id;
        this.$.qbody.createComponent({
            name: b,
            kind: "Counter",
            title: a.question
        });
    },
    readFormText: function (a) {
        var b = "input_" + a.id;
        return this.$.qbody.$[b].getValue();
    },
    readFormExclusiveChoice: function (a) {
        var b = a.options.split("|"),
            c = "input_" + a.id,
            d = this.$.qbody.$[c].children;
        for (x in d) if (d[x].hasClass("active")) return d[x].getContent();
    },
    readFormMultipleChoice: function (a) {
        var b = [];
        this.log(this.$.qbody.$.groupbox.$);
        for (i in a.options.split("|")) {
            var c = "checkbox_" + i,
                d = "content_" + i;
            this.$.qbody.$.groupbox.$[c].getValue() && b.push(this.$.qbody.$.groupbox.$[d].getContent());
        }
        return b.join("|");
    },
    readFormCounter: function (a) {
        var b = "counter_" + a.id;
        return this.$.qbody.$[b].getCount();
    }
});
