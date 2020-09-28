
DEGREE = "deg"
POSITION = "p"
REVOLUTION = "r"
EXTRA = "e"
OMIT = "om"
DELAY = "delay"
# DOWN "down"
# MODE "moll"
# SYSTEM "open" | "close"

def get_base_component(cc : str):
    cc = cc.replace(">", "")
    cc = cc.replace("<", "")
    return cc

def some_trasform(cc : str):
    cc_base = get_base_component(cc)
    if cc_base in ["1", "3", "5"]:
        return cc_base
    return cc

class HarmonicFunction():

    def __init__(self, degree, position, revolution, extra, omit, delay, down, mode, system):
        self.degree = degree
        self.position = position
        self.revolution = revolution
        self.extra = extra
        self.omit = omit
        self.delay = delay
        self.down = down
        self.mode = mode
        self.system = system
        self.str = self.__str__()
    
    def validate(self):
        if self.position == self.extra and self.position != "": 
            return False
        if self.revolution == self.extra and self.revolution != "":
            return False
        if self.position == self.omit and self.position != "": 
            return False
        if self.revolution == self.omit and self.revolution != "":
            return False
        if self.extra == self.omit and self.extra != "":
            return False

        # if self.position == self.revolution and self.position != "" and self.extra != "" and self.omit == "":
        #     return False
        if self.get_chord_components_count() > 4:
            return False

        if self.get_base_chord_components_count() != self.get_chord_components_count():
            return False
        # validacja delayów
        return True

    def get_base_chord_components(self):
        return ["1", "3", "5"]

    def get_chord_components(self):
        chord_components = self.get_base_chord_components()
        if len(self.omit) > 0:
            chord_components.remove(some_trasform(self.omit))
        if len(self.extra) > 0:
            chord_components.append(some_trasform(self.extra))
        if len(self.position) > 0:
            chord_components.append(some_trasform(self.position))
        if len(self.revolution) > 0:
            chord_components.append(some_trasform(self.revolution))
        return list(set(chord_components))

    def get_chord_components_count(self):
        return len(self.get_chord_components())

    def get_base_chord_components_count(self):
        return len(list(set(map(get_base_component, self.get_chord_components()))))

    def get_tokens(self):
        res = []
        res += [POSITION + self.position] if self.position != "" else []
        res += [REVOLUTION + self.revolution] if self.revolution != "" else []
        res += [EXTRA + self.extra] if self.extra != "" else []
        res += [self.mode] if self.mode != "" else []
        res += [DEGREE + self.degree] if self.degree != "" else [] 
        res += [self.down] if self.down != "" else []
        res += [OMIT + self.omit] if self.omit != "" else []
        res += [self.system] if self.system != "" else []

        # delays token looks like del(x1,x2=y1,y2) or del(x1=y1)
        if len(self.delay[0]) == 0 and len(self.delay[1]) == 0:
            return res
        # delay like [[], ["x", "y"]] is illegal
        if len(self.delay[0]) != 0:
            # delay like [["x","y"], []]
            if len(self.delay[1]) == 0:
                res += [DELAY + "({0}={1})".format(self.delay[0][0], self.delay[0][1])]
            # delay like [["x1","y1"], ["x2","y2"]]
            if len(self.delay[1]) != 0:
                res += [DELAY + "({0},{1}={2},{3})".format(self.delay[0][0], self.delay[1][0], self.delay[0][1], self.delay[1][1])]

        return res

    def __str__(self):
        res = ""
        res += POSITION + self.position if self.position != "" else ""
        res += REVOLUTION + self.revolution if self.revolution != "" else ""
        res += EXTRA + self.extra if self.extra != "" else ""
        res += self.mode
        res += DEGREE + self.degree if self.degree != "" else ""
        res += self.down
        res += OMIT + self.omit if self.omit != "" else ""
        res += self.system

        if len(self.delay[0]) == 0 and len(self.delay[1]) == 0:
            return chr(len(res)) + res
        # delay like [[], ["x", "y"]] is illegal
        if len(self.delay[0]) != 0:
            # delay like [["x","y"], []]
            if len(self.delay[1]) == 0:
                res += DELAY + "({0}={1})".format(self.delay[0][0], self.delay[0][1])
            if len(self.delay[1]) != 0:
                res += DELAY + "({0},{1}={2},{3})".format(self.delay[0][0], self.delay[1][0], self.delay[0][1], self.delay[1][1])

        return chr(len(res)) + res

#
# degree_values = ["II", "III", "VI", "VII", ""] #5
# extra_values = [ "6", "7", "9",
#                  "6>", "7>", "9>",
#                  "6<", "7<", "9<",  ""] #10
# omit_values = ["1", "5",
#                "1>", "5>",
#                "1<", "5<", ""] #7
# position_values = [ "1", "3", "5", "6", "7", "9",
#                     "1>", "3>", "5>", "6>", "7>", "9>",
#                     "1<", "3<", "5<", "6<", "7<", "9<", ""] #19
# revolution_values = position_values # 19
# system_values = ["open", "close", ""] #3
# mode_values = ["moll", ""] #2
# down_values = ["down", ""] #2
# # delay_values generating
# delay_templates = [
#     ["{}", "{}"],
#     ["{}>", "{}"],
#     ["{}<", "{}"],
#     ["{}", "{}>"],
#     ["{}>", "{}>"],
#     ["{}<", "{}>"],
#     ["{}", "{}<"],
#     ["{}>", "{}<"],
#     ["{}<", "{}<"]
# ]


# degree_values = ["II", "III", "VI", "VII", ""] #5
# extra_values = [ "6", "7", "9",
#                  "6&lt;", "7&lt;", "9&lt;",
#                  "6&gt;", "7&gt;", "9&gt;",  ""] #10
# omit_values = ["1", "5",
#                "1&lt;", "5&lt;",
#                "1&gt;", "5&gt;", ""] #7
# position_values = [ "1", "3", "5", "6", "7", "9",
#                     "1&lt;", "3&lt;", "5&lt;", "6&lt;", "7&lt;", "9&lt;",
#                     "1&gt;", "3&gt;", "5&gt;", "6&gt;", "7&gt;", "9&gt;", ""] #19
# revolution_values = position_values # 19
# system_values = ["open", "close", ""] #3
# mode_values = ["moll", ""] #2
# down_values = ["down", ""] #2
# # delay_values generating
# delay_templates = [
#     ["{}", "{}"],
#     ["{}&lt;", "{}"],
#     ["{}&gt;", "{}"],
#     ["{}", "{}&lt;"],
#     ["{}&lt;", "{}&lt;"],
#     ["{}&gt;", "{}&lt;"],
#     ["{}", "{}&gt;"],
#     ["{}&lt;", "{}&gt;"],
#     ["{}&gt;", "{}&gt;"]
# ]

degree_values = ["II", "III", "VI", "VII", ""] #5
extra_values = [ "6", "7", "9",
                 "6>", "7>", "9>",
                 "6<", "7<", "9<",  ""] #10
omit_values = ["1", "5",
               "1>", "5>",
               "1<", "5<", ""] #7
position_values = [ "1", "3", "5", "6", "7", "9",
                    "1>", "3>", "5>", "6>", "7>", "9>",
                    "1<", "3<", "5<", "6<", "7<", "9<", ""] #19
revolution_values = position_values # 19
system_values = [""] #3
mode_values = [""] #2
down_values = [""] #2
# delay_values generating
delay_templates = [
    ["{}", "{}"]
]

delay_fleshes = [
    ["4", "3"]
]

single_delay_values = [[]] #55
for fl in delay_fleshes:
    for temp in delay_templates:
        single_delay_values += [[temp[0].format(fl[0]), temp[1].format(fl[1])]]

delay_values = []
for del1 in single_delay_values:
    if del1 == []:
        delay_values += [[[],[]]]
        continue
    for del2 in single_delay_values:
        if del2 == []:
            delay_values += [[del1, del2]] 
        if del2 != [] and del1[0][0] not in del2[0]:
            delay_values += [[del1, del2]] 

# print(len(delay_values))



# //////////////////////////////////////////////////////
all_chords_count = 1
all_chords_count *= len(degree_values)
all_chords_count *= len(extra_values)
all_chords_count *= len(omit_values)
all_chords_count *= len(position_values)
all_chords_count *= len(revolution_values )
all_chords_count *= len(system_values)
all_chords_count *= len(mode_values)
all_chords_count *= len(down_values)
# all_chords_count *= len(delay_values)

print("All combinations count: " + str(all_chords_count))

prev_progres = 0.0
curr_progres = 0.0

handled_chords_numb = 0

# temporary reset
delay_values = [[[],[]]]

# delay_values = ... D(6,4=5,3) p1r1e7 => o5
#  2|2>|2<  1
#  4         3
#  2        3
#  6       5
#  4       5
#           7
#           7
#  8        9
#  9        8
#           6
#           6

def merge_tokens(tokens:[]):
    merged_tokens = ""
    for t in tokens:
        merged_tokens += t
    return merged_tokens


def get_names_of(tokens: []):
    name_template = "<name>{}</name>\n"
    # return name_template.format(merge_tokens(tokens))
    return name_template.format(merge_tokens(tokens).replace("<","&lt;").replace(">","&gt;"))


def get_render_of(tokens:[]):
    render_template = "<render>{}</render>\n"
    tokens = list(map(lambda t: "&{};".format(t), tokens) )
    # return render_template.format(merge_tokens(tokens).replace("&lt;","x").replace("&gt;","y"))
    return render_template.format(merge_tokens(tokens).replace("<","x").replace(">","y"))


def create_chord_block_of(tokens:[]):
    block_template = "<chord id=\"{0}\">\n{1}</chord>\n\n"

    content = get_names_of(tokens) + get_render_of(tokens)
    return block_template.format("{}", content)
    

counter = 1
result_content = [""]

result_content += ["\n"]

harmonic_functions = []
for a in position_values:
    for b in revolution_values:
        for c in extra_values:
            for d in mode_values:
                for e in degree_values:
                    for f in down_values:
                        for g in omit_values:
                            for h in system_values:
                                for i in delay_values:
                                    hf = HarmonicFunction(degree=e, position=a, revolution=b, extra=c, omit=g, down=f, mode=d, system=h, delay=i)
                                    if hf.validate():
                                        harmonic_functions.append(hf) 
                                        handled_chords_numb += 1
                                    curr_progres = 100 * handled_chords_numb / all_chords_count
                                    if curr_progres - prev_progres > 0.5:
                                        prev_progres = curr_progres
                                        print("Progres {:.2f}%".format(prev_progres))

print("All combinations count: " + str(all_chords_count))
print("All valid chords count: " + str(handled_chords_numb))

#
#                                     # block = create_chord_block_of( hf.get_tokens() )
#                                     # result_content += block.format(counter)
#                                     # counter += 1
print("Start sorting:")
# harmonic_functions.sort(key = lambda hf: hf.__str__())
harmonic_functions.sort(key = lambda hf: hf.__str__(), reverse=True)
print("Finish sorting")
print("Start merging")
print("Hf count: " + str(len(harmonic_functions)))
for i in range(1, len(harmonic_functions)):
    result_content += [create_chord_block_of(harmonic_functions[i].get_tokens()).format(i)]
    if i % 10000 == 0:
        print(i)

res = ''.join(result_content)
print("Finish merging")
print("Start saving")

file = open('ultimate.xml', 'w+')
file.write(res)
file.close()
print("DONE")
