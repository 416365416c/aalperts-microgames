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
import "particles"
import "missilemaster.js" as GameLogic
Item{//This item is the interface for all game logic as well
    id: container
    property alias score: gameContainer.score
    property alias wave: gameContainer.wave
    property alias betweenWaves: gameContainer.betweenWaves
    property alias gameOver: gameContainer.gameOver
    width: 100
    height: 62
    Component.onCompleted: GameLogic.init(gameContainer, 300)
    Timer{
        id: gameTick
        interval: 16
        running: true
        repeat: true
        onTriggered: canvas.requestPaint();
    }

    function fire(x,y){
        GameLogic.launchMissile(x,y,undefined);
    }
    function startWave(){
        GameLogic.startWave(wave++);
    }

    Canvas {
        id: canvas
        height: 360
        width: 600
        z: 1
        //anchors.fill: parent //BUG?
        Item {
            id: gameContainer
            property int score: 0
            property int wave: 0
            property bool betweenWaves: true
            property bool gameOver: false
            property bool fancyGraphics: true
            visible: fancyGraphics
            focus: true
            Keys.onSpacePressed: fancyGraphics = !fancyGraphics
            Image {
                anchors.fill: parent
                source: "grey_ground.jpg"
            }
            Text {
                visible: betweenWaves && !gameOver
                anchors.centerIn: parent
                text: "STAGE COMPLETED"
                color: "goldenrod"
            }
            Text {
                visible: gameOver
                anchors.centerIn: parent
                text: "GAME OVER"
                color: "goldenrod"
            }
            property ParticleSystem psys: particleSystem
            MissileParticleSystem { //Emitters on the objects, painters in this item
                id: particleSystem
                running: !gameContainer.gameOver //Will having it off for plain ruin or improve the instant on experience?
                z: 1//On top
            }
            anchors.fill: parent
        }

        onPaint: {//1 tick per frame
            //console.log("Alpha");
            var ctx = canvas.getContext("2d");
            ctx.strokeStyle = "lightsteelblue";
            ctx.fillStyle = "goldenrod";
            //GameLogic.debugOutput();
            GameLogic.advance(canvas, ctx);
        }
    }
    MouseArea { //TODO: Drag-release to fire from a specific silo? Or multi-touch?
        anchors.fill: parent
        onClicked: {
            if(gameOver){
                score = 0;
                wave = 0;
                gameOver = false;
                startWave();
            }else if(betweenWaves)
                startWave();
            else
                gameCanvas.fire(mouse.x, mouse.y);
        }
    }
}
