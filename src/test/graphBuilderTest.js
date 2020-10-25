var Graph = require("./objects/Graph")
var TestUtils = require("./TestUtils")
var Utils = require("./objects/Utils")
var Parser = require("./objects/Parser");
var Checker = require("./objects/ChordRulesChecker")
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

//todo remove it from here
var getFunctionsWithDelay = function (functions){
    var newFunctions = functions.slice();
    var addedChords = 0;
    for(var i=0; i<functions.length; i++){
        var delays = functions[i].delay;
        if(delays.length === 0) continue;
        var newFunction = functions[i].copy();
        for(var j=0; j<delays.length; j++){
            if(parseInt(delays[j][1].baseComponent)>=8 && !Utils.containsChordComponent(newFunction.extra, delays[j][1].chordComponentString)) newFunction.extra.push(delays[j][1]);
            functions[i].extra.push(delays[j][0]);
            functions[i].omit.push(delays[j][1]);
            functions[i].extra = functions[i].extra.filter(function(elem){return elem.chordComponentString !== delays[j][1].chordComponentString});
            if(delays[j][1] === functions[i].position) functions[i].position = delays[j][0];
            if(delays[j][1] === functions[i].revolution) functions[i].revolution = delays[j][0];
        }
        newFunctions.splice(i+addedChords+1, 0, newFunction);
        addedChords++;
    }
    return newFunctions;
}


var testSuite = new TestUtils.TestSuite("GraphBuilder tests", 1000);

var test = () => {

    var input = TestUtils.get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\" + "sikorski_zzip_ex1.txt");
    var ex = Parser.parse(input);

    var graphBuilder = new Graph.GraphBuilder();
    graphBuilder.withGenerator(new Generator.ChordGenerator(ex.key, ex.mode));
    graphBuilder.withEvaluator(new Checker.ChordRulesChecker());
    graphBuilder.withInput(getFunctionsWithDelay(ex.getHarmonicFunctionList()));

    var graph = graphBuilder.build();

    var nexts_count = 0;
    var prev_count = 0;
    for(var i = 0; i < graph.layers.length; i++) {
        if(i < graph.layers.length - 1) {
            for (var j = 0; j < graph.layers[i].nodeList.length; j++) {
                var currentNode = graph.layers[i].nodeList[j]
                nexts_count += currentNode.nextNeighbours.length;
            }
        }

        if(i>0) {
            for (var j = 0; j < graph.layers[i].nodeList.length; j++) {
                var currentNode = graph.layers[i].nodeList[j]
                prev_count += currentNode.prevNodes.length;
            }
        }
    }

    // graphBuilder.withGenerator(new MockGenerator())
    // graphBuilder.withEvaluator(new MockEvaluator())
    // graphBuilder.withInput([3,2,3,1])

    return TestUtils.assertEqualsPrimitives(prev_count, nexts_count);
}

testSuite.addTest(new TestUtils.UnitTest(test, "Check if number of left-site edges is equal to right-site edges in whole graph"));


var allHaveExactlyOneUniquePrevContent = () => {

    var input = TestUtils.get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\" + "sikorski_zzip_ex65.txt");
    var ex = Parser.parse(input);

    var graphBuilder = new Graph.GraphBuilder();
    graphBuilder.withGenerator(new Generator.ChordGenerator(ex.key, ex.mode));
    graphBuilder.withEvaluator(new Checker.ChordRulesChecker());
    graphBuilder.withInput( getFunctionsWithDelay(ex.getHarmonicFunctionList()) );

    var graph = graphBuilder.build();


    var result = true;

    for(var i = 0; i < graph.layers.length; i++) {
        for (var j = 0; j < graph.layers[i].nodeList.length; j++){
            var currentNode = graph.layers[i].nodeList[j];
            // console.log("Prev contents count of " + currentNode.id +  ": " + currentNode.getUniquePrevContentsCount());
            if( currentNode.getUniquePrevContentsCount() !== 1){
                console.log("PION: " + i + "Number in layer: " + j)
                console.log("Prev contents count of " + currentNode.id +  ": " + currentNode.getUniquePrevContentsCount());
            }
            result = result && currentNode.getUniquePrevContentsCount() === 1;
        }
    }

    return TestUtils.assertTrue(result);
}

testSuite.addTest(new TestUtils.UnitTest(allHaveExactlyOneUniquePrevContent, "Check if each node have exactly one unique content in prevNodes in whole graph"));


testSuite.run();
