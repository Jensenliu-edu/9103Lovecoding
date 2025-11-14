let video;
let segmenter;
let segmentation;
let bgImg;  
let midImg;
let isModelReady = false;
let timerValue = 0;
let lastTime = 0;
// 一组马丽莲梦露（Warhol 风格）配色
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
  // 加载背景图片（可以换成你自己的路径）
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
      width: 100,    // 宽度
      height: 100    // 高度
    },
    audio: false
  };

  video = createCapture(constraints);
  video.size(100, 100);
  video.hide();

  // 加载 UNet 实时人体分割模型
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
    
    tint(255, 200);  // 透明度控制，可调

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
  // 创建一个更小的临时画布
  let smallGraphics = createGraphics(width / pixelSize, height / pixelSize);
  smallGraphics.noSmooth();

  // 将当前画面缩小绘制到小画布中
  smallGraphics.image(get(), 0, 0, smallGraphics.width, smallGraphics.height);

  // 再把它放大回原尺寸形成像素风
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

// 🟪 控制图片与人物的色调 - Warhol 风格
function applyWarholTint(img, x, y, w, h, color) {
  
  if (!img) return;

  // 获取当前色调
  currentWarholIndex = color;
  let c = warholColors[currentWarholIndex];
   
  // 上色
  tint(c[0], c[1], c[2], 255);
  image(img, x, y, w, h);
  noTint(); 
}
//计时器
function updateTimer() {
  // 每 1000ms 增加一次
  if (millis() - lastTime >= 1000) {
    timerValue = (timerValue + 1) % 10;  // 0~9循环
    lastTime = millis();
  }

  return timerValue;
}