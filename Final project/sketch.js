// === Personal Audio direction ===
// Function: Drive Pixelation intensity and Portrait pulsation with subtle scaling
// Copy breathing using music volume.

// orignal
let bgImg;

// ------- audio -------
let song;
let amp;
let levelSmooth = 0;
let playBtn;

// ------- camera -------
let video;
let segmenter;
let segmentation;
let cameraEnabled = false;
let isModelReady = false;

// -------- text break when drum come in -------
let textShattered = false;
let textShards = [];

// -------- Portrait Fragmentation -------
let personShattered = false;
let personShards = [];

let breakStarted = false;
let breakStartMs = 0;

function preload() {
  bgImg = loadImage("myCanvas.png");
  song = loadSound("Fender Bender - Bad Snacks.wav");
}

function setup() {
  createCanvas(480, 600);

  // save screenshot button
  const saveBtn = createButton("💾 Save your scream");
  saveBtn.position(10, 10);
  saveBtn.mousePressed(saveSnapshot);

  // music button
  playBtn = createButton("▶️ Play / ⏸ Pause");
  playBtn.position(170, 10);
  playBtn.mousePressed(togglePlay);

  // camera button
  const camBtn = createButton("🔴 Enable Camera");
  camBtn.position(315, 10);
  camBtn.mousePressed(enableCamera);

  // amplitude analysis
  amp = new p5.Amplitude();
  amp.smooth(0.9);
  if (song) amp.setInput(song);
}

async function enableCamera() {
  await userStartAudio(); // audio and video permissions

  if (!cameraEnabled) {
    cameraEnabled = true;

    const constraints = {
      video: { width: 100, height: 100 },
      audio: false
    };
    video = createCapture(constraints);
    video.size(100, 100);
    video.hide();

    segmenter = ml5.uNet("person", () => {
      isModelReady = true;
      console.log("Camera Model Loaded!");
    });
  }
}

function draw() {
  // background
  background(bgImg);

  // choose camera use or not
  if (cameraEnabled && isModelReady) {
    segmenter.segment(video, gotResult);
  }

  // Design camera characters
  if (cameraEnabled && segmentation) {
    if (!personShattered) {
      drawPixelatedPerson(levelSmooth);
    } else {
      drawPersonShards();
    }
  }

  // volume
  const raw = amp ? amp.getLevel() : 0;
  levelSmooth = lerp(levelSmooth, constrain(raw * 3.0, 0, 1), 0.15);

  // Determine whether the portrait shattering effect has been triggered
  const personTimeOk  = song && song.isPlaying() && song.currentTime() > 10;
  const personLevelOk = levelSmooth > 0.4;
  if (!personShattered && cameraEnabled && segmentation && (personTimeOk || personLevelOk)) {
    initPersonShards();
    personShattered = true;
  }

  // synchronised to music
  const pixelSize = floor(map(levelSmooth, 0, 1, 2, 12));
  applyPixelation(pixelSize);

  // Pixelated text (jitter + fragmentation)
  drawStatusText(levelSmooth);
}

function drawPixelatedPerson(level) {
  const baseX = 50, baseY = 200, w = 400, h = 400;

  // --------- Audio-driven waveform effects ----------
  const bounceY = level * 30;                        // up and down
  const audioScale = 1 + level * 0.2;                // play with music
  const audioWarpX = sin(frameCount * 0.12) * level * 20;  // Horizontal fluctuation
  const audioWarpY = cos(frameCount * 0.1) * level * 15;   // vertical fluctuation

  // --------- Random jitter ---------
  const jitterStrength = level * 6;  
  const jitterX = random(-jitterStrength, jitterStrength);
  const jitterY = random(-jitterStrength, jitterStrength);

  // ---------- Generate pixel ----------
  const personPixel = 4;
  const pg = createGraphics(w / personPixel, h / personPixel);
  pg.pixelDensity(1);
  pg.noSmooth();
  pg.image(segmentation.backgroundMask, 0, 0, pg.width, pg.height);

  // ---------- draw to the main screen ----------
  noSmooth();
  push();

  // combine effect
  translate(
    baseX + w/2 + jitterX + audioWarpX,
    baseY + h/2 - bounceY + jitterY + audioWarpY
  );

  scale(audioScale);    // audio drvice play

  image(pg, -w/2, -h/2, w, h);
  pop();
  smooth();
}

function easeOutCubic(t){
  return 1 - pow(1 - t, 3);
}

function initPersonShards() {
  const baseX = 50, baseY = 200, w = 400, h = 400;

  const personPixel = 4; 

  const gTex = createGraphics(w / personPixel, h / personPixel);
  gTex.pixelDensity(1);
  gTex.noSmooth();
  gTex.image(segmentation.backgroundMask, 0, 0, gTex.width, gTex.height);

  personShards = [];

  const cols = 18;
  const rows = 12;
  const sw = gTex.width / cols;
  const sh = gTex.height / rows;

  //  used for the direction of outward expansion
  const portraitCX = baseX + w / 2;
  const portraitCY = baseY + h / 2;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const sx = i * sw;
      const sy = j * sh;

      // The initial target rectangle of the fragment
      const dx = baseX + sx * personPixel;
      const dy = baseY + sy * personPixel;
      const dw = sw * personPixel;
      const dh = sh * personPixel;

      // Fragment's own centre 
      const cx = dx + dw / 2;
      const cy = dy + dh / 2;

      let nx = cx - portraitCX;
      let ny = cy - portraitCY;
      const len = max(1, sqrt(nx*nx + ny*ny));
      nx /= len; ny /= len;

      const angle = random(-PI, PI);
      const speed = random(2.5, 6);

      personShards.push({

        g: gTex, sx, sy, sw, sh,
        
        x: cx, y: cy,           
        w: dw, h: dh,           

        nx, ny,

        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(0.2, 1.5),
        ang: 0,
        angVel: random(-0.08, 0.08),
        life: 255
      });
    }
  }

  breakStarted = true;
  breakStartMs = millis();
}

function drawPersonShards() {

  const OPEN_MS = 900;

  const MAX_GAP = 22;


  let t = constrain((millis() - breakStartMs) / OPEN_MS, 0, 1);
  let open = easeOutCubic(t);      
  let gap = MAX_GAP * open;

  for (let s of personShards) {
    if (s.life <= 0) continue;

    push();
    noSmooth();


    let ox = s.nx * gap;
    let oy = s.ny * gap;

    if (open > 0.4) {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.25;        
      s.vx *= 0.985;       
      s.vy *= 0.985;
      s.ang += s.angVel;
      s.life -= 2.5;      
    }

    // Rotate around the centre of the fragment
    translate(s.x + ox, s.y + oy);
    rotate(s.ang);

    image(
      s.g,
      s.sx, s.sy, s.sw, s.sh,
      -s.w / 2, -s.h / 2, s.w, s.h
    );

    // highlight line to the edges of the crack 
    stroke(255, 180); noFill(); rect(-s.w/2, -s.h/2, s.w, s.h);

    pop();
  }
}

function applyPixelation(pixelSize) {
  const sg = createGraphics(width / pixelSize, height / pixelSize);
  sg.pixelDensity(1);
  sg.noSmooth();
  sg.image(get(), 0, 0, sg.width, sg.height);
  noSmooth();
  image(sg, 0, 0, width, height);
  smooth();
}

function gotResult(err, result) {
  if (err) return;
  segmentation = result;
}

function drawStatusText(level) {
  if (textShattered) {
    drawShatteredText();
    return;
  }

  // The small canvas before text pixelation
  const texW = 200;
  const texH = 60;

  let g = createGraphics(texW, texH);
  g.pixelDensity(1);
  g.noSmooth();

  // Automatic colour sampling 
  const sampleX = bgImg.width  * 0.6;
  const sampleY = bgImg.height * 0.28;
  const baseC   = bgImg.get(sampleX, sampleY);

  let r0 = red(baseC);
  let g0 = green(baseC);
  let b0 = blue(baseC);

  const warmTarget = color(255, 190, 140);
  const mixAmt = 0.4;
  const mixC = lerpColor(color(r0, g0, b0), warmTarget, mixAmt);

  const rr = red(mixC);
  const gg = green(mixC);
  const bb = blue(mixC);

  // Jitter & Size Variation
  const baseSize = map(level, 0, 1, 25, 55);
  const jitterY = random(-level * 5, level * 5);

  g.background(0, 0);
  g.fill(rr, gg, bb);
  g.noStroke();
  g.textAlign(CENTER, CENTER);
  g.textSize(baseSize);
  g.text("I forgot ddl", texW / 2, texH / 2);

  const scaleFactor = 3.2;
  const drawW = texW * scaleFactor;
  const drawH = texH * scaleFactor;

  const x = width / 2 - drawW / 2;
  const y = height * 1/4 - drawH / 2 + jitterY;

  noSmooth();
  image(g, x, y, drawW, drawH);
  smooth();

  // Copy Fragmentation Trigger 
  const timeOk = song && song.isPlaying() && song.currentTime() > 12; 
  const levelOk = level > 0.5;

  if (!textShattered && (timeOk || levelOk)) {
    initTextShards(g, x, y, scaleFactor);
    textShattered = true;
  }
}

function initTextShards(gTex, x, y, scaleFactor) {
  textShards = [];
  const cols = 24, rows = 16;
  const sw = gTex.width / cols;
  const sh = gTex.height / rows;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const sx = i * sw;
      const sy = j * sh;

      const dx = x + sx * scaleFactor;
      const dy = y + sy * scaleFactor;

      const angle = random(-PI, PI);
      const speed = random(3, 8);

      textShards.push({
        g: gTex,
        sx, sy, sw, sh,
        x: dx,
        y: dy,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(0.5, 2),
        life: 255
      });
    }
  }
}

function drawShatteredText() {
  for (let s of textShards) {
    if (s.life <= 0) continue;

    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.25;
    s.vx *= 0.98;
    s.vy *= 0.98;
    s.life -= 3.5;

    push();
    tint(255, s.life);
    noSmooth();
    image(
      s.g,
      s.sx, s.sy, s.sw, s.sh,
      s.x, s.y, s.sw * 3.2, s.sh * 3.2
    );
    pop();
  }
}

/* ============= save your own scream ============= */
function saveSnapshot() {
  saveCanvas("myCanvas_output", "png");
}

/* ============= play/pause ============= */
async function togglePlay() {
  await userStartAudio();
  if (!song) return;

  if (!song.isPlaying()) {
    song.loop();
    song.setVolume(0.9);
  } else song.pause();
}