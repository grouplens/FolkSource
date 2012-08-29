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
        renderResponse: function (a, b) {},
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
                    } else {
                        /*if(j <= 1)
                            output.push("cyclist");
                        else
                            output.push("pedestrian");*/
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


            /*if(age && (i == 2 || i == 3))
              output.push("adult");
              else if (age && (i == 4 || i == 5))
              output.push("child");

              if(gender && (j == 1 || j == 3))
              output.push("male");
              else if (gender && (j == 2 || j == 4))
              output.push("female");

              if (ped && ((age && gender && (j == 3 || j == 4)) || j == 2)) {
                output.push("pedestrian");
                if(assistive && (i == 2 || i == 4))
                    output.push("assistive");
            }
            if(bike && ((age && gender && (j == 1 || j == 2)) || j == 0)) {
                output.push("cyclist");
                if(helmet && (i == 2 || i == 4))
                    output.push("helmet");
            }*/
            return output;
        }
    }
});
