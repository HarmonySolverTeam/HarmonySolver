//G
var keyStrPitch = {
    'C': 60,
    'C#': 61,
    'Db': 61,
    'D': 62,
    'Eb': 63,
    'E': 64,
    'F': 65,
    'F#': 66,
    'Gb': 66,
    'G': 67,
    'Ab': 68,
    'A': 69,
    'Bb': 70,
    'B': 71,
    'Cb': 71,

    'c': 60,
    'c#': 61,
    'd': 62,
    'd#': 63,
    'eb': 63,
    'e': 64,
    'f': 65,
    'f#': 66,
    'g': 67,
    'g#': 68,
    'ab': 68,
    'a': 69,
    'a#': 70,
    'bb': 70,
    'b': 71
}

function minorKeyBySignature(signature) {
    switch (signature) {
        case 0:
            return "a";
        case 1:
            return "e";
        case 2:
            return "b";
        case 3:
            return "f#";
        case 4:
            return "c#";
        case 5:
            return "g#";
        case 6:
            return "d#";
        case 7:
            return "a#";
        case -1:
            return "d";
        case -2:
            return "g";
        case -3:
            return "c";
        case -4:
            return "f";
        case -5:
            return "bb";
        case -6:
            return "eb";
        case -7:
            return "ab";
    }
}

function majorKeyBySignature(signature) {
    switch (signature) {
        case 0:
            return "C";
        case 1:
            return "G";
        case 2:
            return "D";
        case 3:
            return "A";
        case 4:
            return "E";
        case 5:
            return "B";
        case 6:
            return "F#";
        case 7:
            return "C#";
        case -1:
            return "F";
        case -2:
            return "Bb";
        case -3:
            return "Eb";
        case -4:
            return "Ab";
        case -5:
            return "Db";
        case -6:
            return "Gb";
        case -7:
            return "Cb";
    }
}

//G
var BASE_NOTES = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6
}

//G
var keyStrBase = {
    'C': BASE_NOTES.C,
    'C#': BASE_NOTES.C,
    'Db': BASE_NOTES.D,
    'D': BASE_NOTES.D,
    'Eb': BASE_NOTES.E,
    'E': BASE_NOTES.E,
    'F': BASE_NOTES.F,
    'F#': BASE_NOTES.F,
    'Gb': BASE_NOTES.G,
    'G': BASE_NOTES.G,
    'Ab': BASE_NOTES.A,
    'A': BASE_NOTES.A,
    'Bb': BASE_NOTES.B,
    'B': BASE_NOTES.B,
    'Cb': BASE_NOTES.C,

    'c': BASE_NOTES.C,
    'c#': BASE_NOTES.C,
    'd': BASE_NOTES.D,
    'd#': BASE_NOTES.D,
    'eb': BASE_NOTES.E,
    'e': BASE_NOTES.E,
    'f': BASE_NOTES.F,
    'f#': BASE_NOTES.F,
    'g': BASE_NOTES.G,
    'g#': BASE_NOTES.G,
    'ab': BASE_NOTES.A,
    'a': BASE_NOTES.A,
    'a#': BASE_NOTES.A,
    'bb': BASE_NOTES.B,
    'b': BASE_NOTES.B
}

function VoicesBoundary() {
    this.sopranoMax = 81;
    this.sopranoMin = 60;
    this.altoMax = 74;
    this.altoMin = 53;
    this.tenorMax = 69;
    this.tenorMin = 48;
    this.bassMax = 62;
    this.bassMin = 39;
}

//G
var VOICES = {
    SOPRANO: 0,
    ALTO: 1,
    TENOR: 2,
    BASS: 3
}
//G
var FUNCTION_NAMES = {
    TONIC: "T",
    SUBDOMINANT: "S",
    DOMINANT: "D"
}

//G
var possible_keys_major = ['C', 'C#', 'Db',
    'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A',
    'Bb', 'B', 'Cb']

//G
var possible_keys_minor = ['c', 'c#',
    'd', 'd#', 'eb', 'e', 'f', 'f#', 'g', 'g#', 'ab', 'a',
    'a#', 'bb', 'b']

//G
var possible_systems = ['close', 'open']
//G
var basicMajorChord = [0, 4, 7];
//G
var basicMinorChord = [0, 3, 7];

//G
var ALTERATIONS = {
    SHARP: "#",
    FLAT: "b",
    NATURAL: "h"
};

//G
var MODE = {
    MAJOR: "major",
    MINOR: "minor"
}

//G
var DEFLECTION_TYPE = {
    CLASSIC: 0,
    BACKWARDS: 1,
    ELIPSE: 2
}

//G
var MEASURE_PLACE = {
    UPBEAT: 0,
    DOWNBEAT: 1,
    BEGINNING: 2
}

//G
var keyFromPitchBasenoteAndMode = {
    "60,0,major": 'C',
    "61,0,major": 'C#',
    "61,1,major": 'Db',
    "62,1,major": 'D',
    "63,2,major": 'Eb',
    "64,2,major": 'E',
    "65,3,major": 'F',
    "66,3,major": 'F#',
    "66,4,major": 'Gb',
    "67,4,major": 'G',
    "68,5,major": 'Ab',
    "69,5,major": 'A',
    "70,6,major": 'Bb',
    "71,6,major": 'B',
    "71,0,major": 'Cb',
    "60,0,minor": 'c',
    "61,0,minor": 'c#',
    "62,1,minor": 'd',
    "63,1,minor": 'd#',
    "63,2,minor": 'eb',
    "64,2,minor": 'e',
    "65,3,minor": 'f',
    "66,3,minor": 'f#',
    "67,4,minor": 'g',
    "68,4,minor": 'g#',
    "68,5,minor": 'ab',
    "69,5,minor": 'a',
    "70,5,minor": 'a#',
    "70,6,minor": 'bb',
    "71,6,minor": 'b',
    "69,6,major": 'Bbb'
}
//G
var PREFERENCES_NAMES = {
    PRECHECK: "precheck",
    CORRECT: "correct",
    PRINT_SYMBOLS: "printSymbols",
    PRINT_COMPONENTS: "printComponents"
}

//G
var CHORD_RULES = {
    ConcurrentOctaves: "ConcurrentOctaves",
    ConcurrentFifths: "ConcurrentFifths",
    CrossingVoices: "CrossingVoices",
    OneDirection: "OneDirection",
    ForbiddenJump: "ForbiddenJump",
    HiddenOctaves: "Hidden consecutive octaves",
    FalseRelation: "FalseRelation",
    SameFunctionCheckConnection: "SameFunctionCheckConnection",
    IllegalDoubledThird: "IllegalDoubledThird",
}
