import Node from "../Node";
import Value, { ValChangeEvent, ValData, ValueOptions } from "./Value";

export interface NumValOptions extends ValueOptions {
  /** whether this value is integer, default to `false` */
  isInt?: boolean;

  /** whether this value allows negative, default to `false` */
  allowNegative?: boolean;
}

export interface NumValData extends ValData {
  value?: number;
}

export default class NumVal extends Value {
  protected value: number;

  /** whether this value is integer, default to `false` */
  protected readonly isInt: boolean;

  /** whether this value allows negative, default to `false` */
  protected readonly allowNegative: boolean;

  constructor(parent: Node, options: NumValOptions, data: NumValData) {
    super(parent, options, data);

    this.isInt = options.isInt !== null ? options.isInt : false;
    this.allowNegative = options.allowNegative !== null ? options.allowNegative : false;
  }

  setValue(value: number): void {
    if (this.isInt) value = Math.round(value);
    if (!this.allowNegative && value < 0) value = 0;

    let evt = new NumValChangeEvent(this, this.value, value);

    if (evt.sendEventBefore()) return;

    super.setValue(evt.after);

    evt.sendEventAfter();
  }

  getValue(): number {
    return this.value;
  }

  onPopulate(data: NumValData): void {
    this.value = data?.value !== null ? data?.value : 0;
  }
}

export class NumValChangeEvent extends ValChangeEvent {
  readonly before: number;
  after: number;

  constructor(sender: NumVal, before: number, after: number) {
    super(sender, before, after);
  }

  diff() {
    return this.after - this.before;
  }
}