import QtQuick 2.0
import MuseScore 3.0

MuseScore {
    menuPath: "Plugins.pluginName"
    description: "Description goes here"
    version: "1.0"

    function applyToNotesInSelection(func) {
            var cursor = curScore.newCursor();
            cursor.rewind(0);

            for (var staff = 0; staff < curScore.nstaves; staff++) {
                  cursor.track = staff * 4; 
                  for (var voice = 0; voice < 4; voice++) {
                        cursor.rewind(0); // sets voice to 0
                        cursor.voice = voice; //voice has to be set after goTo
                        cursor.staffIdx = staff;

                        while (cursor.element) {
                              if (cursor.element.type === Element.CHORD) {
                                    console.log("Adding note");
                                    func(cursor);
                                    cursor.prev();
                              }
                              cursor.next();
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
