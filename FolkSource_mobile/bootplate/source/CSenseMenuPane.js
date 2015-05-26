enyo.kind({
  name: "CSenseMenuPane",
  kind: enyo.FittableColumns,
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
    onSetUserLocation: "handleUserLocation"
  },
  events: {
    onSenseOpened: "",
    onHideCampaigns: "",
    onShowCampaigns: ""
  },
  components: [
    {name: "appPanels", kind: enyo.Panels, fit: true, narrowFit: true, index: 0, draggable: false, layoutKind: enyo.FittbaleRowslayout, components: [
      {name: "loginer", kind: "CSenseLoginRegister"},
      {name: "menuDrawer", kind: enyo.Panels, fit: true, narrowFit: false, index: 1, draggable: false, margin: 0, arrangerKind: enyo.CollapsingArranger, layoutKind: enyo.FittableColumnsLayout, onTransitionFinish: "drawerEndTransition", components: [
        {kind: enyo.FittableRows, style: "height: 100%; width: 50%;", classes: "dark-background", components: [ //index 0
          {name: "profile", kind: onyx.Toolbar, layoutKind: enyo.FittableColumnsLayout, ontap: "showDetails", classes: "active-card", components: [
            {style: "border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; margin: 5px; vertical-align: middle;", classes: "light-background", components: [
              {tag: "i", classes: "fa fa-smile-o fa-2x fa-fw color-icon", style: "padding: 5px 5px; vertical-align: middle;"},
            ]},
            {name: "user", content: "username", style: "font-size: 11pt;"},
          ]},
          {name: "userDrawer", kind: onyx.Drawer, orient: "v", open: false, classes: "light-background", components: [
            {name: "logout", kind: enyo.FittableColumns, ontap: "userLogout", classes: "slidein-option button-style dark-background", components: [
              {content: "Logout", fit: true},
              {tag: "i", classes: "fa color-icon fa-lg fa-fw fa-sign-out", style: "padding: 0 5px;"}
            ]}
          ]},
          {ontap: "showCampaignList", kind: enyo.FittableColumns, classes: "slidein-option button-style light-background", style: "width: 100%;", onup: "toggleHilight", ondown: "toggleHilight", components: [
            {tag: "i", classes: "fa fa-map-marker fa-lg fa-fw color-icon", style: "padding: 0 5px;"},
            {content: "Campaign List", fit: true}
          ]},
          {ontap: "showLeaderboard", kind: enyo.FittableColumns, classes: "slidein-option button-style light-background", style: "width: 100%;", onup: "toggleHilight", ondown: "toggleHilight", components: [
            {tag: "i", classes: "fa fa-trophy fa-lg fa-fw color-icon", style: "padding: 0 5px;"},
            {content: "Leaderboard", fit: true}
          ]},
          {fit: true},
          {kind: "GrouplensBrand"}
        ]},
        {kind: enyo.FittableRows, fit: true, style: "min-width: 100%; box-shadow: -3px 0 3px #666;", components: [ //index 1
          {name: "toolbar", kind: onyx.Toolbar, style: "width: 100%;", layoutKind: enyo.FittableColumnsLayout, classes: "dark-background-flat", components: [
            {name: "menuButton", tag: "i", classes: "fa fa-navicon fa-2x fa-fw color-icon", style: "vertical-align: middle;", ontap: "showMenu"},
            {fit: true, components: [
              {kind: enyo.Image, src: "assets/logos/folk_source_logo.png", style: "height: 2em; display: block; margin-left: auto; margin-right: auto;"},
            ]},
            {name: "locateMe", tag: "i", classes: "fa fa-fw fa-crosshairs fa-2x color-icon", ontap: "handleCenter"},
          ]},
          {name: "menupane", kind: enyo.Panels, fit: true, draggable: false, animate: true, index: 0, style: "height: 100%;", arrangerKind: enyo.CarouselArranger, components: [
            {name: "clist", kind: enyo.FittableRows, components: [
              //{name: "androidDiv"},
              {name: "lenses", kind: "LensShifter"},
              {name: "map", kind: "NewMap", onHide: "handleCampsHide", onShow: "handleCampsShow", fit: true},
              //{name: "iosDiv"},
            ]},
            {name: "llist", kind: enyo.FittableRows, components: [
              {kind: "LeaderboardList", multiselect: false, fit: true},
            ]},
            {name: "sense", kind: enyo.FittableRows}
          ]}
        ]}
      ]},
    ]}
  ],
  buttonTapHandler: function (a, b) {
    if(a.slide === "prev") {
      //this.$.panels.previous();
    } else if(a.slide === "next") {
      //this.$.panels.next();
    } else {
      //this.$.panels.snapTo(a.slide);
    }
  },
  closeSense: function (a, b) {
    this.$.menupane.setIndex(0);
    this.$.sense.destroyComponents();
    this.waterfallDown("onShowCampaigns");
    this.$.locateMe.addRemoveClass("tableHideKeep", false);
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
    //this.$.menuDrawer.getAnimator().setDuration(350);
    //this.$.menupane.getAnimator().setDuration(350);
    /*
     * GET OS THING HERE
     */

     /*if(OS === "ios") {
       this.$.iosDiv.createComponent({name: "lensMenu", kind: "BottomLensMenu", onActivate: "handleLenses", android: false});
     } else if (OS === "android") {
       this.$.androidDiv.createComponent({name: "lensMenu", kind: "BottomLensMenu", onActivate: "handleLenses", android: true});
     }*/
    //this.$.taskpanels.getAnimator().setDuration(750);
  },
  drawerEndTransition: function(inSender, inEvent) {
    if(inEvent.originator.name === "menuDrawer") {
      if(inEvent.toIndex === 1) { // closing drawer, this is where target comes in
        if(this.panelTarget === 'c') {
          this.log('c');
          this.$.locateMe.addRemoveClass("tableHideKeep", false);
          this.$.menupane.setIndex(0);
          //this.$.menuDrawer.setIndex(1);
          //this.showMenu();
          this.$.map.showCamps();
        } else if(this.panelTarget === 'l') {
          this.log('l');
          this.$.locateMe.addRemoveClass("tableHideKeep", true);
          this.$.menupane.setIndex(1);
          //this.$.menuDrawer.setIndex(1);
          //this.showMenu();
        } else {
          if(this.$.menupane.getIndex() === 0) {
            //this.$.map.showCamps();
          }
        }
      }
    }
  },
  fetchData: function() {
    if(this.logged_in === false) {
      this.logged_in = true;
    }
    var url = Data.getURL() + "campaign.json";
    var ajax = new enyo.Ajax({method: "GET", cacheBust: false, url: url, handleAs: "json", headers: {AuthToken: LocalStorage.get("authtoken")}});
    ajax.response(this, "renderResponse");
    ajax.go();
  },
  handleCampsHide: function(inSender, inEvent) {
    this.log("CAUGHT HIDE");
    return true;
  },
  handleCampsShow: function(inSender, inEvent) {
    return true;
  },
  handleCenter: function() {
    this.$.map.userCenter();
    //this.$.map.zoomClose();
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
    this.log(inEvent);
    var c = inEvent.originator;
    var complex = false;
    var task = inEvent.data;
    for (var qid in task.questions) {
      if (task.questions[qid].type.indexOf("complex") != -1) {
        complex = true;
        break;
      }
    }
    if(this.$.sensr !== undefined)
      this.$.sensr.destroy();

    var gps;
    if(this.gps) {
      gps = this.gps;
    } else {
      gps = Data.getLocationData();
    }

    this.$.sense.createComponent({name: "sensr", kind: "ComplexSensr", fit: true, data: task, location_id: inEvent.location_id, classes: "content"});
    this.$.sense.render();
    this.resized();
    this.waterfallDown("onHideCampaigns");
    this.$.menupane.setIndex(2);
    this.$.locateMe.addRemoveClass("tableHideKeep", true);
    return true;
  },
  rendered: function(inSender, inEvent) {
    this.inherited(arguments);
    if(LocalStorage.get("user") === undefined) {
      this.$.map.hideCamps();
      this.$.appPanels.setIndex(0);
    } else {
      this.setupProfile(null, LocalStorage.get("user"));
      //this.fetchData();
      enyo.Signals.send("onLoggedIn");
      //this.$.loginer.buildURL();
    }
  },
  renderResponse: function (a, b) {
    this.log(b);
    this.campaignArray = b.campaigns;
    LocalStorage.set("campaign_data", this.campaignArray);
    //this.doSavedCampaigns();
    var remove = [];
    this.log(this.campaignArray.length);
    for (var c in this.campaignArray) {
      this.log(c);
      var currentCampaign = this.campaignArray[c];
      var e = "panel_" + currentCampaign.id;
      var f = "item_" + currentCampaign.id;
      var g = "map_" + currentCampaign.id;
      ///*
       //* This block below is needed because not all browsers parse dates
       //* the same way. This should be mostly browser compatible.
       //
      var date = Date.parse(new Date());
      //var st = currentCampaign.start_date_string.split(/[- :]/);
        //var en = currentCampaign.end_date_string.split(/[- :]/);
        //var startDate = Date.parse(new Date(st[0], st[1]-1, st[2], st[3], st[4], st[5]));
        //var endDate = Date.parse(new Date(en[0], en[1]-1, en[2], en[3], en[4], en[5]));

      //if(endDate >= date) { // "closed" campaigns shouldn't show up
      //if(currentCampaign.title !== undefined) {
      //this.$.panels.createComponent(
        //{name: e, classes: "panelItem", fit: true, data: this.campaignArray[c], kind: enyo.FittableRows, components: [
        //{name: f, kind: "CampaignItem", fit: true, title: "" + currentCampaign.title, description: "" + currentCampaign.description},
      //]});
      //} else {
        //remove.push(c);
        //}
       //this.$.panels.reflow();
      //this.$.panels.render();
      this.$.toolbar.render();
    }

    enyo.Signals.send("onCampLoaded");

    this.$.toolbar.render();
    //this.checkSides(); // make sure the arrow buttons work
    this.$.map.render();
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
    this.$.user.setContent(user.user.name);
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
  showCampaignList: function(inSender, inEvent) {
    /*
    this.showMenu();
    this.$.locateMe.addRemoveClass("tableHideKeep", false);*/
    this.panelTarget = 'c';
    this.$.menuDrawer.setIndex(1);
    //this.$.menuDrawer.setIndex(1);
    //this.$.menupane.render();
  },
  showLeaderboard: function(inSender, inEvent) {
    /*
    this.showMenu();
    this.$.locateMe.addRemoveClass("tableHideKeep", true);*/
    this.panelTarget = 'l'
    this.$.menuDrawer.setIndex(1);
    //this.$.menuDrawer.setIndex(1);
    //this.$.menupane.render();
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
