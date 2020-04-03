import QtQuick 2.0

QtObject
{
    property int sopranoMax : 81;
    property int sopranoMin : 60;
    property int altoMax : 74;
    property int altoMin : 53;
    property int tenorMax : 69;
    property int tenorMin : 48;
    property int bassMax : 62;
    property int bassMin : 41;
    property var dur : [0, 2, 4, 5, 7, 9, 11];
    property var basic_dur_chord : [0, 4, 7];

    function min(a,b){
        return a<=b?a:b
    }
    
    function max(a,b){
        return a>b?a:b
    }

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

    function generateChords(chordType){
        
        var basicNote;

        if(chordType == "T") basicNote = 60;
        if(chordType == "S") basicNote = 65;
        if(chordType == "D") basicNote = 67;

        var pryma = basicNote + basic_dur_chord[0];
        var tercja = basicNote + basic_dur_chord[1];
        var kwinta = basicNote + basic_dur_chord[2];

        var schemas = [ [1,1,3,5], [1, 1, 5, 3], [1, 3, 1, 5], [1, 3, 5, 1], [1, 5, 1, 3], [1, 5, 3, 1], [1,3,5,5], [1,5,3,5], [1,5,5,3] ];
        var chords = [];
        for(var i=0; i< schemas.length; i++){
            schemas[i] = schemas[i].map(
                function(x){
                    if(x == 1)
                            return pryma;
                    if(x == 3)
                            return tercja;
                    if(x ==5)
                            return kwinta;
                }
            );
                
            var bass = getPossiblePitchValuesFromInterval(schemas[i][0], bassMin, bassMax);
            var tenor = getPossiblePitchValuesFromInterval(schemas[i][1], tenorMin, tenorMax);
            var alto = getPossiblePitchValuesFromInterval(schemas[i][2], altoMin, altoMax);
            var soprano = getPossiblePitchValuesFromInterval(schemas[i][3], sopranoMin, sopranoMax);
            
            
            /*console.log("------------");
            console.log(schemas[i]);
            console.log("------------");
            console.log(bass);
            console.log(tenor);
            console.log(alto);
            console.log(soprano);
            console.log("  ");*/
            

            for(var n =0; n< bass.length; n++){
                console.log(n);
                for(var j=0; j< tenor.length; j++){
                        console.log(j);
                        if(tenor[j] >= bass[n]){
                            for(var k =0; k< alto.length; k++){
                                    console.log(k);
                                    if(alto[k] >= tenor[j] && alto[k] - tenor[j] < 12){
                                        for(var m=0; m<soprano.length; m++){
                                                console.log(m);
                                                if(soprano[m] >= alto[k] && soprano[m] - alto[k] < 12){

                                                    chords.push([bass[n], tenor[j], alto[k], soprano[m]]);

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
    
    function addChords(chords){
        
        var cursor = curScore.newCursor();
        cursor.rewind(0);
        cursor.setDuration(1, 4);

        for(var i=0; i<chords.length;i++){
            var chord = chords[i];
        
            cursor.track = 4;
            cursor.addNote(chord[0], false);
            cursor.prev()
            cursor.addNote(chord[1], true);
            cursor.prev()

            cursor.track = 0;
            cursor.addNote(chord[2], false);
            cursor.prev()
            cursor.addNote(chord[3], true);
        }
        
    }
}