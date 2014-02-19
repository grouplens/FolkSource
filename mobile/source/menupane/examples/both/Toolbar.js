enyo.kind({
  name: "Toolbar",
  kind: "onyx.Toolbar",
  published: {
    header: ""
  },
  events: {
    onHeader: "",
    onToggleMenu: "",
    onToggleSecondaryMenu: ""
  },
  components: [
    { kind: "onyx.Grabber", ontap: "doToggleMenu", style: "float: left;" },
    { name: "header", content: "", ontap: "doHeader", style: "padding-top: 4px" },
    { kind: "onyx.Grabber", ontap: "doToggleSecondaryMenu", style: "float: right;" }
  ],

  create: function() {
    this.inherited(arguments);
    this.headerChanged();
  },

  headerChanged: function() {
    this.$.header.setContent(this.getHeader());
  }
});
