enyo.kind({
	name: "CSenseLoginRegister",
	classes: "background",
	published: {
		register: false
	},
    events: [

    ],
	components: [
        {name: "rbox", kind: "onyx.RadioGroup", style: "width: 100%;", components: [
            {kind: "rLogButton", kind: "onyx.RadioButton", content: "Login", active: true, classes: "onyx-radiobutton", ontap: "setupLogin"},
            {kind: "rRegButton", kind: "onyx.RadioButton", content: "Register", classes: "onyx-radiobutton", ontap: "setupRegister"}
    ]},
		{name: "gbox", kind: "onyx.Groupbox", components: [
		]},
        {name: "memoryBox", kind: "onyx.Checkbox", style: "clear: left; float: left;", ontap: "remember"},
        {name: "text", content: "Remember Me", style: "float: left;"}
	],
	create: function() {
		this.inherited(arguments);
        if(this.register) {
            this.$.radioButton.setActive(false);
            this.$.radioButton2.setActive(true);
            this.setupRegister();
        } else {
            this.setupLogin();
        }
	},
    rendered: function() {
        this.inherited(arguments);
    },
    setupLogin: function() {
        this.register = false;
        this.$.gbox.destroyClientControls();
        this.$.gbox.createComponent(
			{name: "gboxhead", kind: "onyx.GroupboxHeader", content: "Login"},
            {owner: this});
        this.$.gbox.createComponent(
			{name: "gboxcomp", components: [
				{name: "userdec", kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [
					{name: "username", kind: "onyx.Input", placeholder: "Username", defaultFocus: true, type: "email", style: "width: 100%;", classes: "onyx-input", onkeyup: "checkFields"}
				]},
				{name: "passdec", kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [
					{name: "password", kind: "onyx.Input", placeholder: "Password", type: "password", style: "width: 100%;", classes: "onyx-input", onkeyup: "checkFields"}
				]},
				{name: "logButton", kind: "onyx.Button", content: "Login", style: "clear: both;", ontap: "buildURL"}
			]},
            {owner: this});
        this.$.gbox.render();
    },
    setupRegister: function() {
        this.register = true;
        this.$.gbox.destroyClientControls();
        this.$.gbox.createComponent(
			{name: "gboxhead", kind: "onyx.GroupboxHeader", content: "Register"},
            {owner: this});
        this.$.gbox.createComponent(
			{name: "gboxcomp", components: [
				{name: "emaildec", kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [
					{name: "email", kind: "onyx.Input", placeholder: "E-Mail", defaultFocus: true, style: "width: 100%;", classes: "onyx-input", onkeyup: "emailRegexCheck"}
				]},
				{name: "userdec", kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [
					{name: "username", kind: "onyx.Input", placeholder: "Username", type: "email", style: "width: 100%;", classes: "onyx-input", onkeyup: "checkFields"}
				]},
				{name: "passdec", kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [
					{name: "password", kind: "onyx.Input", placeholder: "Password", type: "password", style: "width: 100%;", classes: "onyx-input", onkeyup: "checkFields"}
				]},
				{name: "logButton", kind: "onyx.Button", content: "Register", disabled: true, style: "clear: both;", ontap: "buildURL"}
			]},
            {owner: this});
        this.$.gbox.render();
    },
	buildURL: function() {
        this.log();
		if(this.checkFields()) {
			this.$.logButton.setDisabled(false);
			var params = "login?";
			//flip the check, because URL building is weird
			if(this.register) {
				params = "user?";
				params += "email="+this.$.email.getValue()+"&";
			}
			params += "name="+this.$.username.getValue()+"&";
			params += "password="+this.$.password.getValue();
			var call = new enyo.Ajax({method: "POST", url: "http://ugly.cs.umn.edu:8080/csense/"+params, handleAs: "text"}).go().response(this, "handleResponse");
		}
	},
	handleResponse: function(asyncObject, value) {
		if(asyncObject.xhr.status === 200) {
            this.log("WEEE");
			var points = asyncObject.xhr.getResponseHeader("points");
			var uid = asyncObject.xhr.getResponseHeader("uid");
                LocalStorage.set("points", points);
                LocalStorage.set("user", uid);
            if(this.$.memoryBox.getValue()) {
                LocalStorage.set("remember", true);
            }
            //this.doSuccessCode();
            this.bubble("onSuccessCode");
		} else {
            this.log("BOOO");
            this.doFailureCode();
        }
	},
	emailRegexCheck: function() {
		var regex = /^\w+([\.\+]\w+)*@\w+(\.\w+)*(\.\w{2,})$/;
		if(!regex.test(this.$.email.getValue())) {
			this.$.email.applyStyle("color", "red");
			return false;
		} else {
			this.$.email.applyStyle("color", "black");
			return true;
		}
	},
	checkUsernameExists: function() {
		if(this.$.username.getValue() === '') {
			return false;
		}
		return true;
	},
	checkPasswordExists: function() {
		if(this.$.password.getValue() === '') {
			return false;
		}
		return true;
	},
	checkFields: function() {
		if(this.checkUsernameExists() && this.checkPasswordExists()) {
			if(this.register) {
				if(this.emailRegexCheck) {
					this.$.logButton.setDisabled(false);
					return true;
				}
			}
			this.$.logButton.setDisabled(false);
			return true;
		}
		return false;
	}
	});
