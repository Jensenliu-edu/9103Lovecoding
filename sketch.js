let video;
let segmenter;
let segmentation;
let bgImg;  
let midImg;
let isModelReady = false;
let timerValue = 0;
let lastTime = 0;
// color array
let warholColors = [
  [255, 102, 102], // 粉红
  [102, 255, 204], // 薄荷绿
  [255, 255, 102], // 明黄
  [102, 153, 255], // 天蓝
  [255, 102, 204], // 紫粉
  [255, 153, 51],  // 橘色
  [0, 255, 128],   // 亮青绿 Neon Green
  [255, 0, 128],   // 艳粉 Magenta Pink
  [128, 0, 255],   // 紫罗兰 Vivid Violet
  [255, 128, 0]    // 橘黄 Tangerine Orange
];

let currentWarholIndex = 0;


function preload() {
  // load background img
  bgImg = loadImage('assets/Edvard_Munch_The_Scream.jpeg');
  midImg = loadImage('assets/Edvard_Munch_The_Scream.jpeg');
}

function setup() {

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
  background(255);
  let color = 0;
  


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
  
  
  applyPixelation(5);

  
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