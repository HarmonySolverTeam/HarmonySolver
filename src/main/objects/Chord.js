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
        chordStr += "Soprano note: " + this.sopranoNote.toString() + "\n";
        chordStr += "Alto note: " + this.altoNote.toString() + "\n";
        chordStr += "Tenor note: " + this.tenorNote.toString() + "\n";
        chordStr += "Bass note: " + this.bassNote.toString() + "\n";
        return chordStr;
    }

    this.countBaseComponents = function(baseComponentString){
        var counter = 0;
        for(var i = 0; i < this.notes.length; i++){
            if(this.notes[i].baseChordComponentEquals(baseComponentString)){
                counter ++;
            }
        }
        return counter
    }
}
