import QtQuick 2.0
import QtQuick.Dialogs 1.0
import QtQuick.Controls 1.0

Item {
    Rectangle {
        id: tabRectangle2

        Button {
            id: buttonRunFiguredBass
            x: 253
            y: 409
            text: qsTr("Solve")
            anchors.bottom: tabRectangle2.bottom
            anchors.topMargin: 10
            anchors.bottomMargin: 10
            anchors.leftMargin: 40
            onClicked: {
            }
        }
    }

    Text {
        id: element
        x: 52
        y: 35
        width: 540
        height: 46
        text: qsTr("Here you can solve figured bass exercises. \nRemember, that current opened score should contain figured bass exercise")
        font.pixelSize: 16
    }

    Text {
        id: element1
        x: 52
        y: 151
        text: qsTr("Info")
        font.pixelSize: 20
    }

    TextArea {
        id: textArea
        x: 52
        y: 172
        width: 551
        height: 199
        text: qsTr("")
        activeFocusOnPress: false
        readOnly: true
        font.pixelSize: 12
    }
}

/*##^##
Designer {
    D{i:0;autoSize:true;height:480;width:640}
}
##^##*/
