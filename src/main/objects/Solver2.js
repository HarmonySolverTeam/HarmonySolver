.import "./Note.js" as Note
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./ExerciseSolution.js" as ExerciseSolution
.import "./Consts.js" as Consts
.import "./Chord.js" as Chord
.import "./ChordGenerator.js" as ChordGenerator
.import "./ChordRulesChecker.js" as Checker
.import "./Utils.js" as Utils
.import "./ExerciseCorrector.js" as Corrector
.import "./PreChecker.js" as PreChecker
.import "./Dikstra.js" as Dikstra
.import "./Graph.js" as Graph

var DEBUG = false;

function Solver(exercise, bassLine, sopranoLine){

    function getFunctionsWithDelays(functions){
        var newFunctions = functions.slice();
        var addedChords = 0;
        for(var i=0; i<functions.length; i++){
            var delays = functions[i].delay;
            if(delays.length === 0) continue;
            var newFunction = functions[i].copy();
            for(var j=0; j<delays.length; j++){
                if(parseInt(delays[j][1].baseComponent)>=8 && !Utils.containsChordComponent(newFunction.extra, delays[j][1].chordComponentString))
                {
                    newFunction.extra.push(delays[j][1]);
                }
                functions[i].extra.push(delays[j][0]);
                functions[i].omit.push(delays[j][1]);
                functions[i].extra = functions[i].extra.filter(function(elem){return elem.chordComponentString !== delays[j][1].chordComponentString});
                if(delays[j][1] === functions[i].position) functions[i].position = delays[j][0];
                if(delays[j][1] === functions[i].revolution) functions[i].revolution = delays[j][0];
            }
            newFunctions.splice(i+addedChords+1, 0, newFunction);
            addedChords++;
        }
        return newFunctions;
    }

    function handleDelaysInBassLine(bassLine, measures) {
        if (bassLine === undefined) {
            return undefined
        }
        var newBassLine = bassLine.slice()
        var addedNotes = 0;

        var i = 0;
        for(var a=0; a<exercise.measures.length; a++){
            for(var b=0; b<exercise.measures[a].length; b++, i++){
                var delays = exercise.measures[a][b].delay;
                if(delays.length === 0) continue;
                var newNote = new Note.Note(bassLine[i].pitch, bassLine[i].baseNote, bassLine[i].chordComponent);
                newBassLine.splice(i+addedNotes+1, 0, newNote);
                addedNotes++;
            }
        }
        return newBassLine;
    }


    this.exercise = exercise;
    this.bassLine = handleDelaysInBassLine(bassLine, exercise.measures);
    this.sopranoLine = sopranoLine;

    this.harmonicFunctions = [];
    for(var i=0; i<exercise.measures.length; i++){
        exercise.measures[i] = getFunctionsWithDelays(exercise.measures[i]);
        this.harmonicFunctions = this.harmonicFunctions.concat(exercise.measures[i]);
    }

    var corrector = new Corrector.ExerciseCorrector(this.exercise, this.harmonicFunctions);
    this.harmonicFunctions = corrector.correctHarmonicFunctions();

    this.chordGenerator = new ChordGenerator.ChordGenerator(this.exercise.key, this.exercise.mode);

    this.solve = function(){
        PreChecker.preCheck(this.harmonicFunctions, this.chordGenerator, this.bassLine, this.sopranoLine)
        var graphBuilder = new Graph.GraphBuilder();
        graphBuilder.withGenerator(this.chordGenerator);
        graphBuilder.withEvaluator(new Checker.ChordRulesChecker(Utils.isDefined(this.bassLine), Utils.isDefined(this.sopranoLine)));
        graphBuilder.withInput(this.harmonicFunctions);
        var graph = graphBuilder.build();
        var dikstra = new Dikstra.Dikstra(graph);
        var sol_nodes = dikstra.getShortestPathToLastNode();

        var sol_chords = []
        for(var i=0; i<sol_nodes.length; i++)
            sol_chords.push(sol_nodes[i].content)

        //dopełenienie pustymi chordami
        var N = sol_chords.length;
        for(var i = 0; i<this.harmonicFunctions.length - N; i++){
            var n = new Note.Note(undefined, undefined, undefined)
            sol_chords.push(new Chord.Chord(n,n,n,n, this.harmonicFunctions[N + i]));
        }

        return new ExerciseSolution.ExerciseSolution(this.exercise, sol_nodes[sol_nodes.length-1].distanceFromBegining, sol_chords);
    }

}