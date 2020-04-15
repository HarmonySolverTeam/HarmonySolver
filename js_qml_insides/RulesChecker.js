function abs(a){
    return a>0?a:-a;
}

//    const functions = {
//        T: "T",
//        S: "S",
//        D: "D"
//    };

function concurrentOctaves(prevChord, currentChord){
    if(prevChord[0] === currentChord[0]) return 0;
    for(var i = 0; i < 3; i++){
        for(var j = i + 1; j < 4; j++){
            if((prevChord[1][j][0]-prevChord[1][i][0])%12 === 0){
                if((currentChord[1][j][0]-currentChord[1][i][0])%12 === 0){
                    console.log("concurrentOctaves")
                    return -1;
                }
            }
        }
    }
    return 0;
}

function concurrentFifths(prevChord, currentChord){
    if(prevChord[0] === currentChord[0]) return 0;
    for(var i = 0; i < 3; i++){
        for(var j = i + 1; j < 4; j++){
            if((prevChord[1][j][0]-prevChord[1][i][0])%12 === 7){
                if((currentChord[1][j][0]-currentChord[1][i][0])%12 === 7){

                    console.log(i)
                    console.log(j)
                    console.log("concurrentFifths")

                    return -1;
                }
            }
        }
    }
    return 0;
}

function crossingVoices(prevChord, currentChord){
    for(var i = 0; i < 3; i++){
        if(currentChord[1][i][0]>prevChord[1][i+1][0]){
            console.log("crossingVoices")
            return -1
        }
    }
    for(var i = 3; i > 0; i--){
        if(currentChord[1][i][0]<prevChord[1][i-1][0]){
            console.log("crossingVoices")
            return -1
        }
    }
    return 0;
}

function oneDirection(prevChord, currentChord){
    if((currentChord[1][0][0]>prevChord[1][0][0] && currentChord[1][1][0]>prevChord[1][1][0] && currentChord[1][2][0]>prevChord[1][2][0]
        && currentChord[1][3][0]>prevChord[1][3][0] )
        ||(currentChord[1][1][0]<prevChord[1][1][0] && currentChord[1][2][0]<prevChord[1][2][0]
            && currentChord[1][3][0]<prevChord[1][3][0] && currentChord[1][0][0]<prevChord[1][0][0])){
        console.log("oneDirection")

        return -1;
    }

    return 0;
}

function forbiddenJump(prevChord, currentChord){
    //altered intervals or greater than 6th are forbidden
    //TODO altered intervals?
    for(var i = 0; i < 4; i++){
        if(abs(currentChord[1][i][0]-prevChord[1][i][0])>9) return -1;
    }
    return 0;
}

function forbiddenSumJump(prevPrevChord, prevChord, currentChord){
    for(var i = 0; i < 4; i++){
        if(((prevPrevChord[1][i][0]>prevChord[1][i][0] && prevChord[1][i][0]>currentChord[1][i][0]) ||
            (prevPrevChord[1][i][0]<prevChord[1][i][0] && prevChord[1][i][0]<currentChord[1][i][0]))
            && forbiddenJump(prevPrevChord, currentChord)){
            console.log("forbiddenSumJump")
            return -1;
        }
    }
    return 0;
}

function checkConnection(prevChord, currentChord){
    const connection = prevChord[0]+"->"+currentChord[0];
    var result = 0;
    switch (connection) {
        case "D->T":
            var dominantVoiceWith3 = 0;
            for(var i = 0; i < 4; i++){
                if(prevChord[1][i][1] === 3) {
                    dominantVoiceWith3 = i;
                    break;
                }
            }
            if(dominantVoiceWith3 > 0 && currentChord[1][dominantVoiceWith3][1] !== 1){
                result += 1;
            }
            break;
        case "D->S":
            throw "Forbidden connection: "+connection;
            break;
    }
    return result;
}

function checkRules(prevPrevChord, prevChord, currentChord, rules, checkSumJumpRule){
    var result = 0;
    if(prevChord.length){
        for (var i = 0; i < rules.length; i++) {
            var currentResult = rules[i](prevChord, currentChord);
            if (currentResult === -1) return -1;
            result += currentResult
        }
        if (prevPrevChord.length && checkSumJumpRule) {
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



/*
//Code for testing:
myPrevPrevChord = [functions.D,[43,1],[59,3],[62,5],[67,1]];
myPrevChord = [functions.T,[48,1],[60,1],[64,3],[67,5]];
myCurrentChord = [functions.S,[41,1],[60,5],[65,1],[69,3]];
const chosenRules = [concurrentOctaves, concurrentFifths, crossingVoices, oneDirection, forbiddenJump, checkConnection];
const result = checkRules(myPrevPrevChord ,myPrevChord, myCurrentChord, chosenRules, true);
console.log(result)
*/