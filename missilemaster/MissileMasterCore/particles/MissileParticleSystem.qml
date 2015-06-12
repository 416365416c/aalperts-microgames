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
import QtQuick.Particles 2.0

ParticleSystem {
    ImageParticle {
        groups: "missile"
        source: "particle.png"
        color: "#FF3333"
        alpha: 0.4
    }
    ImageParticle {
        groups: "missileTrail"
        source: "particle4.png"
        color: "#060404"
        alpha: 0
        entryEffect: ImageParticle.Scale;
    }
    ImageParticle {
        groups: "antimissile"
        source: "particle.png"
        color: "#33FF33"
        alpha: 0.4
    }
    ImageParticle {
        groups: "antimissileTrail"
        source: "particle4.png"
        color: "#030503"
        alpha: 0
        entryEffect: ImageParticle.Scale;
    }
    ImageParticle {
        groups: "shields"
        source: "particleA.png"
        color: "#202040"
        alpha: 0
        blueVariation: (2.0/16.0)
    }
    ImageParticle {
        groups: "explosion"
        source: "particle.png"
        color: "#804000"
        alpha: 0
        colorVariation: 0.2
    }
    ImageParticle {
        groups: "antiexplosion"
        source: "particle.png"
        color: "#806000"
        alpha: 0
        colorVariation: 0.2
    }
}
