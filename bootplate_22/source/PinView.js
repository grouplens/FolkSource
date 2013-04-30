enyo.kind({
    name: "PinView",
    kind: "enyo.Control",
    published: {
        value: "1",
        description: "temp description"
    },
    components: [
        {name: "taskDesc", tag: "div", content: "test"},
        {name: "taskValue", /*style: "color: #FF0000;", */content: "testval"}, 
        {name: "button", kind: "onyx.Button", content: "Do It!", ontap: "buttonHit"}],
    events: {
        onDoObservation: ""
    },
    create: function (a, b) {
        this.inherited(arguments), this.$.taskDesc.content = this.description, this.$.taskValue.content = this.value;
    },
    setContent: function (a, b) {
        this.$.taskDesc.setContent(a), this.$.taskValue.setContent("You earn: " + b + " points"), this.$.taskDesc.resized(), this.$.taskValue.resized(), this.resized();
    },
    buttonHit: function (a, b) {
        return this.doDoObservation(), !0;
    },
    setIndex: function (a) {
        this.index = a;
    }
});
