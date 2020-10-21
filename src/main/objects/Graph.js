.import "./Utils.js" as Utils
.import "./Errors.js" as Errors
.import "./RulesCheckerUtils.js" as RulesCheckerUtils

function Node(content) {

    this.content = content;
    this.nextNeighbours = [];
    this.prevNodes = [];

    this.getPrevContentIfSingle = function () {
        var uniquePrevContents =  this.getUniquePrevContents();
        if(uniquePrevContents.length !== 1)
            throw new Errors.InvalidGraphConstruction("Method not allowed in current state of node - there are "
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
            newNode.addNextNeighbour(new NeighbourNode(this.nextNeighbours[i].node))
        }
        return newNode;
    }

}

function NeighbourNode(node, weight) {
    this.node = node;
    this.weight = weight === undefined ? undefined : weight;

    this.setWeight = function (weight) {
        this.weight = weight;
    }
}

function Layer(nodeList) {
    this.nodeList = nodeList;

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
}

function Graph(layers, first, last) {
    this.first = first;
    this.last = last;
    this.layers = layers;
    //just for printing
    this.current_id = 0;

    this.enumerateNodes = function () {

        for(var i=0; i<this.layers.length; i++){
            for(var j=0; j<this.layers[i].nodeList.length; j++){
                var currentNode = this.layers[i].nodeList[j];
                if(currentNode.id === undefined) {
                    currentNode["id"] = this.current_id;
                    this.current_id++;
                }
            }
        }
    }

    this.printEdges = function () {
        for(var i=0; i<this.layers.length; i++){
            for(var j=0; j<this.layers[i].nodeList.length; j++) {
                var currentNode = this.layers[i].nodeList[j];
                for(var k=0; k< currentNode.nextNeighbours.length; k++){
                    if(currentNode.content !== "first" && currentNode.nextNeighbours[k].node.content !== "last") {
                        // console.log(currentNode.id + "+" + currentNode.content.shortString() + ","  + currentNode.nextNeighbours[k].node.id + "+" + currentNode.nextNeighbours[k].node.content.shortString() + "," + i)
                        console.log(currentNode.id + "," + currentNode.nextNeighbours[k].node.id + "," + i + "," + currentNode.nextNeighbours[k].weight)
                    }
                }
            }
        }
    }
}

function GraphBuilder() {
    this.evaluator = undefined;
    this.generator = undefined;
    this.generatorInput = undefined;

    this.withEvaluator = function (evaluator) {
        this.evaluator = evaluator;
    }

    this.withGenerator = function (generator) {
        this.generator = generator;
    }

    this.withInput = function (generatorInput) {
        this.generatorInput = generatorInput;
    }

    var generateLayers = function (graph, generator, inputs) {
        for (var i = 0; i < inputs.length; i++) {
            graph.layers.push(
                new Layer(
                    generator.generate(inputs[i]).map(function (x) {
                        return new Node(x);
                    })
                )
            )
        }
    }

    var addEdges = function (graph, evaluator){

    }

    this.build = function () {
        var resultGraph = new Graph([]);

        generateLayers(resultGraph, this.generator, this.generatorInput)

        for (var i = 0; i < resultGraph.layers.length - 1; i++){
            for (var j = 0; j < resultGraph.layers[i].nodeList.length; j++){
                var currentNode = resultGraph.layers[i].nodeList[j];
                var nextNodes = resultGraph.layers[i+1].nodeList;
                for(var k = 0; k< resultGraph.layers[i+1].nodeList.length; k++){
                    if ( this.evaluator.evaluateHardRules(new RulesCheckerUtils.Connection(nextNodes[k], currentNode)) === 0 )
                        currentNode.addNextNeighbour(new NeighbourNode(nextNodes[k]));
                }

                // removing nodes that cannot be reached from begin of exercise
                if(i > 0 && !currentNode.havePrev()){
                    resultGraph.layers[i].removeNode(currentNode);
                    j--;
                }
            }
        }
        // removing last layer nodes that cannot be reached from begin of exercise
        var lastLayer = resultGraph.layers[resultGraph.layers.length - 1]
        for (var j = 0; j < lastLayer.nodeList.length; j++){
            var currentNode = lastLayer.nodeList[j];
            if(!currentNode.havePrev()){
                lastLayer.removeNode(currentNode);
                j--;
            }
        }


        //-2 porobaby not what want
        for (var i = resultGraph.layers.length - 2; i >= 0; i--) {
            for (var j = 0; j < resultGraph.layers[i].nodeList.length; j++) {

                var currentNode = resultGraph.layers[i].nodeList[j];

                //removing nodes from witch end of exercise cannot be reached
                if(i < resultGraph.layers.length - 1 && !currentNode.haveNext()){
                    resultGraph.layers[i].removeNode(currentNode);
                    j--;
                }

            }
        }

        resultGraph.enumerateNodes();
        resultGraph.printEdges();

        //magic with duplication
        for (var i = resultGraph.layers.length - 1; i >= 0; i--) {

            var expectedNodeNumberInLayer = resultGraph.layers[i].getPrevConnectionsCount();
            for(var j=0; j<resultGraph.layers[i].nodeList.length; j++){
                var currentNode = resultGraph.layers[i].nodeList[j];
                if (currentNode.prevNodes.length > 1) {
                    var duplicates = [];
                    for (k = 0; k < currentNode.prevNodes.length - 1; k++) {
                        duplicates.push(currentNode.duplicate());
                    }
                    var prevNodes = currentNode.prevNodes.slice();
                    currentNode.removeLeftConnections();

                    prevNodes[0].addNextNeighbour(new NeighbourNode(currentNode))
                    for (k = 1; k < duplicates.length + 1; k++) {
                        prevNodes[k].addNextNeighbour(new NeighbourNode(duplicates[k - 1]));
                        resultGraph.layers[i].nodeList.push(duplicates[k - 1]);
                    }
                }
            }
        }

        for(var i=0; i<resultGraph.layers.length - 1; i++){
            for(var j=0; j<resultGraph.layers[i].nodeList.length; j++){
                var currentNode = resultGraph.layers[i].nodeList[j];
                var prevNode = i === 0 ? undefined : currentNode.getPrevContentIfSingle();

                for(var k=0; k<currentNode.nextNeighbours.length; k++){
                    var neighbour = currentNode.nextNeighbours[k];
                    if(neighbour.node.content.notes === undefined) console.log("ERROR WITH GRAPH: node in layer " + i + " node numeber " + j + " have udefined next neighbour no. " + k)
                    var connection = new RulesCheckerUtils.Connection(neighbour.node, currentNode, prevNode);
                    var w = this.evaluator.evaluateSoftRules(connection);
                    neighbour.setWeight(w);
                }
            }
        }

        //set first
        resultGraph.first = new Node("first");
        for(var i=0; i<resultGraph.layers[0].nodeList.length; i++){
            resultGraph.first.addNextNeighbour(new NeighbourNode(resultGraph.layers[0].nodeList[i], 0))
        }

        //set last
        resultGraph.last = new Node("last");
        var lastLayerIdx = resultGraph.layers.length - 1;
        for(var i=0; i<resultGraph.layers[lastLayerIdx].nodeList.length; i++){
            resultGraph.layers[lastLayerIdx].nodeList[i].addNextNeighbour(new NeighbourNode(resultGraph.last, 0))
        }


        return resultGraph;
    }
}