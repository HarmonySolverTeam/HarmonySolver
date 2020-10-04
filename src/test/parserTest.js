var HarmonicFunction = require("./objects/HarmonicFunction");
var Utils = require("./objects/Utils")
var Parser = require("./objects/Parser");

const testSuite = new TestUtils.TestSuite("Parser tests");
//TODO
const getSpecificChordTest = () => {
    var measures = [[],[],[]]
    return true
};

testSuite.addTest(new TestUtils.UnitTest(getSpecificChordTest, "Getting specific chord test"));

testSuite.run();