enyo.kind({
	name: "CampaignBuilder",
	kind: onyx.Drawer, 
	open: false,
	orient: "h",
	style: "height: 100%; width: 100%;",
	layoutKind: enyo.FittableColumnsLayout,
	events: {
		onDrawerToggled: "",
		onResizeMap: ""
	},
	handlers: {
		onNewTapped: "toggleDrawer",
		onFinishedSavingTask: "finishCreateTask",
		onStep: "drawerAnimationEndHandler",
		onShowTapped: "closeDrawer",
		onNewTask: "resizeUs",
		onNewLocation: "newLocation",
		onShowQuestion: "openQuestionDrawer",
		onDestroyed: "checkTaskTitles"
	},
	components: [
		{kind: enyo.FittableRows, fit: true, style: "height: 100%; width: 550px;", classes: "light-background", components: [
			{name: "header", kind: "CampaignHeader"},
			{name: "nameContainer", kind: enyo.FittableColumns, components: [
				{name: "taskButton", kind: onyx.Button, style: "height: 41px;", classes: "button-style", ontap: "createTask", attributes: {title: "Add a new task to this campaign."}, components: [
					{name: "more", tag: "i", classes: "icon-plus"}
				]},
				{name: "nodeContainer", kind: onyx.RadioGroup, classes: "light-background", fit: true}
			]},
			{name: "realContainer", kind: enyo.Panels, arrangerKind: enyo.CarouselArranger, classes: "dark-background", wrap: false, animate: true, fit: true},
		]}
	],
	closeDrawer: function(inSender, inEvent) {
		this.setOpen(false);
	},
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.render();
	},
	checkTaskTitles: function(inSender, inEvent) {
		this.waterfallDown("onDestroyed", {us: inEvent.us});
		if(inEvent.us.kind === "TaskBuilder") {
			var index = inEvent.us.$.taskTitle.getTitle().charAt(1);
			this.log(index);
			enyo.forEach(this.$.nodeContainer.getControls(), function(inSender, inEvent) {
				if(String(inSender.getContent()) > index) {
					inSender.setContent(Number(inSender.getContent())-1);
				}
			}, this);
			var tmp = this.$.nodeContainer.getControls();
			tmp[Number(index)-1].destroy();
			this.$.realContainer.setIndexDirect(Number(index));
		}
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
	},
	createTask: function(inSender, inEvent) {
		var len = this.$.realContainer.getComponents().length;
		var height = this.getHeight();
		var t = "height: " + height + " !important; width: 100%;";
		this.log(len);
		if(len === 1) {
			this.$.nodeContainer.createComponent({active: true, classes: "dark-background-flat", style: "height: 100%;", content: len, ontap: "gotoTask"}, {owner: this});
		} else {
			this.$.nodeContainer.createComponent({classes: "dark-background-flat", style: "height: 100%;", content: len, ontap: "gotoTask"}, {owner: this});
		}

		this.$.realContainer.createComponent({kind: "TaskBuilder", index: len, style: t, type: "TaskBuilder", classes: "active-card"});
		this.$.realContainer.render();
		this.$.realContainer.resized();
		this.$.nodeContainer.render();
		if(len === 12) {
			this.$.taskButton.setDisabled(true);
		}
	},
	getHeight: function(inSender, inEvent) {
		var total = this.hasNode().offsetHeight;
		var header = this.$.header.hasNode().offsetHeight;
		var button = this.$.taskButton.hasNode().offsetHeight;

		return total - header - button;
	},	
	getData: function(inSender, inEvent) {
		var campaign = {};
		campaign.id = 0;
		campaign.start_date = "";
		campaign.end_date = "";
		enyo.mixin(campaign, this.$.header.getData());
		campaign.tasks = this.getTasks();
		campaign.owner_id = LocalStorage.get("user");
		return campaign;
	},	
	getTasks: function(inSender, inEvent) {
		var tmp = [];
		enyo.forEach(this.$.realContainer.getPanels(), function(inSender, inEvent) {
			tmp.push(inSender.getData());
		}, this);
		return tmp;
	},	
	gotoTask: function(inSender, inEvent) {
		this.log();
		var index = inSender.getContent();
		this.$.realContainer.setIndex(Number(index)-1);
	},	
	newLocation: function(inSender, inEvent) {
		var index = this.$.realContainer.index;
		this.$.realContainer.getPanels()[index].newLocation(inEvent);
		return true;
	},	
	openQuestionDrawer: function(inSender, inEvent) {
		this.$.questionDrawer.setOpen(true);
	},	
	scrollDown: function(inSender, inEvent) {
		this.$.nodeContainer.scrollToBottom();
	},
	toggleDrawer: function(inSender, inEvent) {
		var truthy = this.getOpen();
		this.setOpen(!truthy);
	},
	removeAllTasks: function(inSender, inEvent) {
		this.log();
		/*enyo.forEach(this.$.realContainer.getComponents(), function(input) {
			input.destroy()
		});*/
		this.$.realContainer.destroyComponents();
		this.$.nodeContainer.resized();
		this.$.realContainer.render();
	},
	drawerAnimationEndHandler: function(inSender, inEvent) {
		this.log();
		this.doResizeMap();
	}
});
