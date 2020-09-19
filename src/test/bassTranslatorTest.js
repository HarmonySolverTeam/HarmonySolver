var Utils = require("./objects/Utils")
const UnitTest = require("./TestUtils");
var BassTranslator = require("./objects/BassTranslator")
var TestUtils = require("./TestUtils");
var FiguredBass = require("./objects/FiguredBass")
var Note = require("./objects/Note")

var testSuite = new TestUtils.TestSuite("BassTranslator and FiguredBass tests");

var bassTranslator = new BassTranslator.BassTranslator()

//TODO CHANGE THIS!!!!
const handleAlterationsTest1 = () => {

    var harmonicFunctions = JSON.parse('[[{"functionName":"T","degree":1,"revolution":"1","extra":[],"omit":[],"down":false},{"functionName":"D","degree":5,"revolution":"1","extra":[],"omit":[],"down":false},{"functionName":"T","degree":1,"revolution":"5","extra":[],"omit":[],"down":false},{"functionName":"S","degree":4,"revolution":"3","extra":[],"omit":[],"down":false},{"functionName":"T","degree":1,"revolution":"1","extra":[],"omit":[],"down":false}]]')
    var chordElements = JSON.parse('[{"notesNumbers":[0,2,4],"omit":[],"bassElement":{"bassNote":{"pitch":48,"baseNote":0,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":0},{"notesNumbers":[4,6,8],"omit":[],"bassElement":{"bassNote":{"pitch":43,"baseNote":4,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":4},{"notesNumbers":[4,9,7],"omit":[],"bassElement":{"bassNote":{"pitch":43,"baseNote":4,"chordComponent":5},"symbols":[{"component":6,"alteration":"b"},{"component":4}]},"primeNote":0},{"notesNumbers":[5,10,7],"omit":[],"bassElement":{"bassNote":{"pitch":45,"baseNote":5,"chordComponent":3},"symbols":[{"component":6},{"component":3}]},"primeNote":3},{"notesNumbers":[0,2,4],"omit":[],"bassElement":{"bassNote":{"pitch":48,"baseNote":0,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":0}]')
    var mode = "major"
    var meter = [4, 4]
    var durations = [[1, 2], [1, 2], [1, 2], [1, 4], [1, 4]]

    bassTranslator.handleAlterations(harmonicFunctions, chordElements, mode, meter, durations)

    console.log(JSON.stringify(harmonicFunctions))

    return TestUtils.assertEqualsPrimitives(0, 0)
}

testSuite.addTest(new TestUtils.UnitTest(handleAlterationsTest1, "handleAlterationsTest1"))



var completeFiguredBassNumbersTest = (symbols, expectedCompletedSymbols) => {
    var actualCompletedSymbols = bassTranslator.completeFiguredBassNumbers(symbols).sort();
    expectedCompletedSymbols = expectedCompletedSymbols.sort();

    return TestUtils.assertEqualsObjects(expectedCompletedSymbols, actualCompletedSymbols);
};

testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([],              [3, 5]),           "Complete figured bass numbers with no symbol \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([5],           [5, 3]),           "Complete figured bass numbers with 5  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([6],           [6, 3]),           "Complete figured bass numbers with 6  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([10, 2],     [10, 4, 2]),     "Complete figured bass numbers with 10 2 \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([2],           [6, 4, 2]),      "Complete figured bass numbers with 2  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([4,3],       [6, 4, 3]),      "Complete figured bass numbers with 4 3 \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([7],           [7, 5, 3]),      "Complete figured bass numbers with 7  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([6, 5],      [3, 5, 6]),      "Complete figured bass numbers with 6 5 \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([7, 5, 6], [7, 5, 6]),      "Complete figured bass numbers with 7 5 6 \tat input"));

var makeChoiceAndSplitTest = () => {

    var ton = {functionName : "T"};
    var sub = {functionName : "S"};
    var dom = {functionName : "D"};

    var functions = [[ton,sub],[sub],[ton, sub],[dom],[ton,sub],[sub],[ton, dom],[sub],[ton, dom],[sub],[ton,dom]];
    var actual = bassTranslator.makeChoiceAndSplit(functions);

    if (! TestUtils.assertEqualsPrimitives(actual.length, 1)) return false;
    if (! TestUtils.assertEqualsPrimitives(actual[0].length, functions.length))  return false;

    console.log(JSON.stringify(2))

    var res0 = actual[0];
    for(var i=0; i<res0.length - 1; i++){
        if ( TestUtils.assertEqualsObjects([res0[i].functionName, res0[i+1].functionName], ["D", "S"], true) ) return false;
    }
    return true;
};
testSuite.addTest(new TestUtils.UnitTest(() => makeChoiceAndSplitTest(), "MakeChoiceAndSplit function test"));

var completeFiguredBassSymbolTest = () => {

    var symbols = []
    symbols.push(new FiguredBass.BassSymbol(3,undefined))

    var three = new FiguredBass.BassSymbol(3,undefined)
    var five = new FiguredBass.BassSymbol(5,undefined)

    var bassElement = new FiguredBass.FiguredBassElement(new Note.Note(0,0,0), symbols)

    bassTranslator.completeFiguredBassSymbol(bassElement)

    return TestUtils.assertEqualsPrimitives(bassElement.symbols.length, 2)
    && TestUtils.assertEqualsObjects(three, bassElement.symbols[0])
    && TestUtils.assertEqualsObjects(five, bassElement.symbols[1])
}

testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassSymbolTest(), "completeFiguredBassSymbol function test"));

var hasTwoNextThirdsTest = (notesNumbers, expectedResult) => {
    var chordElement = new BassTranslator.ChordElement(notesNumbers)
    return TestUtils.assertEqualsPrimitives(bassTranslator.hasTwoNextThirds(chordElement), expectedResult)
}

testSuite.addTest(new TestUtils.UnitTest(() => hasTwoNextThirdsTest([], false), "HasTwoNextThirds with no notes"));
testSuite.addTest(new TestUtils.UnitTest(() => hasTwoNextThirdsTest([3], false), "HasTwoNextThirds with one note"));
testSuite.addTest(new TestUtils.UnitTest(() => hasTwoNextThirdsTest([1, 2], false), "HasTwoNextThirds with two notes"));
testSuite.addTest(new TestUtils.UnitTest(() => hasTwoNextThirdsTest([0, 1, 2], false), "HasTwoNextThirds with 0 1 2"));
testSuite.addTest(new TestUtils.UnitTest(() => hasTwoNextThirdsTest([0, 2, 3], false), "HasTwoNextThirds with 0 2 3"));
testSuite.addTest(new TestUtils.UnitTest(() => hasTwoNextThirdsTest([0, 2, 4], true), "HasTwoNextThirds with normal next thirds"));
testSuite.addTest(new TestUtils.UnitTest(() => hasTwoNextThirdsTest([1, 3, 6], true), "HasTwoNextThirds with thirds with modulo"));




testSuite.run()
