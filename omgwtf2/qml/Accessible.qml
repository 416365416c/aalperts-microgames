import QtQuick 1.1
import "../js/logic.js" as Logic
import "components"

Rectangle {
    id: page
    width: 640
    height: 480
    color: "white"
    Column {
        spacing: 8
        EasyText { id: t; text: "Would you like a decision?" }
        EasyText { text: "There is a text input box below" }
        EasyText { text: "It has focus, you may begin typing" }
        Item {
            height: t.height
            TextInput {
                id: inp
                focus: true
                Component.onCompleted: inp.forceActiveFocus()
                font.pixelSize: 24
                font.bold: true
                font.capitalization: Font.AllUppercase
                color: "black"
                font.family: "sans serif"
                onAccepted: Logic.process(inp.text, out);
            }
            width: 10
        }
        EasyText {
            id: out
            width: page.width
            wrapMode: Text.WordWrap
            onTextChanged: if(out.text.indexOf("\n") != -1) out.text = out.text.replace("\n", " "); //Workaround for inexplicable bug...
        }
    }
}
