const UnitTest = require("./TestUtils");
const HarmonicFunction = require("./objects/HarmonicFunction");
const Note = require("./objects/Note");
const RulesChecker = require("./objects/SopranoRulesChecker")
const RulesCheckerUtils = require("./objects/RulesCheckerUtils")
const Consts = require("./objects/Consts")

var rulesCheckerTestSuite = new UnitTest.TestSuite("Soprano Rules Checker Tests");

var rulesChecker = new RulesChecker.SopranoRulesChecker("C");

const initializeTest = () => {
    return UnitTest.assertEqualsPrimitives(2, rulesChecker.connectionSize) &&
        UnitTest.assertEqualsPrimitives(3, rulesChecker.hardRules.length) &&
        UnitTest.assertEqualsPrimitives(5, rulesChecker.softRules.length);
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(initializeTest, "Initialize soprano rulechecker test"));
 
const DSTest = () => {
    var connection = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D"))
    );
    var allowedConnection = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,"F"))
    );
    var rule = new RulesChecker.ForbiddenDSConnectionRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(connection)) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(allowedConnection)) &&
        UnitTest.assertFalse(rulesChecker.evaluateHardRules(connection))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(DSTest, "D -> S connection test"));

const FunctionMustChangeAtMeasureBeginningTest = () => {
    var connection = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"), Consts.MEASURE_PLACE.BEGINNING),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"), Consts.MEASURE_PLACE.DOWNBEAT)
    );
    var rule = new RulesChecker.ChangeFunctionAtMeasureBeginningRule();
    return UnitTest.assertEqualsPrimitives(-1, rule.evaluate(connection))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(FunctionMustChangeAtMeasureBeginningTest,
    "Function must change at measure beginning test"));

const DominantRelationRuleTest = () => {
    var connection1 = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S",2))
    );
    var connection2 = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S",2))
    );
    var rule = new RulesChecker.DominantRelationRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(connection1)) &&
        UnitTest.assertEqualsPrimitives(2, rule.evaluate(connection2))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(DominantRelationRuleTest,
    "Dominant relation test"));

const TSDCadenceRuleTest = () => {
    var connectionSD = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"))
    );
    var connectionDT = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D"))
    );
    var connectionTS = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T"))
    );

    var connectionTD = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T"))
    );
    var connectionST = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"))
    );

    var connectionDS = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D"))
    );

    var rule = new RulesChecker.ChangeFunctionConnectionRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(connectionSD)) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(connectionDT)) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(connectionTS)) &&
        UnitTest.assertEqualsPrimitives(10, rule.evaluate(connectionTD)) &&
        UnitTest.assertEqualsPrimitives(10, rule.evaluate(connectionST)) &&
        UnitTest.assertEqualsPrimitives(10, rule.evaluate(connectionDS))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(TSDCadenceRuleTest,
    "TSD cadence rule test"));

const JumpRuleTest = () => {
    var connectionWithJumpWithNotChange = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D"), 2,new Note.Note(71)),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D"), 0,new Note.Note(74))
    );
    var connectionWithJumpWithChange = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"), 2,new Note.Note(69)),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T"), 0,new Note.Note(72))
    );

    var connectionWithNoJumpWithNotChange = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T"), 2,new Note.Note(72)),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"), 0,new Note.Note(72))
    );
    var connectionWithNoJumpWithChange = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"), 2,new Note.Note(72)),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"), 0,new Note.Note(72))
    );

    var rule = new RulesChecker.JumpRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(connectionWithJumpWithNotChange)) &&
        UnitTest.assertEqualsPrimitives(5, rule.evaluate(connectionWithJumpWithChange)) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(connectionWithNoJumpWithNotChange)) &&
        UnitTest.assertEqualsPrimitives(5, rule.evaluate(connectionWithNoJumpWithChange))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(JumpRuleTest,
    "Soprano jump rule test"));

const SecondRelationRuleTest = () => {
    var connection1 = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T", 6)),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D"))
    );
    var connection2 = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"))
    );
    var rule = new RulesChecker.SecondRelationRule();
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(connection1)) &&
        UnitTest.assertEqualsPrimitives(1, rule.evaluate(connection2))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(SecondRelationRuleTest,
    "Second relation test"));

const ChangeFunctionOnDownBeatRuleTest = () => {
    var connection1 = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T"), Consts.MEASURE_PLACE.UPBEAT),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D"))
    );
    var connection2 = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("T"), Consts.MEASURE_PLACE.DOWNBEAT),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S"))
    );
    var rule = new RulesChecker.ChangeFunctionOnDownBeatRule();
    return UnitTest.assertEqualsPrimitives(10, rule.evaluate(connection1)) &&
        UnitTest.assertEqualsPrimitives(0, rule.evaluate(connection2))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(ChangeFunctionOnDownBeatRuleTest,
    "Change function on downbeat rule test"));

const SecondaryDominantConnectionRuleTest = () => {
    var connection1 = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("S")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,"F"))
    );
    var connection2 = new RulesCheckerUtils.Connection(
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D")),
        new RulesChecker.HarmonicFunctionWithSopranoInfo(new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,"F"))
    );
    var rule = new RulesChecker.SecondaryDominantConnectionRule("C");
    return UnitTest.assertEqualsPrimitives(0, rule.evaluate(connection1)) &&
        UnitTest.assertTrue(rulesChecker.evaluateHardRules(connection1)) &&
        UnitTest.assertEqualsPrimitives(-1, rule.evaluate(connection2)) &&
        UnitTest.assertFalse(rulesChecker.evaluateHardRules(connection2))
};

rulesCheckerTestSuite.addTest(new UnitTest.UnitTest(SecondaryDominantConnectionRuleTest,
    "Secondary dominant connection rule test"));

rulesCheckerTestSuite.run();