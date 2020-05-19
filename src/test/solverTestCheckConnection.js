var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Parser = require("./objects/Parser")
var Solver = require("./objects/Solver")

var input ="C\n3/4\nT{}\nD{}\nT{}\n";
console.log(input);

var ex = Parser.parse(input);
var solver = new Solver.Solver(ex);
var solution = solver.solve();

console.log("SOLUTION:")
console.log(solution)

solution.chords.forEach(element => {
    console.log("\n\n");
    console.log(element);
    
});

