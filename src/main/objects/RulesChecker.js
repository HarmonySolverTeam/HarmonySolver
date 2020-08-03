.import "./Utils.js" as Utils

var DEBUG = true;

function concurrentOctaves(prevChord, currentChord){
    if(prevChord.harmonicFunction.equals(currentChord.harmonicFunction)) return 0;
    for(var i = 0; i < 3; i++){
        for(var j = i + 1; j < 4; j++){
            if((prevChord.notes[j].pitch-prevChord.notes[i].pitch)%12 === 0){
                if((currentChord.notes[j].pitch-currentChord.notes[i].pitch)%12 === 0){
                    if(DEBUG) {
                        console.log("concurrentOctaves"+i+" "+j);
                        console.log(prevChord + " -> " + currentChord);
                    }
                    return -1;
                }
            }
        }
    }
    return 0;
}

function concurrentFifths(prevChord, currentChord){
    if(prevChord.harmonicFunction.equals(currentChord.harmonicFunction)) return 0;
    for(var i = 0; i < 3; i++){
        for(var j = i + 1; j < 4; j++){
            if((prevChord.notes[j].pitch-prevChord.notes[i].pitch)%12 === 7){
                if((currentChord.notes[j].pitch-currentChord.notes[i].pitch)%12 === 7){
                    if(DEBUG) {
                        console.log("concurrentFifths"+i+" "+j);
                        console.log(prevChord + " -> " + currentChord);
                    }

                    return -1;
                }
            }
        }
    }
    return 0;
}

function crossingVoices(prevChord, currentChord){
    for(var i = 0; i < 3; i++){
        if(currentChord.notes[i].pitch>prevChord.notes[i+1].pitch){
            if(DEBUG) {
                console.log("crossingVoices");
                console.log(prevChord + " -> " + currentChord);
            }
            return -1
        }
    }
    for(var i = 3; i > 0; i--){
        if(currentChord.notes[i].pitch<prevChord.notes[i-1].pitch){
            if(DEBUG){
                console.log("crossingVoices");
                console.log(prevChord + " -> " + currentChord);
            }
            return -1
        }
    }
    return 0;
}

function oneDirection(prevChord, currentChord){
    if((currentChord.bassNote.pitch>prevChord.bassNote.pitch && currentChord.tenorNote.pitch>prevChord.tenorNote.pitch
        && currentChord.altoNote.pitch>prevChord.altoNote.pitch && currentChord.bassNote.pitch>prevChord.bassNote.pitch)
        ||(currentChord.bassNote.pitch<prevChord.bassNote.pitch && currentChord.tenorNote.pitch<prevChord.tenorNote.pitch
            && currentChord.altoNote.pitch<prevChord.altoNote.pitch && currentChord.bassNote.pitch<prevChord.bassNote.pitch)){
        if(DEBUG){
            console.log("oneDirection");
            console.log(prevChord + " -> " + currentChord);
        }
        return -1;
    }

    return 0;
}

function forbiddenJump(prevChord, currentChord){
    function getBaseDistance(first, second ){
        var i = 0
        while(first!==second) {
            first = (first+1)%7
            i++
        }
        return i
    }

    function checkAlteration(halfToneDist, baseDist){
        if(halfToneDist > 12){
            if(halfToneDist%12===0) halfToneDist = 12
            else halfToneDist = halfToneDist % 12
        }
        var alteredIntervals = {1:0, 3:1, 5:2, 6:3, 8:4, 10:5, 12:6}
        return alteredIntervals[halfToneDist] === baseDist
    }

    function isAltered(firstNote, secondNote){
        var halfToneDist = firstNote.pitch-secondNote.pitch
        var firstBase = firstNote.baseNote
        var secondBase = secondNote.baseNote
        var baseDistance = -1
        if(halfToneDist>0){
            baseDistance = getBaseDistance(secondBase, firstBase)
        } else{
            baseDistance = getBaseDistance(firstBase, secondBase)
            halfToneDist = -halfToneDist
        }
        return checkAlteration(halfToneDist, baseDistance)
    }
    for(var i = 0; i < 4; i++){
        if(Utils.abs(currentChord.notes[i].pitch-prevChord.notes[i].pitch)>9) return -1;
        if(isAltered(prevChord.notes[i],currentChord.notes[i])) return -1;
    }
    return 0;
}

function forbiddenSumJump(prevPrevChord, prevChord, currentChord){
    for(var i = 0; i < 4; i++){
        if(((prevPrevChord.notes[i].pitch>prevChord.notes[i].pitch && prevChord.notes[i].pitch>currentChord.notes[i].pitch) ||
            (prevPrevChord.notes[i].pitch<prevChord.notes[i].pitch && prevChord.notes[i].pitch<currentChord.notes[i].pitch))
            && forbiddenJump(prevPrevChord, currentChord)){
            if(DEBUG) {
                console.log("forbiddenSumJump");
                console.log(prevPrevChord + " -> " + prevChord + " -> " + currentChord);
            }
            return -1;
        }
    }
    return 0;
}

function checkDoubled3(chord){
    var terCounter = 0
    for(var i = 0; i < chord.notes.length; i++){
        if(chord.notes[i].chordComponent === "3"){
            terCounter ++
        }
    }
    return terCounter > 1
}

function checkConnection(prevChord, currentChord){
    var getSymbol = function(harmonicFunction){
        return harmonicFunction.down?(harmonicFunction.functionName+"down"+harmonicFunction.extra):(harmonicFunction.functionName+harmonicFunction.extra)
    }
    var connection = getSymbol(prevChord.harmonicFunction)+"->"+getSymbol(currentChord.harmonicFunction);
    switch (connection) {
        case "D->T":
            var dominantVoiceWith3 = -1;
            for(var i = 0; i < 4; i++){
                if(prevChord.notes[i].chordComponent === "3") {
                    dominantVoiceWith3 = i;
                    break;
                }
            }
            if(dominantVoiceWith3 > -1 && currentChord.notes[dominantVoiceWith3].chordComponent !== "1"){
                return -1;
            }
            break;
        case "D->S":
            throw "Forbidden connection: "+connection;
            break;
        case "D7->T":
            var dominantVoiceWith3 = -1;
            for(var i = 0; i < 4; i++){
                if(prevChord.notes[i].chordComponent === "3") {
                    dominantVoiceWith3 = i;
                    break;
                }
            }
            if(dominantVoiceWith3 > -1 && currentChord.notes[dominantVoiceWith3].chordComponent !== "1"){
                return -1;
            }
            var dominantVoiceWith7 = -1;
            for(var i = 0; i < 4; i++){
                if(prevChord.notes[i].chordComponent === "7") {
                    dominantVoiceWith7 = i;
                    break;
                }
            }
            if(dominantVoiceWith7 > -1 && currentChord.notes[dominantVoiceWith7].chordComponent !== "3"){
                return -1;
            }
            break;
    }
    if(checkDoubled3(currentChord)) return -1;
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
    }
    else{
        if(checkDoubled3(currentChord)) return -1;
    }
    return result
}

function checkDelayCorrectness(prevChord, currentChord){
    var delay = prevChord.harmonicFunction.delay;
    for(var i=0; i<delay.length; i++){
        var prevComponent = delay[i][0];
        var currentComponent = delay[i][1];
        for(var j=0; j<4; j++){
            if(prevChord.notes[j].chordComponent === prevComponent) {
                if(currentChord.notes[j].chordComponent !== currentComponent) return -1;
            }
            else{
                if(!prevChord.notes[j].equals(currentChord.notes[j]) && j !== 0) return -1;
            }
        }
    }
    return 0;
}

function checkAllRules(prevPrevChord, prevChord, currentChord){
    var chosenRules = [checkDelayCorrectness, concurrentOctaves, concurrentFifths, crossingVoices, oneDirection, forbiddenJump, checkConnection];
    var result = checkRules(prevPrevChord ,prevChord, currentChord, chosenRules, true);
    return result
}