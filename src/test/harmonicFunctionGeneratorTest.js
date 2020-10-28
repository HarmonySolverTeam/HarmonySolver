const TestUtils = require("./TestUtils");
const HarmonicFunction = require("./objects/model/HarmonicFunction");
const HarmonicFunctionGenerator = require("./objects/soprano/HarmonicFunctionGenerator");
const Note = require("./objects/model/Note");
const Consts = require("./objects/commons/Consts");
const Parser = require("./objects/harmonic/Parser")

const testSuite = new TestUtils.TestSuite("HarmonicFunctionGenerator tests", 20);
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
    var input = new HarmonicFunctionGenerator.HarmonicFunctionGeneratorInput(new Note.Note(69, 5));
    return TestUtils.assertEqualsPrimitives(3,hfGenerator.generate(input).length)
};

testSuite.addTest(new TestUtils.UnitTest(generateTest, "Harmonic function generate for given soprano note"));

const allFunctionsInitializationTest = () => {
    var key = "C"
    var x = undefined
    var T = new HarmonicFunction.HarmonicFunction("T")
    var S = new HarmonicFunction.HarmonicFunction("S")

    var D = new HarmonicFunction.HarmonicFunction("D")

    var D7 = new HarmonicFunction.HarmonicFunction("D",x,x,x,x,["7"])
    var S6 = new HarmonicFunction.HarmonicFunction("S",x,x,x,x,["6"])

    var neapolitan = new HarmonicFunction.HarmonicFunction("S",2,undefined,"3",[],[],[],true,undefined,Consts.MODE.MINOR)

    //side chords
    var Sii = new HarmonicFunction.HarmonicFunction("S",2)
    var Diii = new HarmonicFunction.HarmonicFunction("D",3)
    var Tiii = new HarmonicFunction.HarmonicFunction("T",3)
    var Tvi = new HarmonicFunction.HarmonicFunction("T",6)
    var Svi = new HarmonicFunction.HarmonicFunction("S",6)
    var Dvii = new HarmonicFunction.HarmonicFunction("D",7)

    //secondary dominants
    var Dtoii = D7.copy()
    Dtoii.key = Parser.calculateKey(key, Sii)
    var Dtoiii = D7.copy()
    Dtoiii.key = Parser.calculateKey(key, Diii)
    var Dtoiv = D7.copy()
    Dtoiv.key = Parser.calculateKey(key, S)
    var Dtovi = D7.copy()
    Dtovi.key = Parser.calculateKey(key, Tvi)
    var Dtovii = D7.copy()
    Dtovii.key = Parser.calculateKey(key, Dvii)

    return TestUtils.assertDefined(new HarmonicFunctionGenerator.HarmonicFunctionGenerator([T, S, D, D7, S6, neapolitan, Sii, Diii, Tiii, Tvi, Svi, Dtoii, Dtoiii, Dtoiv, Dtovi, Dtovii], key, Consts.MODE.MAJOR))
}

testSuite.addTest(new TestUtils.UnitTest(allFunctionsInitializationTest, "Harmonic function generator initialization test"));

testSuite.run();