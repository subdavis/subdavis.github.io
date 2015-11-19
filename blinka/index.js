function Typer(string, timing, element, endcursor, blink, callback){
  this.string = string;
  this.timing = timing; //# of MS to wait between stuff.
  this.callback = callback; //call this function when you're done.
  this.elem = element; //HTML DOM ID to write to.
  this.endcursor = endcursor;
  this.blink = blink;
  this.blinkSpeed = 250;
  this.blinkCount = 4;
  this.blinkState = false;

  this.write = function(ob, i){
    set(ob, i);
    if (i < ob.string.length){
      setTimeout( function(){
        ob.write(ob, ++i)
      } , this.timing);
    } else {
      if (this.blink){
        blink(this, 0);
      } else {
        ob.callback();
      }
    }
    return true;
  }

  function set(ob, i){
    var out = ob.string.substring(0, i);
    out += ("" + String.fromCharCode(9608));
    document.getElementById(ob.elem).innerText = out;
  }

  function blink(obj, count){
    if (count < obj.blinkCount){
      if (obj.blinkState == true){
        obj.blinkState = false;
        document.getElementById(obj.elem).innerText = obj.string;
      } else {
        obj.blinkState = true;
        document.getElementById(obj.elem).innerText = obj.string + (" " + String.fromCharCode(9608));
      }
      setTimeout(function(){blink(obj, ++count);}, obj.blinkSpeed);
    } else {
      if (obj.endcursor){
        document.getElementById(obj.elem).innerText = obj.string + (" " + String.fromCharCode(9608));
      }
      obj.callback();
    }
  }
  var b = this.write(this, 0);
};


window.onload = function(){
  var t = new Typer("Oh, hello there!", 55, "line1", false, true, function(){
    Typer("I'm Brandon.", 55, "line2", false, true, function(){
    Typer("Computer Science student at UNC Chapel Hill", 55, "line3", false, true, function(){
    Typer("Minecrafter and former operator of Redspin MC", 55, "line4", false, true, function(){
    Typer("Raspberry pi and Linux Enthusiast", 55, "line5", false, true, function(){
    Typer("Pythonista", 55, "line6", false, true, function(){
    Typer("Writer of odd Javascript text libraries", 55, "line7", false, true, function(){
    Typer("$~>", 55, "line8", true, true, function(){
      console.log("done");
    });
    });
    });
    });
    });
    });
    });
    });
};
