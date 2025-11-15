let video;
let segmenter;
let segmentation;
let bgImg;  
let midImg;
let isModelReady = false;
let timerValue = 0;
let lastTime = 0;
let begintime;
let pixelFont;

// color array
let warholColors = [
  [255, 102, 102], // pink
  [102, 255, 204], // green
  [255, 255, 102], // light yellow
  [102, 153, 255], // light blue
  [255, 102, 204], // purpal
  [255, 153, 51],  // orange
  [0, 255, 128],   // Neon Green
  [255, 0, 128],   // Magenta Pink
  [128, 0, 255],   // Vivid Violet
  [255, 128, 0]    // Tangerine Orange
];



let currentWarholIndex = 0;


function preload() {
  // load background img
  bgImg = loadImage('assets/Edvard_Munch_The_Scream.jpeg');
  midImg = loadImage('assets/Edvard_Munch_The_Scream.jpeg');
  pixelFont = loadFont('assets/Doto_Rounded-ExtraBold.ttf');
}

function setup() {

  startTime = millis();

  createCanvas(1200, 600);
  
  let saveBtn = createButton('💾 Save your scream');
  saveBtn.position(10, 10);
  saveBtn.mousePressed(saveSnapshot);
  

  let constraints = {
    video: {
      width: 100,    // width
      height: 100    // height
    },
    audio: false
  };

  video = createCapture(constraints);
  video.size(100, 100);
  video.hide();

  // load UNet 
  segmenter = ml5.uNet('person', modelReady);
}

function modelReady() {
  console.log('✅ Model loaded!');
  isModelReady = true;
}

function draw() {

let t = floor((millis() - startTime) / 1000);//计时器

  background(255);
  let color = 0;
  
  if(t <= 20){
    drawclean();
  } 
  else if(t <= 40){
    drawclean();
    applyPixelation(5);
  } 
  else if(t <= 60){
    drawclean();
    applyRGBGlitch(map(t, 5, 40, 0, 30)); 
  } 
  else {
    drawFinalCollapse(t);
  }

  //drawTimer(t);

  
  
  
  //applyPixelation(5);

  
}

function applyPixelation(pixelSize) {
  // create a tini canva
  let smallGraphics = createGraphics(width / pixelSize, height / pixelSize);
  smallGraphics.noSmooth();

  // make the graphic small
  smallGraphics.image(get(), 0, 0, smallGraphics.width, smallGraphics.height);

  // resize it
  noSmooth();
  image(smallGraphics, 0, 0, width, height);
  smooth();
}

function gotResult(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  segmentation = result;
}

function saveSnapshot() {
  saveCanvas('myCanvas', 'png');
}

function drawStatusText(posx, posy) {
  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("I Forgot DDL", 120+posx, 100+posy);

}

// 🟪 Control the color tone of the picture and characters - Warhol style
function applyWarholTint(img, x, y, w, h, color) {
  
  if (!img) return;

  // Get the current hue.
  currentWarholIndex = color;
  let c = warholColors[currentWarholIndex];
   
  // color
  tint(c[0], c[1], c[2], 255);
  image(img, x, y, w, h);
  noTint(); 
}
//time
function updateTimer() {
  // 1000ms 
  if (millis() - lastTime >= 1000) {
    timerValue = (timerValue + 1) % 10;  // 0~9
    lastTime = millis();
  }

  return timerValue;
}

function drawclean(){
for(let y = 0; y<2 ; y++){
  for(let i = 0; i<5 ; i++){
  color = y*5+i;
  if (midImg) {
    let posx = i*240;
    let posy = y*300;
    
    tint(255, 200);  // control layers

    applyWarholTint(midImg, posx+5, posy+5, 230, 290, color)
    drawStatusText(posx, posy);
    noTint();
  }
  if (isModelReady) {
    segmenter.segment(video, gotResult);
  }

  if (segmentation) {
    let dcolor = 9-color ;
    //image(segmentation.backgroundMask, i*240,100+y*300, 200, 200);
    applyWarholTint(segmentation.backgroundMask, i*240+5, 100+y*300+5, 200, 190, dcolor)

    
  }
}
}

}

function applyRGBGlitch(intensity) {
  loadPixels();

  let d = pixelDensity();
  let totalPixels = (width * d) * (height * d) * 4;

  for (let i = 0; i < totalPixels; i += 4) {
    
    // original pixel channels
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];

    // glitch shift offsets (based on noise for natural jitter)
    let offsetR = floor(noise(i * 0.0001, frameCount * 0.01) * intensity);
    let offsetG = floor(noise(i * 0.00015, frameCount * 0.01 + 10) * intensity);
    let offsetB = floor(noise(i * 0.0002, frameCount * 0.01 + 20) * intensity);

    let rIndex = i + offsetR * 4;
    let gIndex = i + offsetG * 4;
    let bIndex = i + offsetB * 4;

    // safeguard boundaries
    if (rIndex < totalPixels) pixels[i] = pixels[rIndex];
    if (gIndex < totalPixels) pixels[i + 1] = pixels[gIndex];
    if (bIndex < totalPixels) pixels[i + 2] = pixels[bIndex];
  }

  updatePixels();
}

function drawFinalCollapse(t) {
  background(202, 0, 0);

  let flash = floor(t) % 2 === 0;

  if (flash) {
    textAlign(CENTER, CENTER);
    textFont(pixelFont);
    textSize(120);

    // ---- Glowing Effect ----
    // 多层阴影，越外越透明
    for (let i = 20; i > 0; i -= 4) {
      fill(255, 255, 255, map(i, 20, 0, 10, 255));  
      text("ERROR", width / 2, height / 2);
    }

    // ---- Solid Text on Top ----
    fill(255);
    text("ERROR", width / 2, height / 2);
  }
}