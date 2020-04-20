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

for(var measure_id = 0; measure_id < measures.length; measure_id++){
    var current_measure = measures[measure_id]
    console.log(current_measure)
    var funList = divide_fun_changed(current_measure)
    console.log(funList)
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
                console.log("add chord " + current_measure[counter_measure].functionName + " " + len_list[j])
                counter_measure++
            }
        }
        counter_fun++
        counter_measure++
    }
}