enyo.kind({
                name: "PinView",
                kind: "enyo.Control",
                published: {
					value: "1",
					description: "temp description"
                },
                components: [
                    {name: "taskDesc", tag: "div", content: "test"},
                    {name: "taskValue", style: "color: #FF0000;", content: "testval"},
					{name: "button", kind: "onyx.Button", content: "Do It!", ontap: "buttonHit"}
                ],
                events: {
                    onDoObservation: ""
                },
                create: function(inSender, inEvent)
                {
                    this.inherited(arguments);
                    this.$.taskDesc.content = this.description;
                    this.$.taskValue.content = this.value;
                },
                setContent: function(description, value) {
                    this.$.taskDesc.setContent(description);
                    this.$.taskValue.setContent("You earn: " + value + " points");
                    this.$.taskDesc.resized();
                    this.$.taskValue.resized();
                    this.resized();
                },
                buttonHit: function(inSender, inEvent) {
                    this.doDoObservation();
                    return true;
                },
                setIndex: function(index) {
					this.index = index;
                }
            });
