enyo.kind({
    name: "LeaderboardList",
    kind: "enyo.List",
    style: "background-color: #254048;",
    classes: "list",
    components: [{
        name: "item",
        kind: "LeaderboardItem",
        classes: "campItem"
    }],
    handlers: {
        onSetupItem: "setupItem"
    },
    create: function (a) {
        var b = Data.getURL() + "leaderboard.json",
            c = new enyo.Ajax({
                method: "GET",
                cacheBust: !1,
                url: b,
                handleAs: "json"
            });
        c.response(this, "renderResponse"), c.go(), this.inherited(arguments);
    },
    rendered: function () {
        this.inherited(arguments);
    },
    renderResponse: function (a, b) {
        this.leaderboardArray = b.leaderboardEntrys, this.refreshList();
    },
    setupItem: function (a, b) {
        return this.$.item.setIndex(b.index), this.$.item.$.User.setContent(this.leaderboardArray[b.index].name), this.$.item.$.Points.setContent(this.leaderboardArray[b.index].points), !0;
    },
    refreshList: function () {
        this.setCount(this.leaderboardArray.length), this.refresh();
    }
});
