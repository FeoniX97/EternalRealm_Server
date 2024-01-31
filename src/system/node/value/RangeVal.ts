import Node, { NodeOptions } from "../Node";
import NumVal from "./NumVal";
import NumExVal from "./NumExVal";

export interface RangeValOptions extends NodeOptions {
  isMinExtended?: boolean;
  isMaxExtended?: boolean;
}

export interface RangeValData {
  min?: number;
  max?: number;
}

export default class RangeVal extends Node {
  private readonly isMinExtended: boolean;

  private readonly isMaxExtended: boolean;

  min: NumVal;

  max: NumVal;

  constructor(parent: Node, options: RangeValOptions, data: RangeValData) {
    super(parent, options, data);

    this.isMinExtended = options?.isMinExtended !== null ? options.isMinExtended : false;
    this.isMaxExtended = options?.isMaxExtended !== null ? options.isMaxExtended : false;
  }

  onPopulate(data: RangeValData): void {
    this.min = this.isMinExtended
      ? new NumExVal(this, { nodeID: "min" }, { value: data.min ?? 0 })
      : new NumVal(this, { nodeID: "min" }, { value: data.min ?? 0 });

    this.max = this.isMaxExtended
      ? new NumExVal(this, { nodeID: "max" }, { value: data.max ?? 0 })
      : new NumVal(this, { nodeID: "max" }, { value: data.max ?? 0 });
  }
}