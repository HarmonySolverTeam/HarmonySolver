var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")

var gen = new Generator.ChordGenerator("A", 'minor');

//a
var hf = new HarmonicFunction.HarmonicFunction("T", 1, "3", "1", undefined, [], [], false, undefined);
var res = gen.generate(hf);
res.forEach((x) => {console.log(x.toString())})
console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\")

//d
hf = new HarmonicFunction.HarmonicFunction("S", 4, "3", "1", undefined, [], [], false, undefined);
var res = gen.generate(hf);
res.forEach((x) => {console.log(x.toString())})
console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\")

//e
hf = new HarmonicFunction.HarmonicFunction("D", 5, "3", "1", undefined, [], [], false, undefined);
var res = gen.generate(hf);
res.forEach((x) => {console.log(x.toString())})
console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\")

//C
hf = new HarmonicFunction.HarmonicFunction("T", 3, "3", "1", undefined, [], [], false, undefined);
var res = gen.generate(hf);
res.forEach((x) => {console.log(x.toString())})
console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\")

//A
hf = new HarmonicFunction.HarmonicFunction("T", 1, "3", "1", undefined, [], [], false, undefined, 'major');
var res = gen.generate(hf);
res.forEach((x) => {console.log(x.toString())})
console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\")

//in major scale
gen = new Generator.ChordGenerator("C", 'major');

//c
hf = new HarmonicFunction.HarmonicFunction("T", 1, "3", "1", undefined, [], [], false, undefined, 'minor');
var res = gen.generate(hf);
res.forEach((x) => {console.log(x.toString())})
console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\")