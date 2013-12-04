enyo.kind({
	name: "CSenseTaskDetail",
    kind: enyo.FittableRows,
	published: {
		task: "",
        subs: "",
	},
    events:{
        onCSenseTaskDetailResized: "",
		onHilightSubmission: "",
        onContentSet: "",
    },
    handlers: {
        onEmphasizeSubmission: "emphasizeSubmission",
    },
    components:[
		{name: "popHeading", content: "", style: "font-weight: 300;"},
		{name: "popSubHeading", content: "",},
		{name: "spinnerDrawer", kind: onyx.Drawer, orient: "v", open: false, components: [
			{name: "spinner", kind: "onyx.Spinner", classes: "onyx-dark dark-background hidden", style: "margin-left:auto; margin-right:auto; display:block; margin-top:60px;"},
		]},
		{name: "repeater", kind: enyo.List, fit: true, onSetupItem: "setRepeaterValues", submissionIdToOwnerProxy: {}, count: 0, components: [
			{name: "itemCont", kind: enyo.FittableColumns, style: "width: 100%;", ontap: "hilightMarker", classes: "popup-list-item bordering standard-card", components:[
				{kind: enyo.FittableRows, classes: "nice-padding", style: "height: 100%;", components: [
					{name: "itemHeading", fit: true},
				]},
			]},
		]},
	],

	/*
	setTask: function(task){
        this.task = task;
        this.submissionIdToOwnerProxy = {} 
        this.$.repeater.setCount(this.task.submissions.length);
        this.$.popHeading.setContent("Task "+this.task.id);
        this.$.popSubHeading.setContent("Instructinons: "+this.task.instructions);
    },
    */
    setCont: function(subArray, heading, subheading){
		//this.startSpinner();
        this.subs = subArray;
        this.submissionIdToOwnerProxy = {};
        this.$.repeater.setCount(this.subs.length);
		this.$.repeater.reset();
		if(heading)
			this.totalSubs = this.subs.length;
        //if (heading){
			this.$.popHeading.setContent("Showing " + this.subs.length + " of " + this.totalSubs + " submissions.");
            //this.$.popHeading.setContent(heading);
        //}
        if (subheading){
			this.$.popSubHeading.setContent("Click titles below to see details");
            //this.$.popSubHeading.setContent(subheading);
        }
        //this.doContentSet();
    },

    startSpinner: function(){
        this.$.spinner.removeClass("hidden");
		this.$.spinnerDrawer.setOpen(true);
        this.$.repeater.addClass("hidden");
    },
    stopSpinner: function(){
        this.$.spinner.addClass("hidden");
		this.$.spinnerDrawer.setOpen(false);
        this.$.repeater.removeClass("hidden");
    },
    spinFor: function(time) {
        this.startSpinner();
        var that = this;
        setTimeout(function(){
            that.stopSpinner();
        }, time);
    },



    setRepeaterValues: function (inSender, inEvent){
        var index = inEvent.index;
        var sub = this.subs[index];
		this.data = sub;
        this.$.itemHeading.index = index;

		var num = Number(index) + 1;
        this.$.itemHeading.setContent(num);

        return true;
    },

    resizeHandler: function(){
        this.inherited(arguments);
        this.doCSenseTaskDetailResized();
    },

    toggleItemDrawer: function (inSender, inEvent){
        this.log("toggle item drawer called");  
        var drawer = this.$.repeater.children[inEvent.index].$.itemDrawer;
        drawer.setOpen(!drawer.getOpen());
		var open = drawer.getOpen();
    },
	hilightMarker: function(inSender, inEvent) {
		var index = inEvent.index;

		this.doHilightSubmission({sub: this.subs[index], open: open});
	},	

    getItemCont: function(subId){
        return this.getOwnerProx(subId).$.itemCont;
    },

    getOwnerProx: function(subId){
        /*
        var i = this.$.repeater.subIdtoIndexMap[subId]+1;
        if (i === 1){i = "";}
        this.log(i);
        return this.$.repeater.$["ownerProxy"+i];
        */
        return this.$.repeater.submissionIdToOwnerProxy[subId];
    },

    emphasizeSubmission: function(inSender, inEvent){
        var subId = inEvent.submissionId;
        //Open submission drawer
            //this.log(subId);
            //this.log(this.getOwnerProx(subId));
            //this.log(this);
        var drawer = this.getOwnerProx(subId).$.itemDrawer;
            
        //disable animation first!
        var wasAnimated = drawer.animated;
        drawer.animated = false;
        drawer.setOpen(true);
        drawer.animated = wasAnimated;

        //scroll the div to the submission drawer
            //var topPos = this.getItemCont(subId).hasNode().offsetTop;
            //this.$.popupScroller.hasNode().scrollTop = topPos;
        this.$.popupScroller.scrollIntoView(this.getItemCont(subId), true);



        //To perform highlighting effect: Add highlight color; enable transitions; remove highlight color; disable transitions
        this.getItemCont(subId).applyStyle("background-color", "#B00200");
        //transition does nothing without delay
        var that = this;
        var t = setTimeout(function(){
            that.getItemCont(subId).hasNode().style[L.DomUtil.TRANSITION] = "all 1000ms ease-out";
            that.getItemCont(subId).hasNode().style["transition-delay"]= "1ms";
            that.getItemCont(subId).hasNode().style["background-color"] = null;
        }, 10);
        /*
        I originaly expected that we would have to remove the transition effect when it finished. I thought that otherwise
        the next time we click on the marker the row would also fade from white to red as well as from red to white. However,
        this doesn't seem to happen. Not sure why not...
        */
    },
});
