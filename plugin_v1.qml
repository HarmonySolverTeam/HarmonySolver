import QtQuick 2.0
import MuseScore 3.0
import "obj" 
import FileIO 3.0
import QtQuick.Dialogs 1.0
import QtQuick.Controls 1.0

MuseScore {
    menuPath: "Plugins.HarmonySolver"
    description: "Description goes here"
    version: "1.0"
    requiresScore: false
    pluginType: "dialog"


    ChordGenerator{id:generator;}
    RulesChecker{id:checker;}
    Parser{id:parser;}

    id:window
    width:  800; height: 500;
    onRun: {}

    function get_chords_to_write(){

        var chords_to_write = []

        chords_to_write.push(["T",5])
        chords_to_write.push(["S",1])
        chords_to_write.push(["S",5])
        chords_to_write.push(["D",1])
        chords_to_write.push(["D",3])
        chords_to_write.push(["T",1])
        chords_to_write.push(["T",3])
        chords_to_write.push(["S",1])
        chords_to_write.push(["D",5])
        chords_to_write.push(["D",3])
        chords_to_write.push(["D",1])
        chords_to_write.push(["T",3])
        chords_to_write.push(["S",3])
        chords_to_write.push(["D",5])
        chords_to_write.push(["T",-1])

        return chords_to_write
    }

    function getKeyName(keyValue){
        switch(keyValue){
            case -7: return "Cb"
            case -6: return "Gb"
            case -5: return "Db"
            case -4: return "Ab"
            case -3: return "Eb"
            case -2: return "Bb"
            case -1: return "F"
            case 0: return "C"
            case 1: return "G"
            case 2: return "D"
            case 3: return "A"
            case 4: return "E"
            case 5: return "B"
            case 6: return "F#"
            case 7: return "C#"
        }
    }


    function findSolution(chords_to_write, current_chord_index, prev_prev_chord, prev_chord, keyName){
            //console.log(current_chord_index)

            //console.log(chords_to_write[current_chord_index])
        var chords = generator.generateChords(chords_to_write[current_chord_index][0], chords_to_write[current_chord_index][1], keyName)

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

            var next_chords = findSolution(chords_to_write,current_chord_index + 1, prev_chord,good_chords[i][1], keyName  )

            if (next_chords.length != 0){
                next_chords.unshift(good_chords[i][1])
                return next_chords
            }

        }

        return []

    }


//    onRun: {
//
//        if (typeof curScore === 'undefined')
//                  Qt.quit();
//
//        var input = "C#\n10,20,30,40\n3/4\nT6{};S7{}\nT{\"position\":3, \"revolution\":5, \"delay\":[[4,3],[9,8]],\"degree\":2, \"extra\":[7], \"omit\":[1], \"down\":false}"
//
//        var parser_test = parser.parse(input)
//
//        //console.log(parser_test)
//
//        var first_chord = []
//        first_chord.push(["T", [[52, 1], [64, 1], [68, 3], [71, 5]]])
//
//        var chords_to_write = get_chords_to_write()
//
//        var cursor = curScore.newCursor();
//        var keyName = getKeyName(cursor.keySignature)
//
//        cursor.rewind(0);
//        cursor.setDuration(1, 4);
//
//        generator.addChordsAtCursorPosition(cursor, first_chord);
//
//        var prev_prev_chord = []
//        var prev_chord = first_chord[0]
//
//        var solution_chords = findSolution(chords_to_write,0,prev_prev_chord, prev_chord, keyName)
//
//        if (solution_chords.length === 0){
//            console.log("Hyhyhyhyhy nie ma rozwiazania")
//        } else {
//            //console.log(solution_chords)
//            generator.addChordsAtCursorPosition(cursor, solution_chords);
//        }
//
//        Qt.quit()
//    }

        FileIO {
              id: myFileAbc
              onError: console.log(msg + "  Filename = " + myFileAbc.source)
              }

          FileIO {
              id: myFile
              source: tempPath() + "/my_file.xml"
              onError: console.log(msg)
              }

          FileDialog {
              id: fileDialog
              title: qsTr("Please choose a file")
              onAccepted: {
                  var filename = fileDialog.fileUrl
                  //console.log("You chose: " + filename)

                  if(filename){
                      myFileAbc.source = filename
                      //read abc file and put it in the TextArea
                      abcText.text = myFileAbc.read()
                      }
                  }
              }

            FileDialog {
              id: fileDialogParse
              title: qsTr("Please choose a file to parse")
              onAccepted: {
                  var filename = fileDialog.fileUrl
                  //console.log("You chose: " + filename)

                  if(filename){
                      myFileAbc.source = filename
                      //read abc file and put it in the TextArea
                      var input_text = String(myFileAbc.read())
                      var parser_test = parser.parse(input_text)
                       abcText.text = parser_test
                      }
                  }
              }

          Label {
              id: textLabel
              wrapMode: Text.WordWrap
              text: qsTr("Your task will show here")
              font.pointSize:12
              anchors.left: window.left
              anchors.top: window.top
              anchors.leftMargin: 10
              anchors.topMargin: 10
              }

          // Where people can paste their ABC tune or where an ABC file is put when opened
          TextArea {
              id:abcText
              anchors.top: textLabel.bottom
              anchors.left: window.left
              anchors.right: window.right
              anchors.bottom: buttonOpenFile.top
              anchors.topMargin: 10
              anchors.bottomMargin: 10
              anchors.leftMargin: 10
              anchors.rightMargin: 10
              width:parent.width
              height:400
              wrapMode: TextEdit.WrapAnywhere
              textFormat: TextEdit.PlainText
              }

          Button {
              id : buttonOpenFile
              text: qsTr("Open file")
              anchors.bottom: window.bottom
              anchors.left: abcText.left
              anchors.topMargin: 10
              anchors.bottomMargin: 10
              anchors.leftMargin: 10
              onClicked: {
                  fileDialog.open();
                  }
              }

          Button {
              id : buttonParse
              text: qsTr("Parse file")
              anchors.bottom: window.bottom
              anchors.left: buttonOpenFile.right
              anchors.topMargin: 10
              anchors.bottomMargin: 10
              anchors.leftMargin: 10
              onClicked: {
                      fileDialogParse.open()
                  }
              }

          Button {
              id : buttonRun
              text: qsTr("Run")
              anchors.bottom: window.bottom
              anchors.left: buttonParse.right
              anchors.topMargin: 10
              anchors.bottomMargin: 10
              anchors.leftMargin: 10
              onClicked: {
                  if (typeof curScore === 'undefined')
                            Qt.quit();

                 // var input = 'C#\n10,20,30,40\n3/4\nT6{};S7{}\nT{"position":3, "revolution":5, "delay":[[4,3],[9,8]],"degree":2, "extra":[7], "omit":[1], "down":false}'

                //  var parser_test = parser.parse(input)

                  //console.log(parser_test)

                  var first_chord = []
                  first_chord.push(["T", [[52, 1], [64, 1], [68, 3], [71, 5]]])

                  var chords_to_write = get_chords_to_write()

                  var cursor = curScore.newCursor();
                  var keyName = getKeyName(cursor.keySignature)

                  cursor.rewind(0);
                  cursor.setDuration(1, 4);

                  generator.addChordsAtCursorPosition(cursor, first_chord);

                  var prev_prev_chord = []
                  var prev_chord = first_chord[0]

                  var solution_chords = findSolution(chords_to_write,0,prev_prev_chord, prev_chord, keyName)

                  if (solution_chords.length === 0){
                      console.log("Hyhyhyhyhy nie ma rozwiazania")
                  } else {
                      //console.log(solution_chords)
                      generator.addChordsAtCursorPosition(cursor, solution_chords);
                  }
                  }
              }


          Button {
              id : buttonCancel
              text: qsTr("Cancel")
              anchors.bottom: window.bottom
              anchors.right: abcText.right
              anchors.topMargin: 10
              anchors.bottomMargin: 10
              onClicked: {
                      Qt.quit();
                  }
              }






}
