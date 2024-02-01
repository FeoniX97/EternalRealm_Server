import { Options } from '@colyseus/loadtest';
import Node from "../Node";
import NumVal, { NumValOptions } from "./NumVal";

export interface NumExValOptions extends NumValOptions {
  increaseRate?: number;
  incrementRate?: number;
}

/** Extended ver. of NumVal, which supports increase rate & increment rate */
export default class NumExVal extends NumVal {
  private increaseRate = .0;

  private incrementRate = .0;

  constructor(parent: Node, options: NumExValOptions, data: any) {
    super(parent, options, data);
  }

  getIncreaseRate(): number {
    return this.increaseRate;
  }

  getIncrementRate(): number {
    return this.incrementRate;
  }

  setIncreaseRate(rate: number) {
    this.increaseRate = rate;
  }

  setIncrementRate(rate: number) {
    this.incrementRate = rate;
  }

  getValue(): number {
    let result = this.value * (1 + this.increaseRate) * (1 + this.incrementRate);

    if (this.isInt) result = Math.round(result);
    if (!this.allowNegative && result < 0) result = 0;

    return result;
  }

  onPopulate(data: any, options: NumExValOptions): void {
    super.onPopulate(data, options);

    this.increaseRate = data?.increaseRate ?? (options?.increaseRate ?? .0);
    this.incrementRate = data?.incrementRate ?? (options?.incrementRate ?? .0);
  }

  toData() {
    return {
      ...super.toData(),
      increaseRate: this.increaseRate,
      incrementRate: this.incrementRate,
    };
  }
}