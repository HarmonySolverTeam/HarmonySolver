const UnitTest = require("./TestUtils");
const HarmonicFunction = require("./objects/HarmonicFunction");
const Chord = require("./objects/Chord");
const Note = require("./objects/Note");
const RulesChecker = require("./objects/RulesChecker")

var rulesCheckerTestSuite = new UnitTest.TestSuite("Rules Checker Tests");

const concurrentOctavesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,-1,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"),new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2 = new Chord.Chord(new Note.Note(72,0,"1"),new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(60, 0, "1"),hf1);
    var hf2 = new HarmonicFunction.HarmonicFunction("S",4,-1,"1",[],[],[],false,undefined,undefined);
    var ch3 = new Chord.Chord(new Note.Note(77,3,"1"),new Note.Note(69, 5, "3"), new Note.Note(60, 0, "5"), new Note.Note(53, 3, "1"),hf2);

    return UnitTest.assertEqualsPrimitives(0, RulesChecker.concurrentOctaves(ch1, ch2)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.concurrentOctaves(ch1, ch3))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(concurrentOctavesTest, "Concurrent octaves test"));

const concurrentFifthsTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,-1,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"),new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2 = new Chord.Chord(new Note.Note(74,2,"3"),new Note.Note(67, 4, "5"), new Note.Note(60, 0, "1"), new Note.Note(60, 0, "1"),hf1);
    var hf2 = new HarmonicFunction.HarmonicFunction("S",4,-1,"1",[],[],[],false,undefined,undefined);
    var ch3 = new Chord.Chord(new Note.Note(81,5,"3"),new Note.Note(72, 0, "5"), new Note.Note(60, 0, "5"), new Note.Note(53, 3, "1"),hf2);

    return UnitTest.assertEqualsPrimitives(0, RulesChecker.concurrentFifths(ch1, ch2)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.concurrentFifths(ch1, ch3))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(concurrentFifthsTest, "Concurrent fifths test"));

const crossingVoicesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,-1,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2 = new Chord.Chord(new Note.Note(67, 4, "5"), new Note.Note(74,2,"3"), new Note.Note(60, 0, "1"), new Note.Note(60, 0, "1"),hf1);
    var ch3 = new Chord.Chord(new Note.Note(76,2,"3"), new Note.Note(67, 4, "5"), new Note.Note(72, 0, "1"), new Note.Note(48, 0, "1"),hf1);
    var ch4 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(72, 0, "1"),hf1);
    var ch5 = new Chord.Chord(new Note.Note(60,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch6 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(52, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch7 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(52, 2, "3"), new Note.Note(60, 0, "1"),hf1);

    return UnitTest.assertEqualsPrimitives(-1, RulesChecker.crossingVoices(ch1, ch2)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.crossingVoices(ch1, ch3)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.crossingVoices(ch1, ch4)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.crossingVoices(ch1, ch5)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.crossingVoices(ch1, ch6)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.crossingVoices(ch2, ch7))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(crossingVoicesTest, "Crossing voices test"));

const oneDirectionTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,-1,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2 = new Chord.Chord(new Note.Note(84,0,"1"), new Note.Note(79, 4, "5"), new Note.Note(76, 2, "3"), new Note.Note(60, 0, "1"),hf1);
    var ch3 = new Chord.Chord(new Note.Note(60,0,"1"), new Note.Note(55, 4, "5"), new Note.Note(52, 2, "3"), new Note.Note(36, 0, "1"),hf1);

    return UnitTest.assertEqualsPrimitives(-1, RulesChecker.oneDirection(ch1, ch2)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.oneDirection(ch1, ch3))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(oneDirectionTest, "One direction test"));

const forbiddenJumpTest = () => {
    //Incorrect chord definitions only for this test case - only pitch and baseNote is important of soprano
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,-1,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2 = new Chord.Chord(new Note.Note(85,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    //altered up
    var ch3up = new Chord.Chord(new Note.Note(72,1,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch4up = new Chord.Chord(new Note.Note(73,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch5up = new Chord.Chord(new Note.Note(75,1,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch6up = new Chord.Chord(new Note.Note(77,2,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch7up = new Chord.Chord(new Note.Note(78,3,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch8up = new Chord.Chord(new Note.Note(80,4,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch9up = new Chord.Chord(new Note.Note(82,5,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch10up = new Chord.Chord(new Note.Note(84,6,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    //altered down
    var ch3down = new Chord.Chord(new Note.Note(72,6,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch4down = new Chord.Chord(new Note.Note(70,5,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch5down = new Chord.Chord(new Note.Note(68,4,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch6down = new Chord.Chord(new Note.Note(66,3,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch7down = new Chord.Chord(new Note.Note(65,2,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch8down = new Chord.Chord(new Note.Note(63,1,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch9down = new Chord.Chord(new Note.Note(61,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch10down = new Chord.Chord(new Note.Note(60,6,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);

    return UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch2)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch3up)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch4up)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch5up)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch6up)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch7up)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch8up)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch9up)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch10up)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch3down)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch4down)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch5down)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch6down)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch7down)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch8down)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch9down)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenJump(ch1, ch10down))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(forbiddenJumpTest, "Forbidden jump test"));

const forbiddenSumJumpTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,-1,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2up = new Chord.Chord(new Note.Note(75,2,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch3up = new Chord.Chord(new Note.Note(78,3,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2down = new Chord.Chord(new Note.Note(69,5,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch3down = new Chord.Chord(new Note.Note(66,3,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);

    return UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenSumJump(ch1, ch2up, ch3up)) &&
        UnitTest.assertEqualsPrimitives(-1, RulesChecker.forbiddenSumJump(ch1, ch2down, ch3down))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(forbiddenSumJumpTest, "Forbidden sum jump test"));

const checkIllegalDouble3Test = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,-1,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(76,0,"3"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var neapolitan = new HarmonicFunction.HarmonicFunction("S", 2, -1, "3", undefined, [], [], true, undefined, 'minor');
    var ch2 = new Chord.Chord(new Note.Note(69,5,"5"), new Note.Note(65, 3, "3"), new Note.Note(61, 1, "1"), new Note.Note(41, 3, "3"),neapolitan);

    return UnitTest.assertTrue(RulesChecker.checkIllegalDoubled3(ch1)) &&
        UnitTest.assertFalse(RulesChecker.checkIllegalDoubled3(ch2))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkIllegalDouble3Test, "Illegal double 3 test"));

rulesCheckerTestSuite.run();