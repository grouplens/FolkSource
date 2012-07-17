enyo.kind({
                name: "Counter",
                kind: "enyo.Control",
                published: {
					title: "Counter",
                },
                handlers: {
                    onTimer: "timerChanged",
                    onStartTimer: "timerStarted"
                },
                components: [
                        {name: "titl", content: this.title, style: "clear: both;"},
                        {name: "pos", kind: "onyx.Button", content: "+", classes: "onyx-affirmative", ontap: "up", disabled: true, style: "clear: both;"},
                        {name: "num", content: 0, style: "clear: both;"},
                        {name: "neg", kind: "onyx.Button", content: "-", classes: "onyx-negative", ontap: "down", disabled: true, style: "clear: both;"}
                ],
                create: function(inSender, inEvent)
                {
                    this.inherited(arguments);
                    this.$.titl.setContent(this.title);
                },
                timerStarted: function(inSender, inEvent) {
                    this.storage = [];
                    this.$.pos.setDisabled(false);
                    return true;
                },
                timerChanged: function(inSender, inEvent) {
                    this.storage.push(this.getCount);
                    this.$.num.setContent(0);
                    this.$.neg.setDisabled(true);
                    return true;
                },
                up: function() {
                    this.$.num.setContent(this.$.num.getContent()+1);
                    if(this.$.num.getContent != 0) {
                        this.$.neg.setDisabled(false);
                    }
                },
                down: function() {
                    if(this.$.num.getContent() >0) {
                        this.$.num.setContent(this.$.num.getContent()-1);
                        if(this.$.num.getContent() === 0) {
                            this.$.neg.setDisabled(true);
                        }
                    } else {
                        this.$.neg.setDisabled(true);
                    }
                },
                getCount: function() {
                    if(this.storage != undefined)
                        return this.storage.join();
                    else return 0;
                }
                });
