var HarmonicFunction = require("./objects/model/HarmonicFunction");
var Utils = require("./objects/utils/Utils")
var Parser = require("./objects/harmonic/Parser");
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

const chainedDeflectionTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\chained_deflection_basic.txt")
    var harmFunctions = Parser.parse(ex)
    return TestUtils.assertEqualsPrimitives(harmFunctions.measures[0][1].key, "D")
        && TestUtils.assertEqualsPrimitives(harmFunctions.measures[0][2].key, "G")
}

testSuite.addTest(new TestUtils.UnitTest(chainedDeflectionTest, "chainedDeflectionTest"));

const deflectionBetweenMeasuresTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\minor\\basic_deflection_between_measures.txt")
    var harmFunctions = Parser.parse(ex)
    return TestUtils.assertEqualsPrimitives(harmFunctions.measures[0][1].key, "a")
        && TestUtils.assertEqualsPrimitives(harmFunctions.measures[1][0].key, "a")
}

testSuite.addTest(new TestUtils.UnitTest(deflectionBetweenMeasuresTest, "deflectionBetweenMeasuresTest"));

const chainedDeflectionBackwardsTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\deflection_backwards.txt")
    var harmFunctions = Parser.parse(ex)
    return TestUtils.assertEqualsPrimitives(harmFunctions.measures[0][2].key, "F")
        && TestUtils.assertEqualsPrimitives(harmFunctions.measures[1][0].key, "Bb")
}

testSuite.addTest(new TestUtils.UnitTest(chainedDeflectionBackwardsTest, "Chained deflection backwards"));

const deflectionBetweenMeasuresBackwardsTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\deflection_backwards_between_measures.txt")
    var harmFunctions = Parser.parse(ex)
    return TestUtils.assertEqualsPrimitives(harmFunctions.measures[0][2].key, "Bb")
        && TestUtils.assertEqualsPrimitives(harmFunctions.measures[1][0].key, "Bb")
}

testSuite.addTest(new TestUtils.UnitTest(deflectionBetweenMeasuresBackwardsTest, "Deflection backwards between measures"));

const deflectionTopBackwardDeflectionTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\deflection_to_backward_deflection.txt")
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Backward deflection could not be after forward deflection.", Parser.parse, [ex])
}

testSuite.addTest(new TestUtils.UnitTest(deflectionTopBackwardDeflectionTest, "Deflection to backward deflection"));

const emptyDeflectionTest = () => {
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Deflection cannot be empty.", Parser.parse, ["dev\nC\n4/4\nT{};();T{}"])
}

testSuite.addTest(new TestUtils.UnitTest(emptyDeflectionTest, "Empty deflection"));

const firstChordBackwardDeflectionTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\deflection_backward_first_chord.txt")

    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Backward deflection cannot be the first chord", Parser.parse, [ex])
}

testSuite.addTest(new TestUtils.UnitTest(firstChordBackwardDeflectionTest, "Backward deflection in first chord"));

const basicElipseTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\elipse_correct.txt")
    var harmFunctions = Parser.parse(ex)

    return TestUtils.assertEqualsPrimitives(harmFunctions.measures[0][1].key, "a") &&
        TestUtils.assertEqualsPrimitives(harmFunctions.measures[0][2].key, "a") &&
        TestUtils.assertEqualsPrimitives(harmFunctions.measures[2][1].key, "G") &&
        TestUtils.assertEqualsPrimitives(harmFunctions.measures[2][2].key, "G") &&
        TestUtils.assertEqualsPrimitives("T", harmFunctions.measures[0][2].functionName) &&
        TestUtils.assertEqualsPrimitives(6, harmFunctions.measures[0][2].degree)
}

testSuite.addTest(new TestUtils.UnitTest(basicElipseTest, "Basic elipse test"));

const elipseInsideDeflectionTest = () => {
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Elipse cannot be inside deflection.", Parser.parse, ["C\n/3/4\n(T{};[S{}]);T{}"]) &&
        TestUtils.assertThrows("Error during parsing harmonic functions input",
            "Elipse cannot be inside deflection.", Parser.parse, ["C\n/3/4\n([S{}]);T{}"])
}

testSuite.addTest(new TestUtils.UnitTest(elipseInsideDeflectionTest, "Elipse inside deflection"));

const oneChordInElipseTest = () => {
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "There could be only one chord in elipse.", Parser.parse, ["C\n/3/4\n(D{});[S{};D{}];T{}"])
}

testSuite.addTest(new TestUtils.UnitTest(oneChordInElipseTest, "One chord in elipse"));

const emptyElipseTest = () => {
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Elipse cannot be empty.", Parser.parse, ["dev\nC\n/3/4\n(D{});[];T{}"])
}

testSuite.addTest(new TestUtils.UnitTest(emptyElipseTest, "Empty elipse"));


const whitespacesHandlingTest = () => {
    var ex = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\whitespaces.txt")
    var harmFunctions = Parser.parse(ex)
    return TestUtils.assertDefined(harmFunctions)
}

testSuite.addTest(new TestUtils.UnitTest(whitespacesHandlingTest, "Handling whitespaces"));

const newNotationTest = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\new_notation\\example_correct.txt");
    input = input.replace(/\r/g,"")

    var lines = input.split("\n")
    var translated = Parser.translateToOldNotation(lines.splice(2,2));
    return TestUtils.assertEqualsObjects([
            '(D{"position":"5"});(S{"system":"open","degree":2,"omit":["5","7"],"delay":[["2","3"],["4","5"]]}',
            'Do{"position":"1","revolution":"3","isRelatedBackwards":true,"down":true});T{"extra":["6","7"]}'
        ], translated) &&
        TestUtils.assertDefined(Parser.parse(input))
}

testSuite.addTest(new TestUtils.UnitTest(newNotationTest, "New notation test"));

const newNotationEmptyDeflectionTest = () => {
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Wrong harmonic structure. Check name, curly parenthesis and deflection parenthesis. ()", Parser.parse, ["C\n4/4\nT{};();T{}"])
}

testSuite.addTest(new TestUtils.UnitTest(newNotationEmptyDeflectionTest, "New notation empty deflection test"));

const newNotationIllegalPropertyTest = () => {
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Invalid property name. Allowed: \"position\", \"revolution\", \"system\", \"degree\", \"extra\", " +
        "\"omit\", \"delay\",\"down\", \"isRelatedBackwards\". Found \"positio\"", Parser.parse, ["C\n4/4\nT{positio:5}"])
}

testSuite.addTest(new TestUtils.UnitTest(newNotationIllegalPropertyTest, "New notation illegal property test"));

const newNotationWrongDelayTest = () => {
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Delay should match pattern \"X-Y\". Found: 5", Parser.parse, ["C\n4/4\nT{delay:5,4}"])
}

testSuite.addTest(new TestUtils.UnitTest(newNotationWrongDelayTest, "New notation wrong delay test"));

const newNotationInvalidKeyValueTest = () => {
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Invalid number of \":\" delay:5:4", Parser.parse, ["C\n4/4\nT{delay:5:4}"])
}

testSuite.addTest(new TestUtils.UnitTest(newNotationInvalidKeyValueTest, "New notation invalid key:value relation test"));

const newNotationInvalidBooleanPropertyTest = () => {
    return TestUtils.assertThrows("Error during parsing harmonic functions input",
        "Property \"isRelatedBackwards\" should not have any value. Found: true", Parser.parse, ["C\n4/4\nT{isRelatedBackwards:true}"]) &&
        TestUtils.assertThrows("Error during parsing harmonic functions input",
            "Property \"down\" should not have any value. Found: true", Parser.parse, ["C\n4/4\nT{down:true}"])
}

testSuite.addTest(new TestUtils.UnitTest(newNotationInvalidBooleanPropertyTest, "New notation invalid boolean property test"));

testSuite.run();