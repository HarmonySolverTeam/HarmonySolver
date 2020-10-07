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
    return true;
};

exerciseCorrectorTestSuite.addTest(new UnitTest.UnitTest(handleDominantConnectionsWith7InBass, "Handle dominant connections with 7 as revolution"));

exerciseCorrectorTestSuite.run();