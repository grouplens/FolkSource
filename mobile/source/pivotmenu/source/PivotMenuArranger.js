/* PivotMenuArranger.js */
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

// FIXME: handle scrolling backgwards in 2 panel Pivots
// FIXME: wrapping panel not hidden if you swipe back fast enough
// TODO: set class on activation to animate content in

enyo.kind({
  name: "rwatkins.PivotMenuArranger",
  kind: "enyo.Arranger",

  size: function() {
    // set the width of each panel to the container
    enyo.forEach(this.container.getPanels(), function(panel) {
      var bounds = { width: this.containerBounds.width };
      if (this.container.headerOffset) {
        bounds.top = this.container.headerOffset;
      }
      panel.setBounds(bounds);
    }, this);
  },

  arrange: function(inC, inIndex) {
    var panels = this.c$;

    if (panels.length == 1) {
      this.arrangeControl(panels[0], { left: 0 }); // no margin
      return;
    }

    var offset = 1; // only offset one when rotating panels, dont center
    var orderedPanels = this.getOrderedControls(Math.floor(inIndex) - offset);
    var width = this.containerBounds.width;
    var left = width * offset * -1;

    enyo.forEach(orderedPanels, function(panel, index) {
      this.arrangeControl(panel, { left: left });
      left += width;
    }, this);
  },

  start: function() {
    this.inherited(arguments);

    var active = this.container.getActive();
    enyo.forEach(this.c$, function(panel, index) {
      panel.setShowing((panel == active));
    }, this);
  },

  finish: function() {
    this.inherited(arguments);

    // hide incoming panels till finish
    var active = this.container.getActive();
    enyo.forEach(this.c$, function(panel, index) {
      panel.setShowing((panel == active));
    }, this);

    /* TODO: toggle class to allow for animation shift on finish
    if (active) {
      enyo.log('unshift', panel.name);
      panel.removeClass('shift');
    }
    */
  },

  flowArrangement: function() {
    this.inherited(arguments);

    // no need to handle movement when there is a single panel
    if (this.c$.length == 1) { return; }

    var arrangement = this.container.arrangement;
    var fromIndex = this.container.fromIndex;
    var toIndex = this.container.toIndex;
    var index = (fromIndex % this.c$.length);
    if (index < 0) { index = this.c$.length + index; }

    if (arrangement[index] !== undefined) {
      // drag since the last arrangement.
      var position = Math.abs((arrangement[index].left) / (this.containerBounds.width * (toIndex - fromIndex)));
      // position is -1 to 1 reflecting amount of forward or backwared
      if (toIndex > fromIndex) {
        position = position * -1;
      }
      this.container.moveHandler({ position: position });
    }
  },

  calcArrangementDifference: function(inIndex0, inArrangement0, inIndex1, inArrangement1) {
    if (this.c$.length == 1) { return 0; }
    var i = Math.abs(inIndex0 % this.c$.length);

    // this is either + or - the width of PivotMenu, as panels have
    // consistent width.  We dont need to actual calc it each time for
    // a specific panel in the arrangement.  We just need the
    // direction
    var difference = inArrangement0[i]["left"] - inArrangement1[i]["left"];

    return difference;
  },

  destroy: function() {
    var panels = this.container.getPanels();
    enyo.forEach(panels, function(panel, index) {
      enyo.Arranger.positionControl(panel, { left: null, top: null });
      enyo.Arranger.opacifyControl(panel, 1);
      panel.applyStyle("left", null);
      panel.applyStyle("top", null);
      panel.applyStyle("height", null);
      panel.applyStyle("width", null);
      panel.show(); // and reset visibility
    });
    this.inherited(arguments);
  }

});
