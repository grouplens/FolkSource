
// minifier: path aliases

enyo.path.addPaths({layout: "/Users/jts/programming/csense_trunk/bootplate_22/enyo/../lib/layout/", onyx: "/Users/jts/programming/csense_trunk/bootplate_22/enyo/../lib/onyx/", onyx: "/Users/jts/programming/csense_trunk/bootplate_22/enyo/../lib/onyx/source/", leaflet: "source/leaflet/", menupane: "source/menupane/"});

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
components: [ {
kind: "enyo.Signals",
ondeviceready: "deviceReady"
}, {
kind: "CSenseMenuPane",
fit: !0
} ],
create: function(e, t) {
this.inherited(arguments), this.log(LocalStorage.get("user")), this.log(LocalStorage.get("points")), LocalStorage.remove("loc");
},
deviceReady: function(e, t) {
Data.setIsReady(!0), this.log(Data.getIsReady());
}
});

// BikeCounter.js

enyo.kind({
name: "BikeCounter",
kind: enyo.FittableRows,
fit: !0,
published: {
type: "bikes"
},
events: {
onTimer: "",
onStartTimer: "",
onDrawerOk: ""
},
handlers: {
on2DrawerClick: "build",
onDataRemove: "removeItem",
onRecordCountEvent: "storeCountData",
onTimerStarted: "toggleTableEnabled"
},
components: [ {
kind: "enyo.Signals",
onButtonGroupChosen: "fixIt",
onDataRemove: "removeItem"
}, {
name: "timer",
kind: "Timer",
length: 72e5,
resetInterval: 9e5
}, {
name: "totalCountContainer",
kind: enyo.FittableColumns,
components: [ {
fit: !0
}, {
content: "Total Count: "
}, {
name: "totalCount",
content: 0
} ]
}, {
name: "tabula",
tag: "table",
fit: !0,
style: "width: 100%;",
disabled: !0,
components: [ {
name: "row0",
tag: "tr",
classes: "tableCellHeight",
style: "max-height: 20%;",
components: [ {
tag: "td"
}, {
tag: "td"
}, {
tag: "td",
attributes: {
colspan: 2
},
style: "text-align: center;",
components: [ {
kind: "onyx.Icon",
src: "assets/bike_small.png"
} ]
}, {
tag: "td"
}, {
tag: "td",
attributes: {
colspan: 2
},
style: "text-align: center;",
components: [ {
kind: "onyx.Icon",
src: "assets/ped_small.png"
} ]
} ]
}, {
name: "row1",
tag: "tr",
classes: "tableCellHeight",
style: "max-height: 20%;",
components: [ {
tag: "td"
}, {
tag: "td"
}, {
tag: "td",
classes: "tableMen",
components: [ {
kind: "onyx.Icon",
src: "assets/man_small.png"
} ]
}, {
tag: "td",
classes: "tableWomen",
components: [ {
kind: "onyx.Icon",
src: "assets/woman_small.png"
} ]
}, {
tag: "td"
}, {
tag: "td",
classes: "tableMen",
components: [ {
kind: "onyx.Icon",
src: "assets/man_small.png"
} ]
}, {
tag: "td",
classes: "tableWomen",
components: [ {
kind: "onyx.Icon",
src: "assets/woman_small.png"
} ]
} ]
}, {
name: "row2",
tag: "tr",
style: "max-height: 20%;",
components: [ {
name: "adultTitle",
attributes: {
rowspan: 2
},
tag: "td",
classes: "tableCellWidth",
components: [ {
kind: "onyx.Icon",
src: "assets/adult_small.png"
} ]
}, {
tag: "td",
classes: "tableCellWidth",
components: [ {
kind: onyx.Icon,
src: "assets/helmet_small.png"
} ]
}, {
tag: "td",
classes: "tableCellMen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "maleAdultHelmet",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 2,
col: 2
} ]
}, {
tag: "td",
classes: "tableCellWomen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "femaleAdultHelmet",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 2,
col: 3
} ]
}, {
tag: "td",
classes: "tableCellWidth",
components: [ {
kind: onyx.Icon,
src: "assets/assistive_small.png"
} ]
}, {
tag: "td",
classes: "tableCellMen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "maleAdultAsst",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 2,
col: 5
} ]
}, {
tag: "td",
classes: "tableCellWomen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "femaleAdultAsst",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 2,
col: 6
} ]
} ]
}, {
name: "row3",
tag: "tr",
style: "max-height: 20%;",
components: [ {
tag: "td",
classes: "tableCellWidth",
components: [ {
kind: onyx.Icon,
src: "assets/not_small.png"
} ]
}, {
tag: "td",
classes: "tableCellMen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "maleAdultBike",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 3,
col: 2
} ]
}, {
tag: "td",
classes: "tableCellWomen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "femaleAdultBike",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 3,
col: 3
} ]
}, {
tag: "td",
classes: "tableCellWidth",
components: [ {
kind: onyx.Icon,
src: "assets/not_small.png"
} ]
}, {
tag: "td",
classes: "tableCellMen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "maleAdultPed",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 3,
col: 5
} ]
}, {
tag: "td",
classes: "tableCellWomen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "femaleAdultPed",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 3,
col: 6
} ]
} ]
}, {
name: "row4",
tag: "tr",
style: "max-height: 20%;",
components: [ {
name: "kidTitle",
tag: "td",
attributes: {
rowspan: 2
},
classes: "tableCellWidth",
components: [ {
kind: "onyx.Icon",
src: "assets/child_small.png"
} ]
}, {
tag: "td",
classes: "tableCellWidth",
components: [ {
kind: onyx.Icon,
src: "assets/helmet_small.png"
} ]
}, {
tag: "td",
classes: "tableCellMen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "maleChildHelmet",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 4,
col: 2
} ]
}, {
tag: "td",
classes: "tableCellWomen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "femaleChildHelmet",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 4,
col: 3
} ]
}, {
tag: "td",
classes: "tableCellWidth",
components: [ {
kind: onyx.Icon,
src: "assets/assistive_small.png"
} ]
}, {
tag: "td",
classes: "tableCellMen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "maleChildAsst",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 4,
col: 5
} ]
}, {
tag: "td",
classes: "tableCellWomen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "femaleChildAsst",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 4,
col: 6
} ]
} ]
}, {
name: "row5",
tag: "tr",
style: "max-height: 20%;",
components: [ {
tag: "td",
classes: "tableCellWidth",
components: [ {
kind: onyx.Icon,
src: "assets/not_small.png"
} ]
}, {
tag: "td",
classes: "tableCellMen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "maleChildBike",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 5,
col: 2
} ]
}, {
tag: "td",
classes: "tableCellWomen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "femaleChildBike",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 5,
col: 3
} ]
}, {
tag: "td",
classes: "tableCellWidth",
components: [ {
kind: onyx.Icon,
src: "assets/not_small.png"
} ]
}, {
tag: "td",
classes: "tableCellMen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "maleChildPed",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 5,
col: 5
} ]
}, {
tag: "td",
classes: "tableCellWomen",
layoutKind: enyo.FittableColumnsLayout,
components: [ {
name: "femaleChildPed",
kind: "TallyCounter",
onup: "highlightRowsColumns",
ondown: "highlightRowsColumns",
row: 5,
col: 6
} ]
} ]
} ]
}, {
name: "popup",
kind: "onyx.Popup",
scrim: !0,
scrimWhenModal: !1,
centered: !0,
modal: !0,
autoDismiss: !0,
floating: !0,
style: "width: 80%; height: 80%;",
components: [ {
kind: "onyx.Button",
content: "Close",
ontap: "popdown",
style: "width: 100%; clear: both;"
}, {
name: "ticker",
fit: !0,
style: "clear: both;",
kind: "TickerList"
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.gender = !1, this.age = !1, this.bike = !0, this.ped = !0, this.assisted = !1, this.helmet = !1, LocalStorage.set("dataArray", []), LocalStorage.remove("countData"), this.enabled = !0, this.toggleTableEnabled(), this.build();
},
reset: function() {
var e = this.$.tabula.children;
for (var t in e) {
e[t].addRemoveClass("tableHideCollapse", !1);
var n = e[t].children;
for (var r in n) n[r].addRemoveClass("tableHideCollapse", !1), n[r].addRemoveClass("tableHideKeep", !1);
}
},
popup: function(e, t) {
this.$.popup.resized(), this.$.popup.render(), this.$.popup.show();
},
popdown: function(e, t) {
this.$.popup.hide();
},
build: function(e, t) {
var n = this.$.tabula.children;
this.reset();
var r = 0;
for (var i in n) {
var s = n[i].children;
for (var o in s) {
this.ped || (o > 3 ? s[o].addRemoveClass("tableHideCollapse", !this.ped) : o == 3 && (i == 0 || i == 3 || i == 5) && s[o].addRemoveClass("tableHideCollapse", !this.ped));
if (!this.gender) {
var u = n[0].children;
u[2].setAttribute("colspan", 1), u[4].setAttribute("colspan", 1);
} else {
var u = n[0].children;
u[2].setAttribute("colspan", 2), u[4].setAttribute("colspan", 2);
}
if (this.age && !this.helmet && !this.assisted) {
var a = n[2].children, f = n[4].children;
a[0].setAttribute("rowspan", 1), f[0].setAttribute("rowspan", 1);
} else {
var a = n[2].children, f = n[4].children;
a[0].setAttribute("rowspan", 2), f[0].setAttribute("rowspan", 2);
}
switch (i) {
case "0":
this.age || o == 0 && s[o].addRemoveClass("tableHideCollapse", !this.age), this.helmet || o == 1 && s[o].addRemoveClass("tableHideCollapse", !this.helmet), this.assisted || o == 3 && s[o].addRemoveClass("tableHideCollapse", !this.assisted), this.bike || o < 3 && o > 0 && s[o].addRemoveClass("tableHideCollapse", !this.bike);
break;
case "1":
this.gender || (n[i].addRemoveClass("tableHideCollapse", !this.gender), s[o].addRemoveClass("tableHideCollapse", !this.gender)), this.age || o == 0 && s[o].addRemoveClass("tableHideCollapse", !this.age), this.helmet || o == 1 && s[o].addRemoveClass("tableHideCollapse", !this.helmet), this.assisted || o == 4 && s[o].addRemoveClass("tableHideCollapse", !this.assisted), this.bike || o < 4 && o > 0 && s[o].addRemoveClass("tableHideCollapse", !this.bike);
break;
case "2":
this.gender || o % 3 == 0 && o > 0 && s[o].addRemoveClass("tableHideCollapse", !this.gender), this.age || o == 0 && s[o].addRemoveClass("tableHideCollapse", !this.age), this.helmet || o == 1 && s[o].addRemoveClass("tableHideCollapse", !this.helmet), this.assisted || o == 4 && s[o].addRemoveClass("tableHideCollapse", !this.assisted), this.bike || o > 0 && o < 4 && s[o].addRemoveClass("tableHideCollapse", !this.bike);
break;
case "3":
!this.helmet && !this.assisted && n[i].addRemoveClass("tableHideCollapse", !this.helmet && !this.assisted), this.gender || o % 2 == 0 && o > 0 && s[o].addRemoveClass("tableHideCollapse", !this.gender), this.helmet || (o < 3 && s[o].addRemoveClass("tableHideKeep", !this.helmet), o == 0 && s[o].addRemoveClass("tableHideCollapse", !this.helmet)), this.assisted || (o > 3 || o < 1) && s[o].addRemoveClass("tableHideCollapse", !this.assisted), this.bike || o < 3 && s[o].addRemoveClass("tableHideCollapse", !this.bike);
break;
case "4":
this.gender || o % 3 == 0 && o > 0 && s[o].addRemoveClass("tableHideCollapse", !this.gender), this.age || s[o].addRemoveClass("tableHideCollapse", !this.age), this.helmet || o == 1 && s[o].addRemoveClass("tableHideCollapse", !this.helmet), this.assisted || o == 4 && s[o].addRemoveClass("tableHideCollapse", !this.assisted), this.bike || o > 0 && o < 4 && s[o].addRemoveClass("tableHideCollapse", !this.bike);
break;
case "5":
!this.helmet && !this.assisted && n[i].addRemoveClass("tableHideCollapse", !this.helmet && !this.assisted), this.gender || o % 2 == 0 && o > 0 && s[o].addRemoveClass("tableHideCollapse", !this.gender), this.age || s[o].addRemoveClass("tableHideCollapse", !this.age), this.helmet || (o < 4 && s[o].addRemoveClass("tableHideKeep", !this.helmet), o == 0 && s[o].addRemoveClass("tableHideCollapse", !this.helmet)), this.assisted || (o > 3 || o < 1) && s[o].addRemoveClass("tableHideCollapse", !this.assisted), this.bike || o < 3 && s[o].addRemoveClass("tableHideCollapse", !this.bike);
break;
default:
}
}
}
return this.render(), !0;
},
fixIt: function(e, t) {
var n, r, i;
if (t.name.indexOf("checkbox") != -1) {
n = t.name.split("_")[1];
for (x in t.parent.children) t.parent.children[x].name === "content_" + n && (r = t.parent.children[x].getContent());
i = t.getValue();
}
t.name.indexOf("radioButton") != -1 && (r = t.content);
switch (r) {
case "Age":
this.age = i;
break;
case "Gender":
this.gender = i;
break;
case "Assistive":
this.assisted = i;
break;
case "Helmet":
this.helmet = i;
break;
case "Both":
this.bike = !0, this.ped = !0;
break;
case "Bicycles":
this.bike = !0, this.ped = !1;
break;
case "Pedestrians":
this.bike = !1, this.ped = !0;
}
this.build(), this.render();
},
getData: function() {
var e = LocalStorage.get("countData");
return e == undefined && (e = []), e;
},
storeCountData: function(e, t) {
var n = t.row, r = t.column, i = [];
i.push((new Date(enyo.now())).toUTCString()), this.gender && (n == 2 || n == 4 ? r == 2 || r == 5 ? i.push("male") : (r == 3 || r == 6) && i.push("female") : r == 2 || r == 5 ? i.push("male") : (r == 3 || r == 6) && i.push("female")), this.age && (n < 4 ? i.push("adult") : i.push("child")), r < 4 ? i.push("cyclist") : i.push("pedestrian");
if (this.helmet || this.assisted) {
var s = "";
n % 2 != 0 && (s = "not "), r < 4 ? s += "wearing a helmet" : s += "using an assistive device";
}
i.push(s), this.log(i.join(", ")), Data.countAdd(i);
},
removeItem: function(e, t) {
this.$[t.name].children[0].decrement();
},
highlightRowsColumns: function(e, t) {
var n = !1, r = t.originator.container.row, i = t.originator.container.col, s = 1, o = this.$.tabula.children, u, a = 0;
t.type === "down" ? n = !0 : (this.$.totalCount.setContent(Number(this.$.totalCount.getContent()) + 1), this.$.totalCountContainer.resized()), i < 4 ? o[0].children[2].addRemoveClass("highlight", n) : i > 4 && o[0].children[4].addRemoveClass("highlight", n), o[1].children[i].addRemoveClass("highlight", n);
for (var f = 2; f < o.length; f++) {
if (f == r) break;
f % 2 == 0 && f != 0 ? o[f].children[i].addRemoveClass("highlight", n) : o[f].children[i - 1].addRemoveClass("highlight", n);
}
r % 2 == 0 ? o[r].children[0].addRemoveClass("highlight", n) : o[r - 1].children[0].addRemoveClass("highlight", n), o[r].children[s].addRemoveClass("hightlight", n);
for (var f = 1; f < o[r].children.length; f++) {
if (f == i) break;
r % 2 == 0 ? o[r].children[f].addRemoveClass("highlight", n) : o[r].children[f - 1].addRemoveClass("highlight", n);
}
},
toggleTableEnabled: function(e, t) {
this.enabled = !this.enabled;
var n = this.$.tabula.children;
for (var r in n) {
var i = n[r].children;
for (var s in i) i[s].children.length > 0 && i[s].children[0].kind === "TallyCounter" && i[s].children[0].setEnabled(this.enabled);
}
}
});

// CSenseLoginRegister.js

enyo.kind({
name: "CSenseLoginRegister",
classes: "background",
published: {
register: !1
},
events: [],
components: [ {
name: "rbox",
kind: "onyx.RadioGroup",
style: "width: 100%;",
components: [ {
content: "Login",
active: !0,
classes: "onyx-radiobutton",
ontap: "setupLogin"
}, {
content: "Register",
classes: "onyx-radiobutton",
ontap: "setupRegister"
} ]
}, {
name: "gbox",
kind: "onyx.Groupbox",
components: []
}, {
name: "memoryBox",
kind: "onyx.Checkbox",
style: "clear: left; float: left;",
ontap: "remember"
}, {
name: "text",
content: "Remember Me",
style: "float: left;"
} ],
create: function() {
this.inherited(arguments), this.register ? (this.$.radioButton.setActive(!1), this.$.radioButton2.setActive(!0), this.setupRegister()) : this.setupLogin();
},
rendered: function() {
this.inherited(arguments);
},
setupLogin: function() {
this.register = !1, this.$.gbox.destroyClientControls(), this.$.gbox.createComponent({
name: "gboxhead",
kind: "onyx.GroupboxHeader",
content: "Login"
}, {
owner: this
}), this.$.gbox.createComponent({
name: "gboxcomp",
components: [ {
name: "userdec",
kind: "onyx.InputDecorator",
classes: "onyx-input-decorator",
components: [ {
name: "username",
kind: "onyx.Input",
placeholder: "Username",
defaultFocus: !0,
type: "email",
style: "width: 100%;",
classes: "onyx-input",
onkeyup: "checkFields"
} ]
}, {
name: "passdec",
kind: "onyx.InputDecorator",
classes: "onyx-input-decorator",
components: [ {
name: "password",
kind: "onyx.Input",
placeholder: "Password",
type: "password",
style: "width: 100%;",
classes: "onyx-input",
onkeyup: "checkFields"
} ]
}, {
name: "logButton",
kind: "onyx.Button",
content: "Login",
style: "clear: both;",
ontap: "buildURL"
} ]
}, {
owner: this
}), this.$.gbox.render();
},
setupRegister: function() {
this.register = !0, this.$.gbox.destroyClientControls(), this.$.gbox.createComponent({
name: "gboxhead",
kind: "onyx.GroupboxHeader",
content: "Register"
}, {
owner: this
}), this.$.gbox.createComponent({
name: "gboxcomp",
components: [ {
name: "emaildec",
kind: "onyx.InputDecorator",
classes: "onyx-input-decorator",
components: [ {
name: "email",
kind: "onyx.Input",
placeholder: "E-Mail",
defaultFocus: !0,
style: "width: 100%;",
classes: "onyx-input",
onkeyup: "emailRegexCheck"
} ]
}, {
name: "userdec",
kind: "onyx.InputDecorator",
classes: "onyx-input-decorator",
components: [ {
name: "username",
kind: "onyx.Input",
placeholder: "Username",
type: "email",
style: "width: 100%;",
classes: "onyx-input",
onkeyup: "checkFields"
} ]
}, {
name: "passdec",
kind: "onyx.InputDecorator",
classes: "onyx-input-decorator",
components: [ {
name: "password",
kind: "onyx.Input",
placeholder: "Password",
type: "password",
style: "width: 100%;",
classes: "onyx-input",
onkeyup: "checkFields"
} ]
}, {
name: "logButton",
kind: "onyx.Button",
content: "Register",
disabled: !0,
style: "clear: both;",
ontap: "buildURL"
} ]
}, {
owner: this
}), this.$.gbox.render();
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
cacheBust: !0,
handleAs: "text"
})).go().response(this, "handleResponse");
}
},
handleResponse: function(e, t) {
this.log(e.xhr);
if (e.xhr.status === 200) {
var n = JSON.parse(e.xhr.responseText);
this.log(n.points), this.log(n.uid), this.log("WEEE"), LocalStorage.set("points", n.points.toString()), LocalStorage.set("user", n.uid.toString()), this.$.memoryBox.getValue() && LocalStorage.set("remember", !0), this.bubble("onSuccessCode");
} else this.log(JSON.stringify(e)), this.log(e.xhr.status), this.log("BOOO"), this.doFailureCode();
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

// CSenseMenuPane.js

enyo.kind({
name: "CSenseMenuPane",
fit: !0,
kind: enyo.FittableColumns,
handlers: {
onSuccessCode: "unPop",
onFailureCode: "rePop",
onPlaceChosen: "openSense",
onSubmissionMade: "closeSense",
onRenderScroller: "renderScroller"
},
events: {
onSenseOpened: ""
},
components: [ {
kind: "onyx.Popup",
centered: !0,
modal: !0,
autoDismiss: !1,
scrim: !0,
scrimWhenModal: !1,
style: "position: fixed; z-index: 15;",
components: [ {
kind: "CSenseLoginRegister"
} ]
}, {
name: "menuDrawer",
kind: enyo.Panels,
fit: !0,
narrowFit: !1,
index: 1,
draggable: !1,
margin: 0,
realtimeFit: !0,
arrangerKind: enyo.CollapsingArranger,
layoutKind: enyo.FittableColumnsLayout,
components: [ {
kind: enyo.FittableRows,
style: "width: 150px;",
components: [ {
content: "Campaign List",
ontap: "showCampaignList",
classes: "slidein-option",
onup: "toggleHilight",
ondown: "toggleHilight"
}, {
content: "Leaderboard",
ontap: "showLeaderboard",
classes: "slidein-option",
onup: "toggleHilight",
ondown: "toggleHilight"
} ]
}, {
kind: enyo.FittableRows,
fit: !0,
wrap: !1,
components: [ {
kind: onyx.Toolbar,
classes: "mod-onyx-background",
components: [ {
name: "menuButton",
kind: enyo.Button,
content: ">",
ontap: "showMenu",
classes: "button-style"
} ]
}, {
name: "menupane",
kind: enyo.Panels,
fit: !0,
draggable: !1,
animate: !1,
index: 1,
arrangerKind: enyo.CardSlideInArranger,
components: [ {
name: "llist",
kind: enyo.FittableRows,
components: [ {
kind: "LeaderboardList",
multiselect: !1,
fit: !0
} ]
}, {
name: "clist",
kind: enyo.FittableRows,
components: [ {
kind: "FilledPanels",
fit: !0
} ]
}, {
name: "sense",
kind: enyo.FittableRows,
components: []
} ]
} ]
} ]
} ],
unPop: function() {
this.$.popup.setShowing(!1);
},
rePop: function() {
this.$.popup.setShowing(!1), this.$.popup.setShowing(!0);
},
renderScroller: function() {
this.log();
},
openSense: function(e, t) {
var n = t.originator, r = !1;
for (var i in n.tasks[0].questions) if (n.tasks[0].questions[i].type.indexOf("complex") != -1) {
r = !0;
break;
}
return this.$.sensr != undefined && this.$.sensr.destroy(), this.$.sense.createComponent({
name: "sensr",
kind: "ComplexSensr",
fit: !0,
data: n,
classes: "content"
}), this.$.sense.render(), this.$.menupane.setIndex(2), !0;
},
closeSense: function(e, t) {
return this.$.menupane.previous(), this.$.sense.destroyComponents(), !0;
},
create: function() {
this.inherited(arguments), LocalStorage.get("user") === undefined && this.$.popup.show(), this.$.menupane.render();
},
backKey: function() {
this.curView != "campList" && this.$.menupane.selectView("campList");
},
viewChangedHandler: function(e, t) {
var n = t.originator;
n === "sense" && this.$.sensr.openNext(), this.curView === "lboard" && this.$.lboard.render();
},
showMenu: function(e, t) {
e.getContent() === "<" ? e.setContent(">") : e.setContent("<");
var n = this.$.menuDrawer.getIndex();
n == 1 ? this.$.menuDrawer.setIndex(0) : this.$.menuDrawer.setIndex(1);
},
showCampaignList: function(e, t) {
this.$.menupane.setIndex(1), this.showMenu();
},
showLeaderboard: function(e, t) {
this.$.menupane.setIndex(0), this.showMenu();
},
toggleHilight: function(e, t) {
var n = e.hasClass("hilight");
e.addRemoveClass("hilight", !n), this.log(e.hasClass("higlight"));
}
});

// CampaignItem.js

enyo.kind({
name: "CampaignItem",
watching: !1,
index: "",
classes: "campItem",
published: {
title: "",
description: ""
},
components: [ {
name: "button",
kind: enyo.Button,
content: "Watch",
classes: "button-style",
ontap: "buttonToggled"
}, {
name: "title",
content: "title",
classes: "campTitle"
}, {
name: "description",
tag: "p",
content: "desc",
classes: "campDesc"
} ],
events: {
onStartWatching: "",
onStopWatching: ""
},
create: function(e, t) {
this.inherited(arguments), this.$.title.setContent(this.title), this.$.description.setContent(this.description), this.render();
},
buttonToggled: function(e, t) {
var n = t.index;
this.watching = !this.watching, this.$.button.addRemoveClass("active", this.watching), this.watching ? (this.$.button.applyStyle("background-color", "green"), this.$.button.applyStyle("color", "white"), this.doStartWatching()) : (this.$.button.applyStyle("background-color", null), this.$.button.applyStyle("color", null), this.doStopWatching());
},
setIndex: function(e) {
this.log("setting index " + e), this.index = e;
}
});

// CampaignList.js

enyo.kind({
name: "CampaignList",
kind: "List",
style: "overflow: hidden; height: 100%;",
classes: "list",
components: [ {
name: "item",
kind: "CampaignItem",
classes: "campItem",
ontap: "refreshItem"
}, {
name: "divider",
classes: "divider"
} ],
handlers: {
onWatchToggled: "refreshItem",
onSetupRow: "setupRow"
},
events: {
onChooseCampaign: ""
},
create: function(e) {
this.inherited(arguments), this.log();
var t = Data.getURL() + "campaign.xml", n = new enyo.XmlpRequest({
url: t
});
n.response(this, "renderResponse"), n.go();
},
rendered: function() {
this.log(), this.inherited(arguments);
},
renderResponse: function(e, t) {
this.log(t.list), this.campaignArray = t.list["org.citizensense.model.Campaign"];
for (var n in this.campaignArray) n.watching = !1;
this.refreshList();
},
setupRow: function(e, t) {
var n = t.index;
this.$.item.setIndex(n), this.$.item.$.Title.setContent(this.campaignArray[n].title), this.$.item.$.Description.setContent(this.campaignArray[n].description), this.campaignArray[n].watching ? this.$.item.applyStyle("background-color", "green") : this.$.item.applyStyle("background-color", "clear");
},
refreshList: function() {
this.log(), this.setRows(this.campaignArray.length), this.refresh();
},
refreshItem: function(e, t, n) {
this.log(t.originator.index);
var r = t.originator.index;
this.log("rendering row " + r), this.render(), this.campaignArray[r].watching = this.campaignArray[r].watching === !0 ? !1 : !0;
},
campChosen: function() {
this.doOnChooseCampaign();
}
});

// ComplexSensr.js

enyo.kind({
name: "ComplexSensr",
style: "background-color: #254048; color: white; border-color: white;",
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
kind: "enyo.Button",
classes: "onyx-negative",
content: "No",
ontap: "close"
}, {
name: "yes",
kind: "enyo.Button",
classes: "onyx-affirmative",
content: "Yes",
ontap: "close"
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
kind: "enyo.Button",
classes: "onyx-negative",
content: "Cancel",
ontap: "togglePopup"
}, {
name: "submit",
kind: "enyo.Button",
classes: "onyx-affirmative",
content: "Submit",
ontap: "togglePopup"
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.setTaskData(this.data), this.render(), this.counterName = "";
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
return this.$.doubleCheckPopup.hide(), e.getContent() === "Yes" && (this.$.doubleCheckPopup.submit && this.buildAndSendSubmission(), this.bubble("onSubmissionMade")), !0;
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
style: "outline-color: white; border-color: white;",
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
ontap: "testButtons"
}) : array.push({
content: options[n],
ontap: "testButtons"
});
this.$.acc.createComponent({
name: t,
kind: "onyx.RadioGroup",
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

// Counter.js

enyo.kind({
name: "Counter",
kind: "enyo.Control",
published: {
title: "Counter"
},
handlers: {
onFifteenMinutes: "timerChanged",
onStartTimer: "timerStarted"
},
components: [ {
name: "titl",
content: this.title,
style: "clear: both;"
}, {
name: "cols",
kind: "enyo.FittableColumns",
components: [ {
name: "num",
fit: !0,
content: 0,
style: "float: left;"
}, {
name: "pos",
kind: "onyx.Button",
content: "+",
classes: "onyx-affirmative",
ontap: "up",
disabled: !0,
style: "float: left;"
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.$.titl.setContent(this.title);
},
timerStarted: function(e, t) {
return this.storage = [], this.$.pos.setDisabled(!1), !0;
},
timerChanged: function(e, t) {
return this.storage.push(this.getCount), this.$.num.setContent(0), this.$.neg.setDisabled(!0), !0;
},
up: function() {
this.$.pos.getDisabled() || (this.$.num.setContent(this.$.num.getContent() + 1), this.$.num.getContent != 0 && this.$.neg.setDisabled(!1));
},
down: function() {
this.$.num.getContent() > 0 ? (this.$.num.setContent(this.$.num.getContent() - 1), this.$.num.getContent() === 0 && this.$.neg.setDisabled(!0)) : this.$.neg.setDisabled(!0);
},
getCount: function() {
return this.storage != undefined ? this.storage.join() : 0;
}
});

// Data.js

enyo.kind({
name: "Data",
kind: "enyo.Control",
statics: {
getURL: function() {
return "http://ugly-umh.cs.umn.edu:8080/csense/";
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
for (x in this.users) if (this.users[x].id == e) return this.log(e), this.users[x].name;
},
getBikeData: function(e, t, n, r, i, s, o, u) {
var a = [], f;
if (n) {
if (e == 2 || e == 4) r && (t == 1 || t == 3 ? a.push("male") : a.push("female"), e <= 3 ? a.push("adult") : a.push("child"), t <= 2 ? (a.push("cyclist"), i && a.unshift("helmeted")) : (a.push("pedestrian"), s && a.unshift("assisted"))); else if (e == 3 || e == 5) t == 0 || t == 2 ? a.push("male") : a.push("female"), e <= 3 ? a.push("adult") : a.push("child"), t <= 1 ? a.push("cyclist") : a.push("pedestrian");
} else r ? (t == 0 || t == 2 ? a.push("male") : a.push("female"), i && (e == 2 || e == 4) && a.unshift("helmeted"), s && (e == 2 || e == 4) && a.unshift("assisted"), t <= 1 ? a.push("cyclist") : a.push("pedestrian")) : t <= 1 ? a.push("cyclist") : a.push("pedestrian");
return console.log(), a;
},
countAdd: function(e) {
var t = LocalStorage.get("countData");
t == undefined && (t = []), t.unshift(e), LocalStorage.set("countData", t);
},
countRemove: function(e) {
var t = LocalStorage.get("countData");
t.splice(e, 1), LocalStorage.set("countData", t);
},
countGetAtIndex: function(e) {
return (ret = LocalStorage.get("countData")) ? ret[e] : -1;
},
countSize: function() {
return LocalStorage.get("countData").length;
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

// FilledPanels.js

enyo.kind({
name: "FilledPanels",
kind: enyo.FittableRows,
events: {
onSnapped: "",
onPlaceChosen: ""
},
handlers: {
onLoaded: "drawMap",
onDoObservation: "hidePopup"
},
components: [ {
kind: "Signals",
onPinClicked: "popupTriggered"
}, {
name: "mapUp",
kind: "onyx.Popup",
style: "width: 80%; position: fixed; z-index: 2;",
classes: "onyx-popup",
centered: !0,
floating: !0,
modal: !0,
scrim: !0,
scrimWhenMobal: !1,
components: [ {
name: "pview",
kind: "PinView",
classes: "mapHide"
} ]
}, {
kind: enyo.FittableColumns,
fit: !0,
components: [ {
name: "leftButton",
kind: enyo.Button,
content: "<",
slide: "prev",
ontap: "buttonTapHandler",
classes: "button-style filledButtons",
disabled: !0
}, {
name: "panels",
kind: "Panels",
style: "height: 100%;",
arrangerKind: "CarouselArranger",
onTransitionFinish: "transitionFinishHandler",
onTransitionStart: "transitionStartHandler",
classes: "filledPanels",
layoutKind: enyo.FittableColumnsLayout,
fit: !0
}, {
name: "rightButton",
kind: enyo.Button,
content: ">",
slide: "next",
ontap: "buttonTapHandler",
classes: "button-style filledButtons"
} ]
} ],
create: function(e, t) {
this.inherited(arguments);
var n = Data.getURL() + "campaign.json", r = new enyo.Ajax({
method: "GET",
cacheBust: !1,
url: n,
handleAs: "json"
});
r.go().response(this, "renderResponse"), this.$.panels.$.animator.setDuration(350);
},
renderResponse: function(e, t) {
this.campaignArray = t.campaigns, this.log(this.campaignArray);
for (var n in this.campaignArray) {
var r = this.campaignArray[n], i = "panel_" + r.id, s = "item_" + r.id, o = "map_" + r.id, u = Date.parse(new Date), a = r.start_date_string.split(/[- :]/), f = r.end_date_string.split(/[- :]/), l = Date.parse(new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])), c = Date.parse(new Date(f[0], f[1] - 1, f[2], f[3], f[4], f[5]));
this.$.panels.createComponent({
name: i,
classes: "panelItem",
kind: enyo.FittableRows,
components: [ {
name: s,
kind: "CampaignItem",
title: "" + r.title,
description: "" + r.description
}, {
name: o,
fit: !0,
kind: "NewMap"
} ]
}), this.render(), this.checkSides();
}
},
buttonTapHandler: function(e, t) {
e.slide === "prev" ? this.$.panels.previous() : e.slide === "next" ? this.$.panels.next() : this.$.panels.snapTo(e.slide);
},
transitionFinishHandler: function(e, t) {
var n = this.$.panels.getIndex();
this.waterfall("onSnapped", undefined, n), this.checkSides();
},
transitionStartHandler: function(e, t) {
var n = this.$.panels.getIndex();
this.waterfall("onSnapping", undefined, n);
},
checkSides: function() {
var e = this.$.panels.getIndex(), t = this.$.panels.getPanels().length, n = t - 1;
t == 1 ? (this.$.rightButton.setDisabled(!0), this.$.leftButton.setDisabled(!0)) : this.campaignArray != undefined && (e == 0 ? (this.$.rightButton.setDisabled(!1), this.$.leftButton.setDisabled(!0)) : e == n && (this.$.rightButton.setDisabled(!0), this.$.leftButton.setDisabled(!1)));
},
drawMap: function(e, t) {
var n = this.$.panels.getPanels(), r = 0, i, s = t.originator.name.split("_")[1];
this.log(s);
for (x in n) {
this.log(x);
var o = n[x].name.split("_")[1];
this.log(o), o === s && (i = this.campaignArray[x].location, this.log(i), this.$.panels.$["map_" + o].checkMap(i));
}
return !0;
},
popupTriggered: function(e, t) {
this.log();
var n = t.lat + " : " + t.lon, r = this.$.panels.getIndex(), i;
this.campaignArray[r].tasks.length === 1 && (i = this.campaignArray[r].tasks[0].instructions);
var s = "1";
return this.$.pview.setContent(i, s), this.$.mapUp.resized(), this.$.mapUp.show(), !0;
},
hidePopup: function() {
this.$.mapUp.hide();
var e = this.campaignArray[this.$.panels.getIndex()];
return this.bubble("onPlaceChosen", undefined, e), !0;
}
});

// LeaderboardItem.js

enyo.kind({
name: "LeaderboardItem",
classes: "leaderItem",
index: "",
components: [ {
name: "User",
content: "user",
classes: "leaderTable leaderUser"
}, {
name: "Points",
content: "points",
classes: "leaderTable leaderPoints"
} ],
create: function(e, t) {
this.inherited(arguments);
},
setIndex: function(e) {
this.index = e;
}
});

// LeaderboardList.js

enyo.kind({
name: "LeaderboardList",
kind: enyo.FittableRows,
style: "background-color: #254048;",
classes: "list",
components: [ {
name: "list",
kind: enyo.List,
fit: !0,
onSetupItem: "setupItem",
components: [ {
name: "item",
kind: "LeaderboardItem",
classes: "campItem"
} ]
} ],
create: function(e) {
var t = Data.getURL() + "leaderboard.json", n = new enyo.Ajax({
method: "GET",
cacheBust: !1,
url: t,
handleAs: "json"
});
n.response(this, "renderResponse"), n.go(), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments);
},
renderResponse: function(e, t) {
this.leaderboardArray = t.leaderboardEntrys, this.refreshList();
},
setupItem: function(e, t) {
return this.$.item.setIndex(t.index), this.leaderboardArray != undefined && (this.$.item.$.User.setContent(this.leaderboardArray[t.index].name), this.$.item.$.Points.setContent(this.leaderboardArray[t.index].points)), !0;
},
refreshList: function() {
this.$.list.setCount(this.leaderboardArray.length), this.$.list.refresh(), this.$.list.render();
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

// leaflet.js

!function(e, t, n) {
var r = e.L, i = {};
i.version = "0.6.4", "object" == typeof module && "object" == typeof module.exports ? module.exports = i : "function" == typeof define && define.amd && define(i), i.noConflict = function() {
return e.L = r, this;
}, e.L = i, i.Util = {
extend: function(e) {
var t, n, r, i, s = Array.prototype.slice.call(arguments, 1);
for (n = 0, r = s.length; r > n; n++) {
i = s[n] || {};
for (t in i) i.hasOwnProperty(t) && (e[t] = i[t]);
}
return e;
},
bind: function(e, t) {
var n = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
return function() {
return e.apply(t, n || arguments);
};
},
stamp: function() {
var e = 0, t = "_leaflet_id";
return function(n) {
return n[t] = n[t] || ++e, n[t];
};
}(),
invokeEach: function(e, t, n) {
var r, i;
if ("object" == typeof e) {
i = Array.prototype.slice.call(arguments, 3);
for (r in e) t.apply(n, [ r, e[r] ].concat(i));
return !0;
}
return !1;
},
limitExecByInterval: function(e, t, n) {
var r, i;
return function s() {
var o = arguments;
return r ? (i = !0, void 0) : (r = !0, setTimeout(function() {
r = !1, i && (s.apply(n, o), i = !1);
}, t), e.apply(n, o), void 0);
};
},
falseFn: function() {
return !1;
},
formatNum: function(e, t) {
var n = Math.pow(10, t || 5);
return Math.round(e * n) / n;
},
trim: function(e) {
return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
},
splitWords: function(e) {
return i.Util.trim(e).split(/\s+/);
},
setOptions: function(e, t) {
return e.options = i.extend({}, e.options, t), e.options;
},
getParamString: function(e, t, n) {
var r = [];
for (var i in e) r.push(encodeURIComponent(n ? i.toUpperCase() : i) + "=" + encodeURIComponent(e[i]));
return (t && -1 !== t.indexOf("?") ? "&" : "?") + r.join("&");
},
template: function(e, t) {
return e.replace(/\{ *([\w_]+) *\}/g, function(e, r) {
var i = t[r];
if (i === n) throw new Error("No value provided for variable " + e);
return "function" == typeof i && (i = i(t)), i;
});
},
isArray: function(e) {
return "[object Array]" === Object.prototype.toString.call(e);
},
emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
}, function() {
function t(t) {
var n, r, i = [ "webkit", "moz", "o", "ms" ];
for (n = 0; n < i.length && !r; n++) r = e[i[n] + t];
return r;
}
function n(t) {
var n = +(new Date), i = Math.max(0, 16 - (n - r));
return r = n + i, e.setTimeout(t, i);
}
var r = 0, s = e.requestAnimationFrame || t("RequestAnimationFrame") || n, o = e.cancelAnimationFrame || t("CancelAnimationFrame") || t("CancelRequestAnimationFrame") || function(t) {
e.clearTimeout(t);
};
i.Util.requestAnimFrame = function(t, r, o, u) {
return t = i.bind(t, r), o && s === n ? (t(), void 0) : s.call(e, t, u);
}, i.Util.cancelAnimFrame = function(t) {
t && o.call(e, t);
};
}(), i.extend = i.Util.extend, i.bind = i.Util.bind, i.stamp = i.Util.stamp, i.setOptions = i.Util.setOptions, i.Class = function() {}, i.Class.extend = function(e) {
var t = function() {
this.initialize && this.initialize.apply(this, arguments), this._initHooks && this.callInitHooks();
}, n = function() {};
n.prototype = this.prototype;
var r = new n;
r.constructor = t, t.prototype = r;
for (var s in this) this.hasOwnProperty(s) && "prototype" !== s && (t[s] = this[s]);
e.statics && (i.extend(t, e.statics), delete e.statics), e.includes && (i.Util.extend.apply(null, [ r ].concat(e.includes)), delete e.includes), e.options && r.options && (e.options = i.extend({}, r.options, e.options)), i.extend(r, e), r._initHooks = [];
var o = this;
return t.__super__ = o.prototype, r.callInitHooks = function() {
if (!this._initHooksCalled) {
o.prototype.callInitHooks && o.prototype.callInitHooks.call(this), this._initHooksCalled = !0;
for (var e = 0, t = r._initHooks.length; t > e; e++) r._initHooks[e].call(this);
}
}, t;
}, i.Class.include = function(e) {
i.extend(this.prototype, e);
}, i.Class.mergeOptions = function(e) {
i.extend(this.prototype.options, e);
}, i.Class.addInitHook = function(e) {
var t = Array.prototype.slice.call(arguments, 1), n = "function" == typeof e ? e : function() {
this[e].apply(this, t);
};
this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(n);
};
var s = "_leaflet_events";
i.Mixin = {}, i.Mixin.Events = {
addEventListener: function(e, t, n) {
if (i.Util.invokeEach(e, this.addEventListener, this, t, n)) return this;
var r, o, u, a, f, l, c, h = this[s] = this[s] || {}, p = n && i.stamp(n);
for (e = i.Util.splitWords(e), r = 0, o = e.length; o > r; r++) u = {
action: t,
context: n || this
}, a = e[r], n ? (f = a + "_idx", l = f + "_len", c = h[f] = h[f] || {}, c[p] || (c[p] = [], h[l] = (h[l] || 0) + 1), c[p].push(u)) : (h[a] = h[a] || [], h[a].push(u));
return this;
},
hasEventListeners: function(e) {
var t = this[s];
return !!t && (e in t && t[e].length > 0 || e + "_idx" in t && t[e + "_idx_len"] > 0);
},
removeEventListener: function(e, t, n) {
if (!this[s]) return this;
if (!e) return this.clearAllEventListeners();
if (i.Util.invokeEach(e, this.removeEventListener, this, t, n)) return this;
var r, o, u, a, f, l, c, h, p, d = this[s], v = n && i.stamp(n);
for (e = i.Util.splitWords(e), r = 0, o = e.length; o > r; r++) if (u = e[r], l = u + "_idx", c = l + "_len", h = d[l], t) {
if (a = n && h ? h[v] : d[u]) {
for (f = a.length - 1; f >= 0; f--) a[f].action !== t || n && a[f].context !== n || (p = a.splice(f, 1), p[0].action = i.Util.falseFn);
n && h && 0 === a.length && (delete h[v], d[c]--);
}
} else delete d[u], delete d[l];
return this;
},
clearAllEventListeners: function() {
return delete this[s], this;
},
fireEvent: function(e, t) {
if (!this.hasEventListeners(e)) return this;
var n, r, o, u, a, f = i.Util.extend({}, t, {
type: e,
target: this
}), l = this[s];
if (l[e]) for (n = l[e].slice(), r = 0, o = n.length; o > r; r++) n[r].action.call(n[r].context || this, f);
u = l[e + "_idx"];
for (a in u) if (n = u[a].slice()) for (r = 0, o = n.length; o > r; r++) n[r].action.call(n[r].context || this, f);
return this;
},
addOneTimeEventListener: function(e, t, n) {
if (i.Util.invokeEach(e, this.addOneTimeEventListener, this, t, n)) return this;
var r = i.bind(function() {
this.removeEventListener(e, t, n).removeEventListener(e, r, n);
}, this);
return this.addEventListener(e, t, n).addEventListener(e, r, n);
}
}, i.Mixin.Events.on = i.Mixin.Events.addEventListener, i.Mixin.Events.off = i.Mixin.Events.removeEventListener, i.Mixin.Events.once = i.Mixin.Events.addOneTimeEventListener, i.Mixin.Events.fire = i.Mixin.Events.fireEvent, function() {
var r = !!e.ActiveXObject, s = r && !e.XMLHttpRequest, o = r && !t.querySelector, u = r && !t.addEventListener, a = navigator.userAgent.toLowerCase(), f = -1 !== a.indexOf("webkit"), l = -1 !== a.indexOf("chrome"), c = -1 !== a.indexOf("phantom"), h = -1 !== a.indexOf("android"), p = -1 !== a.search("android [23]"), d = typeof orientation != n + "", v = e.navigator && e.navigator.msPointerEnabled && e.navigator.msMaxTouchPoints, m = "devicePixelRatio" in e && e.devicePixelRatio > 1 || "matchMedia" in e && e.matchMedia("(min-resolution:144dpi)") && e.matchMedia("(min-resolution:144dpi)").matches, g = t.documentElement, y = r && "transition" in g.style, b = "WebKitCSSMatrix" in e && "m11" in new e.WebKitCSSMatrix, w = "MozPerspective" in g.style, E = "OTransition" in g.style, S = !e.L_DISABLE_3D && (y || b || w || E) && !c, x = !e.L_NO_TOUCH && !c && function() {
var e = "ontouchstart";
if (v || e in g) return !0;
var n = t.createElement("div"), r = !1;
return n.setAttribute ? (n.setAttribute(e, "return;"), "function" == typeof n[e] && (r = !0), n.removeAttribute(e), n = null, r) : !1;
}();
i.Browser = {
ie: r,
ie6: s,
ie7: o,
ielt9: u,
webkit: f,
android: h,
android23: p,
chrome: l,
ie3d: y,
webkit3d: b,
gecko3d: w,
opera3d: E,
any3d: S,
mobile: d,
mobileWebkit: d && f,
mobileWebkit3d: d && b,
mobileOpera: d && e.opera,
touch: x,
msTouch: v,
retina: m
};
}(), i.Point = function(e, t, n) {
this.x = n ? Math.round(e) : e, this.y = n ? Math.round(t) : t;
}, i.Point.prototype = {
clone: function() {
return new i.Point(this.x, this.y);
},
add: function(e) {
return this.clone()._add(i.point(e));
},
_add: function(e) {
return this.x += e.x, this.y += e.y, this;
},
subtract: function(e) {
return this.clone()._subtract(i.point(e));
},
_subtract: function(e) {
return this.x -= e.x, this.y -= e.y, this;
},
divideBy: function(e) {
return this.clone()._divideBy(e);
},
_divideBy: function(e) {
return this.x /= e, this.y /= e, this;
},
multiplyBy: function(e) {
return this.clone()._multiplyBy(e);
},
_multiplyBy: function(e) {
return this.x *= e, this.y *= e, this;
},
round: function() {
return this.clone()._round();
},
_round: function() {
return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
},
floor: function() {
return this.clone()._floor();
},
_floor: function() {
return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
},
distanceTo: function(e) {
e = i.point(e);
var t = e.x - this.x, n = e.y - this.y;
return Math.sqrt(t * t + n * n);
},
equals: function(e) {
return e = i.point(e), e.x === this.x && e.y === this.y;
},
contains: function(e) {
return e = i.point(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y);
},
toString: function() {
return "Point(" + i.Util.formatNum(this.x) + ", " + i.Util.formatNum(this.y) + ")";
}
}, i.point = function(e, t, r) {
return e instanceof i.Point ? e : i.Util.isArray(e) ? new i.Point(e[0], e[1]) : e === n || null === e ? e : new i.Point(e, t, r);
}, i.Bounds = function(e, t) {
if (e) for (var n = t ? [ e, t ] : e, r = 0, i = n.length; i > r; r++) this.extend(n[r]);
}, i.Bounds.prototype = {
extend: function(e) {
return e = i.point(e), this.min || this.max ? (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(e.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(e.y, this.max.y)) : (this.min = e.clone(), this.max = e.clone()), this;
},
getCenter: function(e) {
return new i.Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, e);
},
getBottomLeft: function() {
return new i.Point(this.min.x, this.max.y);
},
getTopRight: function() {
return new i.Point(this.max.x, this.min.y);
},
getSize: function() {
return this.max.subtract(this.min);
},
contains: function(e) {
var t, n;
return e = "number" == typeof e[0] || e instanceof i.Point ? i.point(e) : i.bounds(e), e instanceof i.Bounds ? (t = e.min, n = e.max) : t = n = e, t.x >= this.min.x && n.x <= this.max.x && t.y >= this.min.y && n.y <= this.max.y;
},
intersects: function(e) {
e = i.bounds(e);
var t = this.min, n = this.max, r = e.min, s = e.max, o = s.x >= t.x && r.x <= n.x, u = s.y >= t.y && r.y <= n.y;
return o && u;
},
isValid: function() {
return !!this.min && !!this.max;
}
}, i.bounds = function(e, t) {
return !e || e instanceof i.Bounds ? e : new i.Bounds(e, t);
}, i.Transformation = function(e, t, n, r) {
this._a = e, this._b = t, this._c = n, this._d = r;
}, i.Transformation.prototype = {
transform: function(e, t) {
return this._transform(e.clone(), t);
},
_transform: function(e, t) {
return t = t || 1, e.x = t * (this._a * e.x + this._b), e.y = t * (this._c * e.y + this._d), e;
},
untransform: function(e, t) {
return t = t || 1, new i.Point((e.x / t - this._b) / this._a, (e.y / t - this._d) / this._c);
}
}, i.DomUtil = {
get: function(e) {
return "string" == typeof e ? t.getElementById(e) : e;
},
getStyle: function(e, n) {
var r = e.style[n];
if (!r && e.currentStyle && (r = e.currentStyle[n]), (!r || "auto" === r) && t.defaultView) {
var i = t.defaultView.getComputedStyle(e, null);
r = i ? i[n] : null;
}
return "auto" === r ? null : r;
},
getViewportOffset: function(e) {
var n, r = 0, s = 0, o = e, u = t.body, a = t.documentElement, f = i.Browser.ie7;
do {
if (r += o.offsetTop || 0, s += o.offsetLeft || 0, r += parseInt(i.DomUtil.getStyle(o, "borderTopWidth"), 10) || 0, s += parseInt(i.DomUtil.getStyle(o, "borderLeftWidth"), 10) || 0, n = i.DomUtil.getStyle(o, "position"), o.offsetParent === u && "absolute" === n) break;
if ("fixed" === n) {
r += u.scrollTop || a.scrollTop || 0, s += u.scrollLeft || a.scrollLeft || 0;
break;
}
if ("relative" === n && !o.offsetLeft) {
var l = i.DomUtil.getStyle(o, "width"), c = i.DomUtil.getStyle(o, "max-width"), h = o.getBoundingClientRect();
("none" !== l || "none" !== c) && (s += h.left + o.clientLeft), r += h.top + (u.scrollTop || a.scrollTop || 0);
break;
}
o = o.offsetParent;
} while (o);
o = e;
do {
if (o === u) break;
r -= o.scrollTop || 0, s -= o.scrollLeft || 0, i.DomUtil.documentIsLtr() || !i.Browser.webkit && !f || (s += o.scrollWidth - o.clientWidth, f && "hidden" !== i.DomUtil.getStyle(o, "overflow-y") && "hidden" !== i.DomUtil.getStyle(o, "overflow") && (s += 17)), o = o.parentNode;
} while (o);
return new i.Point(s, r);
},
documentIsLtr: function() {
return i.DomUtil._docIsLtrCached || (i.DomUtil._docIsLtrCached = !0, i.DomUtil._docIsLtr = "ltr" === i.DomUtil.getStyle(t.body, "direction")), i.DomUtil._docIsLtr;
},
create: function(e, n, r) {
var i = t.createElement(e);
return i.className = n, r && r.appendChild(i), i;
},
hasClass: function(e, t) {
return e.className.length > 0 && (new RegExp("(^|\\s)" + t + "(\\s|$)")).test(e.className);
},
addClass: function(e, t) {
i.DomUtil.hasClass(e, t) || (e.className += (e.className ? " " : "") + t);
},
removeClass: function(e, t) {
e.className = i.Util.trim((" " + e.className + " ").replace(" " + t + " ", " "));
},
setOpacity: function(e, t) {
if ("opacity" in e.style) e.style.opacity = t; else if ("filter" in e.style) {
var n = !1, r = "DXImageTransform.Microsoft.Alpha";
try {
n = e.filters.item(r);
} catch (i) {
if (1 === t) return;
}
t = Math.round(100 * t), n ? (n.Enabled = 100 !== t, n.Opacity = t) : e.style.filter += " progid:" + r + "(opacity=" + t + ")";
}
},
testProp: function(e) {
for (var n = t.documentElement.style, r = 0; r < e.length; r++) if (e[r] in n) return e[r];
return !1;
},
getTranslateString: function(e) {
var t = i.Browser.webkit3d, n = "translate" + (t ? "3d" : "") + "(", r = (t ? ",0" : "") + ")";
return n + e.x + "px," + e.y + "px" + r;
},
getScaleString: function(e, t) {
var n = i.DomUtil.getTranslateString(t.add(t.multiplyBy(-1 * e))), r = " scale(" + e + ") ";
return n + r;
},
setPosition: function(e, t, n) {
e._leaflet_pos = t, !n && i.Browser.any3d ? (e.style[i.DomUtil.TRANSFORM] = i.DomUtil.getTranslateString(t), i.Browser.mobileWebkit3d && (e.style.WebkitBackfaceVisibility = "hidden")) : (e.style.left = t.x + "px", e.style.top = t.y + "px");
},
getPosition: function(e) {
return e._leaflet_pos;
}
}, i.DomUtil.TRANSFORM = i.DomUtil.testProp([ "transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform" ]), i.DomUtil.TRANSITION = i.DomUtil.testProp([ "webkitTransition", "transition", "OTransition", "MozTransition", "msTransition" ]), i.DomUtil.TRANSITION_END = "webkitTransition" === i.DomUtil.TRANSITION || "OTransition" === i.DomUtil.TRANSITION ? i.DomUtil.TRANSITION + "End" : "transitionend", function() {
var n = i.DomUtil.testProp([ "userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect" ]);
i.extend(i.DomUtil, {
disableTextSelection: function() {
if (i.DomEvent.on(e, "selectstart", i.DomEvent.preventDefault), n) {
var r = t.documentElement.style;
this._userSelect = r[n], r[n] = "none";
}
},
enableTextSelection: function() {
i.DomEvent.off(e, "selectstart", i.DomEvent.preventDefault), n && (t.documentElement.style[n] = this._userSelect, delete this._userSelect);
},
disableImageDrag: function() {
i.DomEvent.on(e, "dragstart", i.DomEvent.preventDefault);
},
enableImageDrag: function() {
i.DomEvent.off(e, "dragstart", i.DomEvent.preventDefault);
}
});
}(), i.LatLng = function(e, t) {
var n = parseFloat(e), r = parseFloat(t);
if (isNaN(n) || isNaN(r)) throw new Error("Invalid LatLng object: (" + e + ", " + t + ")");
this.lat = n, this.lng = r;
}, i.extend(i.LatLng, {
DEG_TO_RAD: Math.PI / 180,
RAD_TO_DEG: 180 / Math.PI,
MAX_MARGIN: 1e-9
}), i.LatLng.prototype = {
equals: function(e) {
if (!e) return !1;
e = i.latLng(e);
var t = Math.max(Math.abs(this.lat - e.lat), Math.abs(this.lng - e.lng));
return t <= i.LatLng.MAX_MARGIN;
},
toString: function(e) {
return "LatLng(" + i.Util.formatNum(this.lat, e) + ", " + i.Util.formatNum(this.lng, e) + ")";
},
distanceTo: function(e) {
e = i.latLng(e);
var t = 6378137, n = i.LatLng.DEG_TO_RAD, r = (e.lat - this.lat) * n, s = (e.lng - this.lng) * n, o = this.lat * n, u = e.lat * n, a = Math.sin(r / 2), f = Math.sin(s / 2), l = a * a + f * f * Math.cos(o) * Math.cos(u);
return 2 * t * Math.atan2(Math.sqrt(l), Math.sqrt(1 - l));
},
wrap: function(e, t) {
var n = this.lng;
return e = e || -180, t = t || 180, n = (n + t) % (t - e) + (e > n || n === t ? t : e), new i.LatLng(this.lat, n);
}
}, i.latLng = function(e, t) {
return e instanceof i.LatLng ? e : i.Util.isArray(e) ? new i.LatLng(e[0], e[1]) : e === n || null === e ? e : "object" == typeof e && "lat" in e ? new i.LatLng(e.lat, "lng" in e ? e.lng : e.lon) : new i.LatLng(e, t);
}, i.LatLngBounds = function(e, t) {
if (e) for (var n = t ? [ e, t ] : e, r = 0, i = n.length; i > r; r++) this.extend(n[r]);
}, i.LatLngBounds.prototype = {
extend: function(e) {
return e ? (e = "number" == typeof e[0] || "string" == typeof e[0] || e instanceof i.LatLng ? i.latLng(e) : i.latLngBounds(e), e instanceof i.LatLng ? this._southWest || this._northEast ? (this._southWest.lat = Math.min(e.lat, this._southWest.lat), this._southWest.lng = Math.min(e.lng, this._southWest.lng), this._northEast.lat = Math.max(e.lat, this._northEast.lat), this._northEast.lng = Math.max(e.lng, this._northEast.lng)) : (this._southWest = new i.LatLng(e.lat, e.lng), this._northEast = new i.LatLng(e.lat, e.lng)) : e instanceof i.LatLngBounds && (this.extend(e._southWest), this.extend(e._northEast)), this) : this;
},
pad: function(e) {
var t = this._southWest, n = this._northEast, r = Math.abs(t.lat - n.lat) * e, s = Math.abs(t.lng - n.lng) * e;
return new i.LatLngBounds(new i.LatLng(t.lat - r, t.lng - s), new i.LatLng(n.lat + r, n.lng + s));
},
getCenter: function() {
return new i.LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2);
},
getSouthWest: function() {
return this._southWest;
},
getNorthEast: function() {
return this._northEast;
},
getNorthWest: function() {
return new i.LatLng(this.getNorth(), this.getWest());
},
getSouthEast: function() {
return new i.LatLng(this.getSouth(), this.getEast());
},
getWest: function() {
return this._southWest.lng;
},
getSouth: function() {
return this._southWest.lat;
},
getEast: function() {
return this._northEast.lng;
},
getNorth: function() {
return this._northEast.lat;
},
contains: function(e) {
e = "number" == typeof e[0] || e instanceof i.LatLng ? i.latLng(e) : i.latLngBounds(e);
var t, n, r = this._southWest, s = this._northEast;
return e instanceof i.LatLngBounds ? (t = e.getSouthWest(), n = e.getNorthEast()) : t = n = e, t.lat >= r.lat && n.lat <= s.lat && t.lng >= r.lng && n.lng <= s.lng;
},
intersects: function(e) {
e = i.latLngBounds(e);
var t = this._southWest, n = this._northEast, r = e.getSouthWest(), s = e.getNorthEast(), o = s.lat >= t.lat && r.lat <= n.lat, u = s.lng >= t.lng && r.lng <= n.lng;
return o && u;
},
toBBoxString: function() {
return [ this.getWest(), this.getSouth(), this.getEast(), this.getNorth() ].join(",");
},
equals: function(e) {
return e ? (e = i.latLngBounds(e), this._southWest.equals(e.getSouthWest()) && this._northEast.equals(e.getNorthEast())) : !1;
},
isValid: function() {
return !!this._southWest && !!this._northEast;
}
}, i.latLngBounds = function(e, t) {
return !e || e instanceof i.LatLngBounds ? e : new i.LatLngBounds(e, t);
}, i.Projection = {}, i.Projection.SphericalMercator = {
MAX_LATITUDE: 85.0511287798,
project: function(e) {
var t = i.LatLng.DEG_TO_RAD, n = this.MAX_LATITUDE, r = Math.max(Math.min(n, e.lat), -n), s = e.lng * t, o = r * t;
return o = Math.log(Math.tan(Math.PI / 4 + o / 2)), new i.Point(s, o);
},
unproject: function(e) {
var t = i.LatLng.RAD_TO_DEG, n = e.x * t, r = (2 * Math.atan(Math.exp(e.y)) - Math.PI / 2) * t;
return new i.LatLng(r, n);
}
}, i.Projection.LonLat = {
project: function(e) {
return new i.Point(e.lng, e.lat);
},
unproject: function(e) {
return new i.LatLng(e.y, e.x);
}
}, i.CRS = {
latLngToPoint: function(e, t) {
var n = this.projection.project(e), r = this.scale(t);
return this.transformation._transform(n, r);
},
pointToLatLng: function(e, t) {
var n = this.scale(t), r = this.transformation.untransform(e, n);
return this.projection.unproject(r);
},
project: function(e) {
return this.projection.project(e);
},
scale: function(e) {
return 256 * Math.pow(2, e);
}
}, i.CRS.Simple = i.extend({}, i.CRS, {
projection: i.Projection.LonLat,
transformation: new i.Transformation(1, 0, -1, 0),
scale: function(e) {
return Math.pow(2, e);
}
}), i.CRS.EPSG3857 = i.extend({}, i.CRS, {
code: "EPSG:3857",
projection: i.Projection.SphericalMercator,
transformation: new i.Transformation(.5 / Math.PI, .5, -0.5 / Math.PI, .5),
project: function(e) {
var t = this.projection.project(e), n = 6378137;
return t.multiplyBy(n);
}
}), i.CRS.EPSG900913 = i.extend({}, i.CRS.EPSG3857, {
code: "EPSG:900913"
}), i.CRS.EPSG4326 = i.extend({}, i.CRS, {
code: "EPSG:4326",
projection: i.Projection.LonLat,
transformation: new i.Transformation(1 / 360, .5, -1 / 360, .5)
}), i.Map = i.Class.extend({
includes: i.Mixin.Events,
options: {
crs: i.CRS.EPSG3857,
fadeAnimation: i.DomUtil.TRANSITION && !i.Browser.android23,
trackResize: !0,
markerZoomAnimation: i.DomUtil.TRANSITION && i.Browser.any3d
},
initialize: function(e, t) {
t = i.setOptions(this, t), this._initContainer(e), this._initLayout(), this._initEvents(), t.maxBounds && this.setMaxBounds(t.maxBounds), t.center && t.zoom !== n && this.setView(i.latLng(t.center), t.zoom, {
reset: !0
}), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._tileLayersNum = 0, this.callInitHooks(), this._addLayers(t.layers);
},
setView: function(e, t) {
return this._resetView(i.latLng(e), this._limitZoom(t)), this;
},
setZoom: function(e, t) {
return this.setView(this.getCenter(), e, {
zoom: t
});
},
zoomIn: function(e, t) {
return this.setZoom(this._zoom + (e || 1), t);
},
zoomOut: function(e, t) {
return this.setZoom(this._zoom - (e || 1), t);
},
setZoomAround: function(e, t, n) {
var r = this.getZoomScale(t), s = this.getSize().divideBy(2), o = e instanceof i.Point ? e : this.latLngToContainerPoint(e), u = o.subtract(s).multiplyBy(1 - 1 / r), a = this.containerPointToLatLng(s.add(u));
return this.setView(a, t, {
zoom: n
});
},
fitBounds: function(e, t) {
t = t || {}, e = e.getBounds ? e.getBounds() : i.latLngBounds(e);
var n = i.point(t.paddingTopLeft || t.padding || [ 0, 0 ]), r = i.point(t.paddingBottomRight || t.padding || [ 0, 0 ]), s = this.getBoundsZoom(e, !1, n.add(r)), o = r.subtract(n).divideBy(2), u = this.project(e.getSouthWest(), s), a = this.project(e.getNorthEast(), s), f = this.unproject(u.add(a).divideBy(2).add(o), s);
return this.setView(f, s, t);
},
fitWorld: function(e) {
return this.fitBounds([ [ -90, -180 ], [ 90, 180 ] ], e);
},
panTo: function(e, t) {
return this.setView(e, this._zoom, {
pan: t
});
},
panBy: function(e) {
return this.fire("movestart"), this._rawPanBy(i.point(e)), this.fire("move"), this.fire("moveend");
},
setMaxBounds: function(e, t) {
if (e = i.latLngBounds(e), this.options.maxBounds = e, !e) return this._boundsMinZoom = null, this.off("moveend", this._panInsideMaxBounds, this), this;
var n = this.getBoundsZoom(e, !0);
return this._boundsMinZoom = n, this._loaded && (this._zoom < n ? this.setView(e.getCenter(), n, t) : this.panInsideBounds(e)), this.on("moveend", this._panInsideMaxBounds, this), this;
},
panInsideBounds: function(e) {
e = i.latLngBounds(e);
var t = this.getPixelBounds(), n = t.getBottomLeft(), r = t.getTopRight(), s = this.project(e.getSouthWest()), o = this.project(e.getNorthEast()), u = 0, a = 0;
return r.y < o.y && (a = Math.ceil(o.y - r.y)), r.x > o.x && (u = Math.floor(o.x - r.x)), n.y > s.y && (a = Math.floor(s.y - n.y)), n.x < s.x && (u = Math.ceil(s.x - n.x)), u || a ? this.panBy([ u, a ]) : this;
},
addLayer: function(e) {
var t = i.stamp(e);
return this._layers[t] ? this : (this._layers[t] = e, !e.options || isNaN(e.options.maxZoom) && isNaN(e.options.minZoom) || (this._zoomBoundLayers[t] = e, this._updateZoomLevels()), this.options.zoomAnimation && i.TileLayer && e instanceof i.TileLayer && (this._tileLayersNum++, this._tileLayersToLoad++, e.on("load", this._onTileLayerLoad, this)), this._loaded && this._layerAdd(e), this);
},
removeLayer: function(e) {
var t = i.stamp(e);
if (this._layers[t]) return this._loaded && e.onRemove(this), delete this._layers[t], this._loaded && this.fire("layerremove", {
layer: e
}), this._zoomBoundLayers[t] && (delete this._zoomBoundLayers[t], this._updateZoomLevels()), this.options.zoomAnimation && i.TileLayer && e instanceof i.TileLayer && (this._tileLayersNum--, this._tileLayersToLoad--, e.off("load", this._onTileLayerLoad, this)), this;
},
hasLayer: function(e) {
return e ? i.stamp(e) in this._layers : !1;
},
eachLayer: function(e, t) {
for (var n in this._layers) e.call(t, this._layers[n]);
return this;
},
invalidateSize: function(e) {
e = i.extend({
animate: !1,
pan: !0
}, e === !0 ? {
animate: !0
} : e);
var t = this.getSize();
if (this._sizeChanged = !0, this.options.maxBounds && this.setMaxBounds(this.options.maxBounds), !this._loaded) return this;
var n = this.getSize(), r = t.subtract(n).divideBy(2).round();
return r.x || r.y ? (e.animate && e.pan ? this.panBy(r) : (e.pan && this._rawPanBy(r), this.fire("move"), clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(i.bind(this.fire, this, "moveend"), 200)), this.fire("resize", {
oldSize: t,
newSize: n
})) : this;
},
addHandler: function(e, t) {
if (t) {
var n = this[e] = new t(this);
return this._handlers.push(n), this.options[e] && n.enable(), this;
}
},
remove: function() {
return this._loaded && this.fire("unload"), this._initEvents("off"), delete this._container._leaflet, this._clearPanes(), this._clearControlPos && this._clearControlPos(), this._clearHandlers(), this;
},
getCenter: function() {
return this._checkIfLoaded(), this._moved() ? this.layerPointToLatLng(this._getCenterLayerPoint()) : this._initialCenter;
},
getZoom: function() {
return this._zoom;
},
getBounds: function() {
var e = this.getPixelBounds(), t = this.unproject(e.getBottomLeft()), n = this.unproject(e.getTopRight());
return new i.LatLngBounds(t, n);
},
getMinZoom: function() {
var e = this._layersMinZoom === n ? 0 : this._layersMinZoom, t = this._boundsMinZoom === n ? 0 : this._boundsMinZoom;
return this.options.minZoom === n ? Math.max(e, t) : this.options.minZoom;
},
getMaxZoom: function() {
return this.options.maxZoom === n ? this._layersMaxZoom === n ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom;
},
getBoundsZoom: function(e, t, n) {
e = i.latLngBounds(e);
var r, s = this.getMinZoom() - (t ? 1 : 0), o = this.getMaxZoom(), u = this.getSize(), a = e.getNorthWest(), f = e.getSouthEast(), l = !0;
n = i.point(n || [ 0, 0 ]);
do s++, r = this.project(f, s).subtract(this.project(a, s)).add(n), l = t ? r.x < u.x || r.y < u.y : u.contains(r); while (l && o >= s);
return l && t ? null : t ? s : s - 1;
},
getSize: function() {
return (!this._size || this._sizeChanged) && (this._size = new i.Point(this._container.clientWidth, this._container.clientHeight), this._sizeChanged = !1), this._size.clone();
},
getPixelBounds: function() {
var e = this._getTopLeftPoint();
return new i.Bounds(e, e.add(this.getSize()));
},
getPixelOrigin: function() {
return this._checkIfLoaded(), this._initialTopLeftPoint;
},
getPanes: function() {
return this._panes;
},
getContainer: function() {
return this._container;
},
getZoomScale: function(e) {
var t = this.options.crs;
return t.scale(e) / t.scale(this._zoom);
},
getScaleZoom: function(e) {
return this._zoom + Math.log(e) / Math.LN2;
},
project: function(e, t) {
return t = t === n ? this._zoom : t, this.options.crs.latLngToPoint(i.latLng(e), t);
},
unproject: function(e, t) {
return t = t === n ? this._zoom : t, this.options.crs.pointToLatLng(i.point(e), t);
},
layerPointToLatLng: function(e) {
var t = i.point(e).add(this.getPixelOrigin());
return this.unproject(t);
},
latLngToLayerPoint: function(e) {
var t = this.project(i.latLng(e))._round();
return t._subtract(this.getPixelOrigin());
},
containerPointToLayerPoint: function(e) {
return i.point(e).subtract(this._getMapPanePos());
},
layerPointToContainerPoint: function(e) {
return i.point(e).add(this._getMapPanePos());
},
containerPointToLatLng: function(e) {
var t = this.containerPointToLayerPoint(i.point(e));
return this.layerPointToLatLng(t);
},
latLngToContainerPoint: function(e) {
return this.layerPointToContainerPoint(this.latLngToLayerPoint(i.latLng(e)));
},
mouseEventToContainerPoint: function(e) {
return i.DomEvent.getMousePosition(e, this._container);
},
mouseEventToLayerPoint: function(e) {
return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
},
mouseEventToLatLng: function(e) {
return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
},
_initContainer: function(e) {
var t = this._container = i.DomUtil.get(e);
if (!t) throw new Error("Map container not found.");
if (t._leaflet) throw new Error("Map container is already initialized.");
t._leaflet = !0;
},
_initLayout: function() {
var e = this._container;
i.DomUtil.addClass(e, "leaflet-container" + (i.Browser.touch ? " leaflet-touch" : "") + (i.Browser.retina ? " leaflet-retina" : "") + (this.options.fadeAnimation ? " leaflet-fade-anim" : ""));
var t = i.DomUtil.getStyle(e, "position");
"absolute" !== t && "relative" !== t && "fixed" !== t && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
},
_initPanes: function() {
var e = this._panes = {};
this._mapPane = e.mapPane = this._createPane("leaflet-map-pane", this._container), this._tilePane = e.tilePane = this._createPane("leaflet-tile-pane", this._mapPane), e.objectsPane = this._createPane("leaflet-objects-pane", this._mapPane), e.shadowPane = this._createPane("leaflet-shadow-pane"), e.overlayPane = this._createPane("leaflet-overlay-pane"), e.markerPane = this._createPane("leaflet-marker-pane"), e.popupPane = this._createPane("leaflet-popup-pane");
var t = " leaflet-zoom-hide";
this.options.markerZoomAnimation || (i.DomUtil.addClass(e.markerPane, t), i.DomUtil.addClass(e.shadowPane, t), i.DomUtil.addClass(e.popupPane, t));
},
_createPane: function(e, t) {
return i.DomUtil.create("div", e, t || this._panes.objectsPane);
},
_clearPanes: function() {
this._container.removeChild(this._mapPane);
},
_addLayers: function(e) {
e = e ? i.Util.isArray(e) ? e : [ e ] : [];
for (var t = 0, n = e.length; n > t; t++) this.addLayer(e[t]);
},
_resetView: function(e, t, n, r) {
var s = this._zoom !== t;
r || (this.fire("movestart"), s && this.fire("zoomstart")), this._zoom = t, this._initialCenter = e, this._initialTopLeftPoint = this._getNewTopLeftPoint(e), n ? this._initialTopLeftPoint._add(this._getMapPanePos()) : i.DomUtil.setPosition(this._mapPane, new i.Point(0, 0)), this._tileLayersToLoad = this._tileLayersNum;
var o = !this._loaded;
this._loaded = !0, o && (this.fire("load"), this.eachLayer(this._layerAdd, this)), this.fire("viewreset", {
hard: !n
}), this.fire("move"), (s || r) && this.fire("zoomend"), this.fire("moveend", {
hard: !n
});
},
_rawPanBy: function(e) {
i.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(e));
},
_getZoomSpan: function() {
return this.getMaxZoom() - this.getMinZoom();
},
_updateZoomLevels: function() {
var e, t = 1 / 0, r = -1 / 0, i = this._getZoomSpan();
for (e in this._zoomBoundLayers) {
var s = this._zoomBoundLayers[e];
isNaN(s.options.minZoom) || (t = Math.min(t, s.options.minZoom)), isNaN(s.options.maxZoom) || (r = Math.max(r, s.options.maxZoom));
}
e === n ? this._layersMaxZoom = this._layersMinZoom = n : (this._layersMaxZoom = r, this._layersMinZoom = t), i !== this._getZoomSpan() && this.fire("zoomlevelschange");
},
_panInsideMaxBounds: function() {
this.panInsideBounds(this.options.maxBounds);
},
_checkIfLoaded: function() {
if (!this._loaded) throw new Error("Set map center and zoom first.");
},
_initEvents: function(t) {
if (i.DomEvent) {
t = t || "on", i.DomEvent[t](this._container, "click", this._onMouseClick, this);
var n, r, s = [ "dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave", "mousemove", "contextmenu" ];
for (n = 0, r = s.length; r > n; n++) i.DomEvent[t](this._container, s[n], this._fireMouseEvent, this);
this.options.trackResize && i.DomEvent[t](e, "resize", this._onResize, this);
}
},
_onResize: function() {
i.Util.cancelAnimFrame(this._resizeRequest), this._resizeRequest = i.Util.requestAnimFrame(this.invalidateSize, this, !1, this._container);
},
_onMouseClick: function(e) {
!this._loaded || !e._simulated && this.dragging && this.dragging.moved() || i.DomEvent._skipped(e) || (this.fire("preclick"), this._fireMouseEvent(e));
},
_fireMouseEvent: function(e) {
if (this._loaded && !i.DomEvent._skipped(e)) {
var t = e.type;
if (t = "mouseenter" === t ? "mouseover" : "mouseleave" === t ? "mouseout" : t, this.hasEventListeners(t)) {
"contextmenu" === t && i.DomEvent.preventDefault(e);
var n = this.mouseEventToContainerPoint(e), r = this.containerPointToLayerPoint(n), s = this.layerPointToLatLng(r);
this.fire(t, {
latlng: s,
layerPoint: r,
containerPoint: n,
originalEvent: e
});
}
}
},
_onTileLayerLoad: function() {
this._tileLayersToLoad--, this._tileLayersNum && !this._tileLayersToLoad && this.fire("tilelayersload");
},
_clearHandlers: function() {
for (var e = 0, t = this._handlers.length; t > e; e++) this._handlers[e].disable();
},
whenReady: function(e, t) {
return this._loaded ? e.call(t || this, this) : this.on("load", e, t), this;
},
_layerAdd: function(e) {
e.onAdd(this), this.fire("layeradd", {
layer: e
});
},
_getMapPanePos: function() {
return i.DomUtil.getPosition(this._mapPane);
},
_moved: function() {
var e = this._getMapPanePos();
return e && !e.equals([ 0, 0 ]);
},
_getTopLeftPoint: function() {
return this.getPixelOrigin().subtract(this._getMapPanePos());
},
_getNewTopLeftPoint: function(e, t) {
var n = this.getSize()._divideBy(2);
return this.project(e, t)._subtract(n)._round();
},
_latLngToNewLayerPoint: function(e, t, n) {
var r = this._getNewTopLeftPoint(n, t).add(this._getMapPanePos());
return this.project(e, t)._subtract(r);
},
_getCenterLayerPoint: function() {
return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
},
_getCenterOffset: function(e) {
return this.latLngToLayerPoint(e).subtract(this._getCenterLayerPoint());
},
_limitZoom: function(e) {
var t = this.getMinZoom(), n = this.getMaxZoom();
return Math.max(t, Math.min(n, e));
}
}), i.map = function(e, t) {
return new i.Map(e, t);
}, i.Projection.Mercator = {
MAX_LATITUDE: 85.0840591556,
R_MINOR: 6356752.314245179,
R_MAJOR: 6378137,
project: function(e) {
var t = i.LatLng.DEG_TO_RAD, n = this.MAX_LATITUDE, r = Math.max(Math.min(n, e.lat), -n), s = this.R_MAJOR, o = this.R_MINOR, u = e.lng * t * s, a = r * t, f = o / s, l = Math.sqrt(1 - f * f), c = l * Math.sin(a);
c = Math.pow((1 - c) / (1 + c), .5 * l);
var h = Math.tan(.5 * (.5 * Math.PI - a)) / c;
return a = -s * Math.log(h), new i.Point(u, a);
},
unproject: function(e) {
for (var t, n = i.LatLng.RAD_TO_DEG, r = this.R_MAJOR, s = this.R_MINOR, o = e.x * n / r, u = s / r, a = Math.sqrt(1 - u * u), f = Math.exp(-e.y / r), l = Math.PI / 2 - 2 * Math.atan(f), c = 15, h = 1e-7, p = c, d = .1; Math.abs(d) > h && --p > 0; ) t = a * Math.sin(l), d = Math.PI / 2 - 2 * Math.atan(f * Math.pow((1 - t) / (1 + t), .5 * a)) - l, l += d;
return new i.LatLng(l * n, o);
}
}, i.CRS.EPSG3395 = i.extend({}, i.CRS, {
code: "EPSG:3395",
projection: i.Projection.Mercator,
transformation: function() {
var e = i.Projection.Mercator, t = e.R_MAJOR, n = e.R_MINOR;
return new i.Transformation(.5 / (Math.PI * t), .5, -0.5 / (Math.PI * n), .5);
}()
}), i.TileLayer = i.Class.extend({
includes: i.Mixin.Events,
options: {
minZoom: 0,
maxZoom: 18,
tileSize: 256,
subdomains: "abc",
errorTileUrl: "",
attribution: "",
zoomOffset: 0,
opacity: 1,
unloadInvisibleTiles: i.Browser.mobile,
updateWhenIdle: i.Browser.mobile
},
initialize: function(e, t) {
t = i.setOptions(this, t), t.detectRetina && i.Browser.retina && t.maxZoom > 0 && (t.tileSize = Math.floor(t.tileSize / 2), t.zoomOffset++, t.minZoom > 0 && t.minZoom--, this.options.maxZoom--), t.bounds && (t.bounds = i.latLngBounds(t.bounds)), this._url = e;
var n = this.options.subdomains;
"string" == typeof n && (this.options.subdomains = n.split(""));
},
onAdd: function(e) {
this._map = e, this._animated = e._zoomAnimated, this._initContainer(), this._createTileProto(), e.on({
viewreset: this._reset,
moveend: this._update
}, this), this._animated && e.on({
zoomanim: this._animateZoom,
zoomend: this._endZoomAnim
}, this), this.options.updateWhenIdle || (this._limitedUpdate = i.Util.limitExecByInterval(this._update, 150, this), e.on("move", this._limitedUpdate, this)), this._reset(), this._update();
},
addTo: function(e) {
return e.addLayer(this), this;
},
onRemove: function(e) {
this._container.parentNode.removeChild(this._container), e.off({
viewreset: this._reset,
moveend: this._update
}, this), this._animated && e.off({
zoomanim: this._animateZoom,
zoomend: this._endZoomAnim
}, this), this.options.updateWhenIdle || e.off("move", this._limitedUpdate, this), this._container = null, this._map = null;
},
bringToFront: function() {
var e = this._map._panes.tilePane;
return this._container && (e.appendChild(this._container), this._setAutoZIndex(e, Math.max)), this;
},
bringToBack: function() {
var e = this._map._panes.tilePane;
return this._container && (e.insertBefore(this._container, e.firstChild), this._setAutoZIndex(e, Math.min)), this;
},
getAttribution: function() {
return this.options.attribution;
},
getContainer: function() {
return this._container;
},
setOpacity: function(e) {
return this.options.opacity = e, this._map && this._updateOpacity(), this;
},
setZIndex: function(e) {
return this.options.zIndex = e, this._updateZIndex(), this;
},
setUrl: function(e, t) {
return this._url = e, t || this.redraw(), this;
},
redraw: function() {
return this._map && (this._reset({
hard: !0
}), this._update()), this;
},
_updateZIndex: function() {
this._container && this.options.zIndex !== n && (this._container.style.zIndex = this.options.zIndex);
},
_setAutoZIndex: function(e, t) {
var n, r, i, s = e.children, o = -t(1 / 0, -1 / 0);
for (r = 0, i = s.length; i > r; r++) s[r] !== this._container && (n = parseInt(s[r].style.zIndex, 10), isNaN(n) || (o = t(o, n)));
this.options.zIndex = this._container.style.zIndex = (isFinite(o) ? o : 0) + t(1, -1);
},
_updateOpacity: function() {
var e, t = this._tiles;
if (i.Browser.ielt9) for (e in t) i.DomUtil.setOpacity(t[e], this.options.opacity); else i.DomUtil.setOpacity(this._container, this.options.opacity);
},
_initContainer: function() {
var e = this._map._panes.tilePane;
if (!this._container) {
if (this._container = i.DomUtil.create("div", "leaflet-layer"), this._updateZIndex(), this._animated) {
var t = "leaflet-tile-container leaflet-zoom-animated";
this._bgBuffer = i.DomUtil.create("div", t, this._container), this._tileContainer = i.DomUtil.create("div", t, this._container);
} else this._tileContainer = this._container;
e.appendChild(this._container), this.options.opacity < 1 && this._updateOpacity();
}
},
_reset: function(e) {
for (var t in this._tiles) this.fire("tileunload", {
tile: this._tiles[t]
});
this._tiles = {}, this._tilesToLoad = 0, this.options.reuseTiles && (this._unusedTiles = []), this._tileContainer.innerHTML = "", this._animated && e && e.hard && this._clearBgBuffer(), this._initContainer();
},
_update: function() {
if (this._map) {
var e = this._map.getPixelBounds(), t = this._map.getZoom(), n = this.options.tileSize;
if (!(t > this.options.maxZoom || t < this.options.minZoom)) {
var r = i.bounds(e.min.divideBy(n)._floor(), e.max.divideBy(n)._floor());
this._addTilesFromCenterOut(r), (this.options.unloadInvisibleTiles || this.options.reuseTiles) && this._removeOtherTiles(r);
}
}
},
_addTilesFromCenterOut: function(e) {
var n, r, s, o = [], u = e.getCenter();
for (n = e.min.y; n <= e.max.y; n++) for (r = e.min.x; r <= e.max.x; r++) s = new i.Point(r, n), this._tileShouldBeLoaded(s) && o.push(s);
var a = o.length;
if (0 !== a) {
o.sort(function(e, t) {
return e.distanceTo(u) - t.distanceTo(u);
});
var f = t.createDocumentFragment();
for (this._tilesToLoad || this.fire("loading"), this._tilesToLoad += a, r = 0; a > r; r++) this._addTile(o[r], f);
this._tileContainer.appendChild(f);
}
},
_tileShouldBeLoaded: function(e) {
if (e.x + ":" + e.y in this._tiles) return !1;
var t = this.options;
if (!t.continuousWorld) {
var n = this._getWrapTileNum();
if (t.noWrap && (e.x < 0 || e.x >= n) || e.y < 0 || e.y >= n) return !1;
}
if (t.bounds) {
var r = t.tileSize, i = e.multiplyBy(r), s = i.add([ r, r ]), o = this._map.unproject(i), u = this._map.unproject(s);
if (t.continuousWorld || t.noWrap || (o = o.wrap(), u = u.wrap()), !t.bounds.intersects([ o, u ])) return !1;
}
return !0;
},
_removeOtherTiles: function(e) {
var t, n, r, i;
for (i in this._tiles) t = i.split(":"), n = parseInt(t[0], 10), r = parseInt(t[1], 10), (n < e.min.x || n > e.max.x || r < e.min.y || r > e.max.y) && this._removeTile(i);
},
_removeTile: function(e) {
var t = this._tiles[e];
this.fire("tileunload", {
tile: t,
url: t.src
}), this.options.reuseTiles ? (i.DomUtil.removeClass(t, "leaflet-tile-loaded"), this._unusedTiles.push(t)) : t.parentNode === this._tileContainer && this._tileContainer.removeChild(t), i.Browser.android || (t.onload = null, t.src = i.Util.emptyImageUrl), delete this._tiles[e];
},
_addTile: function(e, t) {
var n = this._getTilePos(e), r = this._getTile();
i.DomUtil.setPosition(r, n, i.Browser.chrome || i.Browser.android23), this._tiles[e.x + ":" + e.y] = r, this._loadTile(r, e), r.parentNode !== this._tileContainer && t.appendChild(r);
},
_getZoomForUrl: function() {
var e = this.options, t = this._map.getZoom();
return e.zoomReverse && (t = e.maxZoom - t), t + e.zoomOffset;
},
_getTilePos: function(e) {
var t = this._map.getPixelOrigin(), n = this.options.tileSize;
return e.multiplyBy(n).subtract(t);
},
getTileUrl: function(e) {
return i.Util.template(this._url, i.extend({
s: this._getSubdomain(e),
z: e.z,
x: e.x,
y: e.y
}, this.options));
},
_getWrapTileNum: function() {
return Math.pow(2, this._getZoomForUrl());
},
_adjustTilePoint: function(e) {
var t = this._getWrapTileNum();
this.options.continuousWorld || this.options.noWrap || (e.x = (e.x % t + t) % t), this.options.tms && (e.y = t - e.y - 1), e.z = this._getZoomForUrl();
},
_getSubdomain: function(e) {
var t = Math.abs(e.x + e.y) % this.options.subdomains.length;
return this.options.subdomains[t];
},
_createTileProto: function() {
var e = this._tileImg = i.DomUtil.create("img", "leaflet-tile");
e.style.width = e.style.height = this.options.tileSize + "px", e.galleryimg = "no";
},
_getTile: function() {
if (this.options.reuseTiles && this._unusedTiles.length > 0) {
var e = this._unusedTiles.pop();
return this._resetTile(e), e;
}
return this._createTile();
},
_resetTile: function() {},
_createTile: function() {
var e = this._tileImg.cloneNode(!1);
return e.onselectstart = e.onmousemove = i.Util.falseFn, i.Browser.ielt9 && this.options.opacity !== n && i.DomUtil.setOpacity(e, this.options.opacity), e;
},
_loadTile: function(e, t) {
e._layer = this, e.onload = this._tileOnLoad, e.onerror = this._tileOnError, this._adjustTilePoint(t), e.src = this.getTileUrl(t);
},
_tileLoaded: function() {
this._tilesToLoad--, this._tilesToLoad || (this.fire("load"), this._animated && (clearTimeout(this._clearBgBufferTimer), this._clearBgBufferTimer = setTimeout(i.bind(this._clearBgBuffer, this), 500)));
},
_tileOnLoad: function() {
var e = this._layer;
this.src !== i.Util.emptyImageUrl && (i.DomUtil.addClass(this, "leaflet-tile-loaded"), e.fire("tileload", {
tile: this,
url: this.src
})), e._tileLoaded();
},
_tileOnError: function() {
var e = this._layer;
e.fire("tileerror", {
tile: this,
url: this.src
});
var t = e.options.errorTileUrl;
t && (this.src = t), e._tileLoaded();
}
}), i.tileLayer = function(e, t) {
return new i.TileLayer(e, t);
}, i.TileLayer.WMS = i.TileLayer.extend({
defaultWmsParams: {
service: "WMS",
request: "GetMap",
version: "1.1.1",
layers: "",
styles: "",
format: "image/jpeg",
transparent: !1
},
initialize: function(e, t) {
this._url = e;
var n = i.extend({}, this.defaultWmsParams), r = t.tileSize || this.options.tileSize;
n.width = n.height = t.detectRetina && i.Browser.retina ? 2 * r : r;
for (var s in t) this.options.hasOwnProperty(s) || "crs" === s || (n[s] = t[s]);
this.wmsParams = n, i.setOptions(this, t);
},
onAdd: function(e) {
this._crs = this.options.crs || e.options.crs;
var t = parseFloat(this.wmsParams.version) >= 1.3 ? "crs" : "srs";
this.wmsParams[t] = this._crs.code, i.TileLayer.prototype.onAdd.call(this, e);
},
getTileUrl: function(e, t) {
var n = this._map, r = this.options.tileSize, s = e.multiplyBy(r), o = s.add([ r, r ]), u = this._crs.project(n.unproject(s, t)), a = this._crs.project(n.unproject(o, t)), f = [ u.x, a.y, a.x, u.y ].join(","), l = i.Util.template(this._url, {
s: this._getSubdomain(e)
});
return l + i.Util.getParamString(this.wmsParams, l, !0) + "&BBOX=" + f;
},
setParams: function(e, t) {
return i.extend(this.wmsParams, e), t || this.redraw(), this;
}
}), i.tileLayer.wms = function(e, t) {
return new i.TileLayer.WMS(e, t);
}, i.TileLayer.Canvas = i.TileLayer.extend({
options: {
async: !1
},
initialize: function(e) {
i.setOptions(this, e);
},
redraw: function() {
this._map && (this._reset({
hard: !0
}), this._update());
for (var e in this._tiles) this._redrawTile(this._tiles[e]);
return this;
},
_redrawTile: function(e) {
this.drawTile(e, e._tilePoint, this._map._zoom);
},
_createTileProto: function() {
var e = this._canvasProto = i.DomUtil.create("canvas", "leaflet-tile");
e.width = e.height = this.options.tileSize;
},
_createTile: function() {
var e = this._canvasProto.cloneNode(!1);
return e.onselectstart = e.onmousemove = i.Util.falseFn, e;
},
_loadTile: function(e, t) {
e._layer = this, e._tilePoint = t, this._redrawTile(e), this.options.async || this.tileDrawn(e);
},
drawTile: function() {},
tileDrawn: function(e) {
this._tileOnLoad.call(e);
}
}), i.tileLayer.canvas = function(e) {
return new i.TileLayer.Canvas(e);
}, i.ImageOverlay = i.Class.extend({
includes: i.Mixin.Events,
options: {
opacity: 1
},
initialize: function(e, t, n) {
this._url = e, this._bounds = i.latLngBounds(t), i.setOptions(this, n);
},
onAdd: function(e) {
this._map = e, this._image || this._initImage(), e._panes.overlayPane.appendChild(this._image), e.on("viewreset", this._reset, this), e.options.zoomAnimation && i.Browser.any3d && e.on("zoomanim", this._animateZoom, this), this._reset();
},
onRemove: function(e) {
e.getPanes().overlayPane.removeChild(this._image), e.off("viewreset", this._reset, this), e.options.zoomAnimation && e.off("zoomanim", this._animateZoom, this);
},
addTo: function(e) {
return e.addLayer(this), this;
},
setOpacity: function(e) {
return this.options.opacity = e, this._updateOpacity(), this;
},
bringToFront: function() {
return this._image && this._map._panes.overlayPane.appendChild(this._image), this;
},
bringToBack: function() {
var e = this._map._panes.overlayPane;
return this._image && e.insertBefore(this._image, e.firstChild), this;
},
_initImage: function() {
this._image = i.DomUtil.create("img", "leaflet-image-layer"), this._map.options.zoomAnimation && i.Browser.any3d ? i.DomUtil.addClass(this._image, "leaflet-zoom-animated") : i.DomUtil.addClass(this._image, "leaflet-zoom-hide"), this._updateOpacity(), i.extend(this._image, {
galleryimg: "no",
onselectstart: i.Util.falseFn,
onmousemove: i.Util.falseFn,
onload: i.bind(this._onImageLoad, this),
src: this._url
});
},
_animateZoom: function(e) {
var t = this._map, n = this._image, r = t.getZoomScale(e.zoom), s = this._bounds.getNorthWest(), o = this._bounds.getSouthEast(), u = t._latLngToNewLayerPoint(s, e.zoom, e.center), a = t._latLngToNewLayerPoint(o, e.zoom, e.center)._subtract(u), f = u._add(a._multiplyBy(.5 * (1 - 1 / r)));
n.style[i.DomUtil.TRANSFORM] = i.DomUtil.getTranslateString(f) + " scale(" + r + ") ";
},
_reset: function() {
var e = this._image, t = this._map.latLngToLayerPoint(this._bounds.getNorthWest()), n = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(t);
i.DomUtil.setPosition(e, t), e.style.width = n.x + "px", e.style.height = n.y + "px";
},
_onImageLoad: function() {
this.fire("load");
},
_updateOpacity: function() {
i.DomUtil.setOpacity(this._image, this.options.opacity);
}
}), i.imageOverlay = function(e, t, n) {
return new i.ImageOverlay(e, t, n);
}, i.Icon = i.Class.extend({
options: {
className: ""
},
initialize: function(e) {
i.setOptions(this, e);
},
createIcon: function(e) {
return this._createIcon("icon", e);
},
createShadow: function(e) {
return this._createIcon("shadow", e);
},
_createIcon: function(e, t) {
var n = this._getIconUrl(e);
if (!n) {
if ("icon" === e) throw new Error("iconUrl not set in Icon options (see the docs).");
return null;
}
var r;
return r = t && "IMG" === t.tagName ? this._createImg(n, t) : this._createImg(n), this._setIconStyles(r, e), r;
},
_setIconStyles: function(e, t) {
var n, r = this.options, s = i.point(r[t + "Size"]);
n = "shadow" === t ? i.point(r.shadowAnchor || r.iconAnchor) : i.point(r.iconAnchor), !n && s && (n = s.divideBy(2, !0)), e.className = "leaflet-marker-" + t + " " + r.className, n && (e.style.marginLeft = -n.x + "px", e.style.marginTop = -n.y + "px"), s && (e.style.width = s.x + "px", e.style.height = s.y + "px");
},
_createImg: function(e, n) {
return i.Browser.ie6 ? (n || (n = t.createElement("div")), n.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + e + '")') : (n || (n = t.createElement("img")), n.src = e), n;
},
_getIconUrl: function(e) {
return i.Browser.retina && this.options[e + "RetinaUrl"] ? this.options[e + "RetinaUrl"] : this.options[e + "Url"];
}
}), i.icon = function(e) {
return new i.Icon(e);
}, i.Icon.Default = i.Icon.extend({
options: {
iconSize: [ 25, 41 ],
iconAnchor: [ 12, 41 ],
popupAnchor: [ 1, -34 ],
shadowSize: [ 41, 41 ]
},
_getIconUrl: function(e) {
var t = e + "Url";
if (this.options[t]) return this.options[t];
i.Browser.retina && "icon" === e && (e += "-2x");
var n = i.Icon.Default.imagePath;
if (!n) throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");
return n + "/marker-" + e + ".png";
}
}), i.Icon.Default.imagePath = function() {
var e, n, r, i, s, o = t.getElementsByTagName("script"), u = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;
for (e = 0, n = o.length; n > e; e++) if (r = o[e].src, i = r.match(u)) return s = r.split(u)[0], (s ? s + "/" : "") + "images";
}(), i.Marker = i.Class.extend({
includes: i.Mixin.Events,
options: {
icon: new i.Icon.Default,
title: "",
clickable: !0,
draggable: !1,
keyboard: !0,
zIndexOffset: 0,
opacity: 1,
riseOnHover: !1,
riseOffset: 250
},
initialize: function(e, t) {
i.setOptions(this, t), this._latlng = i.latLng(e);
},
onAdd: function(e) {
this._map = e, e.on("viewreset", this.update, this), this._initIcon(), this.update(), e.options.zoomAnimation && e.options.markerZoomAnimation && e.on("zoomanim", this._animateZoom, this);
},
addTo: function(e) {
return e.addLayer(this), this;
},
onRemove: function(e) {
this.dragging && this.dragging.disable(), this._removeIcon(), this._removeShadow(), this.fire("remove"), e.off({
viewreset: this.update,
zoomanim: this._animateZoom
}, this), this._map = null;
},
getLatLng: function() {
return this._latlng;
},
setLatLng: function(e) {
return this._latlng = i.latLng(e), this.update(), this.fire("move", {
latlng: this._latlng
});
},
setZIndexOffset: function(e) {
return this.options.zIndexOffset = e, this.update(), this;
},
setIcon: function(e) {
return this.options.icon = e, this._map && (this._initIcon(), this.update()), this;
},
update: function() {
if (this._icon) {
var e = this._map.latLngToLayerPoint(this._latlng).round();
this._setPos(e);
}
return this;
},
_initIcon: function() {
var e = this.options, t = this._map, n = t.options.zoomAnimation && t.options.markerZoomAnimation, r = n ? "leaflet-zoom-animated" : "leaflet-zoom-hide", s = e.icon.createIcon(this._icon), o = !1;
s !== this._icon && (this._icon && this._removeIcon(), o = !0, e.title && (s.title = e.title)), i.DomUtil.addClass(s, r), e.keyboard && (s.tabIndex = "0"), this._icon = s, this._initInteraction(), e.riseOnHover && i.DomEvent.on(s, "mouseover", this._bringToFront, this).on(s, "mouseout", this._resetZIndex, this);
var u = e.icon.createShadow(this._shadow), a = !1;
u !== this._shadow && (this._removeShadow(), a = !0), u && i.DomUtil.addClass(u, r), this._shadow = u, e.opacity < 1 && this._updateOpacity();
var f = this._map._panes;
o && f.markerPane.appendChild(this._icon), u && a && f.shadowPane.appendChild(this._shadow);
},
_removeIcon: function() {
this.options.riseOnHover && i.DomEvent.off(this._icon, "mouseover", this._bringToFront).off(this._icon, "mouseout", this._resetZIndex), this._map._panes.markerPane.removeChild(this._icon), this._icon = null;
},
_removeShadow: function() {
this._shadow && this._map._panes.shadowPane.removeChild(this._shadow), this._shadow = null;
},
_setPos: function(e) {
i.DomUtil.setPosition(this._icon, e), this._shadow && i.DomUtil.setPosition(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex();
},
_updateZIndex: function(e) {
this._icon.style.zIndex = this._zIndex + e;
},
_animateZoom: function(e) {
var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
this._setPos(t);
},
_initInteraction: function() {
if (this.options.clickable) {
var e = this._icon, t = [ "dblclick", "mousedown", "mouseover", "mouseout", "contextmenu" ];
i.DomUtil.addClass(e, "leaflet-clickable"), i.DomEvent.on(e, "click", this._onMouseClick, this), i.DomEvent.on(e, "keypress", this._onKeyPress, this);
for (var n = 0; n < t.length; n++) i.DomEvent.on(e, t[n], this._fireMouseEvent, this);
i.Handler.MarkerDrag && (this.dragging = new i.Handler.MarkerDrag(this), this.options.draggable && this.dragging.enable());
}
},
_onMouseClick: function(e) {
var t = this.dragging && this.dragging.moved();
(this.hasEventListeners(e.type) || t) && i.DomEvent.stopPropagation(e), t || (this.dragging && this.dragging._enabled || !this._map.dragging || !this._map.dragging.moved()) && this.fire(e.type, {
originalEvent: e,
latlng: this._latlng
});
},
_onKeyPress: function(e) {
13 === e.keyCode && this.fire("click", {
originalEvent: e,
latlng: this._latlng
});
},
_fireMouseEvent: function(e) {
this.fire(e.type, {
originalEvent: e,
latlng: this._latlng
}), "contextmenu" === e.type && this.hasEventListeners(e.type) && i.DomEvent.preventDefault(e), "mousedown" !== e.type ? i.DomEvent.stopPropagation(e) : i.DomEvent.preventDefault(e);
},
setOpacity: function(e) {
return this.options.opacity = e, this._map && this._updateOpacity(), this;
},
_updateOpacity: function() {
i.DomUtil.setOpacity(this._icon, this.options.opacity), this._shadow && i.DomUtil.setOpacity(this._shadow, this.options.opacity);
},
_bringToFront: function() {
this._updateZIndex(this.options.riseOffset);
},
_resetZIndex: function() {
this._updateZIndex(0);
}
}), i.marker = function(e, t) {
return new i.Marker(e, t);
}, i.DivIcon = i.Icon.extend({
options: {
iconSize: [ 12, 12 ],
className: "leaflet-div-icon",
html: !1
},
createIcon: function(e) {
var n = e && "DIV" === e.tagName ? e : t.createElement("div"), r = this.options;
return n.innerHTML = r.html !== !1 ? r.html : "", r.bgPos && (n.style.backgroundPosition = -r.bgPos.x + "px " + -r.bgPos.y + "px"), this._setIconStyles(n, "icon"), n;
},
createShadow: function() {
return null;
}
}), i.divIcon = function(e) {
return new i.DivIcon(e);
}, i.Map.mergeOptions({
closePopupOnClick: !0
}), i.Popup = i.Class.extend({
includes: i.Mixin.Events,
options: {
minWidth: 50,
maxWidth: 300,
maxHeight: null,
autoPan: !0,
closeButton: !0,
offset: [ 0, 7 ],
autoPanPadding: [ 5, 5 ],
keepInView: !1,
className: "",
zoomAnimation: !0
},
initialize: function(e, t) {
i.setOptions(this, e), this._source = t, this._animated = i.Browser.any3d && this.options.zoomAnimation, this._isOpen = !1;
},
onAdd: function(e) {
this._map = e, this._container || this._initLayout(), this._updateContent();
var t = e.options.fadeAnimation;
t && i.DomUtil.setOpacity(this._container, 0), e._panes.popupPane.appendChild(this._container), e.on(this._getEvents(), this), this._update(), t && i.DomUtil.setOpacity(this._container, 1), this.fire("open"), e.fire("popupopen", {
popup: this
}), this._source && this._source.fire("popupopen", {
popup: this
});
},
addTo: function(e) {
return e.addLayer(this), this;
},
openOn: function(e) {
return e.openPopup(this), this;
},
onRemove: function(e) {
e._panes.popupPane.removeChild(this._container), i.Util.falseFn(this._container.offsetWidth), e.off(this._getEvents(), this), e.options.fadeAnimation && i.DomUtil.setOpacity(this._container, 0), this._map = null, this.fire("close"), e.fire("popupclose", {
popup: this
}), this._source && this._source.fire("popupclose", {
popup: this
});
},
setLatLng: function(e) {
return this._latlng = i.latLng(e), this._update(), this;
},
setContent: function(e) {
return this._content = e, this._update(), this;
},
_getEvents: function() {
var e = {
viewreset: this._updatePosition
};
return this._animated && (e.zoomanim = this._zoomAnimation), ("closeOnClick" in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (e.preclick = this._close), this.options.keepInView && (e.moveend = this._adjustPan), e;
},
_close: function() {
this._map && this._map.closePopup(this);
},
_initLayout: function() {
var e, t = "leaflet-popup", n = t + " " + this.options.className + " leaflet-zoom-" + (this._animated ? "animated" : "hide"), r = this._container = i.DomUtil.create("div", n);
this.options.closeButton && (e = this._closeButton = i.DomUtil.create("a", t + "-close-button", r), e.href = "#close", e.innerHTML = "&#215;", i.DomEvent.disableClickPropagation(e), i.DomEvent.on(e, "click", this._onCloseButtonClick, this));
var s = this._wrapper = i.DomUtil.create("div", t + "-content-wrapper", r);
i.DomEvent.disableClickPropagation(s), this._contentNode = i.DomUtil.create("div", t + "-content", s), i.DomEvent.on(this._contentNode, "mousewheel", i.DomEvent.stopPropagation), i.DomEvent.on(this._contentNode, "MozMousePixelScroll", i.DomEvent.stopPropagation), i.DomEvent.on(s, "contextmenu", i.DomEvent.stopPropagation), this._tipContainer = i.DomUtil.create("div", t + "-tip-container", r), this._tip = i.DomUtil.create("div", t + "-tip", this._tipContainer);
},
_update: function() {
this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan());
},
_updateContent: function() {
if (this._content) {
if ("string" == typeof this._content) this._contentNode.innerHTML = this._content; else {
for (; this._contentNode.hasChildNodes(); ) this._contentNode.removeChild(this._contentNode.firstChild);
this._contentNode.appendChild(this._content);
}
this.fire("contentupdate");
}
},
_updateLayout: function() {
var e = this._contentNode, t = e.style;
t.width = "", t.whiteSpace = "nowrap";
var n = e.offsetWidth;
n = Math.min(n, this.options.maxWidth), n = Math.max(n, this.options.minWidth), t.width = n + 1 + "px", t.whiteSpace = "", t.height = "";
var r = e.offsetHeight, s = this.options.maxHeight, o = "leaflet-popup-scrolled";
s && r > s ? (t.height = s + "px", i.DomUtil.addClass(e, o)) : i.DomUtil.removeClass(e, o), this._containerWidth = this._container.offsetWidth;
},
_updatePosition: function() {
if (this._map) {
var e = this._map.latLngToLayerPoint(this._latlng), t = this._animated, n = i.point(this.options.offset);
t && i.DomUtil.setPosition(this._container, e), this._containerBottom = -n.y - (t ? 0 : e.y), this._containerLeft = -Math.round(this._containerWidth / 2) + n.x + (t ? 0 : e.x), this._container.style.bottom = this._containerBottom + "px", this._container.style.left = this._containerLeft + "px";
}
},
_zoomAnimation: function(e) {
var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
i.DomUtil.setPosition(this._container, t);
},
_adjustPan: function() {
if (this.options.autoPan) {
var e = this._map, t = this._container.offsetHeight, n = this._containerWidth, r = new i.Point(this._containerLeft, -t - this._containerBottom);
this._animated && r._add(i.DomUtil.getPosition(this._container));
var s = e.layerPointToContainerPoint(r), o = i.point(this.options.autoPanPadding), u = e.getSize(), a = 0, f = 0;
s.x + n > u.x && (a = s.x + n - u.x + o.x), s.x - a < 0 && (a = s.x - o.x), s.y + t > u.y && (f = s.y + t - u.y + o.y), s.y - f < 0 && (f = s.y - o.y), (a || f) && e.fire("autopanstart").panBy([ a, f ]);
}
},
_onCloseButtonClick: function(e) {
this._close(), i.DomEvent.stop(e);
}
}), i.popup = function(e, t) {
return new i.Popup(e, t);
}, i.Map.include({
openPopup: function(e, t, n) {
if (this.closePopup(), !(e instanceof i.Popup)) {
var r = e;
e = (new i.Popup(n)).setLatLng(t).setContent(r);
}
return e._isOpen = !0, this._popup = e, this.addLayer(e);
},
closePopup: function(e) {
return e && e !== this._popup || (e = this._popup, this._popup = null), e && (this.removeLayer(e), e._isOpen = !1), this;
}
}), i.Marker.include({
openPopup: function() {
return this._popup && this._map && !this._map.hasLayer(this._popup) && (this._popup.setLatLng(this._latlng), this._map.openPopup(this._popup)), this;
},
closePopup: function() {
return this._popup && this._popup._close(), this;
},
togglePopup: function() {
return this._popup && (this._popup._isOpen ? this.closePopup() : this.openPopup()), this;
},
bindPopup: function(e, t) {
var n = i.point(this.options.icon.options.popupAnchor || [ 0, 0 ]);
return n = n.add(i.Popup.prototype.options.offset), t && t.offset && (n = n.add(t.offset)), t = i.extend({
offset: n
}, t), this._popup || this.on("click", this.togglePopup, this).on("remove", this.closePopup, this).on("move", this._movePopup, this), e instanceof i.Popup ? (i.setOptions(e, t), this._popup = e) : this._popup = (new i.Popup(t, this)).setContent(e), this;
},
setPopupContent: function(e) {
return this._popup && this._popup.setContent(e), this;
},
unbindPopup: function() {
return this._popup && (this._popup = null, this.off("click", this.togglePopup).off("remove", this.closePopup).off("move", this._movePopup)), this;
},
_movePopup: function(e) {
this._popup.setLatLng(e.latlng);
}
}), i.LayerGroup = i.Class.extend({
initialize: function(e) {
this._layers = {};
var t, n;
if (e) for (t = 0, n = e.length; n > t; t++) this.addLayer(e[t]);
},
addLayer: function(e) {
var t = this.getLayerId(e);
return this._layers[t] = e, this._map && this._map.addLayer(e), this;
},
removeLayer: function(e) {
var t = e in this._layers ? e : this.getLayerId(e);
return this._map && this._layers[t] && this._map.removeLayer(this._layers[t]), delete this._layers[t], this;
},
hasLayer: function(e) {
return e ? e in this._layers || this.getLayerId(e) in this._layers : !1;
},
clearLayers: function() {
return this.eachLayer(this.removeLayer, this), this;
},
invoke: function(e) {
var t, n, r = Array.prototype.slice.call(arguments, 1);
for (t in this._layers) n = this._layers[t], n[e] && n[e].apply(n, r);
return this;
},
onAdd: function(e) {
this._map = e, this.eachLayer(e.addLayer, e);
},
onRemove: function(e) {
this.eachLayer(e.removeLayer, e), this._map = null;
},
addTo: function(e) {
return e.addLayer(this), this;
},
eachLayer: function(e, t) {
for (var n in this._layers) e.call(t, this._layers[n]);
return this;
},
getLayer: function(e) {
return this._layers[e];
},
getLayers: function() {
var e = [];
for (var t in this._layers) e.push(this._layers[t]);
return e;
},
setZIndex: function(e) {
return this.invoke("setZIndex", e);
},
getLayerId: function(e) {
return i.stamp(e);
}
}), i.layerGroup = function(e) {
return new i.LayerGroup(e);
}, i.FeatureGroup = i.LayerGroup.extend({
includes: i.Mixin.Events,
statics: {
EVENTS: "click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"
},
addLayer: function(e) {
return this.hasLayer(e) ? this : (e.on(i.FeatureGroup.EVENTS, this._propagateEvent, this), i.LayerGroup.prototype.addLayer.call(this, e), this._popupContent && e.bindPopup && e.bindPopup(this._popupContent, this._popupOptions), this.fire("layeradd", {
layer: e
}));
},
removeLayer: function(e) {
return this.hasLayer(e) ? (e in this._layers && (e = this._layers[e]), e.off(i.FeatureGroup.EVENTS, this._propagateEvent, this), i.LayerGroup.prototype.removeLayer.call(this, e), this._popupContent && this.invoke("unbindPopup"), this.fire("layerremove", {
layer: e
})) : this;
},
bindPopup: function(e, t) {
return this._popupContent = e, this._popupOptions = t, this.invoke("bindPopup", e, t);
},
setStyle: function(e) {
return this.invoke("setStyle", e);
},
bringToFront: function() {
return this.invoke("bringToFront");
},
bringToBack: function() {
return this.invoke("bringToBack");
},
getBounds: function() {
var e = new i.LatLngBounds;
return this.eachLayer(function(t) {
e.extend(t instanceof i.Marker ? t.getLatLng() : t.getBounds());
}), e;
},
_propagateEvent: function(e) {
e.layer || (e.layer = e.target), e.target = this, this.fire(e.type, e);
}
}), i.featureGroup = function(e) {
return new i.FeatureGroup(e);
}, i.Path = i.Class.extend({
includes: [ i.Mixin.Events ],
statics: {
CLIP_PADDING: function() {
var t = i.Browser.mobile ? 1280 : 2e3, n = (t / Math.max(e.outerWidth, e.outerHeight) - 1) / 2;
return Math.max(0, Math.min(.5, n));
}()
},
options: {
stroke: !0,
color: "#0033ff",
dashArray: null,
weight: 5,
opacity: .5,
fill: !1,
fillColor: null,
fillOpacity: .2,
clickable: !0
},
initialize: function(e) {
i.setOptions(this, e);
},
onAdd: function(e) {
this._map = e, this._container || (this._initElements(), this._initEvents()), this.projectLatlngs(), this._updatePath(), this._container && this._map._pathRoot.appendChild(this._container), this.fire("add"), e.on({
viewreset: this.projectLatlngs,
moveend: this._updatePath
}, this);
},
addTo: function(e) {
return e.addLayer(this), this;
},
onRemove: function(e) {
e._pathRoot.removeChild(this._container), this.fire("remove"), this._map = null, i.Browser.vml && (this._container = null, this._stroke = null, this._fill = null), e.off({
viewreset: this.projectLatlngs,
moveend: this._updatePath
}, this);
},
projectLatlngs: function() {},
setStyle: function(e) {
return i.setOptions(this, e), this._container && this._updateStyle(), this;
},
redraw: function() {
return this._map && (this.projectLatlngs(), this._updatePath()), this;
}
}), i.Map.include({
_updatePathViewport: function() {
var e = i.Path.CLIP_PADDING, t = this.getSize(), n = i.DomUtil.getPosition(this._mapPane), r = n.multiplyBy(-1)._subtract(t.multiplyBy(e)._round()), s = r.add(t.multiplyBy(1 + 2 * e)._round());
this._pathViewport = new i.Bounds(r, s);
}
}), i.Path.SVG_NS = "http://www.w3.org/2000/svg", i.Browser.svg = !!t.createElementNS && !!t.createElementNS(i.Path.SVG_NS, "svg").createSVGRect, i.Path = i.Path.extend({
statics: {
SVG: i.Browser.svg
},
bringToFront: function() {
var e = this._map._pathRoot, t = this._container;
return t && e.lastChild !== t && e.appendChild(t), this;
},
bringToBack: function() {
var e = this._map._pathRoot, t = this._container, n = e.firstChild;
return t && n !== t && e.insertBefore(t, n), this;
},
getPathString: function() {},
_createElement: function(e) {
return t.createElementNS(i.Path.SVG_NS, e);
},
_initElements: function() {
this._map._initPathRoot(), this._initPath(), this._initStyle();
},
_initPath: function() {
this._container = this._createElement("g"), this._path = this._createElement("path"), this._container.appendChild(this._path);
},
_initStyle: function() {
this.options.stroke && (this._path.setAttribute("stroke-linejoin", "round"), this._path.setAttribute("stroke-linecap", "round")), this.options.fill && this._path.setAttribute("fill-rule", "evenodd"), this.options.pointerEvents && this._path.setAttribute("pointer-events", this.options.pointerEvents), this.options.clickable || this.options.pointerEvents || this._path.setAttribute("pointer-events", "none"), this._updateStyle();
},
_updateStyle: function() {
this.options.stroke ? (this._path.setAttribute("stroke", this.options.color), this._path.setAttribute("stroke-opacity", this.options.opacity), this._path.setAttribute("stroke-width", this.options.weight), this.options.dashArray ? this._path.setAttribute("stroke-dasharray", this.options.dashArray) : this._path.removeAttribute("stroke-dasharray")) : this._path.setAttribute("stroke", "none"), this.options.fill ? (this._path.setAttribute("fill", this.options.fillColor || this.options.color), this._path.setAttribute("fill-opacity", this.options.fillOpacity)) : this._path.setAttribute("fill", "none");
},
_updatePath: function() {
var e = this.getPathString();
e || (e = "M0 0"), this._path.setAttribute("d", e);
},
_initEvents: function() {
if (this.options.clickable) {
(i.Browser.svg || !i.Browser.vml) && this._path.setAttribute("class", "leaflet-clickable"), i.DomEvent.on(this._container, "click", this._onMouseClick, this);
for (var e = [ "dblclick", "mousedown", "mouseover", "mouseout", "mousemove", "contextmenu" ], t = 0; t < e.length; t++) i.DomEvent.on(this._container, e[t], this._fireMouseEvent, this);
}
},
_onMouseClick: function(e) {
this._map.dragging && this._map.dragging.moved() || this._fireMouseEvent(e);
},
_fireMouseEvent: function(e) {
if (this.hasEventListeners(e.type)) {
var t = this._map, n = t.mouseEventToContainerPoint(e), r = t.containerPointToLayerPoint(n), s = t.layerPointToLatLng(r);
this.fire(e.type, {
latlng: s,
layerPoint: r,
containerPoint: n,
originalEvent: e
}), "contextmenu" === e.type && i.DomEvent.preventDefault(e), "mousemove" !== e.type && i.DomEvent.stopPropagation(e);
}
}
}), i.Map.include({
_initPathRoot: function() {
this._pathRoot || (this._pathRoot = i.Path.prototype._createElement("svg"), this._panes.overlayPane.appendChild(this._pathRoot), this.options.zoomAnimation && i.Browser.any3d ? (this._pathRoot.setAttribute("class", " leaflet-zoom-animated"), this.on({
zoomanim: this._animatePathZoom,
zoomend: this._endPathZoom
})) : this._pathRoot.setAttribute("class", " leaflet-zoom-hide"), this.on("moveend", this._updateSvgViewport), this._updateSvgViewport());
},
_animatePathZoom: function(e) {
var t = this.getZoomScale(e.zoom), n = this._getCenterOffset(e.center)._multiplyBy(-t)._add(this._pathViewport.min);
this._pathRoot.style[i.DomUtil.TRANSFORM] = i.DomUtil.getTranslateString(n) + " scale(" + t + ") ", this._pathZooming = !0;
},
_endPathZoom: function() {
this._pathZooming = !1;
},
_updateSvgViewport: function() {
if (!this._pathZooming) {
this._updatePathViewport();
var e = this._pathViewport, t = e.min, n = e.max, r = n.x - t.x, s = n.y - t.y, o = this._pathRoot, u = this._panes.overlayPane;
i.Browser.mobileWebkit && u.removeChild(o), i.DomUtil.setPosition(o, t), o.setAttribute("width", r), o.setAttribute("height", s), o.setAttribute("viewBox", [ t.x, t.y, r, s ].join(" ")), i.Browser.mobileWebkit && u.appendChild(o);
}
}
}), i.Path.include({
bindPopup: function(e, t) {
return e instanceof i.Popup ? this._popup = e : ((!this._popup || t) && (this._popup = new i.Popup(t, this)), this._popup.setContent(e)), this._popupHandlersAdded || (this.on("click", this._openPopup, this).on("remove", this.closePopup, this), this._popupHandlersAdded = !0), this;
},
unbindPopup: function() {
return this._popup && (this._popup = null, this.off("click", this._openPopup).off("remove", this.closePopup), this._popupHandlersAdded = !1), this;
},
openPopup: function(e) {
return this._popup && (e = e || this._latlng || this._latlngs[Math.floor(this._latlngs.length / 2)], this._openPopup({
latlng: e
})), this;
},
closePopup: function() {
return this._popup && this._popup._close(), this;
},
_openPopup: function(e) {
this._popup.setLatLng(e.latlng), this._map.openPopup(this._popup);
}
}), i.Browser.vml = !i.Browser.svg && function() {
try {
var e = t.createElement("div");
e.innerHTML = '<v:shape adj="1"/>';
var n = e.firstChild;
return n.style.behavior = "url(#default#VML)", n && "object" == typeof n.adj;
} catch (r) {
return !1;
}
}(), i.Path = i.Browser.svg || !i.Browser.vml ? i.Path : i.Path.extend({
statics: {
VML: !0,
CLIP_PADDING: .02
},
_createElement: function() {
try {
return t.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(e) {
return t.createElement("<lvml:" + e + ' class="lvml">');
};
} catch (e) {
return function(e) {
return t.createElement("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
};
}
}(),
_initPath: function() {
var e = this._container = this._createElement("shape");
i.DomUtil.addClass(e, "leaflet-vml-shape"), this.options.clickable && i.DomUtil.addClass(e, "leaflet-clickable"), e.coordsize = "1 1", this._path = this._createElement("path"), e.appendChild(this._path), this._map._pathRoot.appendChild(e);
},
_initStyle: function() {
this._updateStyle();
},
_updateStyle: function() {
var e = this._stroke, t = this._fill, n = this.options, r = this._container;
r.stroked = n.stroke, r.filled = n.fill, n.stroke ? (e || (e = this._stroke = this._createElement("stroke"), e.endcap = "round", r.appendChild(e)), e.weight = n.weight + "px", e.color = n.color, e.opacity = n.opacity, e.dashStyle = n.dashArray ? n.dashArray instanceof Array ? n.dashArray.join(" ") : n.dashArray.replace(/( *, *)/g, " ") : "") : e && (r.removeChild(e), this._stroke = null), n.fill ? (t || (t = this._fill = this._createElement("fill"), r.appendChild(t)), t.color = n.fillColor || n.color, t.opacity = n.fillOpacity) : t && (r.removeChild(t), this._fill = null);
},
_updatePath: function() {
var e = this._container.style;
e.display = "none", this._path.v = this.getPathString() + " ", e.display = "";
}
}), i.Map.include(i.Browser.svg || !i.Browser.vml ? {} : {
_initPathRoot: function() {
if (!this._pathRoot) {
var e = this._pathRoot = t.createElement("div");
e.className = "leaflet-vml-container", this._panes.overlayPane.appendChild(e), this.on("moveend", this._updatePathViewport), this._updatePathViewport();
}
}
}), i.Browser.canvas = function() {
return !!t.createElement("canvas").getContext;
}(), i.Path = i.Path.SVG && !e.L_PREFER_CANVAS || !i.Browser.canvas ? i.Path : i.Path.extend({
statics: {
CANVAS: !0,
SVG: !1
},
redraw: function() {
return this._map && (this.projectLatlngs(), this._requestUpdate()), this;
},
setStyle: function(e) {
return i.setOptions(this, e), this._map && (this._updateStyle(), this._requestUpdate()), this;
},
onRemove: function(e) {
e.off("viewreset", this.projectLatlngs, this).off("moveend", this._updatePath, this), this.options.clickable && (this._map.off("click", this._onClick, this), this._map.off("mousemove", this._onMouseMove, this)), this._requestUpdate(), this._map = null;
},
_requestUpdate: function() {
this._map && !i.Path._updateRequest && (i.Path._updateRequest = i.Util.requestAnimFrame(this._fireMapMoveEnd, this._map));
},
_fireMapMoveEnd: function() {
i.Path._updateRequest = null, this.fire("moveend");
},
_initElements: function() {
this._map._initPathRoot(), this._ctx = this._map._canvasCtx;
},
_updateStyle: function() {
var e = this.options;
e.stroke && (this._ctx.lineWidth = e.weight, this._ctx.strokeStyle = e.color), e.fill && (this._ctx.fillStyle = e.fillColor || e.color);
},
_drawPath: function() {
var e, t, n, r, s, o;
for (this._ctx.beginPath(), e = 0, n = this._parts.length; n > e; e++) {
for (t = 0, r = this._parts[e].length; r > t; t++) s = this._parts[e][t], o = (0 === t ? "move" : "line") + "To", this._ctx[o](s.x, s.y);
this instanceof i.Polygon && this._ctx.closePath();
}
},
_checkIfEmpty: function() {
return !this._parts.length;
},
_updatePath: function() {
if (!this._checkIfEmpty()) {
var e = this._ctx, t = this.options;
this._drawPath(), e.save(), this._updateStyle(), t.fill && (e.globalAlpha = t.fillOpacity, e.fill()), t.stroke && (e.globalAlpha = t.opacity, e.stroke()), e.restore();
}
},
_initEvents: function() {
this.options.clickable && (this._map.on("mousemove", this._onMouseMove, this), this._map.on("click", this._onClick, this));
},
_onClick: function(e) {
this._containsPoint(e.layerPoint) && this.fire("click", e);
},
_onMouseMove: function(e) {
this._map && !this._map._animatingZoom && (this._containsPoint(e.layerPoint) ? (this._ctx.canvas.style.cursor = "pointer", this._mouseInside = !0, this.fire("mouseover", e)) : this._mouseInside && (this._ctx.canvas.style.cursor = "", this._mouseInside = !1, this.fire("mouseout", e)));
}
}), i.Map.include(i.Path.SVG && !e.L_PREFER_CANVAS || !i.Browser.canvas ? {} : {
_initPathRoot: function() {
var e, n = this._pathRoot;
n || (n = this._pathRoot = t.createElement("canvas"), n.style.position = "absolute", e = this._canvasCtx = n.getContext("2d"), e.lineCap = "round", e.lineJoin = "round", this._panes.overlayPane.appendChild(n), this.options.zoomAnimation && (this._pathRoot.className = "leaflet-zoom-animated", this.on("zoomanim", this._animatePathZoom), this.on("zoomend", this._endPathZoom)), this.on("moveend", this._updateCanvasViewport), this._updateCanvasViewport());
},
_updateCanvasViewport: function() {
if (!this._pathZooming) {
this._updatePathViewport();
var e = this._pathViewport, t = e.min, n = e.max.subtract(t), r = this._pathRoot;
i.DomUtil.setPosition(r, t), r.width = n.x, r.height = n.y, r.getContext("2d").translate(-t.x, -t.y);
}
}
}), i.LineUtil = {
simplify: function(e, t) {
if (!t || !e.length) return e.slice();
var n = t * t;
return e = this._reducePoints(e, n), e = this._simplifyDP(e, n);
},
pointToSegmentDistance: function(e, t, n) {
return Math.sqrt(this._sqClosestPointOnSegment(e, t, n, !0));
},
closestPointOnSegment: function(e, t, n) {
return this._sqClosestPointOnSegment(e, t, n);
},
_simplifyDP: function(e, t) {
var r = e.length, i = typeof Uint8Array != n + "" ? Uint8Array : Array, s = new i(r);
s[0] = s[r - 1] = 1, this._simplifyDPStep(e, s, t, 0, r - 1);
var o, u = [];
for (o = 0; r > o; o++) s[o] && u.push(e[o]);
return u;
},
_simplifyDPStep: function(e, t, n, r, i) {
var s, o, u, a = 0;
for (o = r + 1; i - 1 >= o; o++) u = this._sqClosestPointOnSegment(e[o], e[r], e[i], !0), u > a && (s = o, a = u);
a > n && (t[s] = 1, this._simplifyDPStep(e, t, n, r, s), this._simplifyDPStep(e, t, n, s, i));
},
_reducePoints: function(e, t) {
for (var n = [ e[0] ], r = 1, i = 0, s = e.length; s > r; r++) this._sqDist(e[r], e[i]) > t && (n.push(e[r]), i = r);
return s - 1 > i && n.push(e[s - 1]), n;
},
clipSegment: function(e, t, n, r) {
var i, s, o, u = r ? this._lastCode : this._getBitCode(e, n), a = this._getBitCode(t, n);
for (this._lastCode = a; ; ) {
if (!(u | a)) return [ e, t ];
if (u & a) return !1;
i = u || a, s = this._getEdgeIntersection(e, t, i, n), o = this._getBitCode(s, n), i === u ? (e = s, u = o) : (t = s, a = o);
}
},
_getEdgeIntersection: function(e, t, n, r) {
var s = t.x - e.x, o = t.y - e.y, u = r.min, a = r.max;
return 8 & n ? new i.Point(e.x + s * (a.y - e.y) / o, a.y) : 4 & n ? new i.Point(e.x + s * (u.y - e.y) / o, u.y) : 2 & n ? new i.Point(a.x, e.y + o * (a.x - e.x) / s) : 1 & n ? new i.Point(u.x, e.y + o * (u.x - e.x) / s) : void 0;
},
_getBitCode: function(e, t) {
var n = 0;
return e.x < t.min.x ? n |= 1 : e.x > t.max.x && (n |= 2), e.y < t.min.y ? n |= 4 : e.y > t.max.y && (n |= 8), n;
},
_sqDist: function(e, t) {
var n = t.x - e.x, r = t.y - e.y;
return n * n + r * r;
},
_sqClosestPointOnSegment: function(e, t, n, r) {
var s, o = t.x, u = t.y, a = n.x - o, f = n.y - u, l = a * a + f * f;
return l > 0 && (s = ((e.x - o) * a + (e.y - u) * f) / l, s > 1 ? (o = n.x, u = n.y) : s > 0 && (o += a * s, u += f * s)), a = e.x - o, f = e.y - u, r ? a * a + f * f : new i.Point(o, u);
}
}, i.Polyline = i.Path.extend({
initialize: function(e, t) {
i.Path.prototype.initialize.call(this, t), this._latlngs = this._convertLatLngs(e);
},
options: {
smoothFactor: 1,
noClip: !1
},
projectLatlngs: function() {
this._originalPoints = [];
for (var e = 0, t = this._latlngs.length; t > e; e++) this._originalPoints[e] = this._map.latLngToLayerPoint(this._latlngs[e]);
},
getPathString: function() {
for (var e = 0, t = this._parts.length, n = ""; t > e; e++) n += this._getPathPartStr(this._parts[e]);
return n;
},
getLatLngs: function() {
return this._latlngs;
},
setLatLngs: function(e) {
return this._latlngs = this._convertLatLngs(e), this.redraw();
},
addLatLng: function(e) {
return this._latlngs.push(i.latLng(e)), this.redraw();
},
spliceLatLngs: function() {
var e = [].splice.apply(this._latlngs, arguments);
return this._convertLatLngs(this._latlngs, !0), this.redraw(), e;
},
closestLayerPoint: function(e) {
for (var t, n, r = 1 / 0, s = this._parts, o = null, u = 0, a = s.length; a > u; u++) for (var f = s[u], l = 1, c = f.length; c > l; l++) {
t = f[l - 1], n = f[l];
var h = i.LineUtil._sqClosestPointOnSegment(e, t, n, !0);
r > h && (r = h, o = i.LineUtil._sqClosestPointOnSegment(e, t, n));
}
return o && (o.distance = Math.sqrt(r)), o;
},
getBounds: function() {
return new i.LatLngBounds(this.getLatLngs());
},
_convertLatLngs: function(e, t) {
var n, r, s = t ? e : [];
for (n = 0, r = e.length; r > n; n++) {
if (i.Util.isArray(e[n]) && "number" != typeof e[n][0]) return;
s[n] = i.latLng(e[n]);
}
return s;
},
_initEvents: function() {
i.Path.prototype._initEvents.call(this);
},
_getPathPartStr: function(e) {
for (var t, n = i.Path.VML, r = 0, s = e.length, o = ""; s > r; r++) t = e[r], n && t._round(), o += (r ? "L" : "M") + t.x + " " + t.y;
return o;
},
_clipPoints: function() {
var e, t, n, r = this._originalPoints, s = r.length;
if (this.options.noClip) return this._parts = [ r ], void 0;
this._parts = [];
var o = this._parts, u = this._map._pathViewport, a = i.LineUtil;
for (e = 0, t = 0; s - 1 > e; e++) n = a.clipSegment(r[e], r[e + 1], u, e), n && (o[t] = o[t] || [], o[t].push(n[0]), (n[1] !== r[e + 1] || e === s - 2) && (o[t].push(n[1]), t++));
},
_simplifyPoints: function() {
for (var e = this._parts, t = i.LineUtil, n = 0, r = e.length; r > n; n++) e[n] = t.simplify(e[n], this.options.smoothFactor);
},
_updatePath: function() {
this._map && (this._clipPoints(), this._simplifyPoints(), i.Path.prototype._updatePath.call(this));
}
}), i.polyline = function(e, t) {
return new i.Polyline(e, t);
}, i.PolyUtil = {}, i.PolyUtil.clipPolygon = function(e, t) {
var n, r, s, o, u, a, f, l, c, h = [ 1, 4, 2, 8 ], p = i.LineUtil;
for (r = 0, f = e.length; f > r; r++) e[r]._code = p._getBitCode(e[r], t);
for (o = 0; 4 > o; o++) {
for (l = h[o], n = [], r = 0, f = e.length, s = f - 1; f > r; s = r++) u = e[r], a = e[s], u._code & l ? a._code & l || (c = p._getEdgeIntersection(a, u, l, t), c._code = p._getBitCode(c, t), n.push(c)) : (a._code & l && (c = p._getEdgeIntersection(a, u, l, t), c._code = p._getBitCode(c, t), n.push(c)), n.push(u));
e = n;
}
return e;
}, i.Polygon = i.Polyline.extend({
options: {
fill: !0
},
initialize: function(e, t) {
var n, r, s;
if (i.Polyline.prototype.initialize.call(this, e, t), e && i.Util.isArray(e[0]) && "number" != typeof e[0][0]) for (this._latlngs = this._convertLatLngs(e[0]), this._holes = e.slice(1), n = 0, r = this._holes.length; r > n; n++) s = this._holes[n] = this._convertLatLngs(this._holes[n]), s[0].equals(s[s.length - 1]) && s.pop();
e = this._latlngs, e.length >= 2 && e[0].equals(e[e.length - 1]) && e.pop();
},
projectLatlngs: function() {
if (i.Polyline.prototype.projectLatlngs.call(this), this._holePoints = [], this._holes) {
var e, t, n, r;
for (e = 0, n = this._holes.length; n > e; e++) for (this._holePoints[e] = [], t = 0, r = this._holes[e].length; r > t; t++) this._holePoints[e][t] = this._map.latLngToLayerPoint(this._holes[e][t]);
}
},
_clipPoints: function() {
var e = this._originalPoints, t = [];
if (this._parts = [ e ].concat(this._holePoints), !this.options.noClip) {
for (var n = 0, r = this._parts.length; r > n; n++) {
var s = i.PolyUtil.clipPolygon(this._parts[n], this._map._pathViewport);
s.length && t.push(s);
}
this._parts = t;
}
},
_getPathPartStr: function(e) {
var t = i.Polyline.prototype._getPathPartStr.call(this, e);
return t + (i.Browser.svg ? "z" : "x");
}
}), i.polygon = function(e, t) {
return new i.Polygon(e, t);
}, function() {
function e(e) {
return i.FeatureGroup.extend({
initialize: function(e, t) {
this._layers = {}, this._options = t, this.setLatLngs(e);
},
setLatLngs: function(t) {
var n = 0, r = t.length;
for (this.eachLayer(function(e) {
r > n ? e.setLatLngs(t[n++]) : this.removeLayer(e);
}, this); r > n; ) this.addLayer(new e(t[n++], this._options));
return this;
},
getLatLngs: function() {
var e = [];
return this.eachLayer(function(t) {
e.push(t.getLatLngs());
}), e;
}
});
}
i.MultiPolyline = e(i.Polyline), i.MultiPolygon = e(i.Polygon), i.multiPolyline = function(e, t) {
return new i.MultiPolyline(e, t);
}, i.multiPolygon = function(e, t) {
return new i.MultiPolygon(e, t);
};
}(), i.Rectangle = i.Polygon.extend({
initialize: function(e, t) {
i.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(e), t);
},
setBounds: function(e) {
this.setLatLngs(this._boundsToLatLngs(e));
},
_boundsToLatLngs: function(e) {
return e = i.latLngBounds(e), [ e.getSouthWest(), e.getNorthWest(), e.getNorthEast(), e.getSouthEast() ];
}
}), i.rectangle = function(e, t) {
return new i.Rectangle(e, t);
}, i.Circle = i.Path.extend({
initialize: function(e, t, n) {
i.Path.prototype.initialize.call(this, n), this._latlng = i.latLng(e), this._mRadius = t;
},
options: {
fill: !0
},
setLatLng: function(e) {
return this._latlng = i.latLng(e), this.redraw();
},
setRadius: function(e) {
return this._mRadius = e, this.redraw();
},
projectLatlngs: function() {
var e = this._getLngRadius(), t = this._latlng, n = this._map.latLngToLayerPoint([ t.lat, t.lng - e ]);
this._point = this._map.latLngToLayerPoint(t), this._radius = Math.max(this._point.x - n.x, 1);
},
getBounds: function() {
var e = this._getLngRadius(), t = 360 * (this._mRadius / 40075017), n = this._latlng;
return new i.LatLngBounds([ n.lat - t, n.lng - e ], [ n.lat + t, n.lng + e ]);
},
getLatLng: function() {
return this._latlng;
},
getPathString: function() {
var e = this._point, t = this._radius;
return this._checkIfEmpty() ? "" : i.Browser.svg ? "M" + e.x + "," + (e.y - t) + "A" + t + "," + t + ",0,1,1," + (e.x - .1) + "," + (e.y - t) + " z" : (e._round(), t = Math.round(t), "AL " + e.x + "," + e.y + " " + t + "," + t + " 0," + 23592600);
},
getRadius: function() {
return this._mRadius;
},
_getLatRadius: function() {
return 360 * (this._mRadius / 40075017);
},
_getLngRadius: function() {
return this._getLatRadius() / Math.cos(i.LatLng.DEG_TO_RAD * this._latlng.lat);
},
_checkIfEmpty: function() {
if (!this._map) return !1;
var e = this._map._pathViewport, t = this._radius, n = this._point;
return n.x - t > e.max.x || n.y - t > e.max.y || n.x + t < e.min.x || n.y + t < e.min.y;
}
}), i.circle = function(e, t, n) {
return new i.Circle(e, t, n);
}, i.CircleMarker = i.Circle.extend({
options: {
radius: 10,
weight: 2
},
initialize: function(e, t) {
i.Circle.prototype.initialize.call(this, e, null, t), this._radius = this.options.radius;
},
projectLatlngs: function() {
this._point = this._map.latLngToLayerPoint(this._latlng);
},
_updateStyle: function() {
i.Circle.prototype._updateStyle.call(this), this.setRadius(this.options.radius);
},
setRadius: function(e) {
return this.options.radius = this._radius = e, this.redraw();
}
}), i.circleMarker = function(e, t) {
return new i.CircleMarker(e, t);
}, i.Polyline.include(i.Path.CANVAS ? {
_containsPoint: function(e, t) {
var n, r, s, o, u, a, f, l = this.options.weight / 2;
for (i.Browser.touch && (l += 10), n = 0, o = this._parts.length; o > n; n++) for (f = this._parts[n], r = 0, u = f.length, s = u - 1; u > r; s = r++) if ((t || 0 !== r) && (a = i.LineUtil.pointToSegmentDistance(e, f[s], f[r]), l >= a)) return !0;
return !1;
}
} : {}), i.Polygon.include(i.Path.CANVAS ? {
_containsPoint: function(e) {
var t, n, r, s, o, u, a, f, l = !1;
if (i.Polyline.prototype._containsPoint.call(this, e, !0)) return !0;
for (s = 0, a = this._parts.length; a > s; s++) for (t = this._parts[s], o = 0, f = t.length, u = f - 1; f > o; u = o++) n = t[o], r = t[u], n.y > e.y != r.y > e.y && e.x < (r.x - n.x) * (e.y - n.y) / (r.y - n.y) + n.x && (l = !l);
return l;
}
} : {}), i.Circle.include(i.Path.CANVAS ? {
_drawPath: function() {
var e = this._point;
this._ctx.beginPath(), this._ctx.arc(e.x, e.y, this._radius, 0, 2 * Math.PI, !1);
},
_containsPoint: function(e) {
var t = this._point, n = this.options.stroke ? this.options.weight / 2 : 0;
return e.distanceTo(t) <= this._radius + n;
}
} : {}), i.CircleMarker.include(i.Path.CANVAS ? {
_updateStyle: function() {
i.Path.prototype._updateStyle.call(this);
}
} : {}), i.GeoJSON = i.FeatureGroup.extend({
initialize: function(e, t) {
i.setOptions(this, t), this._layers = {}, e && this.addData(e);
},
addData: function(e) {
var t, n, r, s = i.Util.isArray(e) ? e : e.features;
if (s) {
for (t = 0, n = s.length; n > t; t++) r = s[t], (r.geometries || r.geometry || r.features || r.coordinates) && this.addData(s[t]);
return this;
}
var o = this.options;
if (!o.filter || o.filter(e)) {
var u = i.GeoJSON.geometryToLayer(e, o.pointToLayer, o.coordsToLatLng);
return u.feature = i.GeoJSON.asFeature(e), u.defaultOptions = u.options, this.resetStyle(u), o.onEachFeature && o.onEachFeature(e, u), this.addLayer(u);
}
},
resetStyle: function(e) {
var t = this.options.style;
t && (i.Util.extend(e.options, e.defaultOptions), this._setLayerStyle(e, t));
},
setStyle: function(e) {
this.eachLayer(function(t) {
this._setLayerStyle(t, e);
}, this);
},
_setLayerStyle: function(e, t) {
"function" == typeof t && (t = t(e.feature)), e.setStyle && e.setStyle(t);
}
}), i.extend(i.GeoJSON, {
geometryToLayer: function(e, t, n) {
var r, s, o, u, a, f = "Feature" === e.type ? e.geometry : e, l = f.coordinates, c = [];
switch (n = n || this.coordsToLatLng, f.type) {
case "Point":
return r = n(l), t ? t(e, r) : new i.Marker(r);
case "MultiPoint":
for (o = 0, u = l.length; u > o; o++) r = n(l[o]), a = t ? t(e, r) : new i.Marker(r), c.push(a);
return new i.FeatureGroup(c);
case "LineString":
return s = this.coordsToLatLngs(l, 0, n), new i.Polyline(s);
case "Polygon":
return s = this.coordsToLatLngs(l, 1, n), new i.Polygon(s);
case "MultiLineString":
return s = this.coordsToLatLngs(l, 1, n), new i.MultiPolyline(s);
case "MultiPolygon":
return s = this.coordsToLatLngs(l, 2, n), new i.MultiPolygon(s);
case "GeometryCollection":
for (o = 0, u = f.geometries.length; u > o; o++) a = this.geometryToLayer({
geometry: f.geometries[o],
type: "Feature",
properties: e.properties
}, t, n), c.push(a);
return new i.FeatureGroup(c);
default:
throw new Error("Invalid GeoJSON object.");
}
},
coordsToLatLng: function(e) {
return new i.LatLng(e[1], e[0]);
},
coordsToLatLngs: function(e, t, n) {
var r, i, s, o = [];
for (i = 0, s = e.length; s > i; i++) r = t ? this.coordsToLatLngs(e[i], t - 1, n) : (n || this.coordsToLatLng)(e[i]), o.push(r);
return o;
},
latLngToCoords: function(e) {
return [ e.lng, e.lat ];
},
latLngsToCoords: function(e) {
for (var t = [], n = 0, r = e.length; r > n; n++) t.push(i.GeoJSON.latLngToCoords(e[n]));
return t;
},
getFeature: function(e, t) {
return e.feature ? i.extend({}, e.feature, {
geometry: t
}) : i.GeoJSON.asFeature(t);
},
asFeature: function(e) {
return "Feature" === e.type ? e : {
type: "Feature",
properties: {},
geometry: e
};
}
});
var o = {
toGeoJSON: function() {
return i.GeoJSON.getFeature(this, {
type: "Point",
coordinates: i.GeoJSON.latLngToCoords(this.getLatLng())
});
}
};
i.Marker.include(o), i.Circle.include(o), i.CircleMarker.include(o), i.Polyline.include({
toGeoJSON: function() {
return i.GeoJSON.getFeature(this, {
type: "LineString",
coordinates: i.GeoJSON.latLngsToCoords(this.getLatLngs())
});
}
}), i.Polygon.include({
toGeoJSON: function() {
var e, t, n, r = [ i.GeoJSON.latLngsToCoords(this.getLatLngs()) ];
if (r[0].push(r[0][0]), this._holes) for (e = 0, t = this._holes.length; t > e; e++) n = i.GeoJSON.latLngsToCoords(this._holes[e]), n.push(n[0]), r.push(n);
return i.GeoJSON.getFeature(this, {
type: "Polygon",
coordinates: r
});
}
}), function() {
function e(e, t) {
e.include({
toGeoJSON: function() {
var e = [];
return this.eachLayer(function(t) {
e.push(t.toGeoJSON().geometry.coordinates);
}), i.GeoJSON.getFeature(this, {
type: t,
coordinates: e
});
}
});
}
e(i.MultiPolyline, "MultiLineString"), e(i.MultiPolygon, "MultiPolygon");
}(), i.LayerGroup.include({
toGeoJSON: function() {
var e = [];
return this.eachLayer(function(t) {
t.toGeoJSON && e.push(i.GeoJSON.asFeature(t.toGeoJSON()));
}), {
type: "FeatureCollection",
features: e
};
}
}), i.geoJson = function(e, t) {
return new i.GeoJSON(e, t);
}, i.DomEvent = {
addListener: function(e, t, n, r) {
var s, o, u, a = i.stamp(n), f = "_leaflet_" + t + a;
return e[f] ? this : (s = function(t) {
return n.call(r || e, t || i.DomEvent._getEvent());
}, i.Browser.msTouch && 0 === t.indexOf("touch") ? this.addMsTouchListener(e, t, s, a) : (i.Browser.touch && "dblclick" === t && this.addDoubleTapListener && this.addDoubleTapListener(e, s, a), "addEventListener" in e ? "mousewheel" === t ? (e.addEventListener("DOMMouseScroll", s, !1), e.addEventListener(t, s, !1)) : "mouseenter" === t || "mouseleave" === t ? (o = s, u = "mouseenter" === t ? "mouseover" : "mouseout", s = function(t) {
return i.DomEvent._checkMouse(e, t) ? o(t) : void 0;
}, e.addEventListener(u, s, !1)) : "click" === t && i.Browser.android ? (o = s, s = function(e) {
return i.DomEvent._filterClick(e, o);
}, e.addEventListener(t, s, !1)) : e.addEventListener(t, s, !1) : "attachEvent" in e && e.attachEvent("on" + t, s), e[f] = s, this));
},
removeListener: function(e, t, n) {
var r = i.stamp(n), s = "_leaflet_" + t + r, o = e[s];
return o ? (i.Browser.msTouch && 0 === t.indexOf("touch") ? this.removeMsTouchListener(e, t, r) : i.Browser.touch && "dblclick" === t && this.removeDoubleTapListener ? this.removeDoubleTapListener(e, r) : "removeEventListener" in e ? "mousewheel" === t ? (e.removeEventListener("DOMMouseScroll", o, !1), e.removeEventListener(t, o, !1)) : "mouseenter" === t || "mouseleave" === t ? e.removeEventListener("mouseenter" === t ? "mouseover" : "mouseout", o, !1) : e.removeEventListener(t, o, !1) : "detachEvent" in e && e.detachEvent("on" + t, o), e[s] = null, this) : this;
},
stopPropagation: function(e) {
return e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0, this;
},
disableClickPropagation: function(e) {
for (var t = i.DomEvent.stopPropagation, n = i.Draggable.START.length - 1; n >= 0; n--) i.DomEvent.addListener(e, i.Draggable.START[n], t);
return i.DomEvent.addListener(e, "click", i.DomEvent._fakeStop).addListener(e, "dblclick", t);
},
preventDefault: function(e) {
return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this;
},
stop: function(e) {
return i.DomEvent.preventDefault(e).stopPropagation(e);
},
getMousePosition: function(e, n) {
var r = i.Browser.ie7, s = t.body, o = t.documentElement, u = e.pageX ? e.pageX - s.scrollLeft - o.scrollLeft : e.clientX, a = e.pageY ? e.pageY - s.scrollTop - o.scrollTop : e.clientY, f = new i.Point(u, a), l = n.getBoundingClientRect(), c = l.left - n.clientLeft, h = l.top - n.clientTop;
return i.DomUtil.documentIsLtr() || !i.Browser.webkit && !r || (c += n.scrollWidth - n.clientWidth, r && "hidden" !== i.DomUtil.getStyle(n, "overflow-y") && "hidden" !== i.DomUtil.getStyle(n, "overflow") && (c += 17)), f._subtract(new i.Point(c, h));
},
getWheelDelta: function(e) {
var t = 0;
return e.wheelDelta && (t = e.wheelDelta / 120), e.detail && (t = -e.detail / 3), t;
},
_skipEvents: {},
_fakeStop: function(e) {
i.DomEvent._skipEvents[e.type] = !0;
},
_skipped: function(e) {
var t = this._skipEvents[e.type];
return this._skipEvents[e.type] = !1, t;
},
_checkMouse: function(e, t) {
var n = t.relatedTarget;
if (!n) return !0;
try {
for (; n && n !== e; ) n = n.parentNode;
} catch (r) {
return !1;
}
return n !== e;
},
_getEvent: function() {
var t = e.event;
if (!t) for (var n = arguments.callee.caller; n && (t = n.arguments[0], !t || e.Event !== t.constructor); ) n = n.caller;
return t;
},
_filterClick: function(e, t) {
var n = e.timeStamp || e.originalEvent.timeStamp, r = i.DomEvent._lastClick && n - i.DomEvent._lastClick;
return r && r > 100 && 1e3 > r || e.target._simulatedClick && !e._simulated ? (i.DomEvent.stop(e), void 0) : (i.DomEvent._lastClick = n, t(e));
}
}, i.DomEvent.on = i.DomEvent.addListener, i.DomEvent.off = i.DomEvent.removeListener, i.Draggable = i.Class.extend({
includes: i.Mixin.Events,
statics: {
START: i.Browser.touch ? [ "touchstart", "mousedown" ] : [ "mousedown" ],
END: {
mousedown: "mouseup",
touchstart: "touchend",
MSPointerDown: "touchend"
},
MOVE: {
mousedown: "mousemove",
touchstart: "touchmove",
MSPointerDown: "touchmove"
}
},
initialize: function(e, t) {
this._element = e, this._dragStartTarget = t || e;
},
enable: function() {
if (!this._enabled) {
for (var e = i.Draggable.START.length - 1; e >= 0; e--) i.DomEvent.on(this._dragStartTarget, i.Draggable.START[e], this._onDown, this);
this._enabled = !0;
}
},
disable: function() {
if (this._enabled) {
for (var e = i.Draggable.START.length - 1; e >= 0; e--) i.DomEvent.off(this._dragStartTarget, i.Draggable.START[e], this._onDown, this);
this._enabled = !1, this._moved = !1;
}
},
_onDown: function(e) {
if (!e.shiftKey && (1 === e.which || 1 === e.button || e.touches) && (i.DomEvent.stopPropagation(e), !i.Draggable._disabled)) {
i.DomUtil.disableImageDrag(), i.DomUtil.disableTextSelection();
var n = e.touches ? e.touches[0] : e, r = n.target;
i.Browser.touch && "a" === r.tagName.toLowerCase() && i.DomUtil.addClass(r, "leaflet-active"), this._moved = !1, this._moving || (this._startPoint = new i.Point(n.clientX, n.clientY), this._startPos = this._newPos = i.DomUtil.getPosition(this._element), i.DomEvent.on(t, i.Draggable.MOVE[e.type], this._onMove, this).on(t, i.Draggable.END[e.type], this._onUp, this));
}
},
_onMove: function(e) {
if (!(e.touches && e.touches.length > 1)) {
var n = e.touches && 1 === e.touches.length ? e.touches[0] : e, r = new i.Point(n.clientX, n.clientY), s = r.subtract(this._startPoint);
(s.x || s.y) && (i.DomEvent.preventDefault(e), this._moved || (this.fire("dragstart"), this._moved = !0, this._startPos = i.DomUtil.getPosition(this._element).subtract(s), i.Browser.touch || i.DomUtil.addClass(t.body, "leaflet-dragging")), this._newPos = this._startPos.add(s), this._moving = !0, i.Util.cancelAnimFrame(this._animRequest), this._animRequest = i.Util.requestAnimFrame(this._updatePosition, this, !0, this._dragStartTarget));
}
},
_updatePosition: function() {
this.fire("predrag"), i.DomUtil.setPosition(this._element, this._newPos), this.fire("drag");
},
_onUp: function() {
i.Browser.touch || i.DomUtil.removeClass(t.body, "leaflet-dragging");
for (var e in i.Draggable.MOVE) i.DomEvent.off(t, i.Draggable.MOVE[e], this._onMove).off(t, i.Draggable.END[e], this._onUp);
i.DomUtil.enableImageDrag(), i.DomUtil.enableTextSelection(), this._moved && (i.Util.cancelAnimFrame(this._animRequest), this.fire("dragend")), this._moving = !1;
}
}), i.Handler = i.Class.extend({
initialize: function(e) {
this._map = e;
},
enable: function() {
this._enabled || (this._enabled = !0, this.addHooks());
},
disable: function() {
this._enabled && (this._enabled = !1, this.removeHooks());
},
enabled: function() {
return !!this._enabled;
}
}), i.Map.mergeOptions({
dragging: !0,
inertia: !i.Browser.android23,
inertiaDeceleration: 3400,
inertiaMaxSpeed: 1 / 0,
inertiaThreshold: i.Browser.touch ? 32 : 18,
easeLinearity: .25,
worldCopyJump: !1
}), i.Map.Drag = i.Handler.extend({
addHooks: function() {
if (!this._draggable) {
var e = this._map;
this._draggable = new i.Draggable(e._mapPane, e._container), this._draggable.on({
dragstart: this._onDragStart,
drag: this._onDrag,
dragend: this._onDragEnd
}, this), e.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDrag, this), e.on("viewreset", this._onViewReset, this), this._onViewReset());
}
this._draggable.enable();
},
removeHooks: function() {
this._draggable.disable();
},
moved: function() {
return this._draggable && this._draggable._moved;
},
_onDragStart: function() {
var e = this._map;
e._panAnim && e._panAnim.stop(), e.fire("movestart").fire("dragstart"), e.options.inertia && (this._positions = [], this._times = []);
},
_onDrag: function() {
if (this._map.options.inertia) {
var e = this._lastTime = +(new Date), t = this._lastPos = this._draggable._newPos;
this._positions.push(t), this._times.push(e), e - this._times[0] > 200 && (this._positions.shift(), this._times.shift());
}
this._map.fire("move").fire("drag");
},
_onViewReset: function() {
var e = this._map.getSize()._divideBy(2), t = this._map.latLngToLayerPoint([ 0, 0 ]);
this._initialWorldOffset = t.subtract(e).x, this._worldWidth = this._map.project([ 0, 180 ]).x;
},
_onPreDrag: function() {
var e = this._worldWidth, t = Math.round(e / 2), n = this._initialWorldOffset, r = this._draggable._newPos.x, i = (r - t + n) % e + t - n, s = (r + t + n) % e - t - n, o = Math.abs(i + n) < Math.abs(s + n) ? i : s;
this._draggable._newPos.x = o;
},
_onDragEnd: function() {
var e = this._map, t = e.options, n = +(new Date) - this._lastTime, r = !t.inertia || n > t.inertiaThreshold || !this._positions[0];
if (e.fire("dragend"), r) e.fire("moveend"); else {
var s = this._lastPos.subtract(this._positions[0]), o = (this._lastTime + n - this._times[0]) / 1e3, u = t.easeLinearity, a = s.multiplyBy(u / o), f = a.distanceTo([ 0, 0 ]), l = Math.min(t.inertiaMaxSpeed, f), c = a.multiplyBy(l / f), h = l / (t.inertiaDeceleration * u), p = c.multiplyBy(-h / 2).round();
p.x && p.y ? i.Util.requestAnimFrame(function() {
e.panBy(p, {
duration: h,
easeLinearity: u,
noMoveStart: !0
});
}) : e.fire("moveend");
}
}
}), i.Map.addInitHook("addHandler", "dragging", i.Map.Drag), i.Map.mergeOptions({
doubleClickZoom: !0
}), i.Map.DoubleClickZoom = i.Handler.extend({
addHooks: function() {
this._map.on("dblclick", this._onDoubleClick);
},
removeHooks: function() {
this._map.off("dblclick", this._onDoubleClick);
},
_onDoubleClick: function(e) {
this.setZoomAround(e.containerPoint, this._zoom + 1);
}
}), i.Map.addInitHook("addHandler", "doubleClickZoom", i.Map.DoubleClickZoom), i.Map.mergeOptions({
scrollWheelZoom: !0
}), i.Map.ScrollWheelZoom = i.Handler.extend({
addHooks: function() {
i.DomEvent.on(this._map._container, "mousewheel", this._onWheelScroll, this), i.DomEvent.on(this._map._container, "MozMousePixelScroll", i.DomEvent.preventDefault), this._delta = 0;
},
removeHooks: function() {
i.DomEvent.off(this._map._container, "mousewheel", this._onWheelScroll), i.DomEvent.off(this._map._container, "MozMousePixelScroll", i.DomEvent.preventDefault);
},
_onWheelScroll: function(e) {
var t = i.DomEvent.getWheelDelta(e);
this._delta += t, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime || (this._startTime = +(new Date));
var n = Math.max(40 - (+(new Date) - this._startTime), 0);
clearTimeout(this._timer), this._timer = setTimeout(i.bind(this._performZoom, this), n), i.DomEvent.preventDefault(e), i.DomEvent.stopPropagation(e);
},
_performZoom: function() {
var e = this._map, t = this._delta, n = e.getZoom();
t = t > 0 ? Math.ceil(t) : Math.floor(t), t = Math.max(Math.min(t, 4), -4), t = e._limitZoom(n + t) - n, this._delta = 0, this._startTime = null, t && e.setZoomAround(this._lastMousePos, n + t);
}
}), i.Map.addInitHook("addHandler", "scrollWheelZoom", i.Map.ScrollWheelZoom), i.extend(i.DomEvent, {
_touchstart: i.Browser.msTouch ? "MSPointerDown" : "touchstart",
_touchend: i.Browser.msTouch ? "MSPointerUp" : "touchend",
addDoubleTapListener: function(e, n, r) {
function s(e) {
var t;
if (i.Browser.msTouch ? (d.push(e.pointerId), t = d.length) : t = e.touches.length, !(t > 1)) {
var n = Date.now(), r = n - (u || n);
a = e.touches ? e.touches[0] : e, f = r > 0 && l >= r, u = n;
}
}
function o(e) {
if (i.Browser.msTouch) {
var t = d.indexOf(e.pointerId);
if (-1 === t) return;
d.splice(t, 1);
}
if (f) {
if (i.Browser.msTouch) {
var r, s = {};
for (var o in a) r = a[o], s[o] = "function" == typeof r ? r.bind(a) : r;
a = s;
}
a.type = "dblclick", n(a), u = null;
}
}
var u, a, f = !1, l = 250, c = "_leaflet_", h = this._touchstart, p = this._touchend, d = [];
e[c + h + r] = s, e[c + p + r] = o;
var v = i.Browser.msTouch ? t.documentElement : e;
return e.addEventListener(h, s, !1), v.addEventListener(p, o, !1), i.Browser.msTouch && v.addEventListener("MSPointerCancel", o, !1), this;
},
removeDoubleTapListener: function(e, n) {
var r = "_leaflet_";
return e.removeEventListener(this._touchstart, e[r + this._touchstart + n], !1), (i.Browser.msTouch ? t.documentElement : e).removeEventListener(this._touchend, e[r + this._touchend + n], !1), i.Browser.msTouch && t.documentElement.removeEventListener("MSPointerCancel", e[r + this._touchend + n], !1), this;
}
}), i.extend(i.DomEvent, {
_msTouches: [],
_msDocumentListener: !1,
addMsTouchListener: function(e, t, n, r) {
switch (t) {
case "touchstart":
return this.addMsTouchListenerStart(e, t, n, r);
case "touchend":
return this.addMsTouchListenerEnd(e, t, n, r);
case "touchmove":
return this.addMsTouchListenerMove(e, t, n, r);
default:
throw "Unknown touch event type";
}
},
addMsTouchListenerStart: function(e, n, r, i) {
var s = "_leaflet_", o = this._msTouches, u = function(e) {
for (var t = !1, n = 0; n < o.length; n++) if (o[n].pointerId === e.pointerId) {
t = !0;
break;
}
t || o.push(e), e.touches = o.slice(), e.changedTouches = [ e ], r(e);
};
if (e[s + "touchstart" + i] = u, e.addEventListener("MSPointerDown", u, !1), !this._msDocumentListener) {
var a = function(e) {
for (var t = 0; t < o.length; t++) if (o[t].pointerId === e.pointerId) {
o.splice(t, 1);
break;
}
};
t.documentElement.addEventListener("MSPointerUp", a, !1), t.documentElement.addEventListener("MSPointerCancel", a, !1), this._msDocumentListener = !0;
}
return this;
},
addMsTouchListenerMove: function(e, t, n, r) {
function i(e) {
if (e.pointerType !== e.MSPOINTER_TYPE_MOUSE || 0 !== e.buttons) {
for (var t = 0; t < o.length; t++) if (o[t].pointerId === e.pointerId) {
o[t] = e;
break;
}
e.touches = o.slice(), e.changedTouches = [ e ], n(e);
}
}
var s = "_leaflet_", o = this._msTouches;
return e[s + "touchmove" + r] = i, e.addEventListener("MSPointerMove", i, !1), this;
},
addMsTouchListenerEnd: function(e, t, n, r) {
var i = "_leaflet_", s = this._msTouches, o = function(e) {
for (var t = 0; t < s.length; t++) if (s[t].pointerId === e.pointerId) {
s.splice(t, 1);
break;
}
e.touches = s.slice(), e.changedTouches = [ e ], n(e);
};
return e[i + "touchend" + r] = o, e.addEventListener("MSPointerUp", o, !1), e.addEventListener("MSPointerCancel", o, !1), this;
},
removeMsTouchListener: function(e, t, n) {
var r = "_leaflet_", i = e[r + t + n];
switch (t) {
case "touchstart":
e.removeEventListener("MSPointerDown", i, !1);
break;
case "touchmove":
e.removeEventListener("MSPointerMove", i, !1);
break;
case "touchend":
e.removeEventListener("MSPointerUp", i, !1), e.removeEventListener("MSPointerCancel", i, !1);
}
return this;
}
}), i.Map.mergeOptions({
touchZoom: i.Browser.touch && !i.Browser.android23
}), i.Map.TouchZoom = i.Handler.extend({
addHooks: function() {
i.DomEvent.on(this._map._container, "touchstart", this._onTouchStart, this);
},
removeHooks: function() {
i.DomEvent.off(this._map._container, "touchstart", this._onTouchStart, this);
},
_onTouchStart: function(e) {
var n = this._map;
if (e.touches && 2 === e.touches.length && !n._animatingZoom && !this._zooming) {
var r = n.mouseEventToLayerPoint(e.touches[0]), s = n.mouseEventToLayerPoint(e.touches[1]), o = n._getCenterLayerPoint();
this._startCenter = r.add(s)._divideBy(2), this._startDist = r.distanceTo(s), this._moved = !1, this._zooming = !0, this._centerOffset = o.subtract(this._startCenter), n._panAnim && n._panAnim.stop(), i.DomEvent.on(t, "touchmove", this._onTouchMove, this).on(t, "touchend", this._onTouchEnd, this), i.DomEvent.preventDefault(e);
}
},
_onTouchMove: function(e) {
var t = this._map;
if (e.touches && 2 === e.touches.length && this._zooming) {
var n = t.mouseEventToLayerPoint(e.touches[0]), r = t.mouseEventToLayerPoint(e.touches[1]);
this._scale = n.distanceTo(r) / this._startDist, this._delta = n._add(r)._divideBy(2)._subtract(this._startCenter), 1 !== this._scale && (this._moved || (i.DomUtil.addClass(t._mapPane, "leaflet-touching"), t.fire("movestart").fire("zoomstart"), this._moved = !0), i.Util.cancelAnimFrame(this._animRequest), this._animRequest = i.Util.requestAnimFrame(this._updateOnMove, this, !0, this._map._container), i.DomEvent.preventDefault(e));
}
},
_updateOnMove: function() {
var e = this._map, t = this._getScaleOrigin(), n = e.layerPointToLatLng(t), r = e.getScaleZoom(this._scale);
e._animateZoom(n, r, this._startCenter, this._scale, this._delta);
},
_onTouchEnd: function() {
if (!this._moved || !this._zooming) return this._zooming = !1, void 0;
var e = this._map;
this._zooming = !1, i.DomUtil.removeClass(e._mapPane, "leaflet-touching"), i.Util.cancelAnimFrame(this._animRequest), i.DomEvent.off(t, "touchmove", this._onTouchMove).off(t, "touchend", this._onTouchEnd);
var n = this._getScaleOrigin(), r = e.layerPointToLatLng(n), s = e.getZoom(), o = e.getScaleZoom(this._scale) - s, u = o > 0 ? Math.ceil(o) : Math.floor(o), a = e._limitZoom(s + u), f = e.getZoomScale(a) / this._scale;
e._animateZoom(r, a, n, f);
},
_getScaleOrigin: function() {
var e = this._centerOffset.subtract(this._delta).divideBy(this._scale);
return this._startCenter.add(e);
}
}), i.Map.addInitHook("addHandler", "touchZoom", i.Map.TouchZoom), i.Map.mergeOptions({
tap: !0,
tapTolerance: 15
}), i.Map.Tap = i.Handler.extend({
addHooks: function() {
i.DomEvent.on(this._map._container, "touchstart", this._onDown, this);
},
removeHooks: function() {
i.DomEvent.off(this._map._container, "touchstart", this._onDown, this);
},
_onDown: function(e) {
if (e.touches) {
if (i.DomEvent.preventDefault(e), this._fireClick = !0, e.touches.length > 1) return this._fireClick = !1, clearTimeout(this._holdTimeout), void 0;
var n = e.touches[0], r = n.target;
this._startPos = this._newPos = new i.Point(n.clientX, n.clientY), "a" === r.tagName.toLowerCase() && i.DomUtil.addClass(r, "leaflet-active"), this._holdTimeout = setTimeout(i.bind(function() {
this._isTapValid() && (this._fireClick = !1, this._onUp(), this._simulateEvent("contextmenu", n));
}, this), 1e3), i.DomEvent.on(t, "touchmove", this._onMove, this).on(t, "touchend", this._onUp, this);
}
},
_onUp: function(e) {
if (clearTimeout(this._holdTimeout), i.DomEvent.off(t, "touchmove", this._onMove, this).off(t, "touchend", this._onUp, this), this._fireClick && e && e.changedTouches) {
var n = e.changedTouches[0], r = n.target;
"a" === r.tagName.toLowerCase() && i.DomUtil.removeClass(r, "leaflet-active"), this._isTapValid() && this._simulateEvent("click", n);
}
},
_isTapValid: function() {
return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
},
_onMove: function(e) {
var t = e.touches[0];
this._newPos = new i.Point(t.clientX, t.clientY);
},
_simulateEvent: function(n, r) {
var i = t.createEvent("MouseEvents");
i._simulated = !0, r.target._simulatedClick = !0, i.initMouseEvent(n, !0, !0, e, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null), r.target.dispatchEvent(i);
}
}), i.Browser.touch && !i.Browser.msTouch && i.Map.addInitHook("addHandler", "tap", i.Map.Tap), i.Map.mergeOptions({
boxZoom: !0
}), i.Map.BoxZoom = i.Handler.extend({
initialize: function(e) {
this._map = e, this._container = e._container, this._pane = e._panes.overlayPane;
},
addHooks: function() {
i.DomEvent.on(this._container, "mousedown", this._onMouseDown, this);
},
removeHooks: function() {
i.DomEvent.off(this._container, "mousedown", this._onMouseDown);
},
_onMouseDown: function(e) {
return !e.shiftKey || 1 !== e.which && 1 !== e.button ? !1 : (i.DomUtil.disableTextSelection(), i.DomUtil.disableImageDrag(), this._startLayerPoint = this._map.mouseEventToLayerPoint(e), this._box = i.DomUtil.create("div", "leaflet-zoom-box", this._pane), i.DomUtil.setPosition(this._box, this._startLayerPoint), this._container.style.cursor = "crosshair", i.DomEvent.on(t, "mousemove", this._onMouseMove, this).on(t, "mouseup", this._onMouseUp, this).on(t, "keydown", this._onKeyDown, this), this._map.fire("boxzoomstart"), void 0);
},
_onMouseMove: function(e) {
var t = this._startLayerPoint, n = this._box, r = this._map.mouseEventToLayerPoint(e), s = r.subtract(t), o = new i.Point(Math.min(r.x, t.x), Math.min(r.y, t.y));
i.DomUtil.setPosition(n, o), n.style.width = Math.max(0, Math.abs(s.x) - 4) + "px", n.style.height = Math.max(0, Math.abs(s.y) - 4) + "px";
},
_finish: function() {
this._pane.removeChild(this._box), this._container.style.cursor = "", i.DomUtil.enableTextSelection(), i.DomUtil.enableImageDrag(), i.DomEvent.off(t, "mousemove", this._onMouseMove).off(t, "mouseup", this._onMouseUp).off(t, "keydown", this._onKeyDown);
},
_onMouseUp: function(e) {
this._finish();
var t = this._map, n = t.mouseEventToLayerPoint(e);
if (!this._startLayerPoint.equals(n)) {
var r = new i.LatLngBounds(t.layerPointToLatLng(this._startLayerPoint), t.layerPointToLatLng(n));
t.fitBounds(r), t.fire("boxzoomend", {
boxZoomBounds: r
});
}
},
_onKeyDown: function(e) {
27 === e.keyCode && this._finish();
}
}), i.Map.addInitHook("addHandler", "boxZoom", i.Map.BoxZoom), i.Map.mergeOptions({
keyboard: !0,
keyboardPanOffset: 80,
keyboardZoomOffset: 1
}), i.Map.Keyboard = i.Handler.extend({
keyCodes: {
left: [ 37 ],
right: [ 39 ],
down: [ 40 ],
up: [ 38 ],
zoomIn: [ 187, 107, 61 ],
zoomOut: [ 189, 109, 173 ]
},
initialize: function(e) {
this._map = e, this._setPanOffset(e.options.keyboardPanOffset), this._setZoomOffset(e.options.keyboardZoomOffset);
},
addHooks: function() {
var e = this._map._container;
-1 === e.tabIndex && (e.tabIndex = "0"), i.DomEvent.on(e, "focus", this._onFocus, this).on(e, "blur", this._onBlur, this).on(e, "mousedown", this._onMouseDown, this), this._map.on("focus", this._addHooks, this).on("blur", this._removeHooks, this);
},
removeHooks: function() {
this._removeHooks();
var e = this._map._container;
i.DomEvent.off(e, "focus", this._onFocus, this).off(e, "blur", this._onBlur, this).off(e, "mousedown", this._onMouseDown, this), this._map.off("focus", this._addHooks, this).off("blur", this._removeHooks, this);
},
_onMouseDown: function() {
if (!this._focused) {
var n = t.body, r = t.documentElement, i = n.scrollTop || r.scrollTop, s = n.scrollLeft || r.scrollLeft;
this._map._container.focus(), e.scrollTo(s, i);
}
},
_onFocus: function() {
this._focused = !0, this._map.fire("focus");
},
_onBlur: function() {
this._focused = !1, this._map.fire("blur");
},
_setPanOffset: function(e) {
var t, n, r = this._panKeys = {}, i = this.keyCodes;
for (t = 0, n = i.left.length; n > t; t++) r[i.left[t]] = [ -1 * e, 0 ];
for (t = 0, n = i.right.length; n > t; t++) r[i.right[t]] = [ e, 0 ];
for (t = 0, n = i.down.length; n > t; t++) r[i.down[t]] = [ 0, e ];
for (t = 0, n = i.up.length; n > t; t++) r[i.up[t]] = [ 0, -1 * e ];
},
_setZoomOffset: function(e) {
var t, n, r = this._zoomKeys = {}, i = this.keyCodes;
for (t = 0, n = i.zoomIn.length; n > t; t++) r[i.zoomIn[t]] = e;
for (t = 0, n = i.zoomOut.length; n > t; t++) r[i.zoomOut[t]] = -e;
},
_addHooks: function() {
i.DomEvent.on(t, "keydown", this._onKeyDown, this);
},
_removeHooks: function() {
i.DomEvent.off(t, "keydown", this._onKeyDown, this);
},
_onKeyDown: function(e) {
var t = e.keyCode, n = this._map;
if (t in this._panKeys) {
if (n._panAnim && n._panAnim._inProgress) return;
n.panBy(this._panKeys[t]), n.options.maxBounds && n.panInsideBounds(n.options.maxBounds);
} else {
if (!(t in this._zoomKeys)) return;
n.setZoom(n.getZoom() + this._zoomKeys[t]);
}
i.DomEvent.stop(e);
}
}), i.Map.addInitHook("addHandler", "keyboard", i.Map.Keyboard), i.Handler.MarkerDrag = i.Handler.extend({
initialize: function(e) {
this._marker = e;
},
addHooks: function() {
var e = this._marker._icon;
this._draggable || (this._draggable = new i.Draggable(e, e)), this._draggable.on("dragstart", this._onDragStart, this).on("drag", this._onDrag, this).on("dragend", this._onDragEnd, this), this._draggable.enable();
},
removeHooks: function() {
this._draggable.off("dragstart", this._onDragStart, this).off("drag", this._onDrag, this).off("dragend", this._onDragEnd, this), this._draggable.disable();
},
moved: function() {
return this._draggable && this._draggable._moved;
},
_onDragStart: function() {
this._marker.closePopup().fire("movestart").fire("dragstart");
},
_onDrag: function() {
var e = this._marker, t = e._shadow, n = i.DomUtil.getPosition(e._icon), r = e._map.layerPointToLatLng(n);
t && i.DomUtil.setPosition(t, n), e._latlng = r, e.fire("move", {
latlng: r
}).fire("drag");
},
_onDragEnd: function() {
this._marker.fire("moveend").fire("dragend");
}
}), i.Control = i.Class.extend({
options: {
position: "topright"
},
initialize: function(e) {
i.setOptions(this, e);
},
getPosition: function() {
return this.options.position;
},
setPosition: function(e) {
var t = this._map;
return t && t.removeControl(this), this.options.position = e, t && t.addControl(this), this;
},
getContainer: function() {
return this._container;
},
addTo: function(e) {
this._map = e;
var t = this._container = this.onAdd(e), n = this.getPosition(), r = e._controlCorners[n];
return i.DomUtil.addClass(t, "leaflet-control"), -1 !== n.indexOf("bottom") ? r.insertBefore(t, r.firstChild) : r.appendChild(t), this;
},
removeFrom: function(e) {
var t = this.getPosition(), n = e._controlCorners[t];
return n.removeChild(this._container), this._map = null, this.onRemove && this.onRemove(e), this;
}
}), i.control = function(e) {
return new i.Control(e);
}, i.Map.include({
addControl: function(e) {
return e.addTo(this), this;
},
removeControl: function(e) {
return e.removeFrom(this), this;
},
_initControlPos: function() {
function e(e, s) {
var o = n + e + " " + n + s;
t[e + s] = i.DomUtil.create("div", o, r);
}
var t = this._controlCorners = {}, n = "leaflet-", r = this._controlContainer = i.DomUtil.create("div", n + "control-container", this._container);
e("top", "left"), e("top", "right"), e("bottom", "left"), e("bottom", "right");
},
_clearControlPos: function() {
this._container.removeChild(this._controlContainer);
}
}), i.Control.Zoom = i.Control.extend({
options: {
position: "topleft"
},
onAdd: function(e) {
var t = "leaflet-control-zoom", n = i.DomUtil.create("div", t + " leaflet-bar");
return this._map = e, this._zoomInButton = this._createButton("+", "Zoom in", t + "-in", n, this._zoomIn, this), this._zoomOutButton = this._createButton("-", "Zoom out", t + "-out", n, this._zoomOut, this), e.on("zoomend zoomlevelschange", this._updateDisabled, this), n;
},
onRemove: function(e) {
e.off("zoomend zoomlevelschange", this._updateDisabled, this);
},
_zoomIn: function(e) {
this._map.zoomIn(e.shiftKey ? 3 : 1);
},
_zoomOut: function(e) {
this._map.zoomOut(e.shiftKey ? 3 : 1);
},
_createButton: function(e, t, n, r, s, o) {
var u = i.DomUtil.create("a", n, r);
u.innerHTML = e, u.href = "#", u.title = t;
var a = i.DomEvent.stopPropagation;
return i.DomEvent.on(u, "click", a).on(u, "mousedown", a).on(u, "dblclick", a).on(u, "click", i.DomEvent.preventDefault).on(u, "click", s, o), u;
},
_updateDisabled: function() {
var e = this._map, t = "leaflet-disabled";
i.DomUtil.removeClass(this._zoomInButton, t), i.DomUtil.removeClass(this._zoomOutButton, t), e._zoom === e.getMinZoom() && i.DomUtil.addClass(this._zoomOutButton, t), e._zoom === e.getMaxZoom() && i.DomUtil.addClass(this._zoomInButton, t);
}
}), i.Map.mergeOptions({
zoomControl: !0
}), i.Map.addInitHook(function() {
this.options.zoomControl && (this.zoomControl = new i.Control.Zoom, this.addControl(this.zoomControl));
}), i.control.zoom = function(e) {
return new i.Control.Zoom(e);
}, i.Control.Attribution = i.Control.extend({
options: {
position: "bottomright",
prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
},
initialize: function(e) {
i.setOptions(this, e), this._attributions = {};
},
onAdd: function(e) {
return this._container = i.DomUtil.create("div", "leaflet-control-attribution"), i.DomEvent.disableClickPropagation(this._container), e.on("layeradd", this._onLayerAdd, this).on("layerremove", this._onLayerRemove, this), this._update(), this._container;
},
onRemove: function(e) {
e.off("layeradd", this._onLayerAdd).off("layerremove", this._onLayerRemove);
},
setPrefix: function(e) {
return this.options.prefix = e, this._update(), this;
},
addAttribution: function(e) {
return e ? (this._attributions[e] || (this._attributions[e] = 0), this._attributions[e]++, this._update(), this) : void 0;
},
removeAttribution: function(e) {
return e ? (this._attributions[e] && (this._attributions[e]--, this._update()), this) : void 0;
},
_update: function() {
if (this._map) {
var e = [];
for (var t in this._attributions) this._attributions[t] && e.push(t);
var n = [];
this.options.prefix && n.push(this.options.prefix), e.length && n.push(e.join(", ")), this._container.innerHTML = n.join(" | ");
}
},
_onLayerAdd: function(e) {
e.layer.getAttribution && this.addAttribution(e.layer.getAttribution());
},
_onLayerRemove: function(e) {
e.layer.getAttribution && this.removeAttribution(e.layer.getAttribution());
}
}), i.Map.mergeOptions({
attributionControl: !0
}), i.Map.addInitHook(function() {
this.options.attributionControl && (this.attributionControl = (new i.Control.Attribution).addTo(this));
}), i.control.attribution = function(e) {
return new i.Control.Attribution(e);
}, i.Control.Scale = i.Control.extend({
options: {
position: "bottomleft",
maxWidth: 100,
metric: !0,
imperial: !0,
updateWhenIdle: !1
},
onAdd: function(e) {
this._map = e;
var t = "leaflet-control-scale", n = i.DomUtil.create("div", t), r = this.options;
return this._addScales(r, t, n), e.on(r.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), n;
},
onRemove: function(e) {
e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
},
_addScales: function(e, t, n) {
e.metric && (this._mScale = i.DomUtil.create("div", t + "-line", n)), e.imperial && (this._iScale = i.DomUtil.create("div", t + "-line", n));
},
_update: function() {
var e = this._map.getBounds(), t = e.getCenter().lat, n = 6378137 * Math.PI * Math.cos(t * Math.PI / 180), r = n * (e.getNorthEast().lng - e.getSouthWest().lng) / 180, i = this._map.getSize(), s = this.options, o = 0;
i.x > 0 && (o = r * (s.maxWidth / i.x)), this._updateScales(s, o);
},
_updateScales: function(e, t) {
e.metric && t && this._updateMetric(t), e.imperial && t && this._updateImperial(t);
},
_updateMetric: function(e) {
var t = this._getRoundNum(e);
this._mScale.style.width = this._getScaleWidth(t / e) + "px", this._mScale.innerHTML = 1e3 > t ? t + " m" : t / 1e3 + " km";
},
_updateImperial: function(e) {
var t, n, r, i = 3.2808399 * e, s = this._iScale;
i > 5280 ? (t = i / 5280, n = this._getRoundNum(t), s.style.width = this._getScaleWidth(n / t) + "px", s.innerHTML = n + " mi") : (r = this._getRoundNum(i), s.style.width = this._getScaleWidth(r / i) + "px", s.innerHTML = r + " ft");
},
_getScaleWidth: function(e) {
return Math.round(this.options.maxWidth * e) - 10;
},
_getRoundNum: function(e) {
var t = Math.pow(10, (Math.floor(e) + "").length - 1), n = e / t;
return n = n >= 10 ? 10 : n >= 5 ? 5 : n >= 3 ? 3 : n >= 2 ? 2 : 1, t * n;
}
}), i.control.scale = function(e) {
return new i.Control.Scale(e);
}, i.Control.Layers = i.Control.extend({
options: {
collapsed: !0,
position: "topright",
autoZIndex: !0
},
initialize: function(e, t, n) {
i.setOptions(this, n), this._layers = {}, this._lastZIndex = 0, this._handlingClick = !1;
for (var r in e) this._addLayer(e[r], r);
for (r in t) this._addLayer(t[r], r, !0);
},
onAdd: function(e) {
return this._initLayout(), this._update(), e.on("layeradd", this._onLayerChange, this).on("layerremove", this._onLayerChange, this), this._container;
},
onRemove: function(e) {
e.off("layeradd", this._onLayerChange).off("layerremove", this._onLayerChange);
},
addBaseLayer: function(e, t) {
return this._addLayer(e, t), this._update(), this;
},
addOverlay: function(e, t) {
return this._addLayer(e, t, !0), this._update(), this;
},
removeLayer: function(e) {
var t = i.stamp(e);
return delete this._layers[t], this._update(), this;
},
_initLayout: function() {
var e = "leaflet-control-layers", t = this._container = i.DomUtil.create("div", e);
t.setAttribute("aria-haspopup", !0), i.Browser.touch ? i.DomEvent.on(t, "click", i.DomEvent.stopPropagation) : (i.DomEvent.disableClickPropagation(t), i.DomEvent.on(t, "mousewheel", i.DomEvent.stopPropagation));
var n = this._form = i.DomUtil.create("form", e + "-list");
if (this.options.collapsed) {
i.Browser.android || i.DomEvent.on(t, "mouseover", this._expand, this).on(t, "mouseout", this._collapse, this);
var r = this._layersLink = i.DomUtil.create("a", e + "-toggle", t);
r.href = "#", r.title = "Layers", i.Browser.touch ? i.DomEvent.on(r, "click", i.DomEvent.stop).on(r, "click", this._expand, this) : i.DomEvent.on(r, "focus", this._expand, this), this._map.on("click", this._collapse, this);
} else this._expand();
this._baseLayersList = i.DomUtil.create("div", e + "-base", n), this._separator = i.DomUtil.create("div", e + "-separator", n), this._overlaysList = i.DomUtil.create("div", e + "-overlays", n), t.appendChild(n);
},
_addLayer: function(e, t, n) {
var r = i.stamp(e);
this._layers[r] = {
layer: e,
name: t,
overlay: n
}, this.options.autoZIndex && e.setZIndex && (this._lastZIndex++, e.setZIndex(this._lastZIndex));
},
_update: function() {
if (this._container) {
this._baseLayersList.innerHTML = "", this._overlaysList.innerHTML = "";
var e, t, n = !1, r = !1;
for (e in this._layers) t = this._layers[e], this._addItem(t), r = r || t.overlay, n = n || !t.overlay;
this._separator.style.display = r && n ? "" : "none";
}
},
_onLayerChange: function(e) {
var t = this._layers[i.stamp(e.layer)];
if (t) {
this._handlingClick || this._update();
var n = t.overlay ? "layeradd" === e.type ? "overlayadd" : "overlayremove" : "layeradd" === e.type ? "baselayerchange" : null;
n && this._map.fire(n, t);
}
},
_createRadioElement: function(e, n) {
var r = '<input type="radio" class="leaflet-control-layers-selector" name="' + e + '"';
n && (r += ' checked="checked"'), r += "/>";
var i = t.createElement("div");
return i.innerHTML = r, i.firstChild;
},
_addItem: function(e) {
var n, r = t.createElement("label"), s = this._map.hasLayer(e.layer);
e.overlay ? (n = t.createElement("input"), n.type = "checkbox", n.className = "leaflet-control-layers-selector", n.defaultChecked = s) : n = this._createRadioElement("leaflet-base-layers", s), n.layerId = i.stamp(e.layer), i.DomEvent.on(n, "click", this._onInputClick, this);
var o = t.createElement("span");
o.innerHTML = " " + e.name, r.appendChild(n), r.appendChild(o);
var u = e.overlay ? this._overlaysList : this._baseLayersList;
return u.appendChild(r), r;
},
_onInputClick: function() {
var e, t, n, r = this._form.getElementsByTagName("input"), i = r.length;
for (this._handlingClick = !0, e = 0; i > e; e++) t = r[e], n = this._layers[t.layerId], t.checked && !this._map.hasLayer(n.layer) ? this._map.addLayer(n.layer) : !t.checked && this._map.hasLayer(n.layer) && this._map.removeLayer(n.layer);
this._handlingClick = !1;
},
_expand: function() {
i.DomUtil.addClass(this._container, "leaflet-control-layers-expanded");
},
_collapse: function() {
this._container.className = this._container.className.replace(" leaflet-control-layers-expanded", "");
}
}), i.control.layers = function(e, t, n) {
return new i.Control.Layers(e, t, n);
}, i.PosAnimation = i.Class.extend({
includes: i.Mixin.Events,
run: function(e, t, n, r) {
this.stop(), this._el = e, this._inProgress = !0, this._newPos = t, this.fire("start"), e.style[i.DomUtil.TRANSITION] = "all " + (n || .25) + "s cubic-bezier(0,0," + (r || .5) + ",1)", i.DomEvent.on(e, i.DomUtil.TRANSITION_END, this._onTransitionEnd, this), i.DomUtil.setPosition(e, t), i.Util.falseFn(e.offsetWidth), this._stepTimer = setInterval(i.bind(this._onStep, this), 50);
},
stop: function() {
this._inProgress && (i.DomUtil.setPosition(this._el, this._getPos()), this._onTransitionEnd(), i.Util.falseFn(this._el.offsetWidth));
},
_onStep: function() {
var e = this._getPos();
return e ? (this._el._leaflet_pos = e, this.fire("step"), void 0) : (this._onTransitionEnd(), void 0);
},
_transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,
_getPos: function() {
var t, n, r, s = this._el, o = e.getComputedStyle(s);
if (i.Browser.any3d) {
if (r = o[i.DomUtil.TRANSFORM].match(this._transformRe), !r) return;
t = parseFloat(r[1]), n = parseFloat(r[2]);
} else t = parseFloat(o.left), n = parseFloat(o.top);
return new i.Point(t, n, !0);
},
_onTransitionEnd: function() {
i.DomEvent.off(this._el, i.DomUtil.TRANSITION_END, this._onTransitionEnd, this), this._inProgress && (this._inProgress = !1, this._el.style[i.DomUtil.TRANSITION] = "", this._el._leaflet_pos = this._newPos, clearInterval(this._stepTimer), this.fire("step").fire("end"));
}
}), i.Map.include({
setView: function(e, t, r) {
if (t = this._limitZoom(t), e = i.latLng(e), r = r || {}, this._panAnim && this._panAnim.stop(), this._loaded && !r.reset && r !== !0) {
r.animate !== n && (r.zoom = i.extend({
animate: r.animate
}, r.zoom), r.pan = i.extend({
animate: r.animate
}, r.pan));
var s = this._zoom !== t ? this._tryAnimatedZoom && this._tryAnimatedZoom(e, t, r.zoom) : this._tryAnimatedPan(e, r.pan);
if (s) return clearTimeout(this._sizeTimer), this;
}
return this._resetView(e, t), this;
},
panBy: function(e, t) {
if (e = i.point(e).round(), t = t || {}, !e.x && !e.y) return this;
if (this._panAnim || (this._panAnim = new i.PosAnimation, this._panAnim.on({
step: this._onPanTransitionStep,
end: this._onPanTransitionEnd
}, this)), t.noMoveStart || this.fire("movestart"), t.animate !== !1) {
i.DomUtil.addClass(this._mapPane, "leaflet-pan-anim");
var n = this._getMapPanePos().subtract(e);
this._panAnim.run(this._mapPane, n, t.duration || .25, t.easeLinearity);
} else this._rawPanBy(e), this.fire("move").fire("moveend");
return this;
},
_onPanTransitionStep: function() {
this.fire("move");
},
_onPanTransitionEnd: function() {
i.DomUtil.removeClass(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
},
_tryAnimatedPan: function(e, t) {
var n = this._getCenterOffset(e)._floor();
return (t && t.animate) === !0 || this.getSize().contains(n) ? (this.panBy(n, t), !0) : !1;
}
}), i.PosAnimation = i.DomUtil.TRANSITION ? i.PosAnimation : i.PosAnimation.extend({
run: function(e, t, n, r) {
this.stop(), this._el = e, this._inProgress = !0, this._duration = n || .25, this._easeOutPower = 1 / Math.max(r || .5, .2), this._startPos = i.DomUtil.getPosition(e), this._offset = t.subtract(this._startPos), this._startTime = +(new Date), this.fire("start"), this._animate();
},
stop: function() {
this._inProgress && (this._step(), this._complete());
},
_animate: function() {
this._animId = i.Util.requestAnimFrame(this._animate, this), this._step();
},
_step: function() {
var e = +(new Date) - this._startTime, t = 1e3 * this._duration;
t > e ? this._runFrame(this._easeOut(e / t)) : (this._runFrame(1), this._complete());
},
_runFrame: function(e) {
var t = this._startPos.add(this._offset.multiplyBy(e));
i.DomUtil.setPosition(this._el, t), this.fire("step");
},
_complete: function() {
i.Util.cancelAnimFrame(this._animId), this._inProgress = !1, this.fire("end");
},
_easeOut: function(e) {
return 1 - Math.pow(1 - e, this._easeOutPower);
}
}), i.Map.mergeOptions({
zoomAnimation: !0,
zoomAnimationThreshold: 4
}), i.DomUtil.TRANSITION && i.Map.addInitHook(function() {
this._zoomAnimated = this.options.zoomAnimation && i.DomUtil.TRANSITION && i.Browser.any3d && !i.Browser.android23 && !i.Browser.mobileOpera, this._zoomAnimated && i.DomEvent.on(this._mapPane, i.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
}), i.Map.include(i.DomUtil.TRANSITION ? {
_catchTransitionEnd: function() {
this._animatingZoom && this._onZoomTransitionEnd();
},
_nothingToAnimate: function() {
return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
},
_tryAnimatedZoom: function(e, t, n) {
if (this._animatingZoom) return !0;
if (n = n || {}, !this._zoomAnimated || n.animate === !1 || this._nothingToAnimate() || Math.abs(t - this._zoom) > this.options.zoomAnimationThreshold) return !1;
var r = this.getZoomScale(t), i = this._getCenterOffset(e)._divideBy(1 - 1 / r), s = this._getCenterLayerPoint()._add(i);
return n.animate === !0 || this.getSize().contains(i) ? (this.fire("movestart").fire("zoomstart"), this._animateZoom(e, t, s, r, null, !0), !0) : !1;
},
_animateZoom: function(e, t, n, r, s, o) {
this._animatingZoom = !0, i.DomUtil.addClass(this._mapPane, "leaflet-zoom-anim"), this._animateToCenter = e, this._animateToZoom = t, i.Draggable && (i.Draggable._disabled = !0), this.fire("zoomanim", {
center: e,
zoom: t,
origin: n,
scale: r,
delta: s,
backwards: o
});
},
_onZoomTransitionEnd: function() {
this._animatingZoom = !1, i.DomUtil.removeClass(this._mapPane, "leaflet-zoom-anim"), this._resetView(this._animateToCenter, this._animateToZoom, !0, !0), i.Draggable && (i.Draggable._disabled = !1);
}
} : {}), i.TileLayer.include({
_animateZoom: function(e) {
this._animating || (this._animating = !0, this._prepareBgBuffer());
var t = this._bgBuffer, n = i.DomUtil.TRANSFORM, r = e.delta ? i.DomUtil.getTranslateString(e.delta) : t.style[n], s = i.DomUtil.getScaleString(e.scale, e.origin);
t.style[n] = e.backwards ? s + " " + r : r + " " + s;
},
_endZoomAnim: function() {
var e = this._tileContainer, t = this._bgBuffer;
e.style.visibility = "", e.parentNode.appendChild(e), i.Util.falseFn(t.offsetWidth), this._animating = !1;
},
_clearBgBuffer: function() {
var e = this._map;
!e || e._animatingZoom || e.touchZoom._zooming || (this._bgBuffer.innerHTML = "", this._bgBuffer.style[i.DomUtil.TRANSFORM] = "");
},
_prepareBgBuffer: function() {
var e = this._tileContainer, t = this._bgBuffer, n = this._getLoadedTilesPercentage(t), r = this._getLoadedTilesPercentage(e);
return t && n > .5 && .5 > r ? (e.style.visibility = "hidden", this._stopLoadingImages(e), void 0) : (t.style.visibility = "hidden", t.style[i.DomUtil.TRANSFORM] = "", this._tileContainer = t, t = this._bgBuffer = e, this._stopLoadingImages(t), clearTimeout(this._clearBgBufferTimer), void 0);
},
_getLoadedTilesPercentage: function(e) {
var t, n, r = e.getElementsByTagName("img"), i = 0;
for (t = 0, n = r.length; n > t; t++) r[t].complete && i++;
return i / n;
},
_stopLoadingImages: function(e) {
var t, n, r, s = Array.prototype.slice.call(e.getElementsByTagName("img"));
for (t = 0, n = s.length; n > t; t++) r = s[t], r.complete || (r.onload = i.Util.falseFn, r.onerror = i.Util.falseFn, r.src = i.Util.emptyImageUrl, r.parentNode.removeChild(r));
}
}), i.Map.include({
_defaultLocateOptions: {
watch: !1,
setView: !1,
maxZoom: 1 / 0,
timeout: 1e4,
maximumAge: 0,
enableHighAccuracy: !1
},
locate: function(e) {
if (e = this._locateOptions = i.extend(this._defaultLocateOptions, e), !navigator.geolocation) return this._handleGeolocationError({
code: 0,
message: "Geolocation not supported."
}), this;
var t = i.bind(this._handleGeolocationResponse, this), n = i.bind(this._handleGeolocationError, this);
return e.watch ? this._locationWatchId = navigator.geolocation.watchPosition(t, n, e) : navigator.geolocation.getCurrentPosition(t, n, e), this;
},
stopLocate: function() {
return navigator.geolocation && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
},
_handleGeolocationError: function(e) {
var t = e.code, n = e.message || (1 === t ? "permission denied" : 2 === t ? "position unavailable" : "timeout");
this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
code: t,
message: "Geolocation error: " + n + "."
});
},
_handleGeolocationResponse: function(e) {
var t = e.coords.latitude, n = e.coords.longitude, r = new i.LatLng(t, n), s = 180 * e.coords.accuracy / 40075017, o = s / Math.cos(i.LatLng.DEG_TO_RAD * t), u = i.latLngBounds([ t - s, n - o ], [ t + s, n + o ]), a = this._locateOptions;
if (a.setView) {
var f = Math.min(this.getBoundsZoom(u), a.maxZoom);
this.setView(r, f);
}
var l = {
latlng: r,
bounds: u
};
for (var c in e.coords) "number" == typeof e.coords[c] && (l[c] = e.coords[c]);
this.fire("locationfound", l);
}
});
}(window, document);

// MenuPane.js

enyo.kind({
name: "rwatkins.MenuPane",
published: {
menu: "",
secondarymenu: "",
view: ""
},
events: {
onViewChange: "",
onMenuOpen: "",
onMenuClose: "",
onSecondaryMenuOpen: "",
onSecondaryMenuClose: ""
},
classes: "menu-pane",
style: "overflow: hidden;",
position: {
menu: {
min: 0,
max: 85
},
secondarymenu: {
min: -85,
max: 0
}
},
controlParentName: "pane",
components: [ {
name: "menu",
classes: "enyo-fit menupane-menu",
ontap: "menuTapHandler"
}, {
name: "secondarymenu",
classes: "enyo-fit menupane-menu-secondary",
showing: !1,
ontap: "menuTapHandler"
}, {
name: "pane",
kind: "enyo.Slideable",
classes: "menupane-pane",
value: 0,
min: 0,
max: 85,
unit: "%",
draggable: !1,
style: "width: 100%; height: 100%;",
onAnimateFinish: "paneAnimateFinishHandler"
} ],
selectView: function(e) {
var t = this.getClientControls();
enyo.forEach(t, function(t) {
t.name == e ? t.show() : t.hide();
}, this), this.doViewChange();
},
toggleMenu: function(e, t, n) {
this.$.menu.setShowing(!n), this.$.secondarymenu.setShowing(n), this.$.pane.setMax(n ? this.position.secondarymenu.max : this.position.menu.max), this.$.pane.setMin(n ? this.position.secondarymenu.min : this.position.menu.min), this.$.pane.toggleMinMax();
},
toggleSecondaryMenu: function(e, t) {
this.toggleMenu(e, t, !0);
},
create: function() {
this.inherited(arguments), this.$.pane.$.animator.setDuration(250);
var e = this.getClientControls();
enyo.forEach(e, function(e) {
e.hide();
}, this), e && e[0] && this.setView(e[0].name);
},
initComponents: function() {
this.inherited(arguments), this.$.menu.createComponents(this.menu, {
owner: this
}), this.$.secondarymenu.createComponents(this.secondarymenu, {
owner: this
});
},
menuTapHandler: function(e, t) {
e.name == "secondarymenu" ? (this.$.pane.setMax(this.position.secondarymenu.max), this.$.pane.setMin(this.position.secondarymenu.min)) : (this.$.pane.setMax(this.position.menu.max), this.$.pane.setMin(this.position.menu.min));
var n = enyo.bind(this, function(e) {
return e.view ? e.view : e == this.$.menu || e == this.$.secondarymenu ? null : n(e.parent);
}), r = n(t.originator);
r && (this.getView() == r ? this.$.pane["animateTo" + (e.name == "secondarymenu" ? "Max" : "Min")]() : (this.$.pane.$.animator.setDuration(200), this.$.pane.animateTo(e.name == "secondarymenu" ? -100 : 100), this.toview = r));
},
viewChanged: function(e) {
this.selectView(this.getView());
},
paneAnimateFinishHandler: function(e) {
var t = e.getValue();
Math.abs(t) == 100 ? (this.toview && (this.setView(this.toview), this.toview = null), setTimeout(enyo.bind(this, function() {
this.$.pane.$.animator.setDuration(250), t < 0 ? e.animateToMax() : e.animateToMin();
}), 1)) : this.$.menu.getShowing() ? e.getValue() == this.position.menu.max ? this.doMenuOpen() : this.doMenuClose() : e.getValue() == this.position.secondarymenu.min ? this.doSecondaryMenuOpen() : this.doSecondaryMenuClose();
}
});

// Toolbar.js

enyo.kind({
name: "Toolbar",
kind: "onyx.Toolbar",
published: {
header: ""
},
events: {
onHeader: "",
onToggleMenu: "",
onToggleSecondaryMenu: ""
},
components: [ {
kind: "onyx.Grabber",
ontap: "doToggleMenu",
style: "float: left;"
}, {
name: "header",
content: "",
ontap: "doHeader",
style: "padding-top: 4px"
} ],
create: function() {
this.inherited(arguments), this.headerChanged();
},
headerChanged: function() {
this.$.header.setContent(this.getHeader());
}
});

// NewMap.js

enyo.kind({
name: "NewMap",
kind: enyo.FittableRows,
published: {
gpsTimeout: "10000"
},
components: [ {
name: "gps",
kind: "rok.geolocation",
watch: !0,
enableHighAccuracy: !0,
timeout: this.gpsTimeout,
maximumAge: "3000",
onSuccess: "locSuccess",
onError: "locError"
}, {
name: "holder",
kind: onyx.Drawer,
orient: "v",
open: !0,
components: [ {
name: "obsButton",
kind: enyo.Button,
content: "Make an Observation",
ontap: "makeButtonBubbleClick",
classes: "button-style",
style: "clear: both; width: 100%;"
} ]
}, {
name: "mapCont",
fit: !0,
style: "overflow: hidden; position: relative;"
} ],
events: {
onLoaded: "",
onPinClicked: "",
onGPSSet: ""
},
eventStarted: !1,
handlers: {
onSnapping: "toggleVisible",
onSnapped: "toggleVisible"
},
create: function(e) {
this.inherited(arguments), this.$.gps.setTimeout(this.gpsTimeout), userMoved = !1, loaded = !1, this.panZoomed = !1, this.firstTime = !0, this.notShowing = !0, this.locSuc = !1, this.loaded = !1;
},
rendered: function() {
this.inherited(arguments), this.$.gps.getPosition(), this.map = L.map(this.$.mapCont.id, {
closePopupOnClick: !1,
maxZoom: 17
}).setView([ 44.981313, -93.266569 ], 13), L.tileLayer("http://acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png", {
attribution: "Map data &copy; OpenStreetMap contributors"
}).addTo(this.map);
},
mapLoaded: function() {
this.loaded = !0, this.log(this.loaded), this.doLoaded();
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
this.locations.match(t) != null && (this.log(this.locations), this.locations = this.locations.split("|"), this.addMarkers(), this.map.invalidateSize(), this.$.holder.setOpen(!1));
},
inside: function(e) {},
toggleVisible: function(e, t) {
var n = this.parent.parent.getIndex(), r = this.id.split("_"), i = r[r.length - 1], s = this.parent.parent.getPanels()[n].id.split("_"), o = s[s.length - 1];
return this.addRemoveClass("hideMap", i !== o), !0;
},
makeFilter: function() {
this.loaded && (this.panZoomed = !0), this.addMarkers();
},
addMarkers: function() {
if (this.locations instanceof Array) for (x in this.locations) {
var e = this.locations[x].split(",").reverse();
this.log(e);
var t = L.marker(e).addTo(this.map);
t.on("click", enyo.bind(this, "makeBubbleClick"));
}
},
centerMap: function() {
var e = Data.getLocationData();
this.log(e), this.map.setView([ e.latitude, e.longitude ], 15), this.loaded || this.mapLoaded();
},
makeBubbleClick: function(e) {
this.log(e), enyo.Signals.send("onPinClicked", e.latlng);
},
makeButtonBubbleClick: function(e) {
this.log(Data.getLocationData()), enyo.Signals.send("onPinClicked", Data.getLocationData());
},
makeBubbleLoad: function() {
loaded = !0, this.doLoaded();
}
});

// PinView.js

enyo.kind({
name: "PinView",
kind: "enyo.Control",
published: {
value: "1",
description: "temp description"
},
components: [ {
name: "taskDesc",
tag: "div",
content: "test"
}, {
name: "taskValue",
content: "testval"
}, {
name: "button",
kind: enyo.Button,
content: "Do It!",
ontap: "buttonHit"
} ],
events: {
onDoObservation: ""
},
create: function(e, t) {
this.inherited(arguments), this.$.taskDesc.content = this.description, this.$.taskValue.content = this.value;
},
setContent: function(e, t) {
this.$.taskDesc.setContent(e), this.$.taskValue.setContent("You earn: " + t + " points"), this.$.taskDesc.resized(), this.$.taskValue.resized(), this.resized();
},
buttonHit: function(e, t) {
return this.doDoObservation(), !0;
},
setIndex: function(e) {
this.index = e;
}
});

// Sensr.js

enyo.kind({
name: "Sensr",
kind: "enyo.Control",
style: "min-height: 100%;",
published: {},
events: {
onSubmisisonMade: ""
},
handlers: {
onSenseOpened: "openNext",
onPhotoOk: "photoOk"
},
components: [ {
kind: "Accordion",
style: "min-height: 100%;",
headerHeight: 40,
onViewChange: "viewChanged",
components: [ {
kind: "AccordionItem",
headerTitle: "Senses",
contentComponents: [ {
kind: "onyx.Button",
content: "-",
style: "float: left;",
classes: "onyx-negative",
ontap: "retakePhoto"
}, {
kind: "onyx.Button",
content: "+",
style: "float: right;",
classes: "onyx-affirmative",
ontap: "photoOk"
} ],
photoOk: function(e, t) {
this.bubble("onPhotoOk");
},
retakePhoto: function() {}
}, {
name: "qs",
kind: "AccordionItem",
headerTitle: "Questions",
contentComponents: [ {
name: "qbody",
components: []
} ]
} ]
}, {
kind: "onyx.Button",
classes: "onyx-negative",
content: "Cancel",
ontap: "close",
style: "width: 50%;"
}, {
name: "submit",
kind: "onyx.Button",
classes: "onyx-affirmative",
content: "Submit",
ontap: "buildAndSendSubmission",
disabled: !0,
style: "width: 50%;"
} ],
create: function(e, t) {
this.inherited(arguments);
},
viewChanged: function(e, t) {},
openNext: function() {
var e = this.$.accordion.getItems(), t = this.$.accordion.getActiveView();
return this.log(this.$.accordion.getActiveView()), t === !1 && this.$.accordion.toggleItem(e[0]), !0;
},
photoOk: function() {
var e = this.$.accordion.getActiveView(), t = this.$.accordion.getItems();
for (x in t) if (t[x] === e) {
var n = ++x;
this.$.accordion.toggleItem(t[n]), e.$.accordionItemHeader.addStyles("background-color: green;"), this.camComplete = !0, this.$.submit.setDisabled(!1);
}
return !0;
},
setTaskData: function(e) {
this.task = e, this.$.qs.$.qbody.getComponents().length > 0 && this.$.qs.$.qbody.destroyComponents();
for (i in this.task.questions) {
var t = this.task.questions[i], n = "name_" + t.id;
this.$.qs.$.qbody.createComponent({
name: n,
content: t.question
});
switch (t.type) {
case "text":
this.newFormText(t);
break;
case "exclusive_multiple_choice":
this.newFormExclusiveChoice(t);
break;
case "multiple_choice":
this.newFormMultipleChoice(t);
break;
case "counter":
this.newFormCounter(t);
break;
default:
}
this.$.qs.$.qbody.createComponent({
tag: "hr"
});
}
this.$.qs.render();
},
buildAndSendSubmission: function() {
var e = {
submission: {
task_id: this.task.id,
gps_location: "testy test",
user_id: 5,
img_path: "test",
answers: []
}
};
e.submission.user_id = LocalStorage.get("user");
for (i in this.task.questions) {
var t = this.task.questions[i], n = {
answer: "BOOM",
type: t.type,
q_id: t.id,
sub_id: 0
};
switch (t.type) {
case "text":
n.answer = this.readFormText(t);
break;
case "exclusive_multiple_choice":
n.answer = this.readFormExclusiveChoice(t);
break;
case "multiple_choice":
n.answer = this.readFormMultipleChoice(t);
break;
case "counter":
n.answer = this.readFormCounter(t);
break;
default:
}
e.submission.answers.push(n);
}
this.log("SENDING TO SERVER: " + JSON.stringify(e));
var r = Data.getURL() + "submission.json", s = new enyo.Ajax({
contentType: "application/json",
method: "POST",
url: r,
postBody: JSON.stringify(e)
});
s.response(this, "handlePostResponse"), s.go();
},
handlePostResponse: function(e, t) {
this.log("SERVER RESPONSE CAME BACK"), this.bubble("onSubmissionMade");
},
close: function() {
this.bubble("onSubmissionMade");
},
newFormText: function(e) {
var t = "inputDec_" + e.id, n = "input_" + e.id;
this.$.qs.$.qbody.createComponent({
name: t,
kind: "onyx.InputDecorator",
classes: "onyx-input-decorator",
components: [ {
name: n,
kind: "onyx.Input",
classes: "onyx-input",
defaultFocus: !0
} ]
});
},
newFormExclusiveChoice: function(e) {
var t = "input_" + e.id, n = e.options.split("|"), r = [];
for (i in n) r.push({
content: n[i]
});
this.$.qs.$.qbody.createComponent({
name: t,
kind: "onyx.RadioGroup",
components: r
});
},
newFormMultipleChoice: function(e) {
var t = e.options.split("|");
this.$.qs.$.qbody.createComponent({
name: "groupbox",
kind: "onyx.Groupbox",
components: []
});
for (i in t) {
var n = "checkbox_" + i, r = "content_" + i, s = [];
this.$.qs.$.qbody.$.groupbox.createComponent({
name: n,
kind: "onyx.Checkbox",
style: "float: left; clear: left;"
}), this.$.qs.$.qbody.$.groupbox.createComponent({
name: r,
content: t[i],
style: "float: left; clear: right;"
}), this.$.qs.$.qbody.$.groupbox.createComponent({
tag: "br"
});
}
},
newFormCounter: function(e) {
var t = "counter_" + e.id;
this.$.qs.$.qbody.createComponent({
name: t,
kind: "Counter",
title: e.question
});
},
readFormText: function(e) {
var t = "input_" + e.id;
return this.$.qs.$.qbody.$[t].getValue();
},
readFormExclusiveChoice: function(e) {
var t = e.options.split("|"), n = "input_" + e.id, r = this.$.qs.$.qbody.$[n].children;
for (x in r) if (r[x].hasClass("active")) return r[x].getContent();
},
readFormMultipleChoice: function(e) {
var t = [];
this.log(this.$.qs.$.qbody.$.groupbox.$);
for (i in e.options.split("|")) {
var n = "checkbox_" + i, r = "content_" + i;
this.$.qs.$.qbody.$.groupbox.$[n].getValue() && t.push(this.$.qs.$.qbody.$.groupbox.$[r].getContent());
}
return t.join("|");
},
readFormCounter: function(e) {
var t = "counter_" + e.id;
return this.$.qs.$.qbody.$[t].getCount();
}
});

// SimpleSensr.js

enyo.kind({
name: "SimpleSensr",
kind: "enyo.Control",
style: "min-height: 100%;",
published: {
complex: !1
},
events: {
onSubmisisonMade: ""
},
handlers: {
onSenseOpened: "openNext",
onPhotoOk: "photoOk",
onDeviceReady: "setReady",
onGPSSet: "currentLocation"
},
components: [ {
kind: "enyo.Signals",
onGPSSet: "currentLocation",
onPinClicked: "chosenLocation",
onPhotoData: "photoData"
}, {
name: "senses",
components: [ {
name: "imgDiv",
classes: "imgDiv",
components: []
}, {
name: "photoButton",
kind: "onyx.Button",
content: "Take Photo",
style: "width: 100%;",
ontap: "retakePhoto",
classes: "onyx-affirmative"
} ]
}, {
tag: "hr",
style: "clear: both;"
}, {
name: "qs",
style: "clear: both;",
components: [ {
name: "qbody",
components: []
} ]
}, {
kind: "onyx.Button",
classes: "onyx-negative",
content: "Cancel",
ontap: "close",
style: "width: 50%;"
}, {
name: "submit",
kind: "onyx.Button",
classes: "onyx-affirmative",
content: "Submit",
ontap: "buildAndSendSubmission",
disabled: !0,
style: "width: 50%;"
} ],
create: function(e, t) {
this.devReady = !1, this.inherited(arguments), !this.complex;
},
currentLocation: function(e, t) {
this.gps_location = t.prop;
},
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
this.$.imgDiv.createComponent({
name: "myImage",
kind: "enyo.Image",
src: "./assets/leaf-2.jpg"
}), this.$.imgDiv.render(), this.$.submit.setDisabled(!1), this.camComplete = !0, enyo.Signals.send("onPhotoData", e);
},
onPhotoFail: function(e) {
console.log(e);
},
retakePhoto: function() {
this.$.imgDiv.getComponents().length > 0 && this.$.imgDiv.destroyComponents(), this.onPhotoSuccess();
},
viewChanged: function(e, t) {},
openNext: function() {
return !0;
},
photoOk: function() {
return this.log(), !0;
},
utf8_encode: function(e) {
if (e === null || typeof e == "undefined") return "";
var t = e + "", n = "", r, i, s = 0;
r = i = 0, s = t.length;
for (var o = 0; o < s; o++) {
var u = t.charCodeAt(o), a = null;
u < 128 ? i++ : u > 127 && u < 2048 ? a = String.fromCharCode(u >> 6 | 192) + String.fromCharCode(u & 63 | 128) : a = String.fromCharCode(u >> 12 | 224) + String.fromCharCode(u >> 6 & 63 | 128) + String.fromCharCode(u & 63 | 128), a !== null && (i > r && (n += t.slice(r, i)), n += a, r = i = o + 1);
}
return i > r && (n += t.slice(r, s)), n;
},
encodeAsBase64: function(e) {
var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", n, r, i, s, o, u, a, f, l = 0, c = 0, h = "", p = [];
if (!e) return e;
e = this.utf8_encode(e + "");
do n = e.charCodeAt(l++), r = e.charCodeAt(l++), i = e.charCodeAt(l++), f = n << 16 | r << 8 | i, s = f >> 18 & 63, o = f >> 12 & 63, u = f >> 6 & 63, a = f & 63, p[c++] = t.charAt(s) + t.charAt(o) + t.charAt(u) + t.charAt(a); while (l < e.length);
h = p.join("");
var d = e.length % 3;
return (d ? h.slice(0, d - 3) : h) + "===".slice(d || 3);
},
setTaskData: function(e) {
this.task = e.tasks[0], this.campTitle = e.title, this.$.qbody.getComponents().length > 0 && this.$.qbody.destroyComponents();
for (i in this.task.questions) {
var t = this.task.questions[i], n = "name_" + t.id;
this.$.qbody.createComponent({
name: n,
content: t.question
});
switch (t.type) {
case "text":
this.newFormText(t);
break;
case "exclusive_multiple_choice":
this.newFormExclusiveChoice(t);
break;
case "multiple_choice":
this.newFormMultipleChoice(t);
break;
case "counter":
this.newFormCounter(t);
break;
default:
}
this.$.qbody.createComponent({
tag: "hr"
});
}
this.$.qs.render();
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
}), this.render();
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
this.fileEntry(this.$.imgDiv.$.myImage.src);
if (this.imageOK) {
var e = {
submission: {
task_id: this.task.id,
gps_location: "testy test",
user_id: 5,
img_path: "test",
answers: []
}
}, t = this.gps_location.latitude + "|" + this.gps_location.longitude;
e.submission.gps_location = t, e.submission.user_id = LocalStorage.get("user");
for (i in this.task.questions) {
var n = this.task.questions[i], r = {
answer: "BOOM",
type: n.type,
q_id: n.id,
sub_id: 0
};
switch (n.type) {
case "text":
r.answer = this.readFormText(n);
break;
case "exclusive_multiple_choice":
r.answer = this.readFormExclusiveChoice(n);
break;
case "multiple_choice":
r.answer = this.readFormMultipleChoice(n);
break;
case "counter":
r.answer = this.readFormCounter(n);
break;
default:
}
e.submission.answers.push(r);
}
this.log("SENDING TO SERVER: " + JSON.stringify(e));
var s = Data.getURL() + "submission.json", o = new enyo.Ajax({
contentType: "application/json",
method: "POST",
url: s,
postBody: JSON.stringify(e),
handleAs: "json"
});
o.response(this, "handlePostResponse"), o.go();
}
}
},
handlePostResponse: function(e, t) {
this.log("SERVER RESPONSE CAME BACK"), this.bubble("onSubmissionMade"), this.camComplete = !1, this.$.submit.setDisabled(!0), this.chosen_location = undefined, LocalStorage.remove("image"), this.imageOK = !1, this.$.imgDiv.getComponents().length > 0 && this.$.imgDiv.destroyComponents();
},
imageSubmission: function(e, t) {
this.log(JSON.stringify(e)), this.log(JSON.stringify(t));
},
close: function() {
this.bubble("onSubmissionMade");
},
setReady: function() {
this.devReady = !0;
},
newFormText: function(e) {
var t = "inputDec_" + e.id, n = "input_" + e.id;
this.$.qbody.createComponent({
name: t,
kind: "onyx.InputDecorator",
classes: "onyx-input-decorator",
components: [ {
name: n,
kind: "onyx.Input",
classes: "onyx-input",
defaultFocus: !0
} ]
});
},
newFormExclusiveChoice: function(e) {
var t = "input_" + e.id, n = e.options.split("|"), r = [];
for (i in n) r.push({
content: n[i]
});
this.$.qbody.createComponent({
name: t,
kind: "onyx.RadioGroup",
components: r
});
},
newFormMultipleChoice: function(e) {
var t = e.options.split("|");
this.$.qbody.createComponent({
name: "groupbox",
kind: "onyx.Groupbox",
components: []
});
for (i in t) {
var n = "checkbox_" + i, r = "content_" + i, s = [];
this.$.qbody.$.groupbox.createComponent({
name: n,
kind: "onyx.Checkbox",
style: "float: left; clear: left;"
}), this.$.qbody.$.groupbox.createComponent({
name: r,
content: t[i],
style: "float: left; clear: right;"
}), this.$.qbody.$.groupbox.createComponent({
tag: "br"
});
}
},
newFormCounter: function(e) {
var t = "counter_" + e.id;
this.$.qbody.createComponent({
name: t,
kind: "Counter",
title: e.question
});
},
readFormText: function(e) {
var t = "input_" + e.id;
return this.$.qbody.$[t].getValue();
},
readFormExclusiveChoice: function(e) {
var t = e.options.split("|"), n = "input_" + e.id, r = this.$.qbody.$[n].children;
for (x in r) if (r[x].hasClass("active")) return r[x].getContent();
},
readFormMultipleChoice: function(e) {
var t = [];
this.log(this.$.qbody.$.groupbox.$);
for (i in e.options.split("|")) {
var n = "checkbox_" + i, r = "content_" + i;
this.$.qbody.$.groupbox.$[n].getValue() && t.push(this.$.qbody.$.groupbox.$[r].getContent());
}
return t.join("|");
},
readFormCounter: function(e) {
var t = "counter_" + e.id;
return this.$.qbody.$[t].getCount();
}
});

// TallyCounter.js

enyo.kind({
name: "TallyCounter",
kind: enyo.FittableRows,
classes: "tableButton",
published: {
row: 0,
col: 0,
enabled: !1
},
events: {
onRecordCountEvent: ""
},
handlers: {
ontap: "increment"
},
components: [ {
name: "num",
kind: onyx.Button,
content: 0,
style: "text-align: center; width: 100%; height: 100%;",
disabled: !0
} ],
create: function(e, t) {
this.inherited(arguments);
},
rendered: function(e, t) {},
increment: function() {
this.$.num.setContent(this.$.num.getContent() + 1), this.doRecordCountEvent({
row: this.row,
column: this.col
});
},
decrement: function() {
Number(this.$.num.getContent()) > 0 && this.$.num.setContent(this.$.num.getContent() - 1);
},
getCount: function() {
return this.storage != undefined ? this.storage.join() : 0;
},
enabledChanged: function(e, t) {
this.$.num.setDisabled(!this.enabled);
}
});

// TickerList.js

enyo.kind({
name: "TickerList",
kind: "enyo.FittableRows",
fit: !0,
components: [ {
name: "ticker",
kind: "enyo.List",
count: 1,
onSetupItem: "setupItem",
style: "width: 100%; overflow: hidden;",
components: [ {
name: "entry",
style: "float: left; height: 32px; clear: left;"
}, {
fit: !0
}, {
name: "xx",
kind: "onyx.Icon",
showing: !1,
src: "assets/not_small.png",
ontap: "removeData",
style: "float: right; clear: right; color: red;"
} ]
} ],
handlers: {
onSetupItem: "setupItem"
},
events: {
onRenderDrawer: ""
},
create: function(e) {
LocalStorage.set("array", []), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments);
},
buttonClick: function(e, t) {
var n = [ 1, 2, 3 ];
Data.countAdd(n), this.refreshList();
},
addToArray: function(e) {
this.log(e);
var t = LocalStorage.get("array");
t.push(e), LocalStorage.set("array", t), this.refreshList();
},
removeData: function(e, t) {
var n = Data.countGetAtIndex(t.index), r = n.shift();
Data.countRemove(t.index), enyo.Signals.send("onDataRemove", {
index: t.index,
name: r
}), this.refreshList();
},
getReversedIndex: function(e) {
var t = LocalStorage.get("array");
return t.length - 1 - e;
},
setupItem: function(e, t) {
var n = Data.countGetAtIndex(t.index);
n != -1 && (n.shift(), n.shift(), this.$.entry.setContent("1 " + n.join(" ")), this.$.xx.show());
},
refreshList: function() {
Data.countSize() <= 10 && (this.$.ticker.setCount(Data.countSize()), this.$.ticker.refresh()), this.$.ticker.reset(), this.doRenderDrawer();
},
getData: function() {
var e = LocalStorage.get("array");
return e;
}
});

// Timer.js

enyo.kind({
name: "Timer",
kind: "enyo.Control",
published: {
title: "Counter",
length: 1e4,
resetInterval: 3e3
},
handlers: {
onFifteenMinutes: "timerChanged",
onStartTimer: "timerStarted"
},
events: {
onTimerStarted: ""
},
components: [ {
name: "button",
kind: "enyo.Button",
style: "width: 100%;",
ontap: "buttonClick",
classes: "onyx-affirmative",
components: [ {
name: "timer",
kind: "enyo.FittableColumns",
components: [ {
name: "label",
content: "Tap to Start "
}, {
fit: !0
}, {
name: "counter",
content: "00:00:00",
style: "padding: 0px 10px;"
} ]
} ]
} ],
create: function(e, t) {
this.inherited(arguments), this.started = !1, this.count = 0;
},
buttonClick: function(e, t) {
this.doTimerStarted(), this.started ? (clearInterval(this.job), this.$.label.setContent("Tap to Start"), this.$.button.addRemoveClass("onyx-negative", !1), this.$.button.addRemoveClass("onyx-affirmative", !0)) : (this.job = setInterval(enyo.bind(this, "sendSeconds"), 1e3), this.$.label.setContent("Tap to Stop"), this.$.button.addRemoveClass("onyx-affirmative", !1), this.$.button.addRemoveClass("onyx-negative", !0)), this.started = !this.started;
},
sendSeconds: function() {
this.count * 1e3 % this.resetInterval === 0 && this.$.counter.setContent("00:00:00");
if (this.count * 1e3 < this.length) {
this.log();
var e = this.$.counter.getContent(), t = e.split(":");
if (Number(t[2]) === 59) {
t[2] = "00";
if (Number(t[1]) === 59) {
t[1] = "00";
var n = (Number(t[0]) + 1).toString();
n.length < 2 && (n = "0" + n), t[0] = n;
} else {
var n = (Number(t[1]) + 1).toString();
n.length < 2 && (n = "0" + n), t[1] = n;
}
} else {
var n = (Number(t[2]) + 1).toString();
n.length < 2 && (n = "0" + n), t[2] = n;
}
this.$.counter.setContent(t.join(":"));
} else this.buttonClick();
this.count++;
}
});

// Toolbar.js

enyo.kind({
name: "Toolbar",
kind: "onyx.Toolbar",
published: {
header: ""
},
events: {
onHeader: "",
onToggleMenu: ""
},
components: [ {
kind: "onyx.Grabber",
ontap: "doToggleMenu",
style: "float: left;"
}, {
name: "header",
content: "",
ontap: "doHeader",
style: "padding-top: 4px"
} ],
create: function() {
this.inherited(arguments), this.headerChanged();
},
headerChanged: function() {
this.$.header.setContent(this.getHeader());
}
});

// TryComplexSensr.js

enyo.kind({
name: "TryComplexSensr",
style: "background-color: #254048;",
published: {
complex: !1
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
onGPSSet: "currentLocation",
onDrawerOk: "openDrawer2",
onRenderDrawer: "renderDrawer2"
},
components: [ {
kind: "enyo.Signals",
onGPSSet: "currentLocation",
onPinClicked: "chosenLocation",
onPhotoData: "photoData",
onButtonGroupChosen: "renderSubmitButton"
} ],
create: function(e, t) {
this.inherited(arguments);
},
rendered: function(e, t) {
this.inherited(arguments), this.log(), this.resized(), this.reflow();
},
recreate: function() {
this.log(), this.createComponent({
name: "formDiv",
components: []
}), this.complex ? (this.$.formDiv.createComponent({
name: "acc",
components: []
}), this.$.formDiv.$.acc.createComponent({
content: "Questions about you",
ontap: "activateFormDrawer",
classes: "accordionHeader"
}, {
owner: this
}), this.$.formDiv.$.acc.createComponent({
name: "qs",
kind: "onyx.Drawer",
open: !1,
components: [],
style: "white-space: nowrap; overflow: scroll;"
}), this.$.formDiv.$.acc.$.qs.createComponent({
kind: "enyo.Scroller",
vertical: "scroll",
strategyKind: "TranslateScrollStrategy",
name: "accordionItemContent",
components: []
})) : (this.$.formDiv.createComponent({
name: "qbody",
fit: !0,
components: []
}), this.$.formDiv.$.qbody.createComponent({
name: "imgDiv",
classes: "imgDiv",
components: []
}), this.$.formDiv.$.qbody.$.imgDiv.createComponent({
name: "photoButton",
kind: "onyx.Button",
content: "Take Photo",
style: "width: 100%;",
ontap: "retakePhoto",
classes: "onyx-affirmative"
}, {
owner: this
})), this.$.formDiv.createComponents([ {
fit: !0
}, {
kind: "onyx.Button",
classes: "onyx-negative",
content: "Cancel",
ontap: "close",
style: "width: 50%; bottom: 0px; clear: left;"
}, {
name: "submit",
kind: "onyx.Button",
classes: "onyx-affirmative",
content: "Submit",
ontap: "buildAndSendSubmission",
style: "width: 50%; bottom: 0px; clear: right;"
} ], {
owner: this
});
},
activateFormDrawer: function(e, t) {
e.addRemoveClass("accordionHeaderHighlight", !this.$.formDiv.$.acc.$.qs.open), this.$.formDiv.$.acc.$.qs.setOpen(!this.$.formDiv.$.acc.$.qs.open);
},
activateFormDrawer2: function(e, t) {
this.waterfall("on2DrawerClick");
},
openDrawer2: function(e, t) {
return this.$.draw2.addRemoveClass("accordionHeaderHighlight", !this.$.formDiv.$.acc.$.qs1.open), this.$.formDiv.$.acc.$.qs1.setOpen(!this.$.formDiv.$.acc.$.qs1.open), !0;
},
currentLocation: function(e, t) {
this.gps_location = t.prop;
},
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
renderDrawer2: function(e, t) {
this.$.draw2.render();
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
this.task = e.tasks[0], this.campTitle = e.title, questionBody = [], this.$.formDiv != undefined && this.$.formDiv.getComponents().length > 0 && (this.$.formDiv.destroyClientControls(), this.$.formDiv.destroy()), this.recreate(), this.complex ? questionBody.push(this.$.formDiv.$.acc.$.qs.$.accordionItemContent) : questionBody.push(this.$.formDiv.$.qbody);
for (i in this.task.questions) {
var t = this.task.questions[i], n = "name_" + t.id;
type = t.type;
if (type.indexOf("complex") != -1) {
type = "counter";
var r = type.search(/\d/), s = 0;
if (r != -1) var s = type.charAt(r);
if (s != questionBody.length && this.complex) {
var o = "qs" + (s + 1);
this.$.formDiv.$.acc.createComponent({
name: "draw2",
content: "Count Bicycles and/or Pedestrians",
ontap: "activateFormDrawer2",
classes: "accordionHeader"
}, {
owner: this
}), this.$.formDiv.$.acc.createComponent({
name: o,
kind: "onyx.Drawer",
open: !1,
components: [],
style: "white-space: nowrap; overflow: hidden;"
}), this.$.formDiv.$.acc.$[o].createComponent({
name: "accordionItemContent",
components: []
}), questionBody.push(this.$.formDiv.$.acc.$[o].$.accordionItemContent);
}
}
switch (type) {
case "text":
questionBody[0].createComponent({
name: n,
style: "clear: both;",
content: t.question
}), this.newFormText(t);
break;
case "exclusive_multiple_choice":
questionBody[0].createComponent({
name: n,
style: "clear: both;",
content: t.question
}), this.newFormExclusiveChoice(t);
break;
case "multiple_choice":
questionBody[0].createComponent({
name: n,
style: "clear: both;",
content: t.question
}), this.newFormMultipleChoice(t);
break;
case "counter":
this.newFormCounter(t);
break;
case "cur_time":
this.newTime(t);
break;
default:
}
}
this.render();
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
this.complex || this.fileEntry(this.$.imgDiv.$.myImage.src);
if (this.imageOK ? !this.complex : this.complex) {
var e = {
submission: {
task_id: this.task.id,
gps_location: "testy test",
user_id: 5,
img_path: "test",
answers: []
}
}, t = this.gps_location.latitude + "|" + this.gps_location.longitude;
e.submission.gps_location = t, e.submission.user_id = LocalStorage.get("user");
for (i in this.task.questions) {
var n = this.task.questions[i];
type = n.type;
if (type.indexOf("complex") != -1) {
type = "counter";
var r = type.search(/\d/), s = 0;
if (r != -1) var s = type.charAt(r);
if (s != questionBody.length && this.complex) var o = "qs" + (s + 1);
}
var u = {
answer: "BOOM",
type: n.type,
q_id: n.id,
sub_id: 0
};
switch (type) {
case "text":
u.answer = this.readFormText(n);
break;
case "exclusive_multiple_choice":
u.answer = this.readFormExclusiveChoice(n);
break;
case "multiple_choice":
u.answer = this.readFormMultipleChoice(n);
break;
case "counter":
u.answer = this.readFormCounter(n);
break;
case "cur_time":
u.answer = this.readTime(n);
break;
default:
continue;
}
e.submission.answers.push(u);
}
this.log("SENDING TO SERVER: " + JSON.stringify(e));
var a = Data.getURL() + "submission.json", f = new enyo.Ajax({
contentType: "application/json",
method: "POST",
url: a,
postBody: JSON.stringify(e),
cacheBust: !1,
handleAs: "json"
});
f.response(this, "handlePostResponse"), f.go();
}
}
},
handlePostResponse: function(e, t) {
this.log("SERVER RESPONSE CAME BACK"), this.bubble("onSubmissionMade"), this.camComplete = !1, this.$.submit.setDisabled(!0), this.chosen_location = undefined, LocalStorage.remove("image"), this.imageOK = !1, !this.complex && this.$.imgDiv.getComponents().length > 0 && this.$.imgDiv.destroyComponents();
},
imageSubmission: function(e, t) {
this.log(JSON.stringify(e)), this.log(JSON.stringify(t));
},
close: function() {
this.bubble("onSubmissionMade");
},
testButtons: function(e, t) {
enyo.Signals.send("onButtonGroupChosen", e);
},
newFormText: function(e) {
var t = "inputDec_" + e.id, n = "input_" + e.id;
questionBody[0].createComponent({
name: t,
style: "clear: both;",
kind: "onyx.InputDecorator",
classes: "onyx-input-decorator",
components: [ {
name: n,
kind: "onyx.Input",
classes: "onyx-input"
} ]
}, {
owner: questionBody[0]
});
},
newFormExclusiveChoice: function(e) {
var t = "input_" + e.id, n = e.options.split("|"), r = [];
for (i in n) i == 0 ? r.push({
content: n[i],
active: !0,
ontap: "testButton"
}) : r.push({
content: n[i],
ontap: "testButtons"
});
questionBody[0].createComponent({
name: t,
kind: "onyx.RadioGroup",
components: r
}, {
owner: this
});
},
newTime: function(e) {
var t = new Date, n = t.toTimeString().split(" ")[0], r = "time_" + e.id;
questionBody[0].createComponent({
content: e.question
}), questionBody[0].createComponent({
name: r,
content: n,
time: t.toTimeString()
});
},
newFormMultipleChoice: function(e) {
var t = e.options.split("|");
questionBody[0].createComponent({
name: "groupbox",
kind: "onyx.Groupbox",
components: []
}, {
owner: questionBody[0]
});
for (i in t) {
var n = "checkbox_" + i, r = "content_" + i, s = [];
questionBody[0].$.groupbox.createComponent({
name: n,
kind: "onyx.Checkbox",
onchange: "testButtons",
style: "float: left; clear: left;"
}, {
owner: this
}), questionBody[0].$.groupbox.createComponent({
name: r,
content: t[i],
style: "float: left; clear: right;"
}), questionBody[0].$.groupbox.createComponent({
tag: "br"
});
}
},
newFormCounter: function(e) {
var t = "name_" + e.id, n = "counter_" + e.id, r;
for (x in this.task.questions) if (this.task.questions[x].type === "exclusive_multiple_choice") {
r = this.task.questions[x].id.toString();
break;
}
var i = "input_" + r;
e.type.split("_")[1].indexOf("2") === -1 ? questionBody[1].createComponent({
name: n,
kind: "BikeCounter",
title: e.question,
style: "clear: both;"
}) : questionBody[2].createComponent({
name: n,
kind: "BikeCounter",
title: e.question,
style: "clear: both;"
});
},
readFormText: function(e) {
var t = "input_" + e.id;
return questionBody[0].$[t].getValue();
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
c = "counter_" + e.id;
for (var n in questionBody) {
var r = questionBody[n].$[c];
if (r === undefined) continue;
t = r.getData();
}
return t.join("|");
},
readTime: function(e) {
var t = "time_" + e.id;
return questionBody[0].$[t].time;
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
this.watchId && this.stopWatch(), this.inherited(arguments);
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
