function abs(a){
    return a>0?a:-a;
}

function concurrentOctaves(prevChord, currentChord){
    if(prevChord.harmonicFunction.equals(currentChord.harmonicFunction)) return 0;
    for(var i = 0; i < 3; i++){
        for(var j = i + 1; j < 4; j++){
            if((prevChord.notes[j].pitch-prevChord.notes[i].pitch)%12 === 0){
                if((currentChord.notes[j].pitch-currentChord.notes[i].pitch)%12 === 0){
                    console.log("concurrentOctaves"+i+" "+j)
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
            if((prevChord.notes[j].pitch-prevChord.notes[i].pitch)%7 === 0){
                if((currentChord.notes[j].pitch-currentChord.notes[i].pitch)%7 === 0){
                    console.log("concurrentFifths"+i+" "+j)

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
            console.log("crossingVoices")
            return -1
        }
    }
    for(var i = 3; i > 0; i--){
        if(currentChord.notes[i].pitch<prevChord.notes[i-1].pitch){
            console.log("crossingVoices")
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
        console.log("oneDirection")

        return -1;
    }

    return 0;
}

function forbiddenJump(prevChord, currentChord){
    function getBaseDistance(first, second ){
        var i = 0
        while(first!=second) {
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
        if(abs(currentChord.notes[i].pitch-prevChord.notes[i].pitch)>9) return -1;
        if(isAltered(prevChord.notes[i],currentChord.notes[i])) return -1;
    }
    return 0;
}

function forbiddenSumJump(prevPrevChord, prevChord, currentChord){
    for(var i = 0; i < 4; i++){
        if(((prevPrevChord.notes[i].pitch>prevChord.notes[i].pitch && prevChord.notes[i].pitch>currentChord.notes[i].pitch) ||
            (prevPrevChord.notes[i].pitch<prevChord.notes[i].pitch && prevChord.notes[i].pitch<currentChord.notes[i].pitch))
            && forbiddenJump(prevPrevChord, currentChord)){
            console.log("forbiddenSumJump")
            return -1;
        }
    }
    return 0;
}

function checkConnection(prevChord, currentChord){
    const connection = prevChord.harmonicFunction.getSymbol()+"->"+currentChord.harmonicFunction.getSymbol();
    var result = 0;
    switch (connection) {
        case "D->T":
            var dominantVoiceWith3 = -1;
            for(var i = 0; i < 4; i++){
                if(prevChord.notes[i].chordComponent === 3) {
                    dominantVoiceWith3 = i;
                    break;
                }
            }
            if(dominantVoiceWith3 > -1 && currentChord.notes[dominantVoiceWith3].chordComponent !== 1){
                result += 1;
            }
            break;
        case "D->S":
            throw "Forbidden connection: "+connection;
            break;
        case "D7->T":
            var dominantVoiceWith3 = -1;
            for(var i = 0; i < 4; i++){
                if(prevChord.notes[i].chordComponent === 3) {
                    dominantVoiceWith3 = i;
                    break;
                }
            }
            if(dominantVoiceWith3 > -1 && currentChord.notes[dominantVoiceWith3].chordComponent !== 1){
                result += 1;
            }
            var dominantVoiceWith7 = -1;
            for(var i = 0; i < 4; i++){
                if(prevChord.notes[i].chordComponent === 7) {
                    dominantVoiceWith7 = i;
                    break;
                }
            }
            if(dominantVoiceWith7 > -1 && currentChord.notes[dominantVoiceWith7].chordComponent !== 3){
                result += 1;
            }
            break;
    }
    return result;
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
    return result
}

function checkAllRules(prevPrevChord, prevChord, currentChord){
    var chosenRules = [concurrentOctaves, concurrentFifths, crossingVoices, oneDirection, forbiddenJump, checkConnection];
    var result = checkRules(prevPrevChord ,prevChord, currentChord, chosenRules, true);
    return result
}

/*var currentChord = new Chord(new Note(67, BASE_NOTES.G, 5), new Note(64, BASE_NOTES.E, 3),
    new Note(60, BASE_NOTES.C, 1),new Note(48, BASE_NOTES.C, 1), new HarmonicFunction("T", undefined, 5, -1, undefined, undefined, undefined, false))
var prevChord = new Chord(new Note(69, BASE_NOTES.A, 3), new Note(65, BASE_NOTES.F, 1),
    new Note(60, BASE_NOTES.C, 5),new Note(53, BASE_NOTES.F, 1), new HarmonicFunction("S", undefined, 3, -1, undefined, undefined, undefined, false))
var prevChord = new Chord(new Note(65, BASE_NOTES.G, 1), new Note(62, BASE_NOTES.D, 5),
    new Note(59, BASE_NOTES.B, 3),new Note(55, BASE_NOTES.G, 1), new HarmonicFunction("D", undefined, -1, -1, undefined, undefined, undefined, false))
console.log(checkAllRules(undefined, prevChord, currentChord))*/