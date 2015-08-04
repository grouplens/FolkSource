enyo.kind({
  name: "LeaderboardList",
  kind: "enyo.FittableRows",
  //style: "background-color: #254048;",
  classes: "light-background",
  style: "width: 100%;",
  components: [
    {name: "signals", kind: "enyo.Signals", onLoggedIn: "fetchData"},
    {name: "list", kind: "enyo.List", fit: true, onSetupItem: "setupItem", components: [
      {name: "item", kind: "LeaderboardItem"}
    ]}
  ],
  create: function (a) {
    this.inherited(arguments);
  },
  rendered: function () {
    this.inherited(arguments);
  },
  fetchData: function() {
    var url = Data.getURL() + "user/leaderboard";
    var req = new enyo.Ajax({method: "GET", cacheBust: !1, url: url, handleAs: "json", headers: {AuthToken: LocalStorage.get("authtoken")}});
    req.go();
    req.response(this, "renderResponse");
  },
  renderResponse: function (inSender, inEvent) {
    this.leaderboardArray = inEvent;
    this.refreshList();
    enyo.Signals.send("onLeaderLoaded");
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
    //this.parent.$.lboard.resize();
               }
});
