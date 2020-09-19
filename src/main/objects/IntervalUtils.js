.import "./Utils.js" as Utils

function isOctaveOrPrime(note1, note2){
    return note1.baseNote === note2.baseNote;
}

function isFive(note1, note2){
    //todo co ze swobodnym rozwiazaniem septymy?
    if(note1.pitch > note2.pitch)
        return Utils.contains([4, -3],  note1.baseNote - note2.baseNote);
    else
        return Utils.contains([-4, 3],  note1.baseNote - note2.baseNote);
}

function isChromaticAlteration(note1, note2){
    return note1.baseNote === note2.baseNote && Utils.mod(Utils.abs(note1.pitch-note2.pitch),12) === 1;
}

function pitchOffsetBetween(note1, note2){
    return Utils.abs(note1.pitch - note2.pitch)
}

function getBaseDistance(firstBaseNote, secondBaseNote){
    var i = 0;
    while(firstBaseNote!==secondBaseNote) {
        firstBaseNote = Utils.mod((firstBaseNote+1), 7);
        i++;
    }
    return i
}

function isAlteredInterval(note1, note2){
    var halfToneDist = note1.pitch-note2.pitch;
    var firstBase = note1.baseNote;
    var secondBase = note2.baseNote;
    var baseDistance = -1;
    if(halfToneDist>0){
        baseDistance = getBaseDistance(secondBase, firstBase);
    } else{
        baseDistance = getBaseDistance(firstBase, secondBase);
        if(halfToneDist === 0 && baseDistance !== 1) baseDistance = 1;
        halfToneDist = -halfToneDist
    }
    if(halfToneDist > 12){
        if(Utils.mod(halfToneDist, 12) === 0) halfToneDist = 12;
        else halfToneDist = Utils.mod(halfToneDist, 12);
    }
    var alteredIntervals = {3:1, 5:2, 6:3, 8:4, 10:5, 12:6};
    return alteredIntervals[halfToneDist] === baseDistance
}
