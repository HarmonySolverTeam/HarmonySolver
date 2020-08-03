.import "./Note.js" as Note
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./ExerciseSolution.js" as ExerciseSolution
.import "./Consts.js" as Consts
.import "./Chord.js" as Chord
.import "./ChordGenerator.js" as ChordGenerator
.import "./RulesChecker.js" as Checker

var DEBUG = false;

function Solver(exercise, bassLine, sopranoLine){

    function getFunctionsWithDelays(functions){
        var newFunctions = functions.slice();
        var addedChords = 0;
        for(var i=0; i<functions.length; i++){
            var delays = functions[i].delay;
            if(delays.length === 0) continue;
            var newFunction = new HarmonicFunction.HarmonicFunction(
                functions[i].functionName,
                functions[i].degree,
                functions[i].position,
                functions[i].revolution,
                [],
                functions[i].extra.slice(),
                functions[i].omit.slice(),
                functions[i].down,
                functions[i].system,
                functions[i].mode
            );
            for(var j=0; j<delays.length; j++){
                functions[i].extra.push(delays[j][0]);
                functions[i].omit.push(delays[j][1]);
                if(delays[j][1] === functions[i].position.toString()) functions[i].position = delays[j][0];
                if(delays[j][1] === functions[i].revolution) functions[i].revolution = delays[j][0];
            }
            newFunctions.splice(i+addedChords+1, 0, newFunction);
            addedChords++;
        }
        return newFunctions;
    }
    this.exercise = exercise;
    this.bassLine = bassLine;
    this.sopranoLine = sopranoLine;
    this.harmonicFunctions = [];
    for(var i=0; i<exercise.measures.length; i++){
        exercise.measures[i] = getFunctionsWithDelays(exercise.measures[i]);
        this.harmonicFunctions = this.harmonicFunctions.concat(exercise.measures[i]);
    }
    this.chordGenerator = new ChordGenerator.ChordGenerator(this.exercise.key, this.exercise.mode);

    this.solve = function(){
        var sol_chords =  this.findSolution(0, undefined, undefined);
        //dopełenienie pustymi chordami
        var N = sol_chords.length;
        for(var i=0; i<this.harmonicFunctions.length - N; i++){
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
        
        if(DEBUG){
            var log = "";
            for(var x=0;x<curr_index;x++) log += "   "
            if(curr_index < 6) console.log(log + curr_index)
        }

        for (var j = 0; j < chords.length; j++){
            // console.log(chords[j].toString())
            var score = Checker.checkAllRules(prev_prev_chord, prev_chord, chords[j])

            if (score !== -1 ) {
                console.log("OK!");
                console.log( curr_index + " -> " + chords[j]);
                good_chords.push([score,chords[j]]);
            }
        }

        if (good_chords.length === 0){
            return [];
        }

        good_chords.sort(function(a,b){(a[0] > b[0]) ? 1 : -1})

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