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
    property real t: 0
    property bool anti: false
    /*
    Rectangle {
        anchors.centerIn: parent
        width: t
        height: t
        color: "blue"
    }
    */
    Emitter {
        shape: EllipseShape{}
        system: container.parent.psys
        anchors.centerIn: parent
        width: t
        height: t
        group: anti ? "antiexplosion" : "explosion"
        lifeSpan: anti ? 240 : 480
        emitRate: 200
        size: 32
        endSize: anti?16:32
        velocity: TargetDirection { targetX: t/2; targetY: t/2; targetVariation: t/4; magnitude: -40; magnitudeVariation: 8; }
    }
}
