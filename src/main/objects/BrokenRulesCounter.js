


function BrokenRulesCounter(rulesList, rulesDetails) {
    this.rulesList = rulesList
    this.rulesDetails = rulesDetails
    this.allConnections = 0

    for (var i = 0; i < this.rulesList.length; i++) {
        this[this.rulesList[i]] = 0
    }

    this.increaseCounter = function(ruleName) {
        this[ruleName] += 1
    }

    this.getBrokenRulesStringInfo = function() {
        var ret = ""

        for (var i = 0; i < this.rulesList.length; i++) {
            if (this[this.rulesList[i]] !== 0) {
                ret += this.rulesDetails[i] + ": " + (this[this.rulesList[i]]/this.allConnections).toFixed(2) + "\n"
            }
        }
        return ret
    }
}
