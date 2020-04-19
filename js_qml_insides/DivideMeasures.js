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

function divide_fun_changed(measure){ //niesprawdzone, ale powinno działać
    var funList = []
    var changes_counter = 0
    for(var i = 0; i < measure.length-1; i++){
        var one_fun_counter = 0
        while(i < measure.length-1 && measure[i].harmonicFunction.equals(measure[i+1])){
            one_fun_counter++
            i++
        }
        funList.push([one_fun_counter, changes_counter])
        changes_counter++
    }
    return funList
}

//ALGORITHM
//Działa tylko dla metrum = x / 2^n. Pasuje uogólnić na inne, lub rozpisać
//te same funkcje dla innych metrum. Poniżej częściowy algorytm, kilka
//rzeczy uprościłem, trzeba dokładnie rozpisać
/* for current_measure in measures:
        curScore.appendMeasure(1)
        funList = divide_fun_changed(current_measure)
        function add_time_to_fun(list, value){...}
        add_time_to_fun(funList, 1)

        counter_measure = 0
        counter_fun = 0
        while(counter_measure < current_measure.length){
            for(var i = 0; i < funList.length, i++){
                len_list = default_divide(funList[i][0], [funList[i][2]])
                for len in len_list:
                    cursor.addChord(current_measure[counter_measure], len)
                    counter_measure++
            }
            counter_fun++
            counter_measure++
        }
 */




//var myList = [[3,0], [2,1], [1,2], [3,3], [4,4]] //for testing



function add_time_to_fun(list, value){
    if(list.length === 1) {
        myList[list[0][1]].push(value)
        return
    }
    var index = find_division_point(list)
    var list1 = list.slice(0, index)
    var list2 = list.slice(index, list.length)
    add_time_to_fun(list1, value/2)
    add_time_to_fun(list2, value/2)
}

//for testing
//add_time_to_fun(myList, 1)
//console.log(myList)

