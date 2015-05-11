enyo.kind({
  name: "Try",
  components: [
      {kind: enyo.Panels, name: "taskpanels", arrangerKind: enyo.CardArranger, fit: true, style: "min-height: 100%;", components: [
        {kind: enyo.FittableColumns, style: "height: 100%;", components: [
          {name: "leftButton", kind: onyx.Button, slide: "prev", ontap: "buttonTapHandler", classes: "button-style filledButtons", disabled: !0, components: [
            {tag: "i", classes: "fa fa-chevron-left fa-2x color-icon"}
          ]},
          {name: "panels", kind: enyo.Panels, arrangerKind: enyo.CarouselArranger, fit: true, onTransitionFinish: "transitionFinishHandler", onTransitionStart: "transitionStartHandler", classes: "filledPanels light-background", layoutKind: enyo.FittableColumnsLayout},
          {name: "rightButton", kind: onyx.Button, slide: "next", ontap: "buttonTapHandler", classes: "button-style filledButtons", components: [
            {tag: "i", classes: "fa fa-chevron-right fa-2x color-icon"}
          ]},
        ]},
        {name: "task_content", kind: enyo.FittableRows, components: [
          {name: "task_description", fit: true, classes: "dark-background", content: "test"},
          {name: "buttons", kind: enyo.ToolDecorator, classes: "senseButtons", components: [
            {name: "remove", kind: onyx.Button, classes: "button-style button-style-negative", ontap: "cancelTask", components: [
              {tag: "i", classes: "fa fa-ban fa-large"}
            ]},
            {name: "submit", kind: onyx.Button, classes: "button-style button-style-affirmative", ontap: "triggerTask", components: [
              {tag: "i", classes: "fa fa-check fa-large"}
            ]}
          ]}
        ]}
      ]}
  ]
});
