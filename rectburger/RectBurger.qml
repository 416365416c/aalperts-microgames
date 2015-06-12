import QtQuick 2.0
import "rectburger.js" as Game

Rectangle {
    width: 360
    height: 600
    color: "black"
    id: root
    property bool movingLeft: false
    property bool movingRight: false
    Timer{
        running: true
        repeat: true
        interval: 16
        onTriggered: Game.tick(root);
    }
    focus: true
    Keys.onPressed: {
        if(event.key == Qt.Key_Left){
            movingLeft = true;
            event.accepted = true;
        }
        if(event.key == Qt.Key_Right){
            movingRight = true;
            event.accepted = true;
        }
    }
    Keys.onReleased: {
        if(event.key == Qt.Key_Left){
            movingLeft = false;
            event.accepted = true;
        }
        if(event.key == Qt.Key_Right){
            movingRight = false;
            event.accepted = true;
        }
    }
}
