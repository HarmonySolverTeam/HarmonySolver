import os

FILES_ORIGIN_DIR = "../main/objects"
FILES_OUTPUT_DIR = "./objects"

def count_brackets(line, bracket_type):
    return line.count(bracket_type) - line.count("\"" + bracket_type + "\"") - line.count("\'" + bracket_type + "\'")

def transform_file(file_name, context_path):
    input_file = open(FILES_ORIGIN_DIR + context_path + "/" + file_name + ".js", "r")
    output_file = open(FILES_OUTPUT_DIR + context_path + "/" + file_name + ".js", "w+")

    gState = 0
    brackets = 0
    brackets2 = 0
    brackets3 = 0
    buff = "\n"
    for line in input_file:
        if gState == 1:
            output_file.write("exports." + line[4:])

            brackets += count_brackets(line, "{")
            brackets2 += count_brackets(line, "[")
            brackets3 += count_brackets(line, "(")
            brackets -= count_brackets(line, "}")
            brackets2 -= count_brackets(line, "]")
            brackets3 -= count_brackets(line, ")")

            buff += line
            gState = 2
            if brackets == 0 and brackets2 == 0 and brackets3 == 0 :
                output_file.write(buff)
                buff = "\n"
                gState = 0
            continue
        if gState == 2:
            output_file.write(line)

            brackets += count_brackets(line, "{")
            brackets2 += count_brackets(line, "[")
            brackets3 += count_brackets(line, "(")
            brackets -= count_brackets(line, "}")
            brackets2 -= count_brackets(line, "]")
            brackets3 -= count_brackets(line, ")")

            buff += line
            if brackets == 0 and brackets2 == 0 and brackets3 == 0:
                output_file.write(buff)
                buff = "\n"
                gState = 0
            continue

        if line[:3] == "//G":
            gState = 1
            continue
        splited = line.split(" ")
        if splited[0] == "function":
            output_file.write("exports." + splited[1].split("(")[0] + " = " + line)
            gState = 2

            brackets += count_brackets(line, "{")
            brackets2 += count_brackets(line, "[")
            brackets3 += count_brackets(line, "(")
            brackets -= count_brackets(line, "}") 
            brackets2 -= count_brackets(line, "]")
            brackets3 -= count_brackets(line, ")")

            buff += line
        elif splited[0] == ".import":
            output_file.write("var " + splited[3][:-1] + " = require(" + splited[1][:-4] + "\")\n")
        else:
            output_file.write(line)


def transform_dir(context_path):
    for file in os.listdir(FILES_ORIGIN_DIR + context_path):
        if os.path.isdir(FILES_ORIGIN_DIR + context_path + "/" +file) and not os.path.isdir(FILES_OUTPUT_DIR + context_path + "/" + file):
            os.mkdir(FILES_OUTPUT_DIR + context_path + "/" + file)
            transform_dir(context_path + "/" + file)
        else:
            if file[-3:] == ".js":
                transform_file(file[:-3], context_path)

transform_dir("")