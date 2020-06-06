var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")

var gen = new Generator.ChordGenerator("C");

// var startTime = new Date();
var hf = new HarmonicFunction.HarmonicFunction("T", 1, "1", "1", undefined, [], [], false, undefined);
var res = gen.generate(hf);
console.log("Position 1");
console.log("numer of chords: " + res.length);
res.forEach((x) => {console.log(x.toString())})


var hf = new HarmonicFunction.HarmonicFunction("T", 1, -1, "1", undefined, [], [], false, undefined);
var res = gen.generate(hf, [undefined, undefined, undefined, new Note.Note(72, 0, "1")]);
console.log("Position -1 but set sopranoNote");
console.log("numer of chords: " + res.length);
res.forEach((x) => {console.log(x.toString())})


// console.log((new Date()) - startTime)