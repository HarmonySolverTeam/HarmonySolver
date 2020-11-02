const TestUtils = require("./TestUtils");
const HarmonicFunction = require("./objects/model/HarmonicFunction");
const HarmonicFunctionValidator = require("./objects/model/HarmonicFunctionValidator")

const testSuite = new TestUtils.TestSuite("HarmonicFunctionValidator tests");
const validator = new HarmonicFunctionValidator.HarmonicFunctionValidator();

const validateDelayValuesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[[">10","<9"]],[],[],false,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[[">10","<<11"]],[],[],false,undefined,undefined);
    var hf3 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[[">5","3"]],[],[],false,undefined,undefined);
    return TestUtils.assertTrue(validator.validate(hf1)) &&
        TestUtils.assertTrue(validator.validate(hf2)) &&
        TestUtils.assertThrows("Error during parsing harmonic functions input", "HarmonicFunction validation error: To large difference in delay",
            validator.validate, [hf3])
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

const omit5AddingToNinthTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",undefined, undefined, undefined,[["9","8"]], ["7"]);
    return TestUtils.assertContains(hf1.omit, hf1.cm.chordComponentFromString("5"));
};

testSuite.addTest(new TestUtils.UnitTest(omit5AddingToNinthTest, "Correct 5 adding to omit when applying ninth chord with delay"));

const validateNinthChord = () => {
    // var hf1 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,"5",[],["9"],[],false,undefined,undefined);
    // var hf2 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,[],["9"],[],false,undefined,undefined);
    // var hf3 = new HarmonicFunction.HarmonicFunction("D",undefined,"5","5",[],["9"],[],false,undefined,undefined);
    // var hf4 = new HarmonicFunction.HarmonicFunction("D",undefined,"5",undefined,[],["9"],[],false,undefined,undefined);
    // var hf5 = new HarmonicFunction.HarmonicFunction("D",undefined,"5<","5<",[],["9"],[],false,undefined,undefined);

    return TestUtils.assertThrows("Error during parsing harmonic functions input", "HarmonicFunction validation error: " +
        "ninth chord could not have both prime or fifth in position and revolution",
            HarmonicFunction.HarmonicFunction, ["D",undefined,"1","5",undefined,["9"]]) &&
        TestUtils.assertThrows("Error during parsing harmonic functions input", "HarmonicFunction validation error: " +
            "ninth chord could not have same position as revolution",
            HarmonicFunction.HarmonicFunction, ["D",undefined,"1","1",undefined,["9"]]) &&
        TestUtils.assertThrows("Error during parsing harmonic functions input", "HarmonicFunction validation error: " +
            "ninth chord could not have both prime or fifth in position and revolution",
            HarmonicFunction.HarmonicFunction, ["D",undefined,"5","1",undefined,["9"]]) &&
        TestUtils.assertThrows("Error during parsing harmonic functions input", "HarmonicFunction validation error: " +
            "ninth chord could not have same position as revolution",
            HarmonicFunction.HarmonicFunction, ["D",undefined,"5","5",undefined,["9"]]) &&
        TestUtils.assertThrows("Error during parsing harmonic functions input", "HarmonicFunction validation error: " +
            "ninth chord could not have same position as revolution",
            HarmonicFunction.HarmonicFunction, ["D",undefined,"5>","5>",undefined,["9"]])

};

testSuite.addTest(new TestUtils.UnitTest(validateNinthChord, "Validate ninth chord"));

testSuite.run();