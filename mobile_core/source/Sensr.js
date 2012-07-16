enyo.kind({
    name: "Sensr",
    kind: "enyo.Control",
    style: "min-height: 100%;",
    published: {
    },
    events: {
        onSubmisisonMade: ""
    },
    handlers: {
        onSenseOpened: "openNext",
        onPhotoOk: "photoOk"
    },
    components: [
        {kind: "Accordion", style: "min-height: 100%;", headerHeight: 40, onViewChange: "viewChanged", components: [
            {kind: "AccordionItem", headerTitle: "Senses", contentComponents: [
                {kind: "onyx.Button", content: "-", style: "float: left;", classes: "onyx-negative", ontap: "retakePhoto"},
                {kind: "onyx.Button", content: "+", style: "float: right;", classes: "onyx-affirmative", ontap: "photoOk"}
            ],
            photoOk: function(inSender, inEvent)
            {
                this.bubble("onPhotoOk");
            },
            retakePhoto: function()
            {
                //TODO
            }
            },
            {name: "qs", kind: "AccordionItem", headerTitle: "Questions", contentComponents:[
                {name: "qbody", components: []}
            ]}
        ]},
        {kind: "onyx.Button", classes: "onyx-negative", content: "Cancel", ontap: "close", style: "width: 50%;"},
        {name: "submit", kind: "onyx.Button", classes: "onyx-affirmative", content: "Submit", ontap: "buildAndSendSubmission", disabled: true, style: "width: 50%;"}
    ],
    create: function(inSender, inEvent)
    {
        this.inherited(arguments);
    },
    viewChanged: function(inSender, inEvent)
    {
        //TODO
    },
    openNext: function() {
        var array = this.$.accordion.getItems();
        var view = this.$.accordion.getActiveView();
        this.log(this.$.accordion.getActiveView());
        if(view === false) {
            this.$.accordion.toggleItem(array[0]);
        }

        return true;
    },
    photoOk: function() {
        var view = this.$.accordion.getActiveView();
        var array = this.$.accordion.getItems();
        for(x in array) {
            if(array[x] === view) {
                var index = ++x;
                this.$.accordion.toggleItem(array[index]);
                view.$.accordionItemHeader.addStyles("background-color: green;");
                this.camComplete = true;
                this.$.submit.setDisabled(false);
            }
        }
        return true;
    },
    setTaskData: function(inData) {
        this.task = inData;

        //CLEAR EVERYTHING FROM BEFORE
        if(this.$.qs.$.qbody.getComponents().length > 0) {
            this.$.qs.$.qbody.destroyComponents();
        }

        //STEP THROUGH EACH QUESTION FROM THE SERVER
        for (i in this.task.questions) {
            var curQ = this.task.questions[i];
            var nomme = "name_"+curQ.id;
            this.$.qs.$.qbody.createComponent({name: nomme, content: curQ.question});
            switch(curQ.type) {
                case "text":
                    this.newFormText(curQ);
                    break;
                case "exclusive_multiple_choice":
                    this.newFormExclusiveChoice(curQ);
                    break;
                case "multiple_choice":
                    this.newFormMultipleChoice(curQ);
                    break;
                case "counter":
                    this.newFormCounter(curQ);
                    break;
                default: 
                    break;
            }

            //INSERT A HORIZONTAL DELIMITER
            this.$.qs.$.qbody.createComponent({tag: "hr"});
        }
        this.$.qs.render();
    },
    buildAndSendSubmission: function() {
        //SETUP THE SUBMISSION OBJECT NEEDED
        var sub =  {"submission": {
            "task_id": this.task.id,
            "gps_location":"testy test",
            "user_id": 5, // THIS GETS RESET BELOW
            "img_path":"test",
            "answers": []
        }};

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
        var req  = new enyo.Ajax({contentType:"application/json", method: "POST", url: url, postBody: JSON.stringify(sub)});
        //req.postBody = JSON.stringify(sub);
        req.response(this, "handlePostResponse");
        req.go();
    },
    handlePostResponse: function(inSender, inResponse) {
        this.log("SERVER RESPONSE CAME BACK");
        this.bubble("onSubmissionMade");
        //this.doSubmissionMade();
    },
    close: function() {
        //this.doSubmissionMade();
        this.bubble("onSubmissionMade");
    },

    /**************************************
     * FORM CREATION
     **************************************/
    newFormText: function(curQ) {
        var dec = "inputDec_"+curQ.id;
        var nom = "input_"+curQ.id;

        //CREATE THE COMPONENT
        this.$.qs.$.qbody.createComponent({name: dec, kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [ {name: nom, kind: "onyx.Input", classes: "onyx-input", defaultFocus: true}]});
    },
    newFormExclusiveChoice: function(curQ) {
        var nom = "input_"+curQ.id;
        var opts = curQ.options.split("|");
        var tmp = [];

        for(i in opts) {
            //COLLECT EACH OF THE OPTIONS
            tmp.push({content: opts[i]});
        }

        //CREATE THE COMPONENT
        this.$.qs.$.qbody.createComponent({name: nom, kind: "onyx.RadioGroup", components: tmp});
    },
    newFormMultipleChoice: function(curQ) {
        var opts = curQ.options.split("|");

        //CREATE THE WRAPPER BOX
        this.$.qs.$.qbody.createComponent({name: "groupbox", kind: "onyx.Groupbox", components: []});

        for (i in opts) {
            var nom = "checkbox_"+i;
            var nom2 = "content_"+i;
            var tmp2 = [];

            //CREATE THE CHECKBOX
            this.$.qs.$.qbody.$.groupbox.createComponent({name: nom, kind: "onyx.Checkbox", style: "float: left; clear: left;"});

            //CREATE THE LABEL
            this.$.qs.$.qbody.$.groupbox.createComponent({name: nom2, content: opts[i], style: "float: left; clear: right;"});

            //BREAK LINES AFTER EACH CHECKBOX/LABEL PAIR
            this.$.qs.$.qbody.$.groupbox.createComponent({tag: "br"});
        }
    },
    newFormCounter: function(curQ) {
        //SETUP A SPECIAL COUNTER CONTROL
        var nom = "counter_"+curQ.id;

        //CREATE THE COMPONENT
        this.$.qs.$.qbody.createComponent({name: nom, kind: "Counter", title: curQ.question});
    },


    /**************************************
     * FORM READING
     **************************************/

    readFormText: function(curQ) {
        //READ FREE TEXT INPUT
        var name = "input_"+curQ.id;
        return this.$.qs.$.qbody.$[name].getValue();
    },
    readFormExclusiveChoice: function(curQ) {
        //READ RADIO BUTTON GROUP
        var opts = curQ.options.split("|");
        var name = "input_"+curQ.id;
        var buttons = this.$.qs.$.qbody.$[name].children;
        //this is a bad hack
        for(x in buttons)
            if(buttons[x].hasClass("active"))
                return buttons[x].getContent();
    },
    readFormMultipleChoice: function(curQ) {
        //READ CHECKBOX CHOICES
        var tmp = [];
        this.log(this.$.qs.$.qbody.$.groupbox.$);
        for(i in curQ.options.split("|")) {
            var name2 = "checkbox_"+i;
            var contName = "content_"+i;
            if(this.$.qs.$.qbody.$.groupbox.$[name2].getValue())
                tmp.push(this.$.qs.$.qbody.$.groupbox.$[contName].getContent());
        }
        return tmp.join("|"); //after we've collected the checkboxes
    },
    readFormCounter: function(curQ) {
        var nom = "counter_"+curQ.id;
        return this.$.qs.$.qbody.$[nom].getCount();
    }
});
