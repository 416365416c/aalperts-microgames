import QtQuick 1.1
Text {
    FontLoader { id: fldr; source: "../fonts/tcsystem.ttf" }
    color: "green"
    font.family: fldr.name
    font.pixelSize: 18
    font.bold: true
}
