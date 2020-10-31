var HarmonicFunction = require("./objects/model/HarmonicFunction");
var Note = require("./objects/model/Note");
var Soprano = require("./objects/soprano/Soprano");
var SopranoSolver = require("./objects/soprano/SopranoSolver")
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

    var sEx = new SopranoEx.SopranoExercise("major", "C", [3, 4], notes, undefined, undefined, [t, s, d]);

    var sopranoSolver = new Soprano.SopranoSolver(sEx);

    var solution = sopranoSolver.solve();

    return TestUtils.assertEqualsPrimitives(solution.chords.length, 4)
        && TestUtils.assertDefined(solution.chords[0].sopranoNote.pitch);
};

testSuite.addTest(new TestUtils.UnitTest(sopranoUnitTest, "Simple soprano exercise - expected solution with cadention T S D T"));

var targosz_p59_ex1 = () => {
    var t = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1", [], [], [], false, undefined);
    var s = new HarmonicFunction.HarmonicFunction("S", 4, undefined, "1", [], [], [], false, undefined);
    var d = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [], [], [], false, undefined);

    var notes = [new Note.Note(74, 1, 0, [1, 2]),
                 new Note.Note(69, 5, 0, [1, 4]),
                 new Note.Note(71, 6, 0, [1, 4]),
                 new Note.Note(69, 5, 0, [1, 4]),
                 new Note.Note(64, 2, 0, [1, 4]),
                 new Note.Note(66, 3, 0, [1, 4]),
                 new Note.Note(69, 5, 0, [1, 4]),
                 new Note.Note(71, 6, 0, [1, 4]),
                 new Note.Note(67, 4, 0, [1, 4]),
                 new Note.Note(71, 6, 0, [1, 4]),
                 new Note.Note(74, 1, 0, [1, 4]),
                 new Note.Note(73, 0, 0, [1, 2]),
                 new Note.Note(76, 2, 0, [1, 2]),
                 new Note.Note(78, 3, 0, [1, 2]),
                 new Note.Note(74, 1, 0, [1, 4]),
                 new Note.Note(73, 0, 0, [1, 4]),
                 new Note.Note(74, 1, 0, [1, 2]),
                 new Note.Note(74, 1, 0, [1, 4]),
                 new Note.Note(79, 4, 0, [1, 4]),
                 new Note.Note(76, 2, 0, [1, 4]),
                 new Note.Note(81, 5, 0, [1, 4]),
                 new Note.Note(76, 2, 0, [1, 4]),
                 new Note.Note(73, 0, 0, [1, 4]),
                 new Note.Note(74, 1, 0, [1, 1])]

    var sEx = new SopranoEx.SopranoExercise("major", "D", [4, 4], notes, undefined, undefined, [t, s, d]);

    var sopranoSolver = new SopranoSolver.SopranoSolver(sEx);

    var solution = sopranoSolver.solve();

    return false

}
// testSuite.addTest(new TestUtils.UnitTest(targosz_p59_ex1, "Targosz p.59 ex.1"));

var targosz_p59_ex1_in_C = () => {
    var t = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1", [], [], [], false, undefined);
    var s = new HarmonicFunction.HarmonicFunction("S", 4, undefined, "1", [], [], [], false, undefined);
    var d = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [], [], [], false, undefined);

    var notes = [
        new Note.Note(72, 0, 0, [1, 2]),
        new Note.Note(67, 4, 0, [1, 4]),
        new Note.Note(69, 5, 0, [1, 4]),
        new Note.Note(67, 4, 0, [1, 4]),
        new Note.Note(62, 1, 0, [1, 4]),
        new Note.Note(64, 2, 0, [1, 4]),
        new Note.Note(67, 4, 0, [1, 4]),
        new Note.Note(69, 5, 0, [1, 4]),
        new Note.Note(65, 3, 0, [1, 4]),
        new Note.Note(69, 5, 0, [1, 4]),
        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(69, 5, 0, [1, 2]),
        new Note.Note(74, 1, 0, [1, 2]),
        new Note.Note(76, 2, 0, [1, 2]),
        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(71, 6, 0, [1, 4]),
        new Note.Note(72, 0, 0, [1, 2]),
        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(77, 3, 0, [1, 4]),
        new Note.Note(74, 1, 0, [1, 4]),
        new Note.Note(79, 4, 0, [1, 4]),
        new Note.Note(74, 1, 0, [1, 4]),
        new Note.Note(71, 6, 0, [1, 4]),
        new Note.Note(72, 0, 0, [1, 1])
    ]

    var measures = [
        new Note.Measure([
            new Note.Note(72, 0, 0, [1, 2]),
            new Note.Note(67, 4, 0, [1, 4]),
            new Note.Note(69, 5, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(67, 4, 0, [1, 4]),
            new Note.Note(62, 1, 0, [1, 4]),
            new Note.Note(64, 2, 0, [1, 4]),
            new Note.Note(67, 4, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(65, 3, 0, [1, 4]),
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(72, 0, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(69, 5, 0, [1, 2]),
            new Note.Note(74, 1, 0, [1, 2])]
        ),
        new Note.Measure([
            new Note.Note(76, 2, 0, [1, 2]),
            new Note.Note(72, 0, 0, [1, 4]),
            new Note.Note(71, 6, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(72, 0, 0, [1, 2]),
            new Note.Note(72, 0, 0, [1, 4]),
            new Note.Note(77, 3, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(74, 1, 0, [1, 4]),
            new Note.Note(79, 4, 0, [1, 4]),
            new Note.Note(74, 1, 0, [1, 4]),
            new Note.Note(71, 6, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(72, 0, 0, [1, 1])]
        )
    ]
    var sEx = new SopranoEx.SopranoExercise("major", "C", [4, 4], notes, undefined, measures, [t, s, d]);

    var sopranoSolver = new SopranoSolver.SopranoSolver(sEx);

    var solution = sopranoSolver.solve();

    return TestUtils.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote.pitch)

}
// testSuite.addTest(new TestUtils.UnitTest(targosz_p59_ex1_in_C, "Targosz p.59 ex.1 in C major"));

const targosz_p60_e4 = () => {
    var t = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1", [], [], [], false, undefined);
    var s = new HarmonicFunction.HarmonicFunction("S", 4, undefined, "1", [], [], [], false, undefined);
    var d = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [], [], [], false, undefined);

    var notes = [
        new Note.Note(67, 4, 0, [1, 4]),
        new Note.Note(70, 6, 0, [1, 4]),
        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(70, 6, 0, [1, 2]),
        new Note.Note(65, 3, 0, [1, 4]),
        new Note.Note(67, 4, 0, [1, 4]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(74, 1, 0, [1, 4]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(79, 4, 0, [1, 4]),
        new Note.Note(70, 6, 0, [1, 4]),
        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(70, 6, 0, [1, 4]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(67, 4, 0, [1, 4]),
        new Note.Note(68, 5, 0, [1, 4]),
        new Note.Note(65, 3, 0, [1, 4]),
        new Note.Note(62, 1, 0, [1, 4]),
        new Note.Note(63, 2, 0, [3, 4])
        ]

    var measures = [
        new Note.Measure([
            new Note.Note(67, 4, 0, [1, 4]),
            new Note.Note(70, 6, 0, [1, 4]),
            new Note.Note(72, 0, 0, [1, 4])
            ]
        ),
        new Note.Measure([
            new Note.Note(70, 6, 0, [1, 2]),
            new Note.Note(65, 3, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(67, 4, 0, [1, 4]),
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(74, 1, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(79, 4, 0, [1, 4]),
            new Note.Note(70, 6, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(72, 0, 0, [1, 4]),
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(72, 0, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(70, 6, 0, [1, 4]),
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(67, 4, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(68, 5, 0, [1, 4]),
            new Note.Note(65, 3, 0, [1, 4]),
            new Note.Note(62, 1, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(63, 2, 0, [3, 4])]
        )
    ]
    var sEx = new SopranoEx.SopranoExercise("major", "Eb", [3, 4], notes, undefined, measures, [t, s, d]);

    var sopranoSolver = new SopranoSolver.SopranoSolver(sEx);

    var solution = sopranoSolver.solve();

    return TestUtils.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote.pitch)
}
// testSuite.addTest(new TestUtils.UnitTest(targosz_p60_e4, "Targosz p.60 ex.4"));

const targosz_p60_e5 = () => {
    var t = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1", [], [], [], false, undefined);
    var s = new HarmonicFunction.HarmonicFunction("S", 4, undefined, "1", [], [], [], false, undefined);
    var d = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [], [], [], false, undefined);

    var notes = [
        new Note.Note(68, 5, 0, [1, 2]),
        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(70, 6, 0, [1, 4]),

        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(77, 3, 0, [1, 4]),
        new Note.Note(73, 1, 0, [1, 4]),

        new Note.Note(70, 6, 0, [1, 2]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(70, 6, 0, [1, 4]),

        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(80, 5, 0, [1, 4]),
        new Note.Note(79, 4, 0, [1, 4]),

        new Note.Note(80, 5, 0, [1, 4]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(77, 3, 0, [1, 4]),
        new Note.Note(73, 1, 0, [1, 4]),

        new Note.Note(70, 6, 0, [1, 2]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(67, 4, 0, [1, 4]),

        new Note.Note(68, 5, 0, [1, 1]),

        new Note.Note(68, 5, 0, [1, 1])
    ]

    var measures = [
        new Note.Measure([
            new Note.Note(68, 5, 0, [1, 2]),
            new Note.Note(72, 0, 0, [1, 4]),
            new Note.Note(70, 6, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(72, 0, 0, [1, 4]),
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(77, 3, 0, [1, 4]),
            new Note.Note(73, 1, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(70, 6, 0, [1, 2]),
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(70, 6, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(72, 0, 0, [1, 4]),
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(80, 5, 0, [1, 4]),
            new Note.Note(79, 4, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(80, 5, 0, [1, 4]),
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(77, 3, 0, [1, 4]),
            new Note.Note(73, 1, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(70, 6, 0, [1, 2]),
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(67, 4, 0, [1, 4])]
        ),
        new Note.Measure([
            new Note.Note(68, 5, 0, [1, 1])]
        ),
        new Note.Measure([
            new Note.Note(68, 5, 0, [1, 1])]
        )
    ]
    var sEx = new SopranoEx.SopranoExercise("major", "Ab", [4, 4], notes, undefined, measures, [t, s, d]);

    var sopranoSolver = new SopranoSolver.SopranoSolver(sEx);

    var solution = sopranoSolver.solve();

    return TestUtils.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote.pitch)
}
testSuite.addTest(new TestUtils.UnitTest(targosz_p60_e5, "Targosz p.60 ex.5"));

testSuite.run();