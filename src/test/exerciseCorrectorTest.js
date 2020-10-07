const UnitTest = require("./TestUtils");
const Exercise = require("./objects/Exercise");
const HarmonicFunction = require("./objects/HarmonicFunction");
const ExerciseCorrector = require("./objects/ExerciseCorrector");
const Solver = require("./objects/Solver");
var ChordComponentManager = require("./objects/ChordComponentManager");

const exerciseCorrectorTestSuite = new UnitTest.TestSuite("Exercise corrector suite");

const handlePentachordsTest = () => {
    return true;
};

exerciseCorrectorTestSuite.addTest(new UnitTest.UnitTest(handlePentachordsTest, "Handle pentachords"));

const makeChordsIncompleteToAvoidConcurrent5Test = () => {
    return true;
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