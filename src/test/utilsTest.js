var Utils = require("./objects/Utils");
var Consts = require("./objects/Consts");
var TestUtils = require("./TestUtils");

var testSuite  = new TestUtils.TestSuite("Utils tests");

var getMeasurePlaceTest = () => {
    return TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.BEGINNING, Utils.getMeasurePlace([4,4], 0)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([4,4], 1.125)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([5,4], 0.75)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([6,8], 0.375)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([7,8], 0.375)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([7,8], 0.625)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([5,4], 0.25)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([7,4], 1.5)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.UPBEAT, Utils.getMeasurePlace([4,4], 0.25)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([8,4], 0.5)) &&
        TestUtils.assertEqualsPrimitives(Consts.MEASURE_PLACE.DOWNBEAT, Utils.getMeasurePlace([8,4], 1))
};

testSuite.addTest(new TestUtils.UnitTest(getMeasurePlaceTest, "Get measure place test"));

testSuite.run();