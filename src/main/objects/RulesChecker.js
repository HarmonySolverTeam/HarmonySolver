.import "./Utils.js" as Utils
.import "./Errors.js" as Errors
.import "./Consts.js" as Consts
.import "./IntervalUtils.js" as IntervalUtils

var DEBUG = false;

function correctDistanceBassTenor(chord){
    if(chord.bassNote.baseChordComponentEquals('1') &&
        chord.tenorNote.chordComponent.semitonesNumber >= 12 &&
        IntervalUtils.pitchOffsetBetween(chord.tenorNote,chord.bassNote) < 12) {
        if(DEBUG) Utils.log("not correct distance between bass and tenor",  "tenor: " + chord.tenorNote + "\t" + "bass: " + chord.bassNote)
        return false;
    }
    return true;
}

function concurrentOctaves(prevChord, currentChord){
    if(prevChord.harmonicFunction.equals(currentChord.harmonicFunction)) return 0;
    for(var i = 0; i < 3; i++){
        for(var j = i + 1; j < 4; j++){
            if(IntervalUtils.isOctaveOrPrime(prevChord.notes[j],prevChord.notes[i]) &&
                IntervalUtils.isOctaveOrPrime(currentChord.notes[j],currentChord.notes[i])){
                    if(DEBUG) Utils.log("concurrentOctaves "+i+" "+j, prevChord + " -> " + currentChord );
                    return -1;
                }
        }
    }
    return 0;
}

function concurrentFifths(prevChord, currentChord){
    if(prevChord.harmonicFunction.equals(currentChord.harmonicFunction)) return 0;
    for(var i = 0; i < 3; i++){
        for(var j = i + 1; j < 4; j++){
            if(IntervalUtils.isFive(prevChord.notes[j],prevChord.notes[i]) &&
                IntervalUtils.isFive(currentChord.notes[j],currentChord.notes[i])){
                    if(DEBUG) Utils.log("concurrentFifths "+i+" "+j, prevChord + " -> " + currentChord);
                    return -1;
            }
        }
    }
    return 0;
}


function crossingVoices(prevChord, currentChord){
    for(var i = 0; i < 3; i++){
        if(currentChord.notes[i].isUpperThan(prevChord.notes[i+1])){
            if(DEBUG) Utils.log("crossingVoices", prevChord + " -> " + currentChord);
            return -1
        }
    }
    for(var i = 3; i > 0; i--){
        if(currentChord.notes[i].isLowerThan(prevChord.notes[i-1])){
            if(DEBUG) Utils.log("crossingVoices", prevChord + " -> " + currentChord);
            return -1
        }
    }
    return 0;
}

//TODO sprawdzić, czy w obrębie tej samej funkcji może być spełnione
function oneDirection(prevChord, currentChord){
    if((currentChord.bassNote.isUpperThan(prevChord.bassNote) && currentChord.tenorNote.isUpperThan(prevChord.tenorNote)
        && currentChord.altoNote.isUpperThan(prevChord.altoNote) && currentChord.sopranoNote.isUpperThan(prevChord.sopranoNote))
        ||(currentChord.bassNote.isLowerThan(prevChord.bassNote) && currentChord.tenorNote.isLowerThan(prevChord.tenorNote)
            && currentChord.altoNote.isLowerThan(prevChord.altoNote) && currentChord.sopranoNote.isLowerThan(prevChord.sopranoNote))){
        if(DEBUG) Utils.log("oneDirection", prevChord + " -> " + currentChord);
        return -1;
    }

    return 0;
}

//TODO wychylenie modulacyjne - ok, np zmiana tercji z malej na wielka | problem z tą samą funkcją - dziwne skoki w basic
function forbiddenJump(prevChord, currentChord, notNeighbourChords){
    if(!notNeighbourChords && prevChord.harmonicFunction.equals(currentChord.harmonicFunction)) return 0;

    for(var i = 0; i < 4; i++){
        //TODO upewnić się jak ze skokami jest naprawdę, basu chyba ta zasada się nie tyczy
        // oraz dla harmonizacji sopranu / ustalonego basu to pominąć trzeba
        if(IntervalUtils.pitchOffsetBetween(currentChord.notes[i],prevChord.notes[i])>9) return -1;
        if(IntervalUtils.isAlteredInterval(prevChord.notes[i],currentChord.notes[i])) {
            if(DEBUG) Utils.log("Altered Interval in voice "+i, prevChord + "->" + currentChord);
            return -1;
        }
    }
    return 0;
}

//TODO wychylenie modulacyjne - ok, np zmiana tercji z malej na wielka, zmiana trybu
function forbiddenSumJump(prevPrevChord, prevChord, currentChord){
    if(prevPrevChord.harmonicFunction.equals(prevChord.harmonicFunction) && prevChord.harmonicFunction.equals(currentChord.harmonicFunction)) return 0;
    for(var i = 0; i < 4; i++){
        if(((prevPrevChord.notes[i].isUpperThan(prevChord.notes[i]) && prevChord.notes[i].isUpperThan(currentChord.notes[i])) ||
            (prevPrevChord.notes[i].isLowerThan(prevChord.notes[i]) && prevChord.notes[i].isLowerThan(currentChord.notes[i])))
            && forbiddenJump(prevPrevChord, currentChord, true) === -1){
            if(DEBUG) {
                Utils.log("forbiddenSumJump", prevPrevChord + " -> " + prevChord + " -> " + currentChord);
            }
            return -1;
        }
    }
    return 0;
}

function checkIllegalDoubled3(chord){
    var terCounter = chord.countBaseComponents("3");

    if(chord.harmonicFunction.isNeapolitan()) return terCounter !== 2;
    return terCounter > 1
}

function checkConnection(prevChord, currentChord){
    var couldHaveDouble3 = false;
    if((prevChord.harmonicFunction.functionName === "D" && currentChord.harmonicFunction.functionName === "T") ||
        Utils.containsBaseChordComponent(prevChord.harmonicFunction.extra, "7")){
        if(Utils.contains([4,-3], prevChord.harmonicFunction.degree - currentChord.harmonicFunction.degree)) {
            var dominantVoiceWith3 = -1;
            for (var i = 0; i < 4; i++) {
                if (prevChord.notes[i].baseChordComponentEquals("3")) {
                    dominantVoiceWith3 = i;
                    break;
                }
            }
            if (dominantVoiceWith3 > -1 &&
                !prevChord.notes[dominantVoiceWith3].equals(currentChord.notes[dominantVoiceWith3]) &&
                !Utils.containsChordComponent(currentChord.harmonicFunction.omit, "1") &&
                !currentChord.notes[dominantVoiceWith3].chordComponentEquals("1")) return -1;

            if (Utils.containsBaseChordComponent(prevChord.harmonicFunction.extra, "7")) {
                var dominantVoiceWith7 = -1;
                for (var i = 0; i < 4; i++) {
                    if (prevChord.notes[i].baseChordComponentEquals("7")) {
                        dominantVoiceWith7 = i;
                        break;
                    }
                }
                if (dominantVoiceWith7 > -1 &&
                    !prevChord.notes[dominantVoiceWith7].equals(currentChord.notes[dominantVoiceWith7]) &&
                    !currentChord.notes[dominantVoiceWith7].baseChordComponentEquals("3")){
                    //rozwiazanie swobodne mozliwe (todo 7 pod 3)
                    if((currentChord.harmonicFunction.revolution.chordComponentString === "3" ||
                        currentChord.harmonicFunction.revolution.chordComponentString === "3>" ||
                        (currentChord.harmonicFunction.position !== undefined && (currentChord.harmonicFunction.position.chordComponentString === "3" ||
                        currentChord.harmonicFunction.position.chordComponentString === "3>"))) &&
                        dominantVoiceWith7 < dominantVoiceWith3) {
                        if(!currentChord.notes[dominantVoiceWith7].baseChordComponentEquals("5")) return -1;
                    }
                    else return -1;
                }
                if (Utils.containsBaseChordComponent(prevChord.harmonicFunction.extra, "9")) {
                    var dominantVoiceWith9 = -1;
                    for (var i = 0; i < 4; i++) {
                        if (prevChord.notes[i].baseChordComponentEquals("9")) {
                            dominantVoiceWith9 = i;
                            break;
                        }
                    }
                    if(dominantVoiceWith9 > -1 &&
                        !prevChord.notes[dominantVoiceWith9].equals(currentChord.notes[dominantVoiceWith9]) &&
                        !currentChord.notes[dominantVoiceWith9].baseChordComponentEquals("5")) return -1;
                }
            }
            if (Utils.containsChordComponent(prevChord.harmonicFunction.extra, "5<")) {
                var dominantVoiceWithAlt5 = -1;
                for (var i = 0; i < 4; i++) {
                    if (prevChord.notes[i].chordComponentEquals("5<")) {
                        dominantVoiceWithAlt5 = i;
                        break;
                    }
                }
                if (dominantVoiceWithAlt5 > -1 &&
                    !prevChord.notes[dominantVoiceWithAlt5].equals(currentChord.notes[dominantVoiceWithAlt5]) &&
                    !currentChord.notes[dominantVoiceWithAlt5].baseChordComponentEquals("3")) return -1;
                couldHaveDouble3 = true;
            }
            if (Utils.containsChordComponent(prevChord.harmonicFunction.extra, "5>")) {
                var dominantVoiceWithAlt5 = -1;
                for (var i = 0; i < 4; i++) {
                    if (prevChord.notes[i].chordComponentEquals("5>")) {
                        dominantVoiceWithAlt5 = i;
                        break;
                    }
                }
                if (dominantVoiceWithAlt5 > -1 &&
                    !prevChord.notes[dominantVoiceWithAlt5].equals(currentChord.notes[dominantVoiceWithAlt5]) &&
                    !currentChord.notes[dominantVoiceWithAlt5].baseChordComponentEquals("1")) return -1;
            }
        }

        // todo 7 na 1, chyba inaczej
        if(currentChord.harmonicFunction.degree - prevChord.harmonicFunction.degree === 1) {
            couldHaveDouble3 = true;
            var dominantVoiceWith3 = -1;
            for (var i = 0; i < 4; i++) {
                if (prevChord.notes[i].baseChordComponentEquals("3")) {
                    dominantVoiceWith3 = i;
                    break;
                }
            }
            if (dominantVoiceWith3 > -1 && !currentChord.notes[dominantVoiceWith3].baseChordComponentEquals("3")) return -1;

            var dominantVoiceWith5 = -1;
            for (var i = 0; i < 4; i++) {
                if (prevChord.notes[i].baseChordComponentEquals("5")) {
                    dominantVoiceWith5 = i;
                    break;
                }
            }
            if (dominantVoiceWith5 > -1 && !currentChord.notes[dominantVoiceWith5].baseChordComponentEquals("3")) return -1;

            if (Utils.containsChordComponent(prevChord.harmonicFunction.extra, "7")) {
                var dominantVoiceWith7 = -1;
                for (var i = 0; i < 4; i++) {
                    if (prevChord.notes[i].baseChordComponentEquals("7")) {
                        dominantVoiceWith7 = i;
                        break;
                    }
                }
                if (dominantVoiceWith7 > -1 && !currentChord.notes[dominantVoiceWith7].baseChordComponentEquals("5")) return -1;
            }
            if (Utils.containsChordComponent(prevChord.harmonicFunction.extra, "5>")) {
                var dominantVoiceWithAlt5 = -1;
                for (var i = 0; i < 4; i++) {
                    if (prevChord.notes[i].chordComponentEquals("5>")) {
                        dominantVoiceWithAlt5 = i;
                        break;
                    }
                }
                if (dominantVoiceWithAlt5 > -1 &&
                    !prevChord.notes[dominantVoiceWithAlt5].equals(currentChord.notes[dominantVoiceWithAlt5]) &&
                    !currentChord.notes[dominantVoiceWithAlt5].baseChordComponentEquals("3")) return -1;
            }
        }
    }
    if(prevChord.harmonicFunction.functionName === "D" && prevChord.harmonicFunction.mode === Consts.MODE.MAJOR && currentChord.harmonicFunction.functionName === "S")
        throw new Errors.RulesCheckerError("Forbidden connection: D->S");

    if(!couldHaveDouble3 && checkIllegalDoubled3(currentChord)) return -1;
    return 0;
}

function checkDelayCorrectness(prevChord, currentChord){
    var delay = prevChord.harmonicFunction.delay;
    if(delay.length === 0) return 0;
    var delayedVoices = [];
    for(var i=0; i<delay.length; i++){
        var prevComponent = delay[i][0];
        var currentComponent = delay[i][1];
        for(var j=0; j<4; j++){
            if(prevChord.notes[j].chordComponentEquals(prevComponent.chordComponentString)) {
                if(!currentChord.notes[j].chordComponentEquals(currentComponent.chordComponentString)){
                    if(DEBUG) Utils.log("delay error"+i+" "+j, prevChord + " -> " + currentChord);
                    return -1;
                }
                else delayedVoices.push(j);
            }
        }
    }
    for(var i=0; i<4; i++){
        if(Utils.contains(delayedVoices, i)) continue;
        if(!prevChord.notes[i].equals(currentChord.notes[i]) && i !== 0) {
            if(DEBUG) Utils.log("delay error"+i+" "+j, prevChord + " -> " + currentChord);
            return -1;
        }
    }
    return 0;
}

function hiddenOctaves(prevChord, currentChord){
    var sameDirection = (prevChord.bassNote.isLowerThan(currentChord.bassNote) && prevChord.sopranoNote.isLowerThan(currentChord.sopranoNote) ||
        (prevChord.bassNote.isUpperThan(currentChord.bassNote) && prevChord.sopranoNote.isUpperThan(currentChord.sopranoNote)));
    if(sameDirection && Utils.abs(prevChord.sopranoNote.pitch-currentChord.sopranoNote.pitch)>2 &&
        IntervalUtils.isOctaveOrPrime(currentChord.bassNote,currentChord.sopranoNote)){
        if(DEBUG) Utils.log("hiddenOctaves", prevChord + " -> " + currentChord);
        return -1;
    }
    return 0;
}

function falseRelation(prevChord, currentChord){
    for(var i=0; i<4; i++){
        for(var j=i+1; j<4; j++){
            if(IntervalUtils.isChromaticAlteration(prevChord.notes[i],currentChord.notes[j])) {
                if(DEBUG) Utils.log("false relation", prevChord + "->" + currentChord);
                return -1;
            }
        }
    }
    return 0;
}

function checkRules(prevPrevChord, prevChord, currentChord, rules, checkSumJumpRule){
    var result = 0;
    if(prevChord !== undefined){
        for (var i = 0; i < rules.length; i++) {
            var currentResult = rules[i](prevChord, currentChord);
            if (currentResult === -1) return -1;
            result += currentResult
        }
        if (prevPrevChord !== undefined && checkSumJumpRule) {
            var currentResult = forbiddenSumJump(prevPrevChord, prevChord, currentChord);
            if (currentResult === -1) return -1;
            result += currentResult;
        }
    } else if(checkIllegalDoubled3(currentChord)) return -1;
    if(!correctDistanceBassTenor(currentChord)) return -1;
    return result
}

function checkAllRules(prevPrevChord, prevChord, currentChord){
    var chosenRules = [falseRelation, checkDelayCorrectness, checkConnection, concurrentOctaves, concurrentFifths, crossingVoices, oneDirection, forbiddenJump];
    var result = checkRules(prevPrevChord ,prevChord, currentChord, chosenRules, true);
    return result
}