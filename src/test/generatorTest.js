var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")
var TestUtils = require("./TestUtils")

var generatorTestSuite = new TestUtils.TestSuite("ChordGenerator tests");

var neapolitanTest = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("S", 2, -1, "1", undefined, [], [], true, undefined, 'minor');
    var res = gen.generate(hf);
    // res.forEach((x) => {console.log(x.toString())})

    return TestUtils.assertEqualsPrimitives(res.length, 27);
}

generatorTestSuite.addTest(new TestUtils.UnitTest(neapolitanTest, "Neapolitan chord test"));

generatorTestSuite.run();
