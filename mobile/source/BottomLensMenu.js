enyo.kind({
  name: "BottomLensMenu",
  kind: enyo.FittableRows,
  published: {
    topic: "Guns",
    defaultUsage: true
  },
  components: [
    {kind: onyx.Toolbar, classes: "dark-background-flat", layoutKind: enyo.FittableColumnsLayout, style: "padding: 15px", components: [
      {name: "topic", content: ""},
      {name: "maybe", tag: "i", classes: "fa fa-question fa-fw fa-3x", style: "color: yellow;", ontap: "sendEvent"},
      {name: "allowed", tag: "i", classes: "fa fa-check fa-fw fa-3x", style: "color: green;", ontap: "sendEvent"},
      {name: "not_allowed", tag: "i", classes: "fa fa-ban fa-fw fa-3x", style: "color: red;", ontap: "sendEvent"},
      {fit: true, content: "In Minnesota, gun-carry is allowed by default. Unless a user submission or the law stipulates otherwise. We use the '?' to denote that we do not have information at a given place.", style: "font-size: 8pt !important;"}
      //{content: "In Minnesota, gun-carry is allowed by default. Unless users have said otherwise, we d
    ]},
    {kind: onyx.Toolbar, classes: "light-background-flat", layoutKind: enyo.FittableColumnsLayout, components: [
      {content: "Correct or Contribute to the map!", fit: true, style: "text-align: center;"},
    ]}
  ],
  create: function(inSender, inEvent) {
    this.inherited(arguments);
    this.$.topic.setContent(this.topic + " allowed: ");
    this.$.allowed.setShowing(this.defaultUsage);
    this.$.not_allowed.setShowing(!this.defaultUsage);
    this.$.maybe.setShowing(this.defaultUsage);
  },
  rendered: function(inSender, inEvent) {
    this.inherited(arguments);
    var div = document.getElementById(this.id);
    this.log(div.scrollHeight);
    this.log(div.clientHeight);
    this.log(div.offsetHeight);
  },
});
