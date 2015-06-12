import QtQuick 1.1
import "components"

Rectangle {
    width: 640
    height: 480
    color: "white"
    FontLoader { id: gldr; source: "fonts/Gross Regular.ttf" }
    Timer{
        id: tim
        running: mainUi.source == ""
        interval: 1000
        repeat: true
        property int ticker: 16
        onTriggered: {
            tim.ticker = tim.ticker - 1;
            if (tim.ticker) {
                hurry.text = "Corporate UI will be automatically selected in... " + tim.ticker
            } else {
                mainUi.source = "Corporate.qml"
            }
        }
    }
    Text {
        //Left in top left corner
        font.family: gldr.name
        id: hurry
    }
    Column {
        spacing: 8
        width: parent.width
        anchors.centerIn: parent
        Text {
            font.family: gldr.name
            text: "Please click to select your UI"
            anchors.horizontalCenter: parent.horizontalCenter
        }
        Button {
            text: "Corporate UI"
            onClicked: mainUi.source = "Corporate.qml"
            anchors.horizontalCenter: parent.horizontalCenter
        }
        Button {
            text: "ACCESSIBLE UI FOR LOW EYESIGHT USERS"
            onClicked: mainUi.source = "Accessible.qml"
            anchors.horizontalCenter: parent.horizontalCenter
        }
        Button {
            text: "Blue-Yellow color-blind UI"
            onClicked: mainUi.source = "Color_blind.qml"
            anchors.horizontalCenter: parent.horizontalCenter
        }
    }
    Rectangle {
        color: "black"
        anchors.fill: parent
        visible: mainUi.source != ""
    }
    MouseArea {
        anchors.fill: parent
        onPressed: if (mainUi.source == "") mouse.accepted = false
    }
    Loader {
        anchors.fill: parent
        id: mainUi
    }
}
