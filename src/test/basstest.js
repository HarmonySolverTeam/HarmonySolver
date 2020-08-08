var fb = require("./objects/FiguredBass");
var bt = require("./objects/BassTranslator");
var TestUtils = require("./TestUtils");

var testSuite = new TestUtils.TestSuite("BassTranslator and FiguredBass tests");

var completeFiguredBassNumbersTest = (symbols, expectedCompletedSymbols) => {
    var figuredBassElement = new fb.FiguredBassElement(undefined, symbols);
    bt.completeFiguredBassNumbers(figuredBassElement);

    var actualCompletedSymbols = figuredBassElement.symbols.sort();
    expectedCompletedSymbols = expectedCompletedSymbols.sort();

    return TestUtils.assertEqualsObjects(expectedCompletedSymbols, actualCompletedSymbols);
};

testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([],              ["5", "3"]),           "Complete figured bass numbers with no symbol \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest(["5"],           ["5", "3"]),           "Complete figured bass numbers with 5  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest(["6"],           ["6", "3"]),           "Complete figured bass numbers with 6  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest(["10", "2"],     ["10", "4", "2"]),     "Complete figured bass numbers with 10 2 \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest(["2"],           ["6", "4", "2"]),      "Complete figured bass numbers with 2  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest(["4","3"],       ["6", "4", "3"]),      "Complete figured bass numbers with 4 3 \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest(["7"],           ["7", "5", "3"]),      "Complete figured bass numbers with 7  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest(["6", "5"],      ["6", "5", "3"]),      "Complete figured bass numbers with 6 5 \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest(["7", "5", "6"], ["7", "5", "6"]),      "Complete figured bass numbers with 7 5 6 \tat input"));

var makeChoiceAndSplitTest = () => {

    var ton = {functionName : "T"};
    var sub = {functionName : "S"};
    var dom = {functionName : "D"};

    var functions = [[ton,sub],[sub],[ton, sub],[dom],[ton,sub],[sub],[ton, dom],[sub],[ton, dom],[sub],[ton,dom]];
    var actual = bt.makeChoiceAndSplit(functions);

    if (! TestUtils.assertEqualsPrimitives(actual.length, 1)) return false;
    if (! TestUtils.assertEqualsPrimitives(actual[0].length, functions.length))  return false;

    var res0 = actual[0];
    for(var i=0; i<res0.length - 1; i++){
        if ( TestUtils.assertEqualsObjects([res0[i].functionName, res0[i+1].functionName], ["D", "S"]) )return false;
    }
    return true;
};
testSuite.addTest(new TestUtils.UnitTest(makeChoiceAndSplitTest, "MakeChoiceAndSplit function test"));

testSuite.run();