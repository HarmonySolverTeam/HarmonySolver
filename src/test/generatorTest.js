var Generator = require("./objects/ChordGenerator")
var Consts = require("./objects/Consts")
var Chord = require("./objects/Chord")
var HarmonicFunction = require("./objects/HarmonicFunction")
var Note = require("./objects/Note")
var TestUtils = require("./TestUtils")
var ChordComponentManager = require("./objects/ChordComponentManager")
var Consts = require("./objects/Consts")
var Utils = require("./objects/Utils")
var Scale = require("./objects/Scale")

var generatorTestSuite = new TestUtils.TestSuite("ChordGenerator tests");

var cm = new ChordComponentManager.ChordComponentManager();

//some utilities using in this file only
var chordUseChordComponentInSoprano = (chord, cc) => {
    return chord.sopranoNote.chordComponent.equals(cc);
}

var chordUseChordComponentInAlto = (chord, cc) => {
    return chord.altoNote.chordComponent.equals(cc);
}

var chordUseChordComponentInTenor = (chord, cc) => {
    return chord.tenorNote.chordComponent.equals(cc);
}

var chordUseChordComponentInBass = (chord, cc) => {
    return chord.bassNote.chordComponent.equals(cc);
}

var chordUseComponent = (chord, cc) => {
    return chordUseChordComponentInSoprano(chord, cc)
        || chordUseChordComponentInAlto(chord, cc)
        || chordUseChordComponentInTenor(chord, cc)
        || chordUseChordComponentInBass(chord, cc);
}

var chordUseAllChordComponents = (chord, chordComponents) => {
    for (const cc of chordComponents) {
        if (!chordUseComponent(chord, cc)) return false;
    }
    return true;
}

var chordUseNoneOfChordComponents = (chord, chordComponents) => {
    for (const cc of chordComponents) {
        if (chordUseComponent(chord, cc)) return false;
    }
    return true;
}

var allResultChordsUseComponent = (res, cc) => {
    for (const chord of res) {
        var use = chordUseComponent(chord, cc);
        if (!use) return false;
    }
    return true;
}

var allResultChordsNotUseComponent = (res, cc) => {
    for (const chord of res) {
        var notUse = !(chordUseComponent(chord, cc));
        if (!notUse) return false;
    }
    return true;
}

var allResultChordsUseAllComponents = (res, chordComponents) => {
    for (const chord of res) {
        var use = chordUseAllChordComponents(chord, chordComponents);
        if (!use) return false;
    }
    return true;
}

var allResultChordsUseNoneOfComponents = (res, chordComponents) => {
    for (const chord of res) {
        var notUse = chordUseNoneOfChordComponents(chord, chordComponents);
        if (!notUse) return false;
    }
    return true;
}

var allResultChordsUseChordComponentInSoprano = (res, chordComponent) => {
    for (const chord of res) {
        // console.log(chord.toString())
        // console.log("=========================================")
        if (!chordUseChordComponentInSoprano(chord, chordComponent)) return false;
    }
    return true;
}

var allResultChordsUseChordComponentInBass = (res, chordComponent) => {
    for (const chord of res) {
        if (!chordUseChordComponentInBass(chord, chordComponent)) return false;
    }
    return true;
}


// main test class in this file
var generatorTest = (generator, harmonicFunction, assertion, arg) => {
    if (generator === undefined || generator === 'major') {
        for (const key of Consts.possible_keys_major) {
            var gen = new Generator.ChordGenerator(key, 'major');
            var res = gen.generate(harmonicFunction);
            if (!assertion(res, arg)) return false;
        }
    }
    if (generator === undefined || generator === 'minor') {
        for (const key of Consts.possible_keys_minor) {
            var gen = new Generator.ChordGenerator(key, 'minor');
            var res = gen.generate(harmonicFunction);
            if (!assertion(res, arg)) return false;
        }
    }
    if (generator === undefined || generator === 'major' || generator === 'minor') return true;
    var res = generator.generate(harmonicFunction);
    return assertion(res, arg);
}

// TEMPLATE:
// generatorTestSuite.addTest(new TestUtils.UnitTest(
//     () => generatorTest(
//         <>,
//         <>,
//         <>,
//         <>
//     ),
//     "<>"
// ));


//neapolitan chord tests
var neapolitan = new HarmonicFunction.HarmonicFunction("S", 2, undefined, "3>", undefined, [], [], true, undefined, Consts.MODE.MINOR);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        neapolitan,
        allResultChordsUseComponent,
        cm.chordComponentFromString("1", true)
    ),
    "Neapolitan chord contains prime which is chordComponent \'1\' with pitch -1"
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        neapolitan,
        allResultChordsNotUseComponent,
        cm.chordComponentFromString("1", false)
    ),
    "Neapolitan chord doesn\'t contain prime which is chordComponent \'1\' with pitch 0"
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        neapolitan,
        allResultChordsUseComponent,
        cm.chordComponentFromString("3>", false)
    ),
    "Neapolitan chord contains chordComponent \'3>\' with down=false"
));


generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        neapolitan,
        allResultChordsNotUseComponent,
        cm.chordComponentFromString("3>", true)
    ),
    "Neapolitan chord doesn\'t contain chordComponent \'3>\' with down=true"
));


generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        neapolitan,
        allResultChordsUseComponent,
        cm.chordComponentFromString("5>", false)
    ),
    "Neapolitan chord contains chordComponent \'5>\' with down=false"
));

// extra tests
var D7 = new HarmonicFunction.HarmonicFunction("D", 5, undefined, undefined, undefined, ["7"], [], false, undefined, undefined);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        D7,
        allResultChordsUseComponent,
        cm.chordComponentFromString("7", false)
    ),
    "D7 chord contains chordComponent \'7\' down=false"
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        D7,
        allResultChordsNotUseComponent,
        cm.chordComponentFromString("7>", false)
    ),
    "D7 chord doesn't contain chordComponent \'7>\' down=false"
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        D7,
        allResultChordsNotUseComponent,
        cm.chordComponentFromString("7<", false)
    ),
    "D7 chord doesn't contain chordComponent \'7<\' down=false"
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        D7,
        allResultChordsNotUseComponent,
        cm.chordComponentFromString("7>", true)
    ),
    "D7 chord doesn't contain chordComponent \'7>\' down=true"
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        D7,
        allResultChordsNotUseComponent,
        cm.chordComponentFromString("7<", true)
    ),
    "D7 chord doesn't contain chordComponent \'7<\' down=true"
));


// omit tests
var Tom1 = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], ["1"], false, undefined, undefined);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        Tom1,
        allResultChordsUseNoneOfComponents,
        [cm.chordComponentFromString("1", false),
            cm.chordComponentFromString("1>", false),
            cm.chordComponentFromString("1<", false),
            cm.chordComponentFromString("1", true),
            cm.chordComponentFromString("1>", true),
            cm.chordComponentFromString("1<", true)]
    ),
    "T omit 1 doesn't contain any of chordComponents like \'1\'"
));

var Tom5 = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], ["5"], false, undefined, undefined);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        Tom5,
        allResultChordsUseNoneOfComponents,
        [cm.chordComponentFromString("5", false),
            cm.chordComponentFromString("5>", false),
            cm.chordComponentFromString("5<", false),
            cm.chordComponentFromString("5", true),
            cm.chordComponentFromString("5>", true),
            cm.chordComponentFromString("5<", true)]
    ),
    "T omit 5 doesn't contain any of chordComponents like \'5\'"
));

var SIIom5 = new HarmonicFunction.HarmonicFunction("S", 2, undefined, undefined, undefined, [], ["5"], false, undefined, undefined);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        SIIom5,
        allResultChordsUseNoneOfComponents,
        [cm.chordComponentFromString("5", false),
            cm.chordComponentFromString("5>", false),
            cm.chordComponentFromString("5<", false),
            cm.chordComponentFromString("5", true),
            cm.chordComponentFromString("5>", true),
            cm.chordComponentFromString("5<", true)]
    ),
    "S II omit 5 doesn't contain any of chordComponents like \'5\'"
));

var SIIom5moll = new HarmonicFunction.HarmonicFunction("S", 2, undefined, undefined, undefined, [], ["5>"], false, undefined, Consts.MODE.MINOR);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        SIIom5moll,
        allResultChordsUseNoneOfComponents,
        [cm.chordComponentFromString("5", false),
            cm.chordComponentFromString("5>", false),
            cm.chordComponentFromString("5<", false),
            cm.chordComponentFromString("5", true),
            cm.chordComponentFromString("5>", true),
            cm.chordComponentFromString("5<", true)]
    ),
    "S II omit 5 in mode minor doesn't contain any of chordComponents like \'5>\'"
));

var SIIom5molldown = new HarmonicFunction.HarmonicFunction("S", 2, undefined, undefined, undefined, [], ["5>"], true, undefined, Consts.MODE.MINOR);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        SIIom5moll,
        allResultChordsUseNoneOfComponents,
        [cm.chordComponentFromString("5", false),
            cm.chordComponentFromString("5>", false),
            cm.chordComponentFromString("5<", false),
            cm.chordComponentFromString("5", true),
            cm.chordComponentFromString("5>", true),
            cm.chordComponentFromString("5<", true)]
    ),
    "S II down omit 5 in mode minor doesn't contain any of chordComponents like \'5>\'"
));

var DVII = new HarmonicFunction.HarmonicFunction("D", 7, undefined, undefined, undefined, [], [], false, undefined, undefined);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'major',
        DVII,
        allResultChordsUseComponent,
        cm.chordComponentFromString("5>", false)
    ),
    "D VII contains chordComponents \'5>\'"
));

var DVIIom5 = new HarmonicFunction.HarmonicFunction("D", 7, undefined, undefined, undefined, [], ["5>"], false, undefined, undefined);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'major',
        DVIIom5,
        allResultChordsUseNoneOfComponents,
        [cm.chordComponentFromString("5", false),
            cm.chordComponentFromString("5>", false),
            cm.chordComponentFromString("5<", false),
            cm.chordComponentFromString("5", true),
            cm.chordComponentFromString("5>", true),
            cm.chordComponentFromString("5<", true)]
    ),
    "D VII omit 5 doesn't contain any of chordComponents like \'5>\'"
));

// position tests
var Tpos1 = new HarmonicFunction.HarmonicFunction("T", 1, "1");
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'major',
        Tpos1,
        allResultChordsUseChordComponentInSoprano,
        cm.chordComponentFromString("1", false)
    ),
    "T with position 1 contains 1 in soprano in all generated chords"
));

var Tpos3 = new HarmonicFunction.HarmonicFunction("T", 1, "3");
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'major',
        Tpos3,
        allResultChordsUseChordComponentInSoprano,
        cm.chordComponentFromString("3", false)
    ),
    "T with position 3 contains 3 in soprano in all generated chords"
));

var Tpos7 = new HarmonicFunction.HarmonicFunction("T", 1, "7");
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'major',
        Tpos7,
        allResultChordsUseChordComponentInSoprano,
        cm.chordComponentFromString("7", false)
    ),
    "T with position 7 contains 7 in soprano in all generated chords"
));

// revolution tests
var Trev1 = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1");
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        Trev1,
        allResultChordsUseChordComponentInBass,
        cm.chordComponentFromString("1", false)
    ),
    "T with revolution 1 contains 1 in bass in all generated chords"
));

var Trev3 = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "3");
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        Trev3,
        allResultChordsUseChordComponentInBass,
        cm.chordComponentFromString("3", false)
    ),
    "T with revolution 3 contains 3 in bass in all generated chords"
));

var Trev5 = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "5");
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        Trev5,
        allResultChordsUseChordComponentInBass,
        cm.chordComponentFromString("5", false)
    ),
    "T with revolution 5 contains 5 in bass in all generated chords"
));

var Tmollrev1 = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "1", undefined, [], [], false, undefined, Consts.MODE.MINOR);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        Tmollrev1,
        allResultChordsUseChordComponentInBass,
        cm.chordComponentFromString("1", false)
    ),
    "T moll with revolution 1 contains 1 in bass in all generated chords"
));

var Tmollrev3 = new HarmonicFunction.HarmonicFunction("T", 1, undefined, "3>", undefined, [], [], false, undefined, Consts.MODE.MINOR);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        undefined,
        Tmollrev3,
        allResultChordsUseChordComponentInBass,
        cm.chordComponentFromString("3>", false)
    ),
    "T moll with revolution 3> contains 3> in bass in all generated chords"
));

//todo: testy pitchy: czy akord zawiera przynajmniej jeden pitch z listy np. [48, 60, 72, 84], czyli czy ma dźwięk C
//todo: czy przypadkiem nie istnieją dwa cc w jednym akordzie o tym samym baseComponent ale różnym chordComponentString/pitch
//todo: degree a pitch prymy akordu
//todo: czy głosy się nie krzyżują
//todo: testy systemu
//todo: testy wymuszenia key (to raczej proste i na pewno działa... ale jeden test można pyknąć)

//todo: combo testy - infastruktura i parę przykładzików

//testy generowania D{"position":"3", "extra":["9>"], "omit":["5"]}
var Dspec = new HarmonicFunction.HarmonicFunction("D", 5, "3", undefined, undefined, ["9>"], ["5"], false, undefined, Consts.MODE.MAJOR);
generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'minor',
        Dspec,
        allResultChordsUseChordComponentInSoprano,
        cm.chordComponentFromString("3", false)
    ),
    "D spec with position 3 contains 3 in position in all generated chords"
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'minor',
        Dspec,
        allResultChordsUseComponent,
        cm.chordComponentFromString("1", false)
    ),
    "D spec contains its base chordCompnent \'1\'"
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'minor',
        Dspec,
        allResultChordsUseComponent,
        cm.chordComponentFromString("9>", false)
    ),
    "D spec contains its extra chordCompnent \'9>\'"
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'minor',
        Dspec,
        allResultChordsUseComponent,
        cm.chordComponentFromString("7", false)
    ),
    "D spec contains its chordCompnent \'7\' implied from extra \'9>\' "
));

generatorTestSuite.addTest(new TestUtils.UnitTest(
    () => generatorTest(
        'minor',
        Dspec,
        allResultChordsNotUseComponent,
        cm.chordComponentFromString("5", false)
    ),
    "D spec doesn't contain chordComponent \'5\'"
));


var neapolitanTest = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("S", 2, undefined, "3>", undefined, [], [], true, undefined, Consts.MODE.MINOR);
    var res = gen.generate(hf);
    // res.forEach((x) => {console.log(x.toString())})

    return TestUtils.assertEqualsPrimitives(res.length, 48);
};

generatorTestSuite.addTest(new TestUtils.UnitTest(neapolitanTest, "Neapolitan chord test"));


var positionAndRevolution1 = () => {
    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("S", 4, "1", "1", undefined, [], [], false, undefined, undefined);
    var res = gen.generate(hf);

    var testResult = true;

    if (res.length === 0) testResult = false;

    for (var i = 0; i < res.length; i++) {
        testResult = testResult && TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("1"), res[i].sopranoNote.chordComponent, true);
        testResult = testResult && TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("1"), res[i].bassNote.chordComponent, true);
        testResult = testResult &&
            ((TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("3"), res[i].tenorNote.chordComponent, true) && TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("5"), res[i].altoNote.chordComponent))
                || (TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("5"), res[i].tenorNote.chordComponent, true) && TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("3"), res[i].altoNote.chordComponent)));
    }

    return testResult;
};

generatorTestSuite.addTest(new TestUtils.UnitTest(positionAndRevolution1, "Position and revolution equal 1 chord test"));

var doubleOnly135 = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", undefined, ["7"], ["5"], false, undefined, undefined);
    var res = gen.generate(hf);
    // res.forEach((x) => {console.log(x.toString())})

    var testResult = true;

    if (res.length === 0) testResult = false;

    for (var i = 0; i < res.length; i++) {
        var counter = 0;
        for (var j = 0; j < 4; j++) {
            if (TestUtils.assertEqualsPrimitives(cm.chordComponentFromString("7"), res[i].notes[j].chordComponent, true)) counter++;
        }
        testResult = testResult && TestUtils.assertEqualsPrimitives(1, counter, true);
    }

    return testResult;
};

generatorTestSuite.addTest(new TestUtils.UnitTest(doubleOnly135, "Double only 1, 3 or 5"));

var majorChordInMinorKeyTest = () => {
    var gen = new Generator.ChordGenerator("e");
    var hf = new HarmonicFunction.HarmonicFunction("D", 5, undefined, undefined, undefined, [], [], false, undefined, "major");
    var res = gen.generate(hf);

    return TestUtils.assertNotEqualsPrimitives(0, res.length);
};

generatorTestSuite.addTest(new TestUtils.UnitTest(majorChordInMinorKeyTest, "Major chord in minor key generating test"));

var chordInKeyGivenByHarmonicFunctionInMajor = () => {
    var gen_in_C = new Generator.ChordGenerator("C");
    var gen_in_D = new Generator.ChordGenerator("D");

    var hf_without_key = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], [], false, undefined, "major");
    var hf_with_key = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], [], false, undefined, "major", "C");

    var res1 = gen_in_C.generate(hf_without_key);
    var res2 = gen_in_D.generate(hf_with_key);

    if (!TestUtils.assertEqualsPrimitives(res1.length, res2.length)) return false;

    var testResult = true;
    for (var i = 0; i < res1.length; i++) {
        testResult = testResult && res1[i].equalsNotes(res2[i]);
    }

    return testResult;
};

generatorTestSuite.addTest(new TestUtils.UnitTest(chordInKeyGivenByHarmonicFunctionInMajor, "Generating harmonic function with given major key test"));

var chordInKeyGivenByHarmonicFunctionInMinor = () => {
    var gen_in_f = new Generator.ChordGenerator("f");
    var gen_in_B = new Generator.ChordGenerator("B");

    var hf_without_key = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], [], false, undefined, "minor");
    var hf_with_key = new HarmonicFunction.HarmonicFunction("T", 1, undefined, undefined, undefined, [], [], false, undefined, "minor", "f");

    var res1 = gen_in_f.generate(hf_without_key);
    var res2 = gen_in_B.generate(hf_with_key);

    if (!TestUtils.assertEqualsPrimitives(res1.length, res2.length)) return false;

    var testResult = true;
    for (var i = 0; i < res1.length; i++) {
        testResult = testResult && res1[i].equalsNotes(res2[i]);
    }

    return testResult;
};

generatorTestSuite.addTest(new TestUtils.UnitTest(chordInKeyGivenByHarmonicFunctionInMinor, "Generating harmonic function with given minor key test"));


var extra7Test = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", undefined, ["7"], []);
    var res = gen.generate(hf);

    var scale = new Scale.MajorScale("C");
    var basicNote = scale.tonicPitch + scale.pitches[hf.degree - 1];

    var containsOnlyOne7 = (chord) => {
        var counter = 0;
        for (var i = 0; i < chord.notes.length; i++)
            if ((chord.notes[i].pitch - (basicNote % 12) - 1) % 12 === 9) counter++;
        return counter === 1;
    }

    for (var i = 0; i < res.length; i++)
        if (!containsOnlyOne7(res[i])) return false;

    return true;
}

generatorTestSuite.addTest(new TestUtils.UnitTest(extra7Test, "Generating extra 7 test"));


var extra7doTest = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", undefined, ["7>"], []);
    var res = gen.generate(hf);

    var scale = new Scale.MajorScale("C");
    var basicNote = scale.tonicPitch + scale.pitches[hf.degree - 1];

    var containsOnlyOne7do = (chord) => {
        var counter = 0;
        for (var i = 0; i < chord.notes.length; i++)
            if ((chord.notes[i].pitch - (basicNote % 12) - 1) % 12 === 8) counter++;
        return counter === 1;
    }

    for (var i = 0; i < res.length; i++)
        if (!containsOnlyOne7do(res[i])) return false;

    return true;
}

generatorTestSuite.addTest(new TestUtils.UnitTest(extra7doTest, "Generating extra 7> test"));


var extra7upTest = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "1", undefined, ["<7"], []);
    var res = gen.generate(hf);

    var scale = new Scale.MajorScale("C");
    var basicNote = scale.tonicPitch + scale.pitches[hf.degree - 1];

    var containsOnlyOne7up = (chord) => {
        var counter = 0;
        for (var i = 0; i < chord.notes.length; i++)
            if ((chord.notes[i].pitch - (basicNote % 12) - 1) % 12 === 10) counter++;
        return counter === 1;
    }

    for (var i = 0; i < res.length; i++)
        if (!containsOnlyOne7up(res[i])) return false;

    return true;
}

generatorTestSuite.addTest(new TestUtils.UnitTest(extra7upTest, "Generating extra <7 test"));


var extra7pos7Test = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("D", 5, "7", "1", undefined, ["7"], []);
    var res = gen.generate(hf);

    var scale = new Scale.MajorScale("C");
    var basicNote = scale.tonicPitch + scale.pitches[hf.degree - 1];

    var containsOnlyOne7AndInSoprano = (chord) => {
        var counter = 0;
        var is7inSoprano = (chord.sopranoNote.pitch - (basicNote % 12) - 1) % 12 === 9;
        for (var i = 0; i < chord.notes.length; i++)
            if ((chord.notes[i].pitch - (basicNote % 12) - 1) % 12 === 9) counter++;
        return counter === 1 && is7inSoprano;
    }

    for (var i = 0; i < res.length; i++)
        if (!containsOnlyOne7AndInSoprano(res[i])) return false;

    return true;
}

generatorTestSuite.addTest(new TestUtils.UnitTest(extra7pos7Test, "Generating extra 7 with 7 in soprano test"));


var extra7rev7Test = () => {

    var gen = new Generator.ChordGenerator("C", 'major');
    var hf = new HarmonicFunction.HarmonicFunction("D", 5, undefined, "7", undefined, ["7"], []);
    var res = gen.generate(hf);

    var scale = new Scale.MajorScale("C");
    var basicNote = scale.tonicPitch + scale.pitches[hf.degree - 1];

    var containsOnlyOne7AndInBass = (chord) => {
        var counter = 0;
        var is7inBass = (chord.bassNote.pitch - (basicNote % 12) - 1) % 12 === 9;
        for (var i = 0; i < chord.notes.length; i++)
            if ((chord.notes[i].pitch - (basicNote % 12) - 1) % 12 === 9) counter++;
        return counter === 1 && is7inBass;
    }

    for (var i = 0; i < res.length; i++)
        if (!containsOnlyOne7AndInBass(res[i])) return false;

    return true;
}

generatorTestSuite.addTest(new TestUtils.UnitTest(extra7rev7Test, "Generating extra 7 with 7 in bass test"));

generatorTestSuite.run();
