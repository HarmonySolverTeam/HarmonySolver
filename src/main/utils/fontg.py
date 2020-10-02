from HarmonicFunction import HarmonicFunction, get_base_component

degree_values = ["II", "III", "VI", "VII", ""] #5
extra_values = [ "6", "7", "9",
                 "6>", "7<", "9>", ""] #10  -> 7
omit_values = ["1", "5",
               "1>", "5>", ""] #7  -> 5
position_values = [ "1", "3", "5", "6", "7", "9",
                    "1>", "3>", "5>", "6>", "7<", "9>",
                    "5<",""] #19 -> 14
revolution_values = position_values # 19 -> 14
system_values = [""] #3
mode_values = ["moll", ""] #2
down_values = ["down", ""] #2
# delay_values generating

single_delay_values = [
    ["2", "1"],
    ["2", "1>"],
    ["2>", "1"],
    ["2>", "1>"],
    ["4", "3"],
    ["4", "3>"],
    ["6", "5"],
    ["6", "5>"],
    ["6", "5<"],
    ["6>", "5"],
    ["6>", "5>"],
    ["6>", "5<"],
    ["7", "6"],
    ["7", "6>"],
    ["7<", "6"],
    ["7<", "6>"],
    # ["8", "7"],
    # ["8", "7<"],
    # ["8", "9"],
    # ["8", "9>"],
    ["9", "8"],
    ["9>", "8"],
    []
] #22

delay_values = []
for del1 in single_delay_values:
    if del1 == []:
        delay_values += [[[],[]]]
        continue
    for del2 in single_delay_values:
        if del2 == []:
            delay_values += [[del1, del2]]
            delay_values += [[[del1[1], del1[0]], del2]]
        # if del2 != []:
        #     if int(get_base_component(del1[0])) > int(get_base_component(del2[0])) and int(get_base_component(del1[0])) > int(get_base_component(del2[1])):
        #         delay_values += [[del1, del2]]

print(len(delay_values))
for delay in delay_values:
    print(delay)

# temporary reset
# delay_values = [[[],[]]]


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
all_chords_count *= len(delay_values)

print("All combinations count: " + str(all_chords_count))


def merge_tokens(tokens:[]):
    merged_tokens = ""
    for t in tokens:
        merged_tokens += t
    return merged_tokens


def get_names_of(tokens: []):
    name_template = "<name>{}</name>\n"
    return name_template.format(merge_tokens(tokens).replace("<","&lt;").replace(">","&gt;"))


def get_render_of(tokens:[]):
    render_template = "<render>{}</render>\n"
    tokens = list(map(lambda t: "&{};".format(t), tokens) )
    return render_template.format(merge_tokens(tokens).replace("<","x").replace(">","y"))


def create_chord_block_of(tokens:[]):
    block_template = "<chord id=\"{0}\">\n{1}</chord>\n\n"

    content = get_names_of(tokens) + get_render_of(tokens)
    return block_template.format("{}", content)




file = open('ultimate.xml', 'w+')

def move_deeper(current_node:{}, property_key:str, property_values:[], next_function):
    for value in property_values:
        current_node[property_key] = value
        next_function(current_node)

def add_position(current_node):
    move_deeper(current_node, "position", position_values, add_revolution)

def add_revolution(current_node):
    move_deeper(current_node, "revolution", revolution_values, add_extra)

def add_extra(current_node):
    move_deeper(current_node, "extra", extra_values, add_omit)

def add_omit(current_node):
    move_deeper(current_node, "omit", omit_values, add_delay)

def add_delay(current_node):
    move_deeper(current_node, "delay", delay_values, add_degree)

def add_degree(current_node):
    # in here I do some validation to improve performance
    hf = HarmonicFunction(position=current_node["position"],
                          revolution=current_node["revolution"],
                          extra=current_node["extra"],
                          omit=current_node["omit"],
                          delay=current_node["delay"],
                          degree="",down="",mode="",system="")
    if not hf.validate():
        return

    move_deeper(current_node, "degree", degree_values, add_mode)

def add_mode(current_node):
    move_deeper(current_node, "mode", mode_values, add_down)

def add_down(current_node):
    move_deeper(current_node, "down", down_values, final_function)

SEQ = 0
def final_function(current_node):
    global SEQ
    SEQ += 1
    hf = HarmonicFunction(position=current_node["position"],
                          revolution=current_node["revolution"],
                          extra=current_node["extra"],
                          omit=current_node["omit"],
                          delay=current_node["delay"],
                          degree=current_node["degree"],
                          down=current_node["down"],
                          mode=current_node["mode"],
                          system="")
    file.write(create_chord_block_of(hf.get_tokens()).format(SEQ))

add_position({})
file.close()