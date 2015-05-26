enyo.kind({
  name: "CampaignList",
  kind: "enyo.List",
  style: "overflow: hidden; height: 100%;",
  classes: "list",
  components: [
    { name: "item", kind: "CampaignItem", classes: "campItem", ontap: "refreshItem" },
    { name: "divider", classes: "divider" }
  ],
  handlers: {
    onWatchToggled: "refreshItem",
    onSetupRow: "setupRow"
  },
  events: {
    onChooseCampaign: ""
  },
  create: function (a) {
    this.inherited(arguments), this.log();
  },
  rendered: function () {
    this.log(), this.inherited(arguments);
  },
  renderResponse: function (a, b) {
    this.log(b.list), this.campaignArray = b.list["org.citizensense.model.Campaign"];
    for (var c in this.campaignArray) c.watching = !1;
    this.refreshList();
  },
  setupRow: function (a, b) {
    var c = b.index;
    this.$.item.setIndex(c), this.$.item.$.Title.setContent(this.campaignArray[c].title), this.$.item.$.Description.setContent(this.campaignArray[c].description), this.campaignArray[c].watching ? this.$.item.applyStyle("background-color", "green") : this.$.item.applyStyle("background-color", "clear");
  },
  refreshList: function () {
    this.log(), this.setRows(this.campaignArray.length), this.refresh();
  },
  refreshItem: function (a, b, c) {
    this.log(b.originator.index);
    var d = b.originator.index;
    this.log("rendering row " + d), this.render(), this.campaignArray[d].watching = this.campaignArray[d].watching === !0 ? !1 : !0;
  },
  campChosen: function () {
    this.doOnChooseCampaign();
  }
});
