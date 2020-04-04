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

        var chords = generator.generateChords("T", 5);
                                         
        for(var i=0; i<chords.length;i++){
            console.log(chords[i]);
        }
        
        generator.addChords(chords);        

        Qt.quit()
    }
      

}
