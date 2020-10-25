var TestUtils = require("./TestUtils")
var Utils = require("./objects/Utils")
var PriorityQueue = require("./objects/PriorityQueue")
var Graph = require("./objects/Graph")
var Dikstra = require("./objects/Dikstra")

var testSuite = new TestUtils.TestSuite("Dikstra algorithm tests");

function ObjectWithKey(key, value){
    this.key = key;
    this.value = value;
}

var dikstraTest = () => {
    var A = new Graph.Node("A");
    var B = new Graph.Node("B");
    var C = new Graph.Node("C");
    var D = new Graph.Node("D");
    var E = new Graph.Node("E");
    var F = new Graph.Node("F");
    var G = new Graph.Node("G");
    var H = new Graph.Node("H");

    var first = new Graph.Node("first");
    var last = new Graph.Node("last");

    first.nextNeighbours = [new Graph.NeighbourNode(A, 0),
                            new Graph.NeighbourNode(B, 0),
                            new Graph.NeighbourNode(C, 0)]

    A.nextNeighbours = [new Graph.NeighbourNode(D, 10)]
    B.nextNeighbours = [new Graph.NeighbourNode(D, 10),
                        new Graph.NeighbourNode(E, 10)]
    C.nextNeighbours = [new Graph.NeighbourNode(D,10),
                        new Graph.NeighbourNode(E,0)]
    D.nextNeighbours = [new Graph.NeighbourNode(F,10),
                        new Graph.NeighbourNode(G,10),
                        new Graph.NeighbourNode(H,10)]
    E.nextNeighbours = [new Graph.NeighbourNode(F,0),
                        new Graph.NeighbourNode(G,10),
                        new Graph.NeighbourNode(H,10)]

    F.nextNeighbours = [new Graph.NeighbourNode(last,0)]
    G.nextNeighbours = [new Graph.NeighbourNode(last,0)]
    H.nextNeighbours = [new Graph.NeighbourNode(last,0)]

    var layers = [new Graph.Layer([A,B,C]),
                  new Graph.Layer([D,E]),
                  new Graph.Layer([F,G,H])]

    var graph = new Graph.Graph(layers, first, last);

    var dikstra = new Dikstra.Dikstra(graph);
    var shortestPathNodes = dikstra.getShortestPathToLastNode();

    var res = ""
    for(var i=0; i<shortestPathNodes.length; i++){
        res += shortestPathNodes[i].content
    }

    return TestUtils.assertEqualsPrimitives("CEF", res);
}

testSuite.addTest(new TestUtils.UnitTest(dikstraTest, "Dikstra with only one shortest path"));

testSuite.run();
