const http = require('http');
const Exercise = require('../../test/objects/harmonic/Exercise');
const Chord = require('../../test/objects/model/Chord');

const hostname = '127.0.0.1';
const port = 7777;

const server = http.createServer((req, res) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(new Exercise.SolvedExercise(JSON.parse(data).chords.map(x => Chord.chordReconstruct(x))).checkCorrectness());
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});