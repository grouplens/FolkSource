enyo.kind({
	name: "ComplexSensr",
	classes: "light-background",
	kind: enyo.FittableRows,
	published: {
			data: "",
			gps: "",
	},
	events: {
		onSubmisisonMade: "",
		on2DrawerClick: "",
		onRenderScroller: "",
		onSendFiles: "",
	},
	handlers: {
		onSenseOpened: "openNext",
		onPhotoOk: "photoOk",
		onDeviceReady: "setReady",
		onRenderDrawer: "renderDrawer2",
		onTimerStarted: "jumpToCounter",
		onComplete: "downCount",
	},
	components: [
		{kind: "enyo.Signals", onPinClicked: "chosenLocation", onPhotoData: "photoData", onButtonGroupChosen: "renderSubmitButton", onLocationFound: "saveLocation"},
		{name: "doubleCheckPopup", kind: onyx.Popup, autoDismiss: false, centered: true, floating: true, modal: true, scrimWhenModal: false, scrim: true, classes: "dark-background-flat white-text", style: "width: 80%;", components: [
			{name: "doubleCheckMessage", content: "Are you sure you want to cancel? You will lose all observation data recorded", style: "padding: 5px 0px;"},
			{kind: enyo.ToolDecorator, classes: "senseButtons", components: [
				{name: "no", kind: onyx.Button, classes: "button-style-negative", ontap: "close", components: [
					{tag: "i", classes: "icon-ban-circle icon-large"}
				]},
				{name: "yes", kind: onyx.Button, classes: "button-style-affirmative", ontap: "close", components: [
					{tag: "i", classes: "icon-ok icon-large"}
				]},
			]}
		]},
		{name: "sendingPopup", kind: onyx.Popup, autoDismiss: false, centered: true, floating: true, modal: true, scrimWhenModla: false, scrim: true, classes: "dark-background-flat white-text", style: "width: 80%;", components: [
			{name: "sendMessage", content: "Sending submission"},
			{name: "sendProgress", kind: onyx.ProgressBar, animateBars: true, progress: 0, barClasses: "color-progress"}
		]},
		{name: "acc", kind: "enyo.Scroller", layoutKind: enyo.FittableRowsLayout, vertical: "auto", horizontal: "hidden", fit: true, strategyKind: "TouchScrollStrategy"},
		{name: "buttons", kind: enyo.ToolDecorator, classes: "senseButtons", components: [
			{name: "remove", kind: onyx.Button, classes: "button-style button-style-negative", ontap: "togglePopup", components: [
				{tag: "i", classes: "icon-ban-circle icon-large"}
			]},
			{name: "submit", kind: onyx.Button, classes: "button-style button-style-affirmative", ontap: "togglePopup", components: [
				{tag: "i", classes: "icon-ok icon-large"}
			]}
		]}
	],
	create: function(a, b) {
		this.inherited(arguments);
		this.setTaskData(this.data);
		this.render();
		this.counterName = "";
	},
    recreate: function() {
	this.log(this.$.formDiv);
	this.setTaskData(this.data);
		this.imageOK = true; //fix this later
            this.$.formDiv.createComponent(
                {name: "qbody", fit: true}
            );
    },
    rendered: function(inSender, inEvent) {
        this.inherited(arguments);
        this.resized();
        this.reflow();
    },
	saveLocation: function(inSender, inEvent) {
		this.coords = inEvent.coords;
	},	
    chosenLocation: function(a, b) {
        this.chosen_location = b;
    },
    photoData: function(a, b) {
        LocalStorage.set("image", JSON.stringify(b));
    },
    renderSubmitButton: function(a, b) {
        this.$.submit.setDisabled(!1);
    },
    openNext: function() {
        return !this.complex, !0;
    },
    photoOk: function() {
        return this.log(), !0;
    },
    setTaskData: function(a) {
        this.task = a.tasks[0];
        this.campTitle = a.title;
        questionBody = [];

		var counter = -1;
        for (var i in this.task.questions) {
            var b = this.task.questions[i];
			var c = "name_" + b.id;
            var type = b.type;
            if (type.indexOf("complex") != -1) {
                type = "counter";
                var d = type.search(/\d/);
				var e = 0;
                if (d != -1) 
					e = type.charAt(d);
            }
			counter = this.makeQuestion(type, b, i);
        }
		this.render();
		if(counter > -1) {
			var data = this.task.questions[counter];
			this.newFormCounter(data);
		}
		this.render();
		this.resized();
	},
	makeQuestion: function(type, question, index) {
		var counter = -1;
		var name = "name_" + question.id;
		switch (type) {
			case "text":
				this.$.acc.createComponent({name: name, style: "clear: both;", content: question.question});
				this.newFormText(question);
				break;
			case "exclusive_multiple_choice":
				this.$.acc.createComponent({name: name, style: "clear: both;", content: question.question});
				this.newFormExclusiveChoice(question);
				break;
			case "multiple_choice":
				this.$.acc.createComponent({name: name, style: "clear: both;", content: question.question});
				this.newFormMultipleChoice(question);
				break;
			case "counter":
				counter = index;
				break;
			case "cur_time":
				this.newTime(question);
				break;
			case "media_camera":
				case "media_audio":
				case "media_video":
				this.newMediaReading(question);
				break;
			default:
				break;
		}

		return counter;
	},	
	fileEntry: function(a) {
		window.resolveLocalFileSystemURI(a, this.getImageData, null);
    },
    getImageData: function(a) {
        read = new FileReader();
		console.log(a);
		read.onloadend = function(a) {
            console.log(a.target.result);
        };
        var b = read.readAsDataURL(a);
        console.log(b);
    },
	buildAndSendSubmission: function() {
		this.$.sendingPopup.setShowing(true);
		this.log("A");
		if (!this.$.submit.disabled) {
			this.log("B");
			var sub = {submission: {
				task_id: this.task.id,
				gps_location: "testy test",
				user_id: 5,
				img_path: "test",
				answers: []
				}
			};
			this.log(this.gps);
			var gps_location = this.gps.coords;
			this.log(gps_location);
			var coords = gps_location.latitude + "|" + gps_location.longitude;
			sub.submission.gps_location = coords;
			sub.submission.user_id = LocalStorage.get("user").uid;

			for (var i in this.task.questions) {
				this.log("C");
				var question = this.task.questions[i];
				type = question.type;
				if (type.indexOf("complex") != -1) {
					type = "counter";
					var d = type.search(/\d/);
					var e = 0;
					if (d != -1)
						e = type.charAt(d);
					if (e != questionBody.length && this.complex) var f = "qs" + (e + 1);
				}
				var tmp = sub.submission.answers.concat(this.buildAnswer(type, question));
				sub.submission.answers = tmp;
			}
			this.log("D");
			this.log("SENDING TO SERVER: " + JSON.stringify(sub));
			var url = Data.getURL() + "submission.json"; 
			var ajax = new enyo.Ajax({
				contentType: "application/json",
				method: "POST",
				url: url,
				postBody: JSON.stringify(sub),
				cacheBust: false,
				handleAs: "json"
			});
			ajax.response(this, "handlePostResponse");
			ajax.go();
		}
	},
	buildAnswer: function(type, question) {
		var out = [];
		var ans = {
			answer: "BOOM",
			answer_type: question.type,
			q_id: question.id,
			sub_id: 0
		};
		switch (type) {
			case "text":
				ans.answer = this.readFormText(question);
				out.push(ans);
				break;
			case "exclusive_multiple_choice":
				ans.answer = this.readFormExclusiveChoice(question);
				out.push(ans);
				break;
			case "multiple_choice":
				ans.answer = this.readFormMultipleChoice(question);
				out.push(ans);
				break;
			case "counter":
				//var tmp = this.readFormCounter(c);
				var array = this.readFormCounter(question).split("|");
				for (var x in array) {
					var tmpAns = {
						answer: "BOOM",
						type: question.type,
						q_id: question.id,
						sub_id: 0
					};
					var again = array[x].split(",");
					again.splice(0,1);
					var date = new Date();
					date.setTime(again[0]);
					again[0]=date;
					tmpAns.answer=again.join(",");
					out.push(ans);
				}
				break;
			case "cur_time":
				ans.answer = this.readTime(question);
				out.push(ans);
				break;
			default:
				break;
		}

		return out;
	},	
	handlePostResponse: function(a, b) {
		this.log("SERVER RESPONSE CAME BACK");
		if(a.xhr.status === 200) {
		}
		var submission = a.xhr.responseText;
		var tmpComp = this.$.acc.getComponents();
		this.files = 0;
		for(var x in tmpComp) {
			if(tmpComp[x].kind === "MediaSensor")
				this.files++;
		}
		this.progressInterval = 100/(this.files+1);
		this.$.sendProgress.animateProgressTo(this.progressInterval);
		this.waterfallDown("onSendFiles", {sub_id: submission.sub_id, questions: this.task.questions});
		this.chosen_location = undefined;
	},
	downCount: function(inSender, inEvent) {
		var tmpComp = this.$.acc.getComponents();
		var count = 0;
		for(var x in tmpComp) {
			if(tmpComp[x].kind === "MediaSensor")
				if(tmpComp[x].completed)
					count++;
		}
		this.$.sendProgress.animateProgressTo((count+1)*this.progressInterval);
		if(count === this.files) {
			this.$.sendingPopup.setShowing(false);
			this.bubble("onSubmissionMade");
		}

		return true;
	},
	togglePopup: function(inSender, inEvent) {
		var showing = this.$.doubleCheckPopup.getShowing();
		var incoming = inSender.content;
		if(inSender.name === "submit") {
			this.$.doubleCheckPopup.submit = true;
			this.$.doubleCheckMessage.setContent("Are you sure you want to submit your observation to the server?");
		} else {
			this.$.doubleCheckPopup.submit = false;
			this.$.doubleCheckMessage.setContent("Are you sure you want to cancel? You will lose all observation data recorded");
		}
		this.$.doubleCheckPopup.setShowing(!showing);
	},
	close: function(inSender, inEvent) {
		this.$.doubleCheckPopup.hide();
		if(this.$.doubleCheckPopup.submit) {
			if(inSender.name === "yes") {
				if(this.$.doubleCheckPopup.submit) {
						this.buildAndSendSubmission();
				}
			}
		} else 
			this.bubble("onSubmissionMade");
		return true;
	},
	testButtons: function(inSender, inEvent) {
		var controls = this.$.groupbox.getControls();
		var inName = a.getContent();
		var bike = true;
		var ped = true;
		if(inName === "Bicycles") {
			bike = true;
			ped = false;
		} else if (inName === "Pedestrians") {
			bike = false;
			ped = true;
		}  else if (inName === "Both") {
			ped = true;
			bike = true;
		}

		for (var i in controls) {
			var num = controls[i].name.split("_")[1];
			this.$["checkbox_"+num].setDisabled(false);
			if(controls[i].getContent() === "Helmet" && !bike)
				this.$["checkbox_"+num].setDisabled(true);
			else if(controls[i].getContent() === "Assistive" && !ped)
				this.$["checkbox_"+num].setDisabled(true);
		}
		enyo.Signals.send("onButtonGroupChosen", inSender);
	},
	newFormText: function(input) {
		var decName = "inputDec_" + input.id;
		var inputName = "input_" + input.id;
		this.$.acc.createComponent({name: decName, style: "clear: both;", kind: "onyx.InputDecorator", classes: "onyx-input-decorator center", components: [
								   {name: inputName, kind: "onyx.Input", classes: "onyx-input" }
		]}, {owner: this});
	},
	newFormExclusiveChoice: function(input) {
		var name = "input_" + input.id;
		options = input.options.split("|");
		array = [];
		for (var i in options) { 
			if(i === 0)
				array.push({content: options[i], active: !0, classes: "dark-background-flat", ontap: "testButtons"});
			else
				array.push({content: options[i], classes: "dark-background-flat", ontap: "testButtons"});
		}
		this.$.acc.createComponent({name: name, kind: onyx.RadioGroup, classes: "center nice-padding", components: array}, {owner: this});
	},
	newTime: function(input) {
		var date = new Date();
		timeStr = date.toTimeString().split(" ")[0];
		name = "time_" + input.id;
		this.$.acc.createComponent({content: input.question});
		this.$.acc.createComponent({name: name, content: timeStr, classes: "center", time: date.toTimeString()});
	},
	newFormMultipleChoice: function(input) {
		var options = input.options.split("|");
		this.$.acc.createComponent({name: "groupbox", classes: "center", style: "clear: both;", kind: enyo.ToolDecorator, components: []}, {owner: this});
		for (var i in options) {
			var checkName = "checkbox_" + i;
			var contName = "content_" + i;
			this.$.groupbox.createComponent({name: checkName, kind: "onyx.Checkbox", onchange: "testButtons"}, {owner: this});
			this.$.groupbox.createComponent({name: contName, content: options[i]}, {owner: this});
		}
	},
	newFormCounter: function(input) {
		var name = "name_" + input.id;
		var countName = "counter_" + input.id;
		var qID;
		for (var x in this.task.questions) {
			if (this.task.questions[x].type === "exclusive_multiple_choice") {
				qID = this.task.questions[x].id.toString();
				break;
			}
		}
		var inputName = "input_" + qID;
		var test = document.body.clientHeight - 57 - 32;
		//this.log(this.$.buttons.node.clientHeight);
		this.$.acc.createComponent({/*name: countName, */kind: "BikeCounter", style: "height: " + test + "px; width: 100%;"}, {owner: this}); 
		this.counterName = countName;
	},
	newMediaReading: function(input) {
		var name = "sensor_" + input.id;
		var type = input.type.split("_")[1];
		this.$.acc.createComponent({name: name, kind: "MediaSensor", type: type, sendAutomatically: false});
	},
	readFormText: function(input) {
		var name = "input_" + input.id;
		return this.$[name].getValue();
	},
	readFormExclusiveChoice: function(input) {
		var name = "input_" + input.id;
		var kids = this.$[name].children;
		for (var x in kids) 
			if (kids[x].hasClass("active")) 
				return kids[x].getContent();
	},
	readFormMultipleChoice: function(input) {
		var arr = [];
		for (var i in input.options.split("|")) {
			var check = "checkbox_" + i;
			var cont = "content_" + i;
			if(this.$[check].getValue)
				arr.push(questionBody[0].$.groupbox.$[cont].getContent());
		}
		return arr.join("|");
	},
	readFormCounter: function(input) {
		var out = this.$.bikeCounter.getData();
        this.log(out);

        return out.join("|");
    },
    readTime: function(input) {
        var time = "time_" + input.id;
		var ret = this.$.acc.$[time].time;
		return ret;
	},
	jumpToCounter: function(inSender, inEvent) {
		this.$.acc.scrollToControl(this.$.bikeCounter);
	}
});
