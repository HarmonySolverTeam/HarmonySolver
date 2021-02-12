const http = require('http');
const url = require('url');
const Exercise = require('../test/objects/harmonic/Exercise');
const Chord = require('../test/objects/model/Chord');
const Parser = require('../test/objects/harmonic/Parser');
const Solver = require('../test/objects/harmonic/Solver2');
const Translator = require('../test/objects/bass/BassTranslator');
const FiguredBass = require('../test/objects/bass/FiguredBass');
const SopranoSolver = require('../test/objects/soprano/SopranoSolver2');
const SopranoExercise = require('../test/objects/soprano/SopranoExercise');

const hostname = '127.0.0.1';
const port = 7777;

const validatorEndpoint = "/validator";
const harmonicsEndpoint = "/harmonics";
const bassEndpoint = "/bass";
const sopranoEndpoint = "/soprano";

const server = http.createServer((req, res) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    var urlObj = url.parse(req.url, true);
    switch(urlObj.pathname) {
        case validatorEndpoint:
            req.on('end', () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(new Exercise.SolvedExercise(JSON.parse(data).chords.map(x => Chord.chordReconstruct(x))).checkCorrectness());
            });
            break;
        case harmonicsEndpoint:
            if (urlObj.query && urlObj.query.onlyParse) {
                req.on('end', () => {
                    try {
                        var request = JSON.parse(data);
                        Parser.parse(request.input);
                        res.statusCode = 200;
                        res.end();
                    } catch (e) {
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end(JSON.stringify(e));
                    }
                })
            } else {
                req.on('end', () => {
                    try {
                        var request = JSON.parse(data);
                        var exercise = Parser.parse(request.input);
                        var solver = new Solver.Solver(exercise, undefined, undefined, !request.configuration.enableCorrector, !request.configuration.enablePrechecker);
                        var solution = solver.solve();
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end(JSON.stringify(solution));
                    } catch (e) {
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end(JSON.stringify(e));
                    }
                });
            }
            break;
        case bassEndpoint:
            req.on('end', () => {
                try {
                    var request = JSON.parse(data);
                    var exercise = FiguredBass.figuredBassExerciseReconstruct(request.exercise);
                    var translator = new Translator.BassTranslator();
                    var exerciseAndBassline = translator.createExerciseFromFiguredBass(exercise);
                    var solver = new Solver.Solver(exerciseAndBassline[0], exerciseAndBassline[1], undefined, !request.configuration.enableCorrector, !request.configuration.enablePrechecker);
                    var solution = solver.solve();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(JSON.stringify({'solution': solution, 'durations': exercise.durations}));
                } catch (e) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(JSON.stringify(e));
                }
            });
            break;
        case sopranoEndpoint:
            req.on('end', () => {
                try {
                    var request = JSON.parse(data);
                    var exercise = SopranoExercise.sopranoExerciseReconstruct(request.exercise);
                    var solver = new SopranoSolver.SopranoSolver(exercise, request.punishmentRatios);
                    var solution = solver.solve();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(JSON.stringify({'solution': solution, 'durations': exercise.durations}));
                } catch (e) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(JSON.stringify(e));
                }
            });
            break;
        default:
            res.statusCode = 404;
            res.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});