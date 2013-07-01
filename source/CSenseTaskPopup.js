enyo.kind({
	name: "CSenseTaskPopup",
	published: {
		task: "",
        popup: "",
	},
    components:[
        {
            kind: enyo.Repeater,
            count: 0,
            components: [
                {kind: onyx.Button, ontap: "toggleDrawer", published:{index: ""},},
                {kind: onyx.Drawer, open: false, orient: "v",
                    components:[
                        {content: "Submitter:"},
                        {content: "Number of answers:"},
                        {content: "Location:"},
                    ]
                },
            ],
            onSetupItem: "setValues",
            //Why doesn't this function fire when I set the ontap property of the buttons to "foo"?
            foo: function (inSender, inEvent){
                alert("wat");
            },
        },
    ],
    create: function(){
        this.inherited(arguments);
        this.$.repeater.setCount(this.task.submissions.length);
    },
    setValues: function (inSender, inEvent){
        var index = inEvent.index;
        var item = inEvent.item;
        var sub = this.task.submissions[index];
        //this.log(inEvent);

        item.$.button.setName("submissionheading-" + sub.id);
        item.$.button.setContent("Submission " + sub.id);
        item.$.button.index = index;
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
    test: function(inSender, inEvent){
        this.log(inSender.submissionId)
        this.$["subdrawer-"+inSender.published.submissionId].setOpen(true);
	}
    */