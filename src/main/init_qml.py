import os

FILES_ORIGIN_DIR = "objects"

fileObjects = []

def countColons(txt):
    count = 0
    for i in txt:
        if i == ":":
            count = count + 1
    return count

def count_brackets(line, bracket_type):
    return line.count(bracket_type) - line.count("\"" + bracket_type + "\"") - line.count("\'" + bracket_type + "\'")

def transform_js_file(file_name, context_path):
    input_file = open(FILES_ORIGIN_DIR + context_path + "/" + file_name + ".js", "r")

    tabs = "\t"
    buffer = ""
    gState = 0
    brackets = 0
    brackets2 = 0
    brackets3 = 0
    objects = set([])
    properties = set([])
    fileObject = file_name[:1].lower()+file_name[1:]
    fileObjects.append(fileObject)
    imports = []
    #buffer += tabs + fileObject+" = {\n"
    buffer += "\n"
    # for obj in fileObjects:
    #     buffer += "\t\t"+fileObject+"."+obj+" = "+obj+"\n"
    for line in input_file:
        if line.lstrip().startswith("//"):
            continue
        for obj in objects:
            def containsExact(obj, line):
                i = 0
                while i < len(line) - len(obj) - 1:
                    if line[i:i+len(obj)] == obj and not line[i+len(obj)].isalpha():
                        return True
                    i = i + 1
                return False
            if containsExact(" "+obj[1], line):
                line = line.replace(" "+obj[1], " "+fileObject+"."+obj[0])
            if containsExact("("+obj[1], line):
                line = line.replace("("+obj[1], "("+fileObject+"."+obj[0])
            if containsExact("["+obj[1], line):
                line = line.replace("["+obj[1], "["+fileObject+"."+obj[0])
            if containsExact("!"+obj[1], line):
                line = line.replace("!"+obj[1], "!"+fileObject+"."+obj[0])
            if containsExact(","+obj[1], line):
                line = line.replace(","+obj[1], ","+fileObject+"."+obj[0])
        for property in properties:
            if "function" not in line:
                line = line.replace(property, fileObject+"."+property)
                line = line.replace(fileObject+"."+fileObject, fileObject)
                correctedLine = ""
                i = 0
                while i < len(line):
                    if line[i+1:i+1+len(fileObject+".")] == fileObject+".": # or line[i+1+len(fileObject+".")].isalpha()
                            #todo sprawdzic  czy slowo po . nalezy do property
                            x = line[i+1+len(fileObject+"."):]
                            p = 0
                            string = ""
                            while x[p].isalpha() or x[p] == "_":
                                    string += x[p]
                                    p = p + 1
                            if ((string not in properties) or (line[i].isalpha() or line[i] == "_")) and string not in imports:
                                correctedLine += line[i]
                                i = i + len(fileObject+".") + 1
                            else:
                                correctedLine += line[i]
                                i = i + 1
                    else:
                        correctedLine += line[i]
                        i = i + 1
                line = correctedLine



        if gState == 1:
            brackets += count_brackets(line, "{")
            brackets2 += count_brackets(line, "[")
            brackets3 += count_brackets(line, "(")
            brackets -= count_brackets(line, "}")
            brackets2 -= count_brackets(line, "]")
            brackets3 -= count_brackets(line, ")")

            if brackets == 0 and brackets2 == 0 and brackets3 == 0:
                # line = line.replace("\n",",\n")
                gState = 0

            buffer += tabs + "\t"+line
            continue
        splited = line.split(" ")
        if splited[0] == "function":
            if splited[1].split("(")[0] == "SameFunctionCheckConnectionRule":
                print(splited[1].split("(")[0].strip())
            buffer += tabs + "\t"+fileObject+"."+splited[1].split("(")[0] + " = " + line
            gState = 1
            properties.add(splited[1].split("(")[0].strip())

            brackets += count_brackets(line, "{")
            brackets2 += count_brackets(line, "[")
            brackets3 += count_brackets(line, "(")
            brackets -= count_brackets(line, "}")
            brackets2 -= count_brackets(line, "]")
            brackets3 -= count_brackets(line, ")")

        elif splited[0] == ".import":
            orginal = line[line.index("\""):line.rindex("\"")].split("/")[-1][:-3]
            orginal = orginal[:1].lower() + orginal[1:]
            mapped = line.split(" ")[-1].replace("\n","")
            objects.add((orginal, mapped))
            imports.append(orginal)
            buffer += "\t\t"+fileObject+"."+orginal+" = "+orginal+"\n"
            pass
        elif splited[0] == "var":

            brackets += count_brackets(line, "{")
            brackets2 += count_brackets(line, "[")
            brackets3 += count_brackets(line, "(")
            brackets -= count_brackets(line, "}")
            brackets2 -= count_brackets(line, "]")
            brackets3 -= count_brackets(line, ")")

            gState = 1
            if brackets == 0 and brackets2 == 0 and brackets3 == 0 :
                if "=" not in line[4: ]:
                    buffer += tabs + "\t"+fileObject+"."+line[4:].replace("\n"," = undefined\n")
                else:
                    buffer += tabs + "\t"+fileObject+"."+line[4:]
                gState = 0
            else:
                buffer += tabs + "\t"+fileObject+"."+line[4:]
            properties.add(splited[1].strip())
            continue
        else:
            buffer += tabs + "\t"+line
    # buffer += "\n\t\t}\n"
    return buffer

def transform_qml_file(qmlBuffer):
    input_file = open("harmonysolver.qml", "r")
    output_file = open("harmonysolverzip.qml", "w+")
    objects = set([])
    writeObjects = False
    writeDefs = False
    for line in input_file:
        if writeObjects:
            for obj in fileObjects:
                output_file.write("\tproperty var "+obj+": ({})\n")
            writeObjects = False

        if writeDefs:
            output_file.write(qmlBuffer)
            writeDefs = False

        for obj in objects:
            line = line.replace(" "+obj[1], " "+obj[0])
            line = line.replace("("+obj[1], "("+obj[0])
            line = line.replace("["+obj[1], "["+obj[0])
            line = line.replace("!"+obj[1], "!"+obj[0])
            line = line.replace(","+obj[1], ","+obj[0])

        if line.lstrip().startswith("//"):
            continue

        if "onRun:" in line:
            writeDefs = True

        if "MuseScore" in line and "import" not in line:
            writeObjects = True

        splited = line.split(" ")

        if splited[0] == "import" and "\"" in line:
            orginal = line[line.index("\""):line.rindex("\"")].split("/")[-1][:-3]
            orginal = orginal[:1].lower() + orginal[1:]
            mapped = line.split(" ")[-1].replace("\n","")
            objects.add((orginal, mapped))
        else:
            output_file.write(line)

def transform_dir(context_path):
    qmlBuffer = ""
    for file in os.listdir(FILES_ORIGIN_DIR + context_path):
        if os.path.isdir(FILES_ORIGIN_DIR + context_path + "/" +file):
            qmlBuffer += transform_dir(context_path + "/" + file)
        else:
            if file[-3:] == ".js":
                qmlBuffer += transform_js_file(file[:-3], context_path)
    return qmlBuffer

transform_qml_file(transform_dir(""))
