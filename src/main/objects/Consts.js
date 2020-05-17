//G
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

//G
var keyStrBase = { 
    'C'  : (new BASE_NOTES()).C,
    'C#' : (new BASE_NOTES()).C,
    'Db' : (new BASE_NOTES()).D,
    'D'  : (new BASE_NOTES()).D, 
    'Eb' : (new BASE_NOTES()).E,
    'E'  : (new BASE_NOTES()).E,
    'F'  : (new BASE_NOTES()).F, 
    'F#' : (new BASE_NOTES()).F, 
    'Gb' : (new BASE_NOTES()).G, 
    'G'  : (new BASE_NOTES()).G, 
    'Ab' : (new BASE_NOTES()).A, 
    'A'  : (new BASE_NOTES()).A,
    'Bb' : (new BASE_NOTES()).B,
    'B'  : (new BASE_NOTES()).B, 
    'Cb' : (new BASE_NOTES()).C
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

function BASE_NOTES() {
    this.C = 0;
    this.D = 1;
    this.E = 2;
    this.F = 3;
    this.G = 4;
    this.A = 5;
    this.B = 6;
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
var basicMajorChord = [0,4,7];
//G
var basicMinorChord =  [0,3,7];
