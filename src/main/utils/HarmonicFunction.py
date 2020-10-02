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
