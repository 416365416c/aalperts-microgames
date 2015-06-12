/****************************************************************************
**
** Copyright (C) 2012 Research In Motion.
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

Item {
    id: container
    property real x0: 0
    property real y0: 0
    property real x1: 0
    property real y1: 0
    property bool anti: false
    Image {
        source: anti ? "greenBlip.png" : "redBlip.png" //Just one "particle" following the image
        width: 16
        height: 16
        anchors.centerIn: parent
    }
    /*
    Emitter {
        system: container.parent.psys
        group: container.anti ? "antimissile" : "missile"
        lifeSpan: container.anti ? 128 : 256
        emitRate: container.anti ? 16 : 8
        size: 8
        //velocity: TargetDirection { targetX: x1; targetY: y1; magnitude: container.anti ? 40:4; magnitudeVariation: 8; proportionalMagnitude: false }
    }
    */
    Emitter {
        enabled: true
        system: container.parent.psys
        x: -8
        y: -8
        group: container.anti ? "antimissileTrail" : "missileTrail"
        lifeSpan: 6000
        lifeSpanVariation: 1000
        emitRate: container.anti ? 48 : 4
        size: 32
        endSize: 16
        width: 16
        height: 16
        //velocity: PointDirection { y: 16; yVariation: 4 }
    }
}
