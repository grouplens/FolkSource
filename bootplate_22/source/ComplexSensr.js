enyo.kind({
	name: "ComplexSensr",
	//style: "background-color: #254048; color: white; border-color: white;",
	//style: "background: #DDFFDD;",
	classes: "light-background",
	kind: enyo.FittableRows,
	published: {
			data: ""
	},
	events: {
		onSubmisisonMade: "",
		on2DrawerClick: "",
		onRenderScroller: "",
	},
	handlers: {
		onSenseOpened: "openNext",
		onPhotoOk: "photoOk",
		onDeviceReady: "setReady",
		//onGPSSet: "currentLocation",
		onRenderDrawer: "renderDrawer2",
		onTimerStarted: "jumpToCounter"
	},
	components: [
		{kind: "enyo.Signals", onGPSSet: "currentLocation", onPinClicked: "chosenLocation", onPhotoData: "photoData", onButtonGroupChosen: "renderSubmitButton"},
		{name: "doubleCheckPopup", kind: onyx.Popup, autoDismiss: false, centered: true, floating: true, modal: true, scrimWhenModal: false, scrim: true, classes: "light-background", style: "width: 80%;", components: [
			{name: "doubleCheckMessage", content: "Are you sure you want to cancel? You will lose all observation data recorded", style: "padding: 5px 0px;"},
			{kind: enyo.ToolDecorator, classes: "senseButtons", components: [
				{name: "no", kind: onyx.Button, classes: "button-style nice-padding button-style-negative", content: "No", ontap: "close"},
				{name: "yes", kind: onyx.Button, classes: "button-style nice-padding button-style-affirmative", content: "Yes", ontap: "close"}
			]}
		]},
		{name: "acc", kind: "enyo.Scroller", layoutKind: enyo.FittableRowsLayout, vertical: "auto", horizontal: "hidden", fit: true, strategyKind: "TouchScrollStrategy"/*, classes: "nice-padding"*/},
		{name: "buttons", kind: enyo.ToolDecorator, classes: "senseButtons", components: [
			{kind: onyx.Button, classes: "button-style button-style-negative", content: "Cancel", ontap: "togglePopup"},
			{name: "submit", kind: onyx.Button, classes: "button-style button-style-affirmative", content: "Submit", ontap: "togglePopup"}
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
                {name: "qbody", fit: true, components: [
			//THIS NEEDS TO BE A TYPE OF QUESTION
                    /*{name: "imgDiv",classes: "imgDiv",components: [
                        {name: "photoButton",kind: "onyx.Button",content: "Take Photo",style: "width: 100%;",ontap: "retakePhoto",classes: "onyx-affirmative"}
                    ]}*/
                ]}
            );
    },
    rendered: function(inSender, inEvent) {
        this.inherited(arguments);
        this.resized();
        this.reflow();
    },
    currentLocation: function() {
    //currentLocation: function(inSender, inEvent) {
        /*this.log(inEvent);
        this.gps_location = inEvent.prop;
        this.log(this.gps_location);*/
    },
    chosenLocation: function(a, b) {
        this.chosen_location = b;
    },
    photoData: function(a, b) {
        LocalStorage.set("image", JSON.stringify(b));
    },
    takePhoto: function() {
        this.log();
        var a = this.$, b = {
            quality: 25,
            destinationType: Camera.DestinationType.FILE_URI,
            EncodingType: Camera.EncodingType.JPEG
        };
        navigator.camera.getPicture(enyo.bind(a, this.onPhotoSuccess), enyo.bind(a, this.onPhotoFail), b);
    },
    onPhotoSuccess: function(a) {
        var b = a;
        this.$.formDiv.$.qbody.$.imgDiv.createComponent({
            name: "myImage",
            kind: "enyo.Image",
            src: "./assets/leaf-2.jpg"
        });
		this.$.formDiv.$.qbody.$.imgDiv.render();
		this.$.submit.setDisabled(false);
		this.camComplete = true;
		enyo.Signals.send("onPhotoData", a);
    },
    renderSubmitButton: function(a, b) {
        this.$.submit.setDisabled(!1);
    },
    onPhotoFail: function(a) {
        console.log(a);
    },
    retakePhoto: function() {
        !this.complex && this.$.formDiv.$.qbody.$.imgDiv.getComponents().length > 0 && this.$.formDiv.$.qbody.$.imgDiv.destroyComponents(), this.onPhotoSuccess();
    },
    viewChanged: function(a, b) {
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
        /*if(this.$.formDiv != undefined && this.$.formDiv.getComponents().length > 0 ) {
            this.$.acc.destroyClientControls();
            this.$.acc.destroyComponents();
		//this.recreate();
        }*/
        /*if(this.complex)
            questionBody.push(this.$.accordionItemContent);
        else {
		this.log(this.$);
            questionBody.push(this.$.formDiv.$.qbody);
	}*/

		var counter = -1;
        for (i in this.task.questions) {
            var b = this.task.questions[i], c = "name_" + b.id;
            type = b.type;
            if (type.indexOf("complex") != -1) {
                type = "counter";
                var d = type.search(/\d/), e = 0;
                if (d != -1) var e = type.charAt(d);
            }
            switch (type) {
                case "text":
					this.$.acc.createComponent({name: c, style: "clear: both;", content: b.question});
					this.newFormText(b);
                break;
                case "exclusive_multiple_choice":
					this.$.acc.createComponent({name: c, style: "clear: both;", content: b.question});
					this.newFormExclusiveChoice(b);
                break;
				case "multiple_choice":
					this.$.acc.createComponent({name: c, style: "clear: both;", content: b.question});
					this.newFormMultipleChoice(b);
                break;
                case "counter":
					counter = i;
                break;
                case "cur_time":
					this.newTime(b);
                break;
                default:
            }
        }
		this.render();
		if(counter > -1) {
			var data = this.task.questions[counter];
			this.newFormCounter(data)
		}
		this.render();
		this.resized();
	},
	fileEntry: function(a) {
		window.resolveLocalFileSystemURI(a, this.getImageData, null);
    },
    getImageData: function(a) {
        read = new FileReader, console.log(a), read.onloadend = function(a) {
            console.log(a.target.result);
        };
        var b = read.readAsDataURL(a);
        console.log(b);
    },
    makeImageSend: function(a, b) {
        var c = btoa(this.utf8_encode(b));
        this.$.senses.createComponent({
            kind: "enyo.Image",
            src: "data:image/jpeg;base64," + c
        });
        //this.render();
        var d = "image?", e = new Date, f = (e.getMonth() + 1).toString();
        while (f.length < 2) f = "0" + f;
        var g = e.getDate().toString();
        while (g.length < 2) g = "0" + g;
        var h = e.getFullYear().toString() + f.toString() + g.toString() + "_" + e.getHours().toString() + e.getMinutes().toString() + e.getSeconds().toString();
        d += "userName=" + Data.getUserName(LocalStorage.get("user")) + "&", d += "imageFileName=" + this.campTitle.replace(/ /g, "%20") + "_" + h + ".jpg&";

        var i = Data.getURL() + d, j = new enyo.Ajax({method: "POST", url: i, contentType: "image/jpeg"});
        j.response(this, "imageSubmission");
    },
	buildAndSendSubmission: function() {
		if (!this.$.submit.disabled) {
			//this.complex || this.fileEntry(this.$.imgDiv.$.myImage.src);
			//this.log(this.imageOK ? !this.complex : this.complex);
			//if (this.imageOK ? !this.complex : this.complex) {
				var a = {submission: {
					task_id: this.task.id,
					gps_location: "testy test",
					user_id: 5,
					img_path: "test",
					answers: []
				}
				};
				var gps_location = Data.getLocationData();
				var b = gps_location.latitude + "|" + gps_location.longitude;
				a.submission.gps_location = b;
				a.submission.user_id = LocalStorage.get("user");

				for (i in this.task.questions) {
					var c = this.task.questions[i];
					type = c.type;
					if (type.indexOf("complex") != -1) {
						type = "counter";
						var d = type.search(/\d/), e = 0;
						if (d != -1) var e = type.charAt(d);
						if (e != questionBody.length && this.complex) var f = "qs" + (e + 1);
					}
					var g = {
						answer: "BOOM",
						type: c.type,
						q_id: c.id,
						sub_id: 0
					};
					switch (type) {
						case "text":
							g.answer = this.readFormText(c);
							a.submission.answers.push(g);
						break;
						case "exclusive_multiple_choice":
							g.answer = this.readFormExclusiveChoice(c);
							a.submission.answers.push(g);
						break;
						case "multiple_choice":
							g.answer = this.readFormMultipleChoice(c);
							a.submission.answers.push(g);
						break;
						case "counter":
							//var tmp = this.readFormCounter(c);
							var array = this.readFormCounter(c).split("|");
							for (x in array) {
								var ans = {
									answer: "BOOM",
									type: c.type,
									q_id: c.id,
									sub_id: 0
								}
								var again = array[x].split(",");
								again.splice(0,1);
								this.log(again[0]);
								var date = new Date()
								date.setTime(again[0]);
								this.log(date);
								again[0]=date;
								ans.answer=again.join(",");
								a.submission.answers.push(ans);
							}
							break;
							case "cur_time":
								g.answer = this.readTime(c);
								a.submission.answers.push(g);
							break;
							default:
								continue;
					}
				}
				this.log("SENDING TO SERVER: " + JSON.stringify(a));
				/*var h = Data.getURL() + "submission.json", j = new enyo.Ajax({
					contentType: "application/json",
					method: "POST",
					url: h,
					postBody: JSON.stringify(a),
					//cacheBust: !1,
					handleAs: "json"
				});
				j.response(this, "handlePostResponse"), j.go();*/
			//}
		}
	},
	handlePostResponse: function(a, b) {
		this.log("SERVER RESPONSE CAME BACK");
		this.log(JSON.stringify(a.xhr.responseText));
		//this.bubble("onSubmissionMade");
		this.camComplete = !1;
		this.$.submit.setDisabled(!0);
		this.chosen_location = undefined;
		LocalStorage.remove("image");
		this.imageOK = !1;
		if(!this.complex && this.$.imgDiv.getComponents().length > 0)
			this.$.imgDiv.destroyComponents();
	},
	imageSubmission: function(a, b) {
		this.log(JSON.stringify(a)), this.log(JSON.stringify(b));
	},
	togglePopup: function(inSender, inEvent) {
		var showing = this.$.doubleCheckPopup.getShowing();
		var incoming = inSender.content;
		if(inSender.getContent() === "Submit") {
			this.$.doubleCheckPopup.submit = true;
			this.$.doubleCheckMessage.setContent("Are you sure you want to submit your observation to the server?");
		}
		this.$.doubleCheckPopup.setShowing(!showing);
	},
	close: function(inSender, inEvent) {
		this.$.doubleCheckPopup.hide();
		if(inSender.getContent() === "Yes") {
			if(this.$.doubleCheckPopup.submit)
				this.buildAndSendSubmission();
			this.bubble("onSubmissionMade");
		}
		return true;
	},
	testButtons: function(a, b) {
		var controls = this.$.groupbox.getControls();
		var inName = a.getContent();
		var b = true;
		var p = true;
		if(inName === "Bicycles") {
			b = true;
			p = false;
		} else if (inName === "Pedestrians") {
			b = false;
			p = true;
		}  else if (inName === "Both") {
			p = true;
			b = true;
		}

		for (var i in controls) {
			var num = controls[i].name.split("_")[1];
			this.$["checkbox_"+num].setDisabled(false);
			if(controls[i].getContent() === "Helmet" && !b)
				this.$["checkbox_"+num].setDisabled(true);
			else if(controls[i].getContent() === "Assistive" && !p)
				this.$["checkbox_"+num].setDisabled(true);
		}
		enyo.Signals.send("onButtonGroupChosen", a);
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
			if(i == 0)
				array.push({content: options[i], active: !0, classes: "button-style nice-padding", ontap: "testButtons"})
			else
				array.push({content: options[i], classes: "button-style nice-padding", ontap: "testButtons"});
		}
		this.$.acc.createComponent({name: name, kind: onyx.RadioGroup, classes: "center", components: array}, {owner: this});
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
		for (i in options) {
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
		for (x in this.task.questions) {
			if (this.task.questions[x].type === "exclusive_multiple_choice") {
				var qID = this.task.questions[x].id.toString();
				break;
			}
		}
		var inputName = "input_" + qID;
		var test = document.body.clientHeight - 57 - 32;
		//this.log(this.$.buttons.node.clientHeight);
		this.$.acc.createComponent({/*name: countName, */kind: "BikeCounter", style: "height: " + test + "px; width: 100%;"}, {owner: this}); 
		this.counterName = countName;
	},
	readFormText: function(input) {
		var name = "input_" + input.id;
		return this.$[name].getValue();
	},
	readFormExclusiveChoice: function(a) {
		var b = "input_" + a.id, c = this.$[b].children;
		for (x in c) if (c[x].hasClass("active")) return c[x].getContent();
	},
	readFormMultipleChoice: function(a) {
		var b = [];
		for (i in a.options.split("|")) {
			var c = "checkbox_" + i, d = "content_" + i;
			this.$[c].getValue() && b.push(questionBody[0].$.groupbox.$[d].getContent());
		}
		return b.join("|");
	},
	readFormCounter: function(a) {
		var out;
		/*c = "counter_" + a.id;
		this.log(this.$.acc.$[c]);
		for (var d in this.$.acc.children) {
			var e = this.$.acc.children[d].$[c];
			this.log(e);
			if (e === undefined) continue;*/
		   this.log(this.counterName);
            out = this.$.bikeCounter.getData();
        //}
        this.log(out);

        return out.join("|");
    },
    readTime: function(a) {
        var b = "time_" + a.id;
		var ret = this.$.acc.$[b].time;
		//var ret = questionBody[0].$[b].time;
		return ret;
	},
	jumpToCounter: function(inSender, inEvent) {
		this.$.acc.scrollToControl(this.$.bikeCounter);
	}
});
