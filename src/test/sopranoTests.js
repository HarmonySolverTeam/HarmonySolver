var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")
var Soprano = require("./objects/Soprano")
var SopranoEx = require("./objects/SopranoExercise")


var t = new HarmonicFunction.HarmonicFunction("T", 1, -1, "1", undefined, [], [], false, undefined);
var s = new HarmonicFunction.HarmonicFunction("S", 4, -1, "1", undefined, [], [], false, undefined);
var d = new HarmonicFunction.HarmonicFunction("D", 5, -1, "1", undefined, [], [], false, undefined);
// function SopranoExercise(mode, key, meter, notes, durations){
//     this.mode = mode; // minor or major
//     this.key = key; // for example C
//     this.meter = meter; // [x,y]
//     this.notes = notes; // list of notes
//     this.durations = durations; // list of durations corresponding to notes

//     this.toString = function(){
//         return this.mode+" "+this.key+" "+this.meter+" "+this.notes+" "+this.durations;
//     }
// }

// function SopranoHarmonizationExercise(sopranoExercise, harmonicFunctions){
//     this.sopranoExercise = sopranoExercise;
//     this.harmonicFunctions = harmonicFunctions;
// }
var notes = [
    new Note.Note(60, 0),
    new Note.Note(65, 3),
    new Note.Note(67, 4),
    new Note.Note(72, 0)
];

var sEx = new SopranoEx.SopranoExercise(undefined, "C", [3,4], notes, undefined);
var shEx = new SopranoEx.SopranoHarmonizationExercise(sEx,[], [t,s,d]);

var sopranoSolver = new Soprano.SopranoSolver(shEx);

var solution = sopranoSolver.solve();
// console.log(solution);

// var res = sopranoSolver.getChordBasePitch(hf);
// console.log(res)

// console.log(sopranoSolver.chordsMap)