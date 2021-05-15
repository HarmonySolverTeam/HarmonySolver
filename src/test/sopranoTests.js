var HarmonicFunction = require("./objects/model/HarmonicFunction");
var Note = require("./objects/model/Note");
var Soprano = require("./objects/soprano/Soprano");
var SopranoSolver = require("./objects/soprano/SopranoSolver2")
var SopranoExercise = require("./objects/soprano/SopranoExercise");
var TestUtils = require("./TestUtils");
var Consts = require("./objects/commons/Consts")
var Parser = require("./objects/harmonic/Parser")
var Utils = require("./objects/utils/Utils")

var testSuite = new TestUtils.TestSuite("Soprano exercise tests", 10000);

// ************************** HARMONIC FUNCTIONS *********************************

var use_inv3 = false;
var use_inv5 = false;

var getPossibleCombinationsOfHFsFor = (ex) => {
    var x = undefined
    var T = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1", [], [], [], false, undefined, ex.mode);
    var S = new HarmonicFunction.HarmonicFunction("S", 4, undefined, "1", [], [], [], false, undefined, ex.mode);
    var D = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [], [], [], false, undefined);

    var D7 = new HarmonicFunction.HarmonicFunction("D", x, x, x, x, ["7"])
    var S6 = new HarmonicFunction.HarmonicFunction("S", x, x, x, x, ["6"], x, x, x, ex.mode)
    var neapolitan = new HarmonicFunction.HarmonicFunction("S", 2, undefined, "3", [], [], [], true, undefined, Consts.MODE.MINOR)
    var Sii = new HarmonicFunction.HarmonicFunction("S", 2, x, x, x, x, x, x, x, ex.mode)
    var Diii = new HarmonicFunction.HarmonicFunction("D", 3, x, x, x, x, x, x, x, ex.mode)
    var Tiii = new HarmonicFunction.HarmonicFunction("T", 3, x, x, x, x, x, x, x, ex.mode)
    var Tvi = new HarmonicFunction.HarmonicFunction("T", 6, x, x, x, x, x, x, x, ex.mode)
    var Svi = new HarmonicFunction.HarmonicFunction("S", 6, x, x, x, x, x, x, x, ex.mode)
    var Dvii = new HarmonicFunction.HarmonicFunction("D", 7, x, x, x, x, x, x, x, ex.mode)

    var Dtoii = D7.copy()
    Dtoii.key = Parser.calculateKey(ex.key, Sii)
    var Dtoiii = D7.copy()
    Dtoiii.key = Parser.calculateKey(ex.key, Diii)
    var Dtoiv = D7.copy()
    Dtoiv.key = Parser.calculateKey(ex.key, S)
    var Dtov = D7.copy()
    Dtov.key = Parser.calculateKey(ex.key, D)
    var Dtovi = D7.copy()
    Dtovi.key = Parser.calculateKey(ex.key, Tvi)
    var Dtovii = D7.copy()
    Dtovii.key = Parser.calculateKey(ex.key, Dvii)
    var Dto = [Dtoii, Dtoiii, Dtoiv, Dtov, Dtovi, Dtovii]


    var combinations = [[T, S, D]];

    for(var i=1; i<16*16; i++) {
    // for (var i = 0; i < 1; i++) {
        var N = i;
        var current_comb = [T, S, D]
        if (Utils.mod(N, 2) === 0) {
            current_comb.push(D7)
            N++;
        }
        N = (N - 1) / 2
        if (Utils.mod(N, 2) === 0) {
            current_comb.push(S6)
            N++;
        }
        N = (N - 1) / 2
        if (Utils.mod(N, 2) === 0) {
            current_comb.push(neapolitan)
            N++;
        }
        N = (N - 1) / 2
        if (Utils.mod(N, 2) === 0) {
            current_comb.push(Sii)
            N++;
        }
        N = (N - 1) / 2
        if (Utils.mod(N, 2) === 0) {
            current_comb.push(Diii)
            current_comb.push(Tiii)
            N++;
        }
        N = (N - 1) / 2;
        if (Utils.mod(N, 2) === 0) {
            current_comb.push(Tvi)
            current_comb.push(Svi)
            N++;
        }
        N = (N - 1) / 2

        if (Utils.mod(N, 2) === 0) {
            current_comb.push(Dvii)
            N++;
        }
        N = (N - 1) / 2
        // if (Utils.mod(N, 2) === 0) current_comb += Dto
        combinations.push(current_comb)
    }
    combinations.sort((a,b) => a.length - b.length);
    return combinations.map((combination) =>
        {
            var new_combination = []
            for(hf of combination){
                new_combination.push(hf);

                if(use_inv3) {
                    var hf_copy = hf.copy();
                    hf_copy.inversion = hf_copy.getThird();
                    new_combination.push(hf_copy);
                }
                if(use_inv5) {
                    hf_copy = hf.copy();
                    hf_copy.inversion = hf_copy.getFifth();
                    new_combination.push(hf_copy);
                }
            }
            return new_combination;
        }
    )
}
// ****************************** EXERCISES **************************************

var exercise = function (mode, key, meter, notes) {
    this.mode = mode;
    this.key = key;
    this.meter = meter;
    this.notes = notes;
}

var targosz_p59_ex1 = new exercise(
    "major",
    "D",
    [4, 4],
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

    ]
)

var targosz_p59_ex2 = new exercise(
    "major",
    "A",
    [4, 4],
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
    ]
)

var targosz_p59_ex3 = new exercise(
    "major",
    "Bb",
    [4, 4],
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
    ]
)
var targosz_p60_ex4 = new exercise(
    "major",
    "Eb",
    [3, 4],
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
    ]
)

var targosz_p60_ex5 = new exercise(
    "major",
    "Ab",
    [4, 4],
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
    ])

var targosz_p60_ex6 = new exercise(
    "major",
    "Gb",
    [3, 4],
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
    ])

var targosz_p60_ex7 = new exercise(
    "minor",
    "b",
    [2, 4],
    [
        new Note.Note(74, 1, 0, [1, 8]),
        new Note.Note(71, 6, 0, [1, 8]),
        new Note.Note(74, 1, 0, [1, 8]),
        new Note.Note(76, 2, 0, [1, 8]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(70, 5, 0, [1, 4]),
        new Note.Note(71, 6, 0, [1, 4]),
        new Note.Note(66, 3, 0, [1, 4]),
        new Note.Note(67, 4, 0, [1, 8]),
        new Note.Note(64, 2, 0, [1, 8]),
        new Note.Note(67, 4, 0, [1, 8]),
        new Note.Note(71, 6, 0, [1, 8]),
        new Note.Note(70, 5, 0, [1, 4]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(74, 1, 0, [1, 4]),
        new Note.Note(78, 3, 0, [1, 4]),
        new Note.Note(79, 4, 0, [1, 8]),
        new Note.Note(76, 2, 0, [1, 8]),
        new Note.Note(74, 1, 0, [1, 8]),
        new Note.Note(76, 2, 0, [1, 8]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(70, 5, 0, [1, 4]),
        new Note.Note(71, 6, 0, [1, 2])
    ]
)

var targosz_p60_ex8 = new exercise(
    "minor",
    "f#",
    [4, 4],
    [
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(66, 3, 0, [1, 2]),
        new Note.Note(74, 1, 0, [1, 4]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(68, 4, 0, [1, 4]),
        new Note.Note(69, 5, 0, [1, 4]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(68, 4, 0, [1, 4]),
        new Note.Note(69, 5, 0, [1, 4]),
        new Note.Note(78, 3, 0, [1, 4]),
        new Note.Note(78, 3, 0, [1, 2]),
        new Note.Note(77, 2, 0, [1, 2]),
        new Note.Note(78, 3, 0, [1, 4]),
        new Note.Note(73, 0, 0, [1, 2]),
        new Note.Note(80, 4, 0, [1, 4]),
        new Note.Note(81, 5, 0, [1, 4]),
        new Note.Note(78, 3, 0, [1, 2]),
        new Note.Note(74, 1, 0, [1, 4]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(80, 4, 0, [1, 4]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(77, 2, 0, [1, 4]),
        new Note.Note(78, 3, 0, [1, 1])
    ]
)

var targosz_p60_ex9 = new exercise(
    "minor",
    "c#",
    [3, 4],
    [
        new Note.Note(68, 4, 0, [1, 2]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(72, 6, 0, [1, 4]),
        new Note.Note(68, 4, 0, [1, 4]),
        new Note.Note(75, 1, 0, [1, 4]),
        new Note.Note(76, 2, 0, [1, 4]),
        new Note.Note(68, 4, 0, [1, 4]),
        new Note.Note(76, 2, 0, [1, 4]),
        new Note.Note(78, 3, 0, [1, 2]),
        new Note.Note(75, 1, 0, [1, 4]),
        new Note.Note(76, 2, 0, [1, 2]),
        new Note.Note(80, 4, 0, [1, 4]),
        new Note.Note(81, 5, 0, [1, 4]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(78, 3, 0, [1, 4]),
        new Note.Note(75, 1, 0, [1, 4]),
        new Note.Note(80, 4, 0, [1, 4]),
        new Note.Note(72, 6, 0, [1, 4]),
        new Note.Note(73, 0, 0, [3, 4])
    ]
)

var targosz_p60_ex10 = new exercise(
    "minor",
    "g#",
    [3, 4],
    [
        new Note.Note(68, 4, 0, [1, 2]),
        new Note.Note(67, 3, 0, [1, 4]),
        new Note.Note(68, 4, 0, [1, 4]),
        new Note.Note(71, 6, 0, [1, 4]),
        new Note.Note(70, 5, 0, [1, 4]),
        new Note.Note(71, 6, 0, [1, 4]),
        new Note.Note(75, 1, 0, [1, 4]),
        new Note.Note(76, 2, 0, [1, 4]),
        new Note.Note(75, 1, 0, [1, 2]),
        new Note.Note(70, 5, 0, [1, 4]),
        new Note.Note(71, 6, 0, [1, 2]),
        new Note.Note(73, 0, 0, [1, 4]),
        new Note.Note(70, 5, 0, [1, 4]),
        new Note.Note(71, 6, 0, [1, 4]),
        new Note.Note(68, 4, 0, [1, 4]),
        new Note.Note(68, 4, 0, [1, 2]),
        new Note.Note(67, 3, 0, [1, 4]),
        new Note.Note(68, 4, 0, [3, 4])
    ]
)

var targosz_p60_ex11 = new exercise(
    "minor",
    "F",
    [6, 8],
    [
        new Note.Note(77, 3, 0, [3, 8]),
        new Note.Note(77, 3, 0, [1, 8]),
        new Note.Note(73, 1, 0, [1, 8]),
        new Note.Note(70, 6, 0, [1, 8]),
        new Note.Note(68, 5, 0, [1, 8]),
        new Note.Note(72, 0, 0, [1, 8]),
        new Note.Note(73, 1, 0, [1, 8]),
        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(67, 4, 0, [1, 8]),
        new Note.Note(68, 5, 0, [3, 8]),
        new Note.Note(70, 6, 0, [1, 8]),
        new Note.Note(65, 3, 0, [1, 8]),
        new Note.Note(70, 6, 0, [1, 8]),
        new Note.Note(67, 4, 0, [3, 8]),
        new Note.Note(72, 0, 0, [3, 8]),
        new Note.Note(72, 0, 0, [1, 8]),
        new Note.Note(68, 5, 0, [1, 8]),
        new Note.Note(65, 3, 0, [1, 8]),
        new Note.Note(64, 2, 0, [1, 8]),
        new Note.Note(67, 4, 0, [1, 8]),
        new Note.Note(72, 0, 0, [1, 8]),
        new Note.Note(72, 0, 0, [1, 8]),
        new Note.Note(68, 5, 0, [1, 8]),
        new Note.Note(72, 0, 0, [1, 8]),
        new Note.Note(73, 1, 0, [1, 8]),
        new Note.Note(70, 6, 0, [1, 8]),
        new Note.Note(73, 1, 0, [1, 8]),
        new Note.Note(72, 0, 0, [3, 8]),
        new Note.Note(72, 0, 0, [1, 8]),
        new Note.Note(77, 3, 0, [1, 8]),
        new Note.Note(80, 5, 0, [1, 8]),
        new Note.Note(79, 4, 0, [1, 4]),
        new Note.Note(76, 2, 0, [1, 8]),
        new Note.Note(77, 3, 0, [3, 8])
    ]
)

var targosz_p60_ex12 = new exercise(
    "minor",
    "bb",
    [4, 4],
    [
        new Note.Note(65, 3, 0, [1, 2]),
        new Note.Note(70, 6, 0, [1, 2]),
        new Note.Note(70, 6, 0, [1, 4]),
        new Note.Note(66, 4, 0, [1, 4]),
        new Note.Note(65, 3, 0, [1, 4]),
        new Note.Note(72, 0, 0, [1, 4]),
        new Note.Note(73, 1, 0, [1, 2]),
        new Note.Note(70, 6, 0, [1, 2]),
        new Note.Note(69, 5, 0, [1, 1]),
        new Note.Note(70, 6, 0, [1, 2]),
        new Note.Note(77, 3, 0, [1, 2]),
        new Note.Note(78, 4, 0, [1, 2]),
        new Note.Note(75, 2, 0, [1, 4]),
        new Note.Note(78, 4, 0, [1, 4]),
        new Note.Note(77, 3, 0, [1, 2]),
        new Note.Note(72, 0, 0, [1, 2]),
        new Note.Note(73, 1, 0, [1, 2]),
        new Note.Note(77, 3, 0, [1, 4]),
        new Note.Note(73, 1, 0, [1, 4]),
        new Note.Note(72, 0, 0, [1, 2]),
        new Note.Note(69, 5, 0, [1, 2]),
        new Note.Note(70, 6, 0, [1, 1])
    ]
)


// ******************************** TESTS ****************************************

var sopranoBaseTest = (ex, harmonicFunctions) => {
    var measures = [];
    var counter = 0;
    var current_measure = [];
    for (var i = 0; i < ex.notes.length; i++) {
        counter += ex.notes[i].duration[0] / ex.notes[i].duration[1];
        current_measure.push(ex.notes[i]);
        if (counter === ex.meter[0] / ex.meter[1]) {
            measures.push(new Note.Measure(current_measure));
            current_measure = [];
            counter = 0;
        }
    }

    var sopranoExercise = new SopranoExercise.SopranoExercise(ex.mode, ex.key, ex.meter, ex.notes, undefined, measures, harmonicFunctions);
    var sopranoSolver = new SopranoSolver.SopranoSolver(sopranoExercise);
    try {
        var solution = sopranoSolver.solve();
    } catch (e) {
        console.log(e)
        return false;
    }
    return TestUtils.assertDefined(solution.chords[solution.chords.length - 1].sopranoNote.pitch);
}


var getSimpleNameOfChordsCombination = (comb) => {
    var res = "";
    for (const hf of comb) res += hf.getSimpleChordName() + " ";
    return res;
}

getPossibleCombinationsOfHFsFor(targosz_p59_ex1).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p59_ex1,
            harmonicFunctions
        ), "Targosz p.59 ex.1" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p59_ex2).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p59_ex2,
            harmonicFunctions
        ), "Targosz p.59 ex.2" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p59_ex3).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p59_ex3,
            harmonicFunctions
        ), "Targosz p.59 ex.3" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p60_ex4).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p60_ex4,
            harmonicFunctions
        ), "Targosz p.60 ex.4" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p60_ex5).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p60_ex5,
            harmonicFunctions
        ), "Targosz p.60 ex.5" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p60_ex6).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p60_ex6,
            harmonicFunctions
        ), "Targosz p.60 ex.6" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p60_ex7).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p60_ex7,
            harmonicFunctions
        ), "Targosz p.60 ex.7" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p60_ex8).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p60_ex8,
            harmonicFunctions
        ), "Targosz p.60 ex.8" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p60_ex9).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p60_ex9,
            harmonicFunctions
        ), "Targosz p.60 ex.9" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p60_ex10).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p60_ex10,
            harmonicFunctions
        ), "Targosz p.60 ex.10" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p60_ex11).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p60_ex11,
            harmonicFunctions
        ), "Targosz p.60 ex.11" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

getPossibleCombinationsOfHFsFor(targosz_p60_ex12).forEach((harmonicFunctions) =>
    testSuite.addTest(new TestUtils.UnitTest(
        () => sopranoBaseTest(
            targosz_p60_ex12,
            harmonicFunctions
        ), "Targosz p.60 ex.12" + " for functions: " + getSimpleNameOfChordsCombination(harmonicFunctions)))
);

testSuite.run();