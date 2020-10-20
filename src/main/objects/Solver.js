.import "./Note.js" as Note
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./ExerciseSolution.js" as ExerciseSolution
.import "./Consts.js" as Consts
.import "./Chord.js" as Chord
.import "./ChordGenerator.js" as ChordGenerator
.import "./RulesChecker.js" as Checker
.import "./Utils.js" as Utils
.import "./ExerciseCorrector.js" as Corrector
.import "./PreChecker.js" as PreChecker

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
                if(parseInt(delays[j][1].baseComponent)>=8 && !Utils.containsChordComponent(newFunction.extra, delays[j][1].chordComponentString)
                    && delays[j][1].baseComponent !== "8") newFunction.extra.push(delays[j][1]);

                if (delays[j][0].baseComponent !== "8") {
                    functions[i].extra.push(delays[j][0]);
                }
                if (delays[j][1].baseComponent !== "8") {
                    functions[i].omit.push(delays[j][1]);
                }

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
    Utils.log("exercise before handleDelaysInBassLine", JSON.stringify(exercise))

    this.bassLine = handleDelaysInBassLine(bassLine, exercise.measures);

    Utils.log("exercise after handleDelaysInBassLine", JSON.stringify(exercise))

    this.sopranoLine = sopranoLine;

    this.harmonicFunctions = [];
    for(var i=0; i<exercise.measures.length; i++){
        exercise.measures[i] = getFunctionsWithDelays(exercise.measures[i]);

        this.harmonicFunctions = this.harmonicFunctions.concat(exercise.measures[i]);
    }

    var corrector = new Corrector.ExerciseCorrector(this.exercise, this.harmonicFunctions);
    this.harmonicFunctions = corrector.correctHarmonicFunctions();
    Utils.log("exercise after correctHarmonicFunctions", JSON.stringify(this.harmonicFunctions))

    this.chordGenerator = new ChordGenerator.ChordGenerator(this.exercise.key, this.exercise.mode);

    this.solve = function(){
        PreChecker.preCheck(this.harmonicFunctions, this.chordGenerator, this.bassLine, this.sopranoLine)
        var sol_chords =  this.findSolution(0, undefined, undefined);
        //dopełenienie pustymi chordami
        var N = sol_chords.length;
        for(var i = 0; i<this.harmonicFunctions.length - N; i++){
            var n = new Note.Note(undefined, undefined, undefined)
            sol_chords.push(new Chord.Chord(n,n,n,n, this.harmonicFunctions[N + i]));
        }

        return new ExerciseSolution.ExerciseSolution(this.exercise, -12321, sol_chords);
    }

    this.findSolution = function(curr_index, prev_prev_chord, prev_chord){
        var chords;
        if(this.bassLine !== undefined) chords = this.chordGenerator.generate(this.harmonicFunctions[curr_index], [this.bassLine[curr_index], undefined, undefined, undefined])
        else if (this.sopranoLine !== undefined) chords = this.chordGenerator.generate(this.harmonicFunctions[curr_index], [undefined, undefined, undefined, this.sopranoLine[curr_index]])
        else chords = this.chordGenerator.generate(this.harmonicFunctions[curr_index])
        var good_chords = []
        
        /* if(DEBUG){
            var log = "";
            for(var x = 0; x<curr_index; x++) log += "   "
            if(curr_index < 6) Utils.log("Log", log + curr_index)
        } */

        if (DEBUG) Utils.log("Finding solution for chord " + curr_index)

        for (var j = 0; j < chords.length; j++){
            // console.log(chords[j].toString())
            var score = Checker.checkAllRules(prev_prev_chord, prev_chord, chords[j],
                this.bassLine !== undefined, this.sopranoLine !== undefined)

            if (score !== -1 ) {

              /*  if(DEBUG) {
                    console.log("OK!");
                    console.log(curr_index + " -> " + chords[j]);
                } */

                good_chords.push([score,chords[j]]);
            }
        }

        if (good_chords.length === 0){
            return [];
        }

        good_chords.sort(function(a,b){ return (a[0] > b[0]) ? 1 : -1})

        if (curr_index+1 === this.harmonicFunctions.length){
            //console.log(good_chords[0][1])
            return [good_chords[0][1]];
        }

        var longest_next_chords = []
        for (var i = 0; i< good_chords.length; i++){

            var next_chords = this.findSolution( curr_index + 1, prev_chord, good_chords[i][1])

            if (next_chords.length === this.harmonicFunctions.length - curr_index - 1 && next_chords[next_chords.length -1].sopranoNote.pitch !== undefined){
                next_chords.unshift(good_chords[i][1])
                return next_chords
            }
            //just to get partial solution in case of critical error (-1)
            else{
                if(next_chords.length + 1 > longest_next_chords.length){
                    next_chords.unshift(good_chords[i][1]);
                    longest_next_chords = next_chords;
                }
            }

        }
    
        return longest_next_chords
    }
}