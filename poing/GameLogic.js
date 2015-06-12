var g = null;
var pressedKeys = new Array();
var gameMaxPY = 100;
var gameMaxBY = 100;
var gameMaxBX = 100;

var basePaddleSpeed = 3;
var baseSpeed = 1.5;
var speedCap = 16;
var switchFactor = 64;
var boostAmount = 0.1;

var speedBoost = 0;
var speedAcc = 0;
var speedCount = 1;
var p1Boost = 0;
var p2Boost = 0;
//Since you take time to release, we don't penalize you for wrong press if you didn't release it
//But we will if you press the other before releasing it!
var p1MidBoost = 0;
var p2MidBoost = 0;

// +/-1 (or better)
var ballVY = 0;
var ballVX = 0;

function init(gameItem)
{
    g = gameItem;
    gameItem.ballX = gameItem.height/2;
    gameItem.ballY = gameItem.width/2;
    ballVY = 1;
    ballVX = -1;
    //paddle pos not reset on purpose, because I like that feel
    gameItem.p1Score = 0;
    gameItem.p2Score = 0;
    gameItem.paused = false;
    gameItem.gameOver = false;
    pressedKeys = new Array();

    gameMaxPY = gameItem.height - gameItem.paddleHeight;
    gameMaxBY = gameItem.height - gameItem.ballSize;
    gameMaxBX = gameItem.width - (gameItem.paddleWidth + gameItem.ballSize);
    
    //base speed never altered. Ever.
    speedCount = 256;
    speedBoost = 0;
    speedAcc = 0;
    p1Boost = 0;
    p2Boost = 0;
    p1MidBoost = 0;
    p2MidBoost = 0;
    console.log("Starting a new " + (vsWall ? "1P" : "2P") + " game!");
}

function ballObj()
{
    return {
        "x" : g.ballX,
        "y" : g.ballY,
        "width": g.ballSize,
        "height": g.ballSize
    };
}

function p1Paddle()
{
    return {
        "x" : 0,
        "y" : g.p1Y,
        "width": g.paddleWidth,
        "height": g.paddleHeight
    };
}

function p2Paddle()
{
    return {
        "x" : gameMaxBX + g.ballSize, //MaxBX is really for the ball
        "y" : g.vsWall ? 0 : g.p2Y,
        "width": g.paddleWidth,
        "height": g.vsWall ? g.height : g.paddleHeight
    };
}

//I felt like doing this one generically. Takes 2 objects with x/y/width/height
function intersects(a, b)
{
    //Note it's non-inclusive because we programmatically move to boundary to get out
    return (a.x < (b.x + b.width)
        && (a.x + a.width) >  b.x
        && a.y < (b.y + b.height)
        && (a.y + a.height) > b.y);
}

function givePoint(player)
{
    if (g.vsWall) {
        if(player == 1)
            g.p1Score += 1000; //Compensation for my bug cutting your game short
        g.end();
        return;
    }

    if (player == 1){
        g.p1Score++;
        g.ballX = g.paddleWidth
        g.ballY = g.height/2;
    } else {
        g.p2Score++;
        g.ballX = gameMaxBX
        g.ballY = g.height/2;
    }

    speedBoost = 0; //ball speed reset
    if (g.p1Score >= 11 || g.p2Score >= 11)
        g.end();
}

function tick()
{
    //Pause handling is "special"
    if (g == null || g.paused || g.gameOver)
        return;

    
    //Note that this will call move() as needed
    var p1dy = g.p1Y;
    var p2dy = g.p2Y;
    processInput();
    p1dy -= g.p1Y;
    p2dy -= g.p2Y;


    //Move ball
    g.ballY += ballVY * (baseSpeed + speedBoost);
    if (g.ballY < 0) {
        g.ballY = 0
        ballVY = 1;
    }
    if (g.ballY > gameMaxBY) {
        g.ballY = gameMaxBY
        ballVY = -1;
    }

    g.ballX += ballVX * (baseSpeed + speedBoost);
    if (g.ballX < 0)
        givePoint(2);
    else if((g.ballX - g.paddleWidth) > gameMaxBX) //MaxBX assumes collision with paddle
        givePoint(1);
    else {
        if (intersects(ballObj(), p1Paddle())) {
            g.ballX = paddleWidth;
            ballVX = 1 + (p1Boost/4);
            if (p1Boost > 0.5)
                ballVY *= (p1Boost/2); //"spin" to allow some actual control
            if (g.vsWall)
                g.p1Score++;
            g.p1Top = !g.p1Top
        }
        if (g.vsWall ? g.ballX > gameMaxBX : intersects(ballObj(), p2Paddle())) {
            g.ballX = gameMaxBX;
            ballVX = -1 - (p2Boost/4);
            if (p2Boost > 1)
                ballVY *= (p2Boost/2); //"spin" to allow some actual control
            g.p2Top = !g.p2Top
        }
    }

    //Decrement boost?
    if (p1Boost > 0)
        p1Boost -= boostAmount;
    if (p2Boost > 0)
        p2Boost -= boostAmount;
    //Increment boost?
    speedAcc++;
    if (speedBoost < speedCap && speedAcc >= speedCount) {
        speedBoost += boostAmount;
        speedAcc = 0;
    }
}

//dir is -1 for up, 1 for down
function move(player, dir)
{
    //This will get called during tick
    //Calculate next spot
    var prevY = (player == 1) ? g.p1Y : g.p2Y
    var nextY = prevY + dir * (basePaddleSpeed + (player == 1 ? p1Boost : p2Boost));
    if (nextY < 0)
        nextY = 0;
    if (nextY > gameMaxPY)
        nextY = gameMaxPY;

    //Check for ball intersection (which is not allowed!)
    var hitBall = false
    if (player == 1)
        if (intersects(ballObj(), p1Paddle()))
            hitBall = true
    else
        if (intersects(ballObj(), p2Paddle()))
            hitBall = true
    if (hitBall) {
        if (prevY < g.ballY)
            nextY = g.ballY - g.paddleHeight;
        else //must have come from below!
            nextY = g.ballY + g.ballSize
    }

    //Move Paddle
    if (player == 1)
        g.p1Y = nextY;
    else
        g.p2Y = nextY;
}

function handleKeyPressed(keyCode)
{
    if (pressedKeys.indexOf(keyCode) == -1)
        pressedKeys.push(keyCode);
}

function handleKeyReleased(keyCode)
{
    var i = pressedKeys.indexOf(keyCode);
    if (i != -1)
        pressedKeys.splice(i,1);

    //Cancel midboost protection
    if (keyCode == 0x57 && p1MidBoost == 1)
        p1MidBoost = 0;
    else if (keyCode == 0x53 && p1MidBoost == 2)
        p1MidBoost = 0;
    else if (keyCode == 0x49 && p2MidBoost == 1)
        p2MidBoost = 0;
    else if (keyCode == 0x4b && p2MidBoost == 2)
        p2MidBoost = 0;

    if (keyCode == 0x20) //space
        g.paused = !g.paused
}


function xor(a,b) { return (a ? !b : b); }

function boostAttempt(player, topSide)
{
    if ((player == 1 ? p1MidBoost : p2MidBoost) == (topSide ? 1 : 2))
        return;

    var t = (player == 1 ? g.p1Top : g.p2Top);
    if (xor(t, topSide))
        player == 1 ? p1Boost = 0 : p2Boost = 0;
    else {
        if (player == 1) {
            p1Boost += switchFactor * boostAmount;
            if (p1Boost > speedCap)
                p1Boost = speedCap;
            p1MidBoost = topSide ? 1 : 2;
            g.p1Top = !g.p1Top;
        } else {
            p2Boost += switchFactor * boostAmount;
            if (p2Boost > speedCap)
                p2Boost = speedCap;
            p2MidBoost = topSide ? 1 : 2;
            g.p2Top = !g.p2Top;
        }

    }
}

function processInput()
{
    for(var i=0; i<pressedKeys.length; i++) {
        var keyCode = pressedKeys[i];
        switch(keyCode) {
            case 0x51: if(g.p1Top) move(1,-1); break;
            case 0x57: boostAttempt(1, true); break;
            case 0x45: if(g.p1Top) move(1,1); break;
            case 0x41: if(!g.p1Top) move(1,-1); break;
            case 0x53: boostAttempt(1, false); break;
            case 0x44: if(!g.p1Top) move(1,1); break;
            case 0x55: if(g.p2Top) move(2,-1); break;
            case 0x49: boostAttempt(2, true); break;
            case 0x4f: if(g.p2Top) move(2,1); break;
            case 0x4a: if(!g.p2Top) move(2,-1); break;
            case 0x4b: boostAttempt(2, false); break;
            case 0x4c: if(!g.p2Top) move(2,1); break;
            //case 0x20: g.paused = !g.paused; break;
            default: //console.log("Unhandled key: " + keyCode);
        }
    }
}
