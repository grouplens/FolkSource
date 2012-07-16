enyo.kind({
	name: "AccordionItemHeader",
	classes: "accordionHeader",
	events: {
		onInit: "",
		onToggle: ""
	},
	//* @protected
	handlers: {
		ontap: "tap"
	},
	rendered: function() {
		this.inherited(arguments);
		this.bubbleUp("onInit");
	},
	tap: function(inSender, inEvent, silent) {
		silent = ((silent === undefined) || (silent === false)) ? false : true;
		this.bubbleUp("onToggle", silent);
		
	}
	
});





enyo.kind({
	name: "AccordionItemContent",
	classes: "accordionContent",
	handlers: {
		onResizeScroller: "resizeScroller"
	},
	rendered: function() {
		this.inherited(arguments);
		
		this.bubble("onAccordionContentInit");
		this.hide();
	}
});





enyo.kind({
	name: "AccordionItem",
	classes: "accordionItem",
	handlers: {
		onInit: "getHeader",
		onToggle: "_toggleItem",
		onResizeScroller: "resizeScroller",
		onResizeHeader: "resizeHeader"
	},
	published: {
		collapsed: true,
		maxHeight: undefined,
		minHeight: undefined,
		
		headerTitle: "no header defined",
		contentComponents: []
	},
	header: undefined,
	headerHeight: undefined,
	//* @protected
	components: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"}
	],
	
	create: function() {
		this.inherited(arguments);
		
		var headerComponent = { kind: "AccordionItemHeader", components:[{content: this.headerTitle}] };
		
		var wrappedComponents = [{kind: "enyo.Scroller", name: "scroller", components: this.contentComponents}];
		var contentComponent = { kind: "AccordionItemContent", components: wrappedComponents };
		
		this.createComponents([headerComponent, contentComponent]);
		
		
	},
	
	rendered: function() {
		this.inherited(arguments);
	},
	
	getHeader: function(inSender, inEvent) {
		this.header = inSender;
		//return true; // stop bubbling // but we dont stop so we can see this from Accordion root - is that what we want?
	},
	resizeHeader: function(inSender, props) {
		
		this.headerHeight = props.headerHeight;
		this.applyHeight(props.headerHeight, props.itemCount);
		
		return true;
	},
	toggleItem: function(silent) {
		this.header.tap(undefined, undefined, silent);
	},
	_toggleItem: function(inSender, silent) {
		
		(this.getCollapsed()) ? this.showItem(inSender) : this.hideItem(inSender);
		
		// If silent, don't bubble our onChange/onToggle event
		if (silent) return true;
		
	},
	showItem: function(inSender) {
		
		this.$.accordionItemContent.show();
		
		this.$.animator.play({
			startValue: this.getMinHeight(),
			endValue: this.getMaxHeight(),
			node: this.hasNode(),
			collapsed: false
		});
		
		inSender.addRemoveClass("accordionHeaderHighlight", true);
		this.setCollapsed(false);
	},
	hideItem: function(inSender) {
		
		this.$.animator.play({
			startValue: this.getMaxHeight(),
			endValue: this.getMinHeight(),
			node: this.hasNode(),
			collapsed: true
		});
		
		inSender.addRemoveClass("accordionHeaderHighlight", false);
		this.setCollapsed(true);
	},
	animatorStep: function(inSender) {
		this.applyStyle("height", inSender.value + "px");
		return true;
	},
	animatorComplete: function(inSender, inEvent) {
		
		if (inEvent.originator.collapsed) {
			this.$.accordionItemContent.hide();
		}
		
		return true;
	},
	applyHeight: function(headerHeight, itemCount) {
		
		if ( ( this.hasNode() ) && ( this.header.hasNode() ) ) {
			
			this.setMaxHeight( (this.node.offsetHeight - (headerHeight*2)) );
			
			this.setMinHeight( headerHeight );
			
			this.header.applyStyle("line-height", this.getMinHeight() + "px");
			this.applyStyle("height", this.getMinHeight() + "px");
		}
		
		this.resizeScroller(this, {init: true, offsetHeight: this.getMaxHeight(), headerHeight: headerHeight, itemCount: itemCount });
		
	},
	resizeScroller: function(inSender, props) {
		/*******************
		typical props value
		********************
		{
			init: bool,
			offsetHeight: int,
			headerHeight: int,
			itemCount: int
		}
		*/
		
		if ( props.init ) {
			// Called when acordion is rendered
			this.setMaxHeight( parseInt(this.node.style["max-height"], 10) );
			
		} else {
			// When manually resized
			this.setMaxHeight( (props.offsetHeight - (props.headerHeight*2) - props.itemCount) );
		}
		
		this.applyStyle("max-height", this.getMaxHeight() + "px");
		this.$.scroller.applyStyle("height", (this.getMaxHeight() - props.headerHeight) + "px"); // Sets content's scroller size
		this.$.scroller.render();
		
		return true;
	}
});





enyo.kind({
	name: "Accordion",
	classes: "accordion",
	events: {
		onViewChange: ""
	},
	handlers: {
		onInit: "getItem",
		onToggle: "viewChanged"
	},
	items: [],
	published: {
		activeView: false,
		headerHeight: 40
	},
	viewChanged: function(inSender, inEvent) {
		var activeView = inSender;
		
		// Silently close previous activeView, if needed
		if ( (this.getActiveView() !== false) && (inSender.name !== this.getActiveView().name) ) this.getActiveView().toggleItem(true);
		
		// If no views active
		if ( (inSender.collapsed) && (inSender === this.getActiveView()) && (inSender.collapsed) ) var activeView = false;
		
		this.setActiveView(activeView);
		this.doViewChange(activeView);
	},
	getItems: function() {
		return this.items;
	},
	getItem: function(inSender, inEvent) {
		this.items.push(inSender);
		return true;
	},
	toggleItem: function(target) {
		target.toggleItem(false);
	},
	
	resizeHandler: function() {
		this.initResizeWaterfall();
	},
	rendered: function() {
		this.inherited(arguments);
		this.initResizeWaterfall();
		
		this.waterfallDown( "onResizeHeader", {headerHeight: this.headerHeight, itemCount: this.items.length } );
	},
	initResizeWaterfall: function() {
		var items = this.getItems();
		var len = items.length;
		
		var props = {
			offsetHeight: this.getCSSProperty(this, "offsetHeight", false),
			headerHeight: this.headerHeight,
			init: false,
			itemCount: len
		};
		
		this.waterfallDown( "onResizeScroller", props );
		
	},
	getCSSProperty: function(target, property, style) {
		if (target.hasNode()) return (style) ? target.node.style[property] : target.node[property];
	}
	
});