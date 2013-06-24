enyo.kind({
    name: "LocalStorage",
    kind: "Component",
    statics: {
        set: function (a, b) {
            typeof a == "string" && (typeof b == "object" ? localStorage.setItem(a, JSON.stringify(b)) : typeof b == "string" && localStorage.setItem(a, b));
        },
        get: function (a) {
            var b;
            typeof a == "string" && (b = localStorage.getItem(a));
            if (typeof b == "string") return JSON.parse(b);
            if (typeof b == "object" && b !== null) throw enyo.log("OBJECT: " + b), "ERROR [Storage.get]: getItem returned an object. Should be a string.";
            typeof b != "undefined" && b !== null;
        },
        remove: function (a) {
            if (typeof a != "string") throw "ERROR [Storage.remove]: 'name' was not a String.";
            localStorage.removeItem(a);
        },
        __getSize: function () {
            var a, b = 0;
            for (a = 0; a < localStorage.length; a++) b += localStorage.getItem(localStorage.key()).length;
            return b;
        }
    }
});
