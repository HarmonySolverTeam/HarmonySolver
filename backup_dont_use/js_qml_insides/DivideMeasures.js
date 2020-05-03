function default_divide(number, result){
    //default_divide(3, [1/2]) // [3]
    if(result.length === number) return result
    all_equal = true
    for(var i = 0; i < result.length-1; i++){
        if(result[i] > result[i+1]){
            if(result[i]<=1) {
                result[i] /= 2
                result.splice(i, 0, result[i])
            } else{
                newElement = Math.ceil(result[i]/2)
                result[i] = Math.floor(result[i]/2)
                result.splice(i, 0, newElement)
            }
            all_equal = false
            break
        }
    }
    if(all_equal){
        if(result[result.length-1]<=1) {
            result[result.length - 1] /= 2
            result.push(result[result.length - 1])
        } else{
            newElement = Math.floor(result[result.length - 1]/2)
            result[result.length - 1] = Math.ceil(result[result.length - 1]/2)
            result.push(newElement)
        }
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
var ex = {"mode":[3,4],"key":"E","meter":"major","system":null,"measures":[[{"functionName":"T","position":3},{"functionName":"T","position":1},{"functionName":"T","position":5},{"functionName":"S","position":3},{"functionName":"D","position":-1},{"functionName":"D","position":3}],[{"functionName":"T","degree":"","extra":""},{"functionName":"T","degree":"","extra":""}],[{"functionName":"S","degree":"","extra":""}]]}
//var ex = {"mode":[3,4],"key":"E","meter":"major","system":null,"measures":[[{"functionName":"T","position":3}]]}
var upperTime = ex.mode[0]
var lowerTime = ex.mode[1]
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
        if(value > 1){
            add_time_to_fun(list1, Math.floor(value / 2))
            add_time_to_fun(list2, Math.ceil(value / 2))
        }else {
            add_time_to_fun(list1, value / 2)
            add_time_to_fun(list2, value / 2)
        }
    }
    add_time_to_fun(funList, upperTime)
    counter_measure = 0
    counter_fun = 0
    while(counter_measure < current_measure.length){
        for(var i = 0; i < funList.length; i++){
            len_list = default_divide(funList[i][0], [funList[i][2]])
            for(var j = 0; j < len_list.length; j++) {
                if(len_list[j] >= 1)
                    console.log("cursor.setDuration("+len_list[j]+"/"+lowerTime+") add chord " + current_measure[counter_measure].functionName)
                else
                    console.log("cursor.setDuration("+1+"/"+lowerTime*(1/len_list[j])+") add chord " + current_measure[counter_measure].functionName)
                counter_measure++
            }
        }
        counter_fun++
        counter_measure++
    }
}