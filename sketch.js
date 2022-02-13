var whole_time = 60; // Whole animation time (can be used for rendering gif)

var rotations = 30;
var fps = 60;
var period = whole_time / rotations;  // Time per 1 rotation
var angular_speed;                    // Angular speed, calculated in setup

var total_frames = fps * whole_time;
var frame = 0;

var Z = 0; // Z index for animation moving through noises

var r = 0;

var cx, cy;

var img;

// Looped 1D Noise
// Made by taking values from 2D perlin Noise in circle pattern
var noise_l = 1;  // Noise circle radius
var noise_a = 0;  // Noise angle
function Noise(arg) {
  return noise(noise_l * cos(noise_a), noise_l * sin(noise_a), arg)
}

function setup() {
  createCanvas(600, 600);
  cx = width / 2;
  cy = height / 2;

  angular_speed = TAU / (period * fps);
}

function draw() {
  background(255);

  translate(cx, cy - 50);

  let r1 = 80;
  let r2 = 150;
  let rotate_speed = 0.01;
  noFill();

  strokeWeight(map(Noise(Z), 0, 1, 9, 17));
  ellipse(
      0, 0, r1 * 2 + map(Noise(Z / 5), 0, 1, -20, 20),
      r1 * 2 + map(Noise(Z / 5), 0, 1, -20, 20));

  strokeWeight(map(Noise(Z), 0, 1, 10, 20));
  ellipse(
      0, 0, r2 * 2 + map(Noise(Z / 5), 0, 1, -20, 20),
      r2 * 2 + map(Noise(Z / 5), 0, 1, -20, 20));

  let n = 8;
  rotate(r);

  stroke(0);
  strokeWeight(1);

  for (let i = 0; i < n; i++) {
    let z = Z + 60 * i;

    push()
    let aa = 0.3;  // angle amplitude

    let amplitude_angle = map(Noise(10 * z + i), 0, 1, -aa, aa);

    rotate(amplitude_angle);  // local amplitude
    strokeWeight(1);

    // [0,1] characteristic of how close current brach to bottom of screen
    let angle = r + (i * TAU) / n + amplitude_angle;
    let bottom_factor = map(dist(cos(angle), sin(angle), 0, 1), 0, 2, 1, 0);

    let x1 = -bottom_factor * 10 + map(Noise(z / 10), 0, 1, 10, 50); // Arrow start
    let x2 = bottom_factor * 90 + map(Noise(z / 10), 0, 1, 150, 200);// Arrow end
    let x3 = (x1 + x2) / 2;                                          // Center between x1 and x2

    // Main line
    {
      let ampl = bottom_factor * 7 + map(Noise(z), 0, 1, 5, 8);
      fill(0);
      beginShape();
        vertex(x1, 0);
        vertex(x3, ampl);
        vertex(x2, ampl - 2);
        vertex(x2, -ampl + 2);
        vertex(x3, -ampl);
      endShape(CLOSE);
    }

    // Arrow head
    {
      let aw = bottom_factor * 20 + map(Noise(z), 0, 1, 10, 20);  // Arrow width
      let al = bottom_factor * 20 + map(Noise(z), 0, 1, 50, 70);

      fill(0);
      beginShape();
        vertex(x2, aw);
        vertex(x2, -aw);
        vertex(x2 + al, 0);
      endShape(CLOSE);
    }

    // Spikes on arrows
    {
      let aw = 10 + bottom_factor * 10;
      let ah = 10 + bottom_factor * 20;
      let as = 50 - bottom_factor * 20;
      beginShape();
        vertex(x2 - as, -aw);
        vertex(x2 - as + ah, 0);
        vertex(x2 - as, aw);
        vertex(x2 - as - ah, 0);
      endShape(CLOSE);
    }
    pop()

    rotate(PI / n);

    // Spikes on outer circle between arrows
    {
      fill(0);
      beginShape();
        vertex(r2 - 30, 0);
        vertex(r2, 5);
        vertex(r2 + 30, 0);
        vertex(r2, -5);
      endShape(CLOSE);
    }
    rotate(PI / n);
  }

  noise_a = map(frame, 0, total_frames, 0, TAU);

  r = (r % TAU) + angular_speed; // Loop angle in [0, TAU] range.

  frame++;
  if (frame > total_frames) {
    noLoop();
  }
}
