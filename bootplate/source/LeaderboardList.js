enyo.kind({
    name: "LeaderboardList",
    kind: "enyo.FittableRows",
    components: [
        {name: "list", style: "background-color: #254048;", kind: "enyo.List", count: 5, classes: "list", components: [
            {name: "item", kind: "LeaderboardItem", classes: "campItem"}
        ]}
    ],
    handlers: {
        onSetupItem: "setupItem"
    },
    create: function (a) {
        var url = Data.getURL() + "leaderboard.json";
        var req = new enyo.Ajax({method: "GET", cacheBust: !1, url: url, handleAs: "json"});
        req.response(this, "renderResponse");
        req.go();
        this.inherited(arguments);
    },
    rendered: function () {
        this.inherited(arguments);
    },
    renderResponse: function (inSender, inEvent) {
        this.leaderboardArray = inEvent.leaderboardEntrys;
        this.refreshList();
    },
    setupItem: function (inSender, inEvent) {
        this.$.item.setIndex(inEvent.index);
        if(this.leaderboardArray != undefined) {
            this.$.item.$.User.setContent(this.leaderboardArray[inEvent.index].name);
            this.$.item.$.Points.setContent(this.leaderboardArray[inEvent.index].points);
        }
        return true;
    },
    refreshList: function () {
        this.$.list.setCount(this.leaderboardArray.length);
        this.$.list.refresh();
    }
});
