.import "./Utils.js" as Utils
.import "./Consts.js" as Consts
.import "./BrokenRulesCounter.js" as BrokenRulesCounter

function Connection(current, prev, prevPrev){
    var undefinedNodeContents = ["first", "last"];

    this.current = Utils.contains(undefinedNodeContents, current) ? undefined : current;
    this.prev = Utils.contains(undefinedNodeContents, prev) ? undefined : prev;
    this.prevPrev = Utils.contains(undefinedNodeContents, prevPrev) ? undefined : prevPrev;
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
    this.initializeBrokenRulesCounter = function(){
        var rulesList = [];
        var rulesDetails = [];
        for(var i = 0; i < this.softRules.length; i++){
            rulesList.push(this.softRules[i].name)
            rulesDetails.push(this.softRules[i].details)
        }
        for(var i = 0; i < this.hardRules.length; i++){
            rulesList.push(this.hardRules[i].name)
            rulesDetails.push(this.hardRules[i].details)
        }
        this.brokenRulesCounter = new BrokenRulesCounter.BrokenRulesCounter(rulesList, rulesDetails)
    }
    this.evaluateAllRulesWithCounter = function(connection){
        if(this.brokenRulesCounter === undefined)
            return
        var result = 0;
        var oneRuleBroken = false;
        for(var i = 0; i < this.softRules.length; i++){
            var currentEvaluation = this.softRules[i].evaluate(connection)
            if(currentEvaluation !== 0) {
                this.brokenRulesCounter.increaseCounter(this.softRules[i].name)
            } else {
                result += currentEvaluation
            }
        }
        for(var i = 0; i < this.hardRules.length; i++){
            if(this.hardRules[i].isBroken(connection)) {
                this.brokenRulesCounter.increaseCounter(this.hardRules[i].name)
                oneRuleBroken = true;
            }
        }
        return oneRuleBroken ? -1 : result
    }
    this.getBrokenRulesCounter = function(){
        return this.brokenRulesCounter;
    }
}

function IRule(details){
    this.evaluate = function(connection){
        throw new Error("IRule default evaluate method was called");
    };

    this.name = this.constructor.name;
    this.details = details;

    this.isBroken = function(connection){
        var evaluationResult = this.evaluate(connection);
        return evaluationResult !== 0 && evaluationResult !== true;
    };

    this.isNotBroken = function(connection){
        return !this.isBroken(connection);
    }
}