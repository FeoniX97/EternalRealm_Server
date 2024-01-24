import Event from "../../event/Event";
import Node from "../Node";
import Value, { ValueOptions } from "./Value";

export interface NumValOptions extends ValueOptions {
  /** whether this value is integer, default to `false` */
  isInt: boolean;

  /** whether this value allows negative, default to `false` */
  allowNegative: boolean;
}

export default class NumVal extends Value {
  protected value: number;

  /** whether this value is integer, default to `false` */
  private readonly isInt: boolean;

  /** whether this value allows negative, default to `false` */
  private readonly allowNegative: boolean;

  constructor(parent: Node, options: NumValOptions, data: any) {
    super(parent, options, data);

    this.isInt = options.isInt !== null ? options.isInt : false;
    this.allowNegative = options.allowNegative !== null ? options.allowNegative : false;
  }

  setValue(value: number): void {
    if (this.isInt) value = Math.round(value);
    if (!this.allowNegative && value < 0) throw new Error("value does not allow negative: " + this.nodeID);

    let evt = new NumValChangeEvent(this, this.value, value);
    
    if (evt.sendEventBefore()) return;
  
    super.setValue(evt.after);

    evt.sendEventAfter();
  }

  onPopulate(data: any): void {
    this.value = data?.value !== null ? data?.value : 0;
  }
}

export class NumValChangeEvent extends Event {
  readonly before: number;
  after: number;

  constructor(sender: NumVal, before: number, after: number) {
    super(sender);

    this.before = before;
    this.after = after;
  }

  diff() {
    return this.after - this.before;
  }
}