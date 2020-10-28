var ChordComponent = require("./objects/model/ChordComponent")
var TestUtils = require("./TestUtils");

var testSuite = new TestUtils.TestSuite("ChordComponent tests");

var testBaseComponent = (chordComponentString, expectedBaseComponent) => {
    var chordComponent = new ChordComponent.ChordComponent(chordComponentString);
    return TestUtils.assertEqualsPrimitives(expectedBaseComponent, chordComponent.baseComponent)
};

var testComponentSemitoneNumber = (chordComponentString, expectedSemitoneNumber) => {
    var chordComponent = new ChordComponent.ChordComponent(chordComponentString);
    return TestUtils.assertEqualsPrimitives(expectedSemitoneNumber, chordComponent.semitonesNumber);
};

testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent("3", "3"), "Test base component \"3\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent("13", "13"), "Test base component \"13\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent("13>", "13"), "Test base component \"13>\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent("7>", "7"), "Test base component \"7>\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent("7>>", "7"), "Test base component \"7>>\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent("7<", "7"), "Test base component \"7<\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent("7<<", "7"), "Test base component \"7<<\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent(">7", "7"), "Test base component \">7\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent(">>7", "7"), "Test base component \">>7\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent("<7", "7"), "Test base component \"<7\""));
testSuite.addTest(new TestUtils.UnitTest( () => testBaseComponent("<<7", "7"), "Test base component \"<<7\""));


testSuite.addTest(new TestUtils.UnitTest( () => testComponentSemitoneNumber("1", 0), "Test component semitones number \"1\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSemitoneNumber("1<", 1), "Test component semitones number \"1<\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSemitoneNumber("2", 2), "Test component semitones number \"2\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSemitoneNumber("2>", 1), "Test component semitones number \"2>\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSemitoneNumber("2<", 3), "Test component semitones number \"2<\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSemitoneNumber("2>>", 0), "Test component semitones number \"2>>\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSemitoneNumber("2<<", 4), "Test component semitones number \"2<<\""));
//todo: write all other test cases...


testSuite.run();
