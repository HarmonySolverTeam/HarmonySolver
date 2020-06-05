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
import "./objects/SopranoExercise.js" as SopranoExercise

MuseScore {
    menuPath: "Plugins.HarmonySolver"
    description: "This plugin solves harmonics exercises"
    version: "1.0"
    requiresScore: false
    pluginType: "dock"
    dockArea: "right"

    property var exercise: ({})
    id: window
    width: 800
    height: 500
    onRun: {

    }

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

    function read_figured_bass() {
        var cursor = curScore.newCursor()
        cursor.rewind(0)
        var elements = []
        var bassNote, key, mode
        var durations = []
        var has3component = false
        var lastBaseNote, lastPitch
        var meter = [cursor.measure.timesigActual.numerator, cursor.measure.timesigActual.denominator]
        do {
            var symbols = []
            durations.push(
                        [cursor.element.duration.numerator, cursor.element.duration.denominator])
            if (typeof cursor.element.parent.annotations[0] !== "undefined") {
                var readSymbols = cursor.element.parent.annotations[0].text
                if (!Parser.check_figured_bass_symbols(readSymbols))
                    throw ("Wrong symbols: " + symbols)
                for (var i = 0; i < readSymbols.length; i++) {
                    var component = "", alteration = undefined
                    while (i < readSymbols.length && readSymbols[i] !== "\n") {
                        if (readSymbols[i] !== " " && readSymbols[i] !== "\t") {
                            if (readSymbols[i] === "#" || readSymbols[i] === "b"
                                    || readSymbols === "h")
                                alteration = readSymbols[i]
                            else
                                component += readSymbols[i]
                        }
                        i++
                    }
                    if (component === "") {
                        if (has3component)
                            throw ("Cannot twice define 3: " + symbols)
                        else {
                            symbols.push(new FiguredBass.BassSymbol(3,
                                                                    alteration))
                            has3component = true
                        }
                    } else
                        symbols.push(new FiguredBass.BassSymbol(parseInt(
                                                                    component),
                                                                alteration))
                }
            }
            lastBaseNote = getBaseNote((cursor.element.notes[0].tpc + 1) % 7)
            lastPitch = cursor.element.notes[0].pitch
            bassNote = new Note.Note(lastPitch, lastBaseNote, 0)
            elements.push(new FiguredBass.FiguredBassElement(bassNote, symbols))
        } while (cursor.next())
        lastPitch = lastPitch % 12
        var majorKey = Consts.majorKeyBySignature(curScore.keysig)
        var minorKey = Consts.minorKeyBySignature(curScore.keysig)
        if (Consts.keyStrPitch[majorKey] % 12 === lastPitch
                && Consts.keyStrBase[majorKey] === lastBaseNote) {
            key = majorKey
            mode = "major"
        } else {
            if (Consts.keyStrPitch[minorKey] % 12 === lastPitch
                    && Consts.keyStrBase[minorKey] === lastBaseNote) {
                key = minorKey
                mode = "minor"
            } else {
                throw ("Wrong last note. Bass line should end on Tonic.")
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
        console.log(ret)
        return ret
    }

    function prepare_score_for_solution(filePath, solution, solution_date, setDurations) {
        readScore(filePath + "/template scores/" + solution.exercise.key + "_"
                  + solution.exercise.mode + ".mscz")
        writeScore(curScore,
                   filePath + "/solutions/harmonic functions exercise/solution" + solution_date,
                   "mscz")
        closeScore(curScore)
        readScore(filePath + "/solutions/harmonic functions exercise/solution"
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

        //todo change this to counting from durtaions
        //todo right now type in valid number
        //curScore.appendMeasures(solution.exercise.measures.length - curScore.nmeasures)
        curScore.appendMeasures(1)

        cursor.rewind(0)
        var lastSegment = false
        for (var i = 0; i < solution.chords.length; i++) {
            var curChord = solution.chords[i]
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
            addComponentToScore(cursor, curChord.sopranoNote.chordComponent)
            selectAlto(cursor)
            cursor.addNote(curChord.altoNote.pitch, false)
            if (!lastSegment)
                cursor.prev()

            if (durations !== undefined) {
                cursor.setDuration(dur[0], dur[1])
            } else {
                cursor.setDuration(curChord.duration[0], curChord.duration[1])
            }
            addComponentToScore(cursor, curChord.altoNote.chordComponent)
            selectTenor(cursor)
            cursor.addNote(curChord.tenorNote.pitch, false)
            if (!lastSegment)
                cursor.prev()

            if (durations !== undefined) {
                cursor.setDuration(dur[0], dur[1])
            } else {
                cursor.setDuration(curChord.duration[0], curChord.duration[1])
            }
            addComponentToScore(cursor, curChord.tenorNote.chordComponent)
            selectBass(cursor)
            cursor.addNote(curChord.bassNote.pitch, false)
        }

        //sth was not working when I added this in upper "for loop"
        cursor.rewind(0)
        for (var i = 0; i < solution.chords.length; i++) {
            addComponentToScore(cursor,
                                solution.chords[i].bassNote.chordComponent)
            cursor.next()
        }
    }

    function sopranoHarmonization() {
        var mode = "major"
        //should be read from input
        var cursor = curScore.newCursor()
        cursor.rewind(0)
        var sopranoNote, key, mode
        var durations = []
        var lastBaseNote, lastPitch
        var notes = []
        var meter = [cursor.measure.timesigActual.numerator, cursor.measure.timesigActual.denominator]
        do {
            durations.push(
                        [cursor.element.duration.numerator, cursor.element.duration.denominator])
            lastBaseNote = getBaseNote((cursor.element.notes[0].tpc + 1) % 7)
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
        console.log(sopranoExercise)
    }

    function addComponentToScore(cursor, componentValue) {
        var component = newElement(Element.FINGERING)
        component.text = componentValue
        curScore.startCmd()
        cursor.add(component)
        curScore.endCmd()
    }

    function figuredBassSolve() {
        var ex = read_figured_bass()
        console.log(ex.elements)
        var exercise = Translator.createExerciseFromFiguredBass(ex)
        console.log(JSON.stringify(exercise))
        var bassLine = []
        for (var i = 0; i < ex.elements.length; i++) {
            bassLine.push(ex.elements[i].bassNote)
        }
        var solver = new Solver.Solver(exercise, bassLine)
        var solution = solver.solve()
        var solution_date = get_solution_date()
        console.log(solution)

        prepare_score_for_solution(filePath, solution, solution_date, false)

        fill_score_with_solution(solution, ex.durations)

        writeScore(curScore,
                   filePath + "/solutions/harmonic functions exercise/solution" + solution_date,
                   "mscz")

        // translate (remember about durations attribute!)
        // solve first exercise
        // print solution (remember about durations)
    }

    function isFiguredBassScore() {
        //todo
        return true
    }

    function isSopranoScore() {
        //todo
        return true
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
            if (filename) {
                myFileAbc.source = filename

                var input_text = String(myFileAbc.read())
                tab1.item.setText(input_text)
                exercise = Parser.parse(input_text)
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
                exercise = Parser.parse(input_text)
                tab1.item.setText(JSON.stringify(exercise))
            }
        }
    }

    Rectangle {

        TabView {
            id: tabView
            width: 700
            height: 450

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
                            var solver = new Solver.Solver(exercise)
                            var solution = solver.solve()
                            var solution_date = get_solution_date()

                            prepare_score_for_solution(filePath, solution,
                                                       solution_date, true)

                            fill_score_with_solution(solution)

                            writeScore(curScore,
                                       filePath + "/solutions/harmonic functions exercise/solution"
                                       + solution_date, "mscz")
                            Qt.quit()
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
                                textAreaFigured.text = ""
                                figuredBassSolve()
                            } else {
                                textAreaFigured.text = "ERROR! No score with figured bass!"
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
                        //anchors.bottom: infoText.top
                        anchors.leftMargin: 20
                        anchors.topMargin: 20
                        font.pixelSize: 20
                    }

                    Text {
                        id: infoText
                        anchors.top: textLabelFiguredBass.bottom
                        anchors.left: tabRectangle2.left
                        anchors.topMargin: 40
                        anchors.leftMargin: 20
                        text: qsTr("Info")
                        font.pixelSize: 20
                    }

                    TextArea {
                        id: textAreaFigured
                        anchors.top: infoText.bottom
                        anchors.left: tabRectangle2.left
                        anchors.right: tabRectangle2.right
                        anchors.topMargin: 10
                        anchors.bottomMargin: 10
                        anchors.leftMargin: 10
                        anchors.rightMargin: 10
                        width: parent.width
                        text: qsTr("")
                        activeFocusOnPress: false
                        readOnly: true
                        font.pixelSize: 14
                    }
                }
            }
            Tab {

                title: "Sopran Harmonization"

                Rectangle {
                    id: tabRectangle3

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
//todo pododawac id do checkboxow
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
                            checked: true
                            enabled: false
                            text: qsTr("?")
                        }
                        CheckBox {
                            checked: true
                            enabled: false
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
                            checked: false
                            text: qsTr("S")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("S6")
                        }
                        CheckBox {
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
                            checked: false
                            text: qsTr("D")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("D7")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("D9")
                        }
                        CheckBox {
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
                            checked: false
                            text: qsTr("3")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("5")
                        }
                        CheckBox {
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
                            checked: false
                            text: qsTr("6-5")
                        }
                        CheckBox {
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
                            checked: false
                            text: qsTr("T-VI")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("S-II")
                        }
                        CheckBox {
                            checked: false
                            text: qsTr("?")
                        }
                    }

                    Text {
                        id: infoTextSoprano
                        anchors.bottom: textAreaSoprano.top
                        anchors.left: tabRectangle3.left
                        anchors.topMargin: 40
                        anchors.leftMargin: 20
                        text: qsTr("Info")
                        font.pixelSize: 20
                    }

                    TextArea {
                        id: textAreaSoprano
                        anchors.bottom: buttorSoprano.top
                        anchors.left: tabRectangle3.left
                        anchors.right: tabRectangle3.right
                        anchors.topMargin: 10
                        anchors.bottomMargin: 10
                        anchors.leftMargin: 10
                        anchors.rightMargin: 10
                        width: parent.width
                        text: qsTr("")
                        activeFocusOnPress: false
                        readOnly: true
                        font.pixelSize: 14
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
                                textAreaSoprano.text = ""
                                sopranoHarmonization()
                            } else {
                                textAreaSoprano.text = "ERROR! No score with soprano!"
                            }
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
