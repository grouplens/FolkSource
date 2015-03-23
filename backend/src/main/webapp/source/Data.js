enyo.kind({
  name: "Data",
  kind: "enyo.Control",
  statics: {
    getURL: function () {
      //return "http://folksource.grouplens.org/api/";
      //return "http://localhost:3000/";
      return "http://localhost:8080/FolkSource/";
      //return "http://134.84.121.213.xip.ip:8080/";
    },
    getUserName: function (a) {
      var ajax = new enyo.Ajax({
        contentType: "application/json",
        sync: !0,
        url: Data.getURL() + "leaderboard.json"
      });
      ajax.response(this, function (a, b) {
        this.users = b.leaderboardEntrys;
      });
      ajax.go();
      for (var x in this.users) {
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
