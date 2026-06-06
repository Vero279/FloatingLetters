// ─── Project B: Floating Letters + Rose Fireworks + Mosaic Background ───

let recognition;
let listening = false;
let letters = [];
let roses = [];
let falling = false;
let lastBurstTime = 0;
let bgBuffer; // off-screen buffer for the mosaic background

function setup() {
  createCanvas(400, 400);
  textSize(14);

  // Generate the light blue mosaic background once
  bgBuffer = createGraphics(400, 400);
  drawMosaicBackground(bgBuffer);

  // Speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const words = e.results[i][0].transcript.trim();
          for (let ch of words) {
            if (ch !== ' ') {
              letters.push(new Letter(ch));
            }
          }
        }
      }
    };

    recognition.onend = () => {
      if (listening && recognition) recognition.start();
    };
  } else {
    console.warn('Speech recognition not supported in this browser.');
  }
}

function draw() {
  // Draw the mosaic background from the buffer
  image(bgBuffer, 0, 0);

  // Update and display letters
  for (let l of letters) {
    l.update();
    l.display();
  }

  // Update and display roses
  for (let r of roses) {
    r.update();
    r.display();
  }

  // ── GUI Buttons ──
  // Mic button
  fill(listening ? color(80, 180, 100) : color(180, 80, 80));
  noStroke();
  rect(10, 10, 110, 36, 6);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(13);
  text(listening ? 'Stop Mic' : 'Start Mic', 65, 28);

  // Drop / Float button
  fill(falling ? color(80, 120, 200) : color(50, 80, 160));
  rect(130, 10, 110, 36, 6);
  fill(255);
  text(falling ? 'Floating' : 'Drop', 185, 28);

  // Clear button
  fill(150);
  rect(250, 10, 110, 36, 6);
  fill(255);
  text('Clear All', 305, 28);
}

function mousePressed() {
  // Mic toggle
  if (mouseX > 10 && mouseX < 120 && mouseY > 10 && mouseY < 46) {
    if (recognition) {
      if (!listening) {
        recognition.start();
        listening = true;
      } else {
        recognition.stop();
        listening = false;
      }
    }
    return;
  }

  // Drop / Float toggle
  if (mouseX > 130 && mouseX < 240 && mouseY > 10 && mouseY < 46) {
    falling = !falling;
    for (let l of letters) l.setFalling(falling);
    for (let r of roses) r.setFalling(falling);
    return;
  }

  // Clear all
  if (mouseX > 250 && mouseX < 360 && mouseY > 10 && mouseY < 46) {
    letters = [];
    roses = [];
    return;
  }

  // ── Click anywhere else → burst of roses ──
  if (roses.length < 300) {
    let burstCount = int(random(10, 18));
    for (let i = 0; i < burstCount; i++) {
      roses.push(new RoseParticle(mouseX, mouseY));
    }
  }
}

function mouseDragged() {
  // Ignore drags that start on buttons
  if (mouseY > 10 && mouseY < 46 && mouseX > 10 && mouseX < 360) {
    return false;
  }
  if (millis() - lastBurstTime > 80 && roses.length < 300) {
    let burstCount = int(random(6, 12));
    for (let i = 0; i < burstCount; i++) {
      roses.push(new RoseParticle(mouseX, mouseY));
    }
    lastBurstTime = millis();
  }
  return false;
}

// ─── Letter class (unchanged) ──────────────────────────────────────────
class Letter {
  constructor(ch) {
    this.ch  = ch;
    this.x   = random(20, width - 20);
    this.y   = random(70, height - 20);
    this.vx  = random(-1, 1);
    this.vy  = random(-1, 1);
    this.col = color(random(50,200), random(50,150), random(150,255));
    this.size = random(14, 28);
    this.falling = false;
    this.grounded = false;
    this.gravity = 0.3;
  }

  setFalling(f) {
    if (!this.grounded) {
      this.falling = f;
      if (!f) {
        this.vy = random(-1, 1);
        this.vx = random(-1, 1);
        this.grounded = false;
      }
    }
  }

  update() {
    if (this.grounded) return;
    if (this.falling) {
      this.vy += this.gravity;
      this.x  += this.vx * 0.3;
      this.y  += this.vy;
      if (this.y >= height - this.size) {
        this.y = height - this.size;
        this.vy *= -0.3;
        this.vx *= 0.8;
        if (abs(this.vy) < 0.5) {
          this.vy = 0;
          this.vx = 0;
          this.grounded = true;
        }
      }
    } else {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 10 || this.x > width - 10)  this.vx *= -1;
      if (this.y < 60 || this.y > height - 10) this.vy *= -1;
    }
  }

  display() {
    fill(this.col);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.size);
    text(this.ch, this.x, this.y);
  }
}

// ─── Rose particle class (floats and falls like letters) ──────────────
class RoseParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1.2, 1.2);
    this.vy = random(-1.2, 1.2);
    this.size = random(10, 22);
    this.rot = random(TWO_PI);
    this.falling = false;
    this.grounded = false;
    this.gravity = 0.28;
    this.alpha = 255;
  }

  setFalling(f) {
    if (!this.grounded) {
      this.falling = f;
      if (!f) {
        this.vy = random(-1.2, 1.2);
        this.vx = random(-1.2, 1.2);
        this.grounded = false;
      }
    }
  }

  update() {
    if (this.grounded) return;
    if (this.falling) {
      this.vy += this.gravity;
      this.x  += this.vx * 0.3;
      this.y  += this.vy;
      if (this.y >= height - this.size * 0.9) {
        this.y = height - this.size * 0.9;
        this.vy *= -0.3;
        this.vx *= 0.8;
        if (abs(this.vy) < 0.5) {
          this.vy = 0;
          this.vx = 0;
          this.grounded = true;
        }
      }
    } else {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 10 || this.x > width - 10)  this.vx *= -1;
      if (this.y < 60 || this.y > height - 10) this.vy *= -1;
    }
    this.rot += 0.02;
  }

  display() {
    drawRose(this.x, this.y, this.size, this.alpha, this.rot);
  }
}

// ─── Draw a rose with 15 petals ──────────────────────────────────────
function drawRose(x, y, sz, alpha, rotation = 0) {
  push();
  translate(x, y);
  rotate(rotation);
  fill(200, 30, 30, alpha);
  noStroke();
  for (let i = 0; i < 15; i++) {
    push();
    rotate(i * TWO_PI / 15);
    ellipse(0, -sz * 0.5, sz * 0.25, sz * 0.7);
    pop();
  }
  fill(180, 0, 0, alpha);
  circle(0, 0, sz * 0.4);
  pop();
}

// ─── Mosaic background generator ──────────────────────────────────────
function drawMosaicBackground(g) {
  const tileSize = 20;
  g.noStroke();
  for (let i = 0; i < g.width; i += tileSize) {
    for (let j = 0; j < g.height; j += tileSize) {
      // light blue tiles with slight variation
      let blue = 200 + random(-20, 20);
      let green = 200 + random(-20, 20);
      let red = 180 + random(-20, 20);
      g.fill(red, green, blue);
      g.rect(i, j, tileSize, tileSize);

      // subtle white grout lines (overlapping edges)
      g.stroke(255, 80);
      g.strokeWeight(0.8);
      g.line(i, j, i + tileSize, j);        // top
      g.line(i, j, i, j + tileSize);        // left
      // noStroke() again for next tile
      g.noStroke();
    }
  }
  // optional: add a few darker accents to simulate ceramic breaks
  for (let k = 0; k < 30; k++) {
    let x = random(g.width);
    let y = random(g.height);
    g.fill(255, 40);
    g.noStroke();
    g.rect(x, y, 5, 5);
  }
}
