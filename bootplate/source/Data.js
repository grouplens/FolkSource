enyo.kind({
    name: "Data",
    kind: "enyo.Control",
    statics: {
        getURL: function () {
            return "http://ugly.cs.umn.edu:8080/csense/";
            //return "http://134.84.74.200.xip.io:8080/csense/";
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
        getBikeData: function(i, j, age, gender, helmet, assistive, bike, ped) {
            var output = [];
            var spIndex;
            if(age) {
                if(i == 2 || i == 4) {
                    if(gender) {
                        if(j == 1 || j == 3)
                            output.push("male");
                        else
                            output.push("female");
                        if(i <= 3)
                            output.push("adult");
                        else
                            output.push("child");
                        if(j <= 2) {
                            output.push("cyclist");
                            if(helmet)
                                output.unshift("helmeted");
                        } else {
                            output.push("pedestrian");
                            if(assistive)
                                output.unshift("assisted");
                        }
                    }
                } else if (i == 3 || i == 5) {
                    if(j == 0 || j == 2)
                        output.push("male");
                    else
                        output.push("female");
                    if(i <= 3)
                        output.push("adult");
                    else
                        output.push("child");
                    if(j <= 1)
                        output.push("cyclist");
                    else
                        output.push("pedestrian");
                }
            } else {
                if(gender) {
                    if(j == 0 || j == 2)
                        output.push("male");
                    else
                        output.push("female");

                        if(helmet && (i == 2 || i == 4))
                            output.unshift("helmeted");
                        if(assistive && (i == 2 || i == 4))
                            output.unshift("assisted");
                        if(j <= 1)
                        output.push("cyclist");
                    else
                        output.push("pedestrian");
                } else {
                    if(j <= 1)
                        output.push("cyclist");
                    else
                        output.push("pedestrian");
                }
            }
            console.log();
            return output;
        },
        countAdd: function(inputArray) {
            var countData = LocalStorage.get("countData");
            if(countData == undefined) {
                countData = [];
            }
            countData.unshift(inputArray);
            //countData.push(inputArray);
            LocalStorage.set("countData", countData);
            
            /*db = window.openDatabase("countData", 1, "Count Data", 10000000);
            db.executeSql("CREATE TABLE IF NOT EXISTS data (id unique, timestamp, data)");
            db.executeSql("INSERT INTO data (id, timestamp data) VALUES ()"):*/
        },
        countRemove: function(index) {
            var countData = LocalStorage.get("countData");
            countData.splice(index, 1);
            LocalStorage.set("countData", countData);
        },
        countGetAtIndex: function(index) {
            if(ret = LocalStorage.get("countData"))
                return ret[index];
            else 
                return -1;
        }, 
        countSize: function() {
            return LocalStorage.get("countData").length;
        },
        setLocationData: function(inVar) {
            LocalStorage.set("loc", inVar);
        },
        getLocationData: function() {
            return LocalStorage.get("loc");
        }
    }
});
