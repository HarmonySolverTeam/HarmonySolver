var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")
var TestUtils = require("./TestUtils")
var ChordComponentManager = require("./objects/ChordComponentManager")
var Consts = require("./objects/Consts")
var Utils = require("./objects/Utils")

var generatorTestSuite = new TestUtils.TestSuite("ChordGenerator tests");

var cm = new ChordComponentManager.ChordComponentManager();

var neapolitanTest = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("S", 2, undefined, "3>", undefined, [], [], true, undefined, Consts.MODE.MINOR);
    var res = gen.generate(hf);
    // res.forEach((x) => {console.log(x.toString())})

    //todo przepisać ten warunek
    return TestUtils.assertEqualsPrimitives(res.length, 48);
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

var majorChordInMinorKeyTest = () => {
    var gen = new Generator.ChordGenerator("e");
    var hf = new HarmonicFunction.HarmonicFunction("D", 5, undefined, undefined, undefined, [], [], false, undefined, "major");
    var res = gen.generate(hf);

    return TestUtils.assertNotEqualsPrimitives(0, res.length);
};

generatorTestSuite.addTest(new TestUtils.UnitTest(majorChordInMinorKeyTest, "Major chord in minor key generating test"));

var chordInKeyGivenByHarmonicFunctionInMajor = () => {
    var gen_in_C = new Generator.ChordGenerator("C");
    var gen_in_D = new Generator.ChordGenerator("D");

    var hf_without_key = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], [], false, undefined, "major");
    var hf_with_key = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], [], false, undefined, "major", "C");

    var res1 = gen_in_C.generate(hf_without_key);
    var res2 = gen_in_D.generate(hf_with_key);

    if( !TestUtils.assertEqualsPrimitives(res1.length, res2.length) ) return false;

    var testResult = true;
    for(var i=0; i<res1.length; i++){
        testResult = testResult && res1[i].equalsNotes(res2[i]);
    }

    return testResult;
};

generatorTestSuite.addTest(new TestUtils.UnitTest(chordInKeyGivenByHarmonicFunctionInMajor, "Generating harmonic function with given major key test"));

var chordInKeyGivenByHarmonicFunctionInMinor = () => {
    var gen_in_f = new Generator.ChordGenerator("f");
    var gen_in_B = new Generator.ChordGenerator("B");

    var hf_without_key = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], [], false, undefined, "minor");
    var hf_with_key = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], [], false, undefined, "minor", "f");

    var res1 = gen_in_f.generate(hf_without_key);
    var res2 = gen_in_B.generate(hf_with_key);

    if( !TestUtils.assertEqualsPrimitives(res1.length, res2.length) ) return false;

    var testResult = true;
    for(var i=0; i<res1.length; i++){
        testResult = testResult && res1[i].equalsNotes(res2[i]);
    }

    return testResult;
};

generatorTestSuite.addTest(new TestUtils.UnitTest(chordInKeyGivenByHarmonicFunctionInMinor, "Generating harmonic function with given minor key test"));


generatorTestSuite.run();
