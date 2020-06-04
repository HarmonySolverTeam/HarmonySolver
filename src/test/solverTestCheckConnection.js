var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Parser = require("./objects/Parser")
var Solver = require("./objects/Solver")

var fs = require('fs');
var path = process.cwd();
var buffer = fs.readFileSync(path + "\\examples\\targosz_p61_ex16.txt");

var input = buffer.toString();
input = input.replace("\r\n", "\n")

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

console.log(solution.chords.length)

