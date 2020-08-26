var ChordComponent = require("./objects/ChordComponent")
var TestUtils = require("./TestUtils");

var testSuite = new TestUtils.TestSuite("ChordComponent tests");

var testBaseComponent = (chordComponentString, expectedBaseComponent) => {
    var chordComponent = new ChordComponent.ChordComponent(chordComponentString);
    return TestUtils.assertEqualsPrimitives(expectedBaseComponent, chordComponent.baseComponent)
};

var testComponentSeminoteNumber = (chordComponentString, expectedSeminoteNumber) => {
    var chordComponent = new ChordComponent.ChordComponent(chordComponentString);
    return TestUtils.assertEqualsPrimitives(expectedSeminoteNumber, chordComponent.seminotesNumber);
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


testSuite.addTest(new TestUtils.UnitTest( () => testComponentSeminoteNumber("1", 0), "Test component seminotes number \"1\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSeminoteNumber("1<", 1), "Test component seminotes number \"1<\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSeminoteNumber("2", 2), "Test component seminotes number \"2\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSeminoteNumber("2>", 1), "Test component seminotes number \"2>\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSeminoteNumber("2<", 3), "Test component seminotes number \"2<\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSeminoteNumber("2>>", 0), "Test component seminotes number \"2>>\""));
testSuite.addTest(new TestUtils.UnitTest( () => testComponentSeminoteNumber("2<<", 4), "Test component seminotes number \"2<<\""));
//todo: write all other test cases...


testSuite.run();
