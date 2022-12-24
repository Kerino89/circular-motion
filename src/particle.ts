export class Particle {
  public velocity!: number;
  public radians!: number;
  public x!: number;
  public y!: number;
  public radius!: number;
  public color!: string;
  public distanceFromCenter!: number;

  constructor(particle: Particle) {
    Object.assign(this, particle);
  }
}
