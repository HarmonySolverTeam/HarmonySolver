.import "./Utils.js" as Utils
.import "./Consts.js" as Consts

function Connection(current, prev, prevPrev){
    this.current = current;
    this.prev = prev;
    this.prevPrev = prevPrev;
}

function Evaluator(connectionSize){
    this.connectionSize = connectionSize;
    this.softRules = [];
    this.hardRules = [];
    this.evaluateHardRules = function(connection){
        for(var i = 0; i < this.hardRules.length; i++){
            if(this.hardRules[i].evaluate(connection) !== 0)
                return false;
        }
        return true;
    }
    this.evaluateSoftRules = function(connection){
        var result = 0;
        for(var i = 0; i < this.softRules.length; i++){
            result += this.softRules[i].evaluate(connection);
        }
        return result;
    }
}

function IRule(){
    this.evaluate = function(connection){
        throw new Error("IRule default evaluate method was called");
    };

    this.isBroken = function(connection){
        var evaluationResult = this.evaluate(connection);
        return evaluationResult !== 0 && evaluationResult !== true;
    };

    this.isNotBroken = function(connection){
        return !this.isBroken(connection);
    }
}

function getHarmonicFunctionsWithDeflectionTranslation(currentChord, prevChord){
    var currentChordFunctionTemp = currentChord.harmonicFunction.copy();
    currentChordFunctionTemp.key = currentChord.harmonicFunction.key;
    var prevChordFunctionTemp = prevChord.harmonicFunction.copy();
    prevChordFunctionTemp.key = prevChord.harmonicFunction.key;
    if(prevChord.harmonicFunction.key !== currentChord.harmonicFunction.key){
        if(Utils.isDefined(prevChord.harmonicFunction.key) && !prevChord.harmonicFunction.isRelatedBackwards) {
            currentChordFunctionTemp.functionName = Consts.FUNCTION_NAMES.TONIC;
            currentChordFunctionTemp.degree = 1;
        }
        else if(currentChord.harmonicFunction.isRelatedBackwards){
            prevChordFunctionTemp.functionName = Consts.FUNCTION_NAMES.TONIC;
            prevChordFunctionTemp.degree = 1;
        } else return undefined //checkIllegalDoubled3(currentChord)? -1 : 0;
    }

    return [currentChordFunctionTemp, prevChordFunctionTemp]
}