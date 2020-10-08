from HarmonicFunction import HarmonicFunction, get_base_component

degree_values = ["I", "II", "III", "IV", "V", "VI", "VII", ""] #5
extra_values = [""] #10  -> 7
omit_values = [""] #7  -> 5
position_values = [""] #19 -> 14
revolution_values = position_values # 19 -> 14
system_values = [""] #3
mode_values = ["moll", ""] #2
down_values = ["down", ""] #2
left_bracket = ["lb", ""]
right_bracket = ["rb", ""]
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
        if del2 != []:
            if int(get_base_component(del1[0])) > int(get_base_component(del2[0])) and int(get_base_component(del1[0])) > int(get_base_component(del2[1])):
                delay_values += [[del1, del2]]

def generateEntityForDelays(delays):
    template_single_delay = "<!ENTITY delay{}-{} \"&delay_begin; {} &dash; {} &backspace_dash; {} &delay_end;\">\n"
    res = ""
    template_double_delay = "<!ENTITY delay{0}{2}-{1}{3} \"&delay_up; &delay{0}-{1}; &delay_down; &delay_down; &delay{2}-{3}; &delay_up;\">\n"
    for delay in delays:
        back_spaces =""
        if delay[0] and not delay[1]:
            back_spaces += "&backspace_{}; ".format(delay[0][0][0])
            back_spaces += "&backspace_{}; ".format(delay[0][1][0])
            if delay[0][0].count(">") == 1:
                back_spaces += "&backspace_greater; "
            if delay[0][1].count(">") == 1:
                back_spaces += "&backspace_greater; "
            if delay[0][0].count("<") == 1:
                    back_spaces += "&backspace_lower; "
            if delay[0][1].count("<") == 1:
                back_spaces += "&backspace_lower; "

            res += template_single_delay.format(
                delay[0][0].replace("<", "x").replace(">","y"),
                delay[0][1].replace("<", "x").replace(">","y"),
                delay[0][0].replace("<", " &lower;").replace(">"," &greater;"),
                delay[0][1].replace("<", " &lower;").replace(">"," &greater;"),
                back_spaces
            )
        if delay[0] and delay[1]:
            res += template_double_delay.format(
                delay[0][0].replace("<", "x").replace(">","y"),
                delay[0][1].replace("<", "x").replace(">","y"),
                delay[1][0].replace("<", "x").replace(">","y"),
                delay[1][1].replace("<", "x").replace(">","y")
            )
    return res

print(generateEntityForDelays(delay_values))

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
    merged_tokens = merge_tokens(tokens).replace("<","x").replace(">","y")

    if merged_tokens.find("delay") != -1:
        merged_tokens = merged_tokens.replace("&rb;", "&spacing_rb;")
        if merged_tokens.find("deg") != -1:
            merged_tokens = merged_tokens.replace("&deg", "&react_deg")
        if merged_tokens.find("down") != -1:
            merged_tokens = merged_tokens.replace("&spacing_rb;","&backspace_down; &spacing_rb;")

    return render_template.format(merged_tokens)


def create_chord_block_of(tokens:[]):
    block_template = "<chord id=\"{0}\">\n{1}<voicing></voicing>\n</chord>\n\n"

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
    move_deeper(current_node, "degree", degree_values, add_mode)

def add_mode(current_node):
    move_deeper(current_node, "mode", mode_values, add_down)

def add_down(current_node):
    move_deeper(current_node, "down", down_values, add_left_bracket)

def add_left_bracket(current_node):
    move_deeper(current_node, "left_bracket", left_bracket, add_right_bracket)

def add_right_bracket(current_node):
    move_deeper(current_node, "right_bracket", right_bracket, final_function)

SEQ = 0
def final_function(current_node):
    hf = HarmonicFunction(position=current_node["position"],
                          revolution=current_node["revolution"],
                          extra=current_node["extra"],
                          omit=current_node["omit"],
                          delay=current_node["delay"],
                          degree=current_node["degree"],
                          down=current_node["down"],
                          mode=current_node["mode"],
                          system="",
                          left_bracket=current_node["left_bracket"],
                          right_bracket=current_node["right_bracket"])
    if not hf.validate():
        return

    global SEQ
    SEQ += 1

    file.write(create_chord_block_of(hf.get_tokens()).format(SEQ))

add_position({})
file.close()