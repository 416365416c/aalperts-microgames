import QtQuick.Window 2.1
import QtQuick 2.4

Window {
    id: window
    visible: true
    width: 1024
    height: 768
    Rectangle {
        id: mainMenu
        objectName: "mainMenu"
        anchors.fill: parent
        focus: true
        Keys.onReleased: {
            if (event.key == Qt.Key_1)
                gameArea.start(true);
            else if (event.key == Qt.Key_2)
                gameArea.start(false);
            else if (event.key == Qt.Key_Question || event.key == Qt.Key_Help)
                helpArea.visible = true;
            else if (event.key == Qt.Key_Escape)
                Qt.quit()
        }
        color: "midnightblue"
        Column {
            id: menuContent
            anchors.centerIn: parent
            spacing: 28
            width: childrenRect.width
            Behavior on opacity { NumberAnimation {}}
            opacity: visible ? 1 : 0 //Note that this will only fade IN
            visible: false
            Component.onCompleted: menuContent.visible = true //force fade in
            Text {
                text: "1P"
                font.pixelSize: 128
                color: "lightsteelblue"
                MouseArea {
                    anchors.fill: parent
                    onClicked: gameArea.start(true);
                }
            }
            Text {
                text: "2P"
                font.pixelSize: 128
                color: "palegoldenrod"
                MouseArea {
                    anchors.fill: parent
                    onClicked: gameArea.start(false);
                }
            }
            Text {
                text: "Help"
                font.pixelSize: 128
                color: "wheat"
                MouseArea {
                    anchors.fill: parent
                    onClicked: helpArea.visible = true;
                }
            }
            Text {
                text: "Quit"
                font.pixelSize: 128
                color: "lightsalmon"
                MouseArea {
                    anchors.fill: parent
                    onClicked: Qt.quit();
                }
            }
        }

        Rectangle {
            id: helpArea
            property int helpMargin: 32
            anchors.fill: parent
            anchors.margins: helpMargin
            color: "white"
            border.width: 8
            visible: false
            MouseArea {
                anchors.fill: parent
                anchors.margins: -helpArea.helpMargin
                onClicked: helpArea.visible = false
            }
            Text {
                anchors.fill: parent
                anchors.margins: helpArea.helpMargin
                wrapMode: Text.WordWrap
                text: mainMenu.helpString
            }
        }

        GameArea {
            id: gameArea
            width: 1024
            height: 768
            visible: false
            focus: true
            anchors.centerIn: parent //If window resizes, don't mess with our size
            onStarted: {
                gameArea.visible = true;
                menuContent.visible = false;
            }
            onFinished: {
                gameArea.visible = false;
                menuContent.visible = true;
            }
        }


        //Sticking this right at the end of the file
        property string helpString: "POING\n\nPoing is a simplified ping-pong based game. It's a variant where you must play with \"two hands\". It also has a two player mode, which really requires two hands (second person controlling second hand at your discretion). Each set of controls allows you to move the paddle up or down, and each player has two sets of controls. Every time you hit the ball, the active set of controls switches over. Additionally you have a third key (in each set) which will trigger an additional switch along with a decaying speed boost. Switching multiple times increases the speed boost, but hitting the switch control for the inactive control set will cancel any current boost. Instead of spin from paddle friction, your boost is added to the ball when you hit it in order to increase ball speed.\n\nThe ball will speed up over time, to increase the challenge of the game. The ball's speed is capped, so that you can always get from one end of the playing area to the other faster than the ball. If you have the maximum speed boost active. The game goes to 11 points, winner of the previous point returns first, and each point resets the ball's speed.\n\nYou can also play against the wall, for this your score is the number of returns you make without losing a single point. Due to the ball speedup, the wall is expected to win before you get bored and give up.\n\nControls are shown along the bottom of your player area, with the active control set lit up. Controls are listed in the order \"Up Switch Down\""
    }
}
