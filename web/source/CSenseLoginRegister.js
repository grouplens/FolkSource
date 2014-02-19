enyo.kind({
    name: "CSenseLoginRegister",
    classes: "light-background nice-padding",
	kind: onyx.Popup,
    published: {
        register: !1,
		autoDismiss: false,
		centered: true,
		floating: true,
		modal: true,
		scrimWhenModal: false,
		scrim: true,
	},
    events: {
		onAnonymousCode: "",
		onSuccessCode: "",
		onFailureCode: ""
	},
    components: [
		{name: "rbox", kind: "onyx.RadioGroup", components: [
			{content: "Login", active: !0, classes: "button-style", ontap: "setupLogin"},
			{content: "Register", classes: "button-style", ontap: "setupRegister"}
		]},
		{name: "gbox", kind: enyo.FittableRows, classes: "nice-padding", components: [
			{name: "emailDrawer", kind: onyx.Drawer, orient: "v", open: false, components: [
				{name: "email", kind: enyo.Input, classes: "hanging-child", placeholder: "E-Mail", onkeyup: "emailRegexCheck"}, 
			]},
			{name: "username", kind: enyo.Input, classes: "hanging-child", placeholder: "Username", type: "email", onkeyup: "checkFields"}, 
			{name: "password", kind: enyo.Input, classes: "hanging-child", placeholder: "Password", type: "password", onkeyup: "checkFields"}, 
			{kind: enyo.ToolDecorator, classes: "hanging-child", components: [
				{name: "memoryBox", kind: "onyx.Checkbox", ontap: "remember"},
				{name: "text", content: "Remember Me"}
			]},
			{kind: enyo.FittableColumns, components: [
				{name: "logButton", kind: onyx.Button, content: "Login", classes: "button-style-affirmative nice-padding", ontap: "buildURL"},
				{fit: true},
				{name: "anonBytton", kind: onyx.Button, content: "Stay Anonymous", classes: "button-style nice-padding", ontap: "hidePopup"},
			]}
		]},
	],
    create: function () {
        this.inherited(arguments);
		/*if(LocalStorage.get("remember") == undefined) {
			LocalStorage.remove("uid");
			LocalStorage.remove("points");
		}*/
		if(this.register) {
			this.$.radioButton.setActive(false);
			this.$.radioButton2.setActive(true);
			this.setupRegister();
		} else 
			this.setupLogin();
	},
    rendered: function () {
        this.inherited(arguments);
	},
    setupLogin: function () {
        this.register = false;
		this.$.emailDrawer.setOpen(false);
		this.$.logButton.setContent("Login");
		this.$.logButton.render();
	},
    setupRegister: function () {
        this.register = true;
		this.$.emailDrawer.setOpen(true);
		this.$.logButton.setContent("Register");
		this.$.logButton.render();
	},
    buildURL: function () {
        this.log();
        if (this.checkFields()) {
            this.$.logButton.setDisabled(!1);
            var a = "login?";
            if(this.register) {
				a = "user?";
				a += "email=" + this.$.email.getValue() + "&";
			}
			a += "name=" + this.$.username.getValue() + "&";
			a += "password=" + this.$.password.getValue();
            var b = (new enyo.Ajax({
                method: "POST",
                url: Data.getURL() + a,
				headers: {"Cache-Control": "no-cache"},
				cacheBust: true,
                handleAs: "text"
          })).go().response(this, "handleResponse");
      }
	},
    handleResponse: function (a, b) {
	this.log(a.xhr);
        if (a.xhr.status === 200) {
			var incoming = JSON.parse(a.xhr.responseText);
			this.log(incoming.points);
			this.log(incoming.uid);
			this.log("WEEE");
			this.hide();
			LocalStorage.set("points", JSON.stringify(incoming.points));
			LocalStorage.set("user", JSON.stringify(incoming.uid));
			LocalStorage.set("username", JSON.stringify(incoming.name));
		if(this.$.memoryBox.getValue())
			LocalStorage.set("remember", true);
			this.doSuccessCode();
		} else {
			this.log(JSON.stringify(a));
			this.log(a.xhr.status);
			this.log("BOOO");
			this.doFailureCode();
		}
	},
	hidePopup: function(inSender, inEvent) {
		this.doAnonymousCode();
	},	
    emailRegexCheck: function () {
        var a = /^\w+([\.\+]\w+)*@\w+(\.\w+)*(\.\w{2,})$/;
        return a.test(this.$.email.getValue()) ? (this.$.email.applyStyle("color", "black"), !0) : (this.$.email.applyStyle("color", "red"), !1);
	},
    checkUsernameExists: function () {
        return this.$.username.getValue() === "" ? !1 : !0;
	},
    checkPasswordExists: function () {
        return this.$.password.getValue() === "" ? !1 : !0;
	},
    checkFields: function () {
        if (this.checkUsernameExists() && this.checkPasswordExists()) return this.register && this.emailRegexCheck ? (this.$.logButton.setDisabled(!1), !0) : (this.$.logButton.setDisabled(!1), !0);
        return !1;
	}
});
