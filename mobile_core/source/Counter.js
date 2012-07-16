enyo.kind({
                name: "Counter",
                kind: "enyo.Control",
                published: {
					title: "Counter",
                },
                components: [
                        {name: "titl", content: this.title, style: "clear: both;"},
                        {name: "pos", kind: "onyx.Button", content: "+", classes: "onyx-affirmative", ontap: "up", style: "clear: both;"},
                        {name: "num", content: 0, style: "clear: both;"},
                        {name: "neg", kind: "onyx.Button", content: "-", classes: "onyx-negative", ontap: "down", disabled: true, style: "clear: both;"}
                ],
                events: {
                },
                create: function(inSender, inEvent)
                {
                    this.inherited(arguments);
                    this.$.titl.setContent(this.title);
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
                    return this.$.num.getContent();
                }
                });
