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
        acords_to_write.push(["T",-1])
        return acords_to_write
    }


    function findSolution(chords_to_write, current_chord_index, prev_prev_chord, prev_chord){
            //console.log(current_chord_index)

            //console.log(chords_to_write[current_chord_index])
        var chords = generator.generateChords(chords_to_write[current_chord_index][0], chords_to_write[current_chord_index][1], "E")

        var good_chords = []

        for (var j = 0; j < chords.length; j++){
            console.log(chords[j].toString())
            var score = checker.checkAllRules(prev_prev_chord, prev_chord, chords[j])

              //console.log(score)
              //console.log(chords[j])

            if (score !== -1 ){
                good_chords.push([score,chords[j]])
            }

        }

        if (good_chords.length === 0){
            return [];
        }

        good_chords.sort(function(a,b){(a[0] > b[0]) ? 1 : -1})

        if (current_chord_index+1 === chords_to_write.length){
            //console.log(good_chords[0][1])
            return [good_chords[0][1]];
        }

        for (var i = 0; i< good_chords.length; i++){

            var next_chords = findSolution(chords_to_write,current_chord_index + 1, prev_chord,good_chords[i][1]  )

            if (next_chords.length != 0){
                next_chords.unshift(good_chords[i][1])
                return next_chords
            }

        }

        return []

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

        var solution_chords = findSolution(acords_to_write,0,prev_prev_chord, prev_chord)

        if (solution_chords.length === 0){
            console.log("Hyhyhyhyhy nie ma rozwiazania")
        } else {
            //console.log(solution_chords)
            generator.addChordsAtCursorPosition(cursor, solution_chords);
        }

        Qt.quit()
    }
      

}
