enyo.kind({
  name: "CSenseMenuPane",
  fit: true,
  kind: enyo.FittableColumns,
  classes: "dark-background",
  handlers: {
    onSuccessCode: "unPop",
    onFailureCode: "rePop",
    onPlaceChosen: "openSense",
    onSubmissionMade: "closeSense",
    onRenderScroller: "renderScroller",
    onLoggedIn: "setupProfile",
    onCheckCamps: "transFinishHandler"
  },
  events: {
    onSenseOpened: "",
    onHideCampaigns: "",
    onShowCampaigns: ""
  },
  components: [
    /*{kind: onyx.Popup, autoDismiss: false, centered: true, floating: true, modal: true, scrimWhenModal: false, scrim: true, classes: "light-background", components: [
      {kind: "CSenseLoginRegister"}
      ]},*/
    {kind: enyo.FittableRows, fit: true, style: "height: 100%;", components: [
      {name: "appPanels", kind: enyo.Panels, fit: true, narrowFit: true, index: 0, draggable: false, layoutKind: enyo.FittbaleRowslayout, components: [
        {name: "loginer", kind: "CSenseLoginRegister"},
        {name: "menuDrawer", kind: enyo.Panels, fit: true, narrowFit: false, index: 1, draggable: false, margin: 0, arrangerKind: enyo.CollapsingArranger, layoutKind: enyo.FittableColumnsLayout, components: [
          {kind: enyo.FittableRows, style: "height: 100%;", classes: "dark-background", components: [ //index 0
            {name: "profile", kind: onyx.Toolbar, layoutKind: enyo.FittableColumnsLayout, classes: "active-card", components: [
              {style: "border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; margin: 5px; vertical-align: middle;", classes: "light-background", components: [
                {tag: "i", classes: "icon-smile icon-2x color-icon", style: "padding: 5px 5px; vertical-align: middle;"},
              ]},
              {name: "user", content: "username"},
            ]},
            {ontap: "showCampaignList", kind: enyo.FittableColumns, classes: "slidein-option button-style light-background", style: "width: 100%;", onup: "toggleHilight", ondown: "toggleHilight", components: [
              {tag: "i", classes: "icon-map-marker icon-large color-icon", style: "padding: 0 5px;", ontap: "showMenu"},
              {content: "Campaign List", fit: true}
            ]},
            {ontap: "showLeaderboard", kind: enyo.FittableColumns, classes: "slidein-option button-style light-background", style: "width: 100%;", onup: "toggleHilight", ondown: "toggleHilight", components: [
              {tag: "i", classes: "icon-trophy icon-large color-icon", style: "padding: 0 5px;", ontap: "showMenu"},
              {content: "Leaderboard", fit: true}
            ]},
            {kind: "GrouplensBrand"}
          ]},
          {kind: enyo.FittableRows, fit: true, style: "min-width: 100%;", components: [ //index 1
            {kind: onyx.Toolbar, classes: "dark-background-flat", components: [
              {name: "menuButton", tag: "i", classes: "icon-align-justify icon-2x color-icon", style: "vertical-align: middle;", ontap: "showMenu"},
              {content: "FolkSource", style: "text-align: center;"}
            ]},
            {name: "menupane", kind: enyo.Panels, fit: true, draggable: false, animate: false, index: 1, style: "height: 100%;", arrangerKind: enyo.CardSlideInArranger, components: [
              {name: "llist", kind: enyo.FittableRows, components: [
                {kind: "LeaderboardList", multiselect: false, fit: true},
              ]},
              {name: "clist", kind: enyo.FittableRows, components: [
                {name: "map", kind: "NewMap", fit: true},
                //{name: "filled", kind: "FilledPanels", fit: true},
              ]},
              {name: "sense", kind: enyo.FittableRows, components: [
                //{kind: "ComplexSensr"}
              ]}
            ]}
          ]}
        ]},
      ]}
    ]}
  ],
  unPop: function () {
    this.$.popup.setShowing(!1);
  },
  rePop: function () {
    this.$.popup.setShowing(!1);
    this.$.popup.setShowing(!0);
  },
  renderScroller: function () {
    this.log();
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

    this.$.sense.createComponent({name: "sensr", kind: "ComplexSensr", fit: true, data: task, classes: "content"});
    this.$.sense.render();
    this.resized();
    this.waterfallDown("onHideCampaigns");
    this.$.menupane.setIndex(2);
    return true;
  },
  closeSense: function (a, b) {
    this.$.menupane.previous();
    this.$.sense.destroyComponents();
    this.waterfallDown("onShowCampaigns");
    return true;
  },
  create: function (inSender, inEvent) {
    this.inherited(arguments);
    //this.$.menupane.createComponent({name: "sensr", kind: "ComplexSensr", fit: true, complex: complex, data: c, classes: "content"});
    //this.$.menupane.render();
  },
  rendered: function(inSender, inEvent) {
    this.inherited(arguments);
    if(LocalStorage.get("user") === undefined) {
      this.$.appPanels.setIndex(0);
    } else {
      this.setupProfile(null, LocalStorage.get("user"));
      enyo.Signals.send("onLoggedIn");
      //this.$.loginer.buildURL();
    }
  },
  setupProfile: function(inSender, inEvent) {
    var user = LocalStorage.get("user");
    this.$.user.setContent(user.user.name);
    this.$.profile.render();
    this.$.appPanels.setIndex(1);

    return true;
  },
  showMenu: function(inSender, inEvent) {
    this.transFinishHandler();
    var index = this.$.menuDrawer.getIndex();
    if(index == 1) {
      this.$.menuDrawer.setIndex(0);
    } else {
      this.$.menuDrawer.setIndex(1);
    }
  },
  showCampaignList: function(inSender, inEvent) {
    this.$.menupane.setIndex(1);
    this.showMenu();
    //this.$.menuDrawer.setIndex(1);
    //this.$.menupane.render();
  },
  showLeaderboard: function(inSender, inEvent) {
    this.$.menupane.setIndex(0);
    this.showMenu();
    //this.$.menuDrawer.setIndex(1);
    //this.$.menupane.render();
  },
  toggleHilight: function(inSender, inEvent) {
    //TODO: WORK IN PROGRESS, NOT FUNCTIONING
    var truthy = inSender.hasClass("hilight");
    inSender.addRemoveClass("hilight", !truthy);
    this.log(inSender.hasClass("higlight"));
  },
  transFinishHandler: function (a, b) {
    var showing = this.$.map.$.camps.getShowing();
    var menu_index = this.$.menuDrawer.getIndex();

    if (menu_index === 0) {
      if(this.$.menupane.getIndex() === 1) {
        this.waterfallDown("onShowCampaigns");
      }
    } else if(menu_index === 1) {
      this.waterfallDown("onHideCampaigns");
    }
    return true;
  }
});
