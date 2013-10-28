enyo.kind({
	name: "MediaSensor",
	kind: enyo.FittableRows,
	published: {
		type: "camera",
		sendAutomatically: true
	},
	handlers: {
		onSubmissionMade: "uploadFile"
	},
	components: [
		{name: "mediaDiv", components: [
			{name: "img", kind: enyo.Image, src: "filler", style: "width: 50%; height: 50%; margin-left: auto; margin-right: auto;", showing: false},
			{name: "playButton", content: "Play back", kind: enyo.Button, classes: "button-style", style: "width: 100%;", ontap: "playback", showing: false, components: [
				{name: "content", tag: "i", classes: "icon-play"}
   			]}
		]},
		{name: "mediaButton", kind: onyx.Button, classes: "button-style", style: "width: 100%;", content: "Record", ontap: "parseAndRecordSensor"}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.mediaFile;
		if(this.type != "camera") {
			this.$.mediaButton.setContent(this.$.mediaButton.getContent() + " " + this.type);
		} else {
			this.$.mediaButton.setContent("Take photo");
		}
		this.playing = false;
	},
	captureImage: function() {
        navigator.device.capture.captureImage(enyo.bind(this, "captureSuccess"), enyo.bind(this, "captureError"));
    },
    captureAudio: function() {
        navigator.device.capture.captureAudio(enyo.bind(this, "captureSuccess"), enyo.bind(this, "captureError"));
    },
    captureVideo: function() {
        navigator.device.capture.captureVideo(enyo.bind(this, "captureSuccess"), enyo.bind(this, "captureError"));
    },
    captureSuccess: function(mediaFiles) {
		this.log("c begin");
		this.mediaFile = mediaFiles[0];
		window.resolveLocalFileSystemURI(decodeURI(this.mediaFile.fullPath), enyo.bind(this, "fileEntrySuccess"), enyo.bind(this, "fileEntryFail"));
		this.render();
		this.log("c end");
    },
    captureError: function(error) {
		this.log("CAPTURE FAILED");
        this.log(error.message);
        this.log(error.code);
    },
	fileEntrySuccess: function(input) {
		this.log("f begin");
		this.fileEntry = input;

		switch(this.type) {
			case "camera":
				this.$.img.setSrc(this.fileEntry.toURL());
				this.$.img.render();
				this.$.img.setShowing(true);
				break;
			case "video":
			case "audio":
				this.log("new media");
				this.$.playButton.setShowing(true);
				break;
			default: 
				break;
		}
		this.log("f end");
		return true;
		/*this.$.mediaDiv.render();
		this.$.mediaDiv.resized();
		if(this.automaticallySend)
        	uploadFile(this.mediaFile);*/
	},
	fileEntryFail: function(input) {
		this.log(input);
	},
	parseAndRecordSensor: function(inSender, inEvent) {
		switch(this.type) {
			case "camera":
				this.captureImage();
				break;
			case "video":
				this.captureVideo();
				break;
			case "audio":
				this.captureAudio();
				break;
			default: 
				break;
		}
	},
	playback: function(inSender, inEvent) {
		if(this.playing) {
			this.audioVideoMedia.pause();
			this.$.content.addRemoveClass("icon-play", true);
			this.$.content.addRemoveClass("icon-pause", false);
		} else {
			this.playing = true;
			this.audioVideoMedia = new Media(this.fileEntry.toURL(), enyo.bind(this, "playbackSuccess"), enyo.bind(this, "playbackFail"));
			this.audioVideoMedia.play();
			this.$.content.addRemoveClass("icon-play", false);
			this.$.content.addRemoveClass("icon-pause", true);
		}
	},
	playbackSuccess: function(input) {
		this.log("PLAYBACK");
		this.$.content.addRemoveClass("icon-play", true);
		this.$.content.addRemoveClass("icon-pause", false);
		this.audioVideoMedia.release();
		this.playing = false;
	},
	playbackFail: function(input) {
		this.log("PLAYBACK FAILED");
		this.audioVideoMedia.release();
	},
    uploadFile: function(input) {
        //If uploadFile is called as the success callback from navigator.device.capture, then mediaFile is a MediaFile object.
        //If uploadFile is called as the success callback from navigator.camera.getPicture, then mediaFile is a path name string.

        /*if (typeof this.mediaFile === 'string'){
            mimeType = "image/jpeg"
            path     = this.mediaFile
        } else {*/
	   this.log("UPLOAD");
			var mimeType = this.mediaFile.type;
			var path     = this.mediaFile.fullPath;
            this.log("mediaFile:");
            this.log(mediaFile);
            this.log("mediaFile.type:");
            this.log(mediaFile.type);
            //For some reason mediaFile.type == undefined with audio. This fixes that:
            if (mimeType == undefined) {mimeType = "audio/wav";}
        //}*/

        var options = new FileUploadOptions();
        options.fileKey  = "media";
        options.fileName = "foobarfilename";
        //options.mimeType = mimeType;
        options.params   = {"username": "username", "q_id": "9001", "sub_id": "9001", "answer_type": "media"};

        var ft = new FileTransfer();
        ft.upload(input.fullPath, encodeURI(Data.getURL() + "answer.json"), this.uploadSuccess, this.uploadError, options);
    },
    uploadSuccess: function(r) {
        this.log("Code = " + r.responseCode);
        this.log("Response = " + r.response);
        this.log("Sent = " + r.bytesSent);
        this.log(r);
    },
    uploadError: function(error) {
        this.log("upload error source " + error.source);
        this.log("upload error target " + error.target);
        this.log(error);
    }

});
