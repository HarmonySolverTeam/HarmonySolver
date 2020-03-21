import QtQuick 2.0
import MuseScore 3.0

MuseScore {
    menuPath: "Plugins.pluginName"
    description: "Description goes here"
    version: "1.0"

    function applyToNotesInSelection(func) {
            var cursor = curScore.newCursor();
            console.log("PADU");
            cursor.rewind(0);

            //iterate over all staves
            for (var staff = 0; staff < curScore.nstaves; staff++) {
                  cursor.track = staff * 4; 
                  console.log("First loop");
                  for (var voice = 0; voice < 4; voice++) {
                        cursor.rewind(0); // sets voice to 0
                        cursor.voice = voice; //voice has to be set after goTo
                        cursor.staffIdx = staff;

                        var flag = true;
                        while (flag) {
                              if (cursor.element && cursor.element.type === Element.CHORD) {
                                    func(cursor);
                                    console.log("Adding note");
                                    flag = cursor.next();
                                    cursor.prev();
                                    continue;
                              }
                              flag = cursor.next();
                        }
                  }
            }
      }

    function addRandomNote(cursor){
        var cdur = [ 0, 2, 4, 5, 7, 9, 11 ];
        var pitch  = cdur[Math.floor(Math.random() * 6)] + 60;
        cursor.addNote(pitch, true);
    }

    onRun: {

        if (typeof curScore === 'undefined')
                  Qt.quit();

        applyToNotesInSelection(addRandomNote);

        Qt.quit()
    }
}
