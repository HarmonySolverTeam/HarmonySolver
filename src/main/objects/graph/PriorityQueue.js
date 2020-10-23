// priority queue of type MIN
function PriorityQueue (priorityAttribute) {

    this.nodeList = []
    this.priorityAttribute = priorityAttribute;  //for graph it is destanceFromBegining

    this.insert = function (node){
        this.nodeList.push(node);
    }

    // return 1 if first > second
    // return 0 if first = second
    // return -1 if first < second
    var compare = function(first, second){

        if(first === undefined || second === undefined)
            throw "Illegal argument exception: arguments of compare cannot be undefined";

        var sign = function(x){
            if(x > 0) return 1;
            if(x < 0) return -1;
            return 0;
        }

        if(first === "infinity" && second === "infinity") return 0;
        if(first !== "infinity" && second !== "infinity") return sign(first - second) ;
        if(first !== "infinity" && second === "infinity") return -1;
        if(first === "infinity" && second !== "infinity") return 1;

    }

    this.extractMin = function () {
        if(this.nodeList.length === 0) return "empty";

        var indexOfMin = 0;
        for(var i=0; i<this.nodeList.length; i++){
            if( compare(this.nodeList[i][this.priorityAttribute], this.nodeList[indexOfMin][this.priorityAttribute]) === -1 )
                indexOfMin = i;
        }

        var min = this.nodeList[indexOfMin];
        this.nodeList.splice(indexOfMin, 1);
        return min;
    }

    this.decreaseKey = function (node, key) {
        if(node[this.priorityAttribute] < key)
            throw "Given key: " + key + " is greater than current key of given node:" + node[this.priorityAttribute];

        node[this.priorityAttribute] = key;
    }

    this.isEmpty = function (){
        return this.nodeList.length === 0;
    }

    this.isNotEmpty = function () {
        return this.nodeList.length !== 0;
    }
}