var keyStrPitch = {
    'C'  : 60,
    'C#' : 61,
    'Db' : 61,
    'D'  : 62, 
    'Eb' : 63,
    'E'  : 64,
    'F'  : 65, 
    'F#' : 66, 
    'Gb' : 66, 
    'G'  : 67, 
    'Ab' : 68, 
    'A'  : 69,
    'Bb' : 70,
    'B'  : 71, 
    'Cb' : 71
}

var keyStrBase = { 
    'C'  : BASE_NOTES.C,
    'C#' : BASE_NOTES.C,
    'Db' : BASE_NOTES.D,
    'D'  : BASE_NOTES.D, 
    'Eb' : BASE_NOTES.E,
    'E'  : BASE_NOTES.E,
    'F'  : BASE_NOTES.F, 
    'F#' : BASE_NOTES.F, 
    'Gb' : BASE_NOTES.G, 
    'G'  : BASE_NOTES.G, 
    'Ab' : BASE_NOTES.A, 
    'A'  : BASE_NOTES.A,
    'Bb' : BASE_NOTES.B,
    'B'  : BASE_NOTES.B, 
    'Cb' : BASE_NOTES.C
}

function VoicesBoundary(){
    this.sopranoMax = 81;
    this.sopranoMin = 60;
    this.altoMax = 74;
    this.altoMin = 53;
    this.tenorMax = 69;
    this.tenorMin = 48;
    this.bassMax = 62;
    this.bassMin = 41;
}


var VOICES = {
    SOPRANO: 0,
    ALTO: 1,
    TENOR: 2,
    BASS: 3
}

var FUNCTION_NAMES = {
    TONIC: "T",
    SUBDOMINANT: "S",
    DOMINANT: "D"
}

function BASE_NOTES() {
    this.C = 0;
    this.D = 1;
    this.E = 2;
    this.F = 3;
    this.G = 4;
    this.A = 5;
    this.B = 6;
}

var possible_keys_major = ['C', 'C#', 'Db',
    'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A',
    'Bb', 'B', 'Cb']

var possible_keys_minor = ['c', 'c#', 'db',
    'd', 'eb', 'e', 'f', 'f#', 'gb', 'g', 'ab', 'a',
    'bb', 'b', 'cb']

var possible_systems = ['close', 'open', '-']

var basicDurChord = [0,4,7];
