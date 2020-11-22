.import "../algorithms/Graph.js" as Graph
.import "../harmonic/ChordGenerator.js" as ChordGenerator
.import "../commons/RulesCheckerUtils.js" as RulesCheckerUtils

// function SopranoGraphNode(content, nextNeighbours, prevNodes, nestedLayer) {
//     Graph.Node.call(this, content, nextNeighbours, prevNodes)
//     this.nestedLayer = nestedLayer
// }

function SopranoGraphBuilder() {
    this.outerEvaluator = undefined;
    this.outerGenerator = undefined;
    this.outerGeneratorInput = undefined;
    this.innerEvaluator = undefined;
    this.innerGenerator = undefined;

    this.withOuterEvaluator = function (outerEvaluator) {
        this.outerEvaluator = outerEvaluator;
    }

    this.withOuterGenerator = function (outerGenerator) {
        this.outerGenerator = outerGenerator;
    }

    this.withOuterGeneratorInput = function (outerGeneratorInput) {
        this.outerGeneratorInput = outerGeneratorInput;
    }

    this.withInnerEvaluator = function (innerEvaluator) {
        this.innerEvaluator = innerEvaluator;
    }

    this.withInnerGenerator = function (innerGenerator) {
        this.innerGenerator = innerGenerator;
    }

    this.getGraphTemplate = function () {
        var graphBuilder = new Graph.GraphBuilder();
        graphBuilder.withEvaluator(this.outerEvaluator);
        graphBuilder.withGenerator(this.outerGenerator);
        graphBuilder.withInput(this.outerGeneratorInput)
        return graphBuilder.buildWithoutWeights();
    }

    var generateNestedLayers = function(graph, innerGenerator, outerGeneratorInput) {
        for(var i=0; i<graph.layers.length; i++){
            var sopranoNote = outerGeneratorInput[i].sopranoNote;
            for(var j=0; j<graph.layers[i].nodeList.length; j++){
                var currentNode = graph.layers[i].nodeList[j];
                var nestedLayer = new Graph.Layer(
                    new ChordGenerator.ChordGeneratorInput(currentNode.content.harmonicFunction, i!==0, sopranoNote),
                    innerGenerator
                );
                currentNode.nestedLayer = nestedLayer;
            }
        }
    }

    var connectNestedLayers = function(graph, innerEvaluator) {
        for(var i=0; i<graph.layers.length -1; i++) {
            for (var j=0; j<graph.layers[i].nodeList.length; j++) {
                var currentNode = graph.layers[i].nodeList[j];
                for(var k=0; k<currentNode.nextNeighbours.length; k++){
                    var nextNeighbour = currentNode.nextNeighbours[k].node;
                    currentNode.nestedLayer.connectWith(nextNeighbour.nestedLayer, innerEvaluator, i===0);
                }
            }
        }
    }

    var removeUselessNodesInNestedLayers = function(graph) {
        //without last layer cause the first node is not present yet
        for(var i=graph.layers.length-2; i>=0; i--) {
            for (var j = 0; j < graph.layers[i].nodeList.length; j++) {
                var currentNode = graph.layers[i].nodeList[j];
                currentNode.nestedLayer.removeUselessNodes()
            }
        }
    }

    var removeUnreachableNodesInNestedLayers = function(graph) {
        //without last layer cause the first node is not present yet
        for(var i=1; i<graph.layers.length; i++) {
            for (var j = 0; j < graph.layers[i].nodeList.length; j++) {
                var currentNode = graph.layers[i].nodeList[j];
                currentNode.nestedLayer.removeUnreachableNodes()
            }
        }
    }

    var removeNodesWithEmptyNestedLayers = function(graph) {
        for(var i=graph.layers.length-1; i>=0; i--) {
            for (var j = 0; j < graph.layers[i].nodeList.length; j++) {
                var currentNode = graph.layers[i].nodeList[j];
                if(currentNode.nestedLayer.isEmpty()){
                    graph.layers[i].removeNode(currentNode);
                    j--;
                }
            }
        }
    }

    var removeUnreachableNodes = function (graph) {
        for (var i = 0; i < graph.layers.length; i++) {
            graph.layers[i].removeUnreachableNodes()
        }
    }

    var removeUselessNodes = function (graph) {
        for (var i = graph.layers.length - 1; i >= 0; i--) {
            graph.layers[i].removeUselessNodes();
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

    this.build = function () {
        var graphTemplate = this.getGraphTemplate();
        generateNestedLayers(graphTemplate, this.innerGenerator, this.outerGeneratorInput);
        connectNestedLayers(graphTemplate, this.innerEvaluator);
        removeUselessNodesInNestedLayers(graphTemplate);
        // removeUnreachableNodesInNestedLayers(graphTemplate);
        // removeNodesWithEmptyNestedLayers(graphTemplate);
        // removeUnreachableNodes(graphTemplate);
        // removeUselessNodes(graphTemplate);
        // setEdgeWeights(graphTemplate, this.outerEvaluator);

        return graphTemplate
    }

}