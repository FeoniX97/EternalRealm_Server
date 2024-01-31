import Event from "../../event/Event";
import Node, { NodeOptions } from "../Node";
import Obj from "../Obj";

export interface ValueOptions extends NodeOptions { }

export interface ValData {
  value?: number | string
}

export default abstract class Value extends Node {
  protected value: number | string;

  getValue() {
    return this.value;
  }

  setValue(value: number | string) {
    this.value = value;

    if (this.root instanceof Obj)
      this.root.saveDB();
  }

  protected toData() {
    return {
      value: this.value
    };
  }
}

export class ValChangeEvent extends Event {
  readonly before: number | string;
  after: number | string;

  constructor(sender: Value, before: number | string, after: number | string) {
    super(sender);

    this.before = before;
    this.after = after;
  }
}