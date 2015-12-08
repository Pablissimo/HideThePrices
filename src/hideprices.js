var enabled = false;

chrome.storage.sync.get("enabled", function (val) {
    enabled = val.enabled;

    if (val.enabled) {
        walk(window.document);
    }
});

chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === "sync") {
        enabled = changes.enabled.newValue;

        walk(window.document);
    }
});

function onDomChanged(e) {
    walk(e.relatedNode);
}

window.addEventListener("DOMNodeInserted", onDomChanged, true);

// Directly and blatantly ripping off Cloud To Butt
// https://github.com/panicsteve/cloud-to-butt

function walk(node) {
    // I stole this function from here:
    // http://is.gd/mwZp7E

    var child, next;

    switch (node.nodeType) {
        case 1:  // Element
        case 9:  // Document
        case 11: // Document fragment
            child = node.firstChild;
            while (child) {
                next = child.nextSibling;
                walk(child);
                child = next;
            }
            break;

        case 3: // Text node
            if (enabled) {
                handleText(node);
            }
            else {
                undo(node);
            }
            break;
    }
}

function handleText(textNode) {
    var v = textNode.nodeValue;
    var re = /[\$£€]{1}[0-9,\.]+/;

    if (re.test(v)) {
        v = v.replace(/[\$£€]{1}[0-9,\.]+/, "???");
        
        textNode.hidePricesOld = textNode.nodeValue;
    }

    textNode.nodeValue = v;
}

function undo(textNode) {
    if (textNode.hidePricesOld) {
        textNode.nodeValue = textNode.hidePricesOld;
        textNode.hidePricesOld = null;
    }
}