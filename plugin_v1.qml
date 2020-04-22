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

                var cursor = curScore.newCursor();
                //solution.drawAtScore(cursor);
                }
              }

//             Button {
//               id : buttonGeneratorTest
//               text: qsTr("Gen Test")
//               anchors.bottom: window.bottom
//               anchors.left: buttonRun.right
//               anchors.topMargin: 10
//               anchors.bottomMargin: 10
//               anchors.leftMargin: 10
//               onClicked: {
//                   var cg = new Objects.ChordGenerator("C");
//
//                   var hf = new Objects.HarmonicFunction("T", "", 3, "", "",[7], "", "");
//
//                   var chordsList = cg.generate(hf);
//                   chordsList.forEach(function (element){    console.log(element.toString());   })
//                   }
//               }

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
