.import "./Note.js" as Note
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./ExerciseSolution.js" as ExerciseSolution
.import "./Consts.js" as Consts
.import "./Chord.js" as Chord
.import "./ChordGenerator.js" as ChordGenerator
.import "./RulesChecker.js" as Checker

function Solver(exercise){
    this.exercise = exercise
    this.harmonicFunctions = exercise.measures[0];
    for(var i=1; i<exercise.measures.length; i++){
        this.harmonicFunctions = this.harmonicFunctions.concat(exercise.measures[i]);
    }
    this.chordGenerator = new ChordGenerator.ChordGenerator(this.exercise.key);

    this.solve = function(){
        var sol_chords =  this.findSolution(0, undefined, undefined);
        return new ExerciseSolution.ExerciseSolution(this.exercise, -12321, sol_chords);
    }

    this.findSolution = function(curr_index, prev_prev_chord, prev_chord){
        var chords = this.chordGenerator.generate(this.harmonicFunctions[curr_index])
        var good_chords = []

        for (var j = 0; j < chords.length; j++){
            console.log(chords[j].toString())
            var score = Checker.checkAllRules(prev_prev_chord, prev_chord, chords[j])

            if (score !== -1 ) good_chords.push([score,chords[j]]);
        }

        if (good_chords.length === 0){
            return [];
        }

        good_chords.sort(function(a,b){(a[0] > b[0]) ? 1 : -1})

        if (curr_index+1 === this.harmonicFunctions.length){
            //console.log(good_chords[0][1])
            return [good_chords[0][1]];
        }

        for (var i = 0; i< good_chords.length; i++){

            var next_chords = this.findSolution( curr_index + 1, prev_chord, good_chords[i][1])

            if (next_chords.length !== 0){
                next_chords.unshift(good_chords[i][1])
                return next_chords
            }

        }

        return []
    }
}