var Graph = require("./objects/Graph")
var TestUtils = require("./TestUtils")
var Utils = require("./objects/Utils")
var Parser = require("./objects/Parser");
var Checker = require("./objects/RulesChecker")
var Generator = require("./objects/ChordGenerator")


function MockGenerator() {
    this.generate = function (n) {
        var res = [];
        for (var i = 0; i <= n; i++) {
            res.push(i)
        }
        return res;
    }
}

function MockEvaluator() {
    this.evaluateHardRules = function (prev, current){
        if (current === 3  || prev === 0) return -1;
        return 0;
    }
}


var testSuite = new TestUtils.TestSuite("GraphBuilder tests");

var test = () => {

    var input = TestUtils.get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\" + "sikorski_zzip_ex1.txt");
    var ex = Parser.parse(input);

    var graphBuilder = new Graph.GraphBuilder();
    graphBuilder.withGenerator(new Generator.ChordGenerator(ex.key, ex.mode));
    graphBuilder.withEvaluator(new Checker.ChordRelationEvaluator());
    graphBuilder.withInput(ex.getHarmonicFunctionList());

    // graphBuilder.withGenerator(new MockGenerator())
    // graphBuilder.withEvaluator(new MockEvaluator())
    // graphBuilder.withInput([3,2,3,1])

    var graph = graphBuilder.build();
    graph.enumerateNodes();
    graph.printEdges();
}

testSuite.addTest(new TestUtils.UnitTest(test, "Graph building"));

testSuite.run();
