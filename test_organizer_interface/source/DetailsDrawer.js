enyo.kind({
	name: "DetailsDrawer", 
	kind: onyx.Drawer, 
	layoutKind: enyo.FittableRowsLayout,
	orient: "v", 
	open: false, 
	classes: "light-background", 
	style: "max-width: 524px;", 
	handlers: {
	},
	components: [
		{kind: enyo.Signals, onHilightSubmission: "setSubDetails"},
		{kind: enyo.FittableColumns, classes: "active-card", components: [
			{name: "heading", content: "Submission details", fit: true,},
			{tag: "i", classes: "icon-remove icon-2x hilight-icons-negative", ontap: "closeDetailDrawer"},
		]},
		{name: "switchy", kind: onyx.RadioGroup, onActivate: "switchDetails", style: "text-align: center;", classes: "nice-padding", components: [
			{content: "Answers", active: true, classes: "button-style"},
			{content: "User", classes: "button-style"},
		]},
		{name: "detailsPanels", kind: enyo.Panels, arrangerKind: enyo.CarouselArranger, fit: true, narrowFit: true, style: "width: 100%; height: 200px;", components: [
			{name: "answersPane", kind: enyo.FittableRows, style: "width: 100%;", components: [
				{name: "loc", content: "Location:"},
				{name: "answers"},
			]},
			{name: "userPane", kind: enyo.FittableRows, style: "width: 100%;", components: [
				{name: "nope", showing: true, content: "You must be logged in and an owner of this campaign to see these details", fit: true, style: "vertical-align: middle; text-align: center;"},
				{name: "sure", showing: false, components: [
					{content: "Username", style: "font-weight: bold;"},
					{name: "user", classes: "hanging-child"},
					{content: "Email address", style: "font-weight: bold;"},
					{name: "email", classes: "hanging-child"},
					{content: "Points earned", style: "font-weight: bold;"},
					{name: "points", classes: "hanging-child"},
				]}
			]},
		]}
	],
	setSubDetails: function(inSender, inEvent) {
		var data = inEvent.sub;
		this.log(data);
		this.log(this.$.answers);
		this.$.answers.destroyComponents();
		for(var x in data.answers) {
			this.log(data.answers[x]);
			this.$.answers.createComponent({name: "q"+x, content: data.answers[x].question.question, style: "font-weight: bold;", classes: "hanging-child"});
			switch(data.answers[x].answer_type) {
				case "text":
					this.$.answers.createComponent({name: "ans"+x, content: data.answers[x].answer, classes: "hanging-child"});
				break;
				case "multiple_choice":
				case "exclusive_multiple_choice":
					this.$.answers.createComponent({name: "ans"+x, content: data.answers[x].choices, classes: "hanging-child"});
				break;
				case "complex_counter":
					this.$.danswers.createComponent({name: "ans"+x, content: data.answers[x].counts, classes: "hanging-child"});
				break;
			}
		}
		this.getGeocode(data);
		this.getUserData(data);
		this.render();
		this.resized();
		this.setOpen(true);
		return true;
	},
	closeDetailDrawer: function(inSender, inEvent) {
		this.setOpen(false);
		this.doClearMarkerHilight();
		return true;
	},	
	getUserData: function(data) {
		var id = data.user_id;
		var ajax = new enyo.Ajax({handleAs: "json", method: "GET", url: Data.getURL() + "userdetail/" + id + ".json"});
		ajax.response(this, "setUserInfo");
		ajax.go();
	},	
	setUserInfo: function(inSender, inEvent) {
		this.log(inEvent);
		var data = inEvent.userDetail;
		this.$.user.setContent(data.name);
		this.$.points.setContent(data.points);
		this.$.email.setContent(data.email);
		this.$.detailsPanels.render();
		this.resized();
	},	
	getGeocode: function(sub) {
		var loc = sub.gps_location.split("|");
		var ajax = new enyo.Ajax({handleAs: "json", url: "http://open.mapquestapi.com/nominatim/v1/search?format=json&q=" + loc[0] + "+" + loc[1]});
		ajax.response(this, "reverseGeocode");
		ajax.go();
	},	
    reverseGeocode: function(inSender, inEvent){
		this.log(inSender);
		this.log(inEvent);
        //Insert reverse geocoding functionality here!
		this.$.loc.setContent("Location: " + inEvent[0].display_name);
		this.$.detailsPanels.render();
		this.resized();
        return "123 Fake St SE, Minneapolis, MN";
    },
	switchDetails: function(inSender, inEvent) {
		this.log(inSender);
		this.log(inEvent);
		if(inEvent.originator.getActive() && inSender.name === "switchy") {
			if(inEvent.originator.getContent() === "Answers")
				this.$.detailsPanels.setIndex(0);
			if(inEvent.originator.getContent() === "User")
				this.$.detailsPanels.setIndex(1);
		}
		return true;
	},	
});
