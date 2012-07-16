            {kind: "AccordionItem", headerTitle: "Senses", contentComponents: [
                //camera in particular
                {tag: "div", style: "background-color: #0B333E;", components: [
                    {kind: "Image", src: "./kinds/images/bikerack.jpg", style: "width: 90%; height: 80%"},
                    {name: "camDiv", style: "width: 90%; height: 80%; background-color: blue;"},
                    {kind: "onyx.Button", content: "-", style: "float: left;", classes: "onyx-negative", ontap: "retakePhoto"},
                    {kind: "onyx.Button", content: "+", style: "float: right;", classes: "onyx-affirmative", ontap: "photoOk"}
                ]}
            ]},
            {kind: "AccordionItem", headerTitle: "Count Form", contentComponents: [
                {content: "Name of Agency/Organization:"},
                {kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [
                    {kind: "onyx.Input", classes: "onyx-input", defaultFocus: true}
                ]},
                {tag: "hr"},
                {content: "Counter Name(s):"},
                {kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [
                    {kind: "onyx.Input", classes: "onyx-input", defaultFocus: true}
                ]},
                {tag: "hr"},
                {content: "Count Start Time:"},
                {kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [
                    {kind: "onyx.Input", classes: "onyx-input", defaultFocus: true}
                ]},
                {tag: "hr"},
                {content: "Type of Count: "},
                {kind: "onyx.RadioGroup", highlander: true, components: [
                    {content: "Bikes"},
                    {content: "Pedestrians"},
                    {content: "Both", active: true}
                ]},
                {tag: "hr"},
                {content: "Notes:"},
                {kind: "onyx.InputDecorator", classes: "onyx-input-decorator", components: [
                    {kind: "onyx.Input", classes: "onyx-input", defaultFocus: true}
                ]},
                {tag: "hr"},
            ]},
            {kind: "AccordionItem", headerTitle: "Hour 1", contentComponents: [
                //{kind: "enyo.Scroller", touchScrolling: true, vertical: true, horizontal: false, components: [
                    {content: ":00 - :15"},
                    {tag: "hr"},
                    {kind: "Counter", title: "Bikes - M", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Bikes - F", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Peds - M", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Peds - F", style: "width: 25%; float: left;"},
                    {tag: "hr"},
                    {content: ":15 - :30"},
                    {tag: "hr"},
                    {kind: "Counter", title: "Bikes - M", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Bikes - F", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Peds - M", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Peds - F", style: "width: 25%; float: left;"},
                    {tag: "hr"},
                    {content: ":30 - :45"},
                    {tag: "hr"},
                    {kind: "Counter", title: "Bikes - M", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Bikes - F", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Peds - M", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Peds - F", style: "width: 25%; float: left;"},
                    {tag: "hr"},
                    {content: ":45 - :00"},
                    {tag: "hr"},
                    {kind: "Counter", title: "Bikes - M", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Bikes - F", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Peds - M", style: "width: 25%; float: left;"},
                    {kind: "Counter", title: "Peds - F", style: "width: 25%; float: left;"},
                    {tag: "hr"}
            //]}
            ]}
            //{kind: "AccordionItem", headerTitle: "Hour 2", contentComponents: [
            //]}
