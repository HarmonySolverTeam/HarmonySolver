
function Note(pitch, baseNote, chordComponent) {
    this.pitch = pitch
    this.baseNote = baseNote
    this.chordComponent = chordComponent

    this.toString = function(){
        if(this.pitch == undefined) return undefined;
        return this.pitch + " " + this.baseNote + " " + this.chordComponent;
    }

}
