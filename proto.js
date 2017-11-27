var clickX_simple = new Array();
var clickY_simple = new Array();
var clickDrag_simple = new Array();
var paint_simple;
var canvas_simple;
var context_simple;
var canvasWidth = 700;
var canvasHeight = 500;
var colorBlack = "#110101";
var colorRed = "#FF3333";
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var colorOrange = "#FF8300";
var eraser = '#ffffff';

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
	context_simple.fillStyle = "#FBF8F8";
	context_simple.fillRect(0, 0, canvas_simple.canvasWidth, canvas_simple.canvasHeight);

	// Add mouse events
	// ----------------
	canvas_simple.addEventListener("mousedown", function(e)
	{
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

		paint_simple = true;
		addClickSimple(mouseX, mouseY, false);
		redrawSimple();
	});

	canvas_simple.addEventListener("mousemove", function(e){
		if(paint_simple){
			addClickSimple(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
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
	// Add touch event listeners to canvas element
	canvas_simple.addEventListener("touchstart", function(e)
	{
		// Mouse down location
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

		paint_simple = true;
		addClickSimple(mouseX, mouseY, false);
		redrawSimple();
	}, false);
	canvas_simple.addEventListener("touchmove", function(e){

		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

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
