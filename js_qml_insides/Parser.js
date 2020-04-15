class Measure{
    //akordy
}

class Chord{
    //tutaj cos bedzie
    //na razie tylko ['T',-1] itp
}

class Excercise {
    constructor(key, metre,system, first_chord, measures) {
        this.key = key //tonacja
        this.metre = metre //metrum postaci [3,4]
        //todo jak to jest po angielsku?
        this.system = system //uklad
        this.measures = measures //takty
        this.first_chord = first_chord
    }

}

//todo do osobnego pliku ze stalymi czy cos
var possible_keys = ['C','C#','Db',
    'D','Eb','E','F','F#','Gb','G','Ab','A',
'Hb','H','Cb']

var possible_systems = ['close','open','-']

//todo obsluga i wyswietlanie bledow co i gdzie jest nie tak dokladnie w pliku
function parse(input){
    try {
        var lines = input.split("\n")

        var key = lines[0]

        if (!possible_keys.includes(key)){
            throw new Error("Unrecognized key: " + key)
        }

        var system_or_first_chord = lines[1]

        var first_chord = null
        var system = null

        if (system_or_first_chord.includes(',')){
            //pierwszy akord
            //todo przeparsowac, pewnie osobna funkcja
        } else {
            //uklad
            if (! possible_systems.includes(system_or_first_chord)){
                throw new Error("Unrecognized system: " + key)
            }
            system = system_or_first_chord
        }

        var metre = lines[2]

        if (metre === 'C'){
            //alla breve
        } else {
            //todo czy to dziala
            metre = [parseInt(metre.split('/')[0]),parseInt(metre.split('/')[1])]
        }

        chords = []


        for (var i = 3; i < lines.length; i++){




        }





    }
    catch (error){
        console.log("Error during parsing file!")
        console.log(error)
        return null
    }
}