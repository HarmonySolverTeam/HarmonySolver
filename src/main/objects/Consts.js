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
    'Cb': 71
}

function minorKeyBySignature(signature) {
    switch (signature) {
        case 0:
            return "A";
        case 1:
            return "E";
        case 2:
            return "B";
        case 3:
            return "F#";
        case 4:
            return "C#";
        case 5:
            return "G#";
        case 6:
            return "D#";
        case 7:
            return "A#";
        case -1:
            return "D";
        case -2:
            return "G";
        case -3:
            return "C";
        case -4:
            return "F";
        case -5:
            return "Bb";
        case -6:
            return "Eb";
        case -7:
            return "Ab";
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
    'Cb': BASE_NOTES.C
}

function VoicesBoundary() {
    this.sopranoMax = 81;
    this.sopranoMin = 60;
    this.altoMax = 74;
    this.altoMin = 53;
    this.tenorMax = 69;
    this.tenorMin = 48;
    this.bassMax = 62;
    this.bassMin = 41;
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
var possible_keys_minor = ['c', 'c#', 'db',
    'd', 'eb', 'e', 'f', 'f#', 'gb', 'g', 'ab', 'a',
    'bb', 'b', 'cb']

//G
var possible_systems = ['close', 'open']
//G
var basicMajorChord = [0, 4, 7];
//G
var basicMinorChord = [0, 3, 7];

var ALTERATIONS = {
    SHARP: "#",
    FLAT: "b",
    NATURAL: "h"
}

