var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Parser = require("./objects/Parser")
var Solver = require("./objects/Solver")

var systems = ["open", "close", undefined]
systems.forEach(function(system){
    var hf = new HarmonicFunction.HarmonicFunction("T", 1, -1, "1", undefined, [], [], false, system);
    var gen = new Generator.ChordGenerator("C");
    var res = gen.generate(hf);
    console.log(system + " " + res.length)
})

