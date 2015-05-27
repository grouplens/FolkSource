/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "FolkSource.WebApplication",
	kind: "enyo.Application",
	view: "FolkSource.MainView"
});

enyo.ready(function () {
	new myapp.Application({name: "app"});
});
