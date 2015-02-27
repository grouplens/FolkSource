/* PivotMenuSample.js */

enyo.kind({
  name: "PivotMenuSample",
  kind: "rwatkins.PivotMenu",
  classes: "enyo-unselectable",

  margin: 100, // px margin
  headerOffset: 140,

  components: [

    { name: "panel1", classes: "pivotmenu-panel",
      horizontal: "hidden",
      header: "first header",
      title: "first title",
      components: [
        { content: "First. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat." }
      ]
    },

    { name: "panel2", classes: "pivotmenu-panel",
      horizontal: "hidden",
      header: "second header",
      title: "second title",
      components: [
        { content: "Second. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat." }
      ]
    },

    { name: "panel3", classes: "pivotmenu-panel",
      horizontal: "hidden",
      header: "third header",
      title: "third title",
      components: [
        { content: "Third. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat." }
      ]
    },

    { name: "panel4", classes: "pivotmenu-panel",
      horizontal: "hidden",
      header: "fourth header",
      title: "last title",
      components: [
        { content: "Fourth.  Vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi." }
      ]
    }

  ]

});