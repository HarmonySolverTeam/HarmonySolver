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
      
      function min(a,b){
            return a<=b?a:b
      }
      
      function max(a,b){
            return a>b?a:b
      }
      
      function addRandomAlto(cursor){
            const altoMin = 53
            const altoMax = 74
      
            selectSoprano(cursor)
            var sopranoPitch = cursor.element.notes[0].pitch
            cursor.next()
            var nextSopranoPitch = 1000
            if(cursor.element.type === Element.CHORD){
                  nextSopranoPitch = cursor.element.notes[0].pitch
            }
            cursor.prev()
            var lowestSopranoPitch = min(sopranoPitch, nextSopranoPitch)
            var altoMaxPitch = min(lowestSopranoPitch, altoMax)
            var altoMinPitch = max(altoMin,sopranoPitch-12)
            var pitch  = Math.floor(Math.random() * (altoMaxPitch-altoMinPitch+1)) + altoMin;
            selectAlto(cursor)
            cursor.addNote(pitch)
            cursor.prev()
      }
      
      function addRandomTenor(cursor){
            const tenorMin = 48
            const tenorMax = 69
      
            selectAlto(cursor)
            var altoPitch = cursor.element.notes[0].pitch
            var tenorMaxPitch = min(altoPitch, tenorMax)
            var tenorMinPitch = max(tenorMin,altoPitch-12)
            var pitch  = Math.floor(Math.random() * (tenorMaxPitch-tenorMinPitch+1)) + tenorMin;
            selectTenor(cursor)
            cursor.addNote(pitch)
            cursor.prev()
      }
      
      function addRandomBass(cursor){
            const bassMin = 41
            const bassMax = 62
      
            selectTenor(cursor)
            var tenorPitch = cursor.element.notes[0].pitch
            var bassMaxPitch = min(tenorPitch, bassMax)
            var bassMinPitch = max(bassMin,tenorPitch-12)
            var pitch  = Math.floor(Math.random() * (bassMaxPitch-bassMinPitch+1)) + bassMin;
            selectBass(cursor)
            cursor.addNote(pitch)
            cursor.prev()
      }
      function addOtherVoices(cursor){
            //selectAlto(cursor)
            addRandomAlto(cursor)
            //selectTenor(cursor)
            addRandomTenor(cursor)
            //selectBass(cursor)
            addRandomBass(cursor)
            selectSoprano(cursor)
            cursor.next()
      }
      
      onRun: {
            var score = curScore
            var cursor = score.newCursor()
            cursor.rewind(0)
            while(cursor.element){
                  if(cursor.element.type === Element.CHORD){
                        addOtherVoices(cursor);
                  } else{
                        cursor.next();
                  }
            }
            Qt.quit()
      }
}
