var TestUtils = require("./TestUtils")
var Utils = require("./objects/utils/Utils")
var PriorityQueue = require("./objects/algorithms/PriorityQueue")
var Graph = require("./objects/algorithms/Graph")
var Node = require("./objects/algorithms/Node")
var NeighbourNode = require("./objects/algorithms/NeighbourNode")
var Layer = require("./objects/algorithms/Layer")
var Dikstra = require("./objects/algorithms/Dikstra")

var testSuite = new TestUtils.TestSuite("Dikstra algorithm tests");

function ObjectWithKey(key, value){
    this.key = key;
    this.value = value;
}

var dikstraTest = () => {
    var A = new Node.Node("A");
    var B = new Node.Node("B");
    var C = new Node.Node("C");
    var D = new Node.Node("D");
    var E = new Node.Node("E");
    var F = new Node.Node("F");
    var G = new Node.Node("G");
    var H = new Node.Node("H");

    var first = new Node.Node("first");
    var last = new Node.Node("last");

    first.nextNeighbours = [new NeighbourNode.NeighbourNode(A, 0),
                            new NeighbourNode.NeighbourNode(B, 0),
                            new NeighbourNode.NeighbourNode(C, 0)]

    A.nextNeighbours = [new NeighbourNode.NeighbourNode(D, 10)]
    B.nextNeighbours = [new NeighbourNode.NeighbourNode(D, 10),
                        new NeighbourNode.NeighbourNode(E, 10)]
    C.nextNeighbours = [new NeighbourNode.NeighbourNode(D,10),
                        new NeighbourNode.NeighbourNode(E,0)]
    D.nextNeighbours = [new NeighbourNode.NeighbourNode(F,10),
                        new NeighbourNode.NeighbourNode(G,10),
                        new NeighbourNode.NeighbourNode(H,10)]
    E.nextNeighbours = [new NeighbourNode.NeighbourNode(F,0),
                        new NeighbourNode.NeighbourNode(G,10),
                        new NeighbourNode.NeighbourNode(H,10)]

    F.nextNeighbours = [new NeighbourNode.NeighbourNode(last,0)]
    G.nextNeighbours = [new NeighbourNode.NeighbourNode(last,0)]
    H.nextNeighbours = [new NeighbourNode.NeighbourNode(last,0)]

    var l1 = new Layer.Layer();
    l1.nodeList = [A, B, C];
    var l2 = new Layer.Layer();
    l2.nodeList = [D, E]
    var l3 = new Layer.Layer();
    l3.nodeList = [F, G, H]
    var layers = [l1, l2, l3]

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
