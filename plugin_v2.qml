import QtQuick 2.0
import MuseScore 3.0

MuseScore {
      menuPath: "Plugins.exampl"
      description: "Description goes here"
      version: "1.0"
      function selectSoprano(cursor){
            cursor.track = 0;
      }
      function selectAlto(cursor){
            cursor.track = 1;
      }
      function selectTenor(cursor){
            cursor.track = 4;
      }
      function selectBass(cursor){
            cursor.track = 5;
      }
      
      function addRandomNote(cursor){
        var cdur = [ 0, 2, 4, 5, 7, 9, 11 ];
        var pitch  = cdur[Math.floor(Math.random() * 6)] + 60;
        cursor.addNote(pitch);
        cursor.prev();
      }
      
      function addOtherVoices(cursor){
            selectAlto(cursor)
            addRandomNote(cursor)
            selectTenor(cursor)
            addRandomNote(cursor)
            selectBass(cursor)
            addRandomNote(cursor)
            selectSoprano(cursor)
            cursor.next()
      }
      
      onRun: {
            var score = curScore
            var cursor = score.newCursor()
            cursor.rewind(0)
            while(cursor.element){
                  if(cursor.element.type === Element.CHORD){
                        console.log(cursor.element.notes[0].pitch)
                        addOtherVoices(cursor);
                  } else{
                        cursor.next();
                  }
            }
            Qt.quit()
      }
}
