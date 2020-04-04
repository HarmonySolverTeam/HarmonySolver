const abs = (a) => {
  return a>0?a:-a;
};

const functions = {
    T: "T",
    S: "S",
    D: "D"
};

const concurrentOctaves = (prevChord, currentChord) => {
    for(let i = 1; i < 4; i++){
        for(let j = i + 1; j < 5; j++){
            if((prevChord[j][0]-prevChord[i][0])%12 === 0){
                if((currentChord[j][0]-currentChord[i][0])%12 === 0){
                    return -1;
                }
            }
        }
    }
    return 0;
};

const concurrentFifths = (prevChord, currentChord) => {
    for(let i = 1; i < 4; i++){
        for(let j = i + 1; j < 5; j++){
            if((prevChord[j][0]-prevChord[i][0])%7 === 0){
                if((currentChord[j][0]-currentChord[i][0])%7 === 0){
                    return -1;
                }
            }
        }
    }
    return 0;
};

const crossingVoices = (prevChord, currentChord) => {
    for(let i = 1; i < 4; i++){
        if(currentChord[i][0]>prevChord[i+1][0]) return -1
    }
    return 0;
};

const oneDirection = (prevChord, currentChord) => {
    if((currentChord[1][0]>prevChord[1][0] && currentChord[2][0]>prevChord[2][0] && currentChord[3][0]>prevChord[3][0]
        && currentChord[4][0]>prevChord[4][0] )
        ||(currentChord[1][0]<prevChord[1][0] && currentChord[2][0]<prevChord[2][0]
            && currentChord[3][0]<prevChord[3][0] && currentChord[4][0]<prevChord[4][0]))
        return -1;
    return 0;
};

const forbiddenJump = (prevChord, currentChord) => {
    //altered intervals or greater than 6th are forbidden
    //TODO altered intervals?
    for(let i = 1; i < 5; i++){
        if(abs(currentChord[i][0]-prevChord[i][0])>9) return -1;
    }
    return 0;
};

const forbiddenSumJump = (prevPrevChord, prevChord, currentChord) => {
    for(let i = 1; i < 5; i++){
        if(((prevPrevChord[i][0]>prevChord[i][0] && prevChord[i][0]>currentChord[i][0]) ||
            (prevPrevChord[i][0]<prevChord[i][0] && prevChord[i][0]<currentChord[i][0]))
            && forbiddenJump(prevPrevChord, currentChord)) return -1;
    }
    return 0;
};

const checkConnection = (prevChord, currentChord) => {
    const connection = prevChord[0]+"->"+currentChord[0];
    let result = 0;
    switch (connection) {
        case "D->T":
            let dominantVoiceWith3 = 0;
            for(let i = 1; i < 5; i++){
                if(prevChord[i][1] === 3) {
                    dominantVoiceWith3 = i;
                    break;
                }
            }
            if(dominantVoiceWith3 > 0 && currentChord[dominantVoiceWith3][1] !== 1){
                result += 1;
            }
            break;
    }
    return result;
};

const checkRules = (prevPrevChord, prevChord, currentChord, rules, checkSumJumpRule) => {
    let result = 0;
    if(prevChord.length){
        for (let i = 0; i < rules.length; i++) {
            let currentResult = rules[i](prevChord, currentChord);
            if (currentResult === -1) return -1;
            result += currentResult
        }
        if (prevPrevChord.length && checkSumJumpRule) {
            let currentResult = forbiddenSumJump(prevPrevChord, prevChord, currentChord);
            if (currentResult === -1) return -1;
            result += currentResult;
        }
    }
    return result
};
/*
//Code for testing:
myPrevPrevChord = [functions.D,[43,1],[59,3],[62,5],[67,1]];
myPrevChord = [functions.T,[48,1],[60,1],[64,3],[67,5]];
myCurrentChord = [functions.S,[41,1],[60,5],[65,1],[69,3]];
const chosenRules = [concurrentOctaves, concurrentFifths, crossingVoices, oneDirection, forbiddenJump, checkConnection];
const result = checkRules(myPrevPrevChord ,myPrevChord, myCurrentChord, chosenRules, true);
console.log(result)
*/