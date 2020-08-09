var Generator = require("./objects/ChordGenerator");
var Consts = require("./objects/Consts");
var Chord = require("./objects/Chord");
var HarmonicFunction = require("./objects/HarmonicFunction");
var Parser = require("./objects/Parser");
var Solver = require("./objects/Solver");
var UnitTest = require("./TestUtils");
var fs = require('fs');


var get_ex_from_file = (path) => {
    var buffer = fs.readFileSync(process.cwd() + path);
    var input = buffer.toString();
    input = input.replace("\r\n", "\n")
    return input;
}

var harmonicFunctionsTestSuite = new UnitTest.TestSuite("1_HarmonicFunctions tests");

var targosz_p61_ex13 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\targosz_p61_ex13.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex13, "HarmonicFunctions Major test 1 - from targosz_p61_ex13"));


var targosz_p61_ex14 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\targosz_p61_ex14.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex14, "HarmonicFunctions Major test 2 - from targosz_p61_ex14"));


var targosz_p61_ex15 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\targosz_p61_ex15.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex15, "HarmonicFunctions Major test 3 - from targosz_p61_ex15"));


var targosz_p61_ex16 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\targosz_p61_ex16.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex16, "HarmonicFunctions Major test 4 - from targosz_p61_ex16"));


var sikorski_zzip_ex1 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\sikorski_zzip_ex1.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex1, "HarmonicFunctions Major test 5 - from sikorski_zzip_ex1"));


var sikorski_zzip_ex3 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\sikorski_zzip_ex3.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex3, "HarmonicFunctions Major test 6 - from sikorski_zzip_ex3"));


var sikorski_zzip_ex53 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\sikorski_zzip_ex53.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex53, "HarmonicFunctions Major test 7 - from sikorski_zzip_ex53"));


var sikorski_zzip_ex54 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\sikorski_zzip_ex54.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex54, "HarmonicFunctions Major test 8 - from sikorski_zzip_ex54"));


var sikorski_zzip_ex77 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\sikorski_zzip_ex77.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex77, "HarmonicFunctions Major test 9 - from sikorski_zzip_ex77"));


// MINOR
var targosz_p61_ex17 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\minor\\targosz_p61_ex17.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex17, "HarmonicFunctions Minor test 1 - from targosz_p61_ex17"));


var targosz_p61_ex18 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\minor\\targosz_p61_ex18.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex18, "HarmonicFunctions Minor test 2 - from targosz_p61_ex18"));


var targosz_p61_ex19 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\minor\\targosz_p61_ex19.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex19, "HarmonicFunctions Minor test 3 - from targosz_p61_ex19"));


var targosz_p61_ex20 = () => {
    var input = get_ex_from_file("\\examples\\1_HarmonicFuntions\\minor\\targosz_p61_ex20.txt");
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote);
}
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex20, "HarmonicFunctions Minor test 4 - from targosz_p61_ex20"));


harmonicFunctionsTestSuite.run();