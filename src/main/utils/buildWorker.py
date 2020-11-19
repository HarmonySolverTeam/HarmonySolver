import os
import sys

""""
This script is using to build scripts for qml WorkerScript object. It require single file with code to execute 
(it doesn't support imports) so it is obligatory to squash code into one file.

How to use it? 
If it is required to execute some function/method etc. in separate thread move to localisation of file containing
that function and execute this script with name (from main dir context) of that file as an argument. 
You also need to prepare file *Prototype containing some WorkerScript instructions (look up SopranoSolverWorkerPrototype)
 
For example to build Solver2Worker::
1. Move to src/main/objects/soprano 
2. run this script by the following command "python ../../utils/buildWorker.py ../soprano/SopranoSolver.js"

Consider preparing dedicated configuration in your IDE to do it faster.
"""

COUNTER_MARK = "//${counter}"
COUNTER_REPLACEMENT = "d++; WorkerScript.sendMessage({ \'type\' : \"progress_notification\", \'progress\': d/D });"

class ImportDeclaration:
    def __init__(self, relative_path, import_name):
        self.relative_path = relative_path
        self.import_name = import_name

def is_import(line):
    return line[:7] == ".import"

def is_counter_line(line):
    return COUNTER_MARK  in line

def handle_import_line(line):
    # .import "relative_path" as import_name
    splited_import_line = line.split(" ")
    relative_path = splited_import_line[1][1:-1]
    import_name = splited_import_line[3]
    return ImportDeclaration(relative_path, import_name)


def handle_file(filename):
    file = open(filename)
    result = ""
    current_import_declarations = []
    counter_occurrences_count = 0
    for line in file:
        if is_import(line):
            import_declaration = handle_import_line(line)
            current_import_declarations.append(import_declaration)
        elif is_counter_line(line):
            result += line.replace(COUNTER_MARK, COUNTER_REPLACEMENT)
            counter_occurrences_count += 1
        else:
            result += line

    # trochę drut ale działa
    result = result.replace(".call", "#call")

    for i_d in sorted(current_import_declarations, key = lambda x: len(x.import_name), reverse=True ):
        result = result.replace(" " + i_d.import_name[:-1] + ".", " ")
        result = result.replace("(" + i_d.import_name[:-1] + ".", "(")
        result = result.replace("[" + i_d.import_name[:-1] + ".", "[")
        result = result.replace("!" + i_d.import_name[:-1] + ".", "!")

    # trochę drut ale działa
    result = result.replace("#call", ".call")

    return result, current_import_declarations, counter_occurrences_count


if __name__ == "__main__":
    result = ""
    header = ""
    root_file = sys.argv[1]
    counter_occurrences_count = 0

    prototype = "../../" + root_file[root_file.rindex("/"):-3] + "WorkerPrototype.js"
    res, import_declarations, _ = handle_file(prototype)
    all_import_declarations = import_declarations[:]
    header += res + "\n"
    handled_files = [prototype]

    res, import_declarations, counter_occurrences = handle_file(root_file)
    all_import_declarations += import_declarations[:]
    result += res + "\n"
    counter_occurrences_count += counter_occurrences
    handled_files += [root_file]

    file_to_handle_probably_exists = True
    while file_to_handle_probably_exists:
        file_to_handle_probably_exists = False
        for i_d in all_import_declarations:
            if i_d.relative_path not in handled_files:
                file_to_handle_probably_exists = True
                res, import_declarations, counter_occurrences = handle_file(i_d.relative_path)
                all_import_declarations += import_declarations
                result += res + "\n"
                counter_occurrences_count += counter_occurrences
                handled_files += [i_d.relative_path]

    worker_name = root_file[root_file.rindex("/"):-3] + "Worker.js"
    out_file = open("../../" + worker_name ,"w+")
    out_file.write(header.replace("${counter}", str(counter_occurrences_count)) + result)

