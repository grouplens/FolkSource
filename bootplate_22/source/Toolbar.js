enyo.kind({
    name: "Toolbar",
    kind: "onyx.Toolbar",
    published: {
        header: ""
    },
    events: {
        onHeader: "",
        onToggleMenu: ""
    },
    components: [
		{kind: "onyx.Grabber", ontap: "doToggleMenu", style: "float: left;"},
		{name: "header", content: "", ontap: "doHeader", style: "padding-top: 4px"}
	],
    create: function () {
        this.inherited(arguments);
		this.headerChanged();
    },
    headerChanged: function () {
        this.$.header.setContent(this.getHeader());
    }
});
