const UnitTest = require("./TestUtils");
const HarmonicFunction = require("./objects/HarmonicFunction");
const Parser = require("./objects/Parser")

const preprocessingTestSuite = new UnitTest.TestSuite("Preprocessing tests");

const validateDelayValuesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[[">10","<9"]],[],[],false,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[[">10","<<11"]],[],[],false,undefined,undefined);
    var hf3 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[[">5","3"]],[],[],false,undefined,undefined);
    return UnitTest.assertTrue(Parser.validateDelays(hf1)) &&
        UnitTest.assertTrue(Parser.validateDelays(hf2)) &&
        UnitTest.assertFalse(Parser.validateDelays(hf3))
};

preprocessingTestSuite.addTest(new UnitTest.UnitTest(validateDelayValuesTest, "Validate delay values"));

const validateDelayWithOtherAttributesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[["4","3"]],["7"],[],false,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"3",[["4","3"]],["7"],[],false,undefined,undefined);
    var hf3 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[["4","3"]],["7"],[],false,undefined,undefined);
    var hf4 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[["6","5"]],[],["5"],false,undefined,undefined);
    var hf5 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[["4","3"]],["7","9"],["5"],false,undefined,undefined);
    return UnitTest.assertTrue(Parser.validateDelays(hf1)) &&
        UnitTest.assertTrue(Parser.validateDelays(hf2)) &&
        UnitTest.assertTrue(Parser.validateDelays(hf3)) &&
        UnitTest.assertFalse(Parser.validateDelays(hf4)) &&
        UnitTest.assertTrue(Parser.validateDelays(hf5))
};

preprocessingTestSuite.addTest(new UnitTest.UnitTest(validateDelayWithOtherAttributesTest, "Validate delay with omit, extra, revolution and position"));

preprocessingTestSuite.run();