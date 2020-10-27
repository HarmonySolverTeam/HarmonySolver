const TestUtils = require("./TestUtils");
const HarmonicFunction = require("./objects/HarmonicFunction");
const HarmonicFunctionGenerator = require("./objects/HarmonicFunctionGenerator");
const Note = require("./objects/Note");

const testSuite = new TestUtils.TestSuite("HarmonicFunctionGenerator tests");
const hfMap = new HarmonicFunctionGenerator.HarmonicFunctionMap();

var t = new HarmonicFunction.HarmonicFunction("T");
var s = new HarmonicFunction.HarmonicFunction("S");
var s6 = new HarmonicFunction.HarmonicFunction("S",undefined, undefined, undefined, undefined, ["6"]);
var d = new HarmonicFunction.HarmonicFunction("D");
var d7 = new HarmonicFunction.HarmonicFunction("D",undefined, undefined, undefined, undefined, ["7"]);
var secondaryd7 = new HarmonicFunction.HarmonicFunction("D",undefined, undefined, undefined, undefined, ["7"], undefined, undefined, undefined, undefined, "G");
var hfGenerator = new HarmonicFunctionGenerator.HarmonicFunctionGenerator([t, d7, d, s, s6, secondaryd7], "C", "major");

const harmonicFunctionMapTest = () => {
    var hf = new HarmonicFunction.HarmonicFunction("T");
    hfMap.pushToValues(60,1, hf)
    return TestUtils.assertTrue(hfMap.getValues(60,0)) &&
        TestUtils.assertContains(hfMap.getValues(60,1), hf) &&
        TestUtils.assertThrows(undefined,
            "Cannot read property '0 0' of undefined",
            hfMap.getValues, [0, 0]) &&
        TestUtils.assertThrows(undefined,
            "Cannot read property '0 0' of undefined",
            hfMap.pushToValues, [0, 0, undefined])
};

testSuite.addTest(new TestUtils.UnitTest(harmonicFunctionMapTest, "Harmonic function map test"));

const harmonicFunctionGeneratorInitializeTest = () => {
    return TestUtils.assertEqualsPrimitives(4,hfGenerator.map.getValues(60,0).length) &&
        TestUtils.assertEqualsPrimitives(3,hfGenerator.map.getValues(62,1).length) &&
        TestUtils.assertEqualsPrimitives(1,hfGenerator.map.getValues(64,2).length) &&
        TestUtils.assertEqualsPrimitives(2,hfGenerator.map.getValues(65,3).length) &&
        TestUtils.assertEqualsPrimitives(2,hfGenerator.map.getValues(67,4).length) &&
        TestUtils.assertEqualsPrimitives(3,hfGenerator.map.getValues(69,5).length) &&
        TestUtils.assertEqualsPrimitives(2,hfGenerator.map.getValues(71,6).length) &&
        TestUtils.assertEqualsPrimitives(1,hfGenerator.map.getValues(66,3).length)
};

testSuite.addTest(new TestUtils.UnitTest(harmonicFunctionGeneratorInitializeTest, "Harmonic function generator initialization test"));

const generateTest = () => {
    var note = Note.Note(69, 5);
    return TestUtils.assertEqualsPrimitives(3,hfGenerator.generate(note).length)
};

testSuite.addTest(new TestUtils.UnitTest(harmonicFunctionGeneratorInitializeTest, "Harmonic function generator initialization test"));

testSuite.run();