.import "./IntervalUtils.js" as IntervalUtils
.import "./Consts.js" as Consts
.import "./ChordComponentManager.js" as ChordComponentManager

var DEBUG = false;


function ExerciseCorrector(exercise, harmonicFunctions){
    this.exercise = exercise;
    this.harmonicFunctions = harmonicFunctions;
    this.cm = new ChordComponentManager.ChordComponentManager();

    this._handlePentachords = function() {

    };

    this._handleDominantConnections = function() {

    };

    this._makeChordsIncompleteToAvoidConcurrent5 = function(harmonicFunctionChain) {

    };

    this._handleDominantConnectionsWith7InBass = function(dominantHarmonicFunction, tonicHarmonicFunction) {
        if(!dominantHarmonicFunction.isInDominantRelationToDegree(tonicHarmonicFunction.degree) ||
            dominantHarmonicFunction.revolution !== this.cm.chordComponentFromString("7"))
            return;
        var key = tonicHarmonicFunction.key !== undefined ?
            tonicHarmonicFunction.key : this.exercise.key;
        if(tonicHarmonicFunction.revolution === this.cm.chordComponentFromString("1")) {
            tonicHarmonicFunction.revolution =
                IntervalUtils.getThirdMode(key, tonicHarmonicFunction.degree-1) === Consts.MODE.MAJOR ?
                    this.cm.chordComponentFromString("3") : this.cm.chordComponentFromString("3>");
        }
    };

    this.correctHarmonicFunctions = function() {
        var resultHarmonicFunctions = this.harmonicFunctions
        for(var i=0; i<resultHarmonicFunctions.length;i++){
            if(i < resultHarmonicFunctions.length-1)
                this._handleDominantConnectionsWith7InBass(resultHarmonicFunctions[i], resultHarmonicFunctions[i+1]);
        }
        return resultHarmonicFunctions;
    };
}