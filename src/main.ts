import { CircularMotion } from "./circular-motion";

async function main(): Promise<void> {
  const circularMotion = new CircularMotion("canvas");

  circularMotion.start();
}

main();
