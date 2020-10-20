.import "./Consts.js" as Consts
.import "./RulesCheckerUtils.js" as RulesCheckerUtils
.import "./Utils.js" as Utils
.import "./IntervalUtils.js" as IntervalUtils

function SopranoRulesChecker(){
    RulesCheckerUtils.Evaluator.call(this, 2);

    this.hardRules = [new ForbiddenDSConnectionRule(), new ChangeFunctionAtMeasureBeginningRule()];
    this.softRules = [new DominantRelationRule(), new ChangeFunctionConnectionRule(), new JumpRule(), new SecondRelationRule(), new ChangeFunctionOnDownBeatRule()];
}

function HarmonicFunctionWithSopranoInfo(harmonicFunction, measurePlace, sopranoNote){
    this.harmonicFunction = harmonicFunction; // HarmonicFunction
    this.measurePlace = measurePlace; // Consts.MEASURE_PLACE enum
    this.sopranoNote = sopranoNote; // Note
}

function SpecialConnectionRule(punishment, prevFunctionName, currentFunctionName){
    RulesCheckerUtils.IRule.call(this);
    this.currentFunctionName = currentFunctionName;
    this.prevFunctionName = prevFunctionName;
    this.evaluate = function(connection){
        if(connection.current.harmonicFunction.functionName === this.currentFunctionName &&
            connection.prev.harmonicFunction.functionName === this.prevFunctionName){
                return punishment;
        }
        return 0;
    }
}

function DSConnectionRule(){
    SpecialConnectionRule.call(this, 10, Consts.FUNCTION_NAMES.DOMINANT, Consts.FUNCTION_NAMES.SUBDOMINANT);
}

function STConnectionRule(){
    SpecialConnectionRule.call(this, 10, Consts.FUNCTION_NAMES.SUBDOMINANT, Consts.FUNCTION_NAMES.TONIC);
}

function TDConnectionRule(){
    SpecialConnectionRule.call(this, 10, Consts.FUNCTION_NAMES.TONIC, Consts.FUNCTION_NAMES.DOMINANT);
}

function ChangeFunctionConnectionRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection){
        var stRule = new STConnectionRule();
        var tdRule = new TDConnectionRule();
        var dsRule = new DSConnectionRule();
        return stRule.evaluate(connection) + tdRule.evaluate(connection) + dsRule.evaluate(connection);
    }
}

function ForbiddenDSConnectionRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection) {
        var dsRule = new DSConnectionRule();
        if(dsRule.evaluate(connection) !== 0 && connection.prev.harmonicFunction.mode === Consts.MODE.MAJOR){
            return -1;
        }
        return 0;
    }
}

function DominantRelationRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection){
        if(connection.prev.harmonicFunction.isInDominantRelation(connection.current.harmonicFunction))
            return 0;
        return 2;
    }
}

function SecondRelationRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection){
        if(connection.prev.harmonicFunction.isInSecondRelation(connection.current.harmonicFunction))
            return 0;
        return 1;
    }
}

function NotChangeFunctionRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection){
        if(connection.current.harmonicFunction.functionName === connection.prev.harmonicFunction.functionName)
            return 0;
        return -1;
    }
}

function ChangeFunctionAtMeasureBeginningRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection){
        var notChangeFunctionRule = new NotChangeFunctionRule();
        if(notChangeFunctionRule.evaluate(connection) === 0 && connection.current.measurePlace === Consts.MEASURE_PLACE.BEGINNING)
            return -1;
        return 0;
    }
}

function JumpRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection){
        var sameFunctionRule = new NotChangeFunctionRule();
        var ruleIsFulfilled = sameFunctionRule.evaluate(connection) === 0;
        if(IntervalUtils.pitchOffsetBetween(connection.current.sopranoNote, connection.prev.sopranoNote) > 2){
             return ruleIsFulfilled ? 0 : 5;
        }
        return ruleIsFulfilled ? 5 : 0;
    }
}

function ChangeFunctionOnDownBeatRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection){
        var sameFunctionRule = new NotChangeFunctionRule();
        var ruleIsFulfilled = sameFunctionRule.evaluate(connection) === 0;
        if(!ruleIsFulfilled && connection.current.measurePlace === Consts.MEASURE_PLACE.UPBEAT){
            return 10;
        }
        return 0;
    }
}