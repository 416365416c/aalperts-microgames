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
Item {//Assumes parent is GameCanvas
    id: container
    property int missiles: 10
    property int perMissileScore: 10
    function row(idx) {
        switch(idx){
            case 0: return 1;
            case 1: return 2;
            case 2: return 2;
            case 3: return 3;
            case 4: return 3;
            case 5: return 3;
            default: return 4;
        }
    }
    function column(idx) {
        switch(idx){
            case 0: return 0;
            case 1: return -0.5;
            case 2: return 0.5;
            case 3: return -1;
            case 4: return 0;
            case 5: return 1;
            default: return -1.5 + (idx - 6);
        }
    }
    Repeater {
        model: missiles
        delegate: Image {
            source: "missile.png"
            x: column(index) * 8
            y: row(index) * 12
            Connections{
                target: container.parent
                onBetweenWavesChanged: {
                    if(container.parent.betweenWaves && !container.parent.gameOver){
                        container.parent.score += perMissileScore;
                        scoreAnim.start();
                    }
                }
            }
            Text {
                id: scoreText
                text: perMissileScore
                color: "white"
                opacity: 0
                ParallelAnimation{
                    id: scoreAnim
                    running: false
                    NumberAnimation{target: scoreText; property: "y"; from: 0; to: -100; duration: 1000}
                    SequentialAnimation{
                        NumberAnimation{target: scoreText; property: "opacity"; from: 0; to: 1; duration: 500; easing.type: Easing.OutQuad}
                        NumberAnimation{target: scoreText; property: "opacity"; from: 1; to: 0; duration: 500; easing.type: Easing.InQuad}
                    }
                }
            }
        }
    }
}
