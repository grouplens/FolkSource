enyo.kind({
  name: "Timer",
  kind: "enyo.Control",
  published: {
    title: "Counter",
    length: 10000,
    resetInterval: 3000
  },
  handlers: {
    onFifteenMinutes: "timerChanged",
    onStartTimer: "timerStarted"
  },
	events: {
		onTimerStarted: ""
	},
  components: [
    {name: "button", kind: "onyx.Button", /*content: "Start Counting!",*/ style: "width: 100%;", ontap: "buttonClick", classes: "button-style", components: [
      {name: "timer", kind: "enyo.FittableColumns", components: [
        {name: "label", content: "Tap to Start "},
        {fit: true},
        {name: "counter", content: "00:00:00", style: "padding: 0px 10px;"}
			]},
      /*{name: "columnsDrawer",style: "white-space: nowrap; overflow: hidden;", orient: "h", kind: "onyx.Drawer", open: false, components: [
      {name: "counter", content: "00:00:00"}
      ]}*/
    ]},
  ],
  create: function (inSender, inEvent) {
    this.inherited(arguments);
    this.started = false;
    this.count = 0;
  },
  buttonClick: function(inSender, inEvent) {
	this.doTimerStarted();
    if(!this.started) {
      this.job = setInterval(enyo.bind(this, "sendSeconds"), 1000);
      this.$.label.setContent("Tap to Stop");
      this.$.button.addRemoveClass("onyx-affirmative", false);
      this.$.button.addRemoveClass("onyx-negative", true);
    } else {
      clearInterval(this.job);// = setTimeout("sendSeconds", 1000);
      this.$.label.setContent("Tap to Start");
    this.$.button.addRemoveClass("onyx-negative", false);
      this.$.button.addRemoveClass("onyx-affirmative", true);
    }
    this.started = !this.started;
  },
  /*startStopTimer: function(inSender, inEvent) {
      //var started = false;
      //var job;
      this.waterfall("onStartTimer");
      //enyo.job("sendTimerEvent", enyo.bind(this, "sendTimerEvent"), 900000);
      if(started) {
          //enyo.job.stop("addSecond");
          //clearInterval(job);
          //c = false;
          this.$.button.setContent("Start Counting!");
      } else {
          this.sendSeconds();
          //enyo.job("addSecond", enyo.bind(this, "sendSeconds"), 1000);
          //job = setInterval(enyo.bind(this, "sendSeconds"), 1000);
          //started = true;
          this.$.button.setContent("Stop Counting!");
          this.$.columnsDrawer.setOpen(true);
      }
  },*/
  sendSeconds: function() {
      if((this.count * 1000) % this.resetInterval === 0) {
          this.$.counter.setContent("00:00:00");
      }
      if(this.count * 1000 < this.length) {
          this.log();
          var a = this.$.counter.getContent(),
          b = a.split(":");
          if (Number(b[2]) === 59) {
              b[2] = "00";
              if (Number(b[1]) === 59) {
                  b[1] = "00";
                  var c = (Number(b[0]) + 1).toString();
                  c.length < 2 && (c = "0" + c), b[0] = c;
              } else {
                  var c = (Number(b[1]) + 1).toString();
                  c.length < 2 && (c = "0" + c), b[1] = c;
              }
          } else {
              var c = (Number(b[2]) + 1).toString();
              c.length < 2 && (c = "0" + c), b[2] = c;
          }
          this.$.counter.setContent(b.join(":"));
      } else {
          this.buttonClick();
      }
      this.count++;
  },
});
