enyo.kind({
    name: "CSenseLoginRegister",
    classes: "background",
	kind: enyo.FittableRows,
    published: {
        register: !1
    },
    events: {
		onLoggedIn: ""
	},
    components: [
		{name: "gbox", kind: enyo.FittableRows, fit: true, style: "margin-left: auto; margin-right: auto; border: 0px; max-width: 90%;", components: [
			{name: "rbox", kind: "onyx.RadioGroup", style: "text-align: center;", classes: "nice-padding", onActivate: "changePanels", components: [
				{content: "Login", active: !0, classes: "light-background", ontap: "setupLogin"}, 
				{content: "Register", classes: "light-background", ontap: "setupRegister"}
			]}, 
			{name: "login", showing: true, kind: enyo.FittableRows, components: [
				{kind: onyx.InputDecorator, alwaysLooksFocused: true, classes: "nice-margin", style: "width: 100%;", components: [
					{name: "usernameLogin", kind: enyo.Input, placeholder: "Username", type: "text", style: "width: 100%;", attributes: {autocorrect: "off", autocaptialize: "none"}, onkeyup: "checkFields" },
				]},
				{kind: onyx.InputDecorator, alwaysLooksFocused: true, classes: "nice-margin", style: "width: 100%;", components: [
					{name: "passwordLogin", kind: enyo.Input, placeholder: "Password", type: "password", style: "width: 100%;", onkeyup: "checkFields" }
				]},
			]},
			{name: "register", showing: false, kind: enyo.FittableRows, components: [
				{kind: onyx.InputDecorator, style: "width: 100%;", alwaysLooksFocused: true, classes: "nice-margin", components: [
					{name: "emailRegister", kind: enyo.Input, placeholder: "E-Mail", type: "email", style: "width: 100%;", onkeyup: "emailRegexCheck" }
				]},
				{kind: onyx.InputDecorator, style: "width: 100%;", alwaysLooksFocused: true, classes: "nice-margin", components: [
					{name: "usernameRegister", kind: enyo.Input, placeholder: "Username", type: "text", attributes: {autocorrect: "off", autocaptialize: "none"}, style: "width: 100%;", onkeyup: "checkFields" }
				]},
				{kind: onyx.InputDecorator, style: "width: 100%;", alwaysLooksFocused: true, classes: "nice-margin", components: [
					{name: "passwordRegister", kind: enyo.Input, placeholder: "Password", type: "password", style: "width: 100%;", onkeyup: "checkFields" }
				]},
			]},
			{name: "logButton", kind: onyx.Button, content: "Login", disabled: true, classes: "light-background nice-margin", ontap: "buildURL", style: "width: 100%;"},
			{kind: enyo.ToolDecorator, classes: "niceish-padding", components: [
				{kind: onyx.ToggleButton, onContent: "Yes", offContent: "No", value: true, onchange: "setRemember"},
				{name: "text", content: "Remember Me", style: "margin-left: 3px; margin-right: 3px;"},
			]},
	]},
	],
    create: function () {
        this.inherited(arguments);

		if(this.register) {
			this.$.login.setShowing(false);
			this.$.register.setShowing(true);
				this.$.logButton.setContent("Register");
				this.$.logButton.render();
		}
    },
	changePanels: function(inSender, inEvent) {
		var text = inEvent.originator.getContent();
		if(inEvent.originator.getActive()) {
			if(text === "Login") {
				this.register = false;
				this.$.login.setShowing(true);
				this.$.register.setShowing(false);
				this.$.logButton.setContent("Login");
				this.$.logButton.render();
			}
			if(text === "Register") {
				this.register = true;
				this.$.login.setShowing(false);
				this.$.register.setShowing(true);
				this.$.logButton.setContent("Register");
				this.$.logButton.render();
			}
		}
	},	
    buildURL: function () {
        this.log();
        if (this.checkFields()) {
            this.$.logButton.setDisabled(!1);
			var tmp = {};
			var ajax;
			serverURL = Data.getURL() + "user";
			if(this.register) {
				tmp.name = this.$.usernameRegister.getValue();
				tmp.password = this.$.passwordRegister.getValue();
				tmp.email = this.$.emailRegister.getValue();
				ajax = new enyo.Ajax({url: serverURL, method: "POST", postBody: JSON.stringify(tmp), cacheBust: false});
			} else {
				var auth = "Basic " + window.btoa(this.$.usernameLogin.getValue() + ":" + this.$.passwordLogin.getValue());
				this.log(auth);
				ajax = new enyo.Ajax({url: serverURL + "/"+this.$.usernameLogin.getValue()+"/token", method: "GET", headers: {Authorization: auth}, cacheBust: false});
			}
			ajax.response(this, "handleResponse");
			ajax.go();
            /*var a = "login?";
			if(this.register) {
				a = "user?";
				a += "email=" + this.$.email.getValue() + "&";
			}
			a += "name=" + this.$.username.getValue() + "&";
			a += "password=" + this.$.password.getValue();
            var b = (new enyo.Ajax({
                method: "POST",
                url: Data.getURL() + a,
				//headers: {"Cache-Control": "no-cache"},
				cacheBust: true,
                handleAs: "text"
            })).go().response(this, "handleResponse");*/
        }
    },
    handleResponse: function (inSender, inEvent) {
		this.log(inSender);
		this.log(inEvent);
		/*this.log(a.xhr);
        if (a.xhr.status === 200) {
			var incoming = JSON.parse(a.xhr.responseText);
			this.log(incoming.points);
			this.log(incoming.uid);
			this.doLoggedIn({user: incoming});
			if(this.$.memoryBox.getValue()) {
				LocalStorage.set("user", incoming);
				LocalStorage.set("points", incoming.points.toString());
				LocalStorage.set("user", incoming.uid.toString());
			}
			this.bubble("onSuccessCode");
		} else {
			this.log(JSON.stringify(a));
			this.log(a.xhr.status);
			this.log("BOOO");
			this.doFailureCode();
		}*/
    },
    emailRegexCheck: function () {
        var a = /^\w+([\.\+]\w+)*@\w+(\.\w+)*(\.\w{2,})$/;
        return a.test(this.$.emailRegister.getValue()) ? (this.$.emailRegister.applyStyle("color", "black"), !0) : (this.$.emailRegister.applyStyle("color", "red"), !1);
    },
    checkUsernameRegisterExists: function () {
		if(this.$.usernameRegister.getValue() === "")
			return false;
		
		this.log("user reg");
		return true;
    },
    checkPasswordRegisterExists: function () {
		if(this.$.passwordRegister.getValue() === "")
			return false;
		
		this.log("pass reg");
		return true;
    },
    checkUsernameLoginExists: function () {
		if(this.$.usernameLogin.getValue() === "")
			return false;
		
		this.log("user log");
		return true;
    },
    checkPasswordLoginExists: function () {
		if(this.$.passwordLogin.getValue() === "")
			return false;
		
		this.log("pass log");
		return true;
    },
    checkFields: function () {
		if(this.register) {
			if(this.checkUsernameRegisterExists() && this.checkPasswordRegisterExists() && this.emailRegexCheck()) {
				this.$.logButton.setDisabled(false);
				return true;
			}
		} else {
			if(this.checkUsernameLoginExists() && this.checkPasswordLoginExists()) {
				this.$.logButton.setDisabled(false);
				return true;
			}
		}
		this.$.logButton.setDisabled(true);
		return false;
        //if (this.checkUsernameExists() && this.checkPasswordExists()) return this.register && this.emailRegexCheck ? (this.$.logButton.setDisabled(!1), !0) : (this.$.logButton.setDisabled(!1), !0);
        //return !1;
    },
	setRemember: function(inSender, inEvent) {
		this.remember = inEvent.originator.value;
	}
});
