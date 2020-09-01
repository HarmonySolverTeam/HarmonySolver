const TestUtils = require("./TestUtils");
const HarmonicFunction = require("./objects/HarmonicFunction");
const HarmonicFunctionValidator = require("./objects/HarmonicFunctionValidator")

const testSuite = new TestUtils.TestSuite("HarmonicFunctionValidator tests");
const validator = new HarmonicFunctionValidator.HarmonicFunctionValidator();

const validateDelayValuesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[[">10","<9"]],[],[],false,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[[">10","<<11"]],[],[],false,undefined,undefined);
    var hf3 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[[">5","3"]],[],[],false,undefined,undefined);
    return TestUtils.assertTrue(validator.validate(hf1)) &&
        TestUtils.assertTrue(validator.validate(hf2)) &&
        TestUtils.assertFalse(validator.validate(hf3))
};

testSuite.addTest(new TestUtils.UnitTest(validateDelayValuesTest, "Validate delay values"));

const validateDelayWithOtherAttributesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[["4","3"]],["7"],[],false,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"3",[["4","3"]],["7"],[],false,undefined,undefined);
    var hf3 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[["4","3"]],["7"],[],false,undefined,undefined);
    var hf4 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[["6","5"]],[],["5"],false,undefined,undefined);
    var hf5 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[["4","3"]],["7","9"],["5"],false,undefined,undefined);
    return TestUtils.assertTrue(validator.validate(hf1)) &&
        TestUtils.assertTrue(validator.validate(hf2)) &&
        TestUtils.assertTrue(validator.validate(hf3)) &&
        TestUtils.assertTrue(validator.validate(hf4)) &&
        TestUtils.assertTrue(validator.validate(hf5))
};

testSuite.addTest(new TestUtils.UnitTest(validateDelayWithOtherAttributesTest, "Validate delay with omit, extra, revolution and position"));

testSuite.run();