function contains(list, obj) {

    for (var i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true
        }
    }
    return false

}

function abs(a) {
    return a >= 0 ? a : -a;
}


function mod(a, b){
    while(a < 0){
        a += b
    }
    return a % b
}


function log(message, longMessage){
    var lineAndSource = ((new Error).stack.split("\n")[1].split("/")).reverse()[0]
    console.log("[" + lineAndSource + "] " + message + (longMessage === undefined ? "" : "\n" + longMessage + "\n"))
}

function error(message, longMessage){
    var lineAndSource = ((new Error).stack.split("\n")[1].split("/")).reverse()[0]
    console.error("[" + lineAndSource + "] " + message + (longMessage === undefined ? "" : "\n" + longMessage + "\n"))
}

function warn(message, longMessage){
    var lineAndSource = ((new Error).stack.split("\n")[1].split("/")).reverse()[0]
    console.warn("[" + lineAndSource + "] " + message + (longMessage === undefined ? "" : "\n" + longMessage + "\n"))
}

function info(message, longMessage){
    var lineAndSource = ((new Error).stack.split("\n")[1].split("/")).reverse()[0]
    console.info("[" + lineAndSource + "] " + message + (longMessage === undefined ? "" : "\n" + longMessage + "\n"))
}

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length !== array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] !== array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

