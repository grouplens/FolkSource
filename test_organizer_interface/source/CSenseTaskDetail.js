enyo.kind({
	name: "CSenseTaskDetail",
    layoutKind: enyo.FittableRowsLayout,
	published: {
		task: "",
        subs: "",
	},
    events:{
        onCSenseTaskDetailResized: "",
        onContentSet: "",
    },
    handlers: {
        onEmphasizeSubmission: "emphasizeSubmission",
    },
    components:[
		{name: "popHeading", content: "", style: "font-weight: 300;"},
		{name: "popSubHeading", content: "",},
        {name: "popupScroller", fit: true, kind: enyo.Scroller, style: "padding: 4px;", components:[
            {name: "spinner", kind: "onyx.Spinner", classes: "onyx-dark dark-background hidden", style: "margin-left:auto; margin-right:auto; display:block; margin-top:60px;"},
            {kind: enyo.Repeater, onSetupItem: "setRepeaterValues", submissionIdToOwnerProxy: {}, count: 0, components: [
                    {name: "itemCont", classes: "popup-list-item bordering standard-card", components:[
                        {name: "itemHeading", ontap: "toggleItemDrawer", published:{index: ""}, /*classes:"popup-list-item-heading"*/},
                        {name: "itemDrawer", kind: onyx.Drawer, open: false, orient: "v",
                            components:[
                                {name: "listItem", classes:"popup-list-item-body",components:[
                                    {content: "Submitter:"},
                                    {content: "Number of answers:"},
                                    {content: "Location:"},
                                ]},
                            ]
                        },
                    ]},
                ],
            },
        ],}
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
        this.subs = subArray;
        this.submissionIdToOwnerProxy = {}
        this.$.repeater.setCount(this.subs.length);
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
        this.doContentSet();
    },


    startSpinner: function(){
        this.$.spinner.removeClass("hidden");
        this.$.repeater.addClass("hidden");
    },
    stopSpinner: function(){
        this.$.spinner.addClass("hidden");
        this.$.repeater.removeClass("hidden");
    },
    spinFor: function(time) {
        this.startSpinner();
        var that = this;
        setTimeout(function(){
            that.stopSpinner();
        }, time)
    },



    setRepeaterValues: function (inSender, inEvent){
        var index = inEvent.index;
        var item = inEvent.item;
        //var sub = this.task.submissions[index];
        var sub = this.subs[index];

        //this.$.repeater.subIdtoIndexMap[sub.id] = index;
        this.$.repeater.submissionIdToOwnerProxy[sub.id] = item;
        item.$.itemHeading.index = index;

        //Setting these names might be pointless since we don't seem to be able to access these guys from the CSenseTaskDetail context anyways
        item.$.itemHeading.setName("submissionheading-" + sub.id);
        item.$.itemDrawer.setName("subdrawer-"+sub.id);

		var num = Number(index) + 1;
        item.$.itemHeading.setContent("Submission " + num);
        item.$.control.setContent("Submitter: "+sub.user_id);
        item.$.control2.setContent("Number of answers: "+sub.answers.length);
        item.$.control3.setContent("Location: "+ this.reverseGeocode(sub.gps_location));

        return true;
    },

    resizeHandler: function(){
        this.inherited(arguments);
        this.doCSenseTaskDetailResized();
    },

    reverseGeocode: function(gps_location){
        //Insert reverse geocoding functionality here!
        return "123 Fake St SE, Minneapolis, MN";
    },

    toggleItemDrawer: function (inSender, inEvent){
        this.log("toggle item drawer called");  
        var drawer = this.$.repeater.children[inEvent.index].$.itemDrawer
        drawer.setOpen(!drawer.getOpen());
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
