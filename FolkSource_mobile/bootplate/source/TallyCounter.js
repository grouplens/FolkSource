enyo.kind({
  name: "TallyCounter",
  kind: "enyo.FittableRows",
  classes: "tableButton",
	published: {
    row: 0,
    col: 0,
    enabled: false
	},
	events: {
		"onRecordCountEvent": ""
	},
  handlers: {
    ontap: "increment"
  },
  components: [
    {name: "num", kind: "onyx.Button", content: 0, classes: "button-style", style: "text-align: center; width: 100%; height: 100%;", disabled: true}
	],
  create: function (a, b) {
    this.inherited(arguments);
  },
  increment: function () {
    //this.log(this);
    this.$.num.setContent(this.$.num.getContent() + 1);
    this.doRecordCountEvent({row: this.row, column: this.col});
    //this.render();
  },
  decrement: function() {
    if(Number(this.$.num.getContent()) > 0) {
      this.$.num.setContent(this.$.num.getContent() - 1);
    }
  },
  getCount: function () {
    return this.storage != undefined ? this.storage.join() : 0;
  },
  enabledChanged: function(inSender, inEvent) {
    this.$.num.setDisabled(!this.enabled);
  }
});
