.import "./Utils.js" as Utils
.import "./Consts.js" as Consts

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