var clickX_simple = new Array();
var clickY_simple = new Array();
var strokex = new Array();
var strokey = new Array();
var removeX = new Array();
var removeY = new Array();
var clickDrag_simple = new Array();
var paint_simple;
var canvas_simple;
var context_simple;
var canvasWidth = 700;
var canvasHeight = 500;
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var colorBlue = "#0000FF";
var colorRed = "#FF0000";
var colorBlack = "#000000";
var eraser = '#ffffff';

var undoLog = 0;
var redoLog = 0;

var curColor_simpleColors = colorPurple;
var clickColor = new Array();

var clickSize = new Array();
var curSize = "normal";

var clickTool = new Array();
var curTool = "color";
/**
* Creates a canvas element.
*/
function prepareSimpleCanvas()
{

	savedImages= [];
	removedImages= [];
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('protoCanvas');
	canvas_simple = document.createElement('canvas');
	canvas_simple.setAttribute('width', canvasWidth);
	canvas_simple.setAttribute('height', canvasHeight);
	canvas_simple.setAttribute('id', 'canvasSimple');
	canvasDiv.appendChild(canvas_simple);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas_simple = G_vmlCanvasManager.initElement(canvas_simple);
	}
	context_simple = canvas_simple.getContext("2d");


	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
  			x: evt.clientX - rect.left,
  			y: evt.clientY - rect.top
		};
	}
	// Add mouse events
	// ----------------
	canvas_simple.addEventListener("mousedown", function(e)
	{
		var pos = getMousePos(canvasDiv,e)
		// Mouse down location
		var mouseX = pos.x - this.offsetLeft;
		var mouseY = pos.y - this.offsetTop;
		strokex = [];
		strokey = [];
		paint_simple = true;
		addClickSimple(mouseX, mouseY, false);
		saveStroke(mouseX,mouseY);
		redrawSimple();
	});

	canvas_simple.addEventListener("mousemove", function(e){
		var pos = getMousePos(canvasDiv,e)
		if(paint_simple){
			addClickSimple(pos.x - this.offsetLeft, pos.y - this.offsetTop, true);
			saveStroke(pos.x - this.offsetLeft, pos.y - this.offsetTop);
			redrawSimple();
		}
	});

	canvas_simple.addEventListener("mouseup", function(){
		paint_simple = false;
	  	redrawSimple();
	});

	canvas_simple.addEventListener("mouseleave", function(){
		paint_simple = false;
	});

	clear_canvas_simple.addEventListener("mousedown", function()
	{
		clickX_simple = new Array();
		clickY_simple = new Array();
		clickDrag_simple = new Array();
		clickColor = new Array();
		clearCanvas_simple();
	});
    
	//choose colors
	grabOrange.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorOrange;
	});
	grabBlack.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorBlack;
	});
	grabRed.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorRed;
	});
	grabPurple.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorPurple;
	});
	grabGreen.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorGreen;
	});
	grabYellow.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorYellow;
	});
	grabBrown.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorBrown;
	});
	//add Eraser
	clickEraser.addEventListener("mousedown", function(e){
		curColor_simpleColors = eraser;
	});
	//choose colors
	pickSmall.addEventListener("mousedown", function(e){
		curSize = "small";
	});
	pickMedium.addEventListener("mousedown", function(e){
		curSize = "normal";
	});
	pickLarge.addEventListener("mousedown", function(e){
		curSize = "large";
	});
	//undo and redo events
	redoButton.addEventListener("mousedown", function(e){
		redo();

	});
	undoButton.addEventListener("mousedown", function(){
		undo();
		console.log("undo");
	});
	// Add touch event listeners to canvas element
	canvas_simple.addEventListener("touchstart", function(e)
	{
		var pos = getMousePos(canvasDiv,e);
		// Mouse down location
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : pos.x) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : pos.y) - this.offsetTop;

		paint_simple = true;
		addClickSimple(mouseX, mouseY, false);
		redrawSimple();
	}, false);
	canvas_simple.addEventListener("touchmove", function(e){
		var pos = getMousePos(canvasDiv,e);
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : pos.x) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : pos.y) - this.offsetTop;

		if(paint_simple){
			addClickSimple(mouseX, mouseY, true);
			redrawSimple();
		}
		e.preventDefault()
	}, false);
	canvas_simple.addEventListener("touchend", function(e){
		paint_simple = false;
	  	redrawSimple();
	}, false);
	canvas_simple.addEventListener("touchcancel", function(e){
		paint_simple = false;
	}, false);
}



    function saveImage() {
		//save the canvas image to undo array
          var imgSrc = canvas_simple.toDataURL("image/png");
          savedImages.push(imgSrc);
          //undoButton.enable();
    }
    function undo() {
		console.log('Undo CANVAS button clicked!');
		undoLog=1;
		redoLog=0;
          //save the current canvas in redo array
          this.removeStrokes();
          redrawSimple();


    }
    function redo() {
		console.log('Redo CANVAS button clicked!');
		redoLog=1;
		undoLog=0;
          //save the current canvas in undo array
          this.surrateStroke();
          //redraw the canvas

		  redrawSimple();

    }
    function removeImage() {
		//save the canvas image to redo array

          var imgSrc = canvas_simple.toDataURL("image/png");
          removedImages.push(imgSrc);
          //redoButton.enable();
    }
	function removeStrokes() {
		//save the canvas image to redo array
		removeX=[];
		removeY=[];
		removeX=strokex;
		removeY=strokey;


          var imgSrc = canvas_simple.toDataURL("image/png");
          removedImages.push(imgSrc);
          //redoButton.enable();
    }
	function surrateStroke(){
		for (var i=0; i<removeX.length;i++){
			addClickSimple(removeX[i],removeY[i],true)
		}
		strokex.push(removeX);
		strokey.push(removeY);
	}


function saveStroke(x,y){
	strokex.push(x);
	strokey.push(y);

}
function addClickSimple(x, y, dragging)
{
	clickX_simple.push(x);
	clickY_simple.push(y);
	clickDrag_simple.push(dragging);
	clickColor.push(curColor_simpleColors);
	clickSize.push(curSize);
}

function clearCanvas_simple()
{
	context_simple.clearRect(0, 0, canvasWidth, canvasHeight);
}

function redrawSimple()
{
	clearCanvas_simple();
	if(undoLog == 1){
		for(var i=0; i < clickX_simple.length; i++){
			//if(clickDrag_simple[i] && i){
				for(var k=0; k < strokex.length; k++){
					if(clickX_simple[i] == strokex[k] && clickY_simple[i] == strokey[k] ){
						delete clickX_simple[i];
						delete clickY_simple[i];
					}
				}
			//}
		}
		undoLog = 0;
	}
	var radius;
	//context_simple.strokeStyle = "#df4b26";
	context_simple.lineJoin = "round";
	//context_simple.lineWidth = radius;

	for(var i=0; i < clickX_simple.length; i++)
	{
		if(clickSize[i] == "small"){
			radius = 2;
		}else if(clickSize[i] == "normal"){
			radius = 5;
		}else if(clickSize[i] == "large"){
			radius = 15;
		}
		context_simple.beginPath();
		if(clickDrag_simple[i] && i){
			context_simple.moveTo(clickX_simple[i-1], clickY_simple[i-1]);
		}else{
			context_simple.moveTo(clickX_simple[i]-1, clickY_simple[i]);
		}
		context_simple.lineTo(clickX_simple[i], clickY_simple[i]);
		context_simple.closePath();
		context_simple.lineWidth = radius;
		context_simple.strokeStyle = clickColor[i];
		context_simple.stroke();
	}
}