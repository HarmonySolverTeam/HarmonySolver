var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")

var hf = new HarmonicFunction.HarmonicFunction("T", 1, -1, "1", undefined, [], [], false, undefined);
var gen = new Generator.ChordGenerator("C");

var startTime = new Date();
var res = gen.generate(hf, [new Note.Note(48, 0, "1")]);

res.forEach((x) => {console.log(x.toString())})

console.log((new Date()) - startTime)