enyo.kind({
	name: "BikeCounter",
	kind: enyo.FittableRows,
	//classes: "niceish-padding",
	fit: true,
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
	components: [
		{kind: "enyo.Signals", onButtonGroupChosen: "fixIt", onDataRemove: "removeItem"},
		{name: "timer", kind: "Timer", length: 7200000, resetInterval: 900000},
		{name: "totalCountContainer", kind: enyo.FittableColumns, components: [
			{kind: "onyx.Button", content: "Undo", ontap: "popup"},
			{fit: true},
			{content: "Total Count: "},
			{name: "totalCount", content: 0}
		]},
		{name: "tabula", tag: "table", fit: true, style: "width: 100%;", disabled: true, components: [
			//row 0
			{name: "row0", tag: "tr", classes: "tableCellHeight", style: "max-height: 20%;", components: [
				{tag: "td"}, 
				{tag: "td"}, 
				{tag: "td", attributes: {colspan: 2}, style: "text-align: center;", components: [
					{kind: "onyx.Icon", src: "assets/bike_small.png"}
				]},
				{tag: "td"}, 
				{tag: "td", attributes: {colspan: 2}, style: "text-align: center;", components: [
					{kind: "onyx.Icon", src: "assets/ped_small.png"}
				]},
				//{tag: "td"},
			]},
			//row 1
			{name: "row1", tag: "tr", classes: "tableCellHeight", style: "max-height: 20%;", components: [
				{tag: "td"}, 
				{tag: "td"}, 
				{tag: "td", classes: "tableMen", components: [
					{kind: "onyx.Icon", src: "assets/man_small.png"}
				]},
				{tag: "td", classes: "tableWomen", components: [
					{kind: "onyx.Icon", src: "assets/woman_small.png"}
				]},
				{tag: "td"}, 
				{tag: "td", classes: "tableMen", components: [
					{kind: "onyx.Icon", src: "assets/man_small.png"}
				]},
				{tag: "td", classes: "tableWomen", components: [
					{kind: "onyx.Icon", src: "assets/woman_small.png"}
				]}
			]},
			//row 2
			{name: "row2", tag: "tr", style: "max-height: 20%;", components: [
				{name: "adultTitle",  attributes: {rowspan: 2}, tag: "td", classes: "tableCellWidth", components: [
					{kind: "onyx.Icon", src: "assets/adult_small.png"}
				]},
				{tag: "td", classes: "tableCellWidth", components: [
					{kind: onyx.Icon, src: "assets/helmet_small.png"}
				]},
				{tag: "td", classes: "tableCellMen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "maleAdultHelmet", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 2, col: 2},
				]},
				{tag: "td", classes: "tableCellWomen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "femaleAdultHelmet", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 2, col: 3}
				]},
				{tag: "td", classes: "tableCellWidth",  components: [
					{kind: onyx.Icon, src: "assets/assistive_small.png"}
				]},
				{tag: "td", classes: "tableCellMen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "maleAdultAsst", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 2, col: 5},
				]},
				{tag: "td", classes: "tableCellWomen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "femaleAdultAsst", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 2, col: 6}
				]}
			]},
			//row 3
			{name: "row3", tag: "tr", style: "max-height: 20%;", components: [
				{tag: "td", classes: "tableCellWidth",  components: [
					{kind: onyx.Icon, src: "assets/not_small.png"}
				]},
				{tag: "td", classes: "tableCellMen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "maleAdultBike", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 3, col: 2},
				]},
				{tag: "td", classes: "tableCellWomen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "femaleAdultBike", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 3, col: 3}
				]},
				{tag: "td", classes: "tableCellWidth",  components: [
					{kind: onyx.Icon, src: "assets/not_small.png"}
				]},
				{tag: "td", classes: "tableCellMen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "maleAdultPed", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 3, col: 5},
				]},
				{tag: "td", classes: "tableCellWomen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "femaleAdultPed", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 3, col: 6}
				]}
			]},
			//row 4
			{name: "row4", tag: "tr", style: "max-height: 20%;", components: [
				{name: "kidTitle",tag: "td", attributes: {rowspan: 2}, classes: "tableCellWidth", components: [
					{kind: "onyx.Icon", src: "assets/child_small.png"}
				]},
				{tag: "td", classes: "tableCellWidth", components: [
					{kind: onyx.Icon, src: "assets/helmet_small.png"}
				]},
				{tag: "td", classes: "tableCellMen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "maleChildHelmet", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 4, col: 2},
				]},
				{tag: "td", classes: "tableCellWomen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "femaleChildHelmet", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 4, col: 3}
				]},
				{tag: "td", classes: "tableCellWidth", components: [
					{kind: onyx.Icon, src: "assets/assistive_small.png"}
				]},
				{tag: "td", classes: "tableCellMen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "maleChildAsst", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 4, col: 5},
				]},
				{tag: "td", classes: "tableCellWomen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "femaleChildAsst", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 4, col: 6}
				]}
			]},
			//row 5
			{name: "row5", tag: "tr", style: "max-height: 20%;", components: [
				//{tag: "td"},
				{tag: "td", classes: "tableCellWidth", components: [
					{kind: onyx.Icon, src: "assets/not_small.png"}
				]},
				{tag: "td", classes: "tableCellMen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "maleChildBike", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 5, col: 2},
				]},
				{tag: "td", classes: "tableCellWomen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "femaleChildBike", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 5, col: 3}
				]},
				{tag: "td", classes: "tableCellWidth", components: [
					{kind: onyx.Icon, src: "assets/not_small.png"}
				]},
				{tag: "td", classes: "tableCellMen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "maleChildPed", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 5, col: 5},
				]},
				{tag: "td", classes: "tableCellWomen", layoutKind: enyo.FittableColumnsLayout, components: [
					{name: "femaleChildPed", kind: "TallyCounter", onup: "highlightRowsColumns", ondown: "highlightRowsColumns", row: 5, col: 6}
				]}
			]}
		]},
		{name: "popup", kind: "onyx.Popup", scrim: true, scrimWhenModal: false, centered: true, modal: true, autoDismiss: true, floating: true, style: "width: 80%; height: 80%;", /*layoutKind: "enyo.FittableRowsLayout",*/ components: [
			{kind: "onyx.Button", content: "Close", ontap: "popdown", style: "width: 100%; clear: both;"},
			{name: "ticker", fit: true, style: "clear: both;", kind: "TickerList"}
		]}
		//]}
	],
	create: function(a, b) {
		this.inherited(arguments);

		this.gender = false;
		this.age = false;

		this.bike = true;
		this.ped = true;

		this.assisted = false;
		this.helmet = false;

		LocalStorage.set("dataArray", []);
		LocalStorage.remove("countData");
		this.enabled = true;
		this.toggleTableEnabled();
		this.build();
	},
	reset: function() {
		var rows = this.$.tabula.children;
		for (var i in rows) {
			rows[i].addRemoveClass("tableHideCollapse", false);
			var cols = rows[i].children;
			for(var j in cols) {
				cols[j].addRemoveClass("tableHideCollapse", false);
				cols[j].addRemoveClass("tableHideKeep", false);
			}
		}
	},
	popup: function(inSender, inEvent) {
		this.$.popup.resized();
		this.$.popup.render();
		this.$.popup.show();
	},
	popdown: function(inSender, inEvent) {
		this.$.popup.hide();
	},
	build: function(inSender, inEvent) {
		/*if(!this.age) {
			this.row4.addRemoveClass("tableHideCollapse", !this.age);
			this.row5.addRemoveClass("tableHideCollapse", !this.age);
		}*/
		var rows = this.$.tabula.children;
		this.reset();
		var k = 0;
		for (var i in rows) {
			var cols = rows[i].children;
			for (var j in cols) {
				//bike vs. ped
				
				if (!this.ped) {
					if(j > 3)
						cols[j].addRemoveClass("tableHideCollapse", !this.ped);
					else if(j == 3 && (i == 0 || i == 3 || i == 5))
						cols[j].addRemoveClass("tableHideCollapse", !this.ped);
				}

				//post-setup for colspan/rowspan
				if(!this.gender) {
					var row = rows[0].children;
					row[2].setAttribute("colspan", 1); 
					row[4].setAttribute("colspan", 1); 
				} else {
					var row = rows[0].children;
					row[2].setAttribute("colspan", 2); 
					row[4].setAttribute("colspan", 2); 
				}
				if(this.age && !this.helmet && !this.assisted) {
					var row1 = rows[2].children;
					var row2 = rows[4].children;
					row1[0].setAttribute("rowspan", 1);
					row2[0].setAttribute("rowspan", 1);
				} else {
					var row1 = rows[2].children;
					var row2 = rows[4].children;
					row1[0].setAttribute("rowspan", 2);
					row2[0].setAttribute("rowspan", 2);
				}

				switch(i) {
					case "0":
						if(!this.age) {
							if(j == 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.age);
						}
						if(!this.helmet) {
							if(j == 1)
								cols[j].addRemoveClass("tableHideCollapse", !this.helmet);
						}
						if(!this.assisted) {
							if(j == 3)
								cols[j].addRemoveClass("tableHideCollapse", !this.assisted);
						}
						if(!this.bike) {
							if(j < 3 && j > 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.bike);
						}
					break;
					case "1":
						if(!this.gender) {
							rows[i].addRemoveClass("tableHideCollapse", !this.gender);
							cols[j].addRemoveClass("tableHideCollapse", !this.gender);
						}
						if(!this.age) {
							if(j == 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.age);
						}
						if(!this.helmet) {
							if(j == 1)
								cols[j].addRemoveClass("tableHideCollapse", !this.helmet);
						}
						if(!this.assisted) {
							if(j == 4)
								cols[j].addRemoveClass("tableHideCollapse", !this.assisted);
						}
						if(!this.bike) {
							if(j < 4 && j > 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.bike);
						}
					break;
					case "2":
						if(!this.gender) {
							if(j % 3 == 0 && j > 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.gender);
						}
						if(!this.age) {
							if(j == 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.age);
						}
						if(!this.helmet) {
							if(j == 1)
								cols[j].addRemoveClass("tableHideCollapse", !this.helmet);
						}
						if(!this.assisted) {
							if(j == 4)
								cols[j].addRemoveClass("tableHideCollapse", !this.assisted);
						}
						if(!this.bike) {
							if(j > 0 && j < 4)
								cols[j].addRemoveClass("tableHideCollapse", !this.bike);
						}
					break;
					case "3":
						if(!this.helmet && !this.assisted) {
							rows[i].addRemoveClass("tableHideCollapse", (!this.helmet && !this.assisted));
						}	
						if(!this.gender) {
							if(j % 2 == 0 && j > 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.gender);
						}
						if(!this.helmet) {
							if(j < 3)
								cols[j].addRemoveClass("tableHideKeep", !this.helmet);
							if(j == 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.helmet);
						}
						if(!this.assisted) {
							if(j > 3 || j < 1)
								cols[j].addRemoveClass("tableHideCollapse", !this.assisted);
						}
						if(!this.bike) {
							if(j < 3)
								cols[j].addRemoveClass("tableHideCollapse", !this.bike);
						}
					break;
					case "4":
						if(!this.gender) {
							if(j % 3 == 0 && j > 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.gender);
						}
						if(!this.age) {
							cols[j].addRemoveClass("tableHideCollapse", !this.age);
						}
						if(!this.helmet) {
							if(j == 1)
								cols[j].addRemoveClass("tableHideCollapse", !this.helmet);
						}
						if(!this.assisted) {
							if(j == 4)
								cols[j].addRemoveClass("tableHideCollapse", !this.assisted);
						}
						if(!this.bike) {
							if(j > 0 && j < 4)
								cols[j].addRemoveClass("tableHideCollapse", !this.bike);
						}
					break;
					case "5":
						if(!this.helmet && !this.assisted) {
							rows[i].addRemoveClass("tableHideCollapse", (!this.helmet && !this.assisted));
						}	
						if(!this.gender) {
							if(j % 2 == 0 && j > 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.gender);
						}
						if(!this.age) {
							cols[j].addRemoveClass("tableHideCollapse", !this.age);
						}
						if(!this.helmet) {
							if(j < 4)
								cols[j].addRemoveClass("tableHideKeep", !this.helmet);
							if(j == 0)
								cols[j].addRemoveClass("tableHideCollapse", !this.helmet);
						}
						if(!this.assisted) {
							if(j > 3 || j < 1)
								cols[j].addRemoveClass("tableHideCollapse", !this.assisted);
						}
						if(!this.bike) {
							if(j < 3)
								cols[j].addRemoveClass("tableHideCollapse", !this.bike);
						}
					break;
					default: 
					break;
				}
				
			}
		}
		this.render();
		return true;
	},
	fixIt: function(a, b) {
		var c, d, e;
		if(b.name.indexOf("checkbox") != -1) {
			c = b.name.split("_")[1];
			for(x in b.parent.children) {
				if(b.parent.children[x].name === "content_"+c)
					d = b.parent.children[x].getContent();
			}
			//d = b.parent.$["content_" + c].getContent();
			e = b.getValue();
		} 
		if (b.name.indexOf("radioButton") != -1) {
			d = b.content;
		}

		switch (d) {
			case "Age":
				this.age = e;
			break;
			case "Gender":
				this.gender = e;
			break;
			case "Assistive":
				this.assisted = e;
			break;
			case "Helmet":
				this.helmet = e;
			break;
			case "Both":
				this.bike = true;
				this.ped = true;
			break;
			case "Bicycles":
				this.bike = true;
				this.ped = false;
			break;
			case "Pedestrians":
				this.bike = false;
				this.ped = true;
			break;
		}
		this.build();
		this.render();
	},
	getData: function() {
		 var data = LocalStorage.get("countData");
		 if(data == undefined)
			 data = [];
		 return data;
	},
	storeCountData: function(inSender, inEvent) {
		var row = inEvent.row;
		var col = inEvent.column;
		var entry = [];
		entry.push(new Date(enyo.now()).toUTCString());
		
		//gender
		if(this.gender) {
			if(row == 2 || row == 4) {
				if(col == 2 || col == 5) {
					entry.push("male");
				} else if(col == 3 || col == 6) {
					entry.push("female");
				}
			} else {
				if(col == 2 || col == 5) {
					entry.push("male");
				} else if(col == 3 || col == 6) {
					entry.push("female");
				}
			}
		}

		//age
		if(this.age) {
			if(row < 4)
				entry.push("adult");
			else 
				entry.push("child");
		}

		//mode
		if(col < 4)
			entry.push("cyclist");
		else 
			entry.push("pedestrian");

		//helmet/assistive
		if(this.helmet || this.assisted) {
			var str = "";
			if(row % 2 != 0) {
				str = "not ";
			}

			if(col < 4)
				str += "wearing a helmet";
			else 
				str += "using an assistive device";
		}

		entry.push(str);
		this.log(entry.join(", "));
		Data.countAdd(entry);
	},
	removeItem: function(inSender, inEvent) {
		this.$[inEvent.name].children[0].decrement();
	},
	highlightRowsColumns: function(inSender, inEvent) {
		var truth = false;
		var inRow = inEvent.originator.container.row;
		var inCol = inEvent.originator.container.col;
		var subCol = 1;
		var tableRows = this.$.tabula.children;
		var tableColumns;
		var tmpIndex = 0;

		if(inEvent.type === "down")
			truth = true;
		else {
			this.$.totalCount.setContent(Number(this.$.totalCount.getContent()) + 1);
			this.$.totalCountContainer.resized();
		}

		//column headers
		if(inCol < 4) //pedestrians
			tableRows[0].children[2].addRemoveClass("highlight", truth);
		else if(inCol > 4) //cyclists
			tableRows[0].children[4].addRemoveClass("highlight", truth);

		//column sub-headers
		tableRows[1].children[inCol].addRemoveClass("highlight", truth);

		//column line-up
		for(var x = 2; x < tableRows.length; x++) {
			if(x == inRow)
				break;
			if(x % 2 == 0 && x != 0)
				tableRows[x].children[inCol].addRemoveClass("highlight", truth);
			else
				tableRows[x].children[inCol-1].addRemoveClass("highlight", truth);
		}

		//row headers
		if(inRow % 2 == 0)
			tableRows[inRow].children[0].addRemoveClass("highlight", truth);
		else 
			tableRows[inRow-1].children[0].addRemoveClass("highlight", truth);

		//row sub-headers
		tableRows[inRow].children[subCol].addRemoveClass("hightlight", truth);
		
		//row line-up
		for(var x = 1; x < tableRows[inRow].children.length; x++) {
			if(x == inCol)
				break;
			if(inRow % 2 == 0)
				tableRows[inRow].children[x].addRemoveClass("highlight", truth);
			else
				tableRows[inRow].children[x-1].addRemoveClass("highlight", truth);
		}
	},
	toggleTableEnabled: function(inSender, inEvent) {
		this.enabled = !this.enabled;

		var rows = this.$.tabula.children;
		for (var i in rows) {
			var cols = rows[i].children;
			for (var j in cols) {
				if(cols[j].children.length > 0) {
					if(cols[j].children[0].kind === "TallyCounter") {
						cols[j].children[0].setEnabled(this.enabled);
					}
				}
			}
		}
	}
});
