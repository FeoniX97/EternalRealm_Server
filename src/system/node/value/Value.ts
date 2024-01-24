import Node, { NodeOptions } from "../Node";

export interface ValueOptions extends NodeOptions {}

export default abstract class Value extends Node {
  protected value: number | string;

  getValue() {
    return this.value;
  }

  setValue(value: number | string) {
    this.value = value;
  }

  protected toData() {
    return {
      value: this.value
    };
  }
}