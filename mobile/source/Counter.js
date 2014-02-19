enyo.kind({
    name: "Counter",
    kind: "enyo.Control",
    published: {
        title: "Counter"
    },
    handlers: {
        onFifteenMinutes: "timerChanged",
        onStartTimer: "timerStarted"
    },
    components: [{
        name: "titl",
        content: this.title,
        style: "clear: both;"
    }, {
        name: "cols",
        kind: "enyo.FittableColumns",
        components: [{
            name: "num",
            fit: !0,
            content: 0,
            style: "float: left;"
        }, {
            name: "pos",
            kind: "onyx.Button",
            content: "+",
            classes: "onyx-affirmative",
            ontap: "up",
            disabled: !0,
            style: "float: left;"
        }]
    }],
    create: function (a, b) {
        this.inherited(arguments), this.$.titl.setContent(this.title);
    },
    timerStarted: function (a, b) {
        return this.storage = [], this.$.pos.setDisabled(!1), !0;
    },
    timerChanged: function (a, b) {
        return this.storage.push(this.getCount), this.$.num.setContent(0), this.$.neg.setDisabled(!0), !0;
    },
    up: function () {
        this.$.pos.getDisabled() || (this.$.num.setContent(this.$.num.getContent() + 1), this.$.num.getContent != 0 && this.$.neg.setDisabled(!1));
    },
    down: function () {
        this.$.num.getContent() > 0 ? (this.$.num.setContent(this.$.num.getContent() - 1), this.$.num.getContent() === 0 && this.$.neg.setDisabled(!0)) : this.$.neg.setDisabled(!0);
    },
    getCount: function () {
        return this.storage != undefined ? this.storage.join() : 0;
    }
});
