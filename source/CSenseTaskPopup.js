enyo.kind({
	name: "CSenseTaskPopup",
	published: {
		task: "",
        popup: "",
	},
    components:[
        {name: "popupScroller", kind: enyo.Scroller, style: "max-height: 300px;", components:[
            {name: "popHeading", content: "",},
            {name: "popSubHeading", content: "",},
            {
                kind: enyo.Repeater,
                count: 0,
                components: [
                    {name: "itemCont", classes: "popup-list-item", onenter:"enterListItem", onleave:"leaveListItem", components:[
                        {name: "itemHeading", ontap: "toggleDrawer", published:{index: ""}, classes:"popup-list-item-heading"},
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
                onSetupItem: "setValues",
            },
        ],}
    ],
    create: function(){
        this.inherited(arguments);
        this.$.repeater.setCount(this.task.submissions.length);
        this.$.popHeading.setContent("Task "+this.task.id);
        this.$.popSubHeading.setContent("Instructinons: "+this.task.instructions);

    },
    setValues: function (inSender, inEvent){
        var index = inEvent.index;
        var item = inEvent.item;
        var sub = this.task.submissions[index];
        item.$.itemHeading.setName("submissionheading-" + sub.id);
        item.$.itemHeading.setContent("Submission " + sub.id);
        item.$.itemHeading.index = index;
        item.$.itemDrawer.setName("subdrawer-"+sub.id);
        item.$.control.setContent("Submitter: "+sub.user_id);
        item.$.control2.setContent("Number of answers: "+sub.answers.length);
        item.$.control3.setContent("Location: "+sub.gps_location);

        return true;
    },
    toggleDrawer: function (inSender, inEvent){
        //This is really weird... Why can't we use their names?
        var ind = inSender.index+1;
        if (ind === 1){ind = "";}
        var drawer = this.$.repeater.$["ownerProxy"+ind].$.itemDrawer;
        drawer.setOpen(!drawer.getOpen());
    },
    enterListItem: function (inSender, inEvent){
        //Give list item slight highlight
        //this.log(inEvent);
        inEvent.originator.addClass("popup-list-item-highlight");
        //highlight its marker
    },
    leaveListItem: function (inSender, inEvent){
        inEvent.originator.removeClass("popup-list-item-highlight");
    }
});