var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")
var UnitTest = require("./TestUtils")

var neapolitanTest = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("S", 2, -1, "1", undefined, [], [], true, undefined, undefined);
    var res = gen.generate(hf);
    // res.forEach((x) => {console.log(x.toString())})

    return UnitTest.assertEqualsPrimitives(res.length, 27);
}

var test1 = new UnitTest.UnitTest(neapolitanTest, "Neapolitan chord test");
var suite = new UnitTest.TestSuite("ChordGenerator tests");
suite.addTest(test1);
suite.run();
