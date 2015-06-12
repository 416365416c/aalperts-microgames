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
.pragma library

//Data Structure Class from Breakout
var global = (function(){return this;}).call();
function List(a) {
    if(a == undefined)
        a = 255;

    if(this == global)
        return new List(a);
    this.ds = new Array(a);
    this.size = 0;
}

List.prototype.append = function(i) {
    this.ds[this.size] = i;
    this.size += 1;
}

//Alters the order of the list
List.prototype.remove = function(i) {
    this.ds[i] = this.ds[this.size-1];
    this.size -= 1;
}

List.prototype.set = function(i,val) {
    this.ds[i] = val;
}

List.prototype.at = function(i) {
    return this.ds[i];
}

List.prototype.contains = function(i) {
    for(var j = 0; j < this.size; j++){
        if(this.ds[j] == i)
            return true;
    }
    return false;
}

List.prototype.destroy = function(i) {
    this.ds[i].destroy();
    this.remove(i);
}

List.prototype.clearItems = function() {
    for(var j = 0; j < this.size; j++)
        if(this.ds[j] != null)
            this.ds[j].destroy();
    this.size = 0;
}

List.prototype.toString = function() {
    var ret = "";
    for(var j in this.ds){
        if(j!=0)
            ret += ',';
        ret += this.ds[j].toString();
    }
    return ret;
}

var siloComponent;
var cityComponent;
var missileComponent;
var explosionComponent;
var missiles = new List();
var explosions = new List();
var silos = new Array(3)
var cities = new Array(6)
var tickTicker = 0;
var waveTicks = 600;
var waveSize = 10;
var stageTicker = 0;
var stageTicks = 0;
var stageNo = 0;
var missileVelocity = 0.40;//Per Tick
var antimissileVelocity = 4.80;//Per Tick
var explosionVelocity = 0.24;//Per Tick
var antiexplosionVelocity = 0.40;//Per Tick
var explosionMax = 48;
var antiexplosionMax = 24;
var yLine = 100;
var INF = 1000000;
var inited = false;
var gameObj = null;
function launchMissile(x1,y1,silo) {
    if(silo == undefined){
        silo = -1;
        var bestDiff = INF;
        for(var i=0; i<silos.length; i++){
            if(silos[i].missiles && Math.abs(silos[i].x - x1) < bestDiff){
                silo = i;
                bestDiff = Math.abs(silos[i].x - x1);
            }
        }
    }
    if(silo == -1 || !silos[silo].missiles)
        return;
    silos[silo].missiles -= 1;
    addMissile(silos[silo].x, silos[silo].y, x1, y1,true);
}

function addMissile(x0,y0,x1,y1,anti) {
    missiles.append( missileComponent.createObject(gameObj, {"x0":x0, "y0":y0,"x":x0,"y":y0,"x1":x1,"y1":y1, "anti":anti}));
}

function addExplosion(x,y,anti) {
    explosions.append( explosionComponent.createObject(gameObj, {"x":x, "y":y, "t":0, "anti":anti}));
}

function magnitude(x1,x2,y1,y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//NOTE: Gameplay interpretation is that missiles/objects will PASS THROUGH each other in absence of explosion (for '3d' reasons).
function moveMissile(missile){//mutates object, returns whether it's done or not
    var theta = Math.atan2(missile.y0 - missile.y1, missile.x0 - missile.x1);
    var vel = missile.anti == true ? antimissileVelocity : missileVelocity;
    missile.x -= vel * Math.cos(theta);
    missile.y -= vel * Math.sin(theta);
    if(magnitude(missile.x0,missile.x,missile.y0,missile.y) >= magnitude(missile.x0,missile.x1,missile.y0,missile.y1)){//Target reached
        missile.x = missile.x1;
        missile.y = missile.y1;
        return true;
    }
    return false;
}

function setFancy(arg)
{
    gameObj.fancyGraphics = arg;   
}

function init(canvas, yLineArg)
{
    gameObj = canvas;
    yLine = yLineArg;
    siloComponent = Qt.createComponent("Silo.qml");
    console.log("Silo Errors: " + siloComponent.errorString());
    cityComponent = Qt.createComponent("City.qml");
    console.log("City Errors: " + cityComponent.errorString());
    missileComponent = Qt.createComponent("Missile.qml");
    console.log("Missile Errors: " + missileComponent.errorString());
    explosionComponent = Qt.createComponent("Explosion.qml");
    console.log("Explosion Errors: " + explosionComponent.errorString());
    for(var i=0; i<3; i++)
        cities[i] = cityComponent.createObject(canvas, {"x" : i*72 + 48, "y" : yLine, "alive" : false});
    for(var i=3; i<6; i++)
        cities[i] = cityComponent.createObject(canvas, {"x" : i*72 + 128, "y" : yLine, "alive" : false});
    for(var i=0; i<3; i++)
        silos[i] = siloComponent.createObject(canvas, {"x" : i*272 + 20, "y" : yLine - 20, "missiles" : 10});
    inited = true;
    setFancy(gameObj.fancyGraphics);//In case it does more setup later
}

function startWave(stageNum)//Game logic calls them stages, made of a couple waves
{
    gameObj.betweenWaves = false;
    stageNo = stageNum;
    tickTicker = 0;
    var multiplier = (1 + stageNo*0.1);
    stageTicks = 1000 * multiplier;
    waveSize = 10 * multiplier - 4;//-8 is easy difficulty?
    missileVelocity = 0.40 * multiplier;
    stageTicker = stageTicks;
    missiles.clearItems();
    explosions.clearItems();
    if(stageNum == 0)
        for(var i=0; i<6; i++)
            cities[i].alive = true;
    for(var i=0; i<3; i++)
        silos[i].missiles = 10;
}

function explosionHitCity(explosion, city){
    return magnitude(city.x, explosion.x, city.y, explosion.y) <= explosion.t ||
            magnitude(city.x + city.width/2, explosion.x, city.y, explosion.y) <= explosion.t ||
            magnitude(city.x + city.width, explosion.x, city.y, explosion.y) <= explosion.t;
}

function explosionHit(explosion, missile){
    return magnitude(missile.x, explosion.x, missile.y, explosion.y) <= explosion.t;
}

function advance(canvas, ctx) {
    //Simulate and render a game tick
    if(!inited)
        return;

    //Check if stage over
    if(stageTicker)
        stageTicker--;
    if(!stageTicker && (missiles.size)<=0 && (explosions.size)<=0)
        gameObj.betweenWaves = true;

    //Every k ticks, new wave
    tickTicker -= 1;
    if(stageTicker && tickTicker <= 0){
        for(var acc = 0; acc<waveSize; acc++){
            var x0 = Math.floor(Math.random() * canvas.width);
            var x1 = Math.floor(Math.random() * canvas.width);
            var y0 = 0; var y1 = yLine;
            addMissile(x0, y0, x1, y1, false);
        }
    }
    if(tickTicker <= 0)
        tickTicker = waveTicks;

    //Advance Missiles
    for(var i = 0; i<missiles.size; i++){
        if(moveMissile(missiles.at(i))){
            addExplosion(missiles.at(i).x1, missiles.at(i).y1, missiles.at(i).anti);//It wants to explode
            missiles.destroy(i);
            i--;
        }
    }

    //Advance Explosions
    for(var j = 0; j<explosions.size; j++){
        var explosion = explosions.at(j);
        explosion.t += (explosion.anti == true ? antiexplosionVelocity : explosionVelocity);
        if(explosion.t >= (explosion.anti == true ? antiexplosionMax : explosionMax)){
            explosions.destroy(j);
            j--;
        }else{
            for(var i = 0; i<missiles.size; i++){
                if(explosionHit(explosions.at(j), missiles.at(i))){
                    addExplosion(missiles.at(i).x, missiles.at(i).y, missiles.at(i).anti);//It is forced to explode
                    missiles.destroy(i);
                    i--;
                }
            }
            for(var i = 0; i<cities.length; i++)
                if(explosionHitCity(explosions.at(j), cities[i]))
                    cities[i].alive = false;
            for(var i = 0; i<silos.length; i++)
                if(explosionHit(explosions.at(j), silos[i]))
                    silos[i].missiles = 0;
        }
    }

    var alive = false;
    for(var i = 0; i<cities.length; i++)
        if(cities[i].alive)
            alive = true;
    if(!alive)
        gameObj.gameOver = true;

    //Clear last frame
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameObj.fancyGraphics) //It'll do the rendering
        return;
    //Paint it (basic canvas)

    if(gameObj.gameOver)
        ctx.fillText("GAME OVER", 240, yLine - 60)
    else if(gameObj.betweenWaves)
        ctx.fillText("STAGE COMPLETED", 240, yLine - 60)

    
    for(var i = 0; i<missiles.size; i++){
        var m = missiles.at(i);
        if(m.anti){
            ctx.strokeStyle = Qt.rgba(1,0,0,1);
            ctx.fillStyle = Qt.rgba(0,0,1,1);
        }else{
            ctx.strokeStyle = Qt.rgba(1,0,0,1);
            ctx.fillStyle = Qt.rgba(0,1,0,1);
        }
        ctx.beginPath();
        ctx.moveTo(m.x0, m.y0);
        ctx.lineTo(m.x, m.y);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(m.x,m.y,2,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
    }

    for(var i = 0; i<6; i++){
        var c = cities[i];
        if (c.alive) {
            //64x48 to fill with 'buildings'
            ctx.fillStyle = Qt.rgba(1,1,0,1);
            ctx.beginPath();
            ctx.rect(c.x + 32, c.y + 14, 22, 34);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = Qt.rgba(0,1,0,1);
            ctx.beginPath();
            ctx.rect(c.x, c.y + 28, 48, 20);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = Qt.rgba(0,1,1,1);
            ctx.beginPath();
            ctx.rect(c.x + 16, c.y - 4, 12, 52);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = Qt.rgba(1,0,1,1);
            ctx.beginPath();
            ctx.rect(c.x + 48, c.y + 30, 14, 18);
            ctx.closePath();
            ctx.fill();
        }
    }

    for(var i = 0; i<3; i++){
        var s = silos[i];
        ctx.fillStyle = Qt.rgba(0,0,1,1);
        ctx.beginPath();
        ctx.rect(s.x, s.y, s.width, s.height);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = Qt.rgba(1,1,1,1);
        ctx.beginPath();
        for (var j = 0; j < s.missiles; j++) {
            var m = { "x" : 0, "y" : 1, "w" : 4, "h" : 10 };
            switch(j) {
                case 0: break;
                case 1: m.x = -0.5; m.y = 2; break;
                case 2: m.x = 0.5; m.y = 2; break;
                case 3: m.x = -1; m.y = 3; break;
                case 4: m.x = 0; m.y = 3; break;
                case 5: m.x = 1; m.y = 3; break;
                default: m.x = -1.5 + (j - 6); m.y = 4; break;
            }
            ctx.rect(s.x + m.x * 8,s.y + m.y * 12, m.w, m.h);
        }
        ctx.closePath();
        ctx.fill();
    }

    if(tickTicker % 8 <= 4)
        ctx.fillStyle = Qt.rgba(1,0,0,1);
    else
        ctx.fillStyle = Qt.rgba(0,1,0,1);
    for(var j = 0; j<explosions.size; j++){
        var explosion = explosions.at(j);

        if(explosion.anti){
            ctx.strokeStyle = Qt.rgba(1,1,1,1);
        }else{
            ctx.strokeStyle = Qt.rgba(1,0,1,1);
        }
        ctx.beginPath();
        ctx.moveTo(explosion.x + explosion.t, explosion.y);
        ctx.arc(explosion.x,explosion.y,explosion.t,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
    }
}

function debugOutput()
{
    if(missiles.size == 0)
        return;
    console.debug(missiles.at(0).x0 + "," + missiles.at(0).y0 + " -> " + missiles.at(0).x + "," + missiles.at(0).y + " -> " + missiles.at(0).x1 + "," + missiles.at(0).y1 );
}
