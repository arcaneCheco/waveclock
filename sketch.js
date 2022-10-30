import p5 from "p5";
import { WaveClock } from "./WaveClock";

const sketch = (s) => {
  const waveClock = new WaveClock({ ctx: s });

  s.setup = () => {
    s.createCanvas();

    s.frameRate(60);
    s.smooth();

    s.windowResized();

    waveClock.setup(s);
  };

  s.draw = () => {
    waveClock.draw(s);
  };

  s.windowResized = () => {
    const size = s.min(s.windowWidth, s.windowHeight);

    s.size = size;

    s.resizeCanvas(size, size);

    if (s.windowWidth >= s.windowHeight) {
      s._renderer.position(s.windowWidth / 2 - size / 2, 0);
    } else {
      s._renderer.position(0, s.windowHeight / 2 - size / 2);
    }

    s.strokeWeight(10);
    s.stroke(255);
    s.fill(0);
    s.rect(0, 0, s.size, s.size);
    s.strokeWeight(1);
  };
};

new p5(sketch);
