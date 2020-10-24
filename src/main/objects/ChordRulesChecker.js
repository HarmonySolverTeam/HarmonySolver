.import "./Utils.js" as Utils
.import "./Errors.js" as Errors
.import "./Consts.js" as Consts
.import "./IntervalUtils.js" as IntervalUtils
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./RulesCheckerUtils.js" as RulesCheckerUtils

var DEBUG = false;

function ChordRulesChecker(){
    RulesCheckerUtils.Evaluator.call(this, 3);
    this.hardRules = [
        new ConcurrentOctavesRule(), new ConcurrentFifthsRule(), new CrossingVoicesRule(),
        new OneDirectionRule(), new ForbiddenJumpRule(), new ForbiddenSumJumpRule(),
        new CheckDelayCorrectnessRule(), new HiddenOctavesRule(), new FalseRelationRule(),
        new DominantRelationCheckConnectionRule(), new DominantSecondRelationCheckConnectionRule(),
        new DominantSubdominantCheckConnectionRule(), new SubdominantDominantCheckConnectionRule(),
        new SameFunctionCheckConnectionRule(), new SubdominantDominantCheckConnectionRule(),
        new IllegalDoubledThirdRule()
    ];
    this.softRules = [];
}

// I know that's bad as hell, but it was the easiest way :P
var fixedBass = false;
var fixedSoprano = false;

function skipCheckingVoiceIncorrectJump(voiceNumber) {
    return (voiceNumber === 0 && fixedBass)
        || (voiceNumber === 3 && fixedSoprano)
}

/*
        RULES
 */

function SameFunctionRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection){
        if(connection.prev.harmonicFunction.equals(connection.current.harmonicFunction))
            return 0;
        return -1;
    }
}

function SpecificFunctionConnectionRule(prevFunctionName, currentFunctionName){
    RulesCheckerUtils.IRule.call(this);
    this.currentFunctionName = currentFunctionName;
    this.prevFunctionName = prevFunctionName;
    this.evaluate = function(connection){
        if(connection.prev.harmonicFunction.functionName === this.prevFunctionName &&
            connection.current.harmonicFunction.functionName === this.currentFunctionName)
            return 0;
        return -1;
    }
}

function ConcurrentOctavesRule(){
    RulesCheckerUtils.IRule.call(this);

    this.evaluate = function(connection){
        var sfRule = new SameFunctionRule();
        if(sfRule.isNotBroken(connection)) return 0;
        for(var i = 0; i < 3; i++){
            for(var j = i + 1; j < 4; j++){
                if(IntervalUtils.isOctaveOrPrime(connection.current.notes[j],connection.current.notes[i]) &&
                    IntervalUtils.isOctaveOrPrime(connection.prev.notes[j],connection.prev.notes[i])){
                    if(DEBUG) Utils.log("concurrentOctaves "+i+" "+j, connection.prev + " -> " + connection.current );
                    return -1;
                }
            }
        }
        return 0;
    }
}

function ConcurrentFifthsRule(){
    RulesCheckerUtils.IRule.call(this);

    this.evaluate = function(connection) {
        var sfRule = new SameFunctionRule();
        if (sfRule.isNotBroken(connection)) return 0;
        for (var i = 0; i < 3; i++) {
            for (var j = i + 1; j < 4; j++) {
                if (IntervalUtils.isFive(connection.current.notes[j], connection.current.notes[i]) &&
                    IntervalUtils.isFive(connection.prev.notes[j], connection.prev.notes[i])) {
                    if (DEBUG) Utils.log("concurrentFifths " + i + " " + j, connection.prev + " -> " + connection.current);
                    return -1;
                }
            }
        }
        return 0;
    }
}

function CrossingVoicesRule(){
    RulesCheckerUtils.IRule.call(this);

    this.evaluate = function(connection) {
        for(var i = 0; i < 3; i++){
            if(connection.current.notes[i].isUpperThan(connection.prev.notes[i+1])){
                if(DEBUG) Utils.log("crossingVoices", connection.prev + " -> " + connection.current);
                return -1
            }
        }
        for(var i = 3; i > 0; i--){
            if(connection.current.notes[i].isLowerThan(connection.prev.notes[i-1])){
                if(DEBUG) Utils.log("crossingVoices", connection.prev + " -> " + connection.current);
                return -1
            }
        }
        return 0;
    }
}

function OneDirectionRule(){
    RulesCheckerUtils.IRule.call(this);

    this.evaluate = function(connection) {
        if ((connection.current.bassNote.isUpperThan(connection.prev.bassNote) && connection.current.tenorNote.isUpperThan(connection.prev.tenorNote)
            && connection.current.altoNote.isUpperThan(connection.prev.altoNote) && connection.current.sopranoNote.isUpperThan(connection.prev.sopranoNote))
            || (connection.current.bassNote.isLowerThan(connection.prev.bassNote) && connection.current.tenorNote.isLowerThan(connection.prev.tenorNote)
                && connection.current.altoNote.isLowerThan(connection.prev.altoNote) && connection.current.sopranoNote.isLowerThan(connection.prev.sopranoNote))) {
            if (DEBUG) Utils.log("oneDirection", connection.prev + " -> " + connection.current);
            return -1;
        }

        return 0;
    }
}

function IllegalDoubledThirdRule(){
    RulesCheckerUtils.IRule.call(this);
    this.evaluate = function(connection) {
        var currentChord = connection.current;
        var prevChord = connection.prev;
        var specificConnectionRule = new SpecificFunctionConnectionRule(Consts.FUNCTION_NAMES.DOMINANT, Consts.FUNCTION_NAMES.TONIC);
        if ((specificConnectionRule.isNotBroken(connection) ||
            Utils.containsBaseChordComponent(prevChord.harmonicFunction.extra, "7")) &&
            prevChord.harmonicFunction.isInDominantRelation(currentChord.harmonicFunction))
            return 0;
        if(specificConnectionRule.isNotBroken(connection) && prevChord.harmonicFunction.isInDominantRelation(currentChord.harmonicFunction))
            return 0;

        return this.hasIllegalDoubled3Rule(currentChord)? -1 : 0
    };

    this.hasIllegalDoubled3Rule = function(chord){
        var terCounter = chord.countBaseComponents("3");

        if(chord.harmonicFunction.isNeapolitan())
            return terCounter !== 2;
        return terCounter > 1
    }
}

function ForbiddenJumpRule(notNeighbourChords){
    RulesCheckerUtils.IRule.call(this);
    this.notNeighbourChords = notNeighbourChords;

    this.evaluate = function(connection) {
        // if(!notNeighbourChords && prevChord.harmonicFunction.equals(currentChord.harmonicFunction)) return 0;

        for (var i = 0; i < 4; i++) {
            //TODO upewnić się jak ze skokami jest naprawdę, basu chyba ta zasada się nie tyczy
            if (IntervalUtils.pitchOffsetBetween(connection.current.notes[i], connection.prev.notes[i]) > 9 && !(this.notNeighbourChords && i === 0)
                && !skipCheckingVoiceIncorrectJump(i)) {
                if (DEBUG) Utils.log("Forbidden jump in voice " + i, connection.prev + "->" + connection.current);
                return -1;
            }
            if (IntervalUtils.isAlteredInterval(connection.prev.notes[i], connection.current.notes[i])) {
                if (DEBUG) Utils.log("Altered Interval in voice " + i, connection.prev + "->" + connection.current);
                return -1;
            }
        }
        return 0;
    }
}

function ForbiddenSumJumpRule(){
    RulesCheckerUtils.IRule.call(this);

    this.evaluate = function(connection) {
        var sfRule = new SameFunctionRule();
        if (sfRule.isNotBroken(new RulesCheckerUtils.Connection(connection.prevPrev, connection.prev)) &&
            sfRule.isNotBroken(new RulesCheckerUtils.Connection(connection.prev, connection.current))) return 0;
        var forbiddenJumpRule = new ForbiddenJumpRule();
        for (var i = 0; i < 4; i++) {
            if (((connection.prevPrev.notes[i].isUpperThan(connection.prev.notes[i]) && connection.prev.notes[i].isUpperThan(connection.current.notes[i])) ||
                (connection.prevPrev.notes[i].isLowerThan(connection.prev.notes[i]) && connection.prev.notes[i].isLowerThan(connection.current.notes[i])))
                && forbiddenJumpRule.isBroken(new RulesCheckerUtils.Connection(connection.prevPrev, connection.current), true)) {
                if (DEBUG) {
                    Utils.log("forbiddenSumJump in voice " + i, connection.prevPrev + " -> " + connection.prev + " -> " + connection.current);
                }
                return -1;
            }
        }
        return 0;
    }
}

function CheckDelayCorrectnessRule(){
    RulesCheckerUtils.IRule.call(this);

    this.evaluate = function(connection) {
        var delay = connection.prev.harmonicFunction.delay;
        if (delay.length === 0) return 0;
        var delayedVoices = [];
        for (var i = 0; i < delay.length; i++) {
            var prevComponent = delay[i][0];
            var currentComponent = delay[i][1];
            for (var j = 0; j < 4; j++) {
                if (connection.prev.notes[j].chordComponentEquals(prevComponent.chordComponentString)) {
                    if (!connection.current.notes[j].chordComponentEquals(currentComponent.chordComponentString)) {
                        if (DEBUG) Utils.log("delay error" + i + " " + j, connection.prev + " -> " + connection.current);
                        return -1;
                    } else delayedVoices.push(j);
                }
            }
        }
        for (var i = 0; i < 4; i++) {
            if (Utils.contains(delayedVoices, i)) continue;
            if (!connection.prev.notes[i].equalPitches(connection.current.notes[i]) && i !== 0) {
                if (DEBUG) Utils.log("delay error" + i + " " + j, connection.prev + " -> " + connection.current);
                return -1;
            }
        }
        return 0;
    }
}

function HiddenOctavesRule(){
    RulesCheckerUtils.IRule.call(this);

    this.evaluate = function(connection) {
        var sameDirection = (connection.prev.bassNote.isLowerThan(connection.current.bassNote) && connection.prev.sopranoNote.isLowerThan(connection.current.sopranoNote) ||
            (connection.prev.bassNote.isUpperThan(connection.current.bassNote) && connection.prev.sopranoNote.isUpperThan(connection.current.sopranoNote)));
        if (sameDirection && Utils.abs(connection.prev.sopranoNote.pitch - connection.current.sopranoNote.pitch) > 2 &&
            IntervalUtils.isOctaveOrPrime(connection.current.bassNote, connection.current.sopranoNote)) {
            if (DEBUG) Utils.log("hiddenOctaves", connection.prev + " -> " + connection.current);
            return -1;
        }
        return 0;
    }
}

function FalseRelationRule(){
    RulesCheckerUtils.IRule.call(this);

    this.evaluate = function(connection) {
        for (var i = 0; i < 4; i++) {
            if (IntervalUtils.isChromaticAlteration(connection.prev.notes[i], connection.current.notes[i])) {
                return 0;
            }
        }

        for (var i = 0; i < 4; i++) {
            for (var j = i + 1; j < 4; j++) {
                if (IntervalUtils.isChromaticAlteration(connection.prev.notes[i], connection.current.notes[j])) {
                    if (DEBUG) Utils.log("false relation between voices " + i + " " + j, connection.prev + "->" + connection.current);
                    return -1;
                }
                if (IntervalUtils.isChromaticAlteration(connection.prev.notes[j], connection.current.notes[i])) {
                    if (DEBUG) Utils.log("false relation between voices " + i + " " + j, connection.prev + "->" + connection.current);
                    return -1;
                }
            }
        }
        return 0;
    }
}

function ICheckConnectionRule(){

    RulesCheckerUtils.IRule.call(this);

    this.evaluate = function(connection) {
        var translatedConnection = this.translateConnectionIncludingDeflections(connection);
        if(!Utils.isDefined(translatedConnection))
            return 0;
        return this.evaluateIncludingDeflections(connection);
    };

    this.translateConnectionIncludingDeflections = function(connection){
        var currentChord = connection.current;
        var prevChord = connection.prev;
        var currentFunctionTranslated = currentChord.harmonicFunction.copy();
        currentFunctionTranslated.key = currentChord.harmonicFunction.key;
        var prevFunctionTranslated = prevChord.harmonicFunction.copy();
        prevFunctionTranslated.key = prevChord.harmonicFunction.key;
        if(prevChord.harmonicFunction.key !== currentChord.harmonicFunction.key){
            if(Utils.isDefined(prevChord.harmonicFunction.key) && !prevChord.harmonicFunction.isRelatedBackwards) {
                currentFunctionTranslated.functionName = Consts.FUNCTION_NAMES.TONIC;
                currentFunctionTranslated.degree = 1;
            } else if(currentChord.harmonicFunction.isRelatedBackwards){
                prevFunctionTranslated.functionName = Consts.FUNCTION_NAMES.TONIC;
                prevFunctionTranslated.degree = 1;
            } else
                return undefined
        }
        connection.current.harmonicFunction = currentFunctionTranslated;
        connection.prev.harmonicFunction = prevFunctionTranslated;

        return connection
    };

    this.evaluateIncludingDeflections = function(connection){
        return new Error("ICheckConnectionRule default method was called")
    };

    //returns voice number with given base component, otherwise returns -1
    this.voiceWithBaseComponent = function(chord, baseComponent){
        var voiceWithGivenComponent = -1;
        for (var i = 0; i < 4; i++) {
            if (chord.notes[i].baseChordComponentEquals(baseComponent)) {
                voiceWithGivenComponent = i;
                break;
            }
        }
        return voiceWithGivenComponent;
    };

    //returns voice number with given chord component, otherwise returns -1
    this.voiceWithComponent = function(chord, chordComponent){
        var voiceWithGivenComponent = -1;
        for (var i = 0; i < 4; i++) {
            if (chord.notes[i].chordComponentEquals(chordComponent)) {
                voiceWithGivenComponent = i;
                break;
            }
        }
        return voiceWithGivenComponent;
    };

}

function DominantRelationCheckConnectionRule(){

    ICheckConnectionRule.call(this);

    this.evaluateIncludingDeflections = function(connection) {
        var currentChord = connection.current;
        var prevChord = connection.prev;
        var specificConnectionRule = new SpecificFunctionConnectionRule(Consts.FUNCTION_NAMES.DOMINANT, Consts.FUNCTION_NAMES.TONIC);
        if (specificConnectionRule.isNotBroken(connection) ||
            Utils.containsBaseChordComponent(prevChord.harmonicFunction.extra, "7") &&
            prevChord.harmonicFunction.isInDominantRelation(currentChord.harmonicFunction)){
            if(this.brokenThirdMoveRule(prevChord, currentChord))
                return -1;
            if (Utils.containsBaseChordComponent(prevChord.harmonicFunction.extra, "7")) {
                if(this.brokenSeventhMoveRule(prevChord, currentChord))
                    return -1;
                if (Utils.containsBaseChordComponent(prevChord.harmonicFunction.extra, "9") && this.brokenNinthMoveRule(prevChord, currentChord))
                        return -1;
            }
            if (Utils.containsChordComponent(prevChord.harmonicFunction.extra, "5<")  && this.brokenUpFifthMoveRule(prevChord, currentChord))
                return -1;
            if ((Utils.containsChordComponent(prevChord.harmonicFunction.extra, "5>") || prevChord.harmonicFunction.getFifth().chordComponentString === "5>") &&
                this.brokenDownFifthMoveRule(prevChord, currentChord))
                return -1;
            if (prevChord.harmonicFunction.isChopin() && this.brokenChopinMoveRule(prevChord, currentChord))
                        return -1;
            return 0;
        }
        return 0;
    };

    this.brokenThirdMoveRule = function(prevChord, currentChord){
        var dominantVoiceWith3 = this.voiceWithBaseComponent(prevChord, "3");
        return dominantVoiceWith3 > -1 &&
            !prevChord.notes[dominantVoiceWith3].equalPitches(currentChord.notes[dominantVoiceWith3]) &&
            !Utils.containsBaseChordComponent(currentChord.harmonicFunction.omit, "1") &&
            !currentChord.notes[dominantVoiceWith3].baseChordComponentEquals("1") &&
            !currentChord.notes[dominantVoiceWith3].baseChordComponentEquals("7") &&
            !currentChord.harmonicFunction.containsDelayedChordComponent("1") &&
            !(prevChord.bassNote.baseChordComponentEquals("3") && currentChord.bassNote.baseChordComponentEquals("3"));
    };

    this.brokenSeventhMoveRule = function(prevChord, currentChord){
        var dominantVoiceWith7 = this.voiceWithBaseComponent(prevChord, "7");
        if (dominantVoiceWith7 > -1 &&
            !prevChord.notes[dominantVoiceWith7].equalPitches(currentChord.notes[dominantVoiceWith7]) &&
            !currentChord.notes[dominantVoiceWith7].baseChordComponentEquals("3") &&
            !currentChord.harmonicFunction.containsDelayedBaseChordComponent("3")) {
            //rozwiazanie swobodne mozliwe
            if ((currentChord.harmonicFunction.revolution.chordComponentString === "3" ||
                currentChord.harmonicFunction.revolution.chordComponentString === "3>" ||
                (!Utils.isDefined(currentChord.harmonicFunction.position) && (currentChord.harmonicFunction.position.chordComponentString === "3" ||
                    currentChord.harmonicFunction.position.chordComponentString === "3>"))) &&
                dominantVoiceWith7 < dominantVoiceWith3) {
                    if (!currentChord.notes[dominantVoiceWith7].baseChordComponentEquals("5")) return true;
            } else return true;
        }
        return false;
    };

    this.brokenNinthMoveRule = function(prevChord, currentChord){
        var dominantVoiceWith9 = this.voiceWithBaseComponent(prevChord, "9");
        return dominantVoiceWith9 > -1 &&
            !prevChord.notes[dominantVoiceWith9].equalPitches(currentChord.notes[dominantVoiceWith9]) &&
            !currentChord.notes[dominantVoiceWith9].baseChordComponentEquals("5") &&
            !currentChord.harmonicFunction.containsDelayedBaseChordComponent("5");
    };

    this.brokenUpFifthMoveRule = function(prevChord, currentChord){
        var dominantVoiceWithAlt5 = this.voiceWithComponent(prevChord, "5<");
        return dominantVoiceWithAlt5 > -1 &&
            !prevChord.notes[dominantVoiceWithAlt5].equalPitches(currentChord.notes[dominantVoiceWithAlt5]) &&
            !currentChord.notes[dominantVoiceWithAlt5].baseChordComponentEquals("3") &&
            !currentChord.harmonicFunction.containsDelayedBaseChordComponent("3");
    };

    this.brokenDownFifthMoveRule = function(prevChord, currentChord){
        var dominantVoiceWithAlt5 = this.voiceWithComponent(prevChord, "5>");
        return dominantVoiceWithAlt5 > -1 &&
            !prevChord.notes[dominantVoiceWithAlt5].equalPitches(currentChord.notes[dominantVoiceWithAlt5]) &&
            !currentChord.notes[dominantVoiceWithAlt5].baseChordComponentEquals("1") &&
            !currentChord.harmonicFunction.containsDelayedBaseChordComponent("1");
    };

    this.brokenChopinMoveRule = function(prevChord, currentChord){
        var dominantVoiceWith6 = this.voiceWithBaseComponent(prevChord, "6");
        return dominantVoiceWith6 > -1 &&
            !currentChord.notes[dominantVoiceWith6].chordComponentEquals("1") &&
            !currentChord.harmonicFunction.containsDelayedChordComponent("1");
    };
}

function DominantSecondRelationCheckConnectionRule() {

    ICheckConnectionRule.call(this);

    this.evaluateIncludingDeflections = function(connection) {
        var currentChord = connection.current;
        var prevChord = connection.prev;
        var specificConnectionRule = new SpecificFunctionConnectionRule(Consts.FUNCTION_NAMES.DOMINANT, Consts.FUNCTION_NAMES.TONIC);
        if (specificConnectionRule.isNotBroken(connection)
            && prevChord.harmonicFunction.isInSecondRelation(currentChord.harmonicFunction)) {
            if(this.brokenThirdMoveRule(prevChord, currentChord))
                return -1;
            if(this.brokenFifthMoveRule(prevChord, currentChord))
                return -1;
            if (Utils.containsChordComponent(prevChord.harmonicFunction.extra, "7") && this.brokenSeventhMoveRule(prevChord, currentChord))
                return -1;
            if (Utils.containsChordComponent(prevChord.harmonicFunction.extra, "5>") && this.brokenDownFifthMoveRule(prevChord, currentChord))
                return -1;
        }
        return 0;
    };

    this.brokenThirdMoveRule = function(prevChord, currentChord){
        var dominantVoiceWith3 = this.voiceWithBaseComponent(prevChord, "3");
        return dominantVoiceWith3 > -1 && !currentChord.notes[dominantVoiceWith3].baseChordComponentEquals("3") &&
            !currentChord.harmonicFunction.containsDelayedBaseChordComponent("3");
    };

    this.brokenFifthMoveRule = function(prevChord, currentChord){
        var dominantVoiceWith5 = this.voiceWithBaseComponent(prevChord, "5");
        return (dominantVoiceWith5 > -1 && !currentChord.notes[dominantVoiceWith5].baseChordComponentEquals("3") &&
            !currentChord.harmonicFunction.containsDelayedBaseChordComponent("3"));
    };

    this.brokenSeventhMoveRule = function(prevChord, currentChord){
        var dominantVoiceWith7 = this.voiceWithBaseComponent(prevChord, "7");
        return dominantVoiceWith7 > -1 && !currentChord.notes[dominantVoiceWith7].baseChordComponentEquals("5") &&
            !currentChord.harmonicFunction.containsDelayedBaseChordComponent("5");
    };

    this.brokenDownFifthMoveRule = function(prevChord, currentChord){
        var dominantVoiceWithAlt5 = this.voiceWithComponent(prevChord, "5>");
        return dominantVoiceWithAlt5 > -1 &&
            !prevChord.notes[dominantVoiceWithAlt5].equalPitches(currentChord.notes[dominantVoiceWithAlt5]) &&
            !currentChord.notes[dominantVoiceWithAlt5].baseChordComponentEquals("3") &&
            !currentChord.harmonicFunction.containsDelayedBaseChordComponent("3");
    }
}

function SubdominantDominantCheckConnectionRule() {
    ICheckConnectionRule.call(this);

    this.evaluateIncludingDeflections = function(connection) {
        var currentChord = connection.current;
        var prevChord = connection.prev;
        var specificConnectionRule = new SpecificFunctionConnectionRule(Consts.FUNCTION_NAMES.SUBDOMINANT, Consts.FUNCTION_NAMES.DOMINANT);
        if (specificConnectionRule.isNotBroken(connection)
            && prevChord.harmonicFunction.isInSecondRelation(currentChord.harmonicFunction)) {
            if(this.brokenClosestMoveRule(prevChord, currentChord))
                return -1;
            if(this.brokenVoicesMoveOppositeDirectionRule(prevChord, currentChord))
                return -1;
        }
        return 0;
    };

    this.brokenVoicesMoveOppositeDirectionRule = function(prevChord, currentChord){
        if(currentChord.bassNote.chordComponentEquals("1") && prevChord.bassNote.chordComponentEquals("1")) {
            for(var i = 1; i < 4; i++) {
                if (prevChord.notes[i].pitch - currentChord.notes[i].pitch < 0) {
                    return true;
                }
            }
        }
        return false;
    };

    this.brokenClosestMoveRule = function(prevChord, currentChord){
        //todo maybe for all connections?
        var vb = new Consts.VoicesBoundary();
        for (var i = 1; i < 4; i++) {
            var higherPitch, lowerPitch;
            if (prevChord.notes[i].pitch > currentChord.notes[i].pitch) {
                higherPitch = prevChord.notes[i].pitch;
                lowerPitch = currentChord.notes[i].pitch;
            } else {
                higherPitch = currentChord.notes[i].pitch;
                lowerPitch = prevChord.notes[i].pitch;
            }

            for (var j = 1; j < 4; j++) {
                if (j !== i) {
                    for (var currentPitch = currentChord.notes[j].pitch; currentPitch < vb.sopranoMax; currentPitch += 12) {
                        if (currentPitch < higherPitch && currentPitch > lowerPitch) {
                            return true;
                        }
                    }
                    for (var currentPitch = currentChord.notes[j].pitch; currentPitch < vb.tenorMin; currentPitch -= 12) {
                        if (currentPitch < higherPitch && currentPitch > lowerPitch) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
}

function DominantSubdominantCheckConnectionRule() {
    ICheckConnectionRule.call(this);

    this.evaluateIncludingDeflections = function(connection){
        var currentChord = connection.current;
        var prevChord = connection.prev;
        var specificConnectionRule = new SpecificFunctionConnectionRule(Consts.FUNCTION_NAMES.DOMINANT, Consts.FUNCTION_NAMES.SUBDOMINANT);
        if (specificConnectionRule.isNotBroken(connection) &&
            prevChord.harmonicFunction.hasMajorMode())
            throw new Errors.RulesCheckerError("Forbidden connection: D->S");
        return 0;
    }
}

function SameFunctionCheckConnectionRule() {
    ICheckConnectionRule.call(this);

    this.evaluateIncludingDeflections = function(connection){
        var sf = new SameFunctionRule();
        if(sf.isNotBroken(connection)){
                if(this.brokenChangePitchesRule(connection.current, connection.prev))
                    return -1;
        }
        return 0;
    };

    this.brokenChangePitchesRule = function(currentChord, prevChord) {
        return prevChord.sopranoNote.equals(currentChord.sopranoNote) &&
            prevChord.altoNote.equals(currentChord.altoNote) &&
            prevChord.tenorNote.equals(currentChord.tenorNote) &&
            prevChord.bassNote.equalsInOneOctave(currentChord.bassNote);
    };

}

function SubdominantDominantCheckConnectionRule() {
    ICheckConnectionRule.call(this);

    this.evaluateIncludingDeflections = function(connection){
        var currentChord = connection.current;
        var prevChord = connection.prev;
        var specificConnectionRule = new SpecificFunctionConnectionRule(Consts.FUNCTION_NAMES.SUBDOMINANT, Consts.FUNCTION_NAMES.DOMINANT);
        if (specificConnectionRule.isNotBroken(connection)
            && prevChord.harmonicFunction.degree + 1 === currentChord.harmonicFunction.degree){
            if(this.brokenVoicesMoveOppositeDirectionRule(currentChord, prevChord))
                return -1;
            if(this.brokenClosestMoveRule(currentChord, prevChord))
                return -1;
        }
        return 0;
    };

    this.brokenClosestMoveRule = function(currentChord, prevChord){
        //todo maybe for all connections?
        var vb = new Consts.VoicesBoundary();
        for(var i=1; i<4; i++){
            var higherPitch, lowerPitch;
            if(prevChord.notes[i].pitch > currentChord.notes[i].pitch){
                higherPitch = prevChord.notes[i].pitch;
                lowerPitch = currentChord.notes[i].pitch;
            } else {
                higherPitch = currentChord.notes[i].pitch;
                lowerPitch = prevChord.notes[i].pitch;
            }

            for(var j=1; j<4; j++){
                if(j !== i){
                    for(var currentPitch=currentChord.notes[j].pitch; currentPitch<vb.sopranoMax; currentPitch += 12){
                        if(currentPitch < higherPitch && currentPitch > lowerPitch){
                            return true;
                        }
                    }
                    for(var currentPitch=currentChord.notes[j].pitch; currentPitch<vb.tenorMin; currentPitch -= 12){
                        if(currentPitch < higherPitch && currentPitch > lowerPitch){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    this.brokenVoicesMoveOppositeDirectionRule = function(currentChord, prevChord){
        if(currentChord.bassNote.chordComponentEquals("1") && prevChord.bassNote.chordComponentEquals("1")) {
            for(var i = 1; i < 4; i++) {
                if (prevChord.notes[i].pitch - currentChord.notes[i].pitch < 0) {
                    return true;
                }
            }
        }
        return false;
    }
}

/*
        END OF RULES
 */