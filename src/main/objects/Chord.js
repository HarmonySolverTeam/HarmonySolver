function Chord(sopranoNote, altoNote, tenorNote, bassNote, harmonicFunction) {
    this.sopranoNote = sopranoNote
    this.altoNote = altoNote
    this.tenorNote = tenorNote
    this.bassNote = bassNote
    this.harmonicFunction = harmonicFunction
    this.notes = [bassNote, tenorNote, altoNote, sopranoNote]
    this.duration = undefined

    this.toString = function () {
        var chordStr = "CHORD: \n";
        chordStr += this.sopranoNote.toString() + "\n";
        chordStr += this.altoNote.toString() + "\n";
        chordStr += this.tenorNote.toString() + "\n";
        chordStr += this.bassNote.toString() + "\n";
        return chordStr;
    }
}
