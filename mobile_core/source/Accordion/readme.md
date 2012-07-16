Accordion for Enyo 2
====================

About
-----

This is an accordion kind for Enyo 2. Tap/Click on an accordion item to toggle (open/close) that item. Only 1 item can be open at a time, however all items can be closed at the same time.


How to Use
----------

First include the Accordion lib:

	<script src="../../../Accordion/package.js" type="text/javascript"></script>

Then instantiate your accordion kind:

	{kind: "Accordion", headerHeight: 40, onViewChange: "viewChanged", components: [
		
		// First item of accordion
		{kind: "AccordionItem", headerTitle: "Accordion Header 1", contentComponents:[
			// Add whatever you want here
		]},
		
		// Second item of accordion
		{kind: "AccordionItem", headerTitle: "Accordion Header 2", contentComponents:[
			// Add whatever you want here
		]}
		
	]}


Properties
----------

- headerHeight -> Integer: Specifies the height in pixels of the visible tap/click area for the accordion's items. Defaults to 40.


Methods
-------
	
- getItems() -> Returns an array of objects, containing the items in the accordion.
- toggleItem(index) -> Toggles (open/close) the index position item of the accordion. Ex: this.$.accordion.toggleItem( this.$.accordion.getItems()[ 0 ] )


Events
------

- onViewChange: "" -> Returns the object containing the currently open accordion item. Returns false if all items are toggled closed.


Demos
-----

- http://www.variablelimit.com/enyo/lib/germboy/Accordion/examples/accordion-stretched/
- http://www.variablelimit.com/enyo/lib/germboy/Accordion/examples/accordion-sized/