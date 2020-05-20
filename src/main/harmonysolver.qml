import QtQuick 2.0
import MuseScore 3.0
import FileIO 3.0
import QtQuick.Dialogs 1.0
import QtQuick.Controls 1.0

//import "./qml_components"

import "./objects/Solver.js" as Solver
import "./objects/Parser.js" as Parser
import "./objects/FiguredBass.js" as FiguredBass
import "./objects/Note.js" as Note
import "./objects/Consts.js" as Consts
import "./objects/BassTranslator.js" as Translator

MuseScore {
    menuPath: "Plugins.HarmonySolver"
    description: "This plugin solves harmonics exercises"
    version: "1.0"
    requiresScore: false
    pluginType: "dock"
    dockArea:   "right"


    property var exercise : ({})
    id:window
    width:  800; height: 500;
    onRun: {
      var ex = read_figured_bass();
      console.log(ex.elements);
      var exercise = Translator.createExerciseFromFiguredBass(ex)
      console.log(JSON.stringify(exercise))
      var bassLine = [];
      for(var i = 0; i < ex.elements.length; i++){
        bassLine.push(ex.elements[i].bassNote)
      }
      var solver = new Solver.Solver(exercise);
      var solution = solver.solve();
      var solution_date = get_solution_date()

      prepare_score_for_solution(filePath, solution, solution_date, false)

      fill_score_with_solution(solution, ex.durations)

      writeScore(curScore, filePath+"/solutions/harmonic functions exercise/solution"+solution_date,"mscz")

      // translate (remember about durations attribute!)
      // solve first exercise
      // print solution (remember about durations)
    }


    function getBaseNote(museScoreBaseNote){
            var result;
            switch(museScoreBaseNote){
                case 0:
                      result = Consts.BASE_NOTES.F;
                      break;
                case 1:
                      result = Consts.BASE_NOTES.C;
                      break;
                case 2:
                      result = Consts.BASE_NOTES.G;
                      break;
                case 3:
                      result = Consts.BASE_NOTES.D;
                      break;
                case 4:
                      result = Consts.BASE_NOTES.A;
                      break;
                case 5:
                      result = Consts.BASE_NOTES.E;
                      break;
                case 6:
                      result = Consts.BASE_NOTES.B;
                      break;
            }
            return result;
    }

    function read_figured_bass(){
            var cursor = curScore.newCursor();
            cursor.rewind(0);
            var elements = [];
            var bassNote, key, mode;
            var durations = [];
            var lastBaseNote, lastPitch;
            var meter = [cursor.measure.timesigActual.numerator, cursor.measure.timesigActual.denominator];
            do {
                 var symbols = [];
                 durations.push([cursor.element.duration.numerator,cursor.element.duration.denominator]);
                 if(typeof cursor.element.parent.annotations[0] !== "undefined"){
                      var readSymbols = cursor.element.parent.annotations[0].text;
                      if(!Parser.check_figured_bass_symbols(readSymbols)) throw ("Wrong symbols: "+symbols)
                      for(var i = 0; i < readSymbols.length; i++){
                        var symbol = "";
                        while(i < readSymbols.length && readSymbols[i] !== "\n"){
                              if(readSymbols[i] !== " " && readSymbols[i] !== "\t"){
                                    symbol += readSymbols[i];
                              }
                              i++;
                        }
                        symbols.push(symbol);
                      }
                 }
                 lastBaseNote = getBaseNote((cursor.element.notes[0].tpc+1)%7);
                 lastPitch = cursor.element.notes[0].pitch;
                 bassNote = new Note.Note(lastPitch, lastBaseNote, 0);
                 elements.push(new FiguredBass.FiguredBassElement(bassNote, symbols));
            } while(cursor.next())
            lastPitch = lastPitch%12
            var majorKey = Consts.majorKeyBySignature(curScore.keysig);
            var minorKey = Consts.minorKeyBySignature(curScore.keysig);
            if(Consts.keyStrPitch[majorKey]%12 === lastPitch && Consts.keyStrBase[majorKey] === lastBaseNote){
                  key = majorKey;
                  mode = "major";
            } else{
                  if(Consts.keyStrPitch[minorKey]%12 === lastPitch && Consts.keyStrBase[minorKey] === lastBaseNote){
                        key = minorKey;
                        mode = "minor";
                  } else {
                        throw ("Wrong last note. Bass line should end on Tonic.")
                  }
            }
            return new FiguredBass.FiguredBassExercise(mode, key, meter, elements, durations);
    }

    function get_solution_date(){
            var date = new Date()
            var ret = "_"
            ret += date.getFullYear() + "_" +(date.getMonth() + 1) + "_" + date.getDate() + "_"
            ret += date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds()
            console.log(ret)
            return ret
        }


        function prepare_score_for_solution(filePath, solution, solution_date, setDurations){
            readScore(filePath+"/template scores/"+solution.exercise.key+"_"+solution.exercise.mode+".mscz")
            writeScore(curScore, filePath+"/solutions/harmonic functions exercise/solution"+solution_date,"mscz")
            closeScore(curScore)
            readScore(filePath+"/solutions/harmonic functions exercise/solution"+solution_date+".mscz")
            if (setDurations){
               solution.setDurations();
            }
        }

        function fill_score_with_solution(solution, durations){
            var cursor = curScore.newCursor();
            cursor.rewind(0)
            var ts = newElement(Element.TIMESIG)
            ts.timesig = fraction(solution.exercise.meter[0], solution.exercise.meter[1])
            cursor.add(ts)

//todo change this to counting from durtaions
//todo right now type in valid number
            //curScore.appendMeasures(solution.exercise.measures.length - curScore.nmeasures)
            curScore.appendMeasures(1)

            cursor.rewind(0)
            var lastSegment = false
            for(var i=0; i<solution.chords.length; i++){
                var curChord = solution.chords[i]
                if (durations !== undefined){
                  var dur = durations[i]
                }
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
                if (durations !== undefined){
                   cursor.setDuration(dur[0],dur[1])
                } else {
                   cursor.setDuration(curChord.duration[0],curChord.duration[1])
                }
                selectSoprano(cursor);
                cursor.addNote(curChord.sopranoNote.pitch, false);
                if(!lastSegment) cursor.prev();

                if (durations !== undefined){
                   cursor.setDuration(dur[0],dur[1])
                } else {
                   cursor.setDuration(curChord.duration[0],curChord.duration[1])
                }
                selectAlto(cursor);
                cursor.addNote(curChord.altoNote.pitch, false);
                if(!lastSegment) cursor.prev()

                if (durations !== undefined){
                   cursor.setDuration(dur[0],dur[1])
                } else {
                   cursor.setDuration(curChord.duration[0],curChord.duration[1])
                }
                selectTenor(cursor);
                cursor.addNote(curChord.tenorNote.pitch, false);
                if(!lastSegment) cursor.prev()

                if (durations !== undefined){
                   cursor.setDuration(dur[0],dur[1])
                } else {
                   cursor.setDuration(curChord.duration[0],curChord.duration[1])
                }
                selectBass(cursor);
                cursor.addNote(curChord.bassNote.pitch, false);
            }

        }

        FileIO {
              id: myFileAbc
              onError: console.log(msg + "  Filename = " + myFileAbc.source)
        }



          FileDialog {
              id: fileDialog
              title: qsTr("Please choose a file")
              onAccepted: {
                  var filename = fileDialog.fileUrl
                  if(filename){
                      myFileAbc.source = filename

                      var input_text = String(myFileAbc.read())
                      abcText.text = input_text
                      exercise = Parser.parse(input_text)

                  }
              }
          }

            FileDialog {
              id: fileDialogParse
              title: qsTr("Please choose a file to parse")
              onAccepted: {
                  var filename = fileDialogParse.fileUrl
                  if(filename){
                      myFileAbc.source = filename
                      var input_text = String(myFileAbc.read())
                      exercise = Parser.parse(input_text)
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
              text: qsTr("Solve")
              anchors.bottom: window.bottom
              anchors.left: buttonParse.right
              anchors.topMargin: 10
              anchors.bottomMargin: 10
              anchors.leftMargin: 10
              onClicked: {
                var solver = new Solver.Solver(exercise);
                var solution = solver.solve();
                var solution_date = get_solution_date()

                prepare_score_for_solution(filePath, solution, solution_date, true)

                fill_score_with_solution(solution)

                writeScore(curScore, filePath+"/solutions/harmonic functions exercise/solution"+solution_date,"mscz")
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
