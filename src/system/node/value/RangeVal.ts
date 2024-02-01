import Node, { NodeOptions } from "../Node";
import NumVal, { NumValChangeEvent } from "./NumVal";
import NumExVal from "./NumExVal";
import Event from "../../event/Event";

export interface RangeValOptions extends NodeOptions {
  isMinExtended?: boolean;
  isMaxExtended?: boolean;
  min?: number;
  max?: number;
}

export default class RangeVal extends Node {
  private readonly isMinExtended: boolean;

  private readonly isMaxExtended: boolean;

  min: NumVal;

  max: NumVal;

  constructor(parent: Node, options: RangeValOptions, data: any) {
    super(parent, options, data);

    this.isMinExtended =
      options?.isMinExtended !== null ? options.isMinExtended : false;
    this.isMaxExtended =
      options?.isMaxExtended !== null ? options.isMaxExtended : false;
  }

  onPopulate(data: any, options: RangeValOptions): void {
    this.min = this.isMinExtended
      ? new NumExVal(this, { nodeID: "min", value: options?.min }, data)
      : new NumVal(this, { nodeID: "min", value: options?.min }, data);

    this.max = this.isMaxExtended
      ? new NumExVal(this, { nodeID: "max", value: options?.max }, data)
      : new NumVal(this, { nodeID: "max", value: options?.max }, data);
  }

  onEventBefore(event: Event): boolean {
    if (event.sender == this.min) {
      // prevent min from greater than max
      if ((event as NumValChangeEvent).after > this.max.getValue())
        (event as NumValChangeEvent).after = this.max.getValue();
    } else if (event.sender == this.max) {
      // prevent max from smaller than min
      if ((event as NumValChangeEvent).after <= this.min.getValue()) {
        this.min.eventDisabled = true;
        this.min.setValue(this.max.getValue());
        this.min.eventDisabled = false;
      }
    }

    return false;
  }

  toData() {
    return {
      min: this.min.toData(),
      max: this.max.toData(),
    };
  }
}
