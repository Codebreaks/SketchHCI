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
var canvasWidth = 1200;
var canvasHeight = 500;
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var colorBlue = "#0000FF";
var colorRed = "#FF0000";
var colorBlack = "#000000";
var eraser = '#ffffff';

var restore = [];

var undoLog = 0;
var redoLog = 0;
var replaceStroke =0;
var curColor_simpleColors = colorPurple;
var clickColor = new Array();

var clickSize = new Array();
var curSize = "normal";

var clickTool = new Array();
var curTool = "color";

var canvasSketches = new node();
var rCanvasSketches = new node();

/**
* Creates a canvas element.
*/
function prepareSimpleCanvas()
{

	savedImages= [];
	removedImages= [];
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasSimpleDiv');
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

	var recMouseDown = false;
	var recMouseLeave = false;
	canvas_simple.addEventListener("mousedown", function(e)
	{
		var pos = getMousePos(canvasDiv,e)
		// Mouse down location
		recMouseDown = true;
		recMouseLeave=false;
		var mouseX = pos.x - this.offsetLeft;
		var mouseY = pos.y - this.offsetTop;
		strokex = [];
		strokey = [];

		paint_simple = true;
		var startSketch = [];
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
		recMouseDown = false;
	  	redrawSimple();
		if(recMouseLeave){

		}else{
			saveWholeStroke();
		}

	});

	canvas_simple.addEventListener("mouseleave", function(){
		paint_simple = false;
		recMouseLeave = true;
		if(recMouseDown){
			saveWholeStroke();
		}
	});

	clear_canvas_simple.addEventListener("mousedown", function(){
		clickX_simple = new Array();
		clickY_simple = new Array();
		clickDrag_simple = new Array();
		clickColor = new Array();
		clearCanvas_simple();
	});
    // this is an example of jquery
	$('.preview').click(function(e) { // preview click
        // fade to toggle just slowly open or close the extra pop up screen
        $('.colorWheel').fadeToggle("slow", "linear");
        //bCanPreview = true;
    });

	function downloadCanvas(link, canvasId, filename) {
    	var can = document.getElementById(canvasId)
		link.href= can.toDataURL("image/png");
    	link.download = filename;
	}
	$('.pickSize').click(function(e) { // preview click
        // fade to toggle just slowly open or close the extra pop up screen
        $('.sizes').fadeToggle("slow", "linear");
        //bCanPreview = true;
    });
	//save Button
	save.addEventListener('click', function() {
    	downloadCanvas(this, 'canvasSimpleDiv', 'test.png');
	}, false);

	//choose colors
	grabPurple.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorPurple;
		$('.colorWheel').fadeToggle("slow", "linear");
	});
	grabGreen.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorGreen;
		$('.colorWheel').fadeToggle("slow", "linear");
	});
	grabYellow.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorYellow;
		$('.colorWheel').fadeToggle("slow", "linear");
	});
	grabBrown.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorBrown;
		$('.colorWheel').fadeToggle("slow", "linear");
	});
	grabBlue.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorBlue;
		$('.colorWheel').fadeToggle("slow", "linear");
	});
	grabRed.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorRed;
		$('.colorWheel').fadeToggle("slow", "linear");
	});
	grabBlack.addEventListener("mousedown", function(e){
		curColor_simpleColors = colorBlack;
		$('.colorWheel').fadeToggle("slow", "linear");
	});
	//add Eraser
	clickEraser.addEventListener("mousedown", function(e){
		curColor_simpleColors = eraser;
	});
	//choose colors
	pickSmall.addEventListener("mousedown", function(e){
		curSize = "small";
			$('.sizes').fadeToggle("slow", "linear");
	});
	pickMedium.addEventListener("mousedown", function(e){
		curSize = "normal";
			$('.sizes').fadeToggle("slow", "linear");
	});
	pickLarge.addEventListener("mousedown", function(e){
		curSize = "large";
			$('.sizes').fadeToggle("slow", "linear");
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
	canvas_simple.addEventListener("touchstart", function(e){
		var pos = getMousePos(canvasDiv,e);
		// Mouse down location
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : pos.x) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : pos.y) - this.offsetTop;
		restore = [];
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


function node(){
	this.list = [];
	this.Top = 0;
}
function sNode(){
	this.x = [];
	this.y = [];
}
function saveImage() {
	//save the canvas image to undo array
      var imgSrc = canvas_simple.toDataURL("image/png");
      savedImages.push(imgSrc);
      //undoButton.enable();
}
var redoRenew;
var undoRenew;
function undo() {
	console.log('Undo CANVAS button clicked!');
	undoLog=1;
	redoLog=0;
	redoRenew =1;
	replaceStroke =1;

	if(undoRenew == 1){
		canvasSketches.Top = canvasSketches.list.length;
		undoRenew = 0;
	}

	//gray out undo button unreachable
	// if(canvasSketches.Top <0){
	// 	$("#undoButton").addClass("disabledbutton");
	// }
	//push the Latest sketch List to another object
	rCanvasSketches.list.push(canvasSketches.list[canvasSketches.Top-1]);


	//make redo button avaliable

		//$("#undoButton").addClass("disabledbutton");



	//redraw
	redrawSimple();


	//pop then delete the latest sketch list --top
  	delete canvasSketches.list[canvasSketches.Top -1];
	//renew top
  	canvasSketches.Top = canvasSketches.list.length-1;
  	canvasSketches.list = clean(canvasSketches);

}
function redo() {
	console.log('Redo CANVAS button clicked!');
	redoLog=1;
	undoLog=0;
	undoRenew = 1;
	replaceStroke = 1;

	//one time renewal of Top
	if(redoRenew == 1){
		rCanvasSketches.Top = rCanvasSketches.list.length;
		redoRenew = 0;
	}
	//delete last element in list[top].x
	butterFilt = rCanvasSketches.list[rCanvasSketches.Top-1];
	delete butterFilt.x[butterFilt.x.length-1];
	delete butterFilt.x[butterFilt.x.length-1];
	//push the earliest sketch list
	canvasSketches.list.push(rCanvasSketches.list[rCanvasSketches.Top-1]);
    //save the current canvas in undo array
    surrateStroke(rCanvasSketches.list[rCanvasSketches.Top-1]);
    //redraw the canvas
	redrawSimple();

	//pop then delete the latest sketch list --top
   	delete rCanvasSketches.list[rCanvasSketches.Top -1];
	//renew top
  	rCanvasSketches.Top = rCanvasSketches.list.length-1;
  	rCanvasSketches.list = clean(rCanvasSketches);


}
function clean(list){
	newList = [];
	for(k = 0; k<list.Top;k++){
		if(list.list[k] == null){

		}
		else{
			newList.push(list.list[k]);
		}
	}
	return newList;
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
function surrateStroke(list){
	for (var i=0; i<list.x.length;i++){
		addClickSimple(list.x[i],list.y[i],true)
	}
	// strokex.push(removeX);
	// strokey.push(removeY);
}


function saveStroke(x,y){
	strokex.push(x);
	strokey.push(y);

}
function saveWholeStroke(){
	if(replaceStroke == 1){
		canvasSketches.list = [];
		rCanvasSketches.list = [];
	}
	var strokes = new sNode();
	var x = [];
	var y = [];
	x=strokex;
	y=strokey;
	for(k=0;k<strokex.length;k++){
		strokes.x.push(strokex[k]);
		strokes.y.push(strokey[k]);
	}

	canvasSketches.list.push(strokes);
	canvasSketches.Top = canvasSketches.list.length;
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
	if(undoLog >= 1){
		for(var i=0; i < clickX_simple.length; i++){
			if(canvasSketches.Top-1 >= 0){

					sampleSketch = canvasSketches.list[canvasSketches.Top-1];
					for(var inc =0; inc < sampleSketch.x.length; inc++){
						if(clickX_simple[i] == sampleSketch.x[inc] && clickY_simple[i] == sampleSketch.y[inc] ){
							delete clickX_simple[i];
							delete clickY_simple[i];
					}

				}

			}
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
