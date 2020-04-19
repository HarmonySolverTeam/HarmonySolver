class Exercise {
    constructor(key, meter, system, measures, first_chord) {
        this.key = key
        this.meter = meter
        this.system = system
        this.measures = measures
        this.first_chord = first_chord
    }
}

const VOICES = {
    SOPRANO : 0,
    ALTO : 1,
    TENOR : 2,
    BASS : 3
}

const FUNCTION_NAMES = {
    TONIC : "T",
    SUBDOMINANT : "S",
    DOMINANT : "D"
}

const BASE_NOTES = {
    C : 0,
    D : 1,
    E : 2,
    F : 3,
    G : 4,
    A : 5,
    B : 6
}

var possible_keys = ['C', 'C#', 'Db',
    'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A',
    'Hb', 'H', 'Cb']

var possible_systems = ['close', 'open', '-']

class HarmonicFunction{
    constructor(functionName, degree, position, revolution, delay, extra, omit, down) {
        this.functionName = functionName
        this.degree = degree
        this.position = position
        this.revolution = revolution
        this.delay = delay //delayed components list
        this.extra = extra //extra components list
        this.omit = omit //omitted components list
        this.down = down //true or false
    }
}

class Chord{
    constructor(sopranoNote, altoNote, tenorNote, bassNote, harmonicFunction) {
        this.sopranoNote = sopranoNote
        this.altoNote = altoNote
        this.tenorNote = tenorNote
        this.bassNote = bassNote
        this.harmonicFunction = harmonicFunction
    }
}

class Note{
    constructor(pitch, baseNote){
        this.pitch = pitch
        this.baseNote = baseNote
    }
}

class Scale{
    constructor(baseNote){
        this.baseNote = baseNote
    }
}

class MajorScale extends Scale{
    constructor(baseNote){
        super(baseNote)
        this.pitches = [0, 2, 4, 5, 7, 9, 11]
    }
}

var dur = new MajorScale(BASE_NOTES.C)
var n1 = new Note(48, BASE_NOTES.C)
var n2 = new Note(60, BASE_NOTES.C)
var n3 = new Note(64, BASE_NOTES.E)
var n4 = new Note(67, BASE_NOTES.G)

var chord = new Chord(n4, n3, n2, n1, new HarmonicFunction(FUNCTION_NAMES.TONIC,0, 0, 0, [], [], [], false))
console.log(chord)
