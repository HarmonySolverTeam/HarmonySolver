.import "./Consts.js" as Consts


function Connection(currentHF, prevHF, prevPrevHF){
    this.currentHF = currentHF;
    this.prevHF = prevHF;
    this.prevPrevHF = prevPrevHF;
}

var RuleExecutionStatus = {
  SUCCESS: 0,
  WARN: 1,
  ERROR: 2
};

function RuleExecutionReport(status, rating){
    this.status = status;
    this.rating = rating;

    this.mergeWith = function(other){
        var resultRating = this.rating + other.rating;
        var resultStatus = RuleExecutionStatus.SUCCESS;
        if(this.status === RuleExecutionStatus.ERROR || other.status === RuleExecutionStatus.ERROR){
            resultStatus = RuleExecutionStatus.ERROR;
        }
        if(this.status === RuleExecutionStatus.WARN || other.status === RuleExecutionStatus.WARN){
            resultStatus = RuleExecutionStatus.WARN;
        }
        return new RuleExecutionReport(resultStatus, resultRating);
    }
}


function SopranoRulesChecker(){
    this.rules = [];
    this.applyConnection = function(connection){
        var report;
        for(var i=0; i<this.rules.length; i++){
            report = report.mergeWith(this.rules[i].evaluate());
            if(report.status === RuleExecutionStatus.ERROR)
                throw new Error("Error occurred during executing rules.");
        }

        return report;
    }
}

function IRuleComponent(connection){
    this.subRules = [];
    this.connection = connection;

    this.evaluate = function(){

    }

    this.and = function(other){
        this.evaluate().mergeWith(other.evaluate());
    }

    this.or = function(other){
        var thisReport = this.evaluate();
        if(thisReport.status !== RuleExecutionStatus.ERROR){
            return thisReport;
        } else {
            var otherReport = other.evaluate();
            if(otherReport.status !== RuleExecutionStatus.ERROR){
                return otherReport;
            }
            return thisReport.mergeWith(otherReport);
        }
    }
}

function SDConnectionRule(connection){
    IRuleComponent.call(connection);
    this.evaluate = function(){
        if(connection.currentHF.functionName === Consts.FUNCTION_NAMES.SUBDOMINANT &&
            connection.prevHF.functionName === Consts.FUNCTION_NAMES.DOMINANT &&
            connection.prevHF.mode === Consts.MODE.MAJOR){
            return new RuleExecutionReport(RuleExecutionStatus.ERROR, 10000);
        }
        return new RuleExecutionReport(RuleExecutionStatus.SUCCESS, 0);
    }
}

function SDTConnectionRule(connection) {
    IRuleComponent.call(connection);
    this.evaluate = function () {
        if (connection.currentHF.functionName === Consts.FUNCTION_NAMES.TONIC &&
            connection.prevHF.functionName === Consts.FUNCTION_NAMES.DOMINANT &&
            connection.prevPrevHF.functionName === Consts.FUNCTION_NAMES.SUBDOMINANT) {
            return new RuleExecutionReport(RuleExecutionStatus.SUCCESS, 0);
        }
        return new RuleExecutionReport(RuleExecutionStatus.SUCCESS, 10);
    }
}