enyo.kind({
	name: "FolkSource.Application",
	kind: "enyo.Application",
	view: "FolkSource.MainView"
});


enyo.ready(function () {
	new FolkSource.Application({name: "app"});
});
