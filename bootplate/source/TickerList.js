enyo.kind({
    name: "TickerList",
    kind: "enyo.FittableRows",
    components: [
        //{kind: "onyx.Button", content: "test", ontap: "buttonClick"},
            {name: "enyo.FittableColumns", components: [
                {name: "ticker", kind: "enyo.Repeater",count: 2, onSetupItem: "setupItem", style: "width: 100%;", components: [
                    {name: "entry", style: "float: left; height: 32px; clear: left;"},
                    {fit: true},
                    {name: "xx", kind: "onyx.Icon", showing: false, src: "assets/not_small.png", ontap: "removeData", style: "float: right; clear: right; color: red;"}
                ]}
            ]}
    ],
    handlers: {
        onSetupItem: "setupItem"
    },
    events: {
        onRenderDrawer: ""
    },
    create: function (a) {
        this.array = [];
        this.inherited(arguments);
    },
    rendered: function () {
        this.inherited(arguments);
    },
    addToArray: function(string) {
        var tmp
        this.array.push(string);
        this.refreshList();
    },
    removeData: function(inSender, inEvent) {
        this.array.splice(this.getReversedIndex(inEvent.index), 1);
        this.refreshList();
    },
    getReversedIndex: function(inIndex) {
        if(this.array !== undefined) {
            //adjust for counting at 0, then start at end
            return (this.array.length - 1) - inIndex;

        } else 
            return -1;
    },
    setupItem: function (a, b) {
        b.item.$.entry.setContent(this.array[this.getReversedIndex(b.index)]);
        b.item.$.xx.show();
        //this.$.entry.setContent(this.array[this.getReversedIndex(b.index)]);
    },
    refreshList: function () {
        this.$.ticker.setCount(this.array.length);
        this.$.ticker.render();
        this.doRenderDrawer();
        //this.$.ticker.refresh();
    },
    getData: function() {
        return this.array.reverse();
    }
});
