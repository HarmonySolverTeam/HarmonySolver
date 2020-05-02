function ExerciseSolution(exercise, rating, chords){
    this.exercise = exercise;
    this.rating = rating;
    this.chords = chords;
    this.chords.unshift(exercise.first_chord)
    this.exercise.measures[0].unshift(exercise.first_chord.harmonicFunction)

    this.setDurations = function(){
        function default_divide(number, result){
            //default_divide(3, [1/2])
            if(result.length === number) return result
            var all_equal = true
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
                while(i < measure.length-1 && measure[i].equals(measure[i+1])){
                    one_fun_counter++
                    i++
                }
                funList.push([one_fun_counter+1, changes_counter])
                changes_counter++
            }
            return funList
        }

        var measures = this.exercise.measures
        var offset = 0
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
            var counter_measure = 0
            var counter_fun = 0
            while(counter_measure < current_measure.length){
                for(var i = 0; i < funList.length; i++){
                    var len_list = default_divide(funList[i][0], [funList[i][2]])
                    for(var j = 0; j < len_list.length; j++) {
                        console.log("Duration added : "+this.chords[counter_measure+offset].toString())
                        this.chords[counter_measure+offset].duration = [1,1/len_list[j]]
                        counter_measure++
                    }
                }
                counter_fun++
            }
            offset += current_measure.length
        }
    }
}
