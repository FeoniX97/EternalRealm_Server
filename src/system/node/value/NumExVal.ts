import Node from "../Node";
import NumVal, { NumValData, NumValOptions } from "./NumVal";

export interface NumExValData extends NumValData {
  increaseRate?: number;
  incrementRate?: number;
}

/** Extended ver. of NumVal, which supports increase rate & increment rate */
export default class NumExVal extends NumVal {
  private increaseRate = .0;

  private incrementRate = .0;

  constructor(parent: Node, options: NumValOptions, data: NumExValData) {
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

  onPopulate(data: NumExValData): void {
    super.onPopulate(data);

    this.increaseRate = data?.increaseRate ?? .0;
    this.incrementRate = data?.incrementRate ?? .0;
  }

  protected toData() {
    return {
      ...super.toData(),
      increaseRate: this.increaseRate,
      incrementRate: this.incrementRate,
    };
  }
}