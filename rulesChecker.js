const abs = (a) => {
  return a>0?a:-a;
};

const concurrentOctaves = (prevChord, currentChord) => {
    for(let i = 0; i < 3; i++){
        for(let j = i + 1; j < 4; j++){
            if((prevChord[j]-prevChord[i])%12 === 0){
                if((currentChord[j]-currentChord[i])%12 === 0){
                    return -1;
                }
            }
        }
    }
    return 0;
};

const concurrentFifths = (prevChord, currentChord) => {
    for(let i = 0; i < 3; i++){
        for(let j = i + 1; j < 4; j++){
            if((prevChord[j]-prevChord[i])%7 === 0){
                if((currentChord[j]-currentChord[i])%7 === 0){
                    return -1;
                }
            }
        }
    }
    return 0;
};

const crossingVoices = (prevChord, currentChord) => {
    for(let i = 0; i < 3; i++){
        if(currentChord[i]>prevChord[i+1]) return -1
    }
    return 0;
};

const oneDirection = (prevChord, currentChord) => {
    if((currentChord[0]>prevChord[0] && currentChord[1]>prevChord[1] && currentChord[2]>prevChord[2] && currentChord[2]>prevChord[2])
        ||(currentChord[0]<prevChord[0] && currentChord[1]<prevChord[1] && currentChord[2]<prevChord[2] && currentChord[3]<prevChord[3]))
        return -1;
    return 0;
};

const forbiddenJump = (prevChord, currentChord) => {
    //altered intervals or greater than 6 are forbidden
    //TODO altered intervals?
    for(let i = 0; i < 4; i++){
        if(abs(currentChord[i]-prevChord[i])>9) return -1;
    }
    return 0;
};

const forbiddenSumJump = (prevPrevChord, prevChord, currentChord) => {
    for(let i = 0; i < 4; i++){
        if(((prevPrevChord[i]>prevChord[i] && prevChord[i]>currentChord[i]) ||
            (prevPrevChord[i]<prevChord[i] && prevChord[i]<currentChord[i]))
            && forbiddenJump(prevPrevChord, currentChord)) return -1;
    }
    return 0;
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
myPrevPrevChord = [43,58,62,67];
myPrevChord = [48,60,64,67];
myCurrentChord = [41,60,65,69];
const chosenRules = [concurrentOctaves, concurrentFifths, crossingVoices, oneDirection, forbiddenJump];
const result = checkRules(myPrevPrevChord ,myPrevChord, myCurrentChord, chosenRules, true);
console.log(result)
 */