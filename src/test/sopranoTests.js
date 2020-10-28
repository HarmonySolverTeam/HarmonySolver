var HarmonicFunction = require("./objects/model/HarmonicFunction");
var Note = require("./objects/model/Note");
var Soprano = require("./objects/soprano/Soprano");
var SopranoEx = require("./objects/soprano/SopranoExercise");
var TestUtils = require("./TestUtils");

var testSuite  = new TestUtils.TestSuite("Soprano exercise tests");

var sopranoUnitTest = () => {
    var t = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1", [], [], [], false, undefined);
    var s = new HarmonicFunction.HarmonicFunction("S", 4, undefined, "1", [], [], [], false, undefined);
    var d = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [], [], [], false, undefined);

    var notes = [
        new Note.Note(60, 0),
        new Note.Note(65, 3),
        new Note.Note(67, 4),
        new Note.Note(72, 0)
    ];

    var sEx = new SopranoEx.SopranoExercise("major", "C", [3, 4], notes, undefined);
    var shEx = new SopranoEx.SopranoHarmonizationExercise(sEx, [], [t, s, d]);

    var sopranoSolver = new Soprano.SopranoSolver(shEx);

    var solution = sopranoSolver.solve();

    return TestUtils.assertEqualsPrimitives(solution.chords.length, 4)
        && TestUtils.assertDefined(solution.chords[0].sopranoNote.pitch);
};

testSuite.addTest(new TestUtils.UnitTest(sopranoUnitTest, "Simple soprano exercise - expected solution with cadention T S D T"));

testSuite.run();