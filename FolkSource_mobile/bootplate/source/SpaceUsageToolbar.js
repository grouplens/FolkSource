enyo.kind({
  name: "SpaceUsageToolbar",
  kind: onyx.Toolbar,
  classes: "dark-background-flat",
  layoutKind: enyo.FittableColumnsLayout,
  style: "padding: 15px;",
  published: {
    place: "",
  },
  events: {
    onSearchTriggered: ""
  },
  components: [
    {content: "You're at: "},
    {tag: "p", name: "place", style: "overflow: hidden; text-overflow: ellipsis;word-break: keep-all;", fit: true},
    {name: "browse_icon", tag: "i", classes: "fa fa-search fa-fw fa-lg fa-flip-horizontal color-icon", ontap: "sendEvent"},
  ],
  create: function(inSender, inEvent) {
    this.inherited(arguments)
    this.$.place.setContent(this.place + " ");
  },
  placeChanged: function(inSender, inEvent) {
    this.$.place.setContent(this.place);
    this.render();
  },
  sendEvent: function() {
    this.doSearchTriggered();
    return true;
  },
});
