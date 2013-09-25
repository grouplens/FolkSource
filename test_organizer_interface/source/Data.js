enyo.kind({
    name: "Data",
    kind: "enyo.Control",
    statics: {
        getURL: function () {
            return "http://ugly-umh.cs.umn.edu:8080/csense/";
            //return "http://127.0.0.1:8080/";
        },
        getUserName: function (a) {
            var b = new enyo.Ajax({
                contentType: "application/json",
                sync: !0,
                url: Data.getURL() + "leaderboard.json"
            });
            b.response(this, function (a, b) {
                this.users = b.leaderboardEntrys;
            }), b.go();
            for (x in this.users) {
                if (this.users[x].id == a) {
                    this.log(a);
                    return this.users[x].name;
                }
            }
        },
        setLocationData: function(inVar) {
            LocalStorage.set("loc", inVar);
        },
        getLocationData: function() {
            return LocalStorage.get("loc");
        },
		setIsReady: function(ready) {
			LocalStorage.set("ready", ready);
		},
		getIsReady: function() {
			return LocalStorage.get("ready");
		}
    }
});
