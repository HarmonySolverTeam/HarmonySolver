import QtQuick 2.2
import MuseScore 3.0
import FileIO 3.0
import QtQuick.Dialogs 1.1
import QtQuick.Controls 1.1

//import "./qml_components"
import "./objects/Solver.js" as Solver
import "./objects/Parser.js" as Parser
import "./objects/FiguredBass.js" as FiguredBass
import "./objects/Note.js" as Note
import "./objects/Consts.js" as Consts
import "./objects/BassTranslator.js" as Translator
import "./objects/SopranoExercise.js" as SopranoExercise
import "./objects/HarmonicFunction.js" as HarmonicFunction
import "./objects/Soprano.js" as Soprano
import "./objects/PluginConfiguration.js" as PluginConfiguration
import "./objects/PluginConfigurationUtils.js" as PluginConfigurationUtils
import "./objects/Errors.js" as Errors
import "./objects/Utils.js" as Utils

MuseScore {
    menuPath: "Plugins.HarmonySolver"
    description: "This plugin solves harmonics exercises"
    version: "1.0"
    requiresScore: false
    pluginType: "dock"
    dockArea: "right"

    property var exercise: ({})
    property var exerciseLoaded: false
    id: window
    width: 800
    height: 600
    onRun: {
        //readPluginConfiguration()
    }


//    function readPluginConfiguration(){
//        PluginConfigurationUtils.readConfiguration()
//        Utils.info(JSON.stringify(PluginConfigurationUtils.configuration_holder))
//    }
    
    FileIO{
      id: outConfFile
      onError: Utils.warn(msg + "  Filename = " + outConfFile.source)
    }
    
//    function savePluginConfiguration(){
//       var json_conf = String(JSON.stringify(PluginConfigurationUtils.configuration_holder))
       //ale drut ja piernicze...
//       outConfFile.setSource(String(Qt.resolvedUrl(".") + PluginConfigurationUtils.configuration_save_path))
//              console.log(outConfFile.source)
//              console.log(filePath)
//              console.log(outConfFile.exists())
//       Utils.log(outConfFile.write(json_conf))
//    }

    function getBaseNote(museScoreBaseNote) {
        var result
        switch (museScoreBaseNote) {
        case 0:
            result = Consts.BASE_NOTES.F
            break
        case 1:
            result = Consts.BASE_NOTES.C
            break
        case 2:
            result = Consts.BASE_NOTES.G
            break
        case 3:
            result = Consts.BASE_NOTES.D
            break
        case 4:
            result = Consts.BASE_NOTES.A
            break
        case 5:
            result = Consts.BASE_NOTES.E
            break
        case 6:
            result = Consts.BASE_NOTES.B
            break
        }
        return result
    }

    function isAlterationSymbol(character) {
        return (character === '#' || character === 'b' || character ==='h')
    }


    function read_figured_bass() {
        var cursor = curScore.newCursor()
        cursor.rewind(0)
        var elements = []
        var bassNote, key, mode
        var durations = []
        var has3component = false
        var lastBaseNote, lastPitch
        var meter = [cursor.measure.timesigActual.numerator, cursor.measure.timesigActual.denominator]
        var delays = []
        do {
            var symbols = []
            durations.push(
                        [cursor.element.duration.numerator, cursor.element.duration.denominator])
            if (typeof cursor.element.parent.annotations[0] !== "undefined") {
                var readSymbols = cursor.element.parent.annotations[0].text
                Utils.log("readSymbols:", readSymbols)
                if (!Parser.check_figured_bass_symbols(readSymbols))
                    throw new Errors.FiguredBassInputError("Wrong symbols", symbols)
                for (var i = 0; i < readSymbols.length; i++) {
                    var component = "", alteration = undefined
                    while (i < readSymbols.length && readSymbols[i] !== "\n") {
                        if (readSymbols[i] !== " " && readSymbols[i] !== "\t") {
                            component += readSymbols[i]
                        }
                        i++
                    }
                    Utils.log("component: " + component)


                    if (component.length === 1 && isAlterationSymbol(component[0])) {
                        if (has3component) {
                            throw new Errors.FiguredBassInputError("Cannot twice define 3", symbols)
                        } else {
                            symbols.push(new FiguredBass.BassSymbol(3, component[0]))
                            has3component = true
                        }
                    } else {
                        //delays
                        if (component.includes('-')) {
                            var splittedSymbols = component.split('-')
                            var firstSymbol = splittedSymbols[0]
                            var secondSymbol = splittedSymbols[1]

                            if (isAlterationSymbol(secondSymbol[0])) {
                                symbols.push(new FiguredBass.BassSymbol(parseInt(secondSymbol[1]),
                                                                        secondSymbol[0]))
                            } else {
                                symbols.push(new FiguredBass.BassSymbol(parseInt(secondSymbol),
                                                                        undefined))
                            }
                            delays.push([firstSymbol, secondSymbol])

                        } else {
                            if (isAlterationSymbol(component[0])) {
                                symbols.push(new FiguredBass.BassSymbol(parseInt(component[1]), component[0]))
                            } else {
                                symbols.push(new FiguredBass.BassSymbol(parseInt(component), undefined))
                            }
                        }
                    }

                        Utils.log("symbols:", symbols)
                }
            }
            lastBaseNote = getBaseNote(Utils.mod((cursor.element.notes[0].tpc + 1), 7))
            lastPitch = cursor.element.notes[0].pitch
            bassNote = new Note.Note(lastPitch, lastBaseNote, 0)
            elements.push(new FiguredBass.FiguredBassElement(bassNote, symbols, delays))
            has3component = false

            if (delays.length !== 0) {
                Utils.log("durations", durations)
                durations[durations.length - 1][1]*=2
                durations.push(durations[durations.length - 1])
                Utils.log("durations", durations)
            }

            delays = []
        } while (cursor.next())
        lastPitch = Utils.mod(lastPitch, 12)
        var majorKey = Consts.majorKeyBySignature(curScore.keysig)
        var minorKey = Consts.minorKeyBySignature(curScore.keysig)
        if (Utils.mod(Consts.keyStrPitch[majorKey], 12) === lastPitch
                && Consts.keyStrBase[majorKey] === lastBaseNote) {
            key = majorKey
            mode = "major"
        } else {
            if (Utils.mod(Consts.keyStrPitch[minorKey], 12) === lastPitch
                    && Consts.keyStrBase[minorKey] === lastBaseNote) {
                key = minorKey
                mode = "minor"
            } else {
                throw new Errors.FiguredBassInputError("Wrong last note. Bass line should end on Tonic.")
            }
        }
        return new FiguredBass.FiguredBassExercise(mode, key, meter, elements,
                                                   durations)
    }

    function get_solution_date() {
        var date = new Date()
        var ret = "_"
        ret += date.getFullYear(
                    ) + "_" + (date.getMonth() + 1) + "_" + date.getDate() + "_"
        ret += date.getHours() + "_" + date.getMinutes(
                    ) + "_" + date.getSeconds()
        Utils.log("Solution date - " + ret)
        return ret
    }

    function prepare_score_for_solution(filePath, solution, solution_date, setDurations, taskType) {
        readScore(filePath + "/template scores/" + solution.exercise.key + "_"
                  + solution.exercise.mode + ".mscz")
        writeScore(curScore,
                   filePath + "/solutions/harmonic functions exercise/solution" + taskType + solution_date,
                   "mscz")
        closeScore(curScore)
        readScore(filePath + "/solutions/harmonic functions exercise/solution" + taskType
                  + solution_date + ".mscz")
        if (setDurations) {
            solution.setDurations()
        }
    }

    function fill_score_with_solution(solution, durations) {
        var cursor = curScore.newCursor()
        cursor.rewind(0)
        var ts = newElement(Element.TIMESIG)
        ts.timesig = fraction(solution.exercise.meter[0],
                              solution.exercise.meter[1])
        cursor.add(ts)

        if(durations !== undefined){
            var countMeasures = function(durations){
                var sum = 0;
                for(var i=0; i<durations.length;i++){
                    Utils.log(durations[i][0]/durations[i][1])
                    sum += durations[i][0]/durations[i][1];
                }
                return Math.round(sum/(solution.exercise.meter[0]/solution.exercise.meter[1]));
            }

            var sum = countMeasures(durations);
            curScore.appendMeasures(sum - curScore.nmeasures)
        }
        else{
            curScore.appendMeasures(solution.exercise.measures.length - curScore.nmeasures)
        }

        cursor.rewind(0)
        var lastSegment = false
        for (var i = 0; i < solution.chords.length; i++) {
            var curChord = solution.chords[i]
            Utils.log("curChord:",curChord)
            if (durations !== undefined) {
                var dur = durations[i]
            }
            if (i === solution.chords.length - 1)
                lastSegment = true

            function selectSoprano(cursor) {
                cursor.track = 0
            }
            function selectAlto(cursor) {
                cursor.track = 1
            }
            function selectTenor(cursor) {
                cursor.track = 4
            }
            function selectBass(cursor) {
                cursor.track = 5
            }
            if (durations !== undefined) {
                cursor.setDuration(dur[0], dur[1])
            } else {
                cursor.setDuration(curChord.duration[0], curChord.duration[1])
            }
            selectSoprano(cursor)
            cursor.addNote(curChord.sopranoNote.pitch, false)
            if (!lastSegment)
                cursor.prev()

            if (durations !== undefined) {
                cursor.setDuration(dur[0], dur[1])
            } else {
                cursor.setDuration(curChord.duration[0], curChord.duration[1])
            }
            addComponentToScore(cursor, curChord.sopranoNote.chordComponent.toXmlString())
            selectAlto(cursor)
            cursor.addNote(curChord.altoNote.pitch, false)
            if (!lastSegment)
                cursor.prev()

            if (durations !== undefined) {
                cursor.setDuration(dur[0], dur[1])
            } else {
                cursor.setDuration(curChord.duration[0], curChord.duration[1])
            }
            addComponentToScore(cursor, curChord.altoNote.chordComponent.toXmlString())
            selectTenor(cursor)
            cursor.addNote(curChord.tenorNote.pitch, false)
            if (!lastSegment)
                cursor.prev()

            if (durations !== undefined) {
                cursor.setDuration(dur[0], dur[1])
            } else {
                cursor.setDuration(curChord.duration[0], curChord.duration[1])
            }
            addComponentToScore(cursor, curChord.tenorNote.chordComponent.toXmlString())
            selectBass(cursor)
            cursor.addNote(curChord.bassNote.pitch, false)
        }

        //sth was not working when I added this in upper "for loop"
        cursor.rewind(0)
        for (var i = 0; i < solution.chords.length; i++) {
            addComponentToScore(cursor,
                                solution.chords[i].bassNote.chordComponent.toXmlString())
            selectSoprano(cursor)
            console.log(cursor.element)
            cursor.element.notes[0].tpc = Utils.convertToTpc(solution.chords[i].sopranoNote)
            selectAlto(cursor)
            cursor.element.notes[0].tpc = Utils.convertToTpc(solution.chords[i].altoNote)
            selectTenor(cursor)
            cursor.element.notes[0].tpc = Utils.convertToTpc(solution.chords[i].tenorNote)
            selectBass(cursor)
            cursor.element.notes[0].tpc = Utils.convertToTpc(solution.chords[i].bassNote)
            cursor.next()
        }
    }

    function sopranoHarmonization(functionsList) {

        var mode = tab3.item.getSelectedSystem()
        //should be read from input
        var cursor = curScore.newCursor()
        cursor.rewind(0)
        var sopranoNote, key
        var durations = []
        var lastBaseNote, lastPitch
        var notes = []
        var meter = [cursor.measure.timesigActual.numerator, cursor.measure.timesigActual.denominator]
        do {
            durations.push(
                        [cursor.element.duration.numerator, cursor.element.duration.denominator])
            lastBaseNote = getBaseNote(Utils.mod(cursor.element.notes[0].tpc + 1, 7))
            lastPitch = cursor.element.notes[0].pitch
            sopranoNote = new Note.Note(lastPitch, lastBaseNote, 0)
            notes.push(sopranoNote)
        } while (cursor.next())
        var key
        if (mode === "major")
            key = Consts.majorKeyBySignature(curScore.keysig)
        else
            key = Consts.minorKeyBySignature(curScore.keysig)
        var sopranoExercise = new SopranoExercise.SopranoExercise(mode, key,
                                                                  meter, notes,
                                                                  durations)

        var shex = new SopranoExercise.SopranoHarmonizationExercise(sopranoExercise,
                                                                    [],
                                                                    functionsList)

        var solver = new Soprano.SopranoSolver(shex)

        var solution = solver.solve()
        var solution_date = get_solution_date()

        prepare_score_for_solution(filePath, solution, solution_date, false, "_soprano")

        fill_score_with_solution(solution, sopranoExercise.durations)

        writeScore(curScore,
                   filePath + "/solutions/harmonic functions exercise/solution" + solution_date,
                   "mscz")

        Utils.log("sopranoExercise:",sopranoExercise)
    }

    function addComponentToScore(cursor, componentValue) {
        var component = newElement(Element.FINGERING)
        component.text = componentValue
        curScore.startCmd()
        cursor.add(component)
        curScore.endCmd()
    }

    function figuredBassSolve() {

        try {
            var ex = read_figured_bass()
            var translator = new Translator.BassTranslator()
            //console.log(ex.elements)
            var exercise = translator.createExerciseFromFiguredBass(ex)
            Utils.log("Translated exercise",JSON.stringify(exercise))
            var bassLine = []
            for (var i = 0; i < ex.elements.length; i++) {
                bassLine.push(ex.elements[i].bassNote)
            }
            var solver = new Solver.Solver(exercise, bassLine)
            var solution = solver.solve()
            var solution_date = get_solution_date()
            Utils.log("Solution:", JSON.stringify(solution))

            prepare_score_for_solution(filePath, solution, solution_date, false, "_bass")

            fill_score_with_solution(solution, ex.durations)

            writeScore(curScore,
                       filePath + "/solutions/harmonic functions exercise/solution" + solution_date,
                       "mscz")
        } catch (error) {
            showError(error)
        }
    }

    function isFiguredBassScore() {
        //todo
        return true
    }

    function isSopranoScore() {
        //todo
        return true
    }

    function getPossibleChordsList() {

        var T = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1", [], [],
                                                      [], false, undefined)
        var S = new HarmonicFunction.HarmonicFunction("S", 4, undefined, "1", [], [],
                                                      [], false, undefined)
        var D = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [], [],
                                                      [], false, undefined)

        var D7 = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [],
                                                       ["7"], [], false)
        var D9 = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", [],
                                                       ["7", "9"], [], false)
        //todo jak to uzupelnic?
        var T6 = new HarmonicFunction.HarmonicFunction("T", 6, undefined, "1", [], [],
                                                       [], false)
        var S2 = new HarmonicFunction.HarmonicFunction("S", 2, undefined, "1", [], [],
                                                       [], false)
        var chopin = new HarmonicFunction.HarmonicFunction("D", 1, undefined, "1", [],
                                                           [], [], false)
        var neapol = new HarmonicFunction.HarmonicFunction("S", 1, undefined, "1", [],
                                                           [], [], false)
        var S6 = new HarmonicFunction.HarmonicFunction("S", 6, undefined, "1", [], [],
                                                       [], false)

        var chordsList = []
        chordsList.push(T)
        chordsList.push(S)
        chordsList.push(D)

        if (tab3.item.getCheckboxState("D7") === true) {
            chordsList.push(D7)
        }
        if (tab3.item.getCheckboxState("D9") === true) {
            chordsList.push(D9)
        }
        if (tab3.item.getCheckboxState("T6") === true) {
            chordsList.push(T6)
        }
        if (tab3.item.getCheckboxState("S2") === true) {
            chordsList.push(S2)
        }
        if (tab3.item.getCheckboxState("Chopin") === true) {
            chordsList.push(chopin)
        }
        if (tab3.item.getCheckboxState("S6") === true) {
            chordsList.push(S6)
        }
        if (tab3.item.getCheckboxState("Neapol") === true) {
            chordsList.push(neapol)
        }

        //todo later also revolutions and delays
        return chordsList
    }

    FileIO {
        id: myFileAbc
        onError: Utils.warn(msg + "  Filename = " + myFileAbc.source)
    }


    FileDialog {
        id: fileDialog
        title: qsTr("Please choose a file")
        onAccepted: {
            var filename = fileDialog.fileUrl
            if (filename) {
                myFileAbc.source = filename

                var input_text = String(myFileAbc.read())
                tab1.item.setText(input_text)
                try{
                    exerciseLoaded = false
                    exercise = Parser.parse(input_text)
                    exerciseLoaded = true
                } catch (error) {
                    showError(error)
                }
            }
        }
    }

    FileDialog {
        id: fileDialogParse
        title: qsTr("Please choose a file to parse")
        onAccepted: {
            var filename = fileDialogParse.fileUrl
            if (filename) {
                myFileAbc.source = filename
                var input_text = String(myFileAbc.read())
                try{
                    exerciseLoaded = false
                    exercise = Parser.parse(input_text)
                    exerciseLoaded = true
                    tab1.item.setText(JSON.stringify(exercise))
                } catch (error) {
                    showError(error)
                }
            }
        }
    }
    
    function showError(error) {
      while (error.message.length !== 120) {
            error.message += " "
      }
      errorDialog.text = error.source !== undefined ? error.source + "\n" : ""
      errorDialog.text +=  error.message + "\n"
      errorDialog.text += error.details !== undefined ? error.details : ""

      if (error.stack !== undefined) {
        if (error.stack.length >= 1500) {
            errorDialog.text += "\n Stack: \n" + error.stack.substring(0,1500) + "..."
        } else {
            errorDialog.text += "\n Stack: \n" + error.stack
        }
      }

      errorDialog.open()
    }
    

    MessageDialog {
        id: errorDialog
        width: 300
        height: 400
        title: "HarmonySolver - Error"
        text: ""
        icon: StandardIcon.Critical
    }


    Rectangle {

        TabView {
            id: tabView
            width: 750
            height: 550

            Tab {
                title: "Harmonic Functions"
                id: tab1
                active: true

                Rectangle {
                    id: tabRectangle1

                    function setText(text) {
                        abcText.text = text
                    }

                    Label {
                        id: textLabel
                        wrapMode: Text.WordWrap
                        text: qsTr("Your task will show here")
                        font.pointSize: 12
                        anchors.left: tabRectangle1.left
                        anchors.top: tabRectangle1.top
                        anchors.leftMargin: 10
                        anchors.topMargin: 10
                    }

                    TextArea {
                        id: abcText
                        anchors.top: textLabel.bottom
                        anchors.left: tabRectangle1.left
                        anchors.right: tabRectangle1.right
                        anchors.bottom: buttonOpenFile.top
                        anchors.topMargin: 10
                        anchors.bottomMargin: 10
                        anchors.leftMargin: 10
                        anchors.rightMargin: 10
                        width: parent.width
                        height: 400
                        wrapMode: TextEdit.WrapAnywhere
                        textFormat: TextEdit.PlainText
                    }

                    Button {
                        id: buttonOpenFile
                        text: qsTr("Open file")
                        anchors.bottom: tabRectangle1.bottom
                        anchors.left: abcText.left
                        anchors.topMargin: 10
                        anchors.bottomMargin: 10
                        anchors.leftMargin: 10
                        onClicked: {
                            fileDialog.open()
                        }
                    }

                    Button {
                        id: buttonParse
                        text: qsTr("Parse file")
                        anchors.bottom: tabRectangle1.bottom
                        anchors.left: buttonOpenFile.right
                        anchors.topMargin: 10
                        anchors.bottomMargin: 10
                        anchors.leftMargin: 10
                        onClicked: {
                            fileDialogParse.open()
                        }
                    }

                    Button {
                        id: buttonRun
                        text: qsTr("Solve")
                        anchors.bottom: tabRectangle1.bottom
                        anchors.right: tabRectangle1.right
                        anchors.topMargin: 10
                        anchors.bottomMargin: 10
                        anchors.rightMargin: 40
                        anchors.leftMargin: 10
                        onClicked: {
                            if (!exerciseLoaded) {
                                showError(new Errors.BasicError("File with harmonic functions exercise was not loaded correctly"))
                            } else {
                                try {
                                    var solver = new Solver.Solver(exercise)
                                    var solution = solver.solve()
                                    var solution_date = get_solution_date()

                                    prepare_score_for_solution(filePath, solution,
                                                               solution_date, true, "_hfunc")

                                    fill_score_with_solution(solution)

                                    writeScore(curScore,
                                               filePath + "/solutions/harmonic functions exercise/solution"
                                               + solution_date, "mscz")
                                } catch (error) {
                                    showError(error)
                                }
                            }
                        }
                    }
                }
            }
            Tab {
                title: "Figured Bass"

                Rectangle {
                    id: tabRectangle2

                    Button {
                        id: buttonRunFiguredBass
                        text: qsTr("Solve")
                        anchors.bottomMargin: 10
                        anchors.rightMargin: 40
                        anchors.right: tabRectangle2.right
                        anchors.bottom: tabRectangle2.bottom
                        onClicked: {
                            if (isFiguredBassScore()) {
                                figuredBassSolve()
                            } else {
                                showError(new Errors.FiguredBassInputError("No score with figured bass"))
                            }
                        }
                    }

                    Label {
                        id: textLabelFiguredBass
                        wrapMode: Text.WordWrap
                        text: qsTr("Here you can solve figured bass exercises. \nRemember that current opened score\nshould contain figured bass exercise.")
                        font.pointSize: 12
                        anchors.left: tabRectangle2.left
                        anchors.top: tabRectangle2.top
                        anchors.leftMargin: 20
                        anchors.topMargin: 20
                        font.pixelSize: 20
                    }

                }
            }
            Tab {

                title: "Soprano Harmonization"
                id: tab3

                Rectangle {
                    id: tabRectangle3

                    function getCheckboxState(function_name) {
                        if (function_name === "D7") {
                            return d7Checkbox.checkedState === Qt.Checked
                        }
                        if (function_name === "D9") {
                            return d9Checkbox.checkedState === Qt.Checked
                        }
                        if (function_name === "T6") {
                            return t6Checkbox.checkedState === Qt.Checked
                        }
                        if (function_name === "S2") {
                            return s2Checkbox.checkedState === Qt.Checked
                        }
                        if (function_name === "Chopin") {
                            return chopinCheckbox.checkedState === Qt.Checked
                        }
                        if (function_name === "S6") {
                            return s6Checkbox.checkedState === Qt.Checked
                        }
                        if (function_name === "Neapol") {
                            return neapolitanCheckbox.checkedState === Qt.Checked
                        }
                    }

                    function getSelectedSystem(){
                        if (useMinorCheckbox.checkedState === Qt.Checked) {
                            return "minor";
                        } else {
                            return "major";
                        }
                    }

                    Label {
                        id: textLabelSoprano
                        wrapMode: Text.WordWrap
                        text: qsTr("Select all harmonic functions that you want to use for soprano\nharmonization:")
                        font.pointSize: 12
                        anchors.left: tabRectangle3.left
                        anchors.top: tabRectangle3.top
                        //anchors.bottom: infoText.top
                        anchors.leftMargin: 20
                        anchors.topMargin: 20
                        font.pixelSize: 20
                    }

                    Column {
                        id: tColumnt
                        anchors.top: textLabelSoprano.bottom
                        anchors.topMargin: 30
                        anchors.left: tabRectangle3.left
                        anchors.leftMargin: 10
                        CheckBox {
                            checked: true
                            enabled: false
                            text: qsTr("T")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("?")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("?")
                        }
                    }

                    Column {
                        id: sColumn
                        anchors.top: textLabelSoprano.bottom
                        anchors.topMargin: 30
                        anchors.left: tColumnt.right
                        anchors.leftMargin: 30
                        CheckBox {
                            checked: true
                            enabled: false
                            text: qsTr("S")
                        }
                        CheckBox {
                            id: s6Checkbox
                            checked: false
                            text: qsTr("S6")
                        }
                        CheckBox {
                            id: neapolitanCheckbox
                            checked: false
                            text: qsTr("Neapolitan chord")
                        }
                    }

                    Column {
                        id: dColumnt
                        anchors.top: textLabelSoprano.bottom
                        anchors.topMargin: 30
                        anchors.left: sColumn.right
                        anchors.leftMargin: 30
                        CheckBox {
                            checked: true
                            enabled: false
                            text: qsTr("D")
                        }
                        CheckBox {
                            id: d7Checkbox
                            checked: false
                            text: qsTr("D7")
                        }
                        CheckBox {
                            id: d9Checkbox
                            checked: false
                            text: qsTr("D9")
                        }
                        CheckBox {
                            id: chopinCheckbox
                            checked: false
                            text: qsTr("Chopin chord")
                        }
                    }

                    Text {
                        id: revolutionsTextLabel
                        anchors.bottom: revolutionsColumnt.top
                        anchors.left: dColumnt.right
                        text: qsTr("Revolutions")
                    }

                    Column {
                        id: revolutionsColumnt
                        anchors.top: textLabelSoprano.bottom
                        anchors.topMargin: 30
                        anchors.left: dColumnt.right
                        anchors.leftMargin: 20
                        CheckBox {
                            id: revolution3Checkbox
                            checked: false
                            text: qsTr("3")
                        }
                        CheckBox {
                            id: revolution5Checkbox
                            checked: false
                            text: qsTr("5")
                        }
                        CheckBox {
                            id: revolution7Checkbox
                            checked: false
                            text: qsTr("7")
                        }
                    }

                    Text {
                        id: delaysTextLabel
                        anchors.bottom: delaysColumnt.top
                        anchors.left: revolutionsTextLabel.right
                        anchors.leftMargin: 20
                        text: qsTr("Delays")
                    }

                    Column {
                        id: delaysColumnt
                        anchors.top: textLabelSoprano.bottom
                        anchors.topMargin: 30
                        anchors.left: revolutionsColumnt.right
                        anchors.leftMargin: 60
                        CheckBox {
                            id: delay65Checkbox
                            checked: false
                            text: qsTr("6-5")
                        }
                        CheckBox {
                            id: delay43Checkbox
                            checked: false
                            text: qsTr("4-3")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("?")
                        }
                    }

                    Text {
                        anchors.bottom: extraColumnt.top
                        anchors.left: delaysTextLabel.right
                        anchors.leftMargin: 20
                        text: qsTr("Extra chords")
                    }

                    Column {
                        id: extraColumnt
                        anchors.top: textLabelSoprano.bottom
                        anchors.topMargin: 30
                        anchors.left: delaysColumnt.right
                        anchors.leftMargin: 40
                        CheckBox {
                            id: t6Checkbox
                            checked: false
                            text: qsTr("T-VI")
                        }
                        CheckBox {
                            id: s2Checkbox
                            checked: false
                            text: qsTr("S-II")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("?")
                        }
                    }

                    Column {
                        id: extraOptions
                        anchors.top: textLabelSoprano.bottom
                        anchors.topMargin: 30
                        anchors.left: extraColumnt.right
                        anchors.leftMargin: 20
                        CheckBox {
                            id: useMinorCheckbox
                            checked: false
                            text: qsTr("use minor scale")
                        }
                    }


                    Button {

                        id: buttorSoprano
                        text: qsTr("Solve")
                        anchors.bottom: tabRectangle3.bottom
                        anchors.right: tabRectangle3.right
                        anchors.topMargin: 10
                        anchors.bottomMargin: 10
                        anchors.rightMargin: 40
                        onClicked: {
                            if (isSopranoScore()) {
                                var func_list = getPossibleChordsList()
                                try{
                                    sopranoHarmonization(func_list)
                                } catch (error) {
                                    showError(error)
                                }
                            } else {
                                showError(new Errors.SopranoHarmonizationInputError("No score with soprano"))
                            }
                        }
                    }
                }
            }
            Tab {

                title: "Plugin Settings"
                id: tab4

                function showConfiguration(){
                    savePathTextArea.text = PluginConfigurationUtils.configuration_holder.solutionPath
                }

                Rectangle{
                    id: tabRectangle4

                    Label{
                        id: savePathLabel
                        anchors.top: tabRectangle4.top
                        anchors.left: tabRectangle4.left
                        anchors.topMargin: 10
                        anchors.leftMargin: 10
                        text: qsTr("Solution Path")
                    }


                    TextArea {
                        id: savePathTextArea
                        anchors.top: savePathLabel.bottom
                        anchors.left: tabRectangle4.left

                        anchors.topMargin: 10
                        anchors.leftMargin: 10
                        width: 200
                        height: 40
                        wrapMode: TextEdit.WrapAnywhere
                        textFormat: TextEdit.PlainText
                    }

                    Button {
                        id: saveConfigurationButton
                        text: qsTr("Save Configuration")
                        anchors.bottom: tabRectangle4.bottom
                        anchors.left: tabRectangle4.left
                        anchors.bottomMargin: 20
                        anchors.leftMargin: 40
                        onClicked: {
                            PluginConfigurationUtils.configuration_holder.solutionPath = savePathTextArea.text
                            savePluginConfiguration()
                        }
                    }

                }
            }
        }
        Button {
            id: buttonCancel
            text: qsTr("Quit")
            anchors.top: tabView.bottom
            anchors.left: tabView.right
            anchors.topMargin: 20
            anchors.bottomMargin: 10
            anchors.rightMargin: 40
            onClicked: {
                Qt.quit()
            }
        }
    }
}
