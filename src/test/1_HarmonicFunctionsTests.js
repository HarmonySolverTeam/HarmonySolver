var Generator = require("./objects/harmonic/ChordGenerator");
var Consts = require("./objects/commons/Consts");
var Chord = require("./objects/model/Chord");
var HarmonicFunction = require("./objects/model/HarmonicFunction");
var Utils = require("./objects/utils/Utils")
var Parser = require("./objects/harmonic/Parser");
var Solver = require("./objects/harmonic/Solver2");
var UnitTest = require("./TestUtils");
var ChordComponentManager = require("./objects/model/ChordComponentManager")

var cm = new ChordComponentManager.ChordComponentManager();

var check_solution_found_major = (exName) => {
    var input = UnitTest.get_ex_from_file("\\examples\\1_HarmonicFuntions\\major\\" + exName);
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote.pitch);
}

var check_solution_found_minor = (exName) => {
    var input = UnitTest.get_ex_from_file("\\examples\\1_HarmonicFuntions\\minor\\" + exName);
    var ex = Parser.parse(input);
    var solver = new Solver.Solver(ex);
    var solution = solver.solve();

    return UnitTest.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote.pitch);
}

var harmonicFunctionsTestSuite = new UnitTest.TestSuite("1_HarmonicFunctions tests",  1700);
var targosz_p61_ex13 = () => {return check_solution_found_major("targosz_p61_ex13.txt")};
var targosz_p61_ex14 = () => {return check_solution_found_major("targosz_p61_ex14.txt")};
var targosz_p61_ex15 = () => {return check_solution_found_major("targosz_p61_ex15.txt")};
var targosz_p61_ex16 = () => {return check_solution_found_major("targosz_p61_ex16.txt")};
var sikorski_zzip_ex1 = () => {return check_solution_found_major("sikorski_zzip_ex1.txt")};
var sikorski_zzip_ex3 = () => {return check_solution_found_major("sikorski_zzip_ex3.txt")};
var sikorski_zzip_ex53 = () => {return check_solution_found_major("sikorski_zzip_ex53.txt")};
var sikorski_zzip_ex54 = () => {return check_solution_found_major("sikorski_zzip_ex54.txt")};
var sikorski_zzip_ex77 = () => {return check_solution_found_major("sikorski_zzip_ex77.txt")};
var sikorski_zzip_ex65 = () => {return check_solution_found_major("sikorski_zzip_ex65.txt")};
var sikorski_zzip_ex66 = () => {return check_solution_found_major("sikorski_zzip_ex66.txt")};
var delay_9_8 = () => {return check_solution_found_major("example_delay_9-8.txt")};
var delays_test = () => {return check_solution_found_major("delay_test.txt")};
var sikorski_zzip_ex102 = () => {return check_solution_found_major("sikorski_zzip_ex102.txt")};
var sikorski_zzip_ex114 = () => {return check_solution_found_major("sikorski_zzip_ex114.txt")};
var sikorski_zzip_ex126 = () => {return check_solution_found_major("sikorski_zzip_ex126.txt")};
var d_altered_major= () => {return check_solution_found_major("d_altered_test.txt")};
var sikorski_zzip_ex162 = () => {return check_solution_found_major("sikorski_zzip_ex162.txt")};
var sikorski_zzip_ex168 = () => {return check_solution_found_major("sikorski_zzip_ex168.txt")};
var d_vi_test = () => {return check_solution_found_major("d_tvi_test.txt")};
var sikorski_zzip_ex180 = () => {return check_solution_found_major("sikorski_zzip_ex180.txt")};
var sikorski_zzip_ex186 = () => {return check_solution_found_major("sikorski_zzip_ex186.txt")};
var sikorski_zzip_ex198 = () => {return check_solution_found_major("sikorski_zzip_ex198.txt")};
var chained_deflection_basic = () => {return check_solution_found_major("chained_deflection_basic.txt")};
var d_with_7_revolution = () => {return check_solution_found_major("d_with_7_revolution.txt")};
var d9_without_omits = () => {return check_solution_found_major("d9_without_omits.txt")};
var sikorski_zzip_ex206 = () => {return check_solution_found_major("sikorski_zzip_ex206.txt")};
var sikorski_zzip_ex207 = () => {return check_solution_found_major("sikorski_zzip_ex207.txt")};

harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex13, "HarmonicFunctions Major test 1 - from targosz_p61_ex13"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex14, "HarmonicFunctions Major test 2 - from targosz_p61_ex14"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex15, "HarmonicFunctions Major test 3 - from targosz_p61_ex15"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex16, "HarmonicFunctions Major test 4 - from targosz_p61_ex16"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex1, "HarmonicFunctions Major test 5 - from sikorski_zzip_ex1"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex3, "HarmonicFunctions Major test 6 - from sikorski_zzip_ex3"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex53, "HarmonicFunctions Major test 7 - from sikorski_zzip_ex53"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex54, "HarmonicFunctions Major test 8 - from sikorski_zzip_ex54"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex77, "HarmonicFunctions Major test 9 - from sikorski_zzip_ex77"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex65, "HarmonicFunctions Major test 10 - from sikorski_zzip_ex65"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex66, "HarmonicFunctions Major test 11 - from sikorski_zzip_ex66"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(delay_9_8, "HarmonicFunctions Major test 12 - from example_delay_9-8"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(delays_test, "HarmonicFunctions Major test 13 - from delay_test"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex102, "HarmonicFunctions Major test 14 - from sikorski_zzip_ex102"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex114, "HarmonicFunctions Major test 15 - from sikorski_zzip_ex114"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex126, "HarmonicFunctions Major test 16 - from sikorski_zzip_ex126"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(d_altered_major, "HarmonicFunctions Major test 17 - from d_altered_test"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex162, "HarmonicFunctions Major test 18 - from sikorski_zzip_ex162"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex168, "HarmonicFunctions Major test 19 - from sikorski_zzip_ex168"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(d_vi_test, "HarmonicFunctions Major test 20 - from d_vi_test"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex180, "HarmonicFunctions Major test 21 - from sikorski_zzip_ex180"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex186, "HarmonicFunctions Major test 22 - from sikorski_zzip_ex186"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex198, "HarmonicFunctions Major test 23 - from sikorski_zzip_ex198"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(chained_deflection_basic, "HarmonicFunctions Major test 24 - from chained_deflection_basic"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(d_with_7_revolution, "HarmonicFunctions Major test 25 - from d_with_7_revolution"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(d9_without_omits, "HarmonicFunctions Major test 26 - from d9_without_omits"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex206, "HarmonicFunctions Major test 27 - from sikorski_zzip_ex206"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex207, "HarmonicFunctions Major test 28 - from sikorski_zzip_ex207"));

// MINOR
var targosz_p61_ex17 = () => {return check_solution_found_minor("targosz_p61_ex17.txt")};
var targosz_p61_ex18 = () => {return check_solution_found_minor("targosz_p61_ex18.txt")};
var targosz_p61_ex19 = () => {return check_solution_found_minor("targosz_p61_ex19.txt")};
var targosz_p61_ex20 = () => {return check_solution_found_minor("targosz_p61_ex20.txt")};
var sikorski_zzip_ex67 = () => {return check_solution_found_minor("sikorski_zzip_ex67.txt")};
var sikorski_zzip_ex68 = () => {return check_solution_found_minor("sikorski_zzip_ex68.txt")};
var delay_D65 = () => {return check_solution_found_minor("example_delay_D65.txt")};
var sikorski_zzip_ex92 = () => {return check_solution_found_minor("sikorski_zzip_ex92.txt")};
var sikorski_zzip_ex105 = () => {return check_solution_found_minor("sikorski_zzip_ex105.txt")};
var sikorski_zzip_ex116 = () => {return check_solution_found_minor("sikorski_zzip_ex116.txt")};
var sikorski_zzip_ex127 = () => {return check_solution_found_minor("sikorski_zzip_ex127.txt")};
var sikorski_zzip_ex163 = () => {return check_solution_found_minor("sikorski_zzip_ex163.txt")};
var sikorski_zzip_ex169 = () => {return check_solution_found_minor("sikorski_zzip_ex169.txt")};
var sikorski_zzip_ex153 = () => {return check_solution_found_minor("sikorski_zzip_ex153.txt")};
var sikorski_zzip_ex175 = () => {return check_solution_found_minor("sikorski_zzip_ex175.txt")};
var sikorski_zzip_ex181 = () => {return check_solution_found_minor("sikorski_zzip_ex181.txt")};
var sikorski_zzip_ex193 = () => {return check_solution_found_minor("sikorski_zzip_ex193.txt")};
var sikorski_zzip_ex208 = () => {return check_solution_found_minor("sikorski_zzip_ex208.txt")};

harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex17, "HarmonicFunctions Minor test 1 - from targosz_p61_ex17"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex18, "HarmonicFunctions Minor test 2 - from targosz_p61_ex18"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex19, "HarmonicFunctions Minor test 3 - from targosz_p61_ex19"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(targosz_p61_ex20, "HarmonicFunctions Minor test 4 - from targosz_p61_ex20"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex67, "HarmonicFunctions Minor test 5 - from sikorski_zzip_ex67"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex68, "HarmonicFunctions Minor test 6 - from sikorski_zzip_ex68"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(delay_D65, "HarmonicFunctions Minor test 7 - from example_delay_D65"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex92, "HarmonicFunctions Minor test 8 - from sikorski_zzip_ex92"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex105, "HarmonicFunctions Minor test 9 - from sikorski_zzip_ex105"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex116, "HarmonicFunctions Minor test 10 - from sikorski_zzip_ex116"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex127, "HarmonicFunctions Minor test 11 - from sikorski_zzip_ex127"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex163, "HarmonicFunctions Minor test 12 - from sikorski_zzip_ex163"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex169, "HarmonicFunctions Minor test 13 - from sikorski_zzip_ex169"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex153, "HarmonicFunctions Minor test 14 - from sikorski_zzip_ex153"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex175, "HarmonicFunctions Minor test 15 - from sikorski_zzip_ex175"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex181, "HarmonicFunctions Minor test 16 - from sikorski_zzip_ex181"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex193, "HarmonicFunctions Minor test 17 - from sikorski_zzip_ex193"));
harmonicFunctionsTestSuite.addTest(new UnitTest.UnitTest(sikorski_zzip_ex208, "HarmonicFunctions Minor test 18 - from sikorski_zzip_ex208"));

harmonicFunctionsTestSuite.run();