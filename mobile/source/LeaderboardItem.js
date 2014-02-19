enyo.kind({
    name: "LeaderboardItem",
    classes: "leaderItem",
    index: "",
    components: [{
        name: "User",
        content: "user",
        classes: "leaderTable leaderUser"
    }, {
        name: "Points",
        content: "points",
        classes: "leaderTable leaderPoints"
    }],
    create: function (a, b) {
        this.inherited(arguments);
    },
    setIndex: function (a) {
        this.index = a;
    }
});
