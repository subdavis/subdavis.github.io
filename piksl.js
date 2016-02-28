//globals
var pk;
var isPaused = false;
var stepTime = 50;

//constants
var CELLS_WIDE = 35;
var WHITE = {"red" : 255, "green": 255, "blue":255};
var DEFAULT_TOP = {"red" : 32, "green": 32, "blue":32};
var DEFAULT_BOTTOM = {"red" : 0, "green": 0, "blue":0};
var DEFAULT = {"red" : 0, "green": 0, "blue":0};
var MAX_DIFFER = .05;
var DIRECTION_PROB = .5;
var INCREMENT = .95;
var MAX_LOOP = 50;
var COLOR_SHIFT = true;
var SHIFT_TO = {"red" : 215, "green": 115, "blue":255};

// initializer
$(document).ready(function(){
    pk = new piksl();
    pk.update();
    stepModel();
});

function stepModel(){
    if(!isPaused){
        pk.stepRoom();
        setTimeout(stepModel, stepTime);
    }
}
function randomColor(){
    var red = Math.floor(Math.random() * 255);
    var green = Math.floor(Math.random() * 255);
    var blue = Math.floor(Math.random() * 255);
    var color = {"red" : red, "green" : green, "blue" : blue}
    if (COLOR_SHIFT) {
        color = mix(SHIFT_TO, color, .4);
    }
    return color;
}
/* Returns a color in the domain, randomly in the middle of it's cycle */
function domainColor(color, random){
    var distance = random * MAX_DIFFER;
    return mix(color, DEFAULT, distance);
}
function mix(color1, color2, increment){
    var red = color1.red * increment + color2.red * (1- increment);
    var green = color1.green * increment + color2.green * (1- increment);
    var blue = color1.blue * increment + color2.blue * (1- increment);
    return {"red" : Math.floor(red), "green" : Math.floor(green), "blue" : Math.floor(blue)};
}
function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}
function colorString(color){
    return "#" + decimalToHex( color.red, 2) + decimalToHex( color.green, 2) + decimalToHex(color.blue, 2);
}
function random_colorize(width, height){
    cells = {};
    for (i = 0; i < width; i++){
        for (j = 0 ; j < height; j++){
            var rand = Math.random();
            var direction = Math.random();
            var original = randomColor();
            var color = domainColor(original,rand);
            var loop = Math.round(MAX_LOOP * rand);
            var cell = {
                x:i, 
                y:j, 
                pure: original, 
                color: domainColor(original), 
                loop: loop, 
                direction: direction < DIRECTION_PROB ? true : false
            };
            cells[ i.toString() + "." + j.toString() ] = cell; 
        }   
    }
    return cells;
}
function piksl(){
    this.elem = $("#piksel-canvas");
    this.pix_width = this.elem.width();
    this.pix_height = this.elem.height();
    this.cellsize = Math.floor(this.pix_width / CELLS_WIDE);
    this.cellsHigh = Math.floor(this.pix_height / this.cellsize);
    this.cellsWide = CELLS_WIDE;
    this.renderAgent = new RenderAgent(CELLS_WIDE, this.cellsHigh, this.cellsize);
    this.cells = random_colorize(CELLS_WIDE, this.cellsHigh);

    this.pulseCells = function(){
        var cells = this.cells;
        for (i = 0; i < this.cellsWide; i++){
            for (j = 0 ; j < this.cellsHigh; j++){
                var key  = i.toString() + "." + j.toString();
                var cell = cells[key];
                if (cell.direction){
                    //toward top
                    if (cell.loop < MAX_LOOP){
                        cell.color = domainColor(cell.pure, cell.loop / MAX_LOOP);
                        cell.loop++;
                    } else {
                        cell.direction = !cell.direction;
                    }
                } else {
                    //toward default
                    if (cell.loop > 0){
                        cell.color = domainColor(cell.pure, cell.loop / MAX_LOOP);
                        cell.loop--;
                    } else {
                        //at the bottom, change it's top color to something else.
                        var original = randomColor();
                        cell.pure = original;
                        cell.direction = !cell.direction;
                    }
                }
            }   
        }
    }
    this.update = function(){
        this.renderAgent.renderCells(this.cells);
    }

    this.stepRoom = function(){
        this.renderAgent.clearAll();
        this.pulseCells()
        this.update();
    }
    this.tap = function(x, y){
        var cellx = Math.floor(x / this.cellsize);
        var celly = Math.floor(y / this.cellsize);
    }
}

//RenderAgent knows about the actual display.
//This could be used for practically anything.
//This is some damn good code.
function RenderAgent(cellsWide, cellsHigh, cellSize){
    //get the canvas
    this.canvas = document.getElementById("piksel-canvas");
    this.canvas.addEventListener("click", getPosition, false);
    this.cellSize = cellSize;
    //resize the canvas for our new thingy
    this.canvas.width = cellsWide * cellSize; //in pixels
    this.canvas.height = cellsHigh * cellSize; //in pixels
    this.width = this.canvas.width; //in pixels
    this.height = this.canvas.height; //in pixels
    this.cellw = cellSize; // in pixels
    this.cellh = cellSize; //in pixels
    this.context = this.canvas.getContext("2d");
    //bounds of the current view.
    this.topleft = [0,0]; //in cells
    this.bottomright = [cellsWide, cellsHigh]; //in cells
    //what color for state 2 are we currently using?
    //this.color = deadColors[0];
    //Variables for framerate
    this.iteration = 0;
    //this.framerate = $("#framerate");
    this.lastTime = 0;
    //Give it an array of cells to draw.  This method doesn't clear before drawing
    this.renderCells = function(activeCells){
        //load the context onto the board
        this.context.restore();
        var keys = Object.keys(activeCells);
        //iterate over ALL activeCells
        var keys = Object.keys(activeCells);
        for(i = 0; i< keys.length; i++){
            var key = keys[i];
            var cell = activeCells[key];

            this.context.fillStyle = colorString(cell.color);
            var px = this.cellw * (cell.x - this.topleft[0]);
            var py = this.cellh * (cell.y - this.topleft[1]);
            this.context.fillRect(px, py, this.cellw, this.cellh);
        }
        //save the context for next time
        this.context.save();
        this.iteration++;

        //Every 5 ticks, update the framerate counter
        if (this.iteration % 5 == 0){
          var now = (new Date).getTime();
          var timeSinceLast = now - this.lastTime
          this.lastTime = now;
          //this.framerate.text(Math.floor(5 / (timeSinceLast / 1000)).toString());
        }
    }
    //Use this if clearing is needed.
    this.clearAll = function(){
        this.context.fillStyle = 'rgba(255,255,255,1)';
        this.context.fillRect(0,0,this.width, this.height);
    }
    //Change the view window.  This is used for scrolling around.
    this.setWindow = function(topleft, bottomright){
        this.topleft = topleft;
        this.bottomright = bottomright;
        this.clearAll();
    }
    //Get the cell a set of X Y coords are in. Works even if origin not at top left.
    this.getCellByCoords = function(x, y){
        var row = Math.floor(x / this.cellSize) + this.topleft[0]; //account for window scroll
        var col = Math.floor(y / this.cellSize) + this.topleft[1]; //account for window scroll
        return [row, col];
    }
}
function getPosition(event)
{
  var x = event.clientX;
  var y = event.clientY;

  var canvas = document.getElementById("piksel-canvas");
  var borderwidth = 0;
  x -= (canvas.offsetLeft + borderwidth);
  y -= (canvas.offsetTop + borderwidth);
  //What kind of click was it?
  if (event.ctrlKey){
    //toggle cell off.
    
  } else if (event.shiftKey){
    //toggle cell on
    
  } else {
    //regular click
    pk.tap(x, y);
  }
}