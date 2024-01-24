import Node, { NodeOptions } from "./Node";
import { Clock } from "colyseus";

export interface RootOptions extends NodeOptions {
  /** the room clock of Colyseus */
  clock?: Clock;
}

export default abstract class Root extends Node {
  protected root: Root;

  /** the room clock of Colyseus */
  private clock?: Clock;

  constructor(parent: Node, options: RootOptions, data: any) {
    super(parent, options, data);

    this.clock = options.clock;
  }

  getClock() {
    return this.clock;
  }
}
