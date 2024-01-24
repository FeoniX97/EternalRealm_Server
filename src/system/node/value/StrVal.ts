import Value from "./Value";

export default class StrVal extends Value {
  protected value: string;

  onPopulate(data: any): void {
    throw new Error("Method not implemented.");
  }
}