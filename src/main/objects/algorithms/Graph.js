.import "../utils/Utils.js" as Utils
.import "../commons/Errors.js" as Errors
.import "../commons/RulesCheckerUtils.js" as RulesCheckerUtils

function Node(content, nextNeighbours, prevNodes) {

    this.content = content;
    this.nextNeighbours = nextNeighbours === undefined ? [] : nextNeighbours;
    this.prevNodes = prevNodes === undefined ? [] : prevNodes;
    // this.pp2 = 0

    this.getPrevContentIfSingle = function () {
        var uniquePrevContents =  this.getUniquePrevContents();
        if(uniquePrevContents.length !== 1)
            throw new Errors.UnexpectedInternalError("Method not allowed in current state of node - there are "
                + this.getUniquePrevContents().length + " unique prev nodes contents instead of expected 1");

        return uniquePrevContents[0];
    }

    this.getUniquePrevContents = function () {
        var uniquePrevContents = []
        for (var i = 0; i < this.prevNodes.length; i++) {
            if (!Utils.contains(uniquePrevContents, this.prevNodes[i].content))
                uniquePrevContents.push(this.prevNodes[i].content)
        }
        return uniquePrevContents;
    }

    this.getUniquePrevContentsCount = function () {
        return this.getUniquePrevContents().length;
    }

    this.haveNext = function (){
        return this.nextNeighbours.length > 0;
    }

    this.havePrev = function () {
        return this.prevNodes.length > 0;
    }

    this.addNextNeighbour = function (neighbourNode) {
        this.nextNeighbours.push(neighbourNode);
        neighbourNode.node.prevNodes.push(this);
    }

    this.removeLeftConnections = function () {
        var prevNodes = this.prevNodes.slice();
        for(var i=0; i<prevNodes.length; i++){
            prevNodes[i].removeNextNeighbour(this)
        }
    }

    this.removeRightConnections = function () {
        while(this.nextNeighbours.length > 0){
            this.removeNextNeighbour(this.nextNeighbours[0].node)
        }
    }

    this.removeConnections = function () {
        this.removeLeftConnections();
        this.removeRightConnections();
    }

    //removes given node from neighbourList in this and this from prevNodes in given node
    this.removeNextNeighbour = function (node) {
        this.nextNeighbours = this.nextNeighbours.filter(function (neighbour) {
            return neighbour.node !== node;
        })
        Utils.removeFrom(node.prevNodes, this);
    }

    this.duplicate = function(){
        var newNode = new Node(this.content);
        for(var i=0; i<this.nextNeighbours.length; i++){
            newNode.addNextNeighbour(new NeighbourNode(this.nextNeighbours[i].node, this.nextNeighbours[i].weight))
        }
        return newNode;
    }

}

function NeighbourNode(node, weight) {
    this.node = node;
    this.weight = weight;

    this.setWeight = function (weight) {
        this.weight = weight;
    }
}

function Layer(generatorInput, generator) {

    this.nodeList = generator.generate(generatorInput).map(function (x) {
        return new Node(x);
    })

    this.removeNode = function (node) {
        Utils.removeFrom(this.nodeList, node);

        node.removeConnections();
    }

    this.getPrevConnectionsCount = function () {
        var count = 0;
        for (var i=0; i<this.nodeList.length; i++){
            count += this.nodeList[i].prevNodes.length;
        }
        return count;
    }

    this.getNextConnnetionsCount = function () {
        var count = 0;
        for(var i =0; i<this.nodeList.length; i++){
            count += this.nodeList[i].nextNeighbours.length;
        }
        return count;
    }

    this.connectWith = function(other, evaluator, isFirstLayer){
        var nextNodes = other.nodeList;
        for (var i = 0; i < this.nodeList.length; i++) {
            var currentNode = this.nodeList[i];
            if(currentNode.havePrev() || !isFirstLayer) {
                for (var k = 0; k < other.nodeList.length; k++) {
                    if (evaluator.evaluateHardRules(new RulesCheckerUtils.Connection(nextNodes[k].content, currentNode.content))) {
                        currentNode.addNextNeighbour(new NeighbourNode(nextNodes[k]));
                    }
                }
            }
        }
        other.removeUnreachableNodes();
    }

    this.leaveOnlyNodesTo = function(other){
        for(var i=0; i < this.nodeList.length; i++) {
            var currentNode = this.nodeList[i];
            for(var j=0; j < currentNode.nextNeighbours.length; j++){
                var currentNeighbour = currentNode.nextNeighbours[j];
                if( ! Utils.contains(currentNeighbour.node, other.nodeList) ){
                    currentNode.removeNextNeighbour(currentNeighbour.node);
                    j--;
                }
            }
        }
    }

    this.removeUselessNodes = function () {
        for (var j = 0; j < this.nodeList.length; j++) {
            var currentNode = this.nodeList[j];
            if(!currentNode.haveNext()){
                this.removeNode(currentNode);
                j--;
            }
        }
    }

    this.removeUnreachableNodes = function () {
        for (var j = 0; j < this.nodeList.length; j++) {
            var currentNode = this.nodeList[j];
            if(!currentNode.havePrev()){
                this.removeNode(currentNode);
                j--;
            }
        }
    }

    this.map = function (func) {
        this.nodeList = this.nodeList.map(func);
    }

    this.isEmpty = function () {
        return this.nodeList.length === 0;
    }
}

function Graph(layers, first, last) {
    this.first = first;
    this.last = last;
    this.layers = layers;
    //just for printing
    this.current_id = 0;

    this.getNodes = function (){
        var allNodes = [];
        for(var i=0; i<this.layers.length; i++){
            for(var j=0; j<this.layers[i].nodeList.length; j++) {
                allNodes.push(this.layers[i].nodeList[j])
            }
        }
        allNodes.push(this.first);
        allNodes.push(this.last);
        return allNodes;
    }

    this.enumerateNodes = function () {

        this.first["id"] = -1;
        this.last["id"] = -2;
        for(var i=0; i<this.layers.length; i++){
            for(var j=0; j<this.layers[i].nodeList.length; j++){
                var currentNode = this.layers[i].nodeList[j];
                if(currentNode.id === undefined) {
                    currentNode.id = this.current_id;
                    this.current_id++;
                }
            }
        }
    }

    this.printEdges = function () {
        var printNodeInfo = function(currentNode, layerNumber){
            for(var k=0; k< currentNode.nextNeighbours.length; k++){
                // version for first exercise
                // console.log(currentNode.id + "+" + currentNode.content.shortString() + ","  + currentNode.nextNeighbours[k].node.id + "+" + currentNode.nextNeighbours[k].node.content.shortString() + "," + i)

                // version for soprano
                if(currentNode.content !== "first" && currentNode.nextNeighbours[k].node.content !== "last")
                console.log(currentNode.id + currentNode.content.harmonicFunction.functionName + "," + currentNode.nextNeighbours[k].node.id + currentNode.nextNeighbours[k].node.content.harmonicFunction.functionName+ "," + layerNumber + "," + currentNode.nextNeighbours[k].weight)

                // default version
                // console.log(currentNode.id + "," + currentNode.nextNeighbours[k].node.id + "," + layerNumber + "," + currentNode.nextNeighbours[k].weight)
            }
        }

        printNodeInfo(this.first, 0);
        for(var i=0; i<this.layers.length; i++){
            for(var j=0; j<this.layers[i].nodeList.length; j++) {
                printNodeInfo(this.layers[i].nodeList[j], i+1)
            }
        }
    }

    this.getPossiblePathCount = function(){
        var n = 0;
        this.first.pp2 = 1
        for(var i=0; i<this.layers.length;i++){
            for(var j=0; j<this.layers[i].nodeList.length; j++) {
                var curr = this.layers[i].nodeList[j];
                curr.pp2 = 0
                for (var k = 0; k < curr.prevNodes.length; k++) {
                    curr.pp2 += curr.prevNodes[k].pp2;
                }
                if (i === this.layers.length -1) {
                    console.log(curr.pp2)
                    n += curr.pp2
                }
            }
        }
        return n;
    }
}

function GraphBuilder() {
    this.evaluator = undefined;
    this.generator = undefined;
    this.generatorInput = undefined;
    this.connectedLayers = undefined;

    this.withEvaluator = function (evaluator) {
        this.evaluator = evaluator;
    }

    this.withGenerator = function (generator) {
        this.generator = generator;
    }

    this.withInput = function (generatorInput) {
        this.generatorInput = generatorInput;
    }

    this.withConnectedLayers = function(layers){
        this.connectedLayers = layers;
    }

    var removeUnexpectedNeighboursIfExist = function(graph) {
        for(var i = 0; i < graph.layers.length-1; i++){
            graph.layers[i].leaveOnlyNodesTo(graph.layers[i+1]);
        }

    }

    var generateLayers = function (graph, generator, inputs) {
        for (var i = 0; i < inputs.length; i++) {
            graph.layers.push(
                new Layer(inputs[i], generator)
            )
        }
    }

    var addEdges = function (graph, evaluator) {
        for (var i = 0; i < graph.layers.length - 1; i++) {
            graph.layers[i].connectWith(graph.layers[i+1], evaluator, i!==0)
        }
    }

    var addFirstAndLast = function(graph) {
        graph.first = new Node("first");
        for(var i=0; i<graph.layers[0].nodeList.length; i++){
            graph.first.addNextNeighbour(new NeighbourNode(graph.layers[0].nodeList[i], 0))
        }

        graph.last = new Node("last");
        var lastLayerIdx = graph.layers.length - 1;
        for(var i=0; i<graph.layers[lastLayerIdx].nodeList.length; i++){
            graph.layers[lastLayerIdx].nodeList[i].addNextNeighbour(new NeighbourNode(graph.last, 0))
        }
    }

    var removeUnreachableNodes = function (graph) {
        // for (var i = 0; i < graph.layers.length; i++) {
        //     graph.layers[i].removeUnreachableNodes()
        // }
        graph.layers[graph.layers.length-1].removeUnreachableNodes()
    }

    var removeUselessNodes = function (graph) {
        for (var i = graph.layers.length - 1; i >= 0; i--) {
            graph.layers[i].removeUselessNodes();
        }
    }

    var makeAllNodesHavingSinglePrevContent = function (graph){
        for (var i = graph.layers.length - 1; i >= 0; i--) {

            for(var j=0; j<graph.layers[i].nodeList.length; j++){
                var currentNode = graph.layers[i].nodeList[j];
                if (currentNode.prevNodes.length > 1) {
                    var duplicates = [];
                    for (var k = 0; k < currentNode.prevNodes.length - 1; k++) {
                        duplicates.push(currentNode.duplicate());
                    }
                    var prevNodes = currentNode.prevNodes.slice();
                    currentNode.removeLeftConnections();

                    prevNodes[0].addNextNeighbour(new NeighbourNode(currentNode))
                    for (k = 1; k < duplicates.length + 1; k++) {
                        if(i === 0) prevNodes[k].addNextNeighbour(new NeighbourNode(duplicates[k - 1], 0));
                        else prevNodes[k].addNextNeighbour(new NeighbourNode(duplicates[k - 1]));
                        graph.layers[i].nodeList.push(duplicates[k - 1]);
                    }
                }
            }
        }
    }

    var setEdgeWeights = function(graph, evaluator){
        for(var i=0; i<graph.layers.length - 1; i++){
            for(var j=0; j<graph.layers[i].nodeList.length; j++){
                var currentNode = graph.layers[i].nodeList[j];

                var prevNodeContent = i === 0 ? undefined : ( evaluator.connectionSize !== 3 ? undefined : currentNode.getPrevContentIfSingle());

                for(var k=0; k<currentNode.nextNeighbours.length; k++){
                    var neighbour = currentNode.nextNeighbours[k];
                    var connection = new RulesCheckerUtils.Connection(neighbour.node.content, currentNode.content, prevNodeContent)
                    //todo Optymalizacja wydzielić zestaw ruli obliczanych dla connection size2 i size3, te pierwsze liczyć przed transformacją grafu
                    var w = evaluator.evaluateSoftRules(connection);
                    neighbour.setWeight(w);
                }
            }
        }

    }

    this.buildWithoutWeights = function() {
        var resultGraph = new Graph([]);                              //${counter}
        generateLayers(resultGraph, this.generator, this.generatorInput);   //${counter}
        addEdges(resultGraph, this.evaluator);                              //${counter}
        addFirstAndLast(resultGraph);
        // removeUnreachableNodes(resultGraph);
        removeUselessNodes(resultGraph);                                    //${counter}
        // resultGraph.enumerateNodes()
        // resultGraph.printEdges()
        return resultGraph;
    }

    this.build = function () {
        if(Utils.isDefined(this.connectedLayers)){
            var resultGraph = new Graph(this.connectedLayers);
            addFirstAndLast(resultGraph);
            removeUnexpectedNeighboursIfExist(resultGraph);
            removeUnreachableNodes(resultGraph);
            removeUselessNodes(resultGraph);
        }
        else{
            var resultGraph = this.buildWithoutWeights();
        }

        if (this.evaluator.connectionSize === 3){
            makeAllNodesHavingSinglePrevContent(resultGraph);
        }
        setEdgeWeights(resultGraph, this.evaluator);                        //${counter}

        return resultGraph;
    }
}