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

const deflectionInLastChordTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\deflection_in_last_chord.txt")
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Deflection cannot be the last chord", Parser.parse, [ex])
}

testSuite.addTest(new TestUtils.UnitTest(deflectionInLastChordTest, "deflection in last chord test"));

const deflectionInsideDeflectionTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\deflection_inside_deflection.txt")
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Deflection cannot be inside another deflection.", Parser.parse, [ex])
}

testSuite.addTest(new TestUtils.UnitTest(deflectionInsideDeflectionTest, "deflection inside another deflection test"));


const unclosedDeflectionTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\unclosed_deflection.txt")
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "There is unclosed deflection", Parser.parse, [ex])
}

testSuite.addTest(new TestUtils.UnitTest(unclosedDeflectionTest, "parentheses mismatch - unclosed deflection"));

const unexpectedEndOfDeflectionTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\unexpected_end_of_deflection.txt")
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Unexpected end of deflection:", Parser.parse, [ex])
}


testSuite.addTest(new TestUtils.UnitTest(unexpectedEndOfDeflectionTest, "parentheses mismatch - unexpected end of deflection"));

testSuite.run();