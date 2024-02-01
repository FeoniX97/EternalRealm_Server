import { NodeOptions } from "../Node";
import Obj from "../Obj";
import NumVal from "../value/NumVal";

export default abstract class Living extends Obj {
  level: NumVal;

  protected onPopulate(data: any, options: NodeOptions): void {
    this.level = new NumVal(this, { nodeID: "level", value: 1 }, data);
  }
}
