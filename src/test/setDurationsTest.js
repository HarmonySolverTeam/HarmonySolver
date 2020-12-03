var Utils = require("./objects/utils/Utils");
var Consts = require("./objects/commons/Consts");
var Parser = require("./objects/harmonic/Parser");
var TestUtils = require("./TestUtils");
var ExerciseSolution = require("./objects/commons/ExerciseSolution");
var Solver = require("./objects/harmonic/Solver2");

var testSuite  = new TestUtils.TestSuite("Set durations test");

var exactDivideForHFs1 = () => {
    var input = TestUtils.get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\sikorski_zzip_ex114_firstMeasure.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();
    solution.setDurations();
    var durations = solution.chords.map((x) => {return x.duration});
    return TestUtils.assertEqualsObjects([[1,4],[1,4],[1,4]], durations);
};

testSuite.addTest(new TestUtils.UnitTest(exactDivideForHFs1, "Exact divide for hfs 1"));

var exactDivideForHFs2 = () => {
    var input = TestUtils.get_ex_from_file("\\examples\\1_HarmonicFuntions\\minor\\sikorski_zzip_ex116_firstMeasure.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();
    solution.setDurations();
    var durations = solution.chords.map((x) => {return x.duration});
    return TestUtils.assertEqualsObjects([[2,4],[1,4],[1,4]], durations);
};

testSuite.addTest(new TestUtils.UnitTest(exactDivideForHFs2, "Exact divide for hfs 2"));

var exactDivideForHFs3 = () => {
    var input = "dev\nC\n4/4\nTo{};So{};So{};D{};D{};To{};To{};To{};D{}";
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();
    solution.setDurations();
    var durations = solution.chords.map((x) => {return x.duration});
    return TestUtils.assertEqualsObjects([[1,4],[1,8],[1,8],[1,8],[1,8],[1,16],[1,32],[1,32],[1,8]], durations);
};

testSuite.addTest(new TestUtils.UnitTest(exactDivideForHFs3, "Exact divide for hfs 3"));

var exactDivideForHFs4 = () => {
    var input = "C\n" +
        "4/4\n" +
        "(D{});D{};T{};S{}";
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();
    solution.setDurations();
    var durations = solution.chords.map((x) => {return x.duration});
    return TestUtils.assertEqualsObjects( [[1,4],[1,4],[1,4],[1,4]], durations);
};

testSuite.addTest(new TestUtils.UnitTest(exactDivideForHFs4, "Exact divide for hfs 4"));

testSuite.run();