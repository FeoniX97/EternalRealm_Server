import Value, { ValChangeEvent } from "./Value";

export default class StrVal extends Value {
  protected value: string;

  setValue(value: string): void {
    let evt = new ValChangeEvent(this, this.value, value);
    
    if (evt.sendEventBefore()) return;
  
    super.setValue(evt.after);

    evt.sendEventAfter();
  }

  getValue(): string {
    return this.value;
  }

  onPopulate(data: any): void {
    this.value = data?.value !== null ? data?.value : "";
  }
}