import QtQuick 1.1
import "../js/logic.js" as Logic
import "components"

Rectangle {
    //This is the one that looks like an old school terminal
    width: 640
    height: 480
    color: "black"

    Column {
        spacing: 8
        anchors.fill: parent
        anchors.margins: 24
        TerminalText {
            id: t
            text: "# descn-mkr\nWould you like a random outcome generated?"
        }
        Item {
            height: t2.height
            width: childrenRect.width
            TerminalText { 
                id: t2
                text: "#"
            }
            TextInput {
                id: inp
                x: t2.width + 12
                Component.onCompleted: inp.forceActiveFocus();
                focus: true
                onAccepted: Logic.process(inp.text, out);
                cursorDelegate: Rectangle {
                    id: cdel
                    color: "green"
                    width: 12 //???
                    SequentialAnimation {
                        loops: -1
                        running: true
                        PauseAnimation {}
                        ScriptAction { script: {cdel.opacity = cdel.opacity == 1 ? 0 : 1} } 
                    }
                }

                FontLoader { id: fldr; source: "fonts/tcsystem.ttf" }
                color: "green"
                font.family: fldr.name
                font.pixelSize: 18
                font.bold: true
            }
        }
        TerminalText {
            id: out
        }
    }
}
