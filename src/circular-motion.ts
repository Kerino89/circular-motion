import { isString } from "./helpers/types-guard";
import { clamp } from "./helpers/clamp";

import { Animate } from "./animate";
import { Particle } from "./particle";

export interface CircularMotionDefaultOptions {
  size: number;
  colors: Array<string>;
  offsetCenter: number;
  countParticles: number;
}

const DEFAULT_OPTIONS_CIRCULAR_MOTION: CircularMotionDefaultOptions = {
  size: 250,
  offsetCenter: 50,
  countParticles: 200,
  colors: ["#5CCCCC", "#FFD073", "#FF7373", "#009999", "#FFAA00", "#FF0000"],
};

export class CircularMotion {
  private _animate: Animate;
  private _options: CircularMotionDefaultOptions;
  private _canvasElement: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _particles: Array<Particle>;

  constructor(
    selector: HTMLCanvasElement | string,
    options?: Partial<CircularMotionDefaultOptions>
  ) {
    this._canvasElement = (
      isString(selector) ? document.querySelector(selector) : selector
    ) as HTMLCanvasElement;

    if (!(this._canvasElement instanceof HTMLCanvasElement)) {
      throw new Error("Selector can be a string or HTMLCanvasElement");
    }

    this._ctx = this._canvasElement.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    if (!(this._ctx instanceof CanvasRenderingContext2D)) {
      throw new Error("Failed to get CanvasRenderingContext2D");
    }

    this._options = { ...DEFAULT_OPTIONS_CIRCULAR_MOTION, ...options };
    this._animate = new Animate({ loop: true });
    this._particles = this.createParticles(this._options.countParticles);
    this.updateSizeCanvas();
  }

  public setSize(size: number): void {
    this._options.size = size;

    this.updateSizeCanvas();
  }

  public start(): void {
    const { size } = this._options;

    this._animate.start(() => {
      this._ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      this._ctx.fillRect(0, 0, size, size);

      this._particles.forEach((particle) => {
        const { velocity, radius, color, distanceFromCenter } = particle;

        const lastPoint = { x: particle.x, y: particle.y };

        particle.radians += velocity;
        particle.x = Math.cos(particle.radians) * distanceFromCenter + size / 2;
        particle.y = Math.sin(particle.radians) * distanceFromCenter + size / 2;

        this._ctx.beginPath();
        this._ctx.strokeStyle = color;
        this._ctx.lineWidth = radius;
        this._ctx.moveTo(lastPoint.x, lastPoint.y);
        this._ctx.lineTo(particle.x, particle.y);
        this._ctx.stroke();
        this._ctx.closePath();
      });
    });
  }

  public stop(): void {
    const { size } = this._options;

    this._animate.stop();
    this._ctx.clearRect(0, 0, size, size);
  }

  private createParticles(count: number): Array<Particle> {
    const { size, countParticles, offsetCenter, colors } = this._options;
    const offsetParticle = (size / 2 - offsetCenter) / countParticles;

    return Array.from({ length: count }, (_, index) => {
      const radians = Math.random() * Math.PI * 2;
      const distanceFromCenter = offsetParticle * index + offsetCenter;

      return new Particle({
        radians,
        distanceFromCenter,
        x: Math.cos(radians) * distanceFromCenter + size / 2,
        y: Math.sin(radians) * distanceFromCenter + size / 2,
        radius: Math.random() * 2 + 1,
        color: colors[index % colors.length],
        velocity: clamp(0.02, Math.random() / 10, 0.05),
      });
    });
  }

  private updateSizeCanvas(): void {
    const { size } = this._options;
    const attrs = ["width", "height"];

    const isEqualSize = (size: number): boolean => {
      return attrs.every((attr) => {
        return this._canvasElement.getAttribute(String(attr)) === String(size);
      });
    };

    if (!isEqualSize(size)) {
      attrs.forEach((attr) => {
        this._canvasElement.setAttribute(attr, String(this._options.size));
      });
    }
  }
}
