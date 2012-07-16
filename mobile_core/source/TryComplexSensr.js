enyo.kind({
    name: "TryComplexSensr",
    kind: "enyo.Control",
    style: "min-height: 100%;",
    published: {
        complex: false
    },
    events: {
        onSubmisisonMade: ""
    },
    handlers: {
        onSenseOpened: "openNext",
        onPhotoOk: "photoOk",
        onDeviceReady: "setReady",
        onGPSSet: "currentLocation"
    },
    components: [
        {kind: "enyo.Signals", onGPSSet: "currentLocation", onPinClicked: "chosenLocation", onPhotoData: "photoData"},
    ],
    create: function(inSender, inEvent)
    {
        this.devReady = false;
        this.inherited(arguments);
        this.recreate();
    },
    recreate: function() {
            this.createComponent({name: "formDiv", kind: "enyo.Scroller", horizontal: "hidden", vertical: "scroll", fit: true, components: []});
        if(this.complex) { //THIS IS FOR BIKING ONLY RIGHT NOW
            this.log(this.complex);
            this.$.formDiv.createComponent({name: "acc", kind: "Accordion", fit: true, headerHeight: 40, onViewChange: "viewChanged", components: []});
            this.$.formDiv.$.acc.createComponent({name: "qs",kind: "AccordionItem", headerTitle: "Questions about you", components: []});
        } else {
            this.$.formDiv.createComponent({name: "qbody", style: "height: 100%;", components: []});
        }
        this.$.formDiv.createComponents([{kind: "onyx.Button", fit: true, classes: "onyx-negative", content: "Cancel", ontap: "close", style: "width: 50%;"},{name: "submit", kind: "onyx.Button", fit: true, classes: "onyx-affirmative", content: "Submit", ontap: "buildAndSendSubmission", disabled: true, style: "width: 50%;"}], {owner: this});
        this.$.formDiv.render();
    },
    currentLocation: function(inSender, inEvent) {
        this.gps_location = inEvent.prop;
    },
    chosenLocation: function(inSender, inEvent) {
        this.chosen_location = inEvent;
    },
    photoData: function(inSender, inEvent) {
        //this.photoData = inEvent;
        LocalStorage.set("image", JSON.stringify(inEvent));
        //this.log(inEvent);
    },
    takePhoto: function() {
        this.log();
        var t = this.$;
        /*************
         * NOTES
         *
         * //EncodingType not supported in android, defaults to JPEG
         *
         * //Camera.DestinationType.DATA_URL may cause memory issues on some
         * //devices
         *
         * //quality set to 49 to avoid memory errors on some iOS devices
         */

        var options = {
            quality: 25,
            destinationType: Camera.DestinationType.FILE_URI,
            EncodingType: Camera.EncodingType.JPEG
        };
        navigator.camera.getPicture(enyo.bind(t, this.onPhotoSuccess), enyo.bind(t, this.onPhotoFail), options);
    },
    onPhotoSuccess: function(inURI) {
        //this.photoButton.setContent("Retake Photo");
        var src = /*"data:image/jpeg;base64," +*/ inURI;
        this.$.imgDiv.createComponent({name: "myImage", kind: "enyo.Image", src: "./assets/leaf-2.jpg"});//src});
        this.$.imgDiv.render();
        this.$.submit.setDisabled(false);
        this.camComplete = true;
        //console.log(this.camComplete);
        enyo.Signals.send("onPhotoData", inURI);
        //this.doPhotoOk();
        //this.photoOk();
    },
    onPhotoFail: function(inStuff) {
        console.log(inStuff);
    },
    retakePhoto: function()
    {
        if(!this.complex && this.$.imgDiv.getComponents().length >0) {
            this.$.imgDiv.destroyComponents();
        }
        //this.takePhoto();
        this.onPhotoSuccess();
    },
    viewChanged: function(inSender, inEvent)
    {
        //TODO
    },
    openNext: function() {
        if(this.complex) {
            var array = this.$.formDiv.$.acc.getItems();
            var view = this.$.formDiv.$.acc.getActiveView();
            this.log(this.$.formDiv.$.acc.getActiveView());
            if(view === false) {
                this.$.formDiv.$.acc.toggleItem(array[0]);
            }
        }
        return true;
    },
    photoOk: function() {
        /*var view = this.$.accordion.getActiveView();
          var array = this.$.accordion.getItems();
          for(x in array) {
          if(array[x] === view) {
                var index = ++x;
                this.$.accordion.toggleItem(array[index]);
                view.$.accordionItemHeader.addStyles("background-color: green;");
                */
                this.log();
            /*}
        }*/
        return true;
    },
    utf8_encode: function(argString) {
        // Encodes an ISO-8859-1 string to UTF-8  
        // 
        // version: 1109.2015
        // discuss at: http://phpjs.org/functions/utf8_encode
        // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: sowberry
        // +    tweaked by: Jack
        // +   bugfixed by: Onno Marsman
        // +   improved by: Yves Sucaet
        // +   bugfixed by: Onno Marsman
        // +   bugfixed by: Ulrich
        // +   bugfixed by: Rafal Kukawski
        // *     example 1: utf8_encode('Kevin van Zonneveld');
        // *     returns 1: 'Kevin van Zonneveld'
        if (argString === null || typeof argString === "undefined") {
            return "";
        }

        var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var utftext = "",
        start, end, stringl = 0;

        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
            } else {
                enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.slice(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }

        if (end > start) {
            utftext += string.slice(start, stringl);
        }

        return utftext;
    },
    encodeAsBase64: function(data) {
        // Encodes string using MIME base64 algorithm  
        // 
        // version: 1109.2015
        // discuss at: http://phpjs.org/functions/base64_encode
        // +   original by: Tyler Akins (http://rumkin.com)
        // +   improved by: Bayron Guevara
        // +   improved by: Thunder.m
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Pellentesque Malesuada
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Rafał Kukawski (http://kukawski.pl)
        // -    depends on: utf8_encode
        // *     example 1: base64_encode('Kevin van Zonneveld');
        // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
        // mozilla has this native
        // - but breaks in 2.0.0.12!
        //if (typeof this.window['atob'] == 'function') {
        //    return atob(data);
        //}
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];

        if (!data) {
            return data;
        }

        data = this.utf8_encode(data + '');

        do { // pack three octets into four hexets
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);

        enc = tmp_arr.join('');

        var r = data.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    },
    setTaskData: function(inData) {
        this.task = inData.tasks[0];// this is hardcoded for now to assume 1 task
        this.campTitle = inData.title;
        questionBody = [];

        //CLEAR EVERYTHING FROM BEFORE
        if(this.$.formDiv.getComponents().length > 0) {
            this.$.formDiv.destroyClientControls();
            this.$.formDiv.destroy();
        }
        this.recreate();
        
        if(this.complex)
            questionBody.push(this.$.formDiv.$.acc.$.qs.$.accordionItemContent);
        else
            questionBody.push(this.$.formDiv.$.qbody);

        //STEP THROUGH EACH QUESTION FROM THE SERVER
        for (i in this.task.questions) {
            var curQ = this.task.questions[i];
            var nomme = "name_"+curQ.id;
            type = curQ.type;
            if(type.indexOf("complex") != -1) {
               type = "counter";
               var numLoc = type.search(/\d/);
               var num = 0;
               if(numLoc != -1)
                   var num = type.charAt(numLoc);
               if(num != questionBody.length && this.complex) {
                   var qs = "qs"+(num+1);
                   this.$.formDiv.$.acc.createComponent({name: qs, prepend: false, kind: "AccordionItem", headerTitle: "Counts Bicycles and/or Pedestrians", components: []});
                   this.$.formDiv.$.acc.render();
                   //this.log(this.$.
                   questionBody.push(this.$.formDiv.$.acc.$[qs].$.accordionItemContent);

               }


            }
            switch(type) {
                case "text":
                    questionBody[0].createComponent({name: nomme, content: curQ.question});
                    this.newFormText(curQ);
                break;
                case "exclusive_multiple_choice":
                    questionBody[0].createComponent({name: nomme, content: curQ.question});
                    this.newFormExclusiveChoice(curQ);
                    break;
                case "multiple_choice":
                    questionBody[0].createComponent({name: nomme, content: curQ.question});
                    this.newFormMultipleChoice(curQ);
                    break;
                case "counter":
                    this.newFormCounter(curQ);
                    break;
                case "cur_time":
                    this.newTime(curQ);
                    break;
                default: 
                    break;
            }

            //INSERT A HORIZONTAL DELIMITER
        }
        //if(this.complex) {
            for (var x in questionBody)
                questionBody[x].render();
        /*} else {
            this.$.formDiv.render();
        }*/

    },
    fileEntry: function(inURI) {
        window.resolveLocalFileSystemURI(inURI, this.getImageData, null);
    },
    getImageData: function(inURI) {
        read = new FileReader();
        console.log(inURI);
        read.onloadend = function(e) {
            console.log(e.target.result);
        }
        var t = read.readAsDataURL(inURI);
        console.log(t);
        /*var imgCall = new enyo.Ajax({url: inURI, handleAs: "text",sync: true});
        imgCall.response(this, "makeImageSend");
        imgCall.go();*/
    },
    makeImageSend: function(inSender, inResponse) {
        //this.log(btoa(this.utf8_encode(inResponse)));
        var t = btoa(this.utf8_encode(inResponse));
        this.$.senses.createComponent({kind: "enyo.Image", src: "data:image/jpeg;base64,"+t}); 
        this.render();
        //this.log(window.btoa(inResponse).toString());

            var params = "image?";
            var d = new Date();
            var month = (d.getMonth()+1).toString();
            while (month.length < 2)
                month = '0'+month;
            var days = d.getDate().toString();
            while (days.length < 2)
                days = '0'+days;
            var dateString = d.getFullYear().toString() + month.toString() + days.toString() +"_"+d.getHours().toString()+d.getMinutes().toString()+d.getSeconds().toString();
            params += "userName=" + Data.getUserName(LocalStorage.get("user")) + "&";
            params += "imageFileName=" + this.campTitle.replace(/ /g, "%20") + "_" + dateString + ".jpg&";
            //params += "imageString=" + this.encodeAsBase64(JSON.stringify(inResponse))
            //params += "imageString=" + window.btoa((JSON.stringify(inResponse)))
            var url = Data.getURL()+params;

            var call = new enyo.Ajax({method: "POST", url: url, contentType: "image/jpeg"});
            call.response(this, "imageSubmission");
            //call.go();
    },
    buildAndSendSubmission: function() {
        if(!this.$.submit.disabled) {

            this.fileEntry(this.$.imgDiv.$.myImage.src);
            if(this.imageOK) {
                //SETUP THE SUBMISSION OBJECT NEEDED
                var sub =  {"submission": {
                    "task_id": this.task.id,
                    "gps_location":"testy test",
                    "user_id": 5, // THIS GETS RESET BELOW
                    "img_path":"test",
                    "answers": []
                }};

                var locString = this.gps_location.latitude + "|" + this.gps_location.longitude;
                sub.submission.gps_location = locString;
                //SET user_id BASED ON CURRENT LOGGED IN USER
                sub.submission.user_id = LocalStorage.get("user");
                for(i in this.task.questions) {
                    var curQ = this.task.questions[i];
                    //CREATE AN INDIVIDUAL ANSWER OBJECT
                    var q = {
                        "answer":"BOOM",
                        "type": curQ.type,
                        "q_id": curQ.id,
                        "sub_id": 0 //THIS GETS RESET SERVERSIDE
                    };

                    switch(curQ.type) {
                        case "text":
                            q.answer = this.readFormText(curQ);
                        break;
                        case "exclusive_multiple_choice":
                            q.answer = this.readFormExclusiveChoice(curQ);
                        break;
                        case "multiple_choice":
                            q.answer = this.readFormMultipleChoice(curQ);
                        break;
                        case "counter":
                            q.answer = this.readFormCounter(curQ);
                        break;
                        default: 
                            break;
                    }
                    sub.submission.answers.push(q);
                }

                //FOR NOW, LATER ON WE'LL SEND THIS TO THE SERVER
                this.log("SENDING TO SERVER: "+JSON.stringify(sub));

                var url = Data.getURL() + "submission.json";
                var req  = new enyo.Ajax({contentType:"application/json", method: "POST", url: url, postBody: JSON.stringify(sub), handleAs: "json"});
                //req.postBody = JSON.stringify(sub);
                req.response(this, "handlePostResponse");
                req.go();
            }
        }
    },
    handlePostResponse: function(inSender, inResponse) {
        this.log("SERVER RESPONSE CAME BACK");
        this.bubble("onSubmissionMade");
        this.camComplete = false;
        this.$.submit.setDisabled(true);
        this.chosen_location = undefined;
        LocalStorage.remove("image");
        //this.photoData = undefined;
        this.imageOK = false;
        if(this.$.imgDiv.getComponents().length >0) {
            this.$.imgDiv.destroyComponents();
        }
        //this.doSubmissionMade();
    },
    imageSubmission: function(inSender, inResponse) {
        this.log(JSON.stringify(inSender));
        this.log(JSON.stringify(inResponse));
    },
    close: function() {
        //this.doSubmissionMade();
        this.bubble("onSubmissionMade");
    },
    setReady: function() {
        this.devReady = true;
    },
    testButtons: function(inSender, inEvent) {
        enyo.Signals.send("onButtonGroupChosen", inSender.content);
    },

    /**************************************
     * FORM CREATION
     **************************************/
    newFormText: function(curQ) {
        var dec = "inputDec_"+curQ.id;
        var nom = "input_"+curQ.id;

        //CREATE THE COMPONENT
        questionBody[0].createComponent({name: dec, kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [ {name: nom, kind: "onyx.Input", classes: "onyx-input", defaultFocus: true}]}, {owner: questionBody[0]});
    },
    newFormExclusiveChoice: function(curQ) {
        var nom = "input_"+curQ.id;
        var opts = curQ.options.split("|");
        var tmp = [];

        for(i in opts) {
            //COLLECT EACH OF THE OPTIONS
            tmp.push({content: opts[i], ontap: "testButtons"});
        }

        //CREATE THE COMPONENT
        questionBody[0].createComponent({name: nom, kind: "onyx.RadioGroup", components: tmp}, {owner: this});
    },
    newTime: function(curQ) {
        var d = new Date();
        var s = d.toTimeString().split(' ')[0];
        questionBody[0].createComponent({content: curQ.question});
        questionBody[0].createComponent({content: s});
    },
    newFormMultipleChoice: function(curQ) {
        var opts = curQ.options.split("|");

        //CREATE THE WRAPPER BOX
        questionBody[0].createComponent({name: "groupbox", kind: "onyx.Groupbox", components: []});

        for (i in opts) {
            var nom = "checkbox_"+i;
            var nom2 = "content_"+i;
            var tmp2 = [];

            //CREATE THE CHECKBOX
            questionBody[0].$.groupbox.createComponent({name: nom, kind: "onyx.Checkbox", style: "float: left; clear: left;"});

            //CREATE THE LABEL
            questionBody[0].$.groupbox.createComponent({name: nom2, content: opts[i], style: "float: left; clear: right;"});

            //BREAK LINES AFTER EACH CHECKBOX/LABEL PAIR
            questionBody[0].$.groupbox.createComponent({tag: "br"});
        }
    },
    newFormCounter: function(curQ) {
        //SETUP A SPECIAL COUNTER CONTROL
        var nomme = "name_"+curQ.id;
        var nom = "counter_"+curQ.id;
        var id;

        //CREATE THE COMPONENT
        for(x in this.task.questions) {
            if(this.task.questions[x].type === "exclusive_multiple_choice") {
                id = this.task.questions[x].id.toString();
                break;
            }
        }
        var string = "input_"+id;
        if(curQ.type.split("_")[1].indexOf('2') === -1) {
            this.log(questionBody[1]);
            questionBody[1].createComponent({name: nom, kind: "BikeCounter", title: curQ.question, style: "clear: both;"});
        } else {
            questionBody[2].createComponent({name: nom, kind: "BikeCounter", title: curQ.question, style: "clear: both;"});
        }
    },


    /**************************************
     * FORM READING
     **************************************/

    readFormText: function(curQ) {
        //READ FREE TEXT INPUT
        var name = "input_"+curQ.id;
        return questionBody[0][name].getValue();
    },
    readFormExclusiveChoice: function(curQ) {
        //READ RADIO BUTTON GROUP
        var name = "input_"+curQ.id;
        var buttons = questionBody[0][name].children;
        //this is a bad hack
        for(x in buttons)
            if(buttons[x].hasClass("active"))
                return buttons[x].getContent();
    },
    readFormMultipleChoice: function(curQ) {
        //READ CHECKBOX CHOICES
        var tmp = [];
        for(i in curQ.options.split("|")) {
            var name2 = "checkbox_"+i;
            var contName = "content_"+i;
            if(questionBody[0].$.groupbox.$[name2].getValue())
                tmp.push(questionBody[0].$.groupbox.$[contName].getContent());
        }
        return tmp.join("|"); //after we've collected the checkboxes
    },
    readFormCounter: function(curQ) {
        var nom = "counter_"+curQ.id;
        return this.$.qbody.$[nom].getCount();
    }
});
