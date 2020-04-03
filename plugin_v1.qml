import QtQuick 2.0
import MuseScore 3.0
import "obj" 

MuseScore {
    menuPath: "Plugins.pluginName"
    description: "Description goes here"
    version: "1.0"
    
    ChordGenerator{id:generator;}
        
    onRun: {

        if (typeof curScore === 'undefined')
                  Qt.quit();

         
        var chords = generator.generateChords("S");
        generator.addChords(chords);        
        
        Qt.quit()
    }
      

}
