enyo.kind({
	name: "CSenseTaskPopup",
	published: {
		task: "",
        popup: "",
	},
    components:[
        {kind: enyo.Scroller, style: "max-height: 300px;", components:[
            {
                kind: enyo.Repeater,
                count: 0,
                components: [
                    {name: "heading", ontap: "toggleDrawer", published:{index: ""}, classes:"popup-list-heading"},
                    {name: "drawer", kind: onyx.Drawer, open: false, orient: "v",
                        components:[
                            {name: "listItem", classes:"popup-list-item",components:[
                                {content: "Submitter:"},
                                {content: "Number of answers:"},
                                {content: "Location:"},
                            ]},
                        ]
                    },
                ],
                onSetupItem: "setValues",
            },
        ],}
    ],
    create: function(){
        this.inherited(arguments);
        this.$.repeater.setCount(this.task.submissions.length);
    },
    setValues: function (inSender, inEvent){
        var index = inEvent.index;
        var item = inEvent.item;
        var sub = this.task.submissions[index];

        item.$.heading.setName("submissionheading-" + sub.id);
        item.$.heading.setContent("Submission " + sub.id);
        item.$.heading.index = index;
        item.$.drawer.setName("subdrawer-"+sub.id);
        item.$.control.setContent("Submitter: "+sub.user_id);
        item.$.control2.setContent("Number of answers: "+sub.answers.length);
        item.$.control3.setContent("Location: "+sub.gps_location);

        return true;
    },
    toggleDrawer: function (inSender, inEvent){

        //This is really weird... Why can't we use their names?
        var ind = inSender.index+1;
        if (ind === 1){ind = "";}
        var drawer = this.$.repeater.$["ownerProxy"+ind].$.drawer;
        drawer.setOpen(!drawer.getOpen());
    }
});
    /*
	create: function() {
        this.inherited(arguments);

        for (key in this.task.submissions){

        	var sub = this.task.submissions[key];

        	this.createComponent({
        		kind: onyx.Button,
        		name: "submissionheading-" + sub.id,
                published: {
                    submissionId: sub.id,
                },
        		content: "Submission " + sub.id,
        		ontap: "test",
        	});

        	this.createComponent({
        		name: "subdrawer-"+sub.id,
        		kind: "onyx.Drawer",
        		open: false,
        		orient: "v",
        		components: [
        			{content: "Submitter: "+sub.user_id},
        			{content: "Number of answers: "+sub.answers.length},
        			{content: "Location: "+sub.gps_location}
        		],
        	});
			
        }
    },
    resizeHandler: function(inSender, inEvent){
        this.inherited(arguments);
        //this.popup._update();
    },
    */