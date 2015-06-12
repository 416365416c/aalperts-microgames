/****************************************************************************
**
** Copyright (C) 2012 Nokia Corporation and/or its subsidiary(-ies).
** All rights reserved.
**
** MissileMaster is a stand-alone QML example.
**
** GNU General Public License Usage
** This file may be used under the terms of the GNU General
** Public License version 2.0 as published by the Free Software Foundation.
** Please review the following information to ensure the GNU General
** Public License version 2.0 requirements will be met:
** http://www.gnu.org/copyleft/gpl.html.
** 
****************************************************************************/
import QtQuick 2.0
import "MissileMasterCore"

Rectangle {
    height: 360
    width: 600
    color: "black"
    GameCanvas{
        id: gameCanvas
        anchors.fill:  parent
        property int highScore: 0
        onScoreChanged: if(score > highScore) highScore = score;
        Text {
            text: gameCanvas.score
            anchors.right: parent.right
            color: "white"
        }
        Text {
            text: gameCanvas.highScore
            anchors.left: parent.left
            color: "white"
        }
    }
    Rectangle {
        id: splashScreen
        anchors.fill: parent
        color: "black"
        MouseArea {
            anchors.fill: parent
            onClicked: splashScreen.destroy();
        }
        Text {
            color: "goldenrod"
            font.pixelSize: 78
            text: "MISSILE\nMASTER"
            horizontalAlignment: Text.AlignHorizontalCenter
            anchors.centerIn: parent
        }
    }
}
