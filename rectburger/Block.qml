import QtQuick 2.0

Rectangle {
    property bool starter: false
    property bool falling: false
    property real offset: 0
    width: 100
    height: 22
    color: falling? "green" : (starter? "blue" : "red")
}
