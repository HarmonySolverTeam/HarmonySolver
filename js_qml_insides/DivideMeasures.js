function default_divide(number, result){
    //default_divide(3, [1/2])
    if(result.length === number) return result
    all_equal = true
    for(var i = 0; i < result.length-1; i++){
        if(result[i] > result[i+1]){
            result[i] /= 2
            result.splice(i, 0, result[i])
            all_equal = false
            break
        }
    }
    if(all_equal){
        result[result.length-1] /= 2
        result.push(result[result.length-1])
    }
    return default_divide(number, result)
}

function find_division_point(list){
    var front = 0
    var back = list.length - 1
    var front_sum = list[0][front], back_sum = list[0][back]
    var last = -1
    while(front !== back){
        if(front_sum >= back_sum){
            back--
            back_sum += list[0][back]
            last = 0
        }else{
            front++
            front_sum += list[front]
            last = 1
        }
    }
    return last===0?back+1:front-1
}

function divide_fun_changed(measure){
    var funList = []
    var changes_counter = 0
    if(measure.length === 1) return [[1, 0]]
    for(var i = 0; i < measure.length-1; i++){
        var one_fun_counter = 0
        //while(i < measure.length-1 && measure[i].harmonicFunction.equals(measure[i+1])){
        while(i < measure.length-1 && measure[i].functionName === measure[i+1].functionName){
            one_fun_counter++
            i++
        }
        funList.push([one_fun_counter+1, changes_counter])
        changes_counter++
    }
    return funList
}

//todo na prawdziwych obiektach, a nie jsonach
var ex = {"mode":[3,4],"key":"E","meter":"major","system":null,"measures":[[{"functionName":"T","position":3},{"functionName":"T","position":1},{"functionName":"T","position":5},{"functionName":"S","position":3},{"functionName":"D","position":-1},{"functionName":"D","position":3}],[{"functionName":"T","degree":"","extra":""},{"functionName":"T","degree":"","extra":""}],[{"functionName":"S","degree":"","extra":""}]],"first_chord":["10","20","30","40"]}
//var ex = {"mode":[3,4],"key":"E","meter":"major","system":null,"measures":[[{"functionName":"T","position":3}]],"first_chord":["10","20","30","40"]}

var measures = ex.measures

console.log("append "+(measures.length-1)+" measures - curScore.appendMeasures(measures.length-1)")

for(var measure_id = 0; measure_id < measures.length; measure_id++){
    var current_measure = measures[measure_id]
    var funList = divide_fun_changed(current_measure)
    function add_time_to_fun(list, value){
        if(list.length === 1) {
            funList[list[0][1]].push(value)
            return
        }
        var index = find_division_point(list)
        var list1 = list.slice(0, index)
        var list2 = list.slice(index, list.length)
        add_time_to_fun(list1, value/2)
        add_time_to_fun(list2, value/2)
    }
    add_time_to_fun(funList, 1)
    counter_measure = 0
    counter_fun = 0
    while(counter_measure < current_measure.length){
        for(var i = 0; i < funList.length; i++){
            len_list = default_divide(funList[i][0], [funList[i][2]])
            for(var j = 0; j < len_list.length; j++) {
                console.log("cursor.setDuration(1, "+1/len_list[j]+") add chord " + current_measure[counter_measure].functionName)
                counter_measure++
            }
        }
        counter_fun++
        counter_measure++
    }
}





function Scale(baseNote) {
    this.baseNote = baseNote
}

function MajorScale(baseNote, tonicPitch) {
    Scale.call(this.baseNote)
    this.tonicPitch = tonicPitch
    this.pitches = [0, 2, 4, 5, 7, 9, 11]
}

function MajorScale(key){
    Scale.call(this, keyStrBase[key])
    this.tonicPitch = keyStrPitch[key]
    this.pitches = [0, 2, 4, 5, 7, 9, 11]
}
var keyStrPitch = {
    'C'  : 60,
    'C#' : 61,
    'Db' : 61,
    'D'  : 62,
    'Eb' : 63,
    'E'  : 64,
    'F'  : 65,
    'F#' : 66,
    'Gb' : 66,
    'G'  : 67,
    'Ab' : 68,
    'A'  : 69,
    'Bb' : 70,
    'B'  : 71,
    'Cb' : 71
}
var BASE_NOTES = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6
}

var keyStrBase = {
    'C'  : BASE_NOTES.C,
    'C#' : BASE_NOTES.C,
    'Db' : BASE_NOTES.D,
    'D'  : BASE_NOTES.D,
    'Eb' : BASE_NOTES.E,
    'E'  : BASE_NOTES.E,
    'F'  : BASE_NOTES.F,
    'F#' : BASE_NOTES.F,
    'Gb' : BASE_NOTES.G,
    'G'  : BASE_NOTES.G,
    'Ab' : BASE_NOTES.A,
    'A'  : BASE_NOTES.A,
    'Bb' : BASE_NOTES.B,
    'B'  : BASE_NOTES.B,
    'Cb' : BASE_NOTES.C
}


var s = new MajorScale("E")

console.log(s.baseNote)