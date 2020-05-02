var basicDurChord = [0,4,7];
var basicDur6Chord = [0, 4, 7, 9];
var basicDur7Chord = [0, 4, 7, 10];


function ChordGenerator(key){
    this.key = key;

    function getPossiblePitchValuesFromInterval(note, minPitch, maxPitch){

        while(note - minPitch >= 12 ){
                note = note - 12;
        }
    
        while(note - minPitch < 0){
                note = note + 12;
        }
    
        var possiblePitch = [];
        while(maxPitch - note >= 0){
                possiblePitch.push(note);
                note = note + 12;
        }
    
        return possiblePitch;
    }

    this.generate = function(harmonicFunction){

        var scale = new MajorScale(this.key);

        var basicNote = scale.tonicPitch;

        switch(harmonicFunction.functionName){
            case 'T':
                basicNote += scale.pitches[0];
                break;
            case 'S':
                basicNote += scale.pitches[4];
                break;
            case 'D':
                basicNote += scale.pitches[5];
                break;
        };

        var chordScheme = basicDurChord;
        var schemas = [ [1, 1, 3, 5], [1, 1, 5, 3], [1, 3, 1, 5], [1, 3, 5, 1], [1, 5, 1, 3], [1, 5, 3, 1], [1,3,5,5], [1,5,3,5], [1,5,5,3] ];
        switch(harmonicFunction.extra[0]){
            case 6:
                chordScheme = basicDur6Chord;
                schemas = [ [1, 3, 5, 6], [1, 3, 6, 5], [1, 5, 3, 6], [1, 5, 6, 3],  [1, 6, 3, 5], [1, 6, 5, 3]];
                break;
            case 7:
                chordScheme = basicDur7Chord;
                schemas = [ [1, 3, 5, 7], [1, 3, 7, 5], [1, 5, 3, 7], [1, 5, 7, 3],  [1, 7, 3, 5], [1, 7, 5, 3]];
                break;
        }

        var pryma = basicNote + chordScheme[0];
        var tercja = basicNote + chordScheme[1];
        var kwinta = basicNote + chordScheme[2];
        var added = basicNote + chordScheme[3];

        var chords = [];

        for(var i=0; i< schemas.length; i++){
            var schema_mapped = schemas[i].map(
                function(x){
                    if(x == 1)
                            return pryma;
                    if(x == 3)
                            return tercja;
                    if(x == 5)
                            return kwinta;
                    if(x == 6)
                            return added;
                    if(x == 7)
                            return added;
                }
            );
            
            var vb = new VoicesBoundary()
            var bass = getPossiblePitchValuesFromInterval(schema_mapped[0], vb.bassMin, vb.bassMax);
            var tenor = getPossiblePitchValuesFromInterval(schema_mapped[1], vb.tenorMin, vb.tenorMax);
            var alto = getPossiblePitchValuesFromInterval(schema_mapped[2], vb.altoMin, vb.altoMax);
            var soprano = getPossiblePitchValuesFromInterval(schema_mapped[3], vb.sopranoMin, vb.sopranoMax);
        
            for(var n =0; n< bass.length; n++){
                //console.log(n);
                for(var j=0; j< tenor.length; j++){
                        //console.log(j);
                        if(tenor[j] >= bass[n]){
                            for(var k =0; k< alto.length; k++){
                                    //console.log(k);
                                    if(alto[k] >= tenor[j] && alto[k] - tenor[j] < 12){
                                        for(var m=0; m<soprano.length; m++){
                                                //console.log(m);
                                                if(soprano[m] >= alto[k] && soprano[m] - alto[k] < 12){

                                                    var d1 = {"T": 0, "S": 3, "D" : 4 }; 
                                                    // console.log("----------------------------")
                                                    var bassNote = new Note(bass[n], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][0]-1) % 7, schemas[i][0]);
                                                    var tenorNote = new Note(tenor[j], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][1]-1) % 7, schemas[i][1] );
                                                    var altoNote = new Note(alto[k], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][2]-1) % 7, schemas[i][2] );
                                                    var sopranoNote = new Note(soprano[m], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][3]-1) % 7,schemas[i][3] );
                                                    // console.log(bassNote.toString());
                                                    // console.log(tenorNote.toString());
                                                    // console.log(altoNote.toString());
                                                    // console.log(sopranoNote.toString());
                                                    chords.push(new Chord(sopranoNote, altoNote, tenorNote, bassNote, harmonicFunction));
                                                }
                                        }
                                    }
                            }
                        }
                }
            }
        }
    
        return chords;

    }
}
