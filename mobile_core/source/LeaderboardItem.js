enyo.kind({
                name: "LeaderboardItem",
                //layoutKind: "FittableColumnsLayout",
                classes: "leaderItem",
                index:'',
                components: [
                    {name: "User", content: "user", classes: "leaderTable leaderUser"},
                    {name: "Points", content: "points", classes: "leaderTable leaderPoints"}
                ],
                create: function(inSender, inEvent)
                {
                    this.inherited(arguments);
                },
                setIndex: function(input) {
					this.index = input;
                }
            });
