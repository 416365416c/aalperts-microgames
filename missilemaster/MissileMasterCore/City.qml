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
import QtQuick.Particles 2.0

Image {//Assumes parent is GameCanvas
    id: container
    source: "city.png"
    property bool alive: true
    opacity: alive ? 1.0 : 0.1
    property int perCityScore: 100
    Connections{
        target: parent
        onBetweenWavesChanged: {
            if(parent.betweenWaves && !parent.gameOver){
                if(alive){
                    parent.score += perCityScore;
                    scoreAnim.start();
                }
            }
        }
    }
    Text {
        id: scoreText
        text: perCityScore
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
    Emitter { //Flickering shield effect
        enabled: container.alive
        system: container.parent.psys
        group: "shields"
        anchors.centerIn: parent
        size: 64
        lifeSpan: 1200
        lifeSpanVariation: 800
        emitRate: 4
    }
}
