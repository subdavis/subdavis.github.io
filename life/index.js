var stepTime = $("#time").val(); // in milliseconds
var checkRadius = 1; // in cells
var neighborsToLive = [2,3]; // in cells
var neighborsToDie = [0,1,4,5,6,7,8]; //in cells
var neighborsToComeAlive = [3]; // in cells
//Config Settings.
var presets = {}
presets.glider = '{"46.36":{"x":46,"y":36,"state":1,"ns":1,"wc":false},"44.37":{"x":44,"y":37,"state":1,"ns":1,"wc":false},"46.37":{"x":46,"y":37,"state":1,"ns":1,"wc":false},"34.38":{"x":34,"y":38,"state":1,"ns":1,"wc":false},"35.38":{"x":35,"y":38,"state":1,"ns":1,"wc":false},"42.38":{"x":42,"y":38,"state":1,"ns":1,"wc":false},"43.38":{"x":43,"y":38,"state":1,"ns":1,"wc":false},"56.38":{"x":56,"y":38,"state":1,"ns":1,"wc":false},"57.38":{"x":57,"y":38,"state":1,"ns":1,"wc":false},"33.39":{"x":33,"y":39,"state":1,"ns":1,"wc":false},"37.39":{"x":37,"y":39,"state":1,"ns":1,"wc":false},"42.39":{"x":42,"y":39,"state":1,"ns":1,"wc":false},"43.39":{"x":43,"y":39,"state":1,"ns":1,"wc":false},"56.39":{"x":56,"y":39,"state":1,"ns":1,"wc":false},"57.39":{"x":57,"y":39,"state":1,"ns":1,"wc":false},"22.40":{"x":22,"y":40,"state":1,"ns":1,"wc":false},"23.40":{"x":23,"y":40,"state":1,"ns":1,"wc":false},"32.40":{"x":32,"y":40,"state":1,"ns":1,"wc":false},"38.40":{"x":38,"y":40,"state":1,"ns":1,"wc":false},"42.40":{"x":42,"y":40,"state":1,"ns":1,"wc":false},"43.40":{"x":43,"y":40,"state":1,"ns":1,"wc":false},"22.41":{"x":22,"y":41,"state":1,"ns":1,"wc":false},"23.41":{"x":23,"y":41,"state":1,"ns":1,"wc":false},"32.41":{"x":32,"y":41,"state":1,"ns":1,"wc":false},"36.41":{"x":36,"y":41,"state":1,"ns":1,"wc":false},"38.41":{"x":38,"y":41,"state":1,"ns":1,"wc":false},"39.41":{"x":39,"y":41,"state":1,"ns":1,"wc":false},"44.41":{"x":44,"y":41,"state":1,"ns":1,"wc":false},"46.41":{"x":46,"y":41,"state":1,"ns":1,"wc":false},"32.42":{"x":32,"y":42,"state":1,"ns":1,"wc":false},"38.42":{"x":38,"y":42,"state":1,"ns":1,"wc":false},"46.42":{"x":46,"y":42,"state":1,"ns":1,"wc":false},"33.43":{"x":33,"y":43,"state":1,"ns":1,"wc":false},"37.43":{"x":37,"y":43,"state":1,"ns":1,"wc":false},"34.44":{"x":34,"y":44,"state":1,"ns":1,"wc":false},"35.44":{"x":35,"y":44,"state":1,"ns":1,"wc":false}}';
presets.seed = '{"32.38":{"x":32,"y":38,"state":1,"ns":1,"wc":false},"31.37":{"x":31,"y":37,"state":0,"ns":0,"wc":false},"31.38":{"x":31,"y":38,"state":0,"ns":0,"wc":false},"31.39":{"x":31,"y":39,"state":0,"ns":0,"wc":false},"32.37":{"x":32,"y":37,"state":0,"ns":0,"wc":false},"32.39":{"x":32,"y":39,"state":0,"ns":0,"wc":false},"33.37":{"x":33,"y":37,"state":1,"ns":1,"wc":false},"33.38":{"x":33,"y":38,"state":0,"ns":0,"wc":false},"33.39":{"x":33,"y":39,"state":0,"ns":0,"wc":false},"30.36":{"x":30,"y":36,"state":0,"ns":0,"wc":false},"30.37":{"x":30,"y":37,"state":0,"ns":0,"wc":false},"30.38":{"x":30,"y":38,"state":0,"ns":0,"wc":false},"31.36":{"x":31,"y":36,"state":0,"ns":0,"wc":false},"32.36":{"x":32,"y":36,"state":0,"ns":0,"wc":false},"30.39":{"x":30,"y":39,"state":0,"ns":0,"wc":false},"30.40":{"x":30,"y":40,"state":0,"ns":0,"wc":false},"31.40":{"x":31,"y":40,"state":0,"ns":0,"wc":false},"32.40":{"x":32,"y":40,"state":0,"ns":0,"wc":false},"33.36":{"x":33,"y":36,"state":0,"ns":0,"wc":false},"33.40":{"x":33,"y":40,"state":0,"ns":0,"wc":false},"34.36":{"x":34,"y":36,"state":0,"ns":0,"wc":false},"34.37":{"x":34,"y":37,"state":1,"ns":1,"wc":false},"34.38":{"x":34,"y":38,"state":1,"ns":1,"wc":false},"34.39":{"x":34,"y":39,"state":0,"ns":0,"wc":false},"34.40":{"x":34,"y":40,"state":0,"ns":0,"wc":false},"35.36":{"x":35,"y":36,"state":1,"ns":1,"wc":false},"36.36":{"x":36,"y":36,"state":1,"ns":1,"wc":false},"36.37":{"x":36,"y":37,"state":1,"ns":1,"wc":false},"36.38":{"x":36,"y":38,"state":1,"ns":1,"wc":false},"36.34":{"x":36,"y":34,"state":1,"ns":1,"wc":false},"34.34":{"x":34,"y":34,"state":1,"ns":1,"wc":false},"33.34":{"x":33,"y":34,"state":1,"ns":1,"wc":false},"32.34":{"x":32,"y":34,"state":1,"ns":1,"wc":false},"32.35":{"x":32,"y":35,"state":1,"ns":1,"wc":false}}';
presets.oscillator = '{"33.17":{"x":33,"y":17,"state":1,"ns":1,"wc":false},"46.17":{"x":46,"y":17,"state":1,"ns":1,"wc":false},"26.18":{"x":26,"y":18,"state":1,"ns":1,"wc":false},"27.18":{"x":27,"y":18,"state":1,"ns":1,"wc":false},"52.18":{"x":52,"y":18,"state":1,"ns":1,"wc":false},"53.18":{"x":53,"y":18,"state":1,"ns":1,"wc":false},"25.19":{"x":25,"y":19,"state":1,"ns":1,"wc":false},"26.19":{"x":26,"y":19,"state":1,"ns":1,"wc":false},"27.19":{"x":27,"y":19,"state":1,"ns":1,"wc":false},"31.19":{"x":31,"y":19,"state":1,"ns":1,"wc":false},"32.19":{"x":32,"y":19,"state":1,"ns":1,"wc":false},"47.19":{"x":47,"y":19,"state":1,"ns":1,"wc":false},"48.19":{"x":48,"y":19,"state":1,"ns":1,"wc":false},"52.19":{"x":52,"y":19,"state":1,"ns":1,"wc":false},"53.19":{"x":53,"y":19,"state":1,"ns":1,"wc":false},"54.19":{"x":54,"y":19,"state":1,"ns":1,"wc":false},"31.20":{"x":31,"y":20,"state":1,"ns":1,"wc":false},"32.20":{"x":32,"y":20,"state":1,"ns":1,"wc":false},"34.20":{"x":34,"y":20,"state":1,"ns":1,"wc":false},"35.20":{"x":35,"y":20,"state":1,"ns":1,"wc":false},"44.20":{"x":44,"y":20,"state":1,"ns":1,"wc":false},"45.20":{"x":45,"y":20,"state":1,"ns":1,"wc":false},"47.20":{"x":47,"y":20,"state":1,"ns":1,"wc":false},"48.20":{"x":48,"y":20,"state":1,"ns":1,"wc":false},"33.21":{"x":33,"y":21,"state":1,"ns":1,"wc":false},"46.21":{"x":46,"y":21,"state":1,"ns":1,"wc":false},"19.25":{"x":19,"y":25,"state":1,"ns":1,"wc":false},"60.25":{"x":60,"y":25,"state":1,"ns":1,"wc":false},"18.26":{"x":18,"y":26,"state":1,"ns":1,"wc":false},"19.26":{"x":19,"y":26,"state":1,"ns":1,"wc":false},"60.26":{"x":60,"y":26,"state":1,"ns":1,"wc":false},"61.26":{"x":61,"y":26,"state":1,"ns":1,"wc":false},"18.27":{"x":18,"y":27,"state":1,"ns":1,"wc":false},"19.27":{"x":19,"y":27,"state":1,"ns":1,"wc":false},"60.27":{"x":60,"y":27,"state":1,"ns":1,"wc":false},"61.27":{"x":61,"y":27,"state":1,"ns":1,"wc":false},"19.31":{"x":19,"y":31,"state":1,"ns":1,"wc":false},"20.31":{"x":20,"y":31,"state":1,"ns":1,"wc":false},"59.31":{"x":59,"y":31,"state":1,"ns":1,"wc":false},"60.31":{"x":60,"y":31,"state":1,"ns":1,"wc":false},"19.32":{"x":19,"y":32,"state":1,"ns":1,"wc":false},"20.32":{"x":20,"y":32,"state":1,"ns":1,"wc":false},"59.32":{"x":59,"y":32,"state":1,"ns":1,"wc":false},"60.32":{"x":60,"y":32,"state":1,"ns":1,"wc":false},"17.33":{"x":17,"y":33,"state":1,"ns":1,"wc":false},"21.33":{"x":21,"y":33,"state":1,"ns":1,"wc":false},"58.33":{"x":58,"y":33,"state":1,"ns":1,"wc":false},"62.33":{"x":62,"y":33,"state":1,"ns":1,"wc":false},"20.34":{"x":20,"y":34,"state":1,"ns":1,"wc":false},"59.34":{"x":59,"y":34,"state":1,"ns":1,"wc":false},"20.35":{"x":20,"y":35,"state":1,"ns":1,"wc":false},"59.35":{"x":59,"y":35,"state":1,"ns":1,"wc":false},"20.44":{"x":20,"y":44,"state":1,"ns":1,"wc":false},"59.44":{"x":59,"y":44,"state":1,"ns":1,"wc":false},"20.45":{"x":20,"y":45,"state":1,"ns":1,"wc":false},"59.45":{"x":59,"y":45,"state":1,"ns":1,"wc":false},"17.46":{"x":17,"y":46,"state":1,"ns":1,"wc":false},"21.46":{"x":21,"y":46,"state":1,"ns":1,"wc":false},"58.46":{"x":58,"y":46,"state":1,"ns":1,"wc":false},"62.46":{"x":62,"y":46,"state":1,"ns":1,"wc":false},"19.47":{"x":19,"y":47,"state":1,"ns":1,"wc":false},"20.47":{"x":20,"y":47,"state":1,"ns":1,"wc":false},"59.47":{"x":59,"y":47,"state":1,"ns":1,"wc":false},"60.47":{"x":60,"y":47,"state":1,"ns":1,"wc":false},"19.48":{"x":19,"y":48,"state":1,"ns":1,"wc":false},"20.48":{"x":20,"y":48,"state":1,"ns":1,"wc":false},"59.48":{"x":59,"y":48,"state":1,"ns":1,"wc":false},"60.48":{"x":60,"y":48,"state":1,"ns":1,"wc":false},"18.52":{"x":18,"y":52,"state":1,"ns":1,"wc":false},"19.52":{"x":19,"y":52,"state":1,"ns":1,"wc":false},"60.52":{"x":60,"y":52,"state":1,"ns":1,"wc":false},"61.52":{"x":61,"y":52,"state":1,"ns":1,"wc":false},"18.53":{"x":18,"y":53,"state":1,"ns":1,"wc":false},"19.53":{"x":19,"y":53,"state":1,"ns":1,"wc":false},"60.53":{"x":60,"y":53,"state":1,"ns":1,"wc":false},"61.53":{"x":61,"y":53,"state":1,"ns":1,"wc":false},"19.54":{"x":19,"y":54,"state":1,"ns":1,"wc":false},"60.54":{"x":60,"y":54,"state":1,"ns":1,"wc":false},"33.58":{"x":33,"y":58,"state":1,"ns":1,"wc":false},"46.58":{"x":46,"y":58,"state":1,"ns":1,"wc":false},"31.59":{"x":31,"y":59,"state":1,"ns":1,"wc":false},"32.59":{"x":32,"y":59,"state":1,"ns":1,"wc":false},"34.59":{"x":34,"y":59,"state":1,"ns":1,"wc":false},"35.59":{"x":35,"y":59,"state":1,"ns":1,"wc":false},"44.59":{"x":44,"y":59,"state":1,"ns":1,"wc":false},"45.59":{"x":45,"y":59,"state":1,"ns":1,"wc":false},"47.59":{"x":47,"y":59,"state":1,"ns":1,"wc":false},"48.59":{"x":48,"y":59,"state":1,"ns":1,"wc":false},"25.60":{"x":25,"y":60,"state":1,"ns":1,"wc":false},"26.60":{"x":26,"y":60,"state":1,"ns":1,"wc":false},"27.60":{"x":27,"y":60,"state":1,"ns":1,"wc":false},"31.60":{"x":31,"y":60,"state":1,"ns":1,"wc":false},"32.60":{"x":32,"y":60,"state":1,"ns":1,"wc":false},"47.60":{"x":47,"y":60,"state":1,"ns":1,"wc":false},"48.60":{"x":48,"y":60,"state":1,"ns":1,"wc":false},"52.60":{"x":52,"y":60,"state":1,"ns":1,"wc":false},"53.60":{"x":53,"y":60,"state":1,"ns":1,"wc":false},"54.60":{"x":54,"y":60,"state":1,"ns":1,"wc":false},"26.61":{"x":26,"y":61,"state":1,"ns":1,"wc":false},"27.61":{"x":27,"y":61,"state":1,"ns":1,"wc":false},"52.61":{"x":52,"y":61,"state":1,"ns":1,"wc":false},"53.61":{"x":53,"y":61,"state":1,"ns":1,"wc":false},"33.62":{"x":33,"y":62,"state":1,"ns":1,"wc":false},"46.62":{"x":46,"y":62,"state":1,"ns":1,"wc":false}}';
presets.riley = '{"173.41":{"x":173,"y":41,"state":1,"ns":1,"wc":false},"174.42":{"x":174,"y":42,"state":1,"ns":1,"wc":false},"170.43":{"x":170,"y":43,"state":1,"ns":1,"wc":false},"174.43":{"x":174,"y":43,"state":1,"ns":1,"wc":false},"171.44":{"x":171,"y":44,"state":1,"ns":1,"wc":false},"172.44":{"x":172,"y":44,"state":1,"ns":1,"wc":false},"173.44":{"x":173,"y":44,"state":1,"ns":1,"wc":false},"174.44":{"x":174,"y":44,"state":1,"ns":1,"wc":false},"170.47":{"x":170,"y":47,"state":1,"ns":1,"wc":false},"171.48":{"x":171,"y":48,"state":1,"ns":1,"wc":false},"172.49":{"x":172,"y":49,"state":1,"ns":1,"wc":false},"172.50":{"x":172,"y":50,"state":1,"ns":1,"wc":false},"171.51":{"x":171,"y":51,"state":1,"ns":1,"wc":false},"172.51":{"x":172,"y":51,"state":1,"ns":1,"wc":false},"173.55":{"x":173,"y":55,"state":1,"ns":1,"wc":false},"174.56":{"x":174,"y":56,"state":1,"ns":1,"wc":false},"170.57":{"x":170,"y":57,"state":1,"ns":1,"wc":false},"174.57":{"x":174,"y":57,"state":1,"ns":1,"wc":false},"171.58":{"x":171,"y":58,"state":1,"ns":1,"wc":false},"172.58":{"x":172,"y":58,"state":1,"ns":1,"wc":false},"173.58":{"x":173,"y":58,"state":1,"ns":1,"wc":false},"174.58":{"x":174,"y":58,"state":1,"ns":1,"wc":false},"136.67":{"x":136,"y":67,"state":1,"ns":1,"wc":false},"137.68":{"x":137,"y":68,"state":1,"ns":1,"wc":false},"133.69":{"x":133,"y":69,"state":1,"ns":1,"wc":false},"137.69":{"x":137,"y":69,"state":1,"ns":1,"wc":false},"134.70":{"x":134,"y":70,"state":1,"ns":1,"wc":false},"135.70":{"x":135,"y":70,"state":1,"ns":1,"wc":false},"136.70":{"x":136,"y":70,"state":1,"ns":1,"wc":false},"137.70":{"x":137,"y":70,"state":1,"ns":1,"wc":false},"43.78":{"x":43,"y":78,"state":1,"ns":1,"wc":false},"44.79":{"x":44,"y":79,"state":1,"ns":1,"wc":false},"40.80":{"x":40,"y":80,"state":1,"ns":1,"wc":false},"44.80":{"x":44,"y":80,"state":1,"ns":1,"wc":false},"41.81":{"x":41,"y":81,"state":1,"ns":1,"wc":false},"42.81":{"x":42,"y":81,"state":1,"ns":1,"wc":false},"43.81":{"x":43,"y":81,"state":1,"ns":1,"wc":false},"44.81":{"x":44,"y":81,"state":1,"ns":1,"wc":false}}';
//Color array to iterate through for dead cells
deadColors = ['#CBC5E3', '#E3C5CE', '#DDE3c5', '#C5E3DA'];
//Create the view.
var defaultCellSize = $("#zoom").val(); // 10x10 pixels for a cell
var defaultView = "inf";  // infinite mode is default
var isPaused = false;     //start it running.
//create the view
view = new View(defaultCellSize, defaultView);
//Load the oscillator by default
loadPreset('oscillator');
//Draw the full state once, then only update it afterward.
view.drawView();
//Begin the logic loop
setTimeout(stepModel, stepTime);
/* -----------------
Button Click Methods
------------------*/
function pause(){
    isPaused = !isPaused;
    $("#pause").html(isPaused ? "Play" : "Pause");
    if(!isPaused){
        stepModel();
    }
}
function setStepTime(){
    var newTime = $("#time").val();
    stepTime = newTime;
}
function randomize(){
    view.resetCells();
    view.randomFill();
    view.drawView();
}
function loadPreset(name){
    view.resetCells();
    view.activeCells = JSON.parse(presets[name]);
    view.drawView();
}
function setZoom(){
    var resumeOnFinish = !isPaused;
    isPaused = true;
    var zoom = $("#zoom").val();
    var activeCellCopy = view.activeCells;
    var viewMode = view.mode;
    view = {};
    view = new View(zoom, viewMode);
    view.activeCells = activeCellCopy;
    isPaused = !resumeOnFinish;
    view.drawView();
    if (resumeOnFinish) stepModel();
}
function scroll(topleft, bottomright){
    view.renderAgent.setWindow(topleft, bottomright);
    view.drawView();
}
function bump(direction){
    isPaused = true;
    var topleft = view.renderAgent.topleft;
    var bottomright = view.renderAgent.bottomright;
    var d = 10
    if (direction == "down"){
        var newTL = [topleft[0] , topleft[1]+d];
        var newBR = [bottomright[0] , bottomright[1] +d];
        scroll(newTL, newBR);
    }else if (direction == "up"){
        var newTL = [topleft[0] , topleft[1]-d];
        var newBR = [bottomright[0] , bottomright[1]-d];
        scroll(newTL, newBR);
    }else if (direction == "left"){
        var newTL = [topleft[0] - d, topleft[1]];
        var newBR = [bottomright[0] -d, bottomright[1]];
        scroll(newTL, newBR);
    }else if (direction == "right"){
        var newTL = [topleft[0] + d, topleft[1]];
        var newBR = [bottomright[0] +d, bottomright[1]];
        scroll(newTL, newBR);
    }
    isPaused = false;
    view.drawView();
}
function setWidth(){
    isPaused = true;
    var viewMode = view.mode;
    view = {};
    view = new View(defaultCellSize, viewMode);
    view.drawView();
    isPaused = false;
}
function setMode(mode){
    isPaused = true;
    view = {};
    view = new View(defaultCellSize, mode);
    view.drawView();
    isPaused = false;
}
//Method can parse .lif and state dumps.
function addFromIn(){
  var lin = $('#in').val();
  if(lin.charAt(0) == "{"){
      obj = JSON.parse(lin);
      view.activeCells = obj;
  } else {
      var lines = lin.split(/\r\n|\r|\n/g);
      for(i = 0; i < lines.length; i++){
          if(lines[i].charAt(0) != '#'){
              var coords = lines[i].split(" ");
              view.addCell(parseInt(coords[0]) + 40, parseInt(coords[1])+ 40, 1);
          }
      }
  }
  view.drawView();
}
/*----------------
Internal functions.
----------------*/
function stepModel(){
    if(!isPaused){
        view.stepRoom();
        setTimeout(stepModel, stepTime);
    }
}
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
function ActiveCell(x, y, state){
    this.x = x;
    this.y = y;
    this.state = state;
    this.ns = state;
    this.dc = view.renderAgent.color;
    //see if the cell has been checked for life/death yet.
    this.wc = false;
}
function View(cellSize, mapMode){
    this.mode = mapMode //inf, tor, alive, dead
    this.cellSize = cellSize; //width in pixels
    var bottomMargin = 10; //leave pizxels on the ground
    var leftMargin = 10; //leave room for the controls
    var pageWidth = $("#cwid").val() * cellSize;
    var pageHeight = $("#cwid").val() * cellSize;

    if (this.mode == "inf"){
        //Get the page settings if infinite mode
        pageWidth = $(window).width();
        pageHeight = $(window).height();
        //Set the border of the Window
        $("#main").css("border-width", "0px");
        $("#setWidth").prop("disabled", true);
    } else {
        //Set the border of the Window
        $("#main").css("border-width", "4px");
        $("#setWidth").prop("disabled", false);
    }

    //Figure out how many cells to show on the page
    this.w = Math.floor((pageWidth - leftMargin) / this.cellSize);    //# of cells to show
    this.h = Math.floor((pageHeight - bottomMargin) / this.cellSize); //# of cells to show
    this.activeCells = {};
    this.updatedCells = {};

    this.renderAgent = new RenderAgent(this.h, this.w, cellSize);

    this.getCells = function(){
        return this.activeCells;
    }
    this.drawView = function(){
        this.renderAgent.renderCells(this.activeCells);
    }
    this.updateView = function(){

        //tick the generation
        this.flushStates();
        //console.log(this.updatedCells);
        this.renderAgent.renderCells(this.updatedCells);
        //reset the updated list;
        this.updatedCells = {};
    }
    this.flushStates = function(){
        var keys = Object.keys(this.activeCells);
        for(var i=0;i<keys.length;i++){
            this.activeCells[keys[i]].state = this.activeCells[keys[i]].ns;
            this.activeCells[keys[i]].wc = false;
        }
        //Extra step for discarding items outside map
        if (this.mode == "alive" || this.mode == "dead"){
            for(var i=0;i<keys.length;i++){
                var cell = this.activeCells[keys[i]];
                if(cell.x >= this.w || cell.y >= this.h || cell.x <= -1 || cell.y <= -1){
                    //Not on the view.  KILL IT
                    delete this.activeCells[keys[i]];
                }
            }
        }
    }
    this.tap = function(x, y, canvas){
        var pair = this.renderAgent.getCellByCoords(x, y);
        var row = pair[0];
        var col = pair[1];
        var key = row + "." + col
        if (this.activeCells[key]){
            if (this.activeCells[key].state == 1){
                this.activeCells[key].ns = 2;
            } else {
                this.activeCells[key].ns = 1;
            }
            this.updatedCells[key] = this.activeCells[key];
        } else {
            this.updatedCells[key] = this.addCell(row, col, 1);
        }
        this.updateView();
    }
    this.addCell = function(x, y, state){
        var newCell = new ActiveCell(x, y, state);
        key = x.toString() + "." + y.toString();
        this.activeCells[key] = newCell;
        return newCell;
        //set updatedCell too?
    }
    this.resetCells = function(){
        this.activeCells = {};
        this.renderAgent.clearAll();
    }
    this.randomFill = function(){
        for(var row=0;row<this.w;row++){
            for( var col=0;col<this.h;col++){
                if(Math.random() > .8){
                    this.addCell(row, col, 1);
                }
            }
        }
    }
    this.stepRoom = function(){

        //Pre-step setup
        if (this.mode == "inf"){
            //preprocessor for infininte grid
        } else if (this.mode == "tor"){
            //preprocessor for toroidal grid
        } else if (this.mode == "alive"){
            //preprocessor for "all cells alive outside"
            //Set the outer grid as all ON, allow it to run and the reset it.
            for(i = 0; i <= this.w; i++){
                var j = -1;
                this.addCell(i, j, 1);
            }
            for(i = 0; i <= this.w; i++){
                var j = this.h ;
                this.addCell(i, j, 1);
            }
            for(j = 0; j <= this.h; j++){
                var i = -1;
                this.addCell(i, j, 1);
            }
            for(j = 0; j <= this.h; j++){
                var i = this.w ;
                this.addCell(i, j, 1);
            }
        }
        var keys = Object.keys(this.activeCells);
        for(var i=0;i<keys.length;i++){
            var cell = this.activeCells[keys[i]];

            if(cell.state == 1){ //if the cell is alive check it for changes
                var n = this.getNeighbors(cell);
                var narr = n.neighbors;
                var count = n.count;
                cell.wc = true; //I've now been checked.
                //Decide if the current cell lives or dies.
                if(neighborsToDie.indexOf(count) > -1){
                    //I die.  Change state, add to changed array.
                    cell.ns = 2;
                    cell.dc = this.renderAgent.color;
                    this.updatedCells[keys[i]] = cell;
                }

                for(var j=0;j<narr.length;j++){
                  //set variable for the neighbor
                  var cell2 = narr[j];
                    // only run if this cell has not been checked before
                    if( !narr[j].wc ){
                        //now run logic for every neighbor
                        var n2 = this.getNeighbors(cell2);
                        var count2 = n2.count;
                        //the cell has now been checked.
                        cell2.wc = true;
                        //check if it needs to come alive only if it's dead
                        if(neighborsToComeAlive.indexOf(count2) > -1 && (cell2.state == 0 || cell2.state == 2)){
                            //the cell should come alive
                            var cellRef = this.activeCells[narr[j].x + "." + narr[j].y]
                            cellRef.ns = 1;
                            this.updatedCells[narr[j].x + "." + narr[j].y] = cellRef;
                        }
                    }
                }
            }
        }
        this.updateView();
    }
    this.getNeighbors = function(cell){
        //Returns array of neighbor cells
        var xi = cell.x;
        var yi = cell.y;

        var resp = {}
        resp.neighbors = []
        resp.count = 0;

        for(var i= xi-checkRadius; i<= xi+checkRadius; i++){
             for(var j= yi-checkRadius; j<= yi+checkRadius; j++){
                if(!(i==xi && j==yi)){
                    var neighbor = (this.activeCells[i + "." + j] ? this.activeCells[i + "." + j] : this.addCell(i, j, 0));
                    if(neighbor.state == 1){
                        resp.count++;
                    }
                    resp.neighbors.push(neighbor);
                    //console.log(neighbor);
                }
            }
        }
        return resp;
    }
    this.countNeighbors = function(cell){
        //Returns number of living neighbors
        return [];
    }
    this.generate = function(){
        $('#in').val(JSON.stringify(this.activeCells));
    }
}
//RenderAgent knows about the actual display.
//This could be used for practically anything.
//This is some damn good code.
function RenderAgent(cellsHigh, cellsWide, cellSize){
    //get the canvas
    this.canvas = document.getElementById("main");
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
    this.color = deadColors[0];
    //Variables for framerate
    this.iteration = 0;
    this.framerate = $("#framerate");
    this.lastTime = 0;
    //Give it an array of cells to draw.  This method doesn't clear before drawing
    this.renderCells = function(activeCells){
        //load the context onto the board
        this.context.restore();
        var keys = Object.keys(activeCells);
        //iterate over ALL activeCells
        for(i = 0; i< keys.length; i++){
            var key = keys[i];
            var cell = activeCells[key];
            //check the cell is in the view
            if(cell.x >= this.topleft[0] && cell.y >= this.topleft[1] && cell.x <= this.bottomright[0] && cell.y <= this.bottomright[1]){
                if(activeCells[key].state == 1){
                    this.context.fillStyle = "#000000";
                    var px = this.cellw * (cell.x - this.topleft[0]);
                    var py = this.cellh * (cell.y - this.topleft[1]);
                    this.context.fillRect(px, py, this.cellw, this.cellh);
                } else if (activeCells[key].state == 2){
                    this.context.fillStyle =  cell.dc;
                    var px = this.cellw * (cell.x - this.topleft[0]);
                    var py = this.cellh * (cell.y - this.topleft[1]);
                    this.context.fillRect(px, py, this.cellw, this.cellh);
                }
            } else {
                //what should I do if it isnt in the view?
            }
        }
        //save the context for next time
        this.context.save();
        this.iteration++;
        //Every n iterations, change the state 2 color
        this.color = deadColors[Math.floor(this.iteration / 50) % deadColors.length];
        //Every 5 ticks, update the framerate counter
        if (this.iteration % 5 == 0){
          var now = (new Date).getTime();
          var timeSinceLast = now - this.lastTime
          this.lastTime = now;
          this.framerate.text(Math.floor(5 / (timeSinceLast / 1000)).toString());
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

  var canvas = document.getElementById("main");

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  view.tap(x, y, canvas);
}
window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    //only do this if the view mode is infinite.
    if (view.mode == "inf"){
        if (code === 87 || code === 38) { //up key
            bump('up');
        } else if (code === 65 || code === 37) { //down key
            bump('left');
        }else if (code === 83 || code === 40) { //down key
            bump('down');
        }else if (code === 68 || code === 39) { //down key
            bump('right');
        }else if (code === 32 ){
            pause();
        }
    }
};
