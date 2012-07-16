enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	components: [
					
		{kind: "Accordion", fit: true, headerHeight: 40, onViewChange: "viewChanged", components: [
			
		
			// Item 1
			{kind: "AccordionItem", headerTitle: "About", contentComponents:[
				{style: "padding:10px;", components:[
					
					{content: "What Am I?", classes: "contentHeader"},
					
					{content: "This is an accordion kind for Enyo 2."},{tag: "br"},
					{content: "Tap/Click on an accordion item to toggle (open/close) that item. Only 1 item can be open at a time, however all items can be closed at the same time."},{tag: "br"},
					
					{classes: "spacer"},
					
					{content: "Requires", classes: "contentHeader"},
					{tag: "ul", components:[
						{tag: "li", components:[ {content: "lib/onyx"} ]}
					]},
					{content: "onyx.Animator", classes: "description"},
					{classes: "spacer"},
					
					
					{content: "Notes", classes: "contentHeader"},
					{tag: "ul", components:[
						{tag: "li", components:[ {content: "Currently, only vertical layout is supported"} ]}
					]}
					
				]}
			]},
			
			
			
			// Item 2
			{kind: "AccordionItem", headerTitle: "Accordion Code", contentComponents: [
				{style: "padding:10px;", components:[
				
					{content: "Include the lib", classes: "contentHeader"},
					
					{content: "You need to include this custom lib in your project, in addition to enyo & onyx.", classes: "description"},
					{tag:"pre", content: '&lt;script src="../../../../../enyo/enyo.js" type="text/javascript"&gt;&lt;/script&gt;<br />&lt;script src="../../../../../lib/onyx/package.js" type="text/javascript"&gt;&lt;/script&gt;<br />&lt;script src="../../Accordion/package.js" type="text/javascript"&gt;&lt;/script&gt;', allowHtml: true},{classes: "spacer"},
			
					{content: "Instantiate", classes: "contentHeader"},
					
					{content: "To instantiate an accordion control:", classes: "description"},
					{tag:"pre", content: '{kind: "Accordion", headerHeight: 40, onViewChange: "viewChanged", components: [<br /><br />&nbsp;&nbsp;// First item of accordion<br />&nbsp;&nbsp;{kind: "AccordionItem", headerTitle: "Accordion Header 1", contentComponents: [<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Add whatever you want here<br />&nbsp;&nbsp;]},<br /><br />&nbsp;&nbsp;// Second item of accordion<br />&nbsp;&nbsp;{kind: "AccordionItem", headerTitle: "Accordion Header 2", contentComponents: [<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Add whatever you want here<br />&nbsp;&nbsp;]}<br /><br />]}', allowHtml: true},{classes: "spacer"},
					
					
					{content: "Published Properties", classes: "contentHeader"},
					
					{tag: "ul", components:[
						{tag: "li", components:[ {content: "headerHeight: 40"} ]}
					]},
					{content: "Integer: Specifies the height of the visible tap/click area for the accordion's items. Defaults to 40px.", classes: "description"},
					{classes: "spacer"},
					
					
					{content: "Methods", classes: "contentHeader"},
					
					{tag: "ul", components:[
						{tag: "li", components:[ {content: ".getItems( )"} ]}
					]},
					{content: "Returns an array of objects, containing the items in the accordion.", classes: "description"},
					{tag: "pre", content: "this.$.accordion.getItems( )"},
					{classes: "spacerBullet"},
					
					
					{tag: "ul", components:[
						{tag: "li", components:[ {content: ".toggleItem( index )"} ]}
					]},
					{content: "Toggles (open/close) the index position item of the accordion.", classes: "description"},
					{tag: "pre", content: "var index = 0;<br />this.$.accordion.toggleItem( this.$.accordion.getItems()[ index ] )", allowHtml: true},
					{classes: "spacer"},
					
					{content: "Events", classes: "contentHeader"},
					{tag: "ul", components:[
						{tag: "li", components:[ {content: "onViewChange: \"\""} ]}
					]},
					{content: "Returns the object containing the currently open accordion item. Returns false if all items are toggled closed.", classes: "description"}
				
				]}
			]},
			
			
			
			// Item 3
			{kind: "AccordionItem", headerTitle: "Random Content", contentComponents: [
				{style: "padding:10px;", components:[
					
					{content: "Random controls to fill space", classes: "contentHeader"},
					{tag: "br"},
				
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", placeholder: "Input"}
					]},
					{tag: "br"},{tag: "br"},
					{kind: "onyx.RadioGroup", controlClasses: "onyx-tabbutton", components: [
						{content: "Alpha", active: true},
						{content: "Beta"},
						{content: "Gamma"}
					]},
					{tag: "br"},
					{kind: "Group", classes: "tools group", defaultKind: "onyx.Button", highlander: true, components: [
						{content: "Button A", active: true, classes: "onyx-affirmative"},
						{content: "Button B", classes: "onyx-negative"},
						{content: "Button C", classes: "onyx-blue"}
					]},
					{tag: "br"},
					{defaultKind: "onyx.Checkbox", components: [
						{},
						{},
						{value: true}
					]},
					{tag: "br"}
					
				]}	
			]}			
			
			
			
		]}		
	]
	
	/*
	getItems: function() {
		this.$.myOutput.setContent( this.$.accordion.getItems() );
	},
	
	toggleItem: function() {
		var index = 1;
		
		// The following 2 calls do the same thing
		this.$.accordion.toggleItem(this.$.accordion.getItems()[index] );
		//this.$.accordion.getItems()[index].toggleItem();
	},
	
	viewChanged: function(inSender, inEvent) {
		//console.log(inSender.activeView);
		var activeView = (inSender.activeView) ? inSender.activeView.name : "Not viewing anything.";
		//this.$.myOutput.setContent(activeView);
	}
	*/
});
