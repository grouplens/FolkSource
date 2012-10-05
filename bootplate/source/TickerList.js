enyo.kind({
    name: "TickerList",
    kind: "enyo.FittableRows",
    fit: true,
    components: [
        //{kind: "onyx.Button", content: "test", ontap: "buttonClick"},
            //{kind: "enyo.FittableColumns", /*fit: true,*/ components: [
                {name: "ticker", kind: "enyo.List", /*fit: true,*/ count: 1, onSetupItem: "setupItem", style: "width: 100%; overflow: hidden;", components: [
                    {name: "entry", style: "float: left; height: 32px; clear: left;"},
                    {fit: true},
                    {name: "xx", kind: "onyx.Icon", showing: false, src: "assets/not_small.png", ontap: "removeData", style: "float: right; clear: right; color: red;"}
                ]}
            //]}
    ],
    handlers: {
        onSetupItem: "setupItem"
    },
    events: {
        onRenderDrawer: ""
        //onDataRemove: ""
    },
    create: function (a) {
        //this.array = [];
        LocalStorage.set("array", []);
        this.inherited(arguments);
    },
    rendered: function () {
        this.inherited(arguments);
    },
    buttonClick: function(inSender, inEvent) {
        var t = [1, 2, 3];
        Data.countAdd(t);
        this.refreshList();
    },
    addToArray: function(string) {
        this.log(string);
        var t = LocalStorage.get("array");
        t.push(string);
        LocalStorage.set("array", t);
        this.refreshList();
    },
    removeData: function(inSender, inEvent) {
        var data = Data.countGetAtIndex(inEvent.index);
        var name = data.shift();
        Data.countRemove(inEvent.index);
        //this.doDataRemove({index: inEvent.index, name: name});
        enyo.Signals.send("onDataRemove", {index: inEvent.index, name: name});
        this.refreshList();
    },
    getReversedIndex: function(inIndex) {
        var t = LocalStorage.get("array");
        return (t.length - 1) - inIndex;
    },
    setupItem: function (a, b) {
        var string = Data.countGetAtIndex(b.index);
        if(string != -1) {
            string.shift(); // get rid of control name
            string.shift(); // get rid of timestamp
            this.$.entry.setContent("1 " + string.join(" "));
            this.$.xx.show();
            /*b.item.$.entry.setContent(tmp.join(" "));
            b.item.$.xx.show();*/
        }
    },
    refreshList: function () {
        if(Data.countSize() <= 10) {
            this.$.ticker.setCount(Data.countSize());
            this.$.ticker.refresh();
            //this.$.ticker.resized();
            //this.$.ticker.render();
        }
        //this.log();
        this.$.ticker.reset();
        this.doRenderDrawer();
    },
    getData: function() {
        var t = LocalStorage.get("array");
        //return t.reverse();
        return t;
    }
});
