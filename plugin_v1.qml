import QtQuick 2.0
import MuseScore 3.0
import "obj" 

MuseScore {
    menuPath: "Plugins.pluginName"
    description: "Description goes here"
    version: "1.0"
    
    ChordGenerator{id:generator;}
    RulesChecker{id:checker;}


    function get_acords_to_write(){

        var acords_to_write = []

        acords_to_write.push(["T",5])
        acords_to_write.push(["S",3])
        acords_to_write.push(["S",5])
        acords_to_write.push(["D",1])
        acords_to_write.push(["D",3])
        acords_to_write.push(["T",1])
        acords_to_write.push(["T",3])
        acords_to_write.push(["S",1])
        acords_to_write.push(["D",5])
        acords_to_write.push(["D",3])
        acords_to_write.push(["D",1])
        acords_to_write.push(["T",3])
        acords_to_write.push(["S",3])
        acords_to_write.push(["D",5])
        acords_to_write.push(["T",5])

        return acords_to_write
    }


    onRun: {

        if (typeof curScore === 'undefined')
                  Qt.quit();

        var first_acord = []
        first_acord.push(["T", [[48, 1], [60, 1], [64, 3], [67, 5]]])

        var acords_to_write = get_acords_to_write()

        var cursor = curScore.newCursor();
        cursor.rewind(0);
        cursor.setDuration(1, 4);

        generator.addChordsAtCursorPosition(cursor, first_acord);

        var prev_prev_chord = []
        var prev_chord = first_acord[0]

        for (var i=0; i< acords_to_write.length; i++){

            var chords = generator.generateChords(acords_to_write[i][0], acords_to_write[i][1])

            var chord = null
            var best_score = -1

            for (var j = 0; j < chords.length; j++){
                var score = checker.checkAllRules(prev_prev_chord, prev_chord, chords[j])

                  //console.log(score)

                if (score !== -1 ){
                    if (best_score === -1 || best_score > score){
                        chord = chords[j]
                        best_score = score
                    }
                }

            }

            if (chord === null){
                console.log("Hyhyhyhyhy ni ma rozwiązania")
                break;
            }

            //console.log(chord)

            var chord_to_add = []
            chord_to_add.push(chord)

            generator.addChordsAtCursorPosition(cursor, chord_to_add);

            console.log(best_score)
            console.log(chord)

            prev_prev_chord = prev_chord
            prev_chord = chord

        }


//        var chords = generator.generateChords("T", 5);
                                         
//        for(var i=0; i<chords.length;i++){
//            console.log(chords[i]);
//        }
        
        //generator.addChordsAtBegining(chords);

        Qt.quit()
    }
      

}
