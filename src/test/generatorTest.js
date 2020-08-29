var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")
var TestUtils = require("./TestUtils")
var ChordComponentManager = require("./objects/ChordComponentManager")

var generatorTestSuite = new TestUtils.TestSuite("ChordGenerator tests");

var cm = new ChordComponentManager.ChordComponentManager();

var neapolitanTest = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("S", 2, undefined, "3>", undefined, [], [], true, undefined, 'minor');
    var res = gen.generate(hf);
    // res.forEach((x) => {console.log(x.toString())})

    //todo przepisać ten warunek
    return TestUtils.assertEqualsPrimitives(res.length, 38);
};

generatorTestSuite.addTest(new TestUtils.UnitTest(neapolitanTest, "Neapolitan chord test"));


var positionAndRevolution1 = () => {
    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("S", 4, "1", "1", undefined, [], [], false, undefined, undefined);
    var res = gen.generate(hf);

    var testResult = true;

    if(res.length === 0) testResult = false;

    for(var i=0; i<res.length; i++){
        testResult = testResult && TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("1"), res[i].sopranoNote.chordComponent);
        testResult = testResult && TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("1"), res[i].bassNote.chordComponent);
        testResult = testResult &&
            ((TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("3"), res[i].tenorNote.chordComponent) && TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("5"), res[i].altoNote.chordComponent))
            || (TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("5"), res[i].tenorNote.chordComponent) && TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("3"), res[i].altoNote.chordComponent)));
    }

    return testResult;
};

generatorTestSuite.addTest(new TestUtils.UnitTest(positionAndRevolution1, "Position and revolution equal 1 chord test"));

var doubleOnly135 = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", undefined, ["7"], ["5"], false, undefined, undefined);
    var res = gen.generate(hf);
    // res.forEach((x) => {console.log(x.toString())})

    var testResult = true;

    if(res.length === 0) testResult = false;

    for(var i=0; i<res.length; i++){
        var counter = 0;
        for(var j=0; j<4; j++){
            if(TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("7"), res[i].notes[j].chordComponent)) counter++;
        }
        testResult = testResult && TestUtils.assertEqualsPrimitives(1, counter);
    }

    return testResult;
};

generatorTestSuite.addTest(new TestUtils.UnitTest(doubleOnly135, "Double only 1, 3 or 5"));



generatorTestSuite.run();
