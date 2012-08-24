enyo.kind({
    name: "Data",
    kind: "enyo.Control",
    statics: {
        getURL: function () {
            return "http://ugly.cs.umn.edu:8080/csense/";
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
            for (x in this.users) if (this.users[x].id == a) return this.users[x].name;
        },
        renderResponse: function (a, b) {}
    }
});
