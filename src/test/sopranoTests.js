var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")
var Soprano = require("./objects/Soprano")

var hf = new HarmonicFunction.HarmonicFunction("T", 1, -1, "1", undefined, [], [], false, undefined);
var sopranoSolver = new Soprano.SopranoSolver("D");

var res = sopranoSolver.getChordBasePitch(hf);
console.log(res)

sopranoSolver.prepareMap([hf]);
console.log(sopranoSolver.chordsMap)