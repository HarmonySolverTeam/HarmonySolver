var HarmonicFunction = require("./objects/HarmonicFunction");
var Utils = require("./objects/Utils")
var Parser = require("./objects/Parser");
const TestUtils = require("./TestUtils");
var fs = require('fs');

var get_ex_from_file = (path) => {
    var buffer = fs.readFileSync(process.cwd() + path);
    var input = buffer.toString();
    input = input.replace("\r\n", "\n")
    return input;
}

const testSuite = new TestUtils.TestSuite("Parser tests");

const getSpecificChordTest = () => {

    var measures = [[0], [1, 2], [3, 4], [5, 6]]

    var shouldBe5 = Parser.getSpecificChord(measures, 5)
    var shouldBeUndefined = Parser.getSpecificChord(measures, 8)

    return TestUtils.assertEqualsPrimitives(shouldBe5, 5) &&
        TestUtils.assertUndefined(shouldBeUndefined)
};

testSuite.addTest(new TestUtils.UnitTest(getSpecificChordTest, "Getting specific chord test"));

const wtracenieInLastChordTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\wtracenie_in_last_chord.txt")
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Wtracenie cannot be the last chord", Parser.parse, [ex])
}

testSuite.addTest(new TestUtils.UnitTest(wtracenieInLastChordTest, "Wtracenie in last chord test"));


testSuite.run();