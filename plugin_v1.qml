import QtQuick 2.0
import MuseScore 3.0
import "obj" 
import FileIO 3.0
import QtQuick.Dialogs 1.0
import QtQuick.Controls 1.0


import "./obj/js/Objects.js" as Objects

MuseScore {
    menuPath: "Plugins.HarmonySolver"
    description: "Description goes here"
    version: "1.0"
    requiresScore: false
    pluginType: "dialog"


    ChordGenerator{id:generator;}
    RulesChecker{id:checker;}
    Parser{id:parser;}
    property var exercise : ({})
    id:window
    width:  800; height: 500;
    onRun: {}

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
                  if(filename){
                      myFileAbc.source = filename
                      var input_text = String(myFileAbc.read())
                      exercise = parser.parse(input_text)
                      abcText.text = JSON.stringify(exercise)
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
                var solver = new Objects.Solver(exercise);
                var solution = solver.solve();
                var number = Math.floor(100000 * Math.random());
                readScore(filePath+"/template scores/"+solution.exercise.key+"_"+solution.exercise.mode+".mscz")
                writeScore(curScore, filePath+"/solutions/harmonic functions exercise/solution"+number,"mscz")
                closeScore(curScore)
                readScore(filePath+"/solutions/harmonic functions exercise/solution"+number+".mscz")
                solution.setDurations();

                curScore.appendMeasures(solution.exercise.measures.length - 1);
                var cursor = curScore.newCursor();
                cursor.rewind(0)
                var lastSegment = false
                for(var i=0; i<solution.chords.length; i++){
                    var curChord = solution.chords[i]
                    if(i === solution.chords.length - 1) lastSegment = true
                    
                    function selectSoprano(cursor){
                        cursor.track = 0;
                    }
                    function selectAlto(cursor){
                        cursor.track = 1;
                    }
                    function selectTenor(cursor){
                        cursor.track = 4;
                    }
                    function selectBass(cursor){
                        cursor.track = 5;
                    }
                    cursor.setDuration(curChord.duration[0],curChord.duration[1])
                    selectSoprano(cursor);
                    cursor.addNote(curChord.sopranoNote.pitch, false);
                    if(!lastSegment) cursor.prev();

                    cursor.setDuration(curChord.duration[0],curChord.duration[1])
                    selectAlto(cursor);
                    cursor.addNote(curChord.altoNote.pitch, false);
                    if(!lastSegment) cursor.prev()

                    cursor.setDuration(curChord.duration[0],curChord.duration[1])
                    selectTenor(cursor);
                    cursor.addNote(curChord.tenorNote.pitch, false);
                    if(!lastSegment) cursor.prev()

                    cursor.setDuration(curChord.duration[0],curChord.duration[1])
                    selectBass(cursor);
                    cursor.addNote(curChord.bassNote.pitch, false);
                }
                writeScore(curScore, filePath+"/solutions/harmonic functions exercise/solution"+number,"mscz")
                Qt.quit()
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
