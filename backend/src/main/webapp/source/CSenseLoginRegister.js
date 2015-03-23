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
    } else {
      this.setupLogin();
    }
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
      var tmp = {};
      var ajax;
      serverURL = Data.getURL() + "user";
      if(this.register) {
        tmp.name = this.$.usernameRegister.getValue();
        tmp.password = this.$.passwordRegister.getValue();
        tmp.email = this.$.emailRegister.getValue();
        var user = {user: tmp};
        this.log(JSON.stringify(user));
        ajax = new enyo.Ajax({url: serverURL, method: "POST", postBody: JSON.stringify(user), contentType: "application/json", cacheBust: false});
      } else {
        var auth = "Basic " + window.btoa(this.$.usernameLogin.getValue() + ":" + this.$.passwordLogin.getValue());
        this.log(auth);
        ajax = new enyo.Ajax({url: serverURL + "/"+this.$.usernameLogin.getValue()+"/token", method: "GET", headers: {Authorization: auth}, cacheBust: false});
      }

      ajax.response(this, "handleResponse");
      ajax.go();
    }
  },

  handleResponse: function(inSender, inEvent) {
      var status = inSender.xhrResponse.status;
      var authToken = inSender.xhrResponse.headers.authtoken;
      var body = JSON.parse(inSender.xhrResponse.body);
      this.log(authToken);
      this.log(body);
      if(status === 200) {
        LocalStorage.set("authtoken", authToken);
        LocalStorage.set("user", body);
        LocalStorage.set("username", JSON.stringify(body.user.name));
        if(this.$.memoryBox.getValue()) {
          LocalStorage.set("remember", true);
        }
        if(body.user.name === "anonymous") {
          this.doAnonymousCode();
        } else {
          this.doSuccessCode();
        }
      } else {
        this.log(JSON.stringify(a));
        this.log(a.xhr.status);
        this.log("BOOO");
        this.doFailureCode();
      }
  },
  hidePopup: function(inSender, inEvent) {
    var auth = "Basic " + window.btoa("anonymous:" + Math.random());
    var serverURL = Data.getURL() + "user";
    this.log(auth);
    ajax = new enyo.Ajax({url: serverURL + "/anonymous/token", method: "GET", headers: {Authorization: auth}, cacheBust: false});
    ajax.response(this, "handleResponse");
    ajax.go();
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
