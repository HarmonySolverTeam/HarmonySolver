var Utils = require("./objects/utils/Utils")
const UnitTest = require("./TestUtils");
var BassTranslator = require("./objects/bass/BassTranslator")
var TestUtils = require("./TestUtils");
var FiguredBass = require("./objects/bass/FiguredBass")
var Note = require("./objects/model/Note")
var Solver = require("./objects/harmonic/Solver2");

var testSuite = new TestUtils.TestSuite("BassTranslator and FiguredBass tests");

var bassTranslator = new BassTranslator.BassTranslator()

var check_solution_found = (exName) => {
    try{
        var ex = UnitTest.get_ex_from_file("\\examples\\2_Bass\\read_exercises\\" + exName);
        var ex1 = JSON.parse(ex)
        var bassTranslator = new BassTranslator.BassTranslator()
        var exerciseAndBassLine = bassTranslator.createExerciseFromFiguredBass(ex1)
        var solver = new Solver.Solver(exerciseAndBassLine[0], exerciseAndBassLine[1]);
        var solution = solver.solve();

        return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote.pitch);
    } catch (e) {
        console.error(JSON.stringify(e))
        console.error(e)
        return false;
    }
}

const handleAlterationsTest1 = () => {

    var harmonicFunctions = JSON.parse('[[{"functionName":"T","degree":1,"inversion":"1","extra":[],"omit":[],"down":false},{"functionName":"D","degree":5,"inversion":"1","extra":[],"omit":[],"down":false},{"functionName":"T","degree":1,"inversion":"5","extra":[],"omit":[],"down":false},{"functionName":"S","degree":4,"inversion":"3","extra":[],"omit":[],"down":false},{"functionName":"T","degree":1,"inversion":"1","extra":[],"omit":[],"down":false}]]')
    var chordElements = JSON.parse('[{"notesNumbers":[0,2,4],"omit":[],"bassElement":{"bassNote":{"pitch":48,"baseNote":0,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":0},{"notesNumbers":[4,6,8],"omit":[],"bassElement":{"bassNote":{"pitch":43,"baseNote":4,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":4},{"notesNumbers":[4,9,7],"omit":[],"bassElement":{"bassNote":{"pitch":43,"baseNote":4,"chordComponent":5},"symbols":[{"component":6,"alteration":"b"},{"component":4}]},"primeNote":0},{"notesNumbers":[5,10,7],"omit":[],"bassElement":{"bassNote":{"pitch":45,"baseNote":5,"chordComponent":3},"symbols":[{"component":6},{"component":3}]},"primeNote":3},{"notesNumbers":[0,2,4],"omit":[],"bassElement":{"bassNote":{"pitch":48,"baseNote":0,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":0}]')
    var mode = "major"
    var meter = [4, 4]
    var durations = [[1, 2], [1, 2], [1, 2], [1, 4], [1, 4]]

    bassTranslator.handleAlterations(harmonicFunctions, chordElements, mode, meter, durations)

    return TestUtils.assertEqualsPrimitives(harmonicFunctions[0][2].mode, "minor")
}

//testSuite.addTest(new TestUtils.UnitTest(handleAlterationsTest1, "handleAlterationsTest1"))


var completeFiguredBassNumbersTest = (symbols, expectedCompletedSymbols) => {
    var actualCompletedSymbols = bassTranslator.completeFiguredBassNumbers(symbols).sort();
    expectedCompletedSymbols = expectedCompletedSymbols.sort();

    return TestUtils.assertEqualsObjects(expectedCompletedSymbols, actualCompletedSymbols);
};

testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([], [3, 5]), "Complete figured bass numbers with no symbol \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([5], [5, 3]), "Complete figured bass numbers with 5  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([6], [6, 3]), "Complete figured bass numbers with 6  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([10, 2], [10, 4, 2]), "Complete figured bass numbers with 10 2 \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([2], [6, 4, 2]), "Complete figured bass numbers with 2  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([4, 3], [6, 4, 3]), "Complete figured bass numbers with 4 3 \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([7], [7, 5, 3]), "Complete figured bass numbers with 7  \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([6, 5], [3, 5, 6]), "Complete figured bass numbers with 6 5 \tat input"));
testSuite.addTest(new TestUtils.UnitTest(() => completeFiguredBassNumbersTest([7, 5, 6], [7, 5, 6]), "Complete figured bass numbers with 7 5 6 \tat input"));

var makeChoiceAndSplitTest = () => {

    var ton = {functionName: "T"};
    var sub = {functionName: "S"};
    var dom = {functionName: "D"};

    var functions = [[ton, sub], [sub], [ton, sub], [dom], [ton, sub], [sub], [ton, dom], [sub], [ton, dom], [sub], [ton, dom]];
    var actual = bassTranslator.makeChoiceAndSplit(functions);

    if (!TestUtils.assertEqualsPrimitives(actual.length, 1)) return false;
    if (!TestUtils.assertEqualsPrimitives(actual[0].length, functions.length)) return false;

    var res0 = actual[0];
    for (var i = 0; i < res0.length - 1; i++) {
        if (TestUtils.assertEqualsObjects([res0[i].functionName, res0[i + 1].functionName], ["D", "S"], true)) return false;
    }
    return true;
};
testSuite.addTest(new TestUtils.UnitTest(() => makeChoiceAndSplitTest(), "MakeChoiceAndSplit function test"));

var completeFiguredBassSymbolTest = () => {

    var symbols = []
    symbols.push(new FiguredBass.BassSymbol(3, undefined))

    var three = new FiguredBass.BassSymbol(3, undefined)
    var five = new FiguredBass.BassSymbol(5, undefined)

    var bassElement = new FiguredBass.FiguredBassElement(new Note.Note(0, 0, 0), symbols)

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

var addNextNoteTest = (notesNumbers, expectedNotesNumbers, expectedOmit) => {
    var chordElement = new BassTranslator.ChordElement(notesNumbers, [])
    bassTranslator.addNextNote(chordElement)

    return TestUtils.assertEqualsObjects(expectedNotesNumbers, chordElement.notesNumbers)
        && TestUtils.assertEqualsObjects(expectedOmit, chordElement.omit)
}

testSuite.addTest(new TestUtils.UnitTest(() => addNextNoteTest([0, 2], [0, 2, 4], []), "addNextNoteTest add 4"));
testSuite.addTest(new TestUtils.UnitTest(() => addNextNoteTest([0, 4], [0, 2, 4], []), "addNextNoteTest add between 5"));
testSuite.addTest(new TestUtils.UnitTest(() => addNextNoteTest([0, 5], [0, 2, 5], []), "addNextNoteTest add between >5"));
testSuite.addTest(new TestUtils.UnitTest(() => addNextNoteTest([0, 3], [0, 3, 5], []), "addNextNoteTest add after"));


var completeUntillTwoNextThirdsTest = (notesNumbers, expectedNotesNumbers, expectedOmit) => {
    var chordElement = new BassTranslator.ChordElement(notesNumbers, [])
    bassTranslator.completeUntillTwoNextThirds(chordElement)
    //console.log(chordElement.notesNumbers)
    return TestUtils.assertEqualsObjects(expectedNotesNumbers, chordElement.notesNumbers)
        && TestUtils.assertEqualsObjects(expectedOmit, chordElement.omit)
}

testSuite.addTest(new TestUtils.UnitTest(() => completeUntillTwoNextThirdsTest([0, 2, 4], [0, 2, 4], []), "completeUntillTwoNextThirdsTest nothing to add"));
testSuite.addTest(new TestUtils.UnitTest(() => completeUntillTwoNextThirdsTest([0], [0, 2, 4], []), "completeUntillTwoNextThirdsTest nothing to add"));
testSuite.addTest(new TestUtils.UnitTest(() => completeUntillTwoNextThirdsTest([0, 2, 10], [0, 2, 4, 10], []), "completeUntillTwoNextThirdsTest nothing to add"));

var getValidFunctionsTest = (primeNote, key, expected) => {
    var chordElement = new BassTranslator.ChordElement([], [])
    chordElement.primeNote = primeNote
    return TestUtils.assertEqualsObjects(bassTranslator.getValidFunctions(chordElement, key), expected)
}

testSuite.addTest(new TestUtils.UnitTest(() => getValidFunctionsTest(0,'C', ["T"]), "getValidFunctions C C major"));
testSuite.addTest(new TestUtils.UnitTest(() => getValidFunctionsTest(5,'C', ["T", "S"]), "getValidFunctions A C major"));
testSuite.addTest(new TestUtils.UnitTest(() => getValidFunctionsTest(5,'a', ["T"]), "getValidFunctions A a minor"));
testSuite.addTest(new TestUtils.UnitTest(() => getValidFunctionsTest(6,'Ab', ["S"]), "getValidFunctions H Ab major"));
testSuite.addTest(new TestUtils.UnitTest(() => getValidFunctionsTest(2,'f', ["D"]), "getValidFunctions E f minor"));

var sikorski_42 = () => {return check_solution_found("sikorski_42.txt")};
var sikorski_45 = () => {return check_solution_found("sikorski_45.txt")};
var sikorski_46 = () => {return check_solution_found("sikorski_46.txt")};
var sikorski_58 = () => {return check_solution_found("sikorski_58.txt")};
var sikorski_59 = () => {return check_solution_found("sikorski_59.txt")};
var sikorski_60 = () => {return check_solution_found("sikorski_60.txt")};
var sikorski_72 = () => {return check_solution_found("sikorski_72.txt")};
var sikorski_82 = () => {return check_solution_found("sikorski_82.txt")};
var sikorski_84 = () => {return check_solution_found("sikorski_84.txt")};
var sikorski_94 = () => {return check_solution_found("sikorski_94.txt")};
var sikorski_96 = () => {return check_solution_found("sikorski_96.txt")};
var sikorski_97 = () => {return check_solution_found("sikorski_97.txt")};
var sikorski_106 = () => {return check_solution_found("sikorski_106.txt")};
var sikorski_109 = () => {return check_solution_found("sikorski_109.txt")};
var sikorski_118 = () => {return check_solution_found("sikorski_118.txt")};
var sikorski_119 = () => {return check_solution_found("sikorski_119.txt")};
var sikorski_121 = () => {return check_solution_found("sikorski_121.txt")};
var sikorski_128 = () => {return check_solution_found("sikorski_128.txt")};
var sikorski_129 = () => {return check_solution_found("sikorski_129.txt")};
var sikorski_134 = () => {return check_solution_found("sikorski_134.txt")};
var sikorski_135 = () => {return check_solution_found("sikorski_135.txt")};
var sikorski_140 = () => {return check_solution_found("sikorski_140.txt")};
var sikorski_141 = () => {return check_solution_found("sikorski_141.txt")};
var sikorski_146 = () => {return check_solution_found("sikorski_146.txt")};
var sikorski_147 = () => {return check_solution_found("sikorski_147.txt")};
var sikorski_147a = () => {return check_solution_found("sikorski_147a.txt")};
var sikorski_154 = () => {return check_solution_found("sikorski_154.txt")};
var sikorski_157 = () => {return check_solution_found("sikorski_157.txt")};
var sikorski_164 = () => {return check_solution_found("sikorski_164.txt")};
var sikorski_171 = () => {return check_solution_found("sikorski_171.txt")};
var sikorski_183 = () => {return check_solution_found("sikorski_183.txt")};
var sikorski_188 = () => {return check_solution_found("sikorski_188.txt")};
var sikorski_195 = () => {return check_solution_found("sikorski_195.txt")};
var sikorski_201 = () => {return check_solution_found("sikorski_201.txt")};
var sikorski_210 = () => {return check_solution_found("sikorski_210.txt")};
var sikorski_213 = () => {return check_solution_found("sikorski_213.txt")};

testSuite.addTest(new UnitTest.UnitTest(sikorski_42, "sikorski_42"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_45, "sikorski_45"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_46, "sikorski_46"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_58, "sikorski_58"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_59, "sikorski_59"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_60, "sikorski_60"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_72, "sikorski_72"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_82, "sikorski_82"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_84, "sikorski_84"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_94, "sikorski_94"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_96, "sikorski_96"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_97, "sikorski_97"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_106, "sikorski_106"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_109, "sikorski_109"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_118, "sikorski_118"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_121, "sikorski_121"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_128, "sikorski_128"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_129, "sikorski_129"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_134, "sikorski_134"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_135, "sikorski_135"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_140, "sikorski_140"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_141, "sikorski_141"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_146, "sikorski_146"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_147, "sikorski_147"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_147a, "sikorski_147a"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_154, "sikorski_154"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_157, "sikorski_157"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_164, "sikorski_164"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_171, "sikorski_171"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_183, "sikorski_183"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_188, "sikorski_188"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_195, "sikorski_195"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_201, "sikorski_201"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_210, "sikorski_210"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_213, "sikorski_213"));
testSuite.addTest(new UnitTest.UnitTest(sikorski_119, "sikorski_119"));


testSuite.run()