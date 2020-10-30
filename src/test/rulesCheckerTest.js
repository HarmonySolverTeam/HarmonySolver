const UnitTest = require("./TestUtils");
const HarmonicFunction = require("./objects/model/HarmonicFunction");
const Chord = require("./objects/model/Chord");
const Note = require("./objects/model/Note");
const RulesChecker = require("./objects/harmonic/ChordRulesChecker")
const RuleUtils = require("./objects/commons/RulesCheckerUtils")
const Errors = require("./objects/commons/Errors")
const Consts = require("./objects/commons/Consts")

var rulesCheckerTestSuite = new UnitTest.TestSuite("Rules Checker Tests");

var Connection = RuleUtils.Connection;

var rulesChecker = new RulesChecker.ChordRulesChecker();

const initializeTest = () => {
    return UnitTest.assertEqualsPrimitives(3, rulesChecker.connectionSize) &&
        UnitTest.assertEqualsPrimitives(14, rulesChecker.hardRules.length) &&
        UnitTest.assertEqualsPrimitives(4, rulesChecker.softRules.length);
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(initializeTest, "Initialize chord rulechecker test"));

const concurrentOctavesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"),new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2 = new Chord.Chord(new Note.Note(72,0,"1"),new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(60, 0, "1"),hf1);
    var hf2 = new HarmonicFunction.HarmonicFunction("S",4,undefined,"1",[],[],[],false,undefined,undefined);
    var ch3 = new Chord.Chord(new Note.Note(77,3,"1"),new Note.Note(69, 5, "3"), new Note.Note(60, 0, "5"), new Note.Note(53, 3, "1"),hf2);

    var rule = new RulesChecker.ConcurrentOctavesRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(ch2, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch3, ch1)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(concurrentOctavesTest, "Concurrent octaves test"));

const concurrentFifthsTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"),new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2 = new Chord.Chord(new Note.Note(74,2,"3"),new Note.Note(67, 4, "5"), new Note.Note(60, 0, "1"), new Note.Note(60, 0, "1"),hf1);
    var hf2 = new HarmonicFunction.HarmonicFunction("S",4,undefined,"1",[],[],[],false,undefined,undefined);
    var ch3 = new Chord.Chord(new Note.Note(81,5,"3"),new Note.Note(72, 0, "5"), new Note.Note(60, 0, "5"), new Note.Note(53, 3, "1"),hf2);

    var rule = new RulesChecker.ConcurrentFifthsRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(ch2, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch3, ch1)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(concurrentFifthsTest, "Concurrent fifths test"));

const crossingVoicesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2 = new Chord.Chord(new Note.Note(67, 4, "5"), new Note.Note(74,2,"3"), new Note.Note(60, 0, "1"), new Note.Note(60, 0, "1"),hf1);
    var ch3 = new Chord.Chord(new Note.Note(76,2,"3"), new Note.Note(67, 4, "5"), new Note.Note(72, 0, "1"), new Note.Note(48, 0, "1"),hf1);
    var ch4 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(72, 0, "1"),hf1);
    var ch5 = new Chord.Chord(new Note.Note(60,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch6 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(52, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch7 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(52, 2, "3"), new Note.Note(60, 0, "1"),hf1);

    var rule = new RulesChecker.CrossingVoicesRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch3, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch4, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch5, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch6, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch7, ch2)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(crossingVoicesTest, "Crossing voices test"));

const oneDirectionTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2 = new Chord.Chord(new Note.Note(84,0,"1"), new Note.Note(79, 4, "5"), new Note.Note(76, 2, "3"), new Note.Note(60, 0, "1"),hf1);
    var ch3 = new Chord.Chord(new Note.Note(60,0,"1"), new Note.Note(55, 4, "5"), new Note.Note(52, 2, "3"), new Note.Note(36, 0, "1"),hf1);

    var rule = new RulesChecker.OneDirectionRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1,  rule.evaluate(new Connection(ch3, ch1)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(oneDirectionTest, "One direction test"));

const forbiddenJumpTest = () => {
    //Incorrect chord definitions only for this test case - only pitch and baseNote is important of soprano
    var hf2 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[],[],[],false,undefined,undefined);
    var hf1 = new HarmonicFunction.HarmonicFunction("cokolwiek innego",1,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf2);
    var ch2 = new Chord.Chord(new Note.Note(85,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    //altered up
    var ch1up = new Chord.Chord(new Note.Note(75,1,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2up = new Chord.Chord(new Note.Note(77,2,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch3up = new Chord.Chord(new Note.Note(78,3,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch4up = new Chord.Chord(new Note.Note(80,4,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch5up = new Chord.Chord(new Note.Note(82,5,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch6up = new Chord.Chord(new Note.Note(84,6,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    //altered down
    var ch1down = new Chord.Chord(new Note.Note(69,6,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2down = new Chord.Chord(new Note.Note(67,5,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch3down = new Chord.Chord(new Note.Note(66,4,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch4down = new Chord.Chord(new Note.Note(64,3,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch5down = new Chord.Chord(new Note.Note(62,2,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch6down = new Chord.Chord(new Note.Note(60,1,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);

    var chdownSameFun = new Chord.Chord(new Note.Note(60,6,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf2);

    var rule = new RulesChecker.ForbiddenJumpRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch1up, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2up, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch3up, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch4up, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch5up, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch6up, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch1down, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2down, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch3down, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch4down, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch5down, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch6down, ch1))) //&&
    // UnitTest.assertEqualsPrimitives(0, RulesChecker.forbiddenJump(ch1, chdownSameFun))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(forbiddenJumpTest, "Forbidden jump test"));

const forbiddenSumJumpTest = () => {
    var hf2 = new HarmonicFunction.HarmonicFunction("T",1,-1,"1",[],[],[],false,undefined,undefined);
    var hf1 = new HarmonicFunction.HarmonicFunction("cokolwiek innego",1,-1,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(72,0,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf2);
    var ch2up = new Chord.Chord(new Note.Note(75,2,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch3up = new Chord.Chord(new Note.Note(78,3,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2down = new Chord.Chord(new Note.Note(69,5,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch3down = new Chord.Chord(new Note.Note(66,4,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var ch2downSameFun = new Chord.Chord(new Note.Note(69,5,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf2);
    var ch3downSameFun = new Chord.Chord(new Note.Note(66,3,"1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf2);

    var rule = new RulesChecker.ForbiddenJumpRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch3up, ch2up, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch3down, ch2down, ch1))) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(ch3downSameFun, ch2downSameFun, ch1)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(forbiddenSumJumpTest, "Forbidden sum jump test"));

//todo && todo co z pierwszym akordem?
const checkIllegalDouble3Test = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(76,0,"3"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"),hf1);
    var neapolitan = new HarmonicFunction.HarmonicFunction("S", 2, undefined, "3>", undefined, [], [], true, undefined, 'minor');
    var ch2 = new Chord.Chord(new Note.Note(69,5,"5"), new Note.Note(65, 3, "3>"), new Note.Note(61, 1, "1>"), new Note.Note(41, 3, "3>"),neapolitan);

    var rule = new RulesChecker.IllegalDoubledThirdRule();
    return UnitTest.assertTrue(rule.hasIllegalDoubled3Rule(ch1)) &&
        UnitTest.assertFalse(rule.hasIllegalDoubled3Rule(ch2))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkIllegalDouble3Test, "Illegal double 3 test"));

const checkConnectionDSTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",1,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(undefined, undefined, undefined, undefined, hf1);
    var hf2 = new HarmonicFunction.HarmonicFunction("S",1,undefined,"1",[],[],[],false,undefined,undefined);
    var ch2 = new Chord.Chord(undefined, undefined, undefined, undefined, hf2);

    var rule = new RulesChecker.DominantSubdominantCheckConnectionRule();
    return UnitTest.assertThrows("Error during checking connections between chords","Forbidden connection: D->S", rule.evaluateIncludingDeflections, [new Connection(ch2,ch1)]);
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkConnectionDSTest, "D->S connection test"));

const checkConnectionDTTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"1",[],["7"],[],false,undefined,undefined);
    var d7 = new Chord.Chord(new Note.Note(65, 3,"7"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(55,4,"1"), hf1);
    var hf2 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[],[],[5],false,undefined,undefined);
    var t1 = new Chord.Chord(new Note.Note(64,2,"3"), new Note.Note(60,0,"1"), new Note.Note(60,0,"1"),new Note.Note(48,1,"1"), hf2);
    hf2.omit = [];
    var hf3 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"1",[],[],[],false,undefined,undefined);
    var d = new Chord.Chord(new Note.Note(67, 4,"5"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(55,4,"1"), hf3);
    var t2 = new Chord.Chord(new Note.Note(67,4,"5"), new Note.Note(64,2,"3"), new Note.Note(60,0,"1"),new Note.Note(48,1,"1"), hf2);

    var rule = new RulesChecker.DominantRelationCheckConnectionRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(t1,d7))) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(t2,d)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkConnectionDTTest, "D->T connection test"));

const checkConnectionDTVITest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"1",[],[7],[],false,undefined,undefined);
    var d7 = new Chord.Chord(new Note.Note(65, 3,"7"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(55,4,"1"), hf1);
    var hf2 = new HarmonicFunction.HarmonicFunction("T",6,undefined,"1",[],[],[],false,undefined,undefined);
    var t1 = new Chord.Chord(new Note.Note(64,2,"5"), new Note.Note(60,0,"3"), new Note.Note(60,0,"3"),new Note.Note(57,5,"1"), hf2);
    var hf3 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"1",[],[],[],false,undefined,undefined);
    var d = new Chord.Chord(new Note.Note(67, 4,"1"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(55,4,"1"), hf3);

    var rule = new RulesChecker.DominantSecondRelationCheckConnectionRule();
    var ruleIllegal3 = new RulesChecker.IllegalDoubledThirdRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(t1,d7))) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(t1,d))) &&
        UnitTest.assertEqualsPrimitives(0, ruleIllegal3.evaluate(new Connection(t1,d7))) &&
        UnitTest.assertEqualsPrimitives(0, ruleIllegal3.evaluate(new Connection(t1,d)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkConnectionDTVITest, "D->TVI connection test"));

const checkConnectionDTVIDownTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"1",[],[7],[],false,undefined,undefined);
    var d7 = new Chord.Chord(new Note.Note(65, 3,"7"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(55,4,"1"), hf1);
    var hf2 = new HarmonicFunction.HarmonicFunction("T",6,undefined,"1",[],[],[],true,undefined,undefined);
    var t1 = new Chord.Chord(new Note.Note(63,2,"5"), new Note.Note(60,0,"3"), new Note.Note(60,0,"3"),new Note.Note(56,5,"1"), hf2);
    var hf3 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"1",[],[],[],false,undefined,undefined);
    var d = new Chord.Chord(new Note.Note(67, 4,"1"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(55,4,"1"), hf3);

    var rule = new RulesChecker.DominantSecondRelationCheckConnectionRule();
    var ruleIllegal3 = new RulesChecker.IllegalDoubledThirdRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(t1,d7))) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(t1,d))) &&
        UnitTest.assertEqualsPrimitives(0, ruleIllegal3.evaluate(new Connection(t1,d7))) &&
        UnitTest.assertEqualsPrimitives(0, ruleIllegal3.evaluate(new Connection(t1,d)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkConnectionDTVIDownTest, "D->TVI(down) connection test"));

const checkDelayCorrectnessTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"1",[["6","5"],["4","3"]],["6","4"],["4","3"],false,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(67, 4,"1"), new Note.Note(64,2,"6"), new Note.Note(60, 0,"4"), new Note.Note(55,4,"1"), hf1);
    var ch2 = new Chord.Chord(new Note.Note(67, 4,"1"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(43,4,"1"), hf2);

    var ch3 = new Chord.Chord(new Note.Note(65, 3,"7"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(43,4,"1"), hf2);
    var ch4 = new Chord.Chord(new Note.Note(69, 4,"3"), new Note.Note(62,1,"5"), new Note.Note(55, 6,"1"), new Note.Note(43,4,"1"), hf2);

    var rule = new RulesChecker.CheckDelayCorrectnessRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(ch2, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch3, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch4, ch1)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkDelayCorrectnessTest, "Delay correctness test"));

const hiddenOctavesTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"3",[],[],[],false,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("T",1,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(67, 4,"1"), new Note.Note(62,1,"5"), new Note.Note(55, 4,"1"), new Note.Note(47,6,"3"), hf1);
    var ch2 = new Chord.Chord(new Note.Note(72, 0,"1"), new Note.Note(64,2,"3"), new Note.Note(55, 4,"5"), new Note.Note(48,0,"1"), hf2);

    var rule = new RulesChecker.HiddenOctavesRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2, ch1)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(hiddenOctavesTest, "Hidden octaves test"));

const falseRelationTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("S",2,undefined,"3",[],[],[],true,undefined,'minor');
    var hf2 = new HarmonicFunction.HarmonicFunction("D",5,undefined,"1",[],[],[],false,undefined,undefined);
    var ch1 = new Chord.Chord(new Note.Note(68, 5,">5"), new Note.Note(65,3,"3"), new Note.Note(61, 1,">1"), new Note.Note(41,3,"3"), hf1);
    var ch2 = new Chord.Chord(new Note.Note(67, 4,"1"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(43,4,"1"), hf2);

    var d1 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,[],["7"],[],false,undefined,undefined, "D");
    var d2 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,[],["7"],["5"],false,undefined,undefined, undefined);

    var ch3 = new Chord.Chord(new Note.Note(76, 2,"5"), new Note.Note(67,4,"7"), new Note.Note(61, 0,"3"), new Note.Note(45,5,"1"), d1);
    var ch4 = new Chord.Chord(new Note.Note(72, 0,"7"), new Note.Note(66,3,"3"), new Note.Note(62, 1,"1"), new Note.Note(50,1,"1"), d2);

    var rule = new RulesChecker.FalseRelationRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch4, ch3)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(falseRelationTest, "False relation test"));

const translatingClassicDeflectionsTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,[],[],[],false,undefined,undefined,"G");
    var hf2 = new HarmonicFunction.HarmonicFunction("S",undefined,undefined,undefined,[],[],[],false,undefined,undefined);

    var undefinedNote = new Note.Note(); //doesn't matter in this test
    var ch1 = new Chord.Chord(undefinedNote, undefinedNote, undefinedNote, undefinedNote, hf1);
    var ch2 = new Chord.Chord(undefinedNote, undefinedNote, undefinedNote, undefinedNote, hf2);

    var rule = new RulesChecker.ICheckConnectionRule();
    var connection1 = rule.translateConnectionIncludingDeflections(new Connection(ch2, ch1));
    return UnitTest.assertEqualsPrimitives(Consts.FUNCTION_NAMES.TONIC, connection1.current.harmonicFunction.functionName) &&
        UnitTest.assertEqualsPrimitives(1, connection1.current.harmonicFunction.degree) &&
        UnitTest.assertEqualsPrimitives(hf1.functionName, connection1.prev.harmonicFunction.functionName) &&
        UnitTest.assertEqualsPrimitives(hf1.degree, connection1.prev.harmonicFunction.degree)
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(translatingClassicDeflectionsTest, "Translating classic deflections test"));

const translatingBackwardDeflectionsTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,[],[],[],false,undefined,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("S",undefined,undefined,undefined,[],[],[],false,undefined,undefined, "G", true);

    var undefinedNote = new Note.Note(); //doesn't matter in this test
    var ch1 = new Chord.Chord(undefinedNote, undefinedNote, undefinedNote, undefinedNote, hf1);
    var ch2 = new Chord.Chord(undefinedNote, undefinedNote, undefinedNote, undefinedNote, hf2);

    var rule = new RulesChecker.ICheckConnectionRule();
    var connection1 = rule.translateConnectionIncludingDeflections(new Connection(ch2, ch1));
    return UnitTest.assertEqualsPrimitives(Consts.FUNCTION_NAMES.TONIC, connection1.prev.harmonicFunction.functionName) &&
        UnitTest.assertEqualsPrimitives(1, connection1.prev.harmonicFunction.degree) &&
        UnitTest.assertEqualsPrimitives(hf2.functionName, connection1.current.harmonicFunction.functionName) &&
        UnitTest.assertEqualsPrimitives(hf2.degree, connection1.current.harmonicFunction.degree)
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(translatingBackwardDeflectionsTest, "Translating backward deflections test"));

const translatingDeflectionsSameKeyTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("S",undefined,undefined,undefined,[],[],[],false,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,[],[],[],false,undefined,undefined);

    var undefinedNote = new Note.Note(); //doesn't matter in this test
    var ch1 = new Chord.Chord(undefinedNote, undefinedNote, undefinedNote, undefinedNote, hf1);
    var ch2 = new Chord.Chord(undefinedNote, undefinedNote, undefinedNote, undefinedNote, hf2);

    var rule = new RulesChecker.ICheckConnectionRule();
    var connection1 = rule.translateConnectionIncludingDeflections(new Connection(ch2, ch1));
    return UnitTest.assertEqualsPrimitives(hf1.functionName, connection1.prev.harmonicFunction.functionName) &&
        UnitTest.assertEqualsPrimitives(hf1.degree, connection1.prev.harmonicFunction.degree) &&
        UnitTest.assertEqualsPrimitives(hf2.functionName, connection1.current.harmonicFunction.functionName) &&
        UnitTest.assertEqualsPrimitives(hf2.degree, connection1.current.harmonicFunction.degree)
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(translatingDeflectionsSameKeyTest, "Translating deflections same key test"));

const translatingDeflectionsDeflectionBeginningTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("S",undefined,undefined,undefined,[],[],[],false,undefined,undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,[],[],[],false,undefined,undefined, "G");

    var undefinedNote = new Note.Note(); //doesn't matter in this test
    var ch1 = new Chord.Chord(undefinedNote, undefinedNote, undefinedNote, undefinedNote, hf1);
    var ch2 = new Chord.Chord(undefinedNote, undefinedNote, undefinedNote, undefinedNote, hf2);

    var rule = new RulesChecker.ICheckConnectionRule();
    var connection1 = rule.translateConnectionIncludingDeflections(new Connection(ch2, ch1));
    return UnitTest.assertUndefined(connection1)
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(translatingDeflectionsDeflectionBeginningTest, "Translating deflections deflections beginning test"));

const checkConnectionForModulations = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("S",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined, undefined);
    var hf2 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,undefined,["7"],["5"],undefined,undefined,undefined, "F");
    var hf3 = new HarmonicFunction.HarmonicFunction("T",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined, undefined);
    var hf4 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined, "C");

    var ch1 = new Chord.Chord(new Note.Note(72, 0,"1"), new Note.Note(70,6,"7"), new Note.Note(64, 2,"3"), new Note.Note(48,0,"1"), hf2);
    var ch2 = new Chord.Chord(new Note.Note(72, 0,"5"), new Note.Note(69,5,"3"), new Note.Note(65, 3,"1"), new Note.Note(53,3,"1"), hf1);
    var ch3 = new Chord.Chord(new Note.Note(72, 0,"5"), new Note.Note(72,0,"1"), new Note.Note(69, 5,"3"), new Note.Note(53,3,"1"), hf1);
    var ch4 = new Chord.Chord(new Note.Note(72, 0,"1"), new Note.Note(67,4,"5"), new Note.Note(64, 2,"3"), new Note.Note(48,0,"1"), hf3);
    var ch5 = new Chord.Chord(new Note.Note(74, 1,"5"), new Note.Note(71,6,"3"), new Note.Note(62, 1,"5"), new Note.Note(55,4,"1"), hf4);

    var rule = new RulesChecker.DominantRelationCheckConnectionRule();

    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(ch2, ch1))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch3, ch1))) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(ch2, ch4))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2, ch5)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkConnectionForModulations, "Check connection for modulations test"));

//todo move this to generatorTest?
const isCorrectChopinChord = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,undefined,["7","6"],["5"],undefined,undefined,undefined, "C");
    var hf2 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,undefined,["7","6"],["5"],undefined,undefined,undefined, "c");

    var ch1 = new Chord.Chord(new Note.Note(76, 2,"6"), new Note.Note(71,6,"3"), new Note.Note(65, 3,"7"), new Note.Note(55,4,"1"), hf1);
    var ch2 = new Chord.Chord(new Note.Note(77, 3,"7"), new Note.Note(71,6,"3"), new Note.Note(64, 2,"6"), new Note.Note(55,4,"1"), hf1);
    var ch3 = new Chord.Chord(new Note.Note(75, 3,"6>"), new Note.Note(71,6,"3"), new Note.Note(65, 2,"7"), new Note.Note(55,4,"1"), hf2);

    return UnitTest.assertTrue(RulesChecker.correctChopinChord(ch1)) &&
        UnitTest.assertFalse(RulesChecker.correctChopinChord(ch2)) &&
        UnitTest.assertTrue(RulesChecker.correctChopinChord(ch3))
};

// rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(isCorrectChopinChord, "Check correctness for Chopin chord test"));

const chopinTonicConnection = () => {
    var d1 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,undefined,["7","6"],["5"],undefined,undefined,undefined, "C");
    var d2 = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,undefined,["7","6"],["5"],undefined,undefined,undefined, "c");
    var t1 = new HarmonicFunction.HarmonicFunction("T",undefined,undefined,undefined,undefined,undefined,["5"],undefined,undefined,undefined, "C");
    var t2 = new HarmonicFunction.HarmonicFunction("T",undefined,undefined,undefined,undefined,undefined,["5"],undefined,undefined,undefined, "c");

    var ch1 = new Chord.Chord(new Note.Note(76, 2,"6"), new Note.Note(71,6,"3"), new Note.Note(65, 3,"7"), new Note.Note(55,4,"1"), d1);
    var ch2 = new Chord.Chord(new Note.Note(75, 3,"6>"), new Note.Note(71,6,"3"), new Note.Note(65, 2,"7"), new Note.Note(55,4,"1"), d2);

    var ch3 = new Chord.Chord(new Note.Note(72, 0,"1"), new Note.Note(72,0,"1"), new Note.Note(64, 2,"3"), new Note.Note(60,0,"1"), t1);
    var ch4 = new Chord.Chord(new Note.Note(72, 0,"1"), new Note.Note(72,0,"1"), new Note.Note(63, 2,"3>"), new Note.Note(60,0,"1"), t1);
    var ch5 = new Chord.Chord(new Note.Note(79, 4,"5"), new Note.Note(72,0,"1"), new Note.Note(64, 2,"3"), new Note.Note(60,0,"1"), t1);

    var rule = new RulesChecker.DominantRelationCheckConnectionRule();

    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(ch3,ch1))) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(ch4,ch2))) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch5,ch1)))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(chopinTonicConnection, "Check correctness of Chopin -> T test"));

const sameFunctionConnectionTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("T");
    var ch1 = new Chord.Chord(new Note.Note(72, 0, "1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(48, 0, "1"), hf1);
    var ch2 = new Chord.Chord(new Note.Note(72, 0, "1"), new Note.Note(67, 4, "5"), new Note.Note(64, 2, "3"), new Note.Note(60, 0, "1"), hf1);

    var rule = new RulesChecker.SameFunctionCheckConnectionRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2,ch1)));
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(sameFunctionConnectionTest, "Same function connection test"));

const checkConnectionSDTest = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("S");
    var hf2 = new HarmonicFunction.HarmonicFunction("D");

    var ch1 = new Chord.Chord(new Note.Note(72, 3,"5"), new Note.Note(69,5,"3"), new Note.Note(60, 0,"5"), new Note.Note(53,3,"1"), hf1);
    var ch2 = new Chord.Chord(new Note.Note(74, 6,"5"), new Note.Note(62,1,"5"), new Note.Note(59, 6,"3"), new Note.Note(55,4,"1"), hf2);

    var rule = new RulesChecker.SubdominantDominantCheckConnectionRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(new Connection(ch2,ch1)));
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkConnectionSDTest, "S->D connection test"));

const checkConnectionDT64Test = () => {
    var hf1 = new HarmonicFunction.HarmonicFunction("D",undefined, undefined, undefined, undefined,["7"]);
    var hf2 = new HarmonicFunction.HarmonicFunction("T", undefined, undefined, undefined, [["6","5"],["4","3"]],["6","4"], ["5","3"], undefined, undefined, Consts.MODE.MINOR);

    var ch1 = new Chord.Chord(new Note.Note(77, 3,"7"), new Note.Note(71,6,"3"), new Note.Note(62, 1,"5"), new Note.Note(55,4,"1"), hf1);
    var ch2 = new Chord.Chord(new Note.Note(77, 6,"4"), new Note.Note(72,0,"1"), new Note.Note(69, 6,"6"), new Note.Note(60,0,"1"), hf2);

    var rule = new RulesChecker.DominantRelationCheckConnectionRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(new Connection(ch2,ch1)));
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(checkConnectionDT64Test, "D->T6-4 connection test"));

rulesCheckerTestSuite.run();