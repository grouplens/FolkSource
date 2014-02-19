enyo.kind({
    name: "LeaderboardList",
    kind: enyo.FittableRows,
    //style: "background-color: #254048;", 
    classes: "list light-background",
    components: [
	{name: "list", kind: enyo.List, fit: true, onSetupItem: "setupItem", components: [
        	{name: "item", kind: "LeaderboardItem", classes: "campItem"}
    	]}
    ],
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
        this.$.list.render();
        /*this.$.list.setCount(this.leaderboardArray.length);
        this.$.list.refresh();*/
        //this.parent.$.lboard.resized();
    }
});
