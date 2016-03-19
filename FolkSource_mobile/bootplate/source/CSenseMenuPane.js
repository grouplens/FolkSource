enyo.kind({
  name: "CSenseMenuPane",
  kind: "enyo.FittableColumns",
  classes: "dark-background",
  handlers: {
    onSuccessCode: "unPop",
    onFailureCode: "rePop",
    onPlaceChosen: "openSense",
    onSubmissionMade: "closeSense",
    onRenderScroller: "renderScroller",
    onLoggedIn: "setupProfile",
    onCloseSearchDrawer: "openSearch",
    onOpenSearchDrawer: "closeSearch",
    onSetUserLocation: "handleUserLocation",
    onReloadedData: "countReset"
  },
  events: {
    onSenseClosed: "",
    onHideCampaigns: "",
    onShowCampaigns: ""
  },
  components: [
    {name: "appPanels", kind: "enyo.Panels", fit: true, narrowFit: true, index: 0, draggable: false, layoutKind: "enyo.FittableRowsLayout", components: [
      {name: "loginer", kind: "CSenseLoginRegister"},
      {name: "menuDrawer", kind: "enyo.Panels", fit: true, narrowFit: false, index: 1, draggable: false, margin: 0, arrangerKind: "enyo.CollapsingArranger", layoutKind: "enyo.FittableColumnsLayout", onTransitionFinish: "drawerEndTransition", components: [
        {kind: "enyo.FittableRows", style: "height: 100%; width: 50%;", classes: "dark-background", components: [ //index 0
          {name: "profile", kind: "onyx.Toolbar", layoutKind: "enyo.FittableColumnsLayout", ontap: "showDetails", classes: "active-card", components: [
            {style: "border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; margin: 5px; vertical-align: middle;", classes: "light-background", components: [
              {tag: "i", classes: "fa fa-smile-o fa-2x fa-fw color-icon", style: "padding: 5px 5px; vertical-align: middle;"},
            ]},
            {name: "user", content: "username", style: "font-size: 11pt;"},
          ]},
          {name: "userDrawer", kind: "onyx.Drawer", orient: "v", open: false, classes: "light-background", components: [
            {name: "logout", kind: "enyo.FittableColumns", ontap: "userLogout", classes: "slidein-option button-style dark-background", components: [
              {content: "Logout", fit: true},
              {tag: "i", classes: "fa color-icon fa-lg fa-fw fa-sign-out", style: "padding: 0 5px;"}
            ]},
            {name: "wikiOauth", kind: "enyo.FittableColumns", ontap: "wikiOauth", classes: "slidein-option button-style dark-background", components: [
              {content: "Connect", fit: true},
              {tag: "i", classes: "fa color-icon fa-lg fa-fw fa-plane", style: "padding: 0 5px;"}
            ]}
          ]},
          {ontap: "showCampaignList", kind: "enyo.FittableColumns", classes: "slidein-option button-style light-background", style: "width: 100%;", onup: "toggleHilight", ondown: "toggleHilight", components: [
            {tag: "i", classes: "fa fa-map-marker fa-lg fa-fw color-icon", style: "padding: 0 5px;"},
            {content: "Campaign List", fit: true}
          ]},
          {ontap: "showLeaderboard", kind: "enyo.FittableColumns", classes: "slidein-option button-style light-background", style: "width: 100%;", onup: "toggleHilight", ondown: "toggleHilight", components: [
            {tag: "i", classes: "fa fa-trophy fa-lg fa-fw color-icon", style: "padding: 0 5px;"},
            {content: "Leaderboard", fit: true}
          ]},
          {fit: true},
          {kind: "GrouplensBrand"}
        ]},
        {kind: "enyo.FittableRows", fit: true, style: "min-width: 100%; box-shadow: -3px 0 3px #666;", components: [ //index 1
          {name: "toolbar", kind: "onyx.Toolbar", layoutKind: "enyo.FittableColumnsLayout", classes: "dark-background-flat", components: [
            {name: "menuButton", tag: "i", classes: "fa fa-navicon fa-2x fa-fw color-icon", style: "vertical-align: middle;", ontap: "showMenu"},
            {fit: true, ontap: "countRefresh", components: [
              {name: "logo", kind: "enyo.Image", src: "assets/logos/folk_source_logo.png", style: "height: 2em; display: block; margin-left: auto; margin-right: auto;"},
              {name: "refreshTrigger", tag: "i", classes: "fa fa-lg fa-fw fa-circle-o-notch", style: "width: 100%; text-align: center; margin-left: auto; margin-right: auto;", showing: false}
            ]},
          ]},
          {name: "menupane", kind: "enyo.Panels", fit: true, draggable: false, animate: true, index: 0, style: "height: 100%;", arrangerKind: "enyo.CarouselArranger", components: [
            {name: "clist", kind: "enyo.FittableRows", components: [
              {name: "map", kind: "MapView", onHide: "handleCampsHide", onShow: "handleCampsShow", fit: true},
            ]},
            {name: "llist", kind: "enyo.FittableRows", components: [
              {kind: "LeaderboardList", multiselect: false, fit: true},
            ]},
            {name: "sense", kind: "enyo.FittableRows"}
          ]}
        ]}
      ]},
    ]}
  ],
  closeSense: function (a, b) {
    this.$.menupane.setIndex(0);
    this.$.sense.destroyComponents();
    this.waterfallDown("onSenseClosed");
    return true;
  },
  checkSides: function () {
    var index = this.$.panels.getIndex();
    var size = this.$.panels.getPanels().length;
    var adjSize = size - 1; //adjust for counting at 0 vs. 1
    this.$.rightButton.setDisabled(false);
    this.$.leftButton.setDisabled(false);
    if (this.campaignArray !== undefined) {
      if (index !== 0 && adjSize !== 0) {
        if (index === 0) {
          this.$.rightButton.setDisabled(false);
          this.$.leftButton.setDisabled(true);
        } else if (index === adjSize && index !== 0) {
          this.$.rightButton.setDisabled(true);
          this.$.leftButton.setDisabled(false);
        }
      } else {
          this.$.rightButton.setDisabled(true);
          this.$.leftButton.setDisabled(true);
      }
    }
  },
  closeSearch: function(inSender, inEvent) {
    //this.$.searchDrawer.setOpen(false);
    return true;
  },
  create: function (inSender, inEvent) {
    this.inherited(arguments);
    this.panelTarget = '';
    this.refreshCount = 0;
  },
  countRefresh: function(inSender, inEvent) {
    this.refreshCount++;
    this.log(this.refreshCount);
    if(this.refreshCount === 2) {
      this.$.logo.setShowing(false);
      this.$.refreshTrigger.setShowing(true);
    }
    if(this.refreshCount === 5) {
      this.$.refreshTrigger.addRemoveClass("fa-spin", true);
      enyo.Signals.send("onLoggedIn");
    }

  },
  countReset: function(inSender, inEvent) {
    this.$.refreshTrigger.addRemoveClass("fa-spin", false);
    this.$.logo.setShowing(true);
    this.$.refreshTrigger.setShowing(false);
    this.refreshCount = 0;
    this.log("received onCampLoaded");
  },
  drawerEndTransition: function(inSender, inEvent) {
    if(inEvent.originator.name === "menuDrawer") {
      if(inEvent.toIndex === 1) { // closing drawer, this is where target comes in
        if(this.panelTarget === 'c') {
          this.log('c');
          this.$.menupane.setIndex(0);
          this.$.map.showCamps();
        } else if(this.panelTarget === 'l') {
          this.log('l');
          this.$.menupane.setIndex(1);
        }
      }
    }
  },
  handleCampsHide: function(inSender, inEvent) {
    this.log("CAUGHT HIDE");
    return true;
  },
  handleCampsShow: function(inSender, inEvent) {
    return true;
  },
  handleLenses: function(inSender, inEvent) {
    if(inEvent.originator.active) {
      if(inEvent.originator.name === "near") {
        this.$.lenses.setIndex(0);
        this.$.map.userCenter();
        this.$.map.zoomClose();
      } else {
        this.$.lenses.setIndex(1);
        this.$.map.zoomWide();
      }
    }
  },
  handleUserLocation: function(inSender, inEvent) {
    this.$.lenses.$.spaceToolbar.setPlace(inEvent.name);
    this.log(inEvent);
    return true;
  },
  openSearch: function(inSender, inEvent) {
    //this.$.searchDrawer.setOpen(true);
    return true;
  },
  openSense: function (inSender, inEvent) {
    var c = inEvent.originator;
    var complex = false;
    var task = inEvent.data;
    for (var qid = 0; qid < task.questions.length; qid++) {
      if (task.questions[qid].type.indexOf("complex") != -1) {
        complex = true;
        break;
      }
    }
    if(this.$.sensr !== undefined) {
      this.$.sensr.destroy();
    }

    var gps;
    if(this.gps) {
      gps = this.gps;
    } else {
      gps = Data.getLocationData();
    }

    this.$.sense.createComponent({name: "sensr", kind: "ComplexSensr", fit: true, data: task, location_id: inEvent.location_id, classes: "content"});
    this.$.sense.render();
    // this.resize();
    this.waterfallDown("onHideCampaigns");
    this.$.menupane.setIndex(2);
    // this.$.locateMe.addRemoveClass("tableHideKeep", true);
    return true;
  },
  rendered: function(inSender, inEvent) {
    this.inherited(arguments);
    if(LocalStorage.get("user") === undefined) {
      this.$.map.hideCamps();
      this.$.appPanels.setIndex(0);
    } else {
      this.setupProfile(null, LocalStorage.get("user"));
      enyo.Signals.send("onLoggedIn");
      //this.$.loginer.buildURL();
    }
  },
  renderScroller: function () {
    this.log();
  },
  rePop: function () {
    this.$.popup.setShowing(!1);
    this.$.popup.setShowing(!0);
  },
  setupProfile: function(inSender, inEvent) {
    var user = LocalStorage.get("user");
    this.$.user.setContent(user.name);
    this.$.profile.render();
    this.$.appPanels.setIndex(1);

    return true;
  },
  showMenu: function(inSender, inEvent) {
    var index = this.$.menuDrawer.getIndex();
    this.$.map.hideCamps();
    if(index == 1) {
      this.$.menuDrawer.setIndex(0);
    } else {
      if(this.$.menupane.getIndex() === 0) {
        this.showCampaignList();
      } else {
        this.showLeaderboard();
      }
    }
    this.$.userDrawer.setOpen(false);
  },
  showDetails: function() {
    var open = this.$.userDrawer.getOpen();
    this.$.userDrawer.setOpen(!open);
  },
  userLogout: function() {
    LocalStorage.remove("authtoken");
    LocalStorage.remove("user");
    LocalStorage.remove("username");
    this.$.appPanels.setIndex(0);
    this.$.userDrawer.setOpen(false);
    this.$.menuDrawer.setIndex(1);
    enyo.Signals.send("onLoggedOut");
  },
  wikiOauth: function() {
      var ajax;
          serverURL = Data.getURL() + "wikimedia/authuri";
          user = {username: this.$.user.content };
          ajax = new enyo.Ajax({url: serverURL, method: "POST", postBody: JSON.stringify(user), contentType: "application/json", cacheBust: false});
        
      ajax.response(this, "handleOauthResponse");
      ajax.error(this, "handleOauthError");
      //this.$.trying.setShowing(true);
      //this.$.sendingPopup.setOpen(true);
      ajax.go();
  },
  handleOauthResponse: function(inRequest, inResponse) {
    console.log('redirect to here:', inResponse);
    location.href = inResponse;
  },
  handleOauthError: function(data) {
    console.log('error', data);
  },
  showCampaignList: function(inSender, inEvent) {
    this.panelTarget = 'c';
    this.$.menuDrawer.setIndex(1);
  },
  showLeaderboard: function(inSender, inEvent) {
    this.panelTarget = 'l'
    this.$.menuDrawer.setIndex(1);
  },
  toggleHilight: function(inSender, inEvent) {
    //TODO: WORK IN PROGRESS, NOT FUNCTIONING
    var truthy = inSender.hasClass("hilight");
    inSender.addRemoveClass("hilight", !truthy);
    this.log(inSender.hasClass("higlight"));
  },
  unPop: function () {
    this.$.popup.setShowing(!1);
  }
});
