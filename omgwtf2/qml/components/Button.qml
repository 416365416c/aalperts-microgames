import QtQuick 1.1

Item {
    id: container
    width: Math.max(80, txt.width + 128)
    height: Math.max(42, txt.height + 16)
    signal clicked
    FontLoader { id: fldr; source: "../fonts/Gross Regular.ttf" }
    Rectangle {
        anchors.fill: parent
        radius: 24
        gradient: Gradient {
            GradientStop { position: 0.0; color: "#EEEEEE" }
            GradientStop { position: 1.0; color: "#BBBBBB" }
        }
        border.color: "#DDDDDD"
    }
    property alias text: txt.text
    Text {
        id: txt
        anchors.centerIn: parent
        font.family: fldr.name
        font.pixelSize: 24
    }
    MouseArea {
        anchors.fill: parent
        onClicked: container.clicked()
    }
}
