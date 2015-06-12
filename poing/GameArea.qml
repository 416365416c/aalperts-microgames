import QtQuick 2.4
import "GameLogic.js" as GameLogic

Rectangle {
    id: gameRoot
    color: "black"
    border.width: 4
    border.color: boxColor
    //Game variables
    property real paddleWidth: 20
    property real paddleHeight: 160
    property real ballSize: paddleWidth
    property color p1Color: "green"
    property color p2Color: "red"
    property color ballColor: "blue"
    property color boxColor: "cyan"
    //Game State
    property real ballX: paddleWidth
    property real ballY: 0
    property real p1Y: 0
    property real p2Y: 0
    property bool vsWall: false
    property int p1Score: 0
    property int p2Score: 0
    property bool p1Top: true //Whether they're on their top controls or not
    property bool p2Top: true
    property bool paused: false
    property bool gameOver: false

    function start(vsWall_in) {
        vsWall = vsWall_in
        gameRoot.forceActiveFocus(Qt.OtherFocusReason);
        GameLogic.init(gameRoot);
        started();
        gameTick.start();
    }
    function end() {
        gameOver = true;
        gameTick.stop();
        hideTimer.start();
    }
    Timer {
        id: hideTimer
        interval: 1000
    }

    signal started
    signal finished

    Keys.onPressed: {
        if (gameOver && !hideTimer.running) {
            finished();
        } else {
            GameLogic.handleKeyPressed(event.key)
        }
    }
    Keys.onReleased: GameLogic.handleKeyReleased(event.key)

    Timer {
        id: gameTick
        interval: 10
        repeat: true
        running: false
        onTriggered: GameLogic.tick();
    }
    Text {
        id: pauseText
        text: "GAME PAUSED"
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        font.pixelSize: 64
        color: boxColor
        anchors.fill: parent
        visible: paused
    }
    Text {
        id: goText
        text: "GAME OVER\nPress any key to continue..."
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        font.pixelSize: 64
        color: boxColor
        visible: gameOver
        anchors.fill: parent
    }

    Text {
        id: p1ScoreText
        text: p1Score
        font.pixelSize: 64
        color: p1Color
        y: 12
        x: 100
        anchors.left: parent.left
        anchors.leftMargin: 100
        anchors.top: parent.top
        anchors.topMargin: 16
    }

    Text {
        id: p2ScoreText
        text: vsWall ? "WALL" : p2Score
        font.pixelSize: 64
        color: p2Color
        y: 12
        x: 100
        anchors.right: parent.right
        anchors.rightMargin: 100
        anchors.top: parent.top
        anchors.topMargin: 16
    }

    ControlBox {
        id: p1ControlBox
        onTop: p1Top
        color: p1Color
        controls: "QWEASD"
        anchors.left: parent.left
        anchors.leftMargin: 100
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 16
    }
    ControlBox {
        id: p2ControlBox
        visible: !vsWall
        onTop: p2Top
        color: p2Color
        controls: "UIOJKL"
        anchors.right: parent.right
        anchors.rightMargin: 100
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 16
    }

    Rectangle {
        id: divider
        width: 4
        height: parent.height
        anchors.centerIn: parent
    }

    Rectangle {
        id: p1Paddle
        width: paddleWidth
        height: paddleHeight
        y: p1Y //Changes a lot
        x: 0
        color: p1Color
    }
    Rectangle {
        id: p2Paddle
        width: paddleWidth
        height: vsWall ? parent.height : paddleHeight
        y: vsWall ? 0 : p2Y //Changes a lot
        x: parent.width - paddleWidth
        color: p2Color
    }
    Rectangle {
        id: ball
        width: ballSize
        height: ballSize
        x: ballX
        y: ballY
        color: ballColor
    }
}
