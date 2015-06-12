.pragma library//For global shared state
Qt.include("list.js");

var blockComponent = Qt.createComponent("Block.qml");
var blocks = new List();
var faller = undefined;
var fallSpeed = 4;
var momentum = 0;
var initialized = false;
var gameRunning = true;

function intersect(rect1, rect2)
{
    if(rect1 == undefined || rect2 == undefined)
        return false;
    if(rect1.x + rect1.width > rect2.x && rect1.x < rect2.x + rect2.width
            && rect1.y + rect1.height > rect2.y && rect1.y < rect2.y + rect2.height)
        return true;
    return false;
}
function gameOver(won){
    if(won)
        console.log("You won!");
    else
        console.log("You lost!");
    gameRunning = false;
}

function tick(root) {
    if(!gameRunning)//Won or lost
        return;
    if(!initialized){
        blocks.append(blockComponent.createObject(root, {"x": 20, "y" : root.height - 40, "starter" : true, "offset" : 0}));
        initialized = true;
    }
    //Move player
    if(root.movingLeft){
        blocks.at(0).x -= 4;
        if(momentum > -8)
            momentum -= 0.25;
        if(momentum > 0)
            momentum -= 0.25;
    }else if(root.movingRight){
        blocks.at(0).x += 4;
        if(momentum < 0)
            momentum += 0.25;
        if(momentum < 8)
            momentum += 0.25;
    }else{
        if(momentum < 0)
            momentum += 0.25;
        else if (momentum > 0)
            momentum -= 0.25;
    }

    //Wobble blocks on top by momentum
    for(var i = 1; i< blocks.size; i++)
        blocks.at(i).x = blocks.at(i-1).x + blocks.at(i).offset + momentum * i * 0.5;

    //Move faller (maybe spawn)
    if(faller !== undefined){
        faller.y += fallSpeed;
        if(faller.y > root.height)
            return gameOver(false);
        if(intersect(faller, blocks.at(blocks.size-1))){
            if(faller.y + faller.height - fallSpeed <= blocks.at(blocks.size-1).y){//Is Stacking (deliberate overlap of fallSpeed pixels! Use prediction to avoid)
                if(faller.y - faller.height <= 0)
                    return gameOver(true);
                faller.falling = false;
                faller.offset = faller.x - blocks.at(blocks.size-1).x;
                blocks.append(faller);
                faller = undefined;
            }else{//Collide
                console.log((faller.y + faller.height - fallSpeed) + " ," + blocks.at(0).y)
                return gameOver(false);
            }
        }else{
            for(var i = 0; i< blocks.size-2; i++){
                if(intersect(faller, blocks.at(i)))
                    return gameOver(false);
            }
        }
    }
    if(faller === undefined){ // May have unset him in last block
        faller = blockComponent.createObject(root, {"x":Math.floor(Math.random() * (root.width-40)), "falling" : true});
    }
}

