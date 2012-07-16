enyo.kind({
    name: "Data",
    kind: "enyo.Control",
    statics: {
        getURL: function() {
            return "http://ugly.cs.umn.edu:8080/csense/";
            //return "http://localhost:9080/citizensense/";
        },
        getUserName: function(userId) {
            var request = new enyo.Ajax({contentType: "application/json", sync: true, url: Data.getURL()+"leaderboard.json"});
            request.response(this, function(inSender, inResponse) {
                this.users = inResponse.leaderboardEntrys; 
            });
            request.go();
            for (x in this.users) {
                if(this.users[x].id == userId) {
                    return this.users[x].name;
                }
            }
        },
        renderResponse: function(inSender, inResponse) {
        }
    }
});
