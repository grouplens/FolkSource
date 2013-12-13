
// minifier: path aliases

enyo.path.addPaths({layout: "/Users/jts/programming/csense_trunk/test_organizer_interface/enyo/../lib/layout/", onyx: "/Users/jts/programming/csense_trunk/test_organizer_interface/enyo/../lib/onyx/", onyx: "/Users/jts/programming/csense_trunk/test_organizer_interface/enyo/../lib/onyx/source/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: "",
rowOffset: 0
},
events: {
onSetupItem: "",
onRenderRow: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
if (this.noSelect || t.index === -1) return;
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
if (e < this.rowOffset || e >= this.count + this.rowOffset) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
t && (enyo.dom.setInnerHtml(t, this.$.client.generateChildHtml()), this.$.client.teardownChildren(), this.doRenderRow({
rowIndex: e
}));
},
fetchRowNode: function(e) {
if (this.hasNode()) return this.node.querySelector('[data-enyo-index="' + e + '"]');
},
rowForEvent: function(e) {
if (!this.hasNode()) return -1;
var t = e.target;
while (t && t !== this.node) {
var n = t.getAttribute && t.getAttribute("data-enyo-index");
if (n !== null) return Number(n);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
if (e < 0 || e >= this.count) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
if (e < 0 || e >= this.count) return;
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n;
t && (t.id !== e.id ? n = t.querySelector("#" + e.id) : n = t), e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1,
reorderable: !1,
centerReorderContainer: !0,
reorderComponents: [],
pinnedReorderComponents: [],
swipeableComponents: [],
enableSwipe: !1,
persistSwipeableItem: !1
},
events: {
onSetupItem: "",
onSetupReorderComponents: "",
onSetupPinnedReorderComponents: "",
onReorder: "",
onSetupSwipeItem: "",
onSwipeDrag: "",
onSwipe: "",
onSwipeComplete: ""
},
handlers: {
onAnimateFinish: "animateFinish",
onRenderRow: "rowRendered",
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onup: "up",
onholdpulse: "holdpulse"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0;"
} ]
} ],
reorderHoldTimeMS: 600,
draggingRowIndex: -1,
draggingRowNode: null,
placeholderRowIndex: -1,
dragToScrollThreshold: .1,
prevScrollTop: 0,
autoScrollTimeoutMS: 20,
autoScrollTimeout: null,
autoscrollPageY: 0,
pinnedReorderMode: !1,
initialPinPosition: -1,
itemMoved: !1,
currentPageNumber: -1,
completeReorderTimeout: null,
swipeIndex: null,
swipeDirection: null,
persistentItemVisible: !1,
persistentItemOrigin: null,
swipeComplete: !1,
completeSwipeTimeout: null,
completeSwipeDelayMS: 500,
normalSwipeSpeedMS: 200,
fastSwipeSpeedMS: 100,
percentageDraggedThreshold: .2,
importProps: function(e) {
e && e.reorderable && (this.touch = !0), this.inherited(arguments);
},
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged(), this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count);
},
initComponents: function() {
this.createReorderTools(), this.inherited(arguments), this.createSwipeableComponents();
},
createReorderTools: function() {
this.createComponent({
name: "reorderContainer",
classes: "enyo-list-reorder-container",
ondown: "sendToStrategy",
ondrag: "sendToStrategy",
ondragstart: "sendToStrategy",
ondragfinish: "sendToStrategy",
onflick: "sendToStrategy"
});
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
createSwipeableComponents: function() {
for (var e = 0; e < this.swipeableComponents.length; e++) this.$.swipeableComponents.createComponent(this.swipeableComponents[e], {
owner: this.owner
});
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
sendToStrategy: function(e, t) {
this.$.strategy.dispatchEvent("on" + t.type, t, e);
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
holdpulse: function(e, t) {
if (!this.getReorderable() || this.isReordering()) return;
if (t.holdTime >= this.reorderHoldTimeMS && this.shouldStartReordering(e, t)) return t.preventDefault(), this.startReordering(t), !1;
},
dragstart: function(e, t) {
if (this.isReordering()) return !0;
if (this.isSwipeable()) return this.swipeDragStart(e, t);
},
drag: function(e, t) {
if (this.shouldDoReorderDrag(t)) return t.preventDefault(), this.reorderDrag(t), !0;
if (this.isSwipeable()) return t.preventDefault(), this.swipeDrag(e, t), !0;
},
dragfinish: function(e, t) {
this.isReordering() ? this.finishReordering(e, t) : this.isSwipeable() && this.swipeDragFinish(e, t);
},
up: function(e, t) {
this.isReordering() && this.finishReordering(e, t);
},
generatePage: function(e, t) {
this.page = e;
var n = this.rowsPerPage * this.page;
this.$.generator.setRowOffset(n);
var r = Math.min(this.count - n, this.rowsPerPage);
this.$.generator.setCount(r);
var i = this.$.generator.generateChildHtml();
t.setContent(i), this.getReorderable() && this.draggingRowIndex > -1 && this.hideReorderingRow();
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
this.pageHeights[e] = s, this.portSize += s - o;
}
},
pageForRow: function(e) {
return Math.floor(e / this.rowsPerPage);
},
preserveDraggingRowNode: function(e) {
this.draggingRowNode && this.pageForRow(this.draggingRowIndex) === e && (this.$.holdingarea.hasNode().appendChild(this.draggingRowNode), this.draggingRowNode = null, this.removedInitialPage = !0);
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p0), this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0, this.p0RowBounds = this.getPageRowHeights(this.$.page0)), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p1), this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0, this.p1RowBounds = this.getPageRowHeights(this.$.page1)), t && (this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count), this.fixedHeight || (this.adjustBottomPage(), this.adjustPortSize()));
},
getPageRowHeights: function(e) {
var t = {}, n = e.hasNode().querySelectorAll("div[data-enyo-index]");
for (var r = 0, i, s; r < n.length; r++) i = n[r].getAttribute("data-enyo-index"), i !== null && (s = enyo.dom.getBounds(n[r]), t[parseInt(i, 10)] = {
height: s.height,
width: s.width
});
return t;
},
updateRowBounds: function(e) {
this.p0RowBounds[e] ? this.updateRowBoundsAtIndex(e, this.p0RowBounds, this.$.page0) : this.p1RowBounds[e] && this.updateRowBoundsAtIndex(e, this.p1RowBounds, this.$.page1);
},
updateRowBoundsAtIndex: function(e, t, n) {
var r = n.hasNode().querySelector('div[data-enyo-index="' + e + '"]'), i = enyo.dom.getBounds(r);
t[e].height = i.height, t[e].width = i.width;
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return t = Math.max(t, 0), {
no: t,
height: r,
pos: n + r,
startRow: t * this.rowsPerPage,
endRow: Math.min((t + 1) * this.rowsPerPage - 1, this.count - 1)
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
var t = this.pageHeights[e];
if (!t) {
var n = this.rowsPerPage * e, r = Math.min(this.count - n, this.rowsPerPage);
t = this.defaultPageHeight * (r / this.rowsPerPage);
}
return Math.max(1, t);
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.p0RowBounds = {}, this.p1RowBounds = {}, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments), r = this.getScrollTop();
return this.lastPos === r ? n : (this.lastPos = r, this.update(r), this.pinnedReorderMode && this.reorderScroll(e, t), n);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
scrollToRow: function(e) {
var t = this.pageForRow(e), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
rowRendered: function(e, t) {
this.updateRowBounds(t.rowIndex);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
},
pageForPageNumber: function(e, t) {
return e % 2 === 0 ? !t || e === this.p0 ? this.$.page0 : null : !t || e === this.p1 ? this.$.page1 : null;
},
shouldStartReordering: function(e, t) {
return !!this.getReorderable() && t.rowIndex >= 0 && !this.pinnedReorderMode && e === this.$.strategy && t.index >= 0 ? !0 : !1;
},
startReordering: function(e) {
this.$.strategy.listReordering = !0, this.buildReorderContainer(), this.doSetupReorderComponents(e), this.styleReorderContainer(e), this.draggingRowIndex = this.placeholderRowIndex = e.rowIndex, this.draggingRowNode = e.target, this.removedInitialPage = !1, this.itemMoved = !1, this.initialPageNumber = this.currentPageNumber = this.pageForRow(e.rowIndex), this.prevScrollTop = this.getScrollTop(), this.replaceNodeWithPlaceholder(e.rowIndex);
},
buildReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.reorderComponents.length; e++) this.$.reorderContainer.createComponent(this.reorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
styleReorderContainer: function(e) {
this.setItemPosition(this.$.reorderContainer, e.rowIndex), this.setItemBounds(this.$.reorderContainer, e.rowIndex), this.$.reorderContainer.setShowing(!0), this.centerReorderContainer && this.centerReorderContainerOnPointer(e);
},
appendNodeToReorderContainer: function(e) {
this.$.reorderContainer.createComponent({
allowHtml: !0,
content: e.innerHTML
}).render();
},
centerReorderContainerOnPointer: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = e.pageX - t.left - parseInt(this.$.reorderContainer.domStyles.width, 10) / 2, r = e.pageY - t.top + this.getScrollTop() - parseInt(this.$.reorderContainer.domStyles.height, 10) / 2;
this.getStrategyKind() != "ScrollStrategy" && (n -= this.getScrollLeft(), r -= this.getScrollTop()), this.positionReorderContainer(n, r);
},
positionReorderContainer: function(e, t) {
this.$.reorderContainer.addClass("enyo-animatedTopAndLeft"), this.$.reorderContainer.addStyles("left:" + e + "px;top:" + t + "px;"), this.setPositionReorderContainerTimeout();
},
setPositionReorderContainerTimeout: function() {
this.clearPositionReorderContainerTimeout(), this.positionReorderContainerTimeout = setTimeout(enyo.bind(this, function() {
this.$.reorderContainer.removeClass("enyo-animatedTopAndLeft"), this.clearPositionReorderContainerTimeout();
}), 100);
},
clearPositionReorderContainerTimeout: function() {
this.positionReorderContainerTimeout && (clearTimeout(this.positionReorderContainerTimeout), this.positionReorderContainerTimeout = null);
},
shouldDoReorderDrag: function() {
return !this.getReorderable() || this.draggingRowIndex < 0 || this.pinnedReorderMode ? !1 : !0;
},
reorderDrag: function(e) {
this.positionReorderNode(e), this.checkForAutoScroll(e), this.updatePlaceholderPosition(e.pageY);
},
updatePlaceholderPosition: function(e) {
var t = this.getRowIndexFromCoordinate(e);
t !== -1 && (t >= this.placeholderRowIndex ? this.movePlaceholderToIndex(Math.min(this.count, t + 1)) : this.movePlaceholderToIndex(t));
},
positionReorderNode: function(e) {
var t = this.$.reorderContainer.getBounds(), n = t.left + e.ddx, r = t.top + e.ddy;
r = this.getStrategyKind() == "ScrollStrategy" ? r + (this.getScrollTop() - this.prevScrollTop) : r, this.$.reorderContainer.addStyles("top: " + r + "px ; left: " + n + "px"), this.prevScrollTop = this.getScrollTop();
},
checkForAutoScroll: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = this.getBounds(), r;
this.autoscrollPageY = e.pageY, e.pageY - t.top < n.height * this.dragToScrollThreshold ? (r = 100 * (1 - (e.pageY - t.top) / (n.height * this.dragToScrollThreshold)), this.scrollDistance = -1 * r) : e.pageY - t.top > n.height * (1 - this.dragToScrollThreshold) ? (r = 100 * ((e.pageY - t.top - n.height * (1 - this.dragToScrollThreshold)) / (n.height - n.height * (1 - this.dragToScrollThreshold))), this.scrollDistance = 1 * r) : this.scrollDistance = 0, this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling();
},
stopAutoScrolling: function() {
this.autoScrollTimeout && (clearTimeout(this.autoScrollTimeout), this.autoScrollTimeout = null);
},
startAutoScrolling: function() {
this.autoScrollTimeout = setInterval(enyo.bind(this, this.autoScroll), this.autoScrollTimeoutMS);
},
autoScroll: function() {
this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling(), this.setScrollPosition(this.getScrollPosition() + this.scrollDistance), this.positionReorderNode({
ddx: 0,
ddy: 0
}), this.updatePlaceholderPosition(this.autoscrollPageY);
},
movePlaceholderToIndex: function(e) {
var t, n;
if (e < 0) return;
e >= this.count ? (t = null, n = this.pageForPageNumber(this.pageForRow(this.count - 1)).hasNode()) : (t = this.$.generator.fetchRowNode(e), n = t.parentNode);
var r = this.pageForRow(e);
r >= this.pageCount && (r = this.currentPageNumber), n.insertBefore(this.placeholderNode, t), this.currentPageNumber !== r && (this.updatePageHeight(this.currentPageNumber), this.updatePageHeight(r), this.updatePagePositions(r)), this.placeholderRowIndex = e, this.currentPageNumber = r, this.itemMoved = !0;
},
finishReordering: function(e, t) {
if (!this.isReordering() || this.pinnedReorderMode || this.completeReorderTimeout) return;
return this.stopAutoScrolling(), this.$.strategy.listReordering = !1, this.moveReorderedContainerToDroppedPosition(t), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, t), 100), t.preventDefault(), !0;
},
moveReorderedContainerToDroppedPosition: function() {
var e = this.getRelativeOffset(this.placeholderNode, this.hasNode()), t = this.getStrategyKind() == "ScrollStrategy" ? e.top : e.top - this.getScrollTop(), n = e.left - this.getScrollLeft();
this.positionReorderContainer(n, t);
},
completeFinishReordering: function(e) {
this.completeReorderTimeout = null, this.placeholderRowIndex > this.draggingRowIndex && (this.placeholderRowIndex = Math.max(0, this.placeholderRowIndex - 1));
if (this.draggingRowIndex == this.placeholderRowIndex && this.pinnedReorderComponents.length && !this.pinnedReorderMode && !this.itemMoved) {
this.beginPinnedReorder(e);
return;
}
this.removeDraggingRowNode(), this.removePlaceholderNode(), this.emptyAndHideReorderContainer(), this.pinnedReorderMode = !1, this.reorderRows(e), this.draggingRowIndex = this.placeholderRowIndex = -1, this.refresh();
},
beginPinnedReorder: function(e) {
this.buildPinnedReorderContainer(), this.doSetupPinnedReorderComponents(enyo.mixin(e, {
index: this.draggingRowIndex
})), this.pinnedReorderMode = !0, this.initialPinPosition = e.pageY;
},
emptyAndHideReorderContainer: function() {
this.$.reorderContainer.destroyComponents(), this.$.reorderContainer.setShowing(!1);
},
buildPinnedReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.pinnedReorderComponents.length; e++) this.$.reorderContainer.createComponent(this.pinnedReorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
reorderRows: function(e) {
this.doReorder(this.makeReorderEvent(e)), this.positionReorderedNode(), this.updateListIndices();
},
makeReorderEvent: function(e) {
return e.reorderFrom = this.draggingRowIndex, e.reorderTo = this.placeholderRowIndex, e;
},
positionReorderedNode: function() {
if (!this.removedInitialPage) {
var e = this.$.generator.fetchRowNode(this.placeholderRowIndex);
e && (e.parentNode.insertBefore(this.hiddenNode, e), this.showNode(this.hiddenNode)), this.hiddenNode = null;
if (this.currentPageNumber != this.initialPageNumber) {
var t, n, r = this.pageForPageNumber(this.currentPageNumber), i = this.pageForPageNumber(this.currentPageNumber + 1);
this.initialPageNumber < this.currentPageNumber ? (t = r.hasNode().firstChild, i.hasNode().appendChild(t)) : (t = r.hasNode().lastChild, n = i.hasNode().firstChild, i.hasNode().insertBefore(t, n)), this.correctPageHeights(), this.updatePagePositions(this.initialPageNumber);
}
}
},
updateListIndices: function() {
if (this.shouldDoRefresh()) {
this.refresh(), this.correctPageHeights();
return;
}
var e = Math.min(this.draggingRowIndex, this.placeholderRowIndex), t = Math.max(this.draggingRowIndex, this.placeholderRowIndex), n = this.draggingRowIndex - this.placeholderRowIndex > 0 ? 1 : -1, r, i, s, o;
if (n === 1) {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", "reordered");
for (i = t - 1, s = t; i >= e; i--) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o + 1, r.setAttribute("data-enyo-index", s);
}
r = this.hasNode().querySelector('[data-enyo-index="reordered"]'), r.setAttribute("data-enyo-index", this.placeholderRowIndex);
} else {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", this.placeholderRowIndex);
for (i = e + 1, s = e; i <= t; i++) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o - 1, r.setAttribute("data-enyo-index", s);
}
}
},
shouldDoRefresh: function() {
return Math.abs(this.initialPageNumber - this.currentPageNumber) > 1;
},
getNodeStyle: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) return;
var n = this.getRelativeOffset(t, this.hasNode()), r = enyo.dom.getBounds(t);
return {
h: r.height,
w: r.width,
left: n.left,
top: n.top
};
},
getRelativeOffset: function(e, t) {
var n = {
top: 0,
left: 0
};
if (e !== t && e.parentNode) do n.top += e.offsetTop || 0, n.left += e.offsetLeft || 0, e = e.offsetParent; while (e && e !== t);
return n;
},
replaceNodeWithPlaceholder: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
this.placeholderNode = this.createPlaceholderNode(t), this.hiddenNode = this.hideNode(t);
var n = this.pageForPageNumber(this.currentPageNumber);
n.hasNode().insertBefore(this.placeholderNode, this.hiddenNode);
},
createPlaceholderNode: function(e) {
var t = this.$.placeholder.hasNode().cloneNode(!0), n = enyo.dom.getBounds(e);
return t.style.height = n.height + "px", t.style.width = n.width + "px", t;
},
removePlaceholderNode: function() {
this.removeNode(this.placeholderNode), this.placeholderNode = null;
},
removeDraggingRowNode: function() {
this.draggingRowNode = null;
var e = this.$.holdingarea.hasNode();
e.innerHTML = "";
},
removeNode: function(e) {
if (!e || !e.parentNode) return;
e.parentNode.removeChild(e);
},
updatePageHeight: function(e) {
if (e < 0) return;
var t = this.pageForPageNumber(e, !0);
if (t) {
var n = this.pageHeights[e], r = Math.max(1, t.getBounds().height);
this.pageHeights[e] = r, this.portSize += r - n;
}
},
updatePagePositions: function(e) {
this.positionPage(this.currentPageNumber, this.pageForPageNumber(this.currentPageNumber)), this.positionPage(e, this.pageForPageNumber(e));
},
correctPageHeights: function() {
this.updatePageHeight(this.currentPageNumber), this.initialPageNumber != this.currentPageNumber && this.updatePageHeight(this.initialPageNumber);
},
hideNode: function(e) {
return e.style.display = "none", e;
},
showNode: function(e) {
return e.style.display = "block", e;
},
dropPinnedRow: function(e) {
this.moveReorderedContainerToDroppedPosition(e), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, e), 100);
return;
},
cancelPinnedMode: function(e) {
this.placeholderRowIndex = this.draggingRowIndex, this.dropPinnedRow(e);
},
getRowIndexFromCoordinate: function(e) {
var t = this.getScrollTop() + e - enyo.dom.calcNodePosition(this.hasNode()).top;
if (t < 0) return -1;
var n = this.positionToPageInfo(t), r = n.no == this.p0 ? this.p0RowBounds : this.p1RowBounds;
if (!r) return this.count;
var i = n.pos, s = this.placeholderNode ? enyo.dom.getBounds(this.placeholderNode).height : 0, o = 0;
for (var u = n.startRow; u <= n.endRow; ++u) {
if (u === this.placeholderRowIndex) {
o += s;
if (o >= i) return -1;
}
if (u !== this.draggingRowIndex) {
o += r[u].height;
if (o >= i) return u;
}
}
return u;
},
getIndexPosition: function(e) {
return enyo.dom.calcNodePosition(this.$.generator.fetchRowNode(e));
},
setItemPosition: function(e, t) {
var n = this.getNodeStyle(t), r = this.getStrategyKind() == "ScrollStrategy" ? n.top : n.top - this.getScrollTop(), i = "top:" + r + "px; left:" + n.left + "px;";
e.addStyles(i);
},
setItemBounds: function(e, t) {
var n = this.getNodeStyle(t), r = "width:" + n.w + "px; height:" + n.h + "px;";
e.addStyles(r);
},
reorderScroll: function(e, t) {
this.getStrategyKind() == "ScrollStrategy" && this.$.reorderContainer.addStyles("top:" + (this.initialPinPosition + this.getScrollTop() - this.rowHeight) + "px;"), this.updatePlaceholderPosition(this.initialPinPosition);
},
hideReorderingRow: function() {
var e = this.hasNode().querySelector('[data-enyo-index="' + this.draggingRowIndex + '"]');
e && (this.hiddenNode = this.hideNode(e));
},
isReordering: function() {
return this.draggingRowIndex > -1;
},
isSwiping: function() {
return this.swipeIndex != null && !this.swipeComplete && this.swipeDirection != null;
},
swipeDragStart: function(e, t) {
return t.index == null || t.vertical ? !0 : (this.completeSwipeTimeout && this.completeSwipe(t), this.swipeComplete = !1, this.swipeIndex != t.index && (this.clearSwipeables(), this.swipeIndex = t.index), this.swipeDirection = t.xDirection, this.persistentItemVisible || this.startSwipe(t), this.draggedXDistance = 0, this.draggedYDistance = 0, !0);
},
swipeDrag: function(e, t) {
return this.persistentItemVisible ? (this.dragPersistentItem(t), this.preventDragPropagation) : this.isSwiping() ? (this.dragSwipeableComponents(this.calcNewDragPosition(t.ddx)), this.draggedXDistance = t.dx, this.draggedYDistance = t.dy, !0) : !1;
},
swipeDragFinish: function(e, t) {
if (this.persistentItemVisible) this.dragFinishPersistentItem(t); else {
if (!this.isSwiping()) return !1;
var n = this.calcPercentageDragged(this.draggedXDistance);
n > this.percentageDraggedThreshold && t.xDirection === this.swipeDirection ? this.swipe(this.fastSwipeSpeedMS) : this.backOutSwipe(t);
}
return this.preventDragPropagation;
},
isSwipeable: function() {
return this.enableSwipe && this.$.swipeableComponents.controls.length !== 0 && !this.isReordering() && !this.pinnedReorderMode;
},
positionSwipeableContainer: function(e, t) {
var n = this.$.generator.fetchRowNode(e);
if (!n) return;
var r = this.getRelativeOffset(n, this.hasNode()), i = enyo.dom.getBounds(n), s = t == 1 ? -1 * i.width : i.width;
this.$.swipeableComponents.addStyles("top: " + r.top + "px; left: " + s + "px; height: " + i.height + "px; width: " + i.width + "px;");
},
calcNewDragPosition: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = t.left, r = this.$.swipeableComponents.getBounds(), i = this.swipeDirection == 1 ? 0 : -1 * r.width, s = this.swipeDirection == 1 ? n + e > i ? i : n + e : n + e < i ? i : n + e;
return s;
},
dragSwipeableComponents: function(e) {
this.$.swipeableComponents.applyStyle("left", e + "px");
},
startSwipe: function(e) {
e.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, e.xDirection), this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(e.xDirection), this.doSetupSwipeItem(e);
},
dragPersistentItem: function(e) {
var t = 0, n = this.persistentItemOrigin == "right" ? Math.max(t, t + e.dx) : Math.min(t, t + e.dx);
this.$.swipeableComponents.applyStyle("left", n + "px");
},
dragFinishPersistentItem: function(e) {
var t = this.calcPercentageDragged(e.dx) > .2, n = e.dx > 0 ? "right" : e.dx < 0 ? "left" : null;
this.persistentItemOrigin == n ? t ? this.slideAwayItem() : this.bounceItem(e) : this.bounceItem(e);
},
setPersistentItemOrigin: function(e) {
this.persistentItemOrigin = e == 1 ? "left" : "right";
},
calcPercentageDragged: function(e) {
return Math.abs(e / this.$.swipeableComponents.getBounds().width);
},
swipe: function(e) {
this.swipeComplete = !0, this.animateSwipe(0, e);
},
backOutSwipe: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = this.swipeDirection == 1 ? -1 * t.width : t.width;
this.animateSwipe(n, this.fastSwipeSpeedMS), this.swipeDirection = null;
},
bounceItem: function(e) {
var t = this.$.swipeableComponents.getBounds();
t.left != t.width && this.animateSwipe(0, this.normalSwipeSpeedMS);
},
slideAwayItem: function() {
var e = this.$.swipeableComponents, t = e.getBounds().width, n = this.persistentItemOrigin == "left" ? -1 * t : t;
this.animateSwipe(n, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
clearSwipeables: function() {
this.$.swipeableComponents.setShowing(!1), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
completeSwipe: function(e) {
this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), this.getPersistSwipeableItem() ? this.persistentItemVisible = !0 : (this.$.swipeableComponents.setShowing(!1), this.swipeComplete && this.doSwipeComplete({
index: this.swipeIndex,
xDirection: this.swipeDirection
})), this.swipeIndex = null, this.swipeDirection = null;
},
animateSwipe: function(e, t) {
var n = enyo.now(), r = 0, i = this.$.swipeableComponents, s = parseInt(i.domStyles.left, 10), o = e - s;
this.stopAnimateSwipe();
var u = enyo.bind(this, function() {
var e = enyo.now() - n, r = e / t, a = s + o * Math.min(r, 1);
i.applyStyle("left", a + "px"), this.job = enyo.requestAnimationFrame(u), e / t >= 1 && (this.stopAnimateSwipe(), this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
this.completeSwipe();
}), this.completeSwipeDelayMS));
});
this.job = enyo.requestAnimationFrame(u);
},
stopAnimateSwipe: function() {
this.job && (this.job = enyo.cancelRequestAnimationFrame(this.job));
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.strategyKind = this.resetStrategyKind(), this.inherited(arguments);
},
resetStrategyKind: function() {
return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath || this.getStrategy(), i = -1 * this.getScrollTop();
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(-1 * this.getScrollTop() - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0;
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(this.pullHeight), e.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
calcArrangementDifference: function(e, t, n, r) {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
peekWidth: 0,
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
constructor: function() {
this.inherited(arguments), this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o, u = 0; o = n[r]; r++) o.getShowing() ? (this.arrangeControl(o, {
left: i + u * this.peekWidth
}), r >= t && (i += o.width + o.marginWidth - this.peekWidth), u++) : (this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth)), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// DockRightArranger.js

enyo.kind({
name: "enyo.DockRightArranger",
kind: "Arranger",
basePanel: !1,
overlap: 0,
layoutWidth: 0,
constructor: function() {
this.inherited(arguments), this.overlap = this.container.overlap != null ? this.container.overlap : this.overlap, this.layoutWidth = this.container.layoutWidth != null ? this.container.layoutWidth : this.layoutWidth;
},
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s;
n.width -= t.left + t.right;
var o = n.width, u = e.length;
this.container.transitionPositions = {};
for (r = 0; s = e[r]; r++) s.width = r === 0 && this.container.basePanel ? o : s.getBounds().width;
for (r = 0; s = e[r]; r++) {
r === 0 && this.container.basePanel && s.setBounds({
width: o
}), s.setBounds({
top: t.top,
bottom: t.bottom
});
for (j = 0; s = e[j]; j++) {
var a;
if (r === 0 && this.container.basePanel) a = 0; else if (j < r) a = o; else {
if (r !== j) break;
var f = o > this.layoutWidth ? this.overlap : 0;
a = o - e[r].width + f;
}
this.container.transitionPositions[r + "." + j] = a;
}
if (j < u) {
var l = !1;
for (k = r + 1; k < u; k++) {
var f = 0;
if (l) f = 0; else if (e[r].width + e[k].width - this.overlap > o) f = 0, l = !0; else {
f = e[r].width - this.overlap;
for (i = r; i < k; i++) {
var c = f + e[i + 1].width - this.overlap;
if (!(c < o)) {
f = o;
break;
}
f = c;
}
f = o - f;
}
this.container.transitionPositions[r + "." + k] = f;
}
}
}
},
arrange: function(e, t) {
var n, r, i = this.container.getPanels(), s = this.container.clamp(t);
for (n = 0; r = i[n]; n++) {
var o = this.container.transitionPositions[n + "." + s];
this.arrangeControl(r, {
left: o
});
}
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels(), s = e < n ? i[n].width : i[e].width;
return s;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onscroll: "domScroll"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "scroll");
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels(), t = this.index % e.length;
return t < 0 && (t += e.length), e[t];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (var n in this.position) e[t].applyStyle(n, this.position[n] + "px");
},
highlightAnchorPointChanged: function() {
this.addRemoveClass("pinDebug", this.highlightAnchorPoint);
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale), this.alignImage();
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : this.scale == "fit" ? (this.fitAlignment = "center", this.scale = Math.max(t, n)) : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
alignImage: function() {
if (this.fitAlignment && this.fitAlignment === "center") {
var e = this.getScrollBounds();
this.setScrollLeft(e.maxLeft / 2), this.setScrollTop(e.maxTop / 2);
}
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
var e = this.getBufferRange();
for (var t in e) this.loadImageView(e[t]);
},
getBufferRange: function() {
var e = [];
if (this.layout.containerBounds) {
var t = 1, n = this.layout.containerBounds, r, i, s, o, u, a;
o = this.index - 1, u = 0, a = n.width * t;
while (o >= 0 && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.unshift(o), o--;
o = this.index, u = 0, a = n.width * (t + 1);
while (o < this.images.length && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.push(o), o++;
}
return e;
},
reflow: function() {
this.inherited(arguments), this.loadNearby();
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? this.$["image" + e].src != this.images[e] && (this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadNearby(), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
var e = getBufferRange();
for (var t = 0; t < this.images.length; t++) enyo.indexOf(t, e) === -1 && this.$["image" + t] && this.$["image" + t].destroy();
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
}
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
onclick: ""
},
tap: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !this.disabled;
},
dragstart: function() {}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v",
animated: !0
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.animatedChanged(), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
animatedChanged: function() {
!this.animated && this.hasNode() && this.$.animator.isAnimating() && (this.$.animator.stop(), this.animatorEnd());
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.animated ? this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
}) : this.animatorEnd();
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left", r = this.$.client.hasNode();
r && (r.style[n] = this.$.client.domStyles[n] = null), this.node && (this.node.style[t] = this.domStyles[t] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling && this.createComponents(this.childComponents, {
isChrome: !0
}), this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop && this.getScroller().setMaxHeight(this.maxHeight + "px"), this.removeClass("onyx-menu-up"), this.floating || this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: r - e.width
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
events: {
onSelect: "",
onItemContentChange: ""
},
classes: "onyx-menu-item",
tag: "div",
create: function() {
this.inherited(arguments), this.active && this.bubble("onActivate");
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
},
contentChanged: function(e) {
this.inherited(arguments), this.doItemContentChange({
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
t.content !== undefined && this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
handlers: {
onItemContentChange: "itemContentChange"
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
itemContentChange: function(e, t) {
t.originator == this.selected && this.doChange({
selected: this.selected,
content: this.selected.content
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
noSelect: !0,
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments), this.$.flyweight.$.client.children[0].setActive(!0);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e != null && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e));
var t;
this.selected != null && (this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected"), t = this.$.flyweight.fetchRowNode(this.selected)), this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// DatePicker.js

enyo.kind({
name: "onyx.DatePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
dayHidden: !1,
monthHidden: !1,
yearHidden: !1,
minYear: 1900,
maxYear: 2099,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getMonthFields()), this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : "mdy"), this.dayHiddenChanged(), this.monthHiddenChanged(), this.yearHiddenChanged();
var t = this.value = this.value || new Date;
for (var n = 0, r; r = e[n]; n++) this.$.monthPicker.createComponent({
content: r,
value: n,
active: n == t.getMonth()
});
var i = t.getFullYear();
this.$.yearPicker.setSelected(i - this.minYear);
for (n = 1; n <= this.monthLength(t.getYear(), t.getMonth()); n++) this.$.dayPicker.createComponent({
content: n,
value: n,
active: n == t.getDate()
});
},
monthLength: function(e, t) {
return 32 - (new Date(e, t, 32)).getDate();
},
setupYear: function(e, t) {
this.$.year.setContent(this.minYear + t.index);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "d":
this.createDay();
break;
case "m":
this.createMonth();
break;
case "y":
this.createYear();
break;
default:
}
}
},
createYear: function() {
var e = this.maxYear - this.minYear;
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateYear",
components: [ {
classes: "onyx-datepicker-year",
name: "yearPickerButton",
disabled: this.disabled
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: ++e,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
});
},
createMonth: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMonth",
components: [ {
classes: "onyx-datepicker-month",
name: "monthPickerButton",
disabled: this.disabled
}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
});
},
createDay: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateDay",
components: [ {
classes: "onyx-datepicker-day",
name: "dayPickerButton",
disabled: this.disabled
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
});
},
localeChanged: function() {
this.refresh();
},
dayHiddenChanged: function() {
this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
},
monthHiddenChanged: function() {
this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
},
yearHiddenChanged: function() {
this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
},
minYearChanged: function() {
this.refresh();
},
maxYearChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
disabledChanged: function() {
this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), this.$.dayPickerButton.setDisabled(this.disabled);
},
updateDay: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateMonth: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateYear: function(e, t) {
if (t.originator.selected != -1) {
var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
this.doSelect({
name: this.name,
value: n
}), this.setValue(n);
}
return !0;
},
calcDate: function(e, t, n) {
return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// TimePicker.js

enyo.kind({
name: "onyx.TimePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
is24HrMode: null,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = "AM", t = "PM";
this.is24HrMode == null && (this.is24HrMode = !1), enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getAmCaption(), t = this._tf.getPmCaption(), this.is24HrMode == null && (this.is24HrMode = !this._tf.isAmPm())), this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : "hma");
var n = this.value = this.value || new Date, r;
if (!this.is24HrMode) {
var i = n.getHours();
i = i === 0 ? 12 : i;
for (r = 1; r <= 12; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == (i > 12 ? i % 12 : i)
});
} else for (r = 0; r < 24; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == n.getHours()
});
for (r = 0; r <= 59; r++) this.$.minutePicker.createComponent({
content: r < 10 ? "0" + r : r,
value: r,
active: r == n.getMinutes()
});
n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
content: e
}, {
content: t,
active: !0
} ]) : this.$.ampmPicker.createComponents([ {
content: e,
active: !0
}, {
content: t
} ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "h":
this.createHour();
break;
case "m":
this.createMinute();
break;
case "a":
this.createAmPm();
break;
default:
}
}
},
createHour: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateHour",
components: [ {
classes: "onyx-timepicker-hour",
name: "hourPickerButton",
disabled: this.disabled
}, {
name: "hourPicker",
kind: "onyx.Picker"
} ]
});
},
createMinute: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMinute",
components: [ {
classes: "onyx-timepicker-minute",
name: "minutePickerButton",
disabled: this.disabled
}, {
name: "minutePicker",
kind: "onyx.Picker"
} ]
});
},
createAmPm: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateAmPm",
components: [ {
classes: "onyx-timepicker-ampm",
name: "ampmPickerButton",
disabled: this.disabled
}, {
name: "ampmPicker",
kind: "onyx.Picker"
} ]
});
},
disabledChanged: function() {
this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), this.$.ampmPickerButton.setDisabled(this.disabled);
},
localeChanged: function() {
this.is24HrMode = null, this.refresh();
},
is24HrModeChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
updateHour: function(e, t) {
var n = t.selected.value;
if (!this.is24HrMode) {
var r = this.$.ampmPicker.getParent().controlAtIndex(0).content;
n = n + (n == 12 ? -12 : 0) + (this.isAm(r) ? 0 : 12);
}
return this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateMinute: function(e, t) {
return this.value = this.calcTime(this.value.getHours(), t.selected.value), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateAmPm: function(e, t) {
var n = this.value.getHours();
return this.is24HrMode || (n += n > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
calcTime: function(e, t) {
return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
},
isAm: function(e) {
var t, n, r;
try {
t = this._tf.getAmCaption(), n = this._tf.getPmCaption();
} catch (i) {
t = "AM", n = "PM";
}
return e == t ? !0 : !1;
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
defaultKind: "onyx.RadioButton",
highlander: !0
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.updateVisualState();
},
updateVisualState: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
valueChanged: function() {
this.updateVisualState(), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// ToggleIconButton.js

enyo.kind({
name: "onyx.ToggleIconButton",
kind: "onyx.Icon",
published: {
active: !1,
value: !1
},
events: {
onChange: ""
},
classes: "onyx-icon-button onyx-icon-toggle",
activeChanged: function() {
this.addRemoveClass("active", this.value), this.bubble("onActivate");
},
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
valueChanged: function() {
this.setActive(this.value);
},
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active);
},
rendered: function() {
this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0,
increment: 0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
calcIncrement: function(e) {
return Math.round(e / this.increment) * this.increment;
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), enyo.platform.firefoxOS && (this.moreComponents[2].ondown = "down", this.moreComponents[2].onleave = "leave"), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.tapped = !0, this.animateTo(n), !0;
}
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// RangeSlider.js

enyo.kind({
name: "onyx.RangeSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
beginValue: 0,
endValue: 0
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t), r, i, s;
if (e.name === "startKnob" && n >= 0) {
if (!(n <= this.endValue && t.xDirection === -1 || n <= this.endValue)) return this.drag(this.$.endKnob, t);
this.setBeginValue(n), r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
} else if (e.name === "endKnob" && n <= 100) {
if (!(n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue)) return this.drag(this.$.startKnob, t);
this.setEndValue(n), r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
var n;
return e.name === "startKnob" ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
value: n,
startChanged: !0
})) : e.name === "endKnob" && (n = this.calcRangeRatio(this.endValue), this.doChange({
value: n,
startChanged: !1
})), !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
}), enyo.kind({
name: "onyx.RangeSliderKnobLabel",
classes: "onyx-range-slider-label",
handlers: {
onSetLabel: "setLabel"
},
setLabel: function(e, t) {
this.setContent(t);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !0, t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !1, t);
},
statics: {
addRemoveFlyweightClass: function(e, t, n, r, i) {
var s = r.flyweight;
if (s) {
var o = i !== undefined ? i : r.index;
s.performOnRow(o, function() {
e.addRemoveClass(t, n);
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
noStretch: !0,
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu"
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e, null);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex !== undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex === undefined && (c.toolbarIndex = t);
}
}
});

// IntegerPicker.js

enyo.kind({
name: "onyx.IntegerPicker",
kind: "onyx.Picker",
published: {
value: 0,
min: 0,
max: 9
},
create: function() {
this.inherited(arguments), this.rangeChanged();
},
minChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
maxChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
rangeChanged: function() {
for (var e = this.min; e <= this.max; e++) this.createComponent({
content: e,
active: e === this.value ? !0 : !1
});
},
valueChanged: function(e) {
var t = this.getClientControls(), n = t.length;
this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
for (var r = 0; r < n; r++) if (this.value === parseInt(t[r].content)) {
this.setSelected(t[r]);
break;
}
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
})), this.value = parseInt(this.selected.content);
}
});

// ContextualPopup.js

enyo.kind({
name: "onyx.ContextualPopup",
kind: "enyo.Popup",
modal: !0,
autoDismiss: !0,
floating: !1,
classes: "onyx-contextual-popup enyo-unselectable",
published: {
maxHeight: 100,
scrolling: !0,
title: undefined,
actionButtons: []
},
vertFlushMargin: 60,
horizFlushMargin: 50,
widePopup: 200,
longPopup: 200,
horizBuffer: 16,
events: {
onTap: ""
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestShow",
onRequestHideMenu: "requestHide"
},
components: [ {
name: "title",
classes: "onyx-contextual-popup-title"
}, {
classes: "onyx-contextual-popup-scroller",
components: [ {
name: "client",
kind: "enyo.Scroller",
vertical: "auto",
classes: "enyo-unselectable",
thumb: !1,
strategyKind: "TouchScrollStrategy"
} ]
}, {
name: "actionButtons",
classes: "onyx-contextual-popup-action-buttons"
} ],
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged(), this.titleChanged(), this.actionButtonsChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
actionButtonsChanged: function() {
for (var e = 0; e < this.actionButtons.length; e++) this.$.actionButtons.createComponent({
kind: "onyx.Button",
content: this.actionButtons[e].content,
classes: this.actionButtons[e].classes + " onyx-contextual-popup-action-button",
name: this.actionButtons[e].name ? this.actionButtons[e].name : "ActionButton" + e,
index: e,
tap: enyo.bind(this, this.tapHandler)
});
},
tapHandler: function(e, t) {
return t.actionButton = !0, t.popup = this, this.bubble("ontap", t), !0;
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition();
},
requestShow: function(e, t) {
var n = t.activator.hasNode();
return n && (this.activatorOffset = this.getPageOffset(n)), this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = this.getBoundingRect(e), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.resetPositioning();
var e = this.getViewWidth(), t = this.getViewHeight(), n = this.vertFlushMargin, r = t - this.vertFlushMargin, i = this.horizFlushMargin, s = e - this.horizFlushMargin;
if (this.activatorOffset.top + this.activatorOffset.height < n || this.activatorOffset.top > r) {
if (this.applyVerticalFlushPositioning(i, s)) return;
if (this.applyHorizontalFlushPositioning(i, s)) return;
if (this.applyVerticalPositioning()) return;
} else if (this.activatorOffset.left + this.activatorOffset.width < i || this.activatorOffset.left > s) if (this.applyHorizontalPositioning()) return;
var o = this.getBoundingRect(this.node);
if (o.width > this.widePopup) {
if (this.applyVerticalPositioning()) return;
} else if (o.height > this.longPopup && this.applyHorizontalPositioning()) return;
if (this.applyVerticalPositioning()) return;
if (this.applyHorizontalPositioning()) return;
}
},
initVerticalPositioning: function() {
this.resetPositioning(), this.addClass("vertical");
var e = this.getBoundingRect(this.node), t = this.getViewHeight();
return this.floating ? this.activatorOffset.top < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height,
bottom: "auto"
}), this.addClass("below")) : (this.applyPosition({
top: this.activatorOffset.top - e.height,
bottom: "auto"
}), this.addClass("above")) : e.top + e.height > t && t - e.bottom < e.top - e.height ? this.addClass("above") : this.addClass("below"), e = this.getBoundingRect(this.node), e.top + e.height > t || e.top < 0 ? !1 : !0;
},
applyVerticalPositioning: function() {
if (!this.initVerticalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
if (this.floating) {
var n = this.activatorOffset.left + this.activatorOffset.width / 2 - e.width / 2;
n + e.width > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.width
}), this.addClass("left")) : n < 0 ? (this.applyPosition({
left: this.activatorOffset.left
}), this.addClass("right")) : this.applyPosition({
left: n
});
} else {
var r = this.activatorOffset.left + this.activatorOffset.width / 2 - e.left - e.width / 2;
e.right + r > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.right
}), this.addRemoveClass("left", !0)) : e.left + r < 0 ? this.addRemoveClass("right", !0) : this.applyPosition({
left: r
});
}
return !0;
},
applyVerticalFlushPositioning: function(e, t) {
if (!this.initVerticalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.activatorOffset.left + this.activatorOffset.width / 2 < e ? (this.activatorOffset.left + this.activatorOffset.width / 2 < this.horizBuffer ? this.applyPosition({
left: this.horizBuffer + (this.floating ? 0 : -n.left)
}) : this.applyPosition({
left: this.activatorOffset.width / 2 + (this.floating ? this.activatorOffset.left : 0)
}), this.addClass("right"), this.addClass("corner"), !0) : this.activatorOffset.left + this.activatorOffset.width / 2 > t ? (this.activatorOffset.left + this.activatorOffset.width / 2 > r - this.horizBuffer ? this.applyPosition({
left: r - this.horizBuffer - n.right
}) : this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width / 2 - n.right
}), this.addClass("left"), this.addClass("corner"), !0) : !1;
},
initHorizontalPositioning: function() {
this.resetPositioning();
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
return this.floating ? this.activatorOffset.left + this.activatorOffset.width < t / 2 ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width
}), this.addRemoveClass("left", !0)) : (this.applyPosition({
left: this.activatorOffset.left - e.width
}), this.addRemoveClass("right", !0)) : this.activatorOffset.left - e.width > 0 ? (this.applyPosition({
left: this.activatorOffset.left - e.left - e.width
}), this.addRemoveClass("right", !0)) : (this.applyPosition({
left: this.activatorOffset.width
}), this.addRemoveClass("left", !0)), this.addRemoveClass("horizontal", !0), e = this.getBoundingRect(this.node), e.left < 0 || e.left + e.width > t ? !1 : !0;
},
applyHorizontalPositioning: function() {
if (!this.initHorizontalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewHeight(), n = this.activatorOffset.top + this.activatorOffset.height / 2;
return this.floating ? n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - e.height / 2,
bottom: "auto"
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top - this.activatorOffset.height,
bottom: "auto"
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top - e.height + this.activatorOffset.height * 2,
bottom: "auto"
}), this.addRemoveClass("low", !0)) : n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: (this.activatorOffset.height - e.height) / 2
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: -this.activatorOffset.height
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: e.top - e.height - this.activatorOffset.top + this.activatorOffset.height
}), this.addRemoveClass("low", !0)), !0;
},
applyHorizontalFlushPositioning: function(e, t) {
if (!this.initHorizontalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.floating ? this.activatorOffset.top < innerHeight / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - n.height
}), this.addRemoveClass("low", !0)) : n.top + n.height > innerHeight && innerHeight - n.bottom < n.top - n.height ? (this.applyPosition({
top: n.top - n.height - this.activatorOffset.top - this.activatorOffset.height / 2
}), this.addRemoveClass("low", !0)) : (this.applyPosition({
top: this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)), this.activatorOffset.left + this.activatorOffset.width < e ? (this.addClass("left"), this.addClass("corner"), !0) : this.activatorOffset.left > t ? (this.addClass("right"), this.addClass("corner"), !0) : !1;
},
getBoundingRect: function(e) {
var t = e.getBoundingClientRect();
return !t.width || !t.height ? {
left: t.left,
right: t.right,
top: t.top,
bottom: t.bottom,
width: t.right - t.left,
height: t.bottom - t.top
} : t;
},
getViewHeight: function() {
return window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight;
},
getViewWidth: function() {
return window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
},
resetPositioning: function() {
this.removeClass("right"), this.removeClass("left"), this.removeClass("high"), this.removeClass("low"), this.removeClass("corner"), this.removeClass("below"), this.removeClass("above"), this.removeClass("vertical"), this.removeClass("horizontal"), this.applyPosition({
left: "auto"
}), this.applyPosition({
top: "auto"
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// App.js

enyo.kind({
name: "App",
kind: enyo.FittableRows,
classes: "enyo-fit",
components: [ {
kind: "ShowMap",
fit: !0
} ]
});

// CampaignBuilder.js

enyo.kind({
name: "CampaignBuilder",
kind: onyx.Drawer,
open: !1,
orient: "h",
style: "height: 100%; width: 100%;",
layoutKind: enyo.FittableColumnsLayout,
events: {
onDrawerToggled: "",
onResizeMap: ""
},
handlers: {
onNewTapped: "toggleDrawer",
onFinishedSavingTask: "finishCreateTask",
onStep: "drawerAnimationEndHandler",
onShowTapped: "closeDrawer",
onNewTask: "resizeUs",
onNewLocation: "newLocation",
onShowQuestion: "openQuestionDrawer",
onDestroyed: "checkTaskTitles"
},
components: [ {
kind: enyo.FittableRows,
fit: !0,
style: "height: 100%; width: 550px;",
classes: "light-background",
components: [ {
name: "header",
kind: "CampaignHeader"
}, {
name: "nameContainer",
kind: enyo.FittableColumns,
components: [ {
name: "taskButton",
kind: onyx.Button,
style: "height: 41px;",
classes: "button-style",
ontap: "createTask",
attributes: {
title: "Add a new task to this campaign."
},
components: [ {
name: "more",
tag: "i",
classes: "icon-plus"
} ]
}, {
name: "nodeContainer",
kind: onyx.RadioGroup,
classes: "light-background",
fit: !0
} ]
}, {
name: "realContainer",
kind: enyo.Panels,
arrangerKind: enyo.CarouselArranger,
classes: "dark-background",
wrap: !1,
animate: !0,
fit: !0
} ]
} ],
closeDrawer: function(e, t) {
this.setOpen(!1);
},
create: function(e, t) {
this.inherited(arguments), this.render();
},
checkTaskTitles: function(e, t) {
this.waterfallDown("onDestroyed", {
us: t.us
});
if (t.us.kind === "TaskBuilder") {
var n = t.us.$.taskTitle.getTitle().charAt(1);
this.log(n), enyo.forEach(this.$.nodeContainer.getControls(), function(e, t) {
String(e.getContent()) > n && e.setContent(Number(e.getContent()) - 1);
}, this);
var r = this.$.nodeContainer.getControls();
r[Number(n) - 1].destroy(), this.$.realContainer.setIndexDirect(Number(n));
}
},
rendered: function(e, t) {
this.inherited(arguments);
},
createTask: function(e, t) {
var n = this.$.realContainer.getComponents().length, r = this.getHeight(), i = "height: " + r + " !important; width: 100%;";
this.log(n), n === 1 ? this.$.nodeContainer.createComponent({
active: !0,
classes: "dark-background-flat",
style: "height: 100%;",
content: n,
ontap: "gotoTask"
}, {
owner: this
}) : this.$.nodeContainer.createComponent({
classes: "dark-background-flat",
style: "height: 100%;",
content: n,
ontap: "gotoTask"
}, {
owner: this
}), this.$.realContainer.createComponent({
kind: "TaskBuilder",
index: n,
style: i,
type: "TaskBuilder",
classes: "active-card"
}), this.$.realContainer.render(), this.$.realContainer.resized(), this.$.nodeContainer.render(), n === 12 && this.$.taskButton.setDisabled(!0);
},
getHeight: function(e, t) {
var n = this.hasNode().offsetHeight, r = this.$.header.hasNode().offsetHeight, i = this.$.taskButton.hasNode().offsetHeight;
return n - r - i;
},
getData: function(e, t) {
var n = {};
return n.id = 0, n.start_date = "", n.end_date = "", enyo.mixin(n, this.$.header.getData()), n.tasks = this.getTasks(), n.owner_id = LocalStorage.get("user"), n;
},
getTasks: function(e, t) {
var n = [];
return enyo.forEach(this.$.realContainer.getPanels(), function(e, t) {
n.push(e.getData());
}, this), n;
},
gotoTask: function(e, t) {
this.log();
var n = e.getContent();
this.$.realContainer.setIndex(Number(n) - 1);
},
newLocation: function(e, t) {
var n = this.$.realContainer.index;
return this.$.realContainer.getPanels()[n].newLocation(t), !0;
},
openQuestionDrawer: function(e, t) {
this.$.questionDrawer.setOpen(!0);
},
scrollDown: function(e, t) {
this.$.nodeContainer.scrollToBottom();
},
toggleDrawer: function(e, t) {
var n = this.getOpen();
this.setOpen(!n);
},
removeAllTasks: function(e, t) {
this.log(), this.$.realContainer.destroyComponents(), this.$.nodeContainer.resized(), this.$.realContainer.render();
},
drawerAnimationEndHandler: function(e, t) {
this.log(), this.doResizeMap();
}
});

// CampaignHeader.js

enyo.kind({
name: "CampaignHeader",
kind: enyo.FittableRows,
published: {},
events: {
onTitleCollapsing: "",
onDestroy: ""
},
components: [ {
classes: "standard-card",
components: [ {
name: "campaignTitle",
kind: "TitledInput",
big: !0,
title: "1. Campaign Title",
placeholder: "Campaign Title"
}, {
name: "campaignDesc",
kind: "TitledInput",
big: !0,
title: "2. Campaign Description",
placeholder: "Please Describe your Campaign goals..."
}, {
kind: "Title",
big: !0,
title: "3. Create Tasks",
instructions: "Create a task below (10 maximum). Tasks will be saved automatically.",
classes: "nice-padding"
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.render();
},
getData: function(e, t) {
var n = {};
return n.description = this.$.campaignDesc.getData(), n.title = this.$.campaignTitle.getData(), n;
}
});

// ComplexSensr.js

enyo.kind({
name: "ComplexSensr",
classes: "light-background",
kind: enyo.FittableRows,
published: {
data: ""
},
events: {
onSubmisisonMade: "",
on2DrawerClick: "",
onRenderScroller: ""
},
handlers: {
onSenseOpened: "openNext",
onPhotoOk: "photoOk",
onDeviceReady: "setReady",
onRenderDrawer: "renderDrawer2",
onTimerStarted: "jumpToCounter"
},
components: [ {
kind: "enyo.Signals",
onGPSSet: "currentLocation",
onPinClicked: "chosenLocation",
onPhotoData: "photoData",
onButtonGroupChosen: "renderSubmitButton"
}, {
name: "doubleCheckPopup",
kind: onyx.Popup,
autoDismiss: !1,
centered: !0,
floating: !0,
modal: !0,
scrimWhenModal: !1,
scrim: !0,
classes: "light-background",
style: "width: 80%;",
components: [ {
name: "doubleCheckMessage",
content: "Are you sure you want to cancel? You will lose all observation data recorded",
style: "padding: 5px 0px;"
}, {
kind: enyo.ToolDecorator,
classes: "senseButtons",
components: [ {
name: "no",
kind: onyx.Button,
classes: "button-style button-style-negative",
ontap: "close",
components: [ {
tag: "i",
classes: "icon-ban-circle icon-large"
} ]
}, {
name: "yes",
kind: onyx.Button,
classes: "button-style button-style-affirmative",
ontap: "close",
components: [ {
tag: "i",
classes: "icon-ok icon-large"
} ]
} ]
} ]
}, {
name: "acc",
kind: "enyo.Scroller",
layoutKind: enyo.FittableRowsLayout,
vertical: "auto",
horizontal: "hidden",
fit: !0,
strategyKind: "TouchScrollStrategy"
}, {
name: "buttons",
kind: enyo.ToolDecorator,
classes: "senseButtons",
components: [ {
kind: onyx.Button,
classes: "button-style button-style-negative",
ontap: "togglePopup",
components: [ {
tag: "i",
classes: "icon-ban-circle icon-large"
} ]
}, {
name: "submit",
kind: onyx.Button,
classes: "button-style button-style-affirmative",
ontap: "togglePopup",
components: [ {
tag: "i",
classes: "icon-ok icon-large"
} ]
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.render(), this.counterName = "";
},
recreate: function() {
this.log(this.$.formDiv), this.setTaskData(this.data), this.imageOK = !0, this.$.formDiv.createComponent({
name: "qbody",
fit: !0,
components: []
});
},
rendered: function(e, t) {
this.inherited(arguments), this.resized(), this.reflow();
},
currentLocation: function() {},
chosenLocation: function(e, t) {
this.chosen_location = t;
},
photoData: function(e, t) {
LocalStorage.set("image", JSON.stringify(t));
},
takePhoto: function() {
this.log();
var e = this.$, t = {
quality: 25,
destinationType: Camera.DestinationType.FILE_URI,
EncodingType: Camera.EncodingType.JPEG
};
navigator.camera.getPicture(enyo.bind(e, this.onPhotoSuccess), enyo.bind(e, this.onPhotoFail), t);
},
onPhotoSuccess: function(e) {
var t = e;
this.$.formDiv.$.qbody.$.imgDiv.createComponent({
name: "myImage",
kind: "enyo.Image",
src: "./assets/leaf-2.jpg"
}), this.$.formDiv.$.qbody.$.imgDiv.render(), this.$.submit.setDisabled(!1), this.camComplete = !0, enyo.Signals.send("onPhotoData", e);
},
renderSubmitButton: function(e, t) {
this.$.submit.setDisabled(!1);
},
onPhotoFail: function(e) {
console.log(e);
},
retakePhoto: function() {
!this.complex && this.$.formDiv.$.qbody.$.imgDiv.getComponents().length > 0 && this.$.formDiv.$.qbody.$.imgDiv.destroyComponents(), this.onPhotoSuccess();
},
viewChanged: function(e, t) {},
openNext: function() {
return !this.complex, !0;
},
photoOk: function() {
return this.log(), !0;
},
setTaskData: function(e) {
this.task = e.tasks[0], this.campTitle = e.title, questionBody = [];
var t = -1;
for (i in this.task.questions) {
var n = this.task.questions[i], r = "name_" + n.id;
type = n.type;
if (type.indexOf("complex") != -1) {
type = "counter";
var s = type.search(/\d/), o = 0;
if (s != -1) var o = type.charAt(s);
}
switch (type) {
case "text":
this.$.acc.createComponent({
name: r,
style: "clear: both;",
content: n.question
}), this.newFormText(n);
break;
case "exclusive_multiple_choice":
this.$.acc.createComponent({
name: r,
style: "clear: both;",
content: n.question
}), this.newFormExclusiveChoice(n);
break;
case "multiple_choice":
this.$.acc.createComponent({
name: r,
style: "clear: both;",
content: n.question
}), this.newFormMultipleChoice(n);
break;
case "counter":
t = i;
break;
case "cur_time":
this.newTime(n);
break;
case "media_camera":
case "media_audio":
case "media_video":
this.newMediaReading(n);
default:
}
}
this.render();
if (t > -1) {
var u = this.task.questions[t];
this.newFormCounter(u);
}
this.render(), this.resized();
},
fileEntry: function(e) {
window.resolveLocalFileSystemURI(e, this.getImageData, null);
},
getImageData: function(e) {
read = new FileReader, console.log(e), read.onloadend = function(e) {
console.log(e.target.result);
};
var t = read.readAsDataURL(e);
console.log(t);
},
makeImageSend: function(e, t) {
var n = btoa(this.utf8_encode(t));
this.$.senses.createComponent({
kind: "enyo.Image",
src: "data:image/jpeg;base64," + n
});
var r = "image?", i = new Date, s = (i.getMonth() + 1).toString();
while (s.length < 2) s = "0" + s;
var o = i.getDate().toString();
while (o.length < 2) o = "0" + o;
var u = i.getFullYear().toString() + s.toString() + o.toString() + "_" + i.getHours().toString() + i.getMinutes().toString() + i.getSeconds().toString();
r += "userName=" + Data.getUserName(LocalStorage.get("user")) + "&", r += "imageFileName=" + this.campTitle.replace(/ /g, "%20") + "_" + u + ".jpg&";
var a = Data.getURL() + r, f = new enyo.Ajax({
method: "POST",
url: a,
contentType: "image/jpeg"
});
f.response(this, "imageSubmission");
},
buildAndSendSubmission: function() {
if (!this.$.submit.disabled) {
var e = {
submission: {
task_id: this.task.id,
gps_location: "testy test",
user_id: 5,
img_path: "test",
answers: []
}
}, t = Data.getLocationData(), n = t.latitude + "|" + t.longitude;
e.submission.gps_location = n, e.submission.user_id = LocalStorage.get("user");
for (i in this.task.questions) {
var r = this.task.questions[i];
type = r.type;
if (type.indexOf("complex") != -1) {
type = "counter";
var s = type.search(/\d/), o = 0;
if (s != -1) var o = type.charAt(s);
if (o != questionBody.length && this.complex) var u = "qs" + (o + 1);
}
var a = {
answer: "BOOM",
type: r.type,
q_id: r.id,
sub_id: 0
};
switch (type) {
case "text":
a.answer = this.readFormText(r), e.submission.answers.push(a);
break;
case "exclusive_multiple_choice":
a.answer = this.readFormExclusiveChoice(r), e.submission.answers.push(a);
break;
case "multiple_choice":
a.answer = this.readFormMultipleChoice(r), e.submission.answers.push(a);
break;
case "counter":
var f = this.readFormCounter(r).split("|");
for (x in f) {
var l = {
answer: "BOOM",
type: r.type,
q_id: r.id,
sub_id: 0
}, c = f[x].split(",");
c.splice(0, 1), this.log(c[0]);
var h = new Date;
h.setTime(c[0]), this.log(h), c[0] = h, l.answer = c.join(","), e.submission.answers.push(l);
}
break;
case "cur_time":
a.answer = this.readTime(r), e.submission.answers.push(a);
break;
default:
continue;
}
}
this.log("SENDING TO SERVER: " + JSON.stringify(e));
}
},
handlePostResponse: function(e, t) {
this.log("SERVER RESPONSE CAME BACK"), this.log(JSON.stringify(e.xhr.responseText)), this.camComplete = !1, this.$.submit.setDisabled(!0), this.chosen_location = undefined, LocalStorage.remove("image"), this.imageOK = !1, !this.complex && this.$.imgDiv.getComponents().length > 0 && this.$.imgDiv.destroyComponents();
},
imageSubmission: function(e, t) {
this.log(JSON.stringify(e)), this.log(JSON.stringify(t));
},
togglePopup: function(e, t) {
var n = this.$.doubleCheckPopup.getShowing(), r = e.content;
e.getContent() === "Submit" && (this.$.doubleCheckPopup.submit = !0, this.$.doubleCheckMessage.setContent("Are you sure you want to submit your observation to the server?")), this.$.doubleCheckPopup.setShowing(!n);
},
close: function(e, t) {
return this.$.doubleCheckPopup.hide(), e.name === "yes" && (this.$.doubleCheckPopup.submit && this.buildAndSendSubmission(), this.bubble("onSubmissionMade")), !0;
},
testButtons: function(e, t) {
var n = this.$.groupbox.getControls(), r = e.getContent(), t = !0, i = !0;
r === "Bicycles" ? (t = !0, i = !1) : r === "Pedestrians" ? (t = !1, i = !0) : r === "Both" && (i = !0, t = !0);
for (var s in n) {
var o = n[s].name.split("_")[1];
this.$["checkbox_" + o].setDisabled(!1), n[s].getContent() === "Helmet" && !t ? this.$["checkbox_" + o].setDisabled(!0) : n[s].getContent() === "Assistive" && !i && this.$["checkbox_" + o].setDisabled(!0);
}
enyo.Signals.send("onButtonGroupChosen", e);
},
newFormText: function(e) {
var t = "inputDec_" + e.id, n = "input_" + e.id;
this.$.acc.createComponent({
name: t,
style: "clear: both;",
kind: "onyx.InputDecorator",
classes: "onyx-input-decorator center",
components: [ {
name: n,
kind: "onyx.Input",
classes: "onyx-input"
} ]
}, {
owner: this
});
},
newFormExclusiveChoice: function(e) {
var t = "input_" + e.id;
options = e.options.split("|"), array = [];
for (var n in options) n == 0 ? array.push({
content: options[n],
active: !0,
classes: "button-style nice-padding",
ontap: "testButtons"
}) : array.push({
content: options[n],
classes: "button-style nice-padding",
ontap: "testButtons"
});
this.$.acc.createComponent({
name: t,
kind: onyx.RadioGroup,
classes: "center",
components: array
}, {
owner: this
});
},
newTime: function(e) {
var t = new Date;
timeStr = t.toTimeString().split(" ")[0], name = "time_" + e.id, this.$.acc.createComponent({
content: e.question
}), this.$.acc.createComponent({
name: name,
content: timeStr,
classes: "center",
time: t.toTimeString()
});
},
newFormMultipleChoice: function(e) {
var t = e.options.split("|");
this.$.acc.createComponent({
name: "groupbox",
classes: "center",
style: "clear: both;",
kind: enyo.ToolDecorator,
components: []
}, {
owner: this
});
for (i in t) {
var n = "checkbox_" + i, r = "content_" + i;
this.$.groupbox.createComponent({
name: n,
kind: "onyx.Checkbox",
onchange: "testButtons"
}, {
owner: this
}), this.$.groupbox.createComponent({
name: r,
content: t[i]
}, {
owner: this
});
}
},
newFormCounter: function(e) {
var t = "name_" + e.id, n = "counter_" + e.id, r;
for (x in this.task.questions) if (this.task.questions[x].type === "exclusive_multiple_choice") {
var r = this.task.questions[x].id.toString();
break;
}
var i = "input_" + r, s = document.body.clientHeight - 57 - 32;
this.$.acc.createComponent({
kind: "BikeCounter",
style: "height: " + s + "px; width: 100%;"
}, {
owner: this
}), this.counterName = n;
},
newMediaReading: function(e) {
var t = "sensor_" + e.id, n = e.type.split("_")[1];
this.$.acc.createComponent({
name: t,
kind: "MediaSensor",
type: n,
sendAutomatically: !1
});
},
readFormText: function(e) {
var t = "input_" + e.id;
return this.$[t].getValue();
},
readFormExclusiveChoice: function(e) {
var t = "input_" + e.id, n = this.$[t].children;
for (x in n) if (n[x].hasClass("active")) return n[x].getContent();
},
readFormMultipleChoice: function(e) {
var t = [];
for (i in e.options.split("|")) {
var n = "checkbox_" + i, r = "content_" + i;
this.$[n].getValue() && t.push(questionBody[0].$.groupbox.$[r].getContent());
}
return t.join("|");
},
readFormCounter: function(e) {
var t;
return this.log(this.counterName), t = this.$.bikeCounter.getData(), this.log(t), t.join("|");
},
readTime: function(e) {
var t = "time_" + e.id, n = this.$.acc.$[t].time;
return n;
},
jumpToCounter: function(e, t) {
this.$.acc.scrollToControl(this.$.bikeCounter);
}
});

// CreateMap.js

enyo.kind({
name: "CreateMap",
style: "overflow: hidden;",
fit: !0,
kind: enyo.FittableColumns,
components: [ {
kind: enyo.Signals,
onMapClicked: "newPin",
onTaskEdited: "pickTask"
}, {
name: "gps",
kind: "rok.geolocation",
watch: !0,
enableHighAccuracy: !0,
timeout: this.gpsTimeout,
maximumAge: "3000",
onSuccess: "locSuccess",
onError: "locError"
}, {
kind: enyo.FittableRows,
components: [ {
name: "pinButton",
kind: enyo.Button,
content: "Add Pins",
classes: "map-button",
ontap: "clickToAddPins"
}, {
name: "polygonButton",
kind: enyo.Button,
content: "Add Polygon",
classes: "map-button",
ontap: "clickToAddPolygon"
}, {
name: "shapefileButton",
kind: enyo.Button,
content: "Upload a Shapefile",
classes: "map-button",
ontap: "clickToAddShapeFile"
} ]
}, {
name: "mapCont",
fit: !0,
style: "background-color: green; height: 100%;"
} ],
published: {
gpsTimeout: "10000",
location: ""
},
events: {},
handlers: {},
create: function(e) {
this.inherited(arguments), this.$.gps.setTimeout(this.gpsTimeout), userMoved = !1, loaded = !1, this.panZoomed = !1, this.firstTime = !0, this.notShowing = !0, this.locSuc = !1, this.loaded = !1, this.locations = [], this.addPins = !1, this.addPolygon = !1, this.addShapeFile = !1, this.events.onPins = "", enyo.bind(this, this.newPin);
},
rendered: function() {
this.inherited(arguments), this.$.gps.getPosition(), this.straction = new OpenLayers.Map(this.$.mapCont.id);
var e = this.straction.getControlsBy("displayClass", "olControlAttribution");
this.straction.removeControl(e[0]);
var t = new OpenLayers.Layer.OSM("OSM", null, {
transitionEffect: "resize"
});
this.pointsLayer = new OpenLayers.Layer.Vector("points", {
styleMap: new OpenLayers.StyleMap({
externalGraphic: "assets/pin2.png",
graphicOpacity: 1,
graphicHeight: 44,
graphicWidth: 44
}),
projection: "EPSG:4326"
}), this.polyLayer = new OpenLayers.Layer.Vector("polygons", {
styleMap: new OpenLayers.StyleMap({
fillOpacity: .3,
fillColor: "#00FF00",
strokeWidth: .5
}),
projection: "EPSG:4326"
}), this.straction.addLayers([ t, this.pointsLayer ]), this.nav = new OpenLayers.Control.TouchNavigation({
dragPanOptions: {
enableKinetic: !0
}
}), this.zoom = new OpenLayers.Control.Zoom, this.select = new OpenLayers.Control.SelectFeature(this.pointsLayer, {
autoActivate: !0,
onSelect: enyo.bind(this, this.makeBubbleClick)
}), this.mousePos = new OpenLayers.Control.MousePosition, this.drawPolygon = new OpenLayers.Control.DrawFeature(this.polyLayer, OpenLayers.Handler.Polygon), this.straction.addControls([ this.nav, this.zoom, this.select, this.drawPolygon, this.mousePos ]), this.drawPolygon.deactivate(), this.straction.events.register("zoomend", this.straction, this.makeFilter()), this.straction.events.register("moveend", this.straction, this.makeFilter());
},
deactivateMap: function(e, t) {
t === "pin" && this.$.pinButton.addRemoveClass("active", e), t === "poly" && this.$.polygonButton.addRemoveClass("active", e), e ? (this.zoom.deactivate(), this.nav.deactivate(), this.click.activate(), t === "poly" && this.drawPolygon.activate()) : (this.zoom.activate(), this.nav.activate(), this.click.deactivate(), t === "poly" && this.drawPolygon.deactivate());
},
clickToAddPins: function(e, t) {
this.addPins = !this.addPins, this.deactivateMap(this.addPins, "pin");
},
newPin: function(e) {
var t = e.xy, n = this.straction.getLonLatFromPixel(t), r = new OpenLayers.Projection("EPSG:4326"), i = this.straction.getProjectionObject();
n.transform(i, r);
if (this.addPin) {
var s = "" + n.lon.toString() + "," + n.lat.toString();
this.locations.push(s), this.addMarkers();
} else this.addPolygon;
},
clickToAddPolygon: function(e, t) {
this.addPolygon = !this.addPolygon, this.deactivateMap(this.addPolygon, "poly"), this.polyLayer;
},
clickToAddShapeFile: function(e, t) {},
mapLoaded: function() {
this.loaded = !0, this.log(this.loaded);
},
locSuccess: function(e, t) {
return Data.setLocationData(t.coords), this.locSuc = !0, this.locSuc && !this.loaded && !this.panZoomed && this.centerMap(), !0;
},
locError: function(e, t) {
this.log();
},
checkMap: function(e) {
this.locPlot(e);
},
locPlot: function(e) {
this.locations = e;
var t = /-\d+\.\d+,\d+\.\d+/;
this.locations.match(t) != null && (this.locations = this.locations.split("|"), this.addMarkers());
},
makeFilter: function() {
this.loaded && (this.panZoomed = !0), this.addMarkers();
},
addMarkers: function() {
if (this.locations instanceof Array) for (x in this.locations) {
this.log(x);
var e = this.locations[x].split(","), t = this.convertXYToLonLat(e[0], e[1]), n = new OpenLayers.Geometry.Point(t.lon, t.lat);
this.pointsLayer.addFeatures([ new OpenLayers.Feature.Vector(n) ]);
}
this.straction.addLayer(this.pointsLayer), this.pointsLayer.refresh(), this.pointsLayer.display(!0);
},
centerMap: function() {
var e = Data.getLocationData(), t = this.convertCoordsToLonLat(e);
this.straction.setCenter(t, 12), this.loaded || this.mapLoaded();
},
makeBubbleClick: function(e) {
var t = this.convertLonLatToCoords(e.geometry);
enyo.Signals.send("onPinClicked", t);
},
makeButtonBubbleClick: function(e, t) {
var n = this.convertCoordsToLonLat(Data.getLocationData());
enyo.Signals.send("onPinClicked", n);
},
makeBubbleLoad: function() {
loaded = !0, this.doLoaded();
},
pickTask: function(e, t) {
return this.log(t.taskData), !0;
},
convertLonLatToCoords: function(e) {
var t = new OpenLayers.LonLat(Number(e.x), Number(e.y)), n = new OpenLayers.Projection("EPSG:4326"), r = this.straction.getProjectionObject();
return t.transform(r, n), t;
},
convertCoordsToLonLat: function(e) {
var t = new OpenLayers.LonLat(Number(e.longitude), Number(e.latitude)), n = new OpenLayers.Projection("EPSG:4326"), r = this.straction.getProjectionObject();
return t.transform(n, r), t;
},
convertXYToLonLat: function(e, t) {
var n = new OpenLayers.LonLat(Number(e), Number(t)), r = new OpenLayers.Projection("EPSG:4326"), i = this.straction.getProjectionObject();
return n.transform(r, i), n;
}
});

// CSenseCreateCampaign.js

enyo.kind({
name: "CSenseCreateCampaign",
kind: enyo.FittableRows,
classes: "enyo-fit",
style: "width: 100%;",
events: {
onCampPicked: "",
onPins: ""
},
handlers: {
onCampPicked: "makeTasks",
onCampaignView: "campaignView",
onTaskView: "taskView",
onQuestionView: "questionView"
},
components: [ {
kind: enyo.Signals,
onNew: "openSlider"
}, {
name: "slide",
kind: enyo.Slideable,
layoutKind: enyo.FittableRowsLayout,
unit: "px",
max: 55,
axis: "v",
draggable: !1,
style: "position: absolute; width: 100%; height: 100%; z-index: 1;",
components: [ {
name: "createCampaign",
kind: enyo.Scroller,
style: "background-color: orange; position: relative; width: 90%; margin-left: auto; margin-right: auto;",
fit: !0,
layoutKind: enyo.FittableRowsLayout,
components: [ {
name: "campaignArea",
fit: !0,
components: [ {
name: "newCampaign",
kind: "CSenseNewCampaign",
fit: !0
} ]
} ]
} ]
} ],
create: function(e, t) {
this.inherited(arguments);
},
rendered: function(e, t) {
this.inherited(arguments);
var n = Number(document.body.clientHeight - 55);
this.$.slide.setMin(n * -1), this.$.slide.setValue(n * -1), this.$.slide.addStyles("height: " + n + "px;"), this.resized(), this.$.slide.resized();
},
campaignView: function(e, t) {
return this.$.extraArea.applyStyle("width", "0%"), this.$.campaignArea.resized(), this.$.extraArea.destroyComponents(), this.$.extraArea.render(), !0;
},
openSlider: function(e, t) {
return this.$.slide.isAtMin() && (this.$.newCampaign.destroy(), this.$.campaignArea.createComponent({
name: "newCampaign",
kind: "CSenseNewCampaign",
fit: !0
}, {
owner: this
}), this.$.campaignArea.render(), this.$.createCampaign.render()), this.$.slide.toggleMinMax(), !0;
},
taskView: function(e, t) {
return !0;
},
questionView: function(e, t) {
return !0;
}
});

// CSenseLoginRegister.js

enyo.kind({
name: "CSenseLoginRegister",
classes: "light-background nice-padding",
kind: onyx.Popup,
published: {
register: !1,
autoDismiss: !1,
centered: !0,
floating: !0,
modal: !0,
scrimWhenModal: !1,
scrim: !0
},
events: {
onAnonymousCode: "",
onSuccessCode: "",
onFailureCode: ""
},
components: [ {
name: "rbox",
kind: "onyx.RadioGroup",
components: [ {
content: "Login",
active: !0,
classes: "button-style",
ontap: "setupLogin"
}, {
content: "Register",
classes: "button-style",
ontap: "setupRegister"
} ]
}, {
name: "gbox",
kind: enyo.FittableRows,
classes: "nice-padding",
components: [ {
name: "emailDrawer",
kind: onyx.Drawer,
orient: "v",
open: !1,
components: [ {
name: "email",
kind: enyo.Input,
classes: "hanging-child",
placeholder: "E-Mail",
onkeyup: "emailRegexCheck"
} ]
}, {
name: "username",
kind: enyo.Input,
classes: "hanging-child",
placeholder: "Username",
type: "email",
onkeyup: "checkFields"
}, {
name: "password",
kind: enyo.Input,
classes: "hanging-child",
placeholder: "Password",
type: "password",
onkeyup: "checkFields"
}, {
kind: enyo.ToolDecorator,
classes: "hanging-child",
components: [ {
name: "memoryBox",
kind: "onyx.Checkbox",
ontap: "remember"
}, {
name: "text",
content: "Remember Me"
} ]
}, {
kind: enyo.FittableColumns,
components: [ {
name: "logButton",
kind: onyx.Button,
content: "Login",
classes: "button-style-affirmative nice-padding",
ontap: "buildURL"
}, {
fit: !0
}, {
name: "anonBytton",
kind: onyx.Button,
content: "Stay Anonymous",
classes: "button-style nice-padding",
ontap: "hidePopup"
} ]
} ]
} ],
create: function() {
this.inherited(arguments), this.register ? (this.$.radioButton.setActive(!1), this.$.radioButton2.setActive(!0), this.setupRegister()) : this.setupLogin();
},
rendered: function() {
this.inherited(arguments);
},
setupLogin: function() {
this.register = !1, this.$.emailDrawer.setOpen(!1), this.$.logButton.setContent("Login"), this.$.logButton.render();
},
setupRegister: function() {
this.register = !0, this.$.emailDrawer.setOpen(!0), this.$.logButton.setContent("Register"), this.$.logButton.render();
},
buildURL: function() {
this.log();
if (this.checkFields()) {
this.$.logButton.setDisabled(!1);
var e = "login?";
this.register && (e = "user?", e += "email=" + this.$.email.getValue() + "&"), e += "name=" + this.$.username.getValue() + "&", e += "password=" + this.$.password.getValue();
var t = (new enyo.Ajax({
method: "POST",
url: Data.getURL() + e,
headers: {
"Cache-Control": "no-cache"
},
cacheBust: !0,
handleAs: "text"
})).go().response(this, "handleResponse");
}
},
handleResponse: function(e, t) {
this.log(e.xhr);
if (e.xhr.status === 200) {
var n = JSON.parse(e.xhr.responseText);
this.log(n.points), this.log(n.uid), this.log("WEEE"), this.hide(), LocalStorage.set("points", JSON.stringify(n.points)), LocalStorage.set("user", JSON.stringify(n.uid)), LocalStorage.set("username", JSON.stringify(n.name)), this.$.memoryBox.getValue() && LocalStorage.set("remember", !0), this.doSuccessCode();
} else this.log(JSON.stringify(e)), this.log(e.xhr.status), this.log("BOOO"), this.doFailureCode();
},
hidePopup: function(e, t) {
this.doAnonymousCode();
},
emailRegexCheck: function() {
var e = /^\w+([\.\+]\w+)*@\w+(\.\w+)*(\.\w{2,})$/;
return e.test(this.$.email.getValue()) ? (this.$.email.applyStyle("color", "black"), !0) : (this.$.email.applyStyle("color", "red"), !1);
},
checkUsernameExists: function() {
return this.$.username.getValue() === "" ? !1 : !0;
},
checkPasswordExists: function() {
return this.$.password.getValue() === "" ? !1 : !0;
},
checkFields: function() {
return this.checkUsernameExists() && this.checkPasswordExists() ? this.register && this.emailRegexCheck ? (this.$.logButton.setDisabled(!1), !0) : (this.$.logButton.setDisabled(!1), !0) : !1;
}
});

// CSenseShowCampaigns.js

enyo.kind({
name: "CSenseShowCampaigns",
kind: enyo.FittableRows,
events: {
onSelectCampaign: "",
onSelectTask: "",
onClearTaskSelection: "",
onDrawerToggled: "",
onTaskDrawerOpened: "",
onTaskDetailDrawerOpened: "",
onAPIResponse: "",
onResizeMap: ""
},
handlers: {
onNewTapped: "closeDrawers",
onShowTapped: "toggleDrawer",
onStep: "drawerAnimationEndHandler",
onListResized: "setListHeights",
onCSenseTaskDetailResized: "setTaskDetailContentHeight",
onTaskMarkerClicked: "showTaskDetail",
onViewportChanged: "updateTaskDetail",
onClusterSelection: "updateTaskDetail",
onReceiveNewSubmissions: "integrateNewSubmissions",
onCleanupSelected: "removeSelectionList",
onHilightSubmission: "setSubDetails"
},
components: [ {
kind: enyo.FittableRows,
fit: !0,
components: [ {
kind: enyo.FittableColumns,
fit: !0,
components: [ {
name: "campaignDrawer",
kind: onyx.Drawer,
layoutKind: enyo.FittableRowsLayout,
style: "z-index: 15; position: relative;",
orient: "h",
open: !1,
classes: "dark-background",
components: [ {
name: "campDrawerHeader",
content: "Campaigns:"
}, {
name: "campList",
kind: "CSenseShowCampaignsList",
onSetupItem: "setupCampList",
style: "width: 150px; padding: 4px; ",
touch: !0,
count: 0,
components: [ {
name: "campItem",
kind: "onyx.Item",
ontap: "campTapped",
classes: "bordering standard-card",
components: [ {
name: "campTitle",
content: "title"
} ]
} ]
} ]
}, {
name: "taskDrawer",
kind: onyx.Drawer,
style: "z-index: 15; position: relative;",
orient: "h",
open: !1,
classes: "dark-background",
components: [ {
name: "taskDrawerHeader",
content: "Tasks:"
}, {
name: "taskList",
kind: "CSenseShowCampaignsList",
onSetupItem: "setupTaskList",
style: "width: 150px; padding: 4px;",
touch: !0,
count: 0,
components: [ {
name: "taskItem",
kind: "onyx.Item",
ontap: "taskTapped",
classes: "bordering standard-card",
components: [ {
name: "taskTitle",
content: "title"
} ]
} ],
taskIdToIndex: {}
} ]
}, {
name: "taskDetailDrawer",
kind: onyx.Drawer,
style: "z-index: 15; position: relative;",
orient: "h",
open: !1,
classes: "dark-background",
published: {
currentTaskId: null
},
components: [ {
name: "taskDetailDrawerContent",
kind: "CSenseTaskDetail",
fit: !0,
style: "width: 200px;padding: 4px;"
} ]
} ]
}, {
name: "detailDrawer",
kind: onyx.Drawer,
orient: "v",
open: !1,
classes: "light-background",
style: "max-width: 524px;",
components: [ {
kind: enyo.FittableColumns,
classes: "active-card",
components: [ {
name: "heading",
content: "Submission details",
fit: !0
}, {
tag: "i",
classes: "icon-remove icon-2x hilight-icons-negative",
ontap: "closeDetailDrawer"
} ]
}, {
name: "sub",
content: "Submitter:"
}, {
name: "num",
content: "Number of answers:"
}, {
name: "answers"
}, {
name: "loc",
content: "Location:"
} ]
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.campData = [];
var n = new enyo.Ajax({
url: Data.getURL() + "campaign.json",
method: "GET",
handleAs: "json"
});
n.response(this, "handleResponse"), n.go(), this.selectedCampIndex = null;
},
rendered: function(e, t) {
this.inherited(arguments);
},
integrateNewSubmissions: function(e, t) {
for (var n = 0; n < t.submissions.length; n++) {
var r = t.submissions[n], i = 0, s = !0;
while (i < this.campData.length && s) {
var o = this.campData[i], u = 0;
while (u < o.tasks.length && s) o.tasks[u].id === r.task_id && (s = !1, this.campData[i].tasks[u].submissions.push(r)), u++;
i++;
}
}
},
updateTaskDetail: function(e, t) {
this.$.taskDetailDrawer.getOpen() && this.$.taskDetailDrawerContent.setCont(t.submissions);
},
handleResponse: function(e, t) {
this.campData = t.campaigns, this.$.campList.setCount(this.campData.length), this.$.campList.reset(), this.doAPIResponse({
time: e.startTime
});
},
campTapped: function(e, t) {
var n = t.index;
this.selectCampIndex !== n && (this.selectedCampIndex = n), this.$.campList.render(), this.showTasks(this.campData[n].tasks), this.doSelectCampaign({
campaign: this.campData[n],
offset: 150
});
},
taskTapped: function(e, t) {
var n = t.index;
this.showTaskDetail(null, {
task: this.taskData[n]
});
},
setSubDetails: function(e, t) {
var n = t.sub;
this.$.sub.setContent("Submitter: " + n.user_id), this.$.num.setContent("Number of answers: " + n.answers.length), this.$.answers.destroyComponents();
for (var r in n.answers) {
this.log(n.answers[r]);
switch (n.answers[r].answer_type) {
case "text":
this.$.answers.createComponent({
name: "q" + r,
content: n.answers[r].question.question,
style: "font-weight: bold;",
classes: "hanging-child"
}), this.$.answers.createComponent({
name: "ans" + r,
content: n.answers[r].answer,
classes: "hanging-child"
});
break;
case "multiple_choice":
case "exclusive_multiple_choice":
this.$.answers.createComponent({
name: "q" + r,
content: n.answers[r].question.question + " (" + n.answers[r].question.options.split("|").join(", ") + ")",
style: "font-weight: bold;",
classes: "hanging-child"
}), this.$.answers.createComponent({
name: "ans" + r,
content: n.answers[r].choices,
classes: "hanging-child"
});
break;
case "complex_counter":
this.$.answers.createComponent({
name: "q" + r,
content: n.answers[r].question.question,
style: "font-weight: bold;",
classes: "hanging-child"
}), this.$.answers.createComponent({
name: "ans" + r,
content: n.answers[r].counts,
classes: "hanging-child"
});
}
}
this.$.answers.render(), this.getGeocode(n), this.resized(), this.$.detailDrawer.setOpen(!0);
},
closeDetailDrawer: function(e, t) {
this.$.detailDrawer.setOpen(!1);
},
getGeocode: function(e) {
var t = e.gps_location.split("|"), n = new enyo.Ajax({
handleAs: "json",
url: "http://open.mapquestapi.com/nominatim/v1/search?format=json&q=" + t[0] + "+" + t[1]
});
n.response(this, "reverseGeocode"), n.go();
},
reverseGeocode: function(e, t) {
return this.log(e), this.log(t), this.$.loc.setContent("Location: " + t[0].display_name), "123 Fake St SE, Minneapolis, MN";
},
showTasks: function(e) {
return this.doClearTaskSelection(), this.taskData = e, this.$.taskList.taskIdToIndex = {}, this.$.taskList.setCount(this.taskData.length), this.$.taskDrawer.setOpen(!0), this.$.taskList.reset(), this.$.taskDetailDrawer.setOpen(!1), !0;
},
showTaskDetail: function(e, t) {
var n = t.task;
this.$.taskDetailDrawerContent.startSpinner(), this.$.taskDetailDrawer.setOpen(!0), this.$.taskList.select(this.getTaskListIndex(n.id)), this.$.taskDetailDrawerContent.stopSpinner();
},
getTaskListIndex: function(e) {
return this.$.taskList.taskIdToIndex[e];
},
removeSelectionList: function(e, t) {
this.$.campList.reset(), this.$.taskList.reset();
},
toggleDrawer: function(e, t) {
return this.$.campaignDrawer.getOpen() ? this.closeDrawers() : this.$.campaignDrawer.setOpen(!0), !0;
},
toggleChoiceDrawer: function(e, t) {
var n = this.$.choiceDrawer.getOpen();
this.$.choiceDrawer.setOpen(!n);
},
closeDrawers: function(e, t) {
this.$.campaignDrawer.setOpen(!1), this.$.taskDrawer.setOpen(!1), this.$.taskDetailDrawer.setOpen(!1), this.doClearTaskSelection();
},
setupCampList: function(e, t) {
var n = t.index, r = this.campData[n];
return this.$.campTitle.setContent(r.title), this.$.campItem.addRemoveClass("active-card", e.isSelected(n)), !0;
},
setupTaskList: function(e, t) {
var n = t.index, r = this.taskData[n];
return this.$.taskList.taskIdToIndex[r.id] = n, this.$.taskTitle.setContent(r.instructions), this.$.taskItem.addRemoveClass("active-card", e.isSelected(n)), !0;
},
setListHeights: function(e, t) {
this.$.taskList.addStyles("height:" + this.$.taskDrawer.getBounds().height + "px;"), this.$.campList.addStyles("height:" + this.$.campaignDrawer.getBounds().height + "px;");
},
setTaskDetailContentHeight: function(e, t) {
this.$.taskDetailDrawerContent.addStyles("height:" + this.$.taskDetailDrawer.getBounds().height + "px;");
},
drawerAnimationEndHandler: function(e, t) {
var n = t.originator.owner;
n.name === "taskDetailDrawer" && n.open === !0 && (this.doSelectTask({
task: task,
taskDetail: this.$.taskDetailDrawerContent
}), this.$.taskDetailDrawerContent.startSpinner(), this.$.taskDetailDrawerContent.setCont(task.submissions, "Task " + task.id, task.instructions), this.$.taskDetailDrawer.currentTaskId = task.id), this.doResizeMap();
}
}), enyo.kind({
name: "CSenseShowCampaignsList",
kind: enyo.List,
events: {
onListResized: ""
},
resizeHandler: function() {
this.inherited(arguments), this.doListResized();
}
});

// CSenseTaskDetail.js

enyo.kind({
name: "CSenseTaskDetail",
kind: enyo.FittableRows,
published: {
task: "",
subs: ""
},
events: {
onCSenseTaskDetailResized: "",
onHilightSubmission: "",
onContentSet: ""
},
handlers: {
onEmphasizeSubmission: "emphasizeSubmission"
},
components: [ {
name: "popHeading",
content: "",
style: "font-weight: 300;"
}, {
name: "popSubHeading",
content: ""
}, {
name: "spinnerDrawer",
kind: onyx.Drawer,
orient: "v",
open: !1,
components: [ {
name: "spinner",
kind: "onyx.Spinner",
classes: "onyx-dark dark-background hidden",
style: "margin-left:auto; margin-right:auto; display:block; margin-top:60px;"
} ]
}, {
name: "repeater",
kind: enyo.List,
fit: !0,
onSetupItem: "setRepeaterValues",
submissionIdToOwnerProxy: {},
count: 0,
components: [ {
name: "itemCont",
kind: enyo.FittableColumns,
style: "width: 100%;",
ontap: "hilightMarker",
classes: "popup-list-item bordering standard-card",
components: [ {
kind: enyo.FittableRows,
classes: "nice-padding",
style: "height: 100%;",
components: [ {
name: "itemHeading",
fit: !0
} ]
} ]
} ]
} ],
setCont: function(e, t, n) {
this.subs = e, this.submissionIdToOwnerProxy = {}, this.$.repeater.setCount(this.subs.length), this.$.repeater.reset(), t && (this.totalSubs = this.subs.length), this.$.popHeading.setContent("Showing " + this.subs.length + " of " + this.totalSubs + " submissions."), n && this.$.popSubHeading.setContent("Click titles below to see details");
},
startSpinner: function() {
this.$.spinner.removeClass("hidden"), this.$.spinnerDrawer.setOpen(!0), this.$.repeater.addClass("hidden");
},
stopSpinner: function() {
this.$.spinner.addClass("hidden"), this.$.spinnerDrawer.setOpen(!1), this.$.repeater.removeClass("hidden");
},
spinFor: function(e) {
this.startSpinner();
var t = this;
setTimeout(function() {
t.stopSpinner();
}, e);
},
setRepeaterValues: function(e, t) {
var n = t.index, r = this.subs[n];
this.data = r, this.$.itemHeading.index = n;
var i = Number(n) + 1;
return this.$.itemHeading.setContent(i), !0;
},
resizeHandler: function() {
this.inherited(arguments), this.doCSenseTaskDetailResized();
},
toggleItemDrawer: function(e, t) {
this.log("toggle item drawer called");
var n = this.$.repeater.children[t.index].$.itemDrawer;
n.setOpen(!n.getOpen());
var r = n.getOpen();
},
hilightMarker: function(e, t) {
var n = t.index;
this.doHilightSubmission({
sub: this.subs[n],
open: open
});
},
getItemCont: function(e) {
return this.getOwnerProx(e).$.itemCont;
},
getOwnerProx: function(e) {
return this.$.repeater.submissionIdToOwnerProxy[e];
},
emphasizeSubmission: function(e, t) {
var n = t.submissionId, r = this.getOwnerProx(n).$.itemDrawer, i = r.animated;
r.animated = !1, r.setOpen(!0), r.animated = i, this.$.popupScroller.scrollIntoView(this.getItemCont(n), !0), this.getItemCont(n).applyStyle("background-color", "#B00200");
var s = this, o = setTimeout(function() {
s.getItemCont(n).hasNode().style[L.DomUtil.TRANSITION] = "all 1000ms ease-out", s.getItemCont(n).hasNode().style["transition-delay"] = "1ms", s.getItemCont(n).hasNode().style["background-color"] = null;
}, 10);
}
});

// Data.js

enyo.kind({
name: "Data",
kind: "enyo.Control",
statics: {
getURL: function() {
return "http://ugly-umh.cs.umn.edu:8080/";
},
getUserName: function(e) {
var t = new enyo.Ajax({
contentType: "application/json",
sync: !0,
url: Data.getURL() + "leaderboard.json"
});
t.response(this, function(e, t) {
this.users = t.leaderboardEntrys;
}), t.go();
for (var n in this.users) if (this.users[n].id == e) return this.log(e), this.users[n].name;
},
setLocationData: function(e) {
LocalStorage.set("loc", e);
},
getLocationData: function() {
return LocalStorage.get("loc");
},
setIsReady: function(e) {
LocalStorage.set("ready", e);
},
getIsReady: function() {
return LocalStorage.get("ready");
}
}
});

// Destroyable.js

enyo.kind({
name: "Destroyable",
kind: enyo.Control,
published: {
type: ""
},
events: {
onDestroyed: ""
},
handlers: {
onDestroy: "remove"
},
components: [],
create: function(e, t) {
this.inherited(arguments), enyo.dispatcher.listen(document, "transitionend", enyo.bind(this, "removeActually")), enyo.dispatcher.listen(document, "webkittransitionend", enyo.bind(this, "removeActually"));
},
remove: function(e, t) {
return this.log(e), e.name === "stepTitle" ? (this.log("question"), this.addRemoveClass("question-builder-destroy", !0)) : e.name.indexOf("destroyable") > -1 ? (this.log("location"), this.addRemoveClass("location-builder-destroy", !0)) : e.name === "taskTitle" && (this.log("task"), this.addRemoveClass("task-builder-destroy", !0)), !0;
},
removeActually: function(e, t) {
return e.originator.name !== "mapCont" && (e.originator.destroy(), this.doDestroyed({
us: e.originator
})), !0;
}
});

// EditableListItem.js

enyo.kind({
name: "EditableListItem",
kind: enyo.ToolDecorator,
style: "width: 100%;",
published: {
type: "checkbox",
fill: "Add new item, hit 'enter' to save",
builder: !1
},
events: {
onDoneEditing: "",
onMakeNew: ""
},
handlers: {
ontap: "flip"
},
components: [ {
name: "input",
kind: onyx.Input,
type: "checkbox"
}, {
name: "cont"
}, {
name: "item2",
kind: onyx.Input,
placeholder: "Hit 'enter' to add an option",
style: "width: 90%;",
onchange: "save"
} ],
create: function(e, t) {
this.inherited(arguments), this.$.cont.setContent(this.fill), this.$.input.setType(this.type), this.$.cont.setContent(this.fill), this.$.item2.hide();
},
flip: function(e, t) {
this.$.cont.hide(), this.$.item2.show(), this.$.item2.focus();
},
save: function(e, t) {
var n = this.$.item2.getValue();
return this.log(n), this.builder ? (this.doMakeNew({
content: n
}), this.log(!0)) : (this.setFill(n), this.$.item2.hide(), this.$.cont.show(), this.doDoneEditing({
content: this.fill
}), this.log(!1)), !0;
},
builderChanged: function(e) {
this.builder ? this.flip() : (this.$.item2.hide(), this.$.cont.show());
},
typeChanged: function(e) {
this.$.input.setType(this.type);
},
fillChanged: function(e) {
this.$.cont.setContent(this.fill);
}
});

// GrouplensBrand.js

enyo.kind({
name: "GrouplensBrand",
kind: enyo.FittableRows,
style: "width: 100%; font-size: 11pt !important;",
classes: "dark-background",
components: [ {
content: "a ",
style: "text-align: center;"
}, {
kind: enyo.Image,
src: "assets/GL-Logo.png",
style: "display: block !important; height: 1em; margin-left: auto; margin-right: auto;"
}, {
content: " project",
style: "text-align: center;"
} ],
create: function(e, t) {
this.inherited(arguments);
}
});

// Helpable.js

enyo.kind({
name: "Helpable",
kind: onyx.MenuDecorator,
published: {
wrappedComponents: [],
helpText: "Your Help Text Goes Here"
},
events: {},
handlers: {
onmouseover: "showPopup",
onmouseout: "hidePopup"
},
components: [ {
name: "popup",
kind: onyx.ContextualPopup,
classes: "light-background",
title: "Help",
components: [ {
name: "text",
content: ""
} ]
} ],
create: function(e, t) {
this.inherited(arguments);
},
rendered: function(e, t) {
this.inherited(arguments);
},
build: function(e, t) {
this.$.holder.createComponents(this.wrappedComponents), this.$.text.setContent(this.helpText), this.resized();
},
showPopup: function(e, t) {
this.$.popup.show();
},
hidePopup: function(e, t) {
this.$.popup.hide();
}
});

// LocalStorage.js

enyo.kind({
name: "LocalStorage",
kind: "Component",
statics: {
set: function(e, t) {
typeof e == "string" && (typeof t == "object" ? localStorage.setItem(e, JSON.stringify(t)) : typeof t == "string" && localStorage.setItem(e, t));
},
get: function(e) {
var t;
typeof e == "string" && (t = localStorage.getItem(e));
if (typeof t == "string") return JSON.parse(t);
if (typeof t == "object" && t !== null) throw enyo.log("OBJECT: " + t), "ERROR [Storage.get]: getItem returned an object. Should be a string.";
typeof t != "undefined" && t !== null;
},
remove: function(e) {
if (typeof e != "string") throw "ERROR [Storage.remove]: 'name' was not a String.";
localStorage.removeItem(e);
},
__getSize: function() {
var e, t = 0;
for (e = 0; e < localStorage.length; e++) t += localStorage.getItem(localStorage.key()).length;
return t;
}
}
});

// QuestionBuilder.js

enyo.kind({
name: "QuestionBuilder",
kind: "Destroyable",
classes: "question-builder",
events: {},
handlers: {
onDoneEditing: "lockList",
onMakeNew: "newOption",
onTitleCollapsing: "toggleQuestionDrawer",
onNewStep: "saveData",
onQDestroyed: "checkTitles"
},
published: {
stepIndex: 1,
questionIndex: 1,
questionData: null
},
components: [ {
name: "stepTitle",
kind: "Title",
title: "#",
big: !0,
save: !0,
fit: !0,
style: "height: 100%;"
}, {
name: "questionTitle",
kind: "Title",
title: "Question #",
classes: "nice-padding",
save: !1
}, {
name: "questionDrawer",
kind: onyx.Drawer,
open: !0,
orient: "v",
layoutKind: enyo.FittableRowsLayout,
classes: "nice-padding",
components: [ {
name: "questionText",
kind: "TitledInput",
title: "What's the question?",
placeholder: "Enter your question text here...",
classes: "nice-padding",
save: !1
}, {
kind: "Title",
title: "Type of Question:",
classes: "nice-padding",
save: !1
}, {
name: "questionChoices",
tag: "select",
classes: "nice-padding hanging-child",
onchange: "questionPicked",
components: [ {
content: "Text",
tag: "option"
}, {
content: "Checkboxes",
tag: "option"
}, {
content: "Multiple Choice",
tag: "option"
}, {
content: "Counter",
tag: "option"
} ]
}, {
name: "optionList",
kind: enyo.List,
fit: !0,
style: "max-height: 50px;",
count: 0,
showing: !1,
fixedHeight: !0,
reorderable: !1,
enableSwipe: !1,
classes: "nice-padding hanging-child",
ontap: "editOption",
onSetupItem: "makeOption",
components: [ {
name: "oItem",
content: "holder"
} ]
}, {
name: "optionEntry",
kind: onyx.Input,
showing: !1,
classes: "nice-padding hanging-child",
placeholder: "Hit 'enter' to add an option",
onchange: "addOption"
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.options = [], this.$.stepTitle.setTitle(this.$.stepTitle.getTitle() + this.stepIndex), this.$.questionTitle.setTitle(this.$.questionTitle.getTitle() + this.questionIndex), this.curType = "text";
},
rendered: function(e, t) {
this.inherited(arguments), this.questionData && this.recreate();
},
addOption: function(e, t) {
this.log(), this.log(this.$.optionEntry.getValue()), this.options.push(this.$.optionEntry.getValue()), this.$.optionEntry.setValue(""), this.$.optionList.setCount(this.options.length), this.$.optionList.reset(), this.$.optionList.resized(), this.$.optionList.scrollToBottom();
},
checkTitles: function(e, t) {
var n = t.us.kind.indexOf("Sensor") > -1 ? !0 : !1, r = t.us.stepIndex, i = t.us.questionIndex;
return r < this.stepIndex && (this.stepIndex = this.stepIndex - 1, this.$.stepTitle.setTitle("#" + this.stepIndex), !n && i < this.questionIndex && (this.questionIndex = this.questionIndex - 1), this.$.questionTitle.setTitle("Question #" + this.questionIndex)), !0;
},
decodeType: function(e) {
var t = "";
switch (e) {
case "Checkboxes":
t = "multiple_choice";
break;
case "Multiple Choice":
t = "exclusive_multiple_choice";
break;
case "Text":
t = "text";
break;
case "Counter":
t = "complex_counter";
}
return t;
},
recodeType: function(e) {
var t = -1;
switch (e) {
case "multiple_choice":
t = 1;
break;
case "exclusive_multiple_choice":
t = 2;
break;
case "text":
t = 0;
break;
case "complex_counter":
t = 3;
}
return t;
},
editOption: function(e, t) {
var n = t.index;
return !0;
},
getData: function(e, t) {
var n = {};
n.id = 0, n.task_id = 0, n.question = this.$.questionText.getText(), n.type = this.curType;
if (n.type === "multiple_choice" || n.type === "exclusive_multiple_choice") {
var r = this.options.pop();
n.options = this.options.join("|"), this.options.push(r), this.log(n.options);
} else this.options = "";
return this.log(n), n;
},
makeOption: function(e, t) {
var n = t.index, r = t.item;
return this.log(n), this.log(this.options[n]), this.$.oItem.setContent(this.options[n]), !0;
},
newOption: function(e, t) {
this.log();
if (this.options.indexOf(t.content) < 0) {
var n = this.options.pop();
this.options.push(t.content), this.options.push(n), this.$.optionList.setCount(this.options.length);
}
return !0;
},
lockList: function(e, t) {
this.$.optionList.lockRow(), this.options[t.index] = t.content;
},
questionPicked: function(e, t) {
var n = e.eventNode, r = n.options[n.selectedIndex].value;
this.curType = this.decodeType(r);
switch (this.curType) {
case "multiple_choice":
this.$.optionList.show(), this.$.optionEntry.show(), this.$.optionList.reset();
break;
case "exclusive_multiple_choice":
this.$.optionList.show(), this.$.optionEntry.show(), this.$.optionList.reset();
break;
default:
this.$.optionList.hide(), this.$.optionEntry.hide();
}
},
recreate: function(e, t) {
this.log(this.questionData), this.$.questionText.setText(this.questionData.question);
if (this.questionData.question.type === "multiple_choice" || this.questionData.question.type === "exclusive_multiple_choice") this.options = this.questionData.options.split("|"), this.$.optionList.setCount(this.options.length), this.$.optionList.show(), this.$.optionList.reset();
this.$.questionChoices.hasNode().selectedIndex = this.recodeType(this.questionData.type);
},
saveData: function(e, t) {
this.$.questionDrawer.getOpen() && this.$.stepTitle.sendSave();
},
toggleQuestionDrawer: function(e, t) {
var n = this.$.questionDrawer.getOpen();
return this.$.questionDrawer.setOpen(!n), !0;
}
});

// QuestionDrawer.js

enyo.kind({
name: "QuestionDrawer",
kind: enyo.FittableRows,
open: !1,
orient: "h",
style: "height: 100%;",
events: {
onResizeMap: "",
onNewQuestion: "",
onQDestroyed: ""
},
handlers: {
onDestroyed: "checkQTitles"
},
components: [ {
kind: enyo.Signals,
onNewStep: "createNewStep",
onEditTask: "reconstituteQuestions",
onQuestionsSaved: "removeAllQuestions"
}, {
name: "spinUp",
kind: onyx.Popup,
centered: !0,
floating: !0,
autoDismiss: !1,
classes: "dark-background-flat",
components: [ {
name: "spin",
kind: onyx.Spinner,
classes: "onyx-dark dark-background"
} ]
}, {
kind: enyo.FittableRows,
fit: !0,
components: [ {
kind: enyo.FittableColumns,
fit: !0,
components: [ {
kind: enyo.FittableRows,
style: "height: 100%;",
components: [ {
style: "height: 33%;",
components: [ {
name: "questionButton",
kind: onyx.Button,
ontap: "addQuestion",
style: "width: 100%; height: 100%;",
attributes: {
title: "Add a question to this task."
},
classes: "button-style dark-background",
components: [ {
kind: enyo.FittableRows,
components: [ {
content: "Add "
}, {
tag: "i",
classes: "icon-question icon-large",
fit: !0
} ]
} ]
} ]
}, {
style: "height: 33%;",
components: [ {
name: "sensorButton",
kind: onyx.Button,
ontap: "addSensor",
style: "width: 100%; height: 100%;",
attributes: {
title: "Add a sensor reading to this task."
},
classes: "button-style dark-background",
components: [ {
kind: enyo.FittableRows,
components: [ {
content: "Add "
}, {
tag: "i",
classes: "icon-eye-open icon-large",
fit: !0
} ]
} ]
} ]
}, {
kind: onyx.Button,
classes: "button-style",
ontap: "buildPreview",
attributes: {
title: "Preview how this task will look when a user is completing it on a phone."
},
style: "width: 100%; height: 100%;",
fit: !0,
components: [ {
tag: "i",
classes: "icon-mobile-phone icon-3x"
} ]
}, {
name: "phonePreviewContainer",
kind: onyx.Popup,
style: "height: 384px; width: 288px;",
centered: !0,
floating: !0,
modal: !0,
layoutKind: enyo.FittableRowsLayout,
classes: "dark-background-flat",
components: [ {
name: "phonePreview",
kind: "ComplexSensr",
fit: !0
} ]
} ]
}, {
name: "questionContainer",
kind: enyo.Scroller,
classes: "dark-background nice-padding",
vertical: "scroll",
horizontal: "hidden",
layoutKind: enyo.FittableRowsLayout,
fit: !0,
components: [ {
name: "realQuestionContainer",
kind: enyo.FittableRows,
fit: !0
} ]
} ]
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.numSensors = 0, this.numQuestions = 0;
},
addQuestion: function(e, t) {
this.waterfallDown("onNewStep");
var n = this.$.realQuestionContainer.getComponents().length + 1;
return this.numQuestions = this.numQuestions + 1, this.$.realQuestionContainer.createComponent({
kind: "QuestionBuilder",
stepIndex: n,
questionIndex: this.numQuestions,
type: "QuestionBuilder",
classes: "nice-padding bordering light-background",
style: "z-index: -1;"
}), this.$.questionContainer.resized(), this.$.questionContainer.render(), this.$.realQuestionContainer.resized(), this.$.realQuestionContainer.render(), this.doNewQuestion(), this.scrollDown(), !0;
},
addSensor: function(e, t) {
this.waterfallDown("onNewStep");
var n = this.$.realQuestionContainer.getComponents().length + 1;
return this.numSensors = this.numSensors + 1, this.$.realQuestionContainer.createComponent({
kind: "SensorChooser",
stepIndex: n,
sensorIndex: this.numSensors,
classes: "nice-padding bordering light-background"
}), this.$.realQuestionContainer.resized(), this.$.realQuestionContainer.render(), this.$.questionContainer.resized(), this.$.questionContainer.render(), this.scrollDown(), !0;
},
buildPreview: function(e, t) {
var n = {};
n.tasks = [];
var r = {};
r.questions = this.getData(), n.tasks.push(r), this.$.phonePreview.setTaskData(n), this.$.phonePreviewContainer.show();
},
checkQTitles: function(e, t) {
if (t.us.kind === "QuestionBuilder" || t.us.kind === "SensorChooser") return t.us.kind === "QuestionBuilder" && (this.numQuestions = this.numQuestion - 1), t.us.kind === "SensorChooser" && (this.numSensors = this.numSensors - 1), this.waterfallDown("onQDestroyed", {
us: t.us
}), !0;
},
createNewStep: function(e, t) {},
closePopup: function(e, t) {
this.$.phonePreviewContainer.hide();
},
reconstituteQuestions: function(e, t) {
this.$.spinUp.show(), this.numQuestions = 0, this.numSensors = 0;
var n = t.questions, r = 0;
for (var i in n) switch (n[i].type.toLowerCase()) {
case "camera":
case "microphone":
case "video":
case "compass":
case "accelerometer":
r = this.$.realQuestionContainer.getComponents().length + 1, this.numSensors++, this.$.realQuestionContainer.createComponent({
kind: "SensorChooser",
stepIndex: r,
sensorIndex: this.numSensors,
questionData: n[i],
classes: "bordering hanging-child active-card task-builder"
});
break;
case "text":
case "multiple_choice":
case "exclusive_multiple_choice":
case "complex_counter":
r = this.$.realQuestionContainer.getComponents().length + 1, this.numQuestions++, this.$.realQuestionContainer.createComponent({
kind: "QuestionBuilder",
stepIndex: r,
questionIndex: this.numQuestions,
questionData: n[i],
classes: "bordering hanging-child active-card task-builder"
});
break;
default:
this.warn("Incorrect question type");
}
this.$.questionContainer.resized(), this.$.questionContainer.render(), this.scrollDown(), this.$.spinUp.hide();
},
getData: function(e, t) {
var n = [];
return enyo.forEach(this.$.realQuestionContainer.getComponents(), function(e, t) {
(e.kind === "QuestionBuilder" || e.kind === "SensorChooser") && n.push(e.getData());
}, this), n;
},
removeAllQuestions: function(e, t) {
this.log(e), this.log(t), this.$.realQuestionContainer.destroyComponents(), e !== "clean" && enyo.Signals.send("onQuestionsRemoved");
},
scrollDown: function(e, t) {
this.$.questionContainer.scrollToBottom();
},
toggleDrawer: function(e, t) {
var n = this.getOpen();
this.setOpen(!n);
var r = n ? -150 : 150;
return this.log(r), this.doResizeMap({
offset: r
}), !0;
}
});

// rok.geolocation.js

enyo.kind({
name: "rok.geolocation",
kind: enyo.Component,
events: {
onSuccess: "",
onError: ""
},
published: {
maximumAge: 3e3,
timeout: 1e4,
enableHighAccuracy: !0,
watch: !1
},
create: function() {
this.inherited(arguments), this.watch ? this.watchPosition() : this.getPosition();
},
destroy: function() {
this.watchId && this.stopWatchPosition(), this.inherited(arguments);
},
watchPosition: function() {
var e = {
maximumAge: this.maximumAge,
timeout: this.timeout,
enableHighAccuracy: this.enableHighAccuracy
};
this.watchId = navigator.geolocation.watchPosition(enyo.bind(this, "onPosition"), enyo.bind(this, "onFailure"), e);
},
stopWatchPosition: function() {
navigator.geolocation.clearWatch(this.watchId), delete this.watchId, this.watch = !1;
},
getPosition: function() {
var e = {
maximumAge: this.maximumAge,
timeout: this.timeout,
enableHighAccuracy: this.enableHighAccuracy
};
navigator.geolocation.getCurrentPosition(enyo.bind(this, "onPosition"), enyo.bind(this, "onFailure"), e);
},
onPosition: function(e) {
var t = {};
t.timestamp = new Date(e.timestamp), t.coords = e.coords, this.doSuccess(t);
},
onFailure: function(e) {
this.doError(e);
},
watchChanged: function() {
this.watch ? this.watchPosition() : this.stopWatchPosition();
}
});

// SaveTitle.js

enyo.kind({
name: "SaveTitle",
kind: enyo.FittableRows,
published: {
title: "Title Goes Here",
big: !1,
circled: !1
},
events: {
onTitleCollapsing: ""
},
handlers: {
ontap: "sendSave"
},
components: [ {
name: "container",
kind: enyo.FittableColumns,
classes: "click-hover",
components: [ {
name: "titleText"
}, {
fit: !0
}, {
name: "saveDrawer",
kind: onyx.Drawer,
orient: "h",
open: !0,
components: [ {
name: "saveButton",
kind: onyx.Button,
content: "Save",
ontap: "sendSave",
classes: "button-style"
} ]
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.$.titleText.setContent(this.title), this.$.titleText.addRemoveClass("number-style", this.circled), this.circled || (this.$.container.addRemoveClass("text-title-small", !this.big), this.$.container.addRemoveClass("text-title-big", this.big));
},
bigChanged: function(e, t) {
this.circled || (this.$.container.addRemoveClass("text-title-small", !this.big), this.$.container.addRemoveClass("text-title-big", this.big));
},
circledChanged: function(e, t) {
this.$.titleText.addRemoveClass("number-style", this.circled);
},
sendSave: function(e, t) {
return this.toggleDrawer(), this.doTitleCollapsing(), !0;
},
titleChanged: function(e, t) {
this.$.titleText.setContent(this.title);
},
toggleDrawer: function(e, t) {
var n = this.$.saveDrawer.getOpen();
this.$.saveDrawer.setOpen(!n);
}
});

// SaveTitledInput.js

enyo.kind({
name: "SaveTitledInput",
kind: enyo.FittableColumns,
published: {
big: !1,
title: "Title Goes Here",
placeholder: "This is a placeholder"
},
components: [ {
kind: enyo.FittableRows,
fit: !0,
components: [ {
name: "title",
kind: "SaveTitle"
}, {
kind: onyx.InputDecorator,
alwaysLooksFocused: !0,
classes: "hanging-child",
components: [ {
name: "input",
kind: onyx.Input,
style: "width: 100%; font-size: 13px;"
} ]
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.$.title.setTitle(this.title), this.$.title.setBig(this.big), this.$.input.setPlaceholder(this.placeholder);
},
bigChanged: function(e, t) {
this.$.title.setBig(this.big);
},
placeholderChanged: function(e, t) {
this.$.input.setPlaceholder(this.placeholder);
},
titleChanged: function(e, t) {
this.$.title.setTitle(this.title);
}
});

// SensorChooser.js

enyo.kind({
name: "SensorChooser",
layoutKind: enyo.FittableRowsLayout,
kind: "Destroyable",
classes: "question-builder",
published: {
sensorIndex: 1,
stepIndex: 1,
questionData: null
},
events: {
onDestroyedQuestion: ""
},
handlers: {
onTitleCollapsing: "toggleSensorDrawer",
onNewStep: "saveData",
onQDestroyed: "checkTitles"
},
components: [ {
name: "stepTitle",
kind: "Title",
big: !0,
save: !0,
fit: !0,
title: "#"
}, {
name: "sensorTitle",
kind: "Title",
title: "Sensor #",
save: !1,
classes: "hanging-child"
}, {
name: "sensorDrawer",
kind: onyx.Drawer,
orient: "v",
open: !0,
classes: "hanging-child",
components: [ {
title: "Choose a Sensor:",
kind: "Title",
save: !1,
classes: "hanging-child"
}, {
tag: "select",
classes: "hanging-child",
onchange: "pickSensor",
components: [ {
tag: "option",
content: "Audio"
}, {
tag: "option",
content: "Photo"
}, {
tag: "option",
content: "Video"
} ]
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.sensorToIndexDict = {
Photo: 0,
Video: 1,
Audio: 2,
Accelerometer: 3,
Compass: 4
}, this.indexToSensorDict = [ "Photo", "Video", "Audio", "Acclerometer", "Compass" ], this.sensorBits = [ !1, !1, !1, !1, !1 ], this.$.stepTitle.setTitle(this.$.stepTitle.getTitle() + this.stepIndex), this.$.sensorTitle.setTitle(this.$.sensorTitle.getTitle() + this.sensorIndex), this.curType = "Audio", this.question = {};
},
getData: function(e, t) {
return this.question.id = 0, this.question.task_id = 0, this.question.required = !0, this.question.options = "", this.curType === "Photo" ? this.question.question = "Take " : this.question.question = "Record ", this.question.question += this.curType, this.question.type = this.curType, this.log(this.question), this.question;
},
checkTitles: function(e, t) {
var n = t.us.kind.indexOf("Sensor") > -1 ? !0 : !1, r = t.us.stepIndex, i = t.us.questionIndex;
return r < this.stepIndex && (this.stepIndex = this.stepIndex - 1, this.$.stepTitle.setTitle("#" + this.stepIndex), n && i < this.sensorIndex && (this.sensorIndex = this.sensorIndex - 1), this.$.sensorTitle.setTitle("Question #" + this.sensorIndex)), !0;
},
toggleSensorDrawer: function(e, t) {
var n = this.$.sensorDrawer.getOpen();
this.$.sensorDrawer.setOpen(!n);
},
pickSensor: function(e, t) {
var n = e.eventNode;
return this.curType = n.options[n.selectedIndex].value, this.getData(), this.log(this.question), !0;
},
saveData: function(e, t) {
this.log(), this.$.sensorDrawer.getOpen() && this.$.stepTitle.sendSave();
}
});

// ShowMap.js

enyo.kind({
name: "ShowMap",
kind: enyo.FittableRows,
classes: "enyo-fit",
components: [ {
kind: enyo.Signals,
onMapClicked: "newPin"
}, {
name: "gps",
kind: "rok.geolocation",
watch: !1,
enableHighAccuracy: !0,
timeout: this.gpsTimeout,
maximumAge: "3000",
onSuccess: "locSuccess",
onError: "locError"
}, {
name: "doubleCheckSendPopup",
kind: onyx.Popup,
autoDismiss: !1,
centered: !0,
floating: !0,
modal: !0,
scrimWhenModal: !1,
scrim: !0,
classes: "light-background",
components: [ {
name: "doubleCheckSendMessage",
content: "Are you sure you want to save(this will store it to the server)?",
style: "padding: 5px 0px;"
}, {
kind: enyo.ToolDecorator,
classes: "senseButtons",
components: [ {
name: "sendNo",
kind: onyx.Button,
classes: "button-style button-style-negative",
ontap: "hideDoubleCheckSend",
components: [ {
tag: "i",
classes: "icon-ban-circle"
} ]
}, {
name: "sendYes",
kind: onyx.Button,
classes: "button-style button-style-affirmative",
ontap: "saveTasksAndQuestions",
components: [ {
tag: "i",
classes: "icon-ok"
} ]
} ]
} ]
}, {
name: "doubleCheckCancelPopup",
kind: onyx.Popup,
autoDismiss: !1,
centered: !0,
floating: !0,
modal: !0,
scrimWhenModal: !1,
scrim: !0,
classes: "light-background",
components: [ {
name: "doubleCheckCancelMessage",
content: "Are you sure you want to cancel (your work will be lost)?",
style: "padding: 5px 0px;"
}, {
kind: enyo.ToolDecorator,
classes: "senseButtons",
components: [ {
name: "cancelNo",
kind: onyx.Button,
classes: "button-style button-style-negative",
ontap: "hideDoubleCheckCancel",
components: [ {
tag: "i",
classes: "icon-ban-circle"
} ]
}, {
name: "cancelYes",
kind: onyx.Button,
classes: "button-style button-style-affirmative",
ontap: "resetTasksAndQuestions",
components: [ {
tag: "i",
classes: "icon-ok"
} ]
} ]
} ]
}, {
name: "sendingPopup",
kind: onyx.Popup,
autoDismiss: !1,
centered: !0,
floating: !0,
modal: !0,
scrimWhenModal: !1,
scrim: !0,
classes: "light-background",
components: [ {
kind: onyx.Spinner,
classes: "onyx-light",
showing: !0
}, {
name: "message",
showing: !1
} ]
}, {
name: "loginRegister",
kind: "CSenseLoginRegister"
}, {
name: "toolbar",
kind: onyx.Toolbar,
layoutKind: enyo.FittableColumnsLayout,
classes: "dark-background-flat",
components: [ {
name: "showButton",
kind: onyx.Button,
classes: "button-style light-background",
disabled: !0,
ontap: "showCampaigns",
attributes: {
title: "Click here to see campaigns and their submissions."
},
components: [ {
name: "spin",
showing: !0,
tag: "i",
classes: "icon-refresh icon-spin"
}, {
name: "menuIcon",
tag: "i",
classes: "icon-list-ul icon-large",
showing: !1
} ]
}, {
content: "FolkSource"
}, {
kind: "GrouplensBrand",
fit: !0,
vertical: !1
}, {
content: "Logged in as: "
}, {
name: "username",
content: "anonymous"
}, {
name: "newButton",
kind: onyx.Button,
classes: "button-style light-background",
showing: !0,
ontap: "showNewMap",
attributes: {
title: "Click here to create a new campaign"
},
components: [ {
tag: "i",
classes: "icon-plus icon-large"
} ]
}, {
kind: enyo.FittableColumns,
components: [ {
name: "cancelButton",
kind: onyx.Button,
classes: "light-background button-style-negative",
attributes: {
title: "Cancel the campaign you were making."
},
style: "width: 50%;",
showing: !1,
ontap: "doubleCheckCancel",
components: [ {
tag: "i",
classes: "icon-ban-circle icon-large"
} ]
}, {
name: "saveButton",
kind: onyx.Button,
classes: "light-background button-style-affirmative",
attributes: {
title: "Finish the campaign you were making."
},
style: "width: 50%;",
showing: !1,
ontap: "doubleCheckSend",
components: [ {
tag: "i",
classes: "icon-ok icon-large"
} ]
} ]
} ]
}, {
name: "container",
kind: enyo.FittableColumns,
fit: !0,
components: [ {
kind: "CSenseShowCampaigns"
}, {
name: "mapCont",
fit: !0,
style: "position: relative;",
components: [ {
name: "addLocationsAndRegionsToolbar",
kind: onyx.Drawer,
open: !1,
style: "z-index: 10; float: right;",
components: [ {
name: "addLandRRadioGroup",
kind: onyx.RadioGroup,
components: [ {
name: "addLocationButton",
kind: onyx.Button,
classes: "button-style",
content: "Add Location"
}, {
name: "addRegionButton",
kind: onyx.Button,
classes: "button-style",
content: "Add Region"
}, {
name: "finishAddingButton",
kind: onyx.Button,
content: "Done",
classes: "button-style-affirmative",
ontap: "deactivateEditingInterface",
style: "margin-left: 8px;"
} ]
} ]
}, {
name: "modifyToolbar",
kind: onyx.Drawer,
open: !1,
style: "z-index: 10; float: right;",
components: [ {
kind: enyo.ToolDecorator,
components: [ {
name: "undoButton",
kind: onyx.Button,
content: "Undo",
classes: "button-style-negative",
style: "margin-right: 8px;"
}, {
name: "modifyRadioGroup",
kind: onyx.RadioGroup,
components: [ {
name: "modifyFeaturesButton",
kind: onyx.Button,
classes: "button-style",
content: "Edit"
}, {
name: "removeFeaturesButton",
kind: onyx.Button,
classes: "button-style",
content: "Remove"
}, {
name: "finishEditingButton",
kind: onyx.Button,
content: "Done",
classes: "button-style-affirmative",
ontap: "finishEditing",
style: "margin-left: 8px;"
} ]
} ]
} ]
} ]
}, {
name: "campaignBuilder",
kind: "CampaignBuilder"
} ]
} ],
published: {
gpsTimeout: "10000",
location: ""
},
events: {
onClusterSelection: "",
onDeactivateTaskLocationEditingUI: "",
onLocationsIncoming: "",
onNewTapped: "",
onNewLocation: "",
onReceiveNewSubmissions: "",
onShowTapped: "",
onViewportChanged: "",
onCleanupSelected: ""
},
handlers: {
onSnapping: "toggleVisible",
onSnapped: "toggleVisible",
onDeactivateAllEditing: "deactivateEditingInterface",
onShowAddFeaturesToolbar: "showAddFeaturesToolbar",
onShowEditFeaturesToolbar: "showEditFeaturesToolbar",
onSelectCampaign: "showTaskLocationsOnMap",
onSelectTask: "showSubmissionsOnMap",
onClearTaskSelection: "clearSubmissionsFromMap",
onDrawerToggled: "adjustMapSize",
onTaskDrawerOpened: "panToTaskMarkerGroup",
onTaskDetailDrawerOpened: "panToSubmissionsGroup",
onAPIResponse: "updateLastSubmissionPollTime",
onContentSet: "stopTaskDetailSpinner",
onResizeMap: "adjustMapSize",
onCheckLocation: "highlightMarkerPolygon",
onSuccessCode: "hideLogin",
onFailureCode: "",
onAnonymousCode: "hideLogin",
onHilightSubmission: "selectedSubmission"
},
create: function(e, t) {
this.inherited(arguments), this.resized(), this.$.gps.setTimeout(this.gpsTimeout), this.lastSubmissionPoll = 0, userMoved = !1, loaded = !1, this.panZoomed = !1, this.firstTime = !0, this.notShowing = !0, this.locSuc = !1, this.loaded = !1, this.locations = [], this.addPins = !1, this.addPolygon = !1, this.addShapeFile = !1, this.events.onPins = "", this.currentTaskName = "", this.taskMarkerGroups = {}, this.taskMarkers = {}, this.submissionMarkerGroups = {}, this.currentTaskMarkerGroup = null, this.currentSubmissionsGroup = null, this.currentSubmissionsGroupTaskId = null, this.selectedCluster = null, this.stopSpinnerOnTaskDetailContSet = !1;
},
selectedSubmission: function(e, t) {
var n = this.currentSubmissionsGroup._layers, r = t.sub.id;
this.log(r);
var i = Object.keys(n);
for (var s in i) {
var o = n[i[s]];
r === o.submissionId && (this.log(o), this.log(this.clusterGroup.hasLayer(o.__parent)), this.selectCluster(o.__parent.__parent.__parent.__parent));
}
},
doubleCheckSend: function(e, t) {
this.$.doubleCheckSendPopup.show();
},
hideDoubleCheckSend: function(e, t) {
this.$.doubleCheckSendPopup.hide();
},
hideDoubleCheckCancel: function(e, t) {
this.$.doubleCheckCancelPopup.hide();
},
doubleCheckCancel: function(e, t) {
this.$.doubleCheckCancelPopup.show();
},
hideLogin: function(e, t) {
LocalStorage.get("username") !== undefined && this.$.username.setContent(LocalStorage.get("username").toString()), this.$.toolbar.resized(), this.$.loginRegister.hide();
},
resizeContainer: function(e, t) {},
showEditFeaturesToolbar: function(e, t) {
this.$.modifyToolbar.setOpen(!0);
},
showAddFeaturesToolbar: function(e, t) {
this.$.addLocationsAndRegionsToolbar.setOpen(!0);
},
createdDrawing: function(e) {
this.drawnItems.addLayer(e.layer), e.layerType === "marker" && (this.drawMarker = new L.Draw.Marker(this.map, this.drawControl.options.marker), this.drawMarker.enable(), this.drawMarker._tooltip.updatePosition(e.layer._latlng)), e.layerType === "polygon" && (this.drawPolygon = new L.Draw.Polygon(this.map, this.drawControl.options.polygon), this.drawPolygon.enable(), this.drawPolygon._tooltip.updatePosition(e.layer._latlngs[0])), this.log(this.map.hasLayer(e.layer)), this.waterfallDown("onNewLocation", e);
},
showTooltip: function() {
L.DomUtil.removeClass(this.tooltip, "hidden"), this.map.off("mousemove", this.showTooltip, this);
},
fixTooltip: function(e) {
L.DomUtil.addClass(e, "hidden"), this.tooltip = e, this.map.on("mousemove", this.showTooltip, this);
},
enableMarkerPlacementMode: function(e, t) {
this.deactivateEditing(), this.$.addLocationButton.setActive(!0), this.drawMarker.enable(), this.fixTooltip(this.drawMarker._tooltip._container);
},
enablePolygonPlacementMode: function(e, t) {
this.deactivateEditing(), this.$.addRegionButton.setActive(!0), this.drawPolygon.enable(), this.fixTooltip(this.drawPolygon._tooltip._container);
},
enableModifyMode: function(e, t) {
this.deactivateEditing(), this.$.modifyFeaturesButton.setActive(!0), this.editor.enable(), this.fixTooltip(this.editor._tooltip._container), this.drawnItems.eachLayer(function(e) {
e instanceof L.Polygon && (e.prevState = L.LatLngUtil.cloneLatLngs(e.getLatLngs()));
}, this);
},
enableRemoveMode: function(e, t) {
this.deactivateEditing(), this.$.removeFeaturesButton.setActive(!0), this.remover.enable(), this.fixTooltip(this.remover._tooltip._container);
},
highlightMarkerPolygon: function(e, t) {
var n = t.data;
if (this.map.hasLayer(n.layer)) {
var r = n.layer;
n.layerType === "marker" && (t.selected ? r.setIcon(new L.DivIcon({
iconSize: new L.Point(27, 91),
html: '<i class="icon-map-marker icon-4x"></i>',
className: "map-pin-test"
})) : r.setIcon(new L.DivIcon({
iconSize: new L.Point(27, 91),
html: '<i class="icon-map-marker icon-4x"></i>',
className: "map-pin"
}))), n.layerType === "polygon" && (t.selected ? r.setStyle({
color: "#DB221D"
}) : r.setStyle({
color: "#2E426F"
}));
}
return !0;
},
undo: function() {
var e = this.undoStack.pop();
e !== undefined && (e.type == "remove" ? this.drawnItems.addLayer(e.layer) : e.type == "move" ? e.layer.setLatLng(e.originalLatLng) : e.type == "movePolygon" && (this.deactivateEditing(), e.layer.setLatLngs(e.verticies), this.enableModifyMode()));
},
deactivateEditing: function(e, t) {
this.drawPolygon.disable(), this.drawMarker.disable(), this.editor.save(), this.editor.disable(), this.remover.save(), this.remover.disable(), this.$.modifyRadioGroup.setActive(null), this.$.addLandRRadioGroup.setActive(null);
},
closeDrawers: function() {
this.$.addLocationsAndRegionsToolbar.setOpen(!1), this.$.modifyToolbar.setOpen(!1);
},
deactivateEditingInterface: function(e, t) {
this.deactivateEditing(), this.closeDrawers(), this.$.modificationRadioGroup !== undefined && this.$.modificationRadioGroup.setActive(null), this.waterfallDown("onDeactivateTaskLocationEditingUI", {
locations: this.drawnItems
});
},
locError: function(e, t) {},
locSuccess: function(e, t) {
return this.Map.setView([ t.coords[latitude], t.coords[longitude] ], 11, !0), !0;
},
pushMarkerState: function(e) {
this.log("The marker started being dragged"), this.undoStack.push({
type: "move",
layer: e.target,
originalLatLng: e.target.getLatLng()
});
},
clusterIconCreateFunc: function(e) {
var t = e.getChildCount(), n, r;
if (t == 1) n = 1, r = 1; else {
var i = this._get_clusters();
i.sort(function(e, t) {
return e.getChildCount() - t.getChildCount();
}), r = i[i.length - 1].getChildCount(), n = i[0].getChildCount();
}
var s = this.getClusterIconColor(t, n, r, {
r: 237,
g: 236,
b: 124
}, {
r: 46,
g: 42,
b: 111
}), o = new CSenseClusterDivIcon({
color: s,
html: "<div><span>" + t + "</span></div>",
className: "marker-cluster",
iconSize: new L.Point(40, 40)
});
return o;
},
selectCluster: function(e) {
this.clearClusterSelect(), this.selectedCluster = e, L.DomUtil.addClass(e._icon, "cluster-selected");
var t = [];
e.getAllChildMarkers ? t = e.getAllChildMarkers().map(function(e) {
return e.submission;
}) : t = [ e.submission ], this.waterfallDown("onClusterSelection", {
submissions: t
});
},
clearClusterSelect: function(e) {
this.selectedCluster && (this.selectedCluster._icon && L.DomUtil.removeClass(this.selectedCluster._icon, "cluster-selected"), this.selectedCluster = null, e === !0 && this.waterfallDown("onViewportChanged", {
submissions: this.getVisibleSubmissions()
}));
},
animationEndHandler: function(e) {
this.clusterGroup.off("animationend", this.myAnimationEndFunction, this), enyo.job("viewChangedByZoom", enyo.bind(this, function() {
this.stopSpinnerOnTaskDetailContSet = !0, this.waterfallDown("onViewportChanged", {
submissions: this.getVisibleSubmissions()
});
}), 200);
},
stopTaskDetailSpinner: function(e, t) {
this.stopSpinnerOnTaskDetailContSet && (this.$.cSenseShowCampaigns.$.taskDetailDrawerContent.stopSpinner(), this.stopSpinnerOnTaskDetailContSet = !1);
},
rendered: function() {
this.inherited(arguments), this.$.gps.getPosition(), this.map = L.map(this.$.mapCont.id, {
closePopupOnClick: !1,
minZoom: 1,
maxZoom: 16
}).setView([ 44.981313, -93.266569 ], 12), L.tileLayer("http://tile.stamen.com/toner-lite/{z}/{x}/{y}.jpg", {
attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA."
}).addTo(this.map);
var e = this;
this.clusterGroup = new L.MarkerClusterGroup({
maxClusterRadius: 35,
singleMarkerMode: !0,
showCoverageOnHover: !0,
spiderfyOnMaxZoom: !1,
iconCreateFunction: this.clusterIconCreateFunc.bind(this)
}), this.map.addLayer(this.clusterGroup), this.clusterGroup.on("clustermouseover", function(e) {
e.layer._bringToFront();
}), this.clusterGroup.on("clustermouseout", function(e) {
e.layer._resetZIndex();
}), this.clusterGroup.on("clusterclick", function(e) {
e.layer.zoomToBounds(), this.map.getMaxZoom() === e.layer._zoom && this.selectCluster(e.layer);
}, this), this.map.on("dragend resize", function() {
this.clearClusterSelect(), this.$.cSenseShowCampaigns.$.taskDetailDrawerContent.startSpinner(), this.waterfallDown("onViewportChanged", {
submissions: this.getVisibleSubmissions()
}), enyo.job("viewChangedByDragOrResize", enyo.bind(this, function() {
this.$.cSenseShowCampaigns.$.taskDetailDrawerContent.stopSpinner();
}), 500);
}, this), this.map.on("zoomend", function() {
this.clearClusterSelect(), this.$.cSenseShowCampaigns.$.taskDetailDrawerContent.startSpinner(), this.clusterGroup.on("animationend", this.animationEndHandler, this);
}, this), this.map.on("click", function(e) {
this.clearClusterSelect(!0);
}, this), this.clusterGroup.on("click", function(e) {
this.clearClusterSelect(!1), this.selectCluster(e.layer), e.layer.onClick && e.layer.onClick();
}, this), this.undoStack = [], this.drawnItems = new L.FeatureGroup, this.map.addLayer(this.drawnItems), this.drawControl = new L.Control.Draw({
draw: {
polyline: !1,
rectangle: !1,
circle: !1,
polygon: !1,
marker: !1
},
marker: {
icon: new L.DivIcon({
iconSize: new L.Point(27, 91),
html: '<i class="icon-map-marker icon-4x"></i>',
className: "map-pin"
})
},
polygon: {
shapeOptions: {
color: "#2E426F"
}
}
}), this.map.addControl(this.drawControl), L.drawLocal.edit.tooltip.subtext = null, this.drawPolygon = new L.Draw.Polygon(this.map, this.drawControl.options.polygon), this.drawMarker = new L.Draw.Marker(this.map, this.drawControl.options.marker), this.editor = new L.EditToolbar.Edit(this.map, {
featureGroup: this.drawnItems
}), this.remover = new L.EditToolbar.Delete(this.map, {
featureGroup: this.drawnItems
}), this.map.on("draw:created", enyo.bind(this, "createdDrawing")), this.drawnItems.on("layerremove", function(e) {
this.undoStack.push({
type: "remove",
layer: e.layer
}), this.waterfallDown("onRemoveLocation", {
layer: e.layer
});
}, this), this.drawnItems.on("layeradd", function(e) {
e.layer instanceof L.Marker ? e.layer.hasDragStartHandler !== !0 && (e.layer.off("dragstart", this.pushMarkerState, this), e.layer.on("dragstart", this.pushMarkerState, this), e.layer.hasDragStartHandler = !0) : e.layer instanceof L.Polygon && e.layer.on("edit", function(e) {
this.undoStack.push({
type: "movePolygon",
layer: e.target,
verticies: e.target.prevState
}), e.target.prevState = L.LatLngUtil.cloneLatLngs(e.target.getLatLngs());
}, this);
}, this), L.DomEvent.addListener(this.$.addLocationButton.hasNode(), "click", this.enableMarkerPlacementMode, this), L.DomEvent.addListener(this.$.addRegionButton.hasNode(), "click", this.enablePolygonPlacementMode, this), L.DomEvent.addListener(this.$.modifyFeaturesButton.hasNode(), "click", this.enableModifyMode, this), L.DomEvent.addListener(this.$.removeFeaturesButton.hasNode(), "click", this.enableRemoveMode, this), L.DomEvent.addListener(this.$.undoButton.hasNode(), "click", this.undo, this), L.DomEvent.addListener(this.$.finishAddingButton.hasNode(), "click", this.deactivateEditingInterface, this), L.DomEvent.addListener(this.$.finishEditingButton.hasNode(), "click", this.deactivateEditingInterface, this), L.DomEvent.disableClickPropagation(this.$.addLocationButton.hasNode()), L.DomEvent.disableClickPropagation(this.$.addRegionButton.hasNode()), L.DomEvent.disableClickPropagation(this.$.modifyFeaturesButton.hasNode()), L.DomEvent.disableClickPropagation(this.$.removeFeaturesButton.hasNode()), L.DomEvent.disableClickPropagation(this.$.undoButton.hasNode()), L.DomEvent.disableClickPropagation(this.$.finishAddingButton.hasNode()), L.DomEvent.disableClickPropagation(this.$.finishEditingButton.hasNode()), LocalStorage.get("user") === undefined ? this.$.loginRegister.show() : (this.$.username.setContent(LocalStorage.get("username")), this.$.toolbar.resized());
},
savePoint: function(e) {},
savePolygon: function(e) {},
showCampaigns: function(e, t) {
var n = this.$.showButton.hasClass("active");
this.$.showButton.addRemoveClass("active", !n), n && this.removeTaskLocations(), this.waterfallDown("onShowTapped"), this.deactivateEditingInterface(), this.map.invalidateSize();
},
showNewMap: function(e, t) {
this.waterfallDown("onNewTapped"), this.$.newButton.setShowing(!1), this.$.saveButton.setShowing(!0), this.$.cancelButton.setShowing(!0), this.$.toolbar.resized(), this.$.toolbar.render();
},
resetTasksAndQuestions: function(e, t) {
this.$.doubleCheckCancelPopup.hide(), this.waterfallDown("onNewTapped"), this.$.campaignBuilder.removeAllTasks(), this.$.campaignBuilder.render(), this.$.saveButton.setShowing(!1), this.$.cancelButton.setShowing(!1), this.$.newButton.setShowing(!0), this.$.toolbar.resized(), this.$.toolbar.render();
},
saveTasksAndQuestions: function(e, t) {
this.$.doubleCheckSendPopup.hide(), this.log(JSON.stringify(this.$.campaignBuilder.getData()));
var n = {
campaign: this.$.campaignBuilder.getData()
}, r = new enyo.Ajax({
url: Data.getURL() + "campaign.json",
method: "POST",
contentType: "application/json",
handleAs: "json",
cacheBust: !1,
postBody: n
});
r.response(this, "handleResponse"), r.go();
},
handleResponse: function(e, t) {
e.failed ? this.$.sendingPopup.setValue("") : (this.$.sendingPopup.hide(), this.resetTasksAndQuestions());
},
toggleVisible: function(e, t) {
var n = this.parent.parent.getIndex(), r = this.id.split("_"), i = r[r.length - 1], s = this.parent.parent.getPanels()[n].id.split("_"), o = s[s.length - 1];
return this.addRemoveClass("hideMap", i !== o), !0;
},
getLatLngFromDbString: function(e) {
if (e == "Minneapolis, MN") return new L.LatLng(44.976032, -93.266987);
var t = e.split(",");
return new L.LatLng(parseFloat(t[1]), parseFloat(t[0]));
},
removeTaskLocations: function() {
this.currentTaskMarkerGroup !== null && (this.currentTaskMarkerGroup.eachLayer(function(e) {
e.closePopup();
}), this.map.removeLayer(this.currentTaskMarkerGroup), this.currentTaskMarkerGroup = null), this.doCleanupSelected();
},
setupSubmissionMarkers: function(e, t, n) {
var r = e.submissions, i = this.$.cSenseShowCampaigns, s = [];
for (var o = 0; o < r.length; o++) {
var u = this.submissionToMarker(r[o], i, a);
u !== null && s.push(u);
}
var a = new L.FeatureGroup(s);
return a;
},
submissionToMarker: function(e, t, n) {
var r = null, i = e.gps_location.split("|");
if (i.length === 2) {
var s = new L.LatLng(parseFloat(i[0]), parseFloat(i[1])), o = !1;
r = new SubmissionMarker(s, e.id, e, t, o), r.bindLabel("Submission " + e.id);
}
return r;
},
pingWithinRange: function(e, t, n) {
var r = !1;
return e.eachLayer(function(e) {
if (e.hasPing()) {
var i = this.map.latLngToLayerPoint(t).distanceTo(this.map.latLngToLayerPoint(e.getLatLng()));
i <= n && (r = !0);
}
}, this), r;
},
clearSubmissionsFromMap: function(e, t) {
this.currentSubmissionsGroup && this.map.removeLayer(this.currentSubmissionsGroup), this.currentSubmissionsGroup = null, this.currentSubmissionsGroupTaskId = null, this.clusterGroup.clearLayers();
},
showSubmissionsOnMap: function(e, t) {
var n = t.task, r = t.taskDetail, i = this.taskMarkers[n.id];
if (t.task.id !== this.currentSubmissionsGroupTaskId) {
this.submissionMarkerGroups[n.id] === undefined && (this.submissionMarkerGroups[n.id] = this.setupSubmissionMarkers(n, null, r));
var s = this.submissionMarkerGroups[n.id];
this.clusterGroup.addLayers(s.getLayers()), this.currentSubmissionsGroup = s, this.currentSubmissionsGroupTaskId = n.id;
var o = s.getBounds();
this.map.fitBounds(o);
}
return !0;
},
_get_clusters: function(e) {
var t = e ? e : this.map.getZoom(), n = Array();
return this.clusterGroup._topClusterLevel._recursively(this.clusterGroup.getBounds(), t, t, function(e) {
n.push(e);
}), n;
},
getVisibleSubmissions: function() {
var e = Array();
return this.clusterGroup._topClusterLevel._recursively(this.map.getBounds(), this.map.getZoom(), this.map.getZoom(), function(t) {
var n = t.getAllChildMarkers();
e = e.concat(n.map(function(e) {
return e.submission;
}));
}), this.clusterGroup._gridUnclustered[this.map.getZoom()].eachObject(function(t) {
this.map.getBounds().contains(t.getLatLng()) && e.push(t.submission);
}, this), e;
},
showTaskLocationsOnMap: function(e, t) {
var n = t.campaign;
this.removeTaskLocations();
if (this.taskMarkerGroups[n.id] === undefined) {
this.taskMarkerGroups[n.id] = new L.FeatureGroup;
var r = function() {
this.waterfall("onTaskMarkerClicked", {
task: f.task
});
}, i = function() {
this.waterfall("onTaskMarkerClicked", {
task: f.task
}), this.clearClusterSelect(), this.waterfallDown("onViewportChanged", {
submissions: this.getVisibleSubmissions()
});
};
for (var s in n.tasks) {
task = n.tasks[s];
var o = new Wkt.Wkt;
for (var u in task.locations) {
var a = task.locations[u].geometryString;
o.read(a);
var f = o.toObject();
f.task = task, a.indexOf("POINT") != -1 ? (f.setIcon(new L.DivIcon({
iconSize: new L.Point(27, 91),
html: '<i class="icon-map-marker icon-4x"></i>',
className: "map-pin"
})), f.setZIndexOffset(5), f.on("click", r, this)) : (f.on("click", i, this), f.setStyle({
color: "#2E426F"
})), task.submissions === undefined && (task.submissions = []), this.taskMarkerGroups[n.id].addLayer(f), this.taskMarkers[task.id] = f;
}
}
}
this.map.addLayer(this.taskMarkerGroups[n.id]), this.currentTaskMarkerGroup = this.taskMarkerGroups[n.id];
var l = this.currentTaskMarkerGroup.getBounds(), c = (l._northEast.lat + l._southWest.lat) / 2, h = (l._northEast.lng + l._southWest.lng) / 2;
return this.map.panTo([ c, h ], {
animate: !1
}), !0;
},
adjustMapSize: function(e, t) {
return this.$.container.resized(), this.map.invalidateSize({
animate: !1
}), !0;
},
panToSubmissionsGroup: function(e, t) {
var n = t.taskId, r = t.offset;
this.log(), this.map.panBy([ r, 0 ], {
animate: !1,
duration: 0
}), this.map.invalidateSize();
},
panToTaskMarkerGroup: function(e, t) {
var n = t.campId, r = t.offset;
return !0;
},
getNewSubmissions: function() {
var e = Data.getURL() + "submission.json?after=" + String(this.lastSubmissionPoll), t = new enyo.Ajax({
url: e,
method: "GET",
handleAs: "json",
cacheBust: !1
});
t.response(this, "updateSubmissions"), t.go(), enyo.job("submissionPoll", enyo.bind(this, "getNewSubmissions"), 1500);
},
updateLastSubmissionPollTime: function(e, t) {
this.$.spin.setShowing(!1), this.$.menuIcon.setShowing(!0), this.$.showButton.setDisabled(!1), this.$.toolbar.resized(), this.$.toolbar.render(), this.lastSubmissionPoll = t.time;
},
updateSubmissions: function(e, t) {
this.lastSubmissionPoll = e.startTime, t.submissions.length > 0 && (this.log("Got a new submission!"), this.waterfallDown("onReceiveNewSubmissions", {
submissions: t.submissions
}), this.createNewSubmissionMarkers(t.submissions));
},
createNewSubmissionMarkers: function(e) {
for (var t = 0; t < e.length; t++) {
var n = e[t];
if (n.task_id in this.submissionMarkerGroups) {
var r = this.submissionToMarker(n, this.$.cSenseShowCampaigns, null);
r !== null && (this.submissionMarkerGroups[n.task_id].addLayer(r), this.currentSubmissionsGroupTaskId == n.task_id && this.clusterGroup.addLayer(r));
}
}
this.waterfallDown("onViewportChanged", {
submissions: this.getVisibleSubmissions()
});
},
getClusterIconColor: function(e, t, n, r, i) {
if (e == 1) return {
r: r.r,
g: r.g,
b: r.b
};
if (t == n) return {
r: i.r,
g: i.g,
b: i.b
};
var s = (e - t) / (n - t), o = r.r + Math.round((i.r - r.r) * s), u = r.g + Math.round((i.g - r.g) * s), a = r.b + Math.round((i.b - r.b) * s);
return {
r: o,
g: u,
b: a
};
},
getClusterIconColor2: function(e, t, n) {
var r;
e == 1 ? r = 0 : t == n ? r = 1 : r = (e - t) / (n - t);
var i = this._heatGradient(1 - r);
return "rgba(" + i.r + "," + i.g + "," + i.b + ", 0.6)";
},
_convertToLight: function(e) {
return e < 0 ? 0 : e > 1 ? 255 : Math.round(e * 255);
},
_heatGradient: function(e) {
var t = this._convertToLight(3 * e), n = this._convertToLight(3 * e - 1), r = this._convertToLight(3 * e - 2);
return {
r: t,
g: n,
b: r
};
},
_greenYellowRedGradient: function(e) {
var t = this._convertToLight(2 * e), n = this._convertToLight(-2 * e + 2), r = this._convertToLight(0 * e);
return {
r: t,
g: n,
b: r
};
}
});

// StepBuilder.js

enyo.kind({
name: "StepBuilder",
events: {
onCreateQuestion: "",
onCreateSensor: "",
onShowQuestion: ""
},
components: [ {
name: "stepButton",
kind: enyo.Button,
style: "width: 98%;",
content: "New Step",
ontap: "showOptions",
classes: "hanging-child button-style"
} ],
create: function(e, t) {
this.inherited(arguments);
},
showOptions: function(e, t) {
enyo.Signals.send("onNewStep");
}
});

// TaskBuilder.js

enyo.kind({
name: "TaskBuilder",
kind: "Destroyable",
layoutKind: enyo.FittableRowsLayout,
classes: "task-builder",
handlers: {
onCreateQuestion: "addQuestion",
onCreateSensor: "addSensor",
onDeactivateTaskLocationEditingUI: "deactivateLocationEditingUI",
onNewTask: "saveData",
onNewQuestion: "resizeQuestions",
onLocationsIncoming: "saveLocations",
onTitleCollapsing: "toggleTaskDrawer",
onQuestionsIncoming: "saveQuestions",
onDestroyed: "checkTitles",
onRemoveLocation: "removeLocation"
},
published: {
index: 1
},
events: {
onAddShapefile: "",
onDeactivateAllEditing: "",
onCheckLocation: "",
onGetLocations: "",
onFinishedSavingTask: "",
onShowAddFeaturesToolbar: "",
onShowEditFeaturesToolbar: "",
onDestroyedTask: ""
},
components: [ {
kind: enyo.Signals,
onQuestionsIncoming: "saveQuestions",
onQuestionsRemoved: "closeDrawer"
}, {
name: "taskBuilderDrawer",
kind: enyo.FittableColumns,
fit: !0,
components: [ {
kind: enyo.FittableRows,
classes: "nice-padding",
style: "width: 117px; border-right: 1px #2E426F solid;",
components: [ {
name: "locationTitle",
kind: "Title",
title: "3a. Add Places"
}, {
name: "modificationRadioGroup",
kind: onyx.RadioGroup,
onActivate: "radioActivated",
classes: "niceish-padding",
style: "width: 100%;",
components: [ {
name: "addFeaturesButton",
kind: onyx.Button,
attributes: {
title: "Add new locations or regions to this task."
},
classes: "button-style",
components: [ {
tag: "i",
classes: "icon-plus"
} ]
}, {
name: "editFeaturesButton",
kind: onyx.Button,
attributes: {
title: "Edit the locations or regions in this task."
},
classes: "button-style",
components: [ {
tag: "i",
classes: "icon-pencil"
} ]
} ]
}, {
name: "locationList",
kind: enyo.Scroller,
layoutKind: enyo.FittableColumnsLayout,
fit: !0,
horizontal: "hidden",
vertical: "scroll",
components: [ {
name: "realLocationList",
kind: enyo.FittableRows,
style: "width: 100%;",
fit: !0
} ]
} ]
}, {
name: "questionSection",
kind: enyo.FittableRows,
fit: !0,
showing: !1,
components: [ {
name: "taskInstructions",
kind: "TitledInput",
placeholder: "General instructions about the task",
instructions: "Enter general instructions about the task below",
title: "3b. Build the task"
}, {
kind: "QuestionDrawer",
classes: "nice-padding",
fit: !0
} ]
} ]
} ],
buildTaskObj: function() {
this.taskData.instructions = this.$.instructions.getValue();
},
checkTitles: function(e, t) {
this.log(t);
if (t.us.kind === "TaskBuilder") {
this.log(t), this.log(t.us), this.log(t.us.$);
var n = t.us.$.taskTitle.getTitle(), r = /\d+/, i = Number(n.match(r)[0]), s = this.$.taskTitle.getTitle(), o = Number(s.match(r)[0]);
this.log(i), this.log(o);
if (i < o) {
var u = /\(\d+ \w+\)/, a = this.$.taskTitle.getTitle().match(u);
this.log(a), a !== null ? this.$.taskTitle.setTitle("#" + (o - 1) + " " + a[0]) : this.$.taskTitle.setTitle("#" + (o - 1));
}
}
return !0;
},
finishEditing: function(e, t) {
this.doDeactivateAllEditing(), this.deactivateLocationEditingUI();
},
deactivateLocationEditingUI: function(e, t) {
this.$.modificationRadioGroup.setActive(null);
},
clickToAddShapeFile: function(e, t) {
e.hasClass("active") ? e.addRemoveClass("active", !1) : e.addRemoveClass("active", !0), this.doAddShapefile({
id: name,
start: !0
}), this.doAddShapefile({
id: this.name,
start: !0
});
},
create: function(e, t) {
this.inherited(arguments), this.taskData = {};
var n = {};
n.points = [], n.polygons = [], LocalStorage.set(this.name, n), this.numSensors = 0, this.numQuestions = 0, this.toggleTaskDrawer();
},
closeDrawer: function(e, t) {
this.$.taskBuilderDrawer.getOpen() && (this.$.taskTitle.sendSave(), this.doFinishedSavingTask());
},
getData: function(e, t) {
return this.taskData.id = 0, this.taskData.instructions = this.$.taskInstructions.getData(), this.taskData.locations = this.getLocations(), this.taskData.questions = this.$.questionDrawer.getData(), this.taskData.camp_id = 0, this.taskData.incentive = 1, this.taskData.required = !0, this.taskData;
},
getLocations: function(e, t) {
var n = [], r = new Wkt.Wkt;
return enyo.forEach(this.$.realLocationList.getControls(), function(e, t) {
var i = {};
i.id = 0, i.task_id = 0;
if (e.data.layerType === "marker") {
var s = new L.Marker(e.data.layer._latlng);
r.fromObject(s), i.geometryString = r.write();
}
if (e.data.layerType === "polygon") {
this.log(e.data.layer);
var o = new L.Polygon(e.data.layer._latlngs);
r.fromObject(o), i.geometryString = r.write();
}
n.push(i);
}, this), n;
},
handleExpand: function(e, t) {
this.log(e.expanded), e.expanded || this.finishEditing();
},
newLocation: function(e) {
this.$.questionSection.showing || (this.$.questionSection.show(), this.resized(), this.$.questionSection.resized()), e.layerType === "marker" && (this.$.realLocationList.createComponent({
tag: "i",
kind: "Destroyable",
classes: "icon-map-marker icon-3x location-builder nice-padding",
style: "width: 100%; display: block; text-align: center;",
data: e,
ontap: "readLocationData"
}, {
owner: this
}), this.$.realLocationList.render()), e.layerType === "polygon" && (this.$.realLocationList.createComponent({
tag: "i",
kind: "Destroyable",
classes: "icon-globe icon-3x location-builder nice-padding",
style: "width: 100%; display: block; text-align: center;",
data: e,
ontap: "readLocationData"
}, {
owner: this
}), this.$.realLocationList.render());
},
radioActivated: function(e, t) {
if (t.originator.getActive()) {
this.doDeactivateAllEditing();
if (t.originator.name === "addFeaturesButton" || t.originator.parent.name === "addFeaturesButton") this.log("active add"), this.doShowAddFeaturesToolbar(); else if (t.originator.name === "editFeaturesButton" || t.originator.parent.name === "editFeaturesButton") this.log("active edit"), this.doShowEditFeaturesToolbar();
}
},
readLocationData: function(e, t) {
this.log(e.data), this.log(this.$.realLocationList.getControls()), enyo.forEach(this.$.realLocationList.getControls(), function(e, t) {
this.log(e), this.log(t);
var n = e.hasClass("hilight-location");
e.addRemoveClass("hilight-location", !1), this.doCheckLocation({
data: e.data,
selected: !1
});
}, this);
var n = e.hasClass("hilight-location");
e.addRemoveClass("hilight-location", !n), this.doCheckLocation({
data: e.data,
selected: !n
});
},
removeLocation: function(e, t) {
var n = t.layer;
return this.log(n), enyo.forEach(this.$.realLocationList.getControls(), function(e, t) {
if (e.data.layer._leaflet_id === n._leaflet_id) {
e.remove(e, null);
return;
}
}, this), this.$.realLocationList.resized(), !0;
},
resizeQuestions: function(e, t) {
this.resized(), this.render();
},
saveData: function(e, t) {},
saveLocations: function(e, t) {},
saveQuestions: function(e, t) {
return this.log(t.questions), this.$.taskBuilderDrawer.getOpen() && (this.questions = t.questions, this.log(this.$.taskTitle.getTitle()), this.log(this.questions), enyo.Signals.send("onQuestionsSaved"), this.$.taskTitle.setTitle(this.$.taskTitle.getTitle() + " (" + this.questions.length + " steps)"), this.$.saved.setShowing(!0)), !0;
},
toggleEditingDrawer: function(e, t) {
var n = this.$.finishEditingDrawer.getOpen();
this.log(n), this.$.finishEditingDrawer.setOpen(!n);
},
toggleTaskDrawer: function(e, t) {}
});

// Title.js

enyo.kind({
name: "Title",
kind: enyo.FittableRows,
published: {
title: "Title Goes Here",
big: !1,
save: !1,
instructions: ""
},
events: {
onTitleCollapsing: "",
onDestroy: ""
},
components: [ {
name: "cont",
kind: enyo.FittableColumns,
components: [ {
name: "savedIndicator",
tag: "i",
classes: "icon-ok-sign icon-large",
attributes: {
title: "Saved"
},
showing: !1
}, {
name: "titleText",
style: "font-size: 12pt;",
fit: !0
}, {
name: "cancelButton",
tag: "i",
classes: "icon-remove icon-large hilight-icons-negative",
attributes: {
title: "Delete"
},
ontap: "remove"
}, {
name: "editButton",
tag: "i",
classes: "icon-pencil hilight-icons-affirmative",
attributes: {
title: "Edit"
},
showing: !1,
ontap: "sendSave"
} ]
}, {
name: "instructions",
content: "",
showing: !1,
style: "font-size: 10pt; padding-top: 7px;"
} ],
create: function(e, t) {
this.inherited(arguments), this.$.titleText.setContent(this.title), this.$.cont.addRemoveClass("text-title-small", !this.big), this.$.cont.addRemoveClass("text-title-big", this.big), this.$.cancelButton.setShowing(this.save), this.instructions.length > 0 && (this.$.instructions.setContent(this.instructions), this.$.instructions.setShowing(!0));
},
bigChanged: function(e, t) {
this.$.cont.addRemoveClass("text-title-small", !this.big), this.$.cont.addRemoveClass("text-title-big", this.big);
},
titleChanged: function(e, t) {
this.$.titleText.setContent(this.title);
},
remove: function(e, t) {
this.doDestroy();
},
saveChanged: function(e, t) {
this.$.cancelButton.setShowing(this.save);
},
instructionsChanged: function(e, t) {
this.instructions.length > 0 ? (this.$.instructions.setContent(this.instructions), this.$.instructions.setShowing(!0)) : this.$.instructions.setShowing(!1);
},
sendSave: function(e, t) {
return this.doTitleCollapsing(), this.save && (this.$.savedIndicator.setShowing(!this.$.savedIndicator.showing), this.$.cancelButton.setShowing(!this.$.cancelButton.showing)), this.$.editButton.setShowing(!this.$.editButton.showing), this.$.cont.render(), !0;
}
});

// TitledDrawer.js

enyo.kind({
name: "TitledDrawer",
kind: enyo.FittableRows,
components: [ {
tag: "p",
components: [ {
name: "icon",
tag: "i",
classes: "icon-expand",
styles: "height: 100px; width: 100px;"
}, {
content: "tmp",
ontap: "toggleDrawer"
} ]
}, {
name: "drawer",
kind: onyx.Drawer,
open: !1,
orient: "v",
components: [ {
content: "test"
} ]
} ],
create: function(e, t) {
this.inherited(arguments);
},
toggleDrawer: function(e, t) {
var n = this.$.drawer.getOpen();
this.$.icon.addRemoveClass("icon-expand", !n), this.$.icon.addRemoveClass("icon-collapse", n), this.$.drawer.setOpen(!n);
}
});

// TitledInput.js

enyo.kind({
name: "TitledInput",
kind: enyo.FittableRows,
published: {
big: !1,
title: "Title Goes Here",
text: "",
placeholder: "This is a placeholder",
instructions: "",
save: !1
},
components: [ {
name: "title",
kind: "Title",
classes: "nice-padding"
}, {
name: "input",
kind: enyo.Input,
oninput: "reset",
classes: "hanging-child",
style: "font-size: 11pt;"
} ],
create: function(e, t) {
this.inherited(arguments), this.$.title.setTitle(this.title), this.$.title.setBig(this.big), this.$.input.setPlaceholder(this.placeholder), this.instructions.length > 0 && this.$.title.setInstructions(this.instructions);
},
bigChanged: function(e, t) {
this.$.title.setBig(this.big);
},
getData: function(e, t) {
return this.$.input.getValue();
},
instructionsChanged: function(e, t) {
this.instructions.length > 0 && this.$.title.setInstructions(this.instructions);
},
placeholderChanged: function(e, t) {
this.$.input.setPlaceholder(this.placeholder);
},
reset: function(e, t) {
this.text = this.$.input.getValue();
},
saveChanged: function(e, t) {
this.$.title.setSave(this.save);
},
titleChanged: function(e, t) {
this.$.title.setTitle(this.title);
},
textChanged: function(e, t) {
this.$.input.setValue(this.text);
}
});

// TitledTextArea.js

enyo.kind({
name: "TitledTextArea",
kind: enyo.FittableRows,
published: {
big: !1,
title: "Title Goes Here",
placeholder: "This is a placeholder"
},
components: [ {
name: "title",
kind: "Title",
classes: "nice-padding"
}, {
name: "input",
kind: onyx.TextArea,
classes: "hanging-child",
style: "font-size: 11pt;"
} ],
create: function(e, t) {
this.inherited(arguments), this.$.title.setTitle(this.title), this.$.title.setBig(this.big), this.$.input.setPlaceholder(this.placeholder);
},
bigChanged: function(e, t) {
this.$.title.setBig(this.big);
},
getData: function(e, t) {
return this.$.input.getValue();
},
placeholderChanged: function(e, t) {
this.$.input.setPlaceholder(this.placeholder);
},
titleChanged: function(e, t) {
this.$.title.setTitle(this.title);
}
});
