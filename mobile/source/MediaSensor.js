enyo.kind({
	name: "MediaSensor",
	kind: enyo.FittableRows,
	published: {
		type: "camera",
		readyToUpload: false,
		recorded: false,
		completed: false,
	},
	handlers: {
		onSendFiles: "uploadFile",
	},
	events: {
		onComplete: "",
		onFailed: ""
	},
	components: [
		{name: "mediaDiv", components: [
			{name: "img", kind: enyo.Image, src: "filler", style: "width: 100%;", showing: false},
			{name: "videoCont", tag: "video", showing: false, style: "width: 100%;", attributes: {width: "320", autobuffer: "", controls: ""}, ontap: function() {this.play();}, components: [
				{name: "video", tag: "source", attributes: {src: "filler"}}
			]},
			{name: "playButton", content: "Play back", kind: enyo.Button, classes: "button-style", style: "width: 80%; margin-left: 10%; margin-right: 10%;", ontap: "playback", showing: false, components: [
				{name: "content", tag: "i", classes: "icon-play"}
			]}
		]},
		{name: "mediaButton", kind: onyx.Button, classes: "button-style", style: "width: 80%; margin-left: 10%; margin-right: 10%;", content: "Record", ontap: "parseAndRecordSensor"}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.mediaFile = {};
		if(this.type !== "camera") {
			this.$.mediaButton.setContent(this.$.mediaButton.getContent() + " " + this.type);
		} else {
			this.$.mediaButton.setContent("Take photo");
		}
		if(this.type === "video")
			this.playing = false;
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
		this.log(this.$.img.hasNode());
	},
	captureImage: function() {
    navigator.device.capture.captureImage(enyo.bind(this, "captureSuccess"), enyo.bind(this, "captureError"), {limit: 1});
  },
  captureAudio: function() {
    navigator.device.capture.captureAudio(enyo.bind(this, "captureSuccess"), enyo.bind(this, "captureError"));
  },
  captureVideo: function() {
    navigator.device.capture.captureVideo(enyo.bind(this, "captureSuccess"), enyo.bind(this, "captureError"));
  },
  captureSuccess: function(mediaFiles) {
    this.mediaFile = mediaFiles[0];
    //this is a stupid hack
    var path = "";
    if(enyo.platform.ios) { // iOS doesn't use a file:/ URI for file paths so we have to do this differently
      /*if(this.type === "video")
        path = "file:/" + this.mediaFile.fullPath;
        else */
      path = "file://" + this.mediaFile.fullPath;
    } else {
      path = this.mediaFile.fullPath.replace("file:/", "file://");
    }
    window.resolveLocalFileSystemURI(path, enyo.bind(this, "fileEntrySuccess"), enyo.bind(this, "fileEntryFail"));
  },
  captureError: function(error) {
    this.log(error.message);
    this.log(error.code);
    alert("CAPTURE FAILED");
  },
	fileEntrySuccess: function(input) {
		this.fileEntry = input;

		switch(this.type) {
			case "camera":
				this.$.img.setSrc(this.fileEntry.toURL());
				this.$.img.setShowing(true);
				this.$.img.render();
				break;
			case "video":
				this.log(JSON.stringify(this.mediaFile));
				this.$.video.setAttributes({src: this.fileEntry.toURL()});
				this.$.video.render();
				this.$.videoCont.render();
				this.log(this.hasNode().innerHTML);
				this.$.videoCont.setShowing(true);
				break;
			case "audio":
				this.$.playButton.setShowing(true);
				break;
			default:
				break;
		}
		this.$.mediaDiv.render();
		this.$.mediaDiv.resized();
		this.readyToUpload = true;
		this.recorded = true;

		return true;
	},
	fileEntryFail: function(input) {
		alert("FILE FAIL");
		alert(JSON.stringify(input));
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
			this.audioVideoMedia.stop();
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
  uploadFile: function(inSender, inEvent) {
		this.log("UPLOAD");
		var mimeType = this.mediaFile.type;
		var path     = this.mediaFile.fullPath;
		var filename = this.mediaFile.name;

    var options = new FileUploadOptions();
    options.fileKey  = "media";
    options.fileName = filename;
		if(enyo.platform.ios && this.type === "audio") { // iOS doesn't give us a mime-type, so we do this differently
			options.mimeType = "audio/wav";
    } else {
			options.mimeType = mimeType;
      options.params   = {"username": "username", "q_id": "100", "sub_id": "9001", "answer_type": "media_" + this.type};
    }

		if(this.fileEntry !== undefined) {
			var ft = new FileTransfer();
			ft.upload(this.fileEntry.toURL(), encodeURI(Data.getURL() + "answer.json"), enyo.bind(this, "uploadSuccess"), enyo.bind(this, "uploadError"), options);
    }
  },
  uploadSuccess: function(r) {
    this.log("Code = " + r.responseCode);
    this.log("Response = " + r.response);
    this.log("Sent = " + r.bytesSent);
    this.completed = true;
    this.bubble("onComplete");
  },
  uploadError: function(error) {
    this.log("upload error source " + error.source);
    this.log("upload error target " + error.target);
    alert(JSON.stringify(error));
  }
});
