
function Note(pitch, baseNote, chordComponent) {
    this.pitch = pitch
    this.baseNote = baseNote
    this.chordComponent = chordComponent

    this.toString = function(){
        return this.pitch + " " + this.baseNote + " " + this.chordComponent;
    }

}
