
//globals
var pk;
var isPaused = false;
var stepTime = 50;

//constants
var CELLS_WIDE = 40;
var WHITE = {"red" : 179, "green": 217, "blue":255};
var DEFAULT = {"red" : 255, "green": 255, "blue":255};
var INCREMENT = .93;
var MAX_LOOP = 20;

function stepModel(){
    if(!isPaused){
        pk.stepRoom();
        setTimeout(stepModel, stepTime);
    }
}

// initializer
$(document).ready(function(){
    pk = new piksl();
    pk.update();
    stepModel();
});

function randomColor(){
    var red = Math.floor(Math.random() * 255);
    var green = Math.floor(Math.random() * 255);
    var blue = Math.floor(Math.random() * 255);
    return {"red" : red, "green" : green, "blue" : blue};
}

function mix(color1, color2, increment){
    var red = color1.red * increment + color2.red * (1- increment);
    var green = color1.green * increment + color2.green * (1- increment);
    var blue = color1.blue * increment + color2.blue * (1- increment);
    return {"red" : Math.floor(red), "green" : Math.floor(green), "blue" : Math.floor(blue)};
}

function colorString(color){
    return "#" + color.red.toString(16) + color.green.toString(16) + color.blue.toString(16);
}

//returns a list of cell objects weighted at the sides of the screen
function randomize(width, height){
    var prob_sides = .96;
    var dropoff = .04;
    var left_weight = 3;

    var cells = [];
    var prob = prob_sides;

    for (i=0;i<width/2;i++){
        //iterate over left half
        for (j = 0;j < height;j++){
            //over the full height
            var rand = Math.random();
            if (rand < prob){
                var cell = {x:i, y:j};
                cells.push(cell);
            }
        }
        prob -= dropoff;
    }

    prob = prob_sides;

    for (i=width;i > width/2;i--){
        //iterate over left half
        for (j = 0;j < height;j++){
            //over the full height
            var rand = Math.random();
            if (rand < prob){
                var cell = {x:i, y:j};
                cells.push(cell);
            }
        }
        prob -= dropoff;
    }

    return cells;
}

function random_colorize(width, height){
    cells = {};
    for (i = 0; i < width; i++){
        for (j = 0 ; j < height; j++){
            var rand = Math.random();
            var pulse_prob = 1;
            var original = randomColor();
            var color = mix(original, WHITE, .5);
            color = mix(color, DEFAULT, .5);
            color = mix(color, DEFAULT, .8);
            var cell = {x:i, y:j, color: color, top: color, pure: original, pulse:false};
            if (rand < pulse_prob){
                var dir = Math.random();
                var dir_prob = .5;
                cell["pulse"] = true;
                cell["direction"] = (dir < dir_prob) ? true : false;
                cell["color"] = (dir < dir_prob) ? WHITE : color;
                cell["loop"] = rand * MAX_LOOP;
            }
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
                if (cell.pulse){
                    if (cell.direction){
                        //toward top
                        if (cell.loop < MAX_LOOP){
                            cell.color = mix(cell.color, cell.top, INCREMENT);
                            cell.loop++;
                        } else {
                            cell.direction = !cell.direction;
                            cell.loop = 0;
                        }
                    } else {
                        //toward default
                        if (cell.loop < MAX_LOOP){
                            cell.color = mix(cell.color,  WHITE, INCREMENT);
                            cell.loop++;
                        } else {
                            cell.direction = !cell.direction;
                            cell.loop = 0;
                        }
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