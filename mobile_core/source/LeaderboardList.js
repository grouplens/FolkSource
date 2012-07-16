enyo.kind({
	name: "LeaderboardList",
	kind: "enyo.List",
	style: "background-color: #254048;",
	classes: "list",
	components: [
		{name: "item", kind:"LeaderboardItem", classes: "campItem"}
    ],
	handlers: {
		onSetupItem: "setupItem"
	},
	create: function(inSender) {
        var url = Data.getURL() + "leaderboard.json";
		var request = new enyo.Ajax({contentType: "application/json", cacheBust: false, url: url});
		request.response(this, "renderResponse");
		request.go();
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
	},
	renderResponse: function(inSender, inResponse) {
		this.leaderboardArray = inResponse.leaderboardEntrys;
		this.refreshList();
	},
    setupItem: function(inSender, inEvent) {
		this.$.item.setIndex(inEvent.index);
        this.$.item.$.User.setContent(this.leaderboardArray[inEvent.index].name);
        this.$.item.$.Points.setContent(this.leaderboardArray[inEvent.index].points);
        return true;
    },
    refreshList: function() {
        this.setCount(this.leaderboardArray.length);
        this.refresh();
    }
});
