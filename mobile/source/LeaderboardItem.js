enyo.kind({
  name: "LeaderboardItem",
  kind: enyo.FittableColumns,
  style: "width: 80%; margin-left: auto; margin-right: auto; margin-bottom: 10px;",
  index: "",
  components: [
    {name: "User", content: "user"},
    {name: "Points", content: "points", style: "float: right;"}
  ],
  create: function (a, b) {
    this.inherited(arguments);
  },
  setIndex: function (a) {
    this.index = a;
  }
});
