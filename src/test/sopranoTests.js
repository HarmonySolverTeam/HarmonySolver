var HarmonicFunction = require("./objects/model/HarmonicFunction");
var Note = require("./objects/model/Note");
var Soprano = require("./objects/soprano/Soprano");
var SopranoSolver = require("./objects/soprano/SopranoSolver")
var SopranoExercise = require("./objects/soprano/SopranoExercise");
var TestUtils = require("./TestUtils");

var testSuite  = new TestUtils.TestSuite("Soprano exercise tests");

var t = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1", [], [], [], false, undefined);
var s = new HarmonicFunction.HarmonicFunction("S", 4, undefined, "1", [], [], [], false, undefined);
var d = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [], [], [], false, undefined);

var sopranoBaseTest = (mode, key, meter, notes, harmonicFunctions) => {
    var measures = [];
    var counter = 0;
    var current_measure = [];
    for(var i=0; i<notes.length; i++){
        counter += notes[i].duration[0] / notes[i].duration[1];
        current_measure.push(notes[i]);
        if(counter === meter[0]/meter[1]){
            measures.push(new Note.Measure(current_measure));
            current_measure = [];
            counter = 0;
        }
    }

    var sopranoExercise = new SopranoExercise.SopranoExercise(mode, key, meter, notes, undefined, measures, harmonicFunctions);
    var sopranoSolver = new SopranoSolver.SopranoSolver(sopranoExercise);
    var solution = sopranoSolver.solve();

    return TestUtils.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote.pitch);
}
// testSuite.addTest(new TestUtils.UnitTest(
//     () => sopranoBaseTest(
//         "",
//         "",
//         [<>],
//         [
//             <>
//         ],
//         [t,s,d]
//     ), "<>"));

testSuite.addTest(new TestUtils.UnitTest(
    () => sopranoBaseTest(
        "major",
        "D",
        [4,4],
        [
            new Note.Note(74, 1, 0, [1, 2]),
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
            new Note.Note(74, 1, 0, [1, 1])

],
        [t,s,d]
    ), "Targosz p.59 ex.1"));

testSuite.addTest(new TestUtils.UnitTest(
    () => sopranoBaseTest(
        "major",
        "A",
        [4,4],
        [
            new Note.Note(73, 0, 0, [1, 4]),
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(68, 4, 0, [1, 4]),
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(66, 3, 0, [1, 4]),
            new Note.Note(64, 2, 0, [1, 4]),
            new Note.Note(68, 4, 0, [1, 4]),
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(73, 0, 0, [1, 4]),
            new Note.Note(74, 1, 0, [1, 4]),
            new Note.Note(73, 0, 0, [1, 4]),
            new Note.Note(71, 6, 0, [3, 4]),
            new Note.Note(76, 2, 0, [1, 4]),
            new Note.Note(76, 2, 0, [1, 4]),
            new Note.Note(73, 0, 0, [1, 4]),
            new Note.Note(71, 6, 0, [1, 4]),
            new Note.Note(73, 0, 0, [1, 4]),
            new Note.Note(74, 1, 0, [1, 4]),
            new Note.Note(78, 3, 0, [1, 4]),
            new Note.Note(76, 2, 0, [1, 4]),
            new Note.Note(80, 4, 0, [1, 4]),
            new Note.Note(81, 5, 0, [1, 4]),
            new Note.Note(73, 0, 0, [1, 4]),
            new Note.Note(74, 1, 0, [1, 4]),
            new Note.Note(71, 6, 0, [1, 4]),
            new Note.Note(73, 0, 0, [1, 2]),
            new Note.Note(69, 5, 0, [1, 2])
        ],
        [t,s,d]
    ), "Targosz p.59 ex.2"));

testSuite.addTest(new TestUtils.UnitTest(
    () => sopranoBaseTest(
        "major",
        "Bb",
        [4,4],
        [
            new Note.Note(74, 1, 0, [1, 2]),
            new Note.Note(70, 6, 0, [1, 2]),
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(72, 0, 0, [1, 4]),
            new Note.Note(65, 3, 0, [1, 4]),
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(70, 6, 0, [1, 4]),
            new Note.Note(74, 1, 0, [1, 4]),
            new Note.Note(70, 6, 0, [1, 4]),
            new Note.Note(77, 3, 0, [1, 4]),
            new Note.Note(79, 4, 0, [1, 2]),
            new Note.Note(75, 2, 0, [1, 2]),
            new Note.Note(72, 0, 0, [1, 2]),
            new Note.Note(77, 3, 0, [1, 4]),
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(70, 6, 0, [1, 4]),
            new Note.Note(74, 1, 0, [1, 4]),
            new Note.Note(75, 2, 0, [1, 4]),
            new Note.Note(67, 4, 0, [1, 4]),
            new Note.Note(65, 3, 0, [1, 4]),
            new Note.Note(74, 1, 0, [1, 4]),
            new Note.Note(72, 0, 0, [1, 4]),
            new Note.Note(69, 5, 0, [1, 4]),
            new Note.Note(70, 6, 0, [1, 1])
        ],
        [t,s,d]
    ), "Targosz p.59 ex.3"));

testSuite.addTest(new TestUtils.UnitTest(
    () => sopranoBaseTest(
        "major",
        "Eb",
        [3,4],
        [
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
        ],
        [t,s,d]
    ), "Targosz p.60 ex.4"));

testSuite.addTest(new TestUtils.UnitTest(
    () => sopranoBaseTest(
        "major",
        "Ab",
        [4,4],
        [
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
        ],
        [t,s,d]
    ), "Targosz p.60 ex.5"));

testSuite.addTest(new TestUtils.UnitTest(
    () => sopranoBaseTest(
        "major",
        "Gb",
        [3,4],
        [
            new Note.Note(70, 6, 0, [3, 8]),
            new Note.Note(73, 1, 0, [1, 8]),
            new Note.Note(70, 6, 0, [1, 4]),
            new Note.Note(68, 5, 0, [3, 8]),
            new Note.Note(73, 1, 0, [1, 8]),
            new Note.Note(68, 5, 0, [1, 4]),
            new Note.Note(70, 6, 0, [1, 4]),
            new Note.Note(78, 4, 0, [1, 4]),
            new Note.Note(73, 1, 0, [1, 4]),
            new Note.Note(75, 2, 0, [1, 2]),
            new Note.Note(71, 0, 0, [1, 4]),
            new Note.Note(68, 5, 0, [3, 8]),
            new Note.Note(73, 1, 0, [1, 8]),
            new Note.Note(68, 5, 0, [1, 4]),
            new Note.Note(70, 6, 0, [3, 8]),
            new Note.Note(73, 1, 0, [1, 8]),
            new Note.Note(66, 4, 0, [1, 4]),
            new Note.Note(66, 4, 0, [3, 8]),
            new Note.Note(71, 0, 0, [1, 8]),
            new Note.Note(68, 5, 0, [1, 4]),
            new Note.Note(70, 6, 0, [3, 4])
        ],
        [t,s,d]
    ), "Targosz p.60 ex.6"));

testSuite.run();