const UnitTest = require("./TestUtils");
const Exercise = require("./objects/Exercise");
const HarmonicFunction = require("./objects/HarmonicFunction");
const Solver = require("./objects/Solver")

var exercise = new Exercise.Exercise("C", [3,4],"major",[[new HarmonicFunction.HarmonicFunction("T",1,undefined,'1',[["4","3"]],[],[],false,undefined,undefined)]]);
var solver = new Solver.Solver(exercise, undefined, undefined);
var hf = solver.harmonicFunctions;

const delayTestSuite = new UnitTest.TestSuite("Delay tests");

const chordWithDelayConvertLengthTest = () => {
    return UnitTest.assertEqualsPrimitives(2, hf.length)
};

delayTestSuite.addTest(new UnitTest.UnitTest(chordWithDelayConvertLengthTest, "Dividing function into two"));

const chordWithDelayConvertFirstChildTest = () => {
    return UnitTest.assertEqualsPrimitives(1, hf[0].omit.length) && UnitTest.assertEqualsPrimitives('3', hf[0].omit[0]) &&
        UnitTest.assertEqualsPrimitives(1, hf[0].extra.length) && UnitTest.assertEqualsPrimitives('4',hf[0].extra[0]) &&
        UnitTest.assertEqualsPrimitives(exercise.measures[0][0].delay, hf[0].delay)
};

delayTestSuite.addTest(new UnitTest.UnitTest(chordWithDelayConvertFirstChildTest, "Transformation of first child function correctness"));

const chordWithDelayConvertSecondChildTest = () => {
    return UnitTest.assertEqualsPrimitives(0, hf[1].omit.length) &&
        UnitTest.assertEqualsPrimitives(0, hf[1].extra.length) &&
        UnitTest.assertEqualsPrimitives(0, hf[1].delay.length)
};

delayTestSuite.addTest(new UnitTest.UnitTest(chordWithDelayConvertSecondChildTest, "Transformation of second child function correctness"));

const chordWithDelayConvertWithFixedPositionTest = () => {
    var exercise = new Exercise.Exercise("C", [3,4],"major",[[new HarmonicFunction.HarmonicFunction("T",1,"3",'1',[["4","3"]],[],[],false,undefined,undefined)]]);
    var solver = new Solver.Solver(exercise, undefined, undefined);
    var hf = solver.harmonicFunctions;
    return UnitTest.assertEqualsPrimitives('4', hf[0].position) && UnitTest.assertEqualsPrimitives('3', hf[1].position+'')
};

delayTestSuite.addTest(new UnitTest.UnitTest(chordWithDelayConvertWithFixedPositionTest, "Transformation of function with delay and fixed position"));

const chordWithDelayConvertWithFixedRevolutionTest = () => {
    var exercise = new Exercise.Exercise("C", [3,4],"major",[[new HarmonicFunction.HarmonicFunction("T",1,undefined,'3',[["4","3"]],[],[],false,undefined,undefined)]]);
    var solver = new Solver.Solver(exercise, undefined, undefined);
    var hf = solver.harmonicFunctions;
    return UnitTest.assertEqualsPrimitives('4', hf[0].revolution) && UnitTest.assertEqualsPrimitives('3', hf[1].revolution)
};

delayTestSuite.addTest(new UnitTest.UnitTest(chordWithDelayConvertWithFixedRevolutionTest, "Transformation of function with delay and fixed revolution"));

const chordWithDelayConvertMoreMeasuresTest = () => {
    var exercise = new Exercise.Exercise("C", [3,4],"major",[[new HarmonicFunction.HarmonicFunction("T",1,undefined,'3',[["4","3"]],[],[],false,undefined,undefined),
        new HarmonicFunction.HarmonicFunction("T",1,-1,'3',[["4","3"]],[],[],false,undefined,undefined)],
        [new HarmonicFunction.HarmonicFunction("T",1,-1,'3',[["4","3"]],[],[],false,undefined,undefined),
            new HarmonicFunction.HarmonicFunction("T",1,-1,'3',[],[],[],false,undefined,undefined)]]);
    var solver = new Solver.Solver(exercise, undefined, undefined);
    var hf = solver.harmonicFunctions;
    return UnitTest.assertEqualsPrimitives(7, hf.length)
};

delayTestSuite.addTest(new UnitTest.UnitTest(chordWithDelayConvertMoreMeasuresTest, "More measures containing delayed functions handling"));

const doubleDelayedFunctionTest = () => {
    var exercise = new Exercise.Exercise("C", [3,4],"major",[[new HarmonicFunction.HarmonicFunction("T",1,undefined,'1',[["6","5"],["4","3"]],[],[],false,undefined,undefined)]]);
    var solver = new Solver.Solver(exercise, undefined, undefined);
    var hf = solver.harmonicFunctions;
    return UnitTest.assertEqualsObjects([ '6', '4' ], hf[0].extra) &&
        UnitTest.assertEqualsObjects(['5', '3'], hf[0].omit) &&
        UnitTest.assertEqualsPrimitives(exercise.measures[0][0].delay, hf[0].delay)
};

delayTestSuite.addTest(new UnitTest.UnitTest(doubleDelayedFunctionTest, "Double delayed function transformation"));

const tripleDelayedFunctionTest = () => {
    var exercise = new Exercise.Exercise("C", [3,4],"major",[[new HarmonicFunction.HarmonicFunction("T",1,undefined,'1',[["6","5"],["4","3"],["2","1"]],[],[],false,undefined,undefined)]]);
    var solver = new Solver.Solver(exercise, undefined, undefined);
    var hf = solver.harmonicFunctions;
    return UnitTest.assertEqualsObjects([ '6', '4', '2'], hf[0].extra) &&
        UnitTest.assertEqualsObjects(['5', '3', '1'], hf[0].omit) &&
        UnitTest.assertEqualsPrimitives(exercise.measures[0][0].delay, hf[0].delay)
};

delayTestSuite.addTest(new UnitTest.UnitTest(tripleDelayedFunctionTest, "Triple delayed function transformation"));



delayTestSuite.run();