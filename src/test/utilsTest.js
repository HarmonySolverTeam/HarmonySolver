var Utils = require("./objects/utils/Utils");
var Consts = require("./objects/commons/Consts");
var TestUtils = require("./TestUtils");

var testSuite  = new TestUtils.TestSuite("Utils tests");

var getMeasurePlaceTest = () => {
    return TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.BEGINNING, Utils.getMeasurePlace([4,4], 0)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([4,4], 1.125)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([5,4], 0.75)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([6,8], 0.375)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([7,8], 0.375)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([7,8], 0.625)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([7,8], 0.5)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([7,8], 0.25)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([5,4], 0.25)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([7,4], 1.5)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([4,4], 0.25)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([8,4], 0.5)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([8,4], 1))
};

testSuite.addTest(new TestUtils.UnitTest(getMeasurePlaceTest, "Get measure place test"));

var isNumberTest = () => {
    return TestUtils.assertTrue(Utils.isIntegerNumber(19)) &&
        TestUtils.assertFalse(Utils.isIntegerNumber("1")) &&
        TestUtils.assertFalse(Utils.isIntegerNumber({"x":12, "y":14})) &&
        TestUtils.assertFalse(Utils.isIntegerNumber(19.2))
};

testSuite.addTest(new TestUtils.UnitTest(isNumberTest, "Is number test"));

var getValuesOfTest = () => {
    var testObject = {x: 0, y: 1};
    return TestUtils.assertEqualsObjects([0, 1], Utils.getValuesOf(testObject))
};

testSuite.addTest(new TestUtils.UnitTest(getValuesOfTest, "Get values of object test"));

testSuite.run();