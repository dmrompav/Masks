let outputWidth,
	outputHeight,

	faceTracker,
	videoInput,

	imgMask,
	imgFace,

	selected = -1;

// ================================
function preload() {
	imgMask = loadImage('masks-imgs/shrek.png');
	imgFace = loadImage('masks-imgs/emoji.min.png');
}



function setup() {
	const maxWidth = Math.min(windowWidth, windowHeight);
	pixelDensity(1);
	outputHeight = maxWidth * 0.75;
	outputWidth = maxWidth;

	createCanvas(outputWidth, outputHeight);

	videoInput = createCapture(VIDEO);
	videoInput.size(outputWidth, outputHeight);
	videoInput.hide();

	const sel = createSelect();
	const selectList = ['Shrek', 'Emoji'];
	sel.option('Select filter', -1);
	for (let i = 0; i < selectList.length; i++) {
		sel.option(selectList[i], i);
	}
	sel.changed(applyFilter);											//*

	faceTracker = new clm.tracker();
	faceTracker.init();
	faceTracker.start(videoInput.elt);
}
//*-----
function applyFilter() {
	selected = this.selected();
}
//*-----


//!DRAW  ------------------------------------
function draw() {
	image(videoInput, 0, 0, outputWidth, outputHeight);

	switch (selected) {
		case '-1'	: break;
		case '0'	: drawMask(); break;
		case '1'	: drawFace(); break;
	}
}



//DRAW FACE AND MASK ------------------------------------
function drawMask() {
	const positions = faceTracker.getCurrentPosition();
	if (positions !== false) {
		push();
		const wx = Math.abs(positions[13][0] - positions[1][0]) * 2;
		const wy = Math.abs(positions[7][0] - Math.min(positions[16][0], positions[20][1])) * 3;
		translate(-wx/2, -wy/2);
		image(imgMask, positions[62][0], positions[62][1], wx, wy);
		pop();
	}
}
function drawFace() {
	const positions = faceTracker.getCurrentPosition();
	if (positions !== false) {
		push();
		const wx = Math.abs(positions[13][0] - positions[1][0]) * 1.5;
		const wy = Math.abs(positions[7][0] - Math.min(positions[16][0], positions[20][1])) * 2.5;
		translate(-wx/2, -wy/2);
		image(imgFace, positions[62][0], positions[62][1], wx, wy);
		pop();
	}
}



//RESIZE ------------------------------------------
function windowResized() {
	const maxWidth = Math.min(windowWidth, windowHeight);
	pixelDensity(1);
	outputHeight = maxWidth * 0.75;
	outputWidth = maxWidth;
	resizeCanvas(outputWidth, outputHeight);
}