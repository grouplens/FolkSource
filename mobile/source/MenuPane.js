enyo.kind({
    name: "MenuPane",
    published: {
        menu: "",
        view: ""
    },
    events: {
        onViewChanged: "",
        onMenuOpened: "",
        onMenuClosed: ""
    },
    classes: "onyx menu-pane",
    style: "overflow: hidden;",
    position: {
        menu: {
            min: 0,
            max: 85
        }
    },
    controlParentName: "pane",
    components: [{
        name: "menu",
        classes: "enyo-fit menupane-menu",
        ontap: "menuTapHandler",
        style: "float: left;"
    }, {
        name: "pane",
        kind: "enyo.Slideable",
        classes: "menupane-pane enyo-fit",
        /*layoutKind: "enyo.FittableRowsLayout",
        fit: true,*/
        value: 0,
        min: 0,
        max: 85,
        unit: "%",
        draggable: !1,
        //style: "width: 100%; height: 100%;",
        onAnimateFinish: "paneAnimateFinishHandler"
    }],
    selectView: function (a) {
        var b = this.getClientControls();
        enyo.forEach(b, function (b) {
            b.name == a ? b.show() : b.hide();
        }, this), this.bubble("onViewChanged", undefined, a);
    },
    toggleMenu: function (a, b, c) {
        this.$.menu.setShowing(!c), this.$.pane.setMax(c ? this.position.secondarymenu.max : this.position.menu.max), this.$.pane.setMin(c ? this.position.secondarymenu.min : this.position.menu.min), this.$.pane.toggleMinMax();
    },
    create: function () {
        this.inherited(arguments), this.$.pane.$.animator.setDuration(250);
        var a = this.getClientControls();
        enyo.forEach(a, function (a) {
            a.hide();
        }, this), a && a[0] && this.setView(a[0].name);
    },
    initComponents: function () {
        this.inherited(arguments), this.$.menu.createComponents(this.menu, {
            owner: this
        });
    },
    menuTapHandler: function (a, b) {
        a.name == "secondarymenu" ? (this.$.pane.setMax(this.position.secondarymenu.max), this.$.pane.setMin(this.position.secondarymenu.min)) : (this.$.pane.setMax(this.position.menu.max), this.$.pane.setMin(this.position.menu.min));
        var c = enyo.bind(this, function (a) {
            return a.view ? a.view : a == this.$.menu || a == this.$.secondarymenu ? null : c(a.parent);
        }),
            d = c(b.originator);
        d && (this.getView() == d ? this.$.pane["animateTo" + (a.name == "secondarymenu" ? "Max" : "Min")]() : (this.$.pane.$.animator.setDuration(200), this.$.pane.animateTo(a.name == "secondarymenu" ? -100 : 100), this.toview = d));
    },
    viewChanged: function (a) {
        this.selectView(this.getView());
    },
    paneAnimateFinishHandler: function (a) {
        var b = a.getValue();
        Math.abs(b) == 100 ? (this.toview && (this.setView(this.toview), this.toview = null), setTimeout(enyo.bind(this, function () {
            this.$.pane.$.animator.setDuration(250), b < 0 ? a.animateToMax() : a.animateToMin();
        }), 1)) : this.$.menu.getShowing() ? a.getValue() == this.position.menu.max ? this.doMenuOpened() : this.doMenuClosed() : a.getValue() == this.position.secondarymenu.min ? this.doSecondaryMenuOpened() : this.doSecondaryMenuClosed();
    }
});
