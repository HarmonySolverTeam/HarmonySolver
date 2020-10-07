.import "./IntervalUtils.js" as IntervalUtils
.import "./Consts.js" as Consts
.import "./ChordComponentManager.js" as ChordComponentManager

var DEBUG = false;


function ExerciseCorrector(exercise, harmonicFunctions){
    this.exercise = exercise;
    this.harmonicFunctions = harmonicFunctions;

    this._handleDominantConnections = function() {

    };

    this._makeChordsIncompleteToAvoidConcurrent5 = function(harmonicFunctionChain) {

    };

    this._handleDominantConnectionsWith7InBass = function(dominantHarmonicFunction, tonicHarmonicFunction) {
        if(dominantHarmonicFunction.isInDominantRelationToDegree(tonicHarmonicFunction.degree) &&
            dominantHarmonicFunction.revolution.chordComponentString === "7" &&
            tonicHarmonicFunction.revolution.chordComponentString === "1") {
            var key = tonicHarmonicFunction.key !== undefined ?
                tonicHarmonicFunction.key : this.exercise.key;
            var cm = tonicHarmonicFunction.cm;
            tonicHarmonicFunction.revolution =
                IntervalUtils.getThirdMode(key, tonicHarmonicFunction.degree-1) === Consts.MODE.MAJOR ?
                    cm.chordComponentFromString("3") : cm.chordComponentFromString("3>");
        }
        return tonicHarmonicFunction;
    };

    this.correctHarmonicFunctions = function() {
        var givenHarmonicFunctions = this.harmonicFunctions;
        var resultHarmonicFunctions = this.harmonicFunctions.length > 0 ? [this.harmonicFunctions[0]] : [];
        for(var i=0; i<givenHarmonicFunctions.length;i++){
            if(i < givenHarmonicFunctions.length-1)
                resultHarmonicFunctions.push(this._handleDominantConnectionsWith7InBass(givenHarmonicFunctions[i], givenHarmonicFunctions[i+1]));
        }
        return resultHarmonicFunctions;
    };
}