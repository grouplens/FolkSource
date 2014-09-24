enyo.kind({
	name: "CustomProgress",
	kind: onyx.ProgressButton,
	classes: "color-progress-big",
	barClasses: "color-progress",
	animateBars: true,
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.icon.setShowing(false);
		/*this.$.icon.setDisabled(true);*/
	},
	fail: function(inSender, inEvent) {
		this.setBarClasses("color-progress-negative");
		this.setProgress(100);
	},	
	reset: function(inSender, inEvent) {
		this.setBarClasses("color-progress");
		this.setProgress(0);
	},	
});
