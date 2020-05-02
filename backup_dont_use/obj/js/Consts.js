
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
