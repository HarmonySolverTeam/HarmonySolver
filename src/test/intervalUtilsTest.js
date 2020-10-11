const TestUtils = require("./TestUtils");
const IntervalUtils = require("./objects/IntervalUtils");
const Note = require("./objects/Note");

const intervalUtilsTestSuite = new TestUtils.TestSuite("Interval Utils tests");

const isOctaveOrPrimeTest = () => {
    const note1 = new Note.Note(60, 0);
    const note2 = new Note.Note(72, 0);
    const note3 = new Note.Note(72, 1);
    const note4 = new Note.Note(60, 6);
    const note5 = new Note.Note(61, 0);
    return TestUtils.assertTrue(IntervalUtils.isOctaveOrPrime(note1, note2)) &&
        TestUtils.assertTrue(IntervalUtils.isOctaveOrPrime(note1, note1)) &&
        TestUtils.assertFalse(IntervalUtils.isOctaveOrPrime(note1, note3)) &&
        TestUtils.assertFalse(IntervalUtils.isOctaveOrPrime(note1, note4)) &&
        TestUtils.assertTrue(IntervalUtils.isOctaveOrPrime(note1, note5))
};

intervalUtilsTestSuite.addTest(new TestUtils.UnitTest(isOctaveOrPrimeTest, "Is octave or prime test"));

const isFiveTest = () => {
    const note1 = new Note.Note(60, 0);
    const note2 = new Note.Note(67, 4);
    const note3 = new Note.Note(53, 3);
    const note4 = new Note.Note(68, 4);
    const note5 = new Note.Note(66, 4);
    const note6 = new Note.Note(53, 2);
    return TestUtils.assertTrue(IntervalUtils.isFive(note1, note2)) &&
        TestUtils.assertTrue(IntervalUtils.isFive(note1, note3)) &&
        TestUtils.assertTrue(IntervalUtils.isFive(note1, note4)) &&
        TestUtils.assertTrue(IntervalUtils.isFive(note1, note5)) &&
        TestUtils.assertFalse(IntervalUtils.isFive(note1, note6))
};

intervalUtilsTestSuite.addTest(new TestUtils.UnitTest(isFiveTest, "Is five test"));

const isChromaticAlterationTest = () => {
    const note1 = new Note.Note(60, 0);
    const note2 = new Note.Note(61, 0);
    const note3 = new Note.Note(61, 1);
    return TestUtils.assertTrue(IntervalUtils.isChromaticAlteration(note1, note2)) &&
        TestUtils.assertFalse(IntervalUtils.isChromaticAlteration(note1, note3))
};

intervalUtilsTestSuite.addTest(new TestUtils.UnitTest(isChromaticAlterationTest, "Is chromatic alteration test"));

const pitchOffsetBetweenTest = () => {
    const note1 = new Note.Note(60, 0);
    const note2 = new Note.Note(65, 3);
    const note3 = new Note.Note(65, 2);
    const note4 = new Note.Note(55, 4);
    const note5 = new Note.Note(55, 5);
    return TestUtils.assertEqualsPrimitives(IntervalUtils.pitchOffsetBetween(note1, note2),5) &&
        TestUtils.assertEqualsPrimitives(IntervalUtils.pitchOffsetBetween(note1, note3),5) &&
        TestUtils.assertEqualsPrimitives(IntervalUtils.pitchOffsetBetween(note1, note4),5) &&
        TestUtils.assertEqualsPrimitives(IntervalUtils.pitchOffsetBetween(note1, note5),5)
};

intervalUtilsTestSuite.addTest(new TestUtils.UnitTest(pitchOffsetBetweenTest, "Pitch offset test"));

const getBaseDistanceTest = () => {
    return TestUtils.assertEqualsPrimitives(IntervalUtils.getBaseDistance(0,4),4) &&
        TestUtils.assertEqualsPrimitives(IntervalUtils.getBaseDistance(4,0),3) &&
        TestUtils.assertEqualsPrimitives(IntervalUtils.getBaseDistance(0,0),0)
};

intervalUtilsTestSuite.addTest(new TestUtils.UnitTest(getBaseDistanceTest, "Base distance test"));

const alteredIntervalTest = () => {
    const n1 = new Note.Note(72,0);
    //up
    const n1up = new Note.Note(75,1);
    const n2up = new Note.Note(77,2);
    const n3up = new Note.Note(78,3);
    const n4up = new Note.Note(80,4);
    const n5up = new Note.Note(82,5);
    const n6up = new Note.Note(84,6);
    //down
    const n1down = new Note.Note(69,6);
    const n2down = new Note.Note(67,5);
    const n3down = new Note.Note(66,4);
    const n4down = new Note.Note(64,3);
    const n5down = new Note.Note(62,2);
    const n6down = new Note.Note(60,1);

    return TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n1up)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n2up)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n3up)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n4up)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n5up)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n6up)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n1down)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n2down)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n3down)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n4down)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n5down)) &&
        TestUtils.assertTrue(IntervalUtils.isAlteredInterval(n1, n6down))
};

intervalUtilsTestSuite.addTest(new TestUtils.UnitTest(alteredIntervalTest, "Altered interval test"));

const getThirdModeTest = () => {
    var key_major = "C";
    var key_minor = "c";
    var maj = "major";
    var min = "minor";
    return TestUtils.assertEqualsPrimitives(maj,IntervalUtils.getThirdMode(key_major,0)) &&
        TestUtils.assertEqualsPrimitives(min,IntervalUtils.getThirdMode(key_major,1)) &&
        TestUtils.assertEqualsPrimitives(min,IntervalUtils.getThirdMode(key_major,2)) &&
        TestUtils.assertEqualsPrimitives(maj,IntervalUtils.getThirdMode(key_major,3)) &&
        TestUtils.assertEqualsPrimitives(maj,IntervalUtils.getThirdMode(key_major,4)) &&
        TestUtils.assertEqualsPrimitives(min,IntervalUtils.getThirdMode(key_major,5)) &&
        TestUtils.assertEqualsPrimitives(min,IntervalUtils.getThirdMode(key_major,6)) &&
        TestUtils.assertEqualsPrimitives(min,IntervalUtils.getThirdMode(key_minor,0)) &&
        TestUtils.assertEqualsPrimitives(min,IntervalUtils.getThirdMode(key_minor,1)) &&
        TestUtils.assertEqualsPrimitives(maj,IntervalUtils.getThirdMode(key_minor,2)) &&
        TestUtils.assertEqualsPrimitives(min,IntervalUtils.getThirdMode(key_minor,3)) &&
        TestUtils.assertEqualsPrimitives(min,IntervalUtils.getThirdMode(key_minor,4)) &&
        TestUtils.assertEqualsPrimitives(maj,IntervalUtils.getThirdMode(key_minor,5)) &&
        TestUtils.assertEqualsPrimitives(maj,IntervalUtils.getThirdMode(key_minor,6))
};

intervalUtilsTestSuite.addTest(new TestUtils.UnitTest(getThirdModeTest, "Get third mode test"));

intervalUtilsTestSuite.run();