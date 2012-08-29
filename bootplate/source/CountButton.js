enyo.kind({
    name: "CountButton",
    kind: "onyx.Button",
    classes: "tableButton",
    events: {
        onCountButtonTapped: ""
    },
    handlers: {
        ontap: "up"
    },
    components: [{
        name: "num",
        content: 0,
        style: "height: 100%; float: right; clear: right;"
    }],
    create: function (a, b) {
        this.inherited(arguments);
    },
    up: function () {
        this.$.num.setContent(this.$.num.getContent() + 1);
        this.doCountButtonTapped();
    },
    getCount: function () {
        return this.storage != undefined ? this.storage.join() : 0;
    }
});
