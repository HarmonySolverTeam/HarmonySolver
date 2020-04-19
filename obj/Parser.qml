import QtQuick 2.0
import "./js/Objects.js" as Objects

QtObject
{


    function parseChord(string) {
        //console.log(string)

        var i = 0
        while (i < string.length && string[i] !== '{') {
            i++
        }
        var chord_type = string.substring(0, i)
        //console.log(chord_type)
        var arguments = string.substring(i, string.length)

        var ret = new Objects.HarmonicFunction()
        ret.functionName = chord_type

        console.log(arguments)


        if (arguments === null || arguments.length < 2) {
            return ret
        }

        var arguments_json = JSON.parse(arguments)
        for (var variable in ret){
            if (variable !== "functionName"){
                ret[variable] = arguments_json[variable]
            }
        }

        return ret

    }

    //todo obsluga i wyswietlanie bledow co i gdzie jest nie tak dokladnie w pliku
    function parse(input) {
 //       try {
            var lines = input.split("\n")

            var key = lines[0]

            var mode = null

            if (contains(Objects.possible_keys_major, key)){
                mode = "major"
            } else if (contains(Objects.possible_keys_minor, key)){
                mode = "minor"
            } else {
                throw new Error("Unrecognized key: " + key)
            }
            //console.log(key)

            var system_or_first_chord = lines[1]

            var first_chord = null
            var system = null

            if (system_or_first_chord.includes(',')) {
                var notes = system_or_first_chord.split(",")
                first_chord = [notes[0], notes[1], notes[2], notes[3]]
            } else {
                //uklad
                if (!contains(Objects.possible_systems,system_or_first_chord)) {
                    throw new Error("Unrecognized system: " + key)
                }
                system = system_or_first_chord
            }

            //console.log(system)
            //console.log(first_chord)

            var metre = lines[2]

            if (metre === 'C') {
                metre = 'C'
            } else {
                //todo czy to dziala
                metre = [parseInt(metre.split('/')[0]), parseInt(metre.split('/')[1])]
            }

            //console.log(metre)

            var measures = []

            for (var i = 3; i < lines.length; i++) {
                var chords = lines[i].split(";")
                var chords_parsed = []
                for (var j = 0; j < chords.length; j++) {
                    chords_parsed.push(parseChord(chords[j]))
                }
                measures.push(chords_parsed)
            }

            //console.log(measures)

            var ret = new Objects.Exercise(key, mode, metre, system, measures, first_chord)
            return ret

//        } catch (error) {
//            console.log("Error during parsing file!")
//            console.log(error)
//            return null
//        }
    }
}