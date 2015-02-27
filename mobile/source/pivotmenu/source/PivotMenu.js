/**
The _rwatkins.PivotMenu_ kind is designed to provide an
enyo.Panels-like control with an Arranger that simualtes the
Windows Phone 8 Pivot Menu control.

Any Enyo control may be placed inside an _rwatkins.PivotMenu_, but by
convention we refer to each of these controls as a "panel." The active
panel is the one in front, and the user can slide left or right to
bring other panels into the viewport.

For more information, see http://www.ryanwatkins.net/software/pivotmenu/
*/

/*
 * Copyright © 2013 Ryan Watkins <ryan@ryanwatkins.net>
 *
 * Permission to use, copy, modify, distribute, and sell this software
 * and its documentation for any purpose is hereby granted without
 * fee, provided that the above copyright notice appear in all copies
 * and that both that copyright notice and this permission notice
 * appear in supporting documentation. No representations are made
 * about the suitability of this software for any purpose. It is
 * provided "as is" without express or implied warranty.
 */

// FIXME: clicking third header when viewing first header scrolls wrong direction

enyo.kind({
  name: "rwatkins.PivotMenu",
  kind: "Panels",
  classes: "rwatkins-pivotmenu",

  arrangerKind: "rwatkins.PivotMenuArranger",
  wrap: true,
  narrowFit: false,

  published: {
    headerOffset: 0
  },

  handlers: {
    onTransitionFinish: "panelsTransitionFinishHandler"
  },

  chrome: [
    { name: "_pivotmenu_title", classes: "rwatkins-pivotmenu-title", content: "", allowHtml: true },
    { name: "_pivotmenu_header", classes: "rwatkins-pivotmenu-header" }
  ],

  //* @protected
  initComponents: function() {
    this.createChrome(this.chrome);
    this.inherited(arguments);
  },

  // override to ignore title and header
  getPanels: function() {
    var p = this.controlParent || this;
    var panels = [];
    enyo.forEach(p.children, function(child) {
      if ((child.name !== "_pivotmenu_title") && (child.name !== "_pivotmenu_header")) {
        panels.push(child);
      }
    });
    return panels;
  },

  indexChanged: function() {
    this.inherited(arguments);
    var panel = this.getActive();

    // change _pivotmenu_title to match panel
    if (panel.title && this.$._pivotmenu_title) {
      if (panel.title !== this.$._pivotmenu_title.getContent()) {
        this.$._pivotmenu_title.setContent(panel.title);
      }
    }
  },

  createHeaders: function() {
    if (!this.$._pivotmenu_header) { return; }
    var index = this.index - 1;

    var panels = this.layout.getOrderedControls(this.index);
    if (!panels || (panels.length < 1)) { return; }

    panels.unshift(panels.pop());
    var active = this.getActive();
    var components = [];
    var morecomponents = [];

    enyo.forEach(panels, function(panel) {
      var header = {
        kind: "rwatkins.PivotHeaderItem",
        active: (panel.name == active.name),
        index: index,
        label: panel.header,
        ontap: "headeritemTapHandler"
      };
      components.push(header);
      morecomponents.push(header);
      index++;
    }, this);


    this.$._pivotmenu_header.destroyClientControls();
    // x2 !
    this.$._pivotmenu_header.createComponents(components.concat(morecomponents), { owner: this });
    this.$._pivotmenu_header.render();

    var headers = this.$._pivotmenu_header.getClientControls();
    var header = headers[0];

    var l = "0px";
    if (header) {
      l = (header.getBounds().width * -1) + "px";
    }
    enyo.dom.transform(this.$._pivotmenu_header, { translateX: l, translateY: null });
  },

  // tapping a header item slides that panel into the active position
  headeritemTapHandler: function(inSender, inEvent) {
    this.setIndex(inSender.index);
    return;
  },

  // move the headers as the panels slide
  moveHandler: function(params) {
    // params.position is -1 to 1 reflecting amount of forward or backwared
    // drag since the last arrangement.
    if (!params || typeof(params.position) == 'undefined') { return true; }

    if (!this.$._pivotmenu_header) { return true; }
    var headers = this.$._pivotmenu_header.getClientControls();
    if (!headers || !headers[0]) { return true; }

    var delta = (this.toIndex - this.fromIndex);
    var width = 0;
    var offset = (headers[0].getBounds().width) * -1;

    // FIXME: currently only supports sliding back one header, but forward multiple
    // need to just 'wrap' around the array gathering widths
    if (delta < 0) {
      delta = 0;
      width = offset * -1;
    }

    // TODO: cache width values
    for (var i=1; (i <= delta); i++) {
      if (headers[i]) {
        width += headers[i].getBounds().width;
      }
    }
    width = offset + (params.position * width);
    enyo.dom.transform(this.$._pivotmenu_header, { translateX: (width + "px") || null, translateY: null });

    return true;
  },

  panelsTransitionFinishHandler: function() {
    this.createHeaders();
  },

  //* @public
  //* Select a panel by name rather than index
  setIndexByName: function(name) {
    var panels = this.getPanels();

    for (var i=0; i<panels.length; i++) {
      var panel = panels[i];
      if (panel && (panel.name == name)) {
        this.setIndex(i);
        return true;
      }
    }
    return false;
  }

});

/* individual items in the header, one per panel */
enyo.kind({
  name: "rwatkins.PivotHeaderItem",
  classes: "rwatkins-pivotmenu-header-item",

  published: {
    label: "",
    active: false /* non-active headers are partially transparent */
  },

  components: [
    { name: "label", classes: "rwatkins-pivotmenu-header-item-label", allowHtml: true }
  ],

  create: function() {
    this.inherited(arguments);
    this.activeChanged();
    this.labelChanged();
  },

  labelChanged: function() {
    this.$.label.setContent(this.label);
  },

  activeChanged: function() {
    this.addRemoveClass("active", this.active);
  }
});
