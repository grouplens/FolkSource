enyo.kind({
	name: "CSenseCreateCampaign",
	kind: enyo.FittableRows,
	classes: "enyo-fit",
	style: "width: 100%;",
	//style: "width: 80%; margin-left: auto; margin-right: auto;",
	events: {
	    onCampPicked: "",
	    onPins: ""
	},
	handlers: {
	    onCampPicked: "makeTasks",
	    onCampaignView: "campaignView",
	    onTaskView: "taskView",
	    onQuestionView: "questionView"
	},
	components:[
	    /*{name: "loginPopup", kind: "onyx.Popup", modal: true, autoDismiss: false, floating: true, centered: true, scrim: true, style: "position: absolute;", components: [
		{name: "login", kind: "CSenseLoginRegister"}
	    ]},*/
	   	{kind: enyo.Signals, onNew: "openSlider"},
		{name: "slide", kind: enyo.Slideable, layoutKind: enyo.FittableRowsLayout, unit: "px", max: 55, axis: "v", draggable: false, style: "position: absolute; width: 100%; height: 100%; z-index: 1;", components: [
			{name: "createCampaign", kind: enyo.Scroller, style: "background-color: orange; position: relative; width: 90%; margin-left: auto; margin-right: auto;", fit: true, layoutKind: enyo.FittableRowsLayout, components: [
			    	{name: "campaignArea", /*kind: enyo.FittableColumns,*/ fit: true, components: [
			    		{name: "newCampaign", kind: "CSenseNewCampaign", fit: true},
				]}
			]}
		]}
	],
	create: function(inSender, inEvent) {
	    	this.inherited(arguments);
	},
	rendered: function(inSender, inEvent) {
	    	this.inherited(arguments);
	    	var cHeight = Number(document.body.clientHeight - 55);
	    	//var eighty = Math.floor(cHeight/* * 0.95*/);
	    	/*this.log(cHeight);
	    	this.log(eighty);
	    	this.log((eighty-55)*-1);*/
	    	this.$.slide.setMin(cHeight*-1);
	    	this.$.slide.setValue(cHeight*-1);
	    	this.$.slide.addStyles("height: "+cHeight+"px;");
	    	this.resized();
	    	this.$.slide.resized();
	},
	campaignView: function(inSender, inEvent) {
		this.$.extraArea.applyStyle("width", "0%");
		this.$.campaignArea.resized();
	    	this.$.extraArea.destroyComponents();
		this.$.extraArea.render();
		return true;
	},
	openSlider: function(inSender, inEvent) {
		if(this.$.slide.isAtMin()) {
	    		this.$.newCampaign.destroy();
	    		this.$.campaignArea.createComponent({name: "newCampaign", kind: "CSenseNewCampaign", fit: true}, {owner: this});
	    		this.$.campaignArea.render();
	    		this.$.createCampaign.render();
		}
	    	this.$.slide.toggleMinMax();
		return true;
	},
	taskView: function(inSender, inEvent) {
		/*this.$.extraArea.applyStyle("width", "40%");
		this.$.campaignArea.resized();
	    	this.$.extraArea.destroyComponents();
		this.$.extraArea.createComponents([{name: "createMap", kind: "CreateMap", fit: true}]);
		this.$.extraArea.render();*/
		return true;
	},
	questionView: function(inSender, inEvent) {
		/*this.$.extraArea.applyStyle("width", "40%");
		this.$.campaignArea.resized();
	    	this.$.extraArea.destroyComponents();
		this.$.extraArea.createComponents([{name: "phoneRender", kind: "ComplexSensr", fit: true}]);
		this.$.extraArea.render();*/
		return true;
	}
});

