import { Pane } from "tweakpane";

export class WaveClock {
  constructor({ ctx, seed }) {
    this.debug = new Pane();
    this.debug.containerElem_.style.zIndex = 1;
    window.addEventListener("keypress", (e) => {
      if (e.code === "Space") {
        if (this.debug.containerElem_.style.display === "none") {
          this.debug.containerElem_.style.display = "";
        } else {
          this.debug.containerElem_.style.display = "none";
        }
      } else if (e.code === "KeyC") {
        ctx.saveCanvas(ctx._renderer, "capture", "png");
      }
    });
    this.settings = {
      noiseSeed: seed || {
        angle: ctx.random(10),
        radius: ctx.random(10),
        centerX: ctx.random(10),
        centerY: ctx.random(10),
      },
      noiseDelta: {
        angle: 0.005,
        radius: 0.005,
        centerX: 0.01,
        centerY: 0.01,
      },
      noiseAmplitude: {
        angle: 6,
        centerX: 0.2,
        centerY: 0.2,
      },
    };

    this.debug.addButton({ title: "capture" }).on("click", () => {
      ctx.saveCanvas(ctx._renderer, "myCanvas", "png");
    });

    const deltaDebug = this.debug.addFolder({ title: "offset randomness" });
    deltaDebug.addInput(this.settings.noiseDelta, "angle", {
      min: 0,
      max: 0.02,
      step: 0.0001,
    });
    deltaDebug.addInput(this.settings.noiseDelta, "radius", {
      min: 0,
      max: 0.02,
      step: 0.0001,
    });
    deltaDebug.addInput(this.settings.noiseDelta, "centerX", {
      min: 0,
      max: 0.05,
      step: 0.0001,
    });
    deltaDebug.addInput(this.settings.noiseDelta, "centerY", {
      min: 0,
      max: 0.05,
      step: 0.0001,
    });

    const ampDebug = this.debug.addFolder({ title: "offset delta" });
    ampDebug.addInput(this.settings.noiseAmplitude, "angle", {
      min: 0,
      max: 20,
      step: 1,
    });
    ampDebug.addInput(this.settings.noiseAmplitude, "centerX", {
      min: 0,
      max: 1,
      step: 0.001,
    });
    ampDebug.addInput(this.settings.noiseAmplitude, "centerY", {
      min: 0,
      max: 1,
      step: 0.001,
    });
  }

  setup(ctx) {
    this._angnoise = this.settings.noiseSeed.angle;
    this._radiusnoise = this.settings.noiseSeed.radius;
    this._xnoise = this.settings.noiseSeed.centerX;
    this._ynoise = this.settings.noiseSeed.centerY;
    this._radius = 0;
    this._angle = -ctx.PI / 2;
    this._strokeCol = 254;
    this._strokeChange = -1;
    this.center = ctx.size / 2;

    const seedDebug = this.debug.addFolder({ title: "offsets" });
    seedDebug.addInput(this, "_angnoise", {
      min: 0,
      max: 10,
      step: 0.001,
      label: "angle",
    });
    seedDebug.addInput(this, "_radiusnoise", {
      min: 0,
      max: 10,
      step: 0.001,
      label: "radius",
    });
    seedDebug.addInput(this, "_xnoise", {
      min: 0,
      max: 10,
      step: 0.001,
      label: "centerX",
    });
    seedDebug.addInput(this, "_ynoise", {
      min: 0,
      max: 10,
      step: 0.001,
      label: "centerY",
    });
    this.debug.addButton({ title: "redraw" }).on("click", () => {
      ctx.clear();
      ctx.strokeWeight(10);
      ctx.stroke(255);
      ctx.rect(0, 0, ctx.size, ctx.size);
      ctx.strokeWeight(1);
    });
  }

  draw(ctx) {
    this._radiusnoise += this.settings.noiseDelta.radius;
    this._radius = ctx.noise(this._radiusnoise) * ctx.size * 0.4;

    this._angnoise += this.settings.noiseDelta.angle;
    this._angle +=
      this.settings.noiseAmplitude.angle * (ctx.noise(this._angnoise) - 0.5);

    if (this._angle > 360) this._angle -= 360;
    if (this._angle < 0) this._angle += 360;

    this._xnoise += this.settings.noiseDelta.centerX;
    this._ynoise += this.settings.noiseDelta.centerY;

    let centerX =
      this.center +
      this.settings.noiseAmplitude.centerX *
        ctx.size *
        (ctx.noise(this._xnoise) - 0.5);
    let centerY =
      this.center +
      this.settings.noiseAmplitude.centerY *
        ctx.size *
        (ctx.noise(this._ynoise) - 0.5);

    let rad = ctx.radians(this._angle);
    let x1 = centerX + this._radius * ctx.cos(rad);
    let y1 = centerY + this._radius * ctx.sin(rad);

    let oppRad = rad + ctx.PI;
    let x2 = centerX + this._radius * ctx.cos(oppRad);
    let y2 = centerY + this._radius * ctx.sin(oppRad);

    this._strokeCol += this._strokeChange;
    if (this._strokeCol > 254) {
      this._strokeChange = -1;
    }
    if (this._strokeCol < 0) {
      this._strokeChange = 1;
    }

    ctx.stroke(this._strokeCol, 150);
    // ctx.stroke(this._strokeCol);
    ctx.strokeWeight(2);

    ctx.line(x1, y1, x2, y2);
  }
}
