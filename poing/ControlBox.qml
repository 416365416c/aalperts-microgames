    import QtQuick 2.4

Column {
    id: controlContainer
    property bool onTop: true
    property color color: "white"
    property string controls: "omgwtf"
    spacing: 4
    width: childrenRect.width
    //Height implicit
    Row {
        spacing: 32
        height: childrenRect.height
        //Width implicit
        opacity: onTop ? 1.0 : 0.2
        Repeater {
            model: 3
            Text {
                font.pixelSize: 64
                color: controlContainer.color
                text: controlContainer.controls[index]
            }
        }
    }
    Row {
        spacing: 32
        height: childrenRect.height
        //Width implicit
        opacity: onTop ? 0.2 : 1.0
        Repeater {
            model: 3
            Text {
                font.pixelSize: 64
                color: controlContainer.color
                text: controlContainer.controls[index+3]
            }
        }
    }
}
