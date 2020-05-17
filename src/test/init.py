import os

FILES_ORIGIN_DIR = "../main/objects"
FILES_OUTPUT_DIR = "./objects"

def transform_file(file_name):
    input_file = open(FILES_ORIGIN_DIR + "/" + file_name + ".js", "r")
    output_file = open(FILES_OUTPUT_DIR + "/" + file_name + ".js", "w")
    for line in input_file:
        splited = line.split(" ");
        if splited[0] == "function":
            output_file.write("exports." + splited[1].split("(")[0] + " = " + line)
        elif splited[0] == ".import":
            output_file.write("var " + splited[3][:-1] + " = require(" + splited[1][:-4] + "\")\n")
        else:
            output_file.write(line)


files = list(filter( lambda x: x[-3:] == ".js", os.listdir("../main/objects")))
print(files)

for file in files:
    name = file[:-3]
    transform_file(name)