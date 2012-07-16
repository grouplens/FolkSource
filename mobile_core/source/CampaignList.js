enyo.kind({
	name: "CampaignList",
	kind: "List",
	style: "overflow: hidden; height: 100%;",
	classes: "list",
	components: [
		{name: "item", kind:"CampaignItem", classes: "campItem", ontap: "refreshItem"},
		{name: "divider", classes: "divider"}
    ],
	handlers: {
		onWatchToggled: "refreshItem",
		//onStopWatchingCampaign: "refreshItem",
		onSetupRow: "setupRow"
	},
	events: {
		onChooseCampaign: ""
	},
	create: function(inSender) {
		this.inherited(arguments);
		this.log();
        var url = Data.getURL() + "campaign.xml";
		var request = new enyo.XmlpRequest({url: url});
		request.response(this, "renderResponse");
		request.go();
	},
	rendered: function() {
		this.log();
		this.inherited(arguments);
	},
	renderResponse: function(inSender, inResponse) {
		this.log(inResponse.list);
		this.campaignArray = inResponse.list["org.citizensense.model.Campaign"];
		for (var camp in this.campaignArray) {
			camp.watching = false;
		}
		this.refreshList();
	},
    setupRow: function(inSender, inEvent) {
    	var index = inEvent.index;
    	this.$.item.setIndex(index);
        this.$.item.$.Title.setContent(this.campaignArray[index].title);
        this.$.item.$.Description.setContent(this.campaignArray[index].description);
    	if(this.campaignArray[index].watching) {
    		//this.$.item.$.b.addClass("active", this.campaignArray[index].watching);
    		//this.$.item.$.Watch.show();
    		this.$.item.applyStyle("background-color", "green");
    	} else {
    		//this.$.item.$.b.removeClass("active", this.campaignArray[index].watching);
    		//this.$.item.$.Watch.hide();
    		this.$.item.applyStyle("background-color", "clear");
    	}
        //return true;
    },
    refreshList: function() {
    	this.log();
		this.setRows(this.campaignArray.length);
        this.refresh();
    },
    refreshItem: function(inSender, inEvent, inIndex) {
    	//var index = inEvent.originator.index;
    	this.log(inEvent.originator.index);
    	var index = inEvent.originator.index;
    	//this.log(this.campaignArray);
    	/*this.$.item.$.b.addRemoveClass("active", !this.campaignArray[this.$.item.index].watching);
    	if(this.$.item.watching) {
    		this.$.item.applyStyle("background-color", "green");
    	} else {
    		this.$.item.applyStyle("background-color", "clear");
    	}
		this.renderRow(this.$.item.index);*/
		this.log("rendering row " + index);
		this.render();
		this.campaignArray[index].watching = this.campaignArray[index].watching === true ? false : true;
		//this.campaignArray[index].watching = !this.campaignArray[index].watching
		//return true;
    },
    campChosen: function() {
    	this.doOnChooseCampaign();
    }
});
