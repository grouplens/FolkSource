enyo.kind({
    name: "CountButton",
    kind: "onyx.Button",
    classes: "tableButton",
    handlers: {
        ontap: "increment"
    },
    components: [{
        name: "num",
        content: 0,
        style: "height: 100%; float: right; clear: right;"
    }],
    create: function (a, b) {
        this.inherited(arguments);
    },
    rendered: function (inSender, inEvent) {
    },
    increment: function () {
        //this.log(this);
        this.$.num.setContent(this.$.num.getContent() + 1);
        //this.render();
    },
    decrement: function() {
        if(Number(this.$.num.getContent()) > 0) 
            this.$.num.setContent(this.$.num.getContent() - 1);
    },

    getCount: function () {
        return this.storage != undefined ? this.storage.join() : 0;
    }
});
