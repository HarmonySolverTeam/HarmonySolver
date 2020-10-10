const UnitTest = require("./TestUtils");
const Exercise = require("./objects/Exercise");
const HarmonicFunction = require("./objects/HarmonicFunction");
const ExerciseCorrector = require("./objects/ExerciseCorrector");
const Solver = require("./objects/Solver");
var ChordComponentManager = require("./objects/ChordComponentManager");
var Parser = require("./objects/Parser");

const exerciseCorrectorTestSuite = new UnitTest.TestSuite("Exercise corrector suite");

const makeChordsIncompleteToAvoidConcurrent5Test = () => {
    var input = UnitTest.get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\chain_dominants.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    var cm = new ChordComponentManager.ChordComponentManager();
    var fifth = cm.chordComponentFromString("5");

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote.pitch) &&
        UnitTest.assertContains(solution.chords[0].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[1].harmonicFunction.omit,fifth) &&
        UnitTest.assertContains(solution.chords[2].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[3].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[4].harmonicFunction.omit,fifth) &&
        UnitTest.assertContains(solution.chords[5].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[6].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[7].harmonicFunction.omit,fifth) &&
        UnitTest.assertContains(solution.chords[8].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[9].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[11].harmonicFunction.omit,fifth) &&
        UnitTest.assertContains(solution.chords[12].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[13].harmonicFunction.omit,fifth) &&
        UnitTest.assertContains(solution.chords[14].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[15].harmonicFunction.omit,fifth) &&
        UnitTest.assertContains(solution.chords[17].harmonicFunction.omit,fifth) &&
        !UnitTest.assertContains(solution.chords[18].harmonicFunction.omit,fifth)
    //10 & 16 have given 5 in omit
};

exerciseCorrectorTestSuite.addTest(new UnitTest.UnitTest(makeChordsIncompleteToAvoidConcurrent5Test, "Make chords incomplete to avoid concurrent 5s"));

const handleDominantConnectionsWith7InBass = () => {
    var hfdmajor = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,"7", undefined, undefined, undefined, undefined, undefined, undefined, "A");
    var hfdminor = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,"7", undefined, undefined, undefined, undefined, undefined, undefined, "a");
    var hfdiii = new HarmonicFunction.HarmonicFunction("D",3,undefined,"7", undefined, undefined, undefined, undefined, undefined, undefined, "A");
    var hfd = new HarmonicFunction.HarmonicFunction("D",undefined,undefined,undefined, undefined, undefined, undefined, undefined, undefined, undefined, "A");

    var hft = new HarmonicFunction.HarmonicFunction("T",undefined,undefined,undefined, undefined, undefined, undefined, undefined, undefined, undefined, "A");
    var hfs = new HarmonicFunction.HarmonicFunction("S",undefined,undefined,undefined, undefined, undefined, undefined, undefined, undefined, undefined, "A");

    var hf1 = new HarmonicFunction.HarmonicFunction("T",undefined,undefined,undefined, undefined, undefined, undefined, undefined, undefined, undefined, "A");
    var hf2 = new HarmonicFunction.HarmonicFunction("T",6,undefined,undefined, undefined, undefined, undefined, undefined, undefined, undefined, "A");
    var hf3 = new HarmonicFunction.HarmonicFunction("T",undefined,undefined,undefined, undefined, undefined, undefined, undefined, undefined, undefined, "a");

    var exerciseCorrector = new ExerciseCorrector.ExerciseCorrector();
    exerciseCorrector._handleDominantConnectionsWith7InBass(hfdmajor, hf1);
    exerciseCorrector._handleDominantConnectionsWith7InBass(hfdminor, hf3);
    exerciseCorrector._handleDominantConnectionsWith7InBass(hfdiii, hf2);
    exerciseCorrector._handleDominantConnectionsWith7InBass(hfd, hft);
    exerciseCorrector._handleDominantConnectionsWith7InBass(hfd, hfs);


    return UnitTest.assertEqualsPrimitives("3", hf1.revolution.chordComponentString) &&
        UnitTest.assertEqualsPrimitives("3>", hf2.revolution.chordComponentString) &&
        UnitTest.assertEqualsPrimitives("3>", hf3.revolution.chordComponentString) &&
        UnitTest.assertEqualsPrimitives("1", hft.revolution.chordComponentString) &&
        UnitTest.assertEqualsPrimitives("1", hfs.revolution.chordComponentString);
};

exerciseCorrectorTestSuite.addTest(new UnitTest.UnitTest(handleDominantConnectionsWith7InBass, "Handle dominant connections with 7 as revolution"));

exerciseCorrectorTestSuite.run();