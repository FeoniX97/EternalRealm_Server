import { db } from "../../../app.config";
import Event from "../../event/Event";
import Node, { NodeOptions } from "../Node";
import Obj from "../Obj";

export interface ValueOptions extends NodeOptions {}

export default abstract class Value extends Node {
  protected value: number | string;

  getValue() {
    return this.value;
  }

  setValue(value: number | string) {
    this.value = value;

    if (this.root instanceof Obj) {
      this.root.addDbUpdateData(this.onMergeNodeID(), this.toData());
    }
  }

  toData() {
    return {
      value: this.value,
    };
  }

  /** save the Obj data to DB */
  private async saveDB() {
    // console.log("root nodeID: " + this.root.getNodeID());
    // if (!(this.root instanceof Obj)) return;
    // let field = this.onMergeNodeID();
    // console.log("saving ..." + JSON.stringify({ [field]: this.toData() }));
    // db.collection(this.root.getDbCollection()).updateOne(this.root.getDbID(), {
    //   ["level"]: { value: 5 },
    //   ["exp.min"]: { value: 125 },
    //   [field]: this.toData(),
    // });
    // return if the root DB timeout is already in progress
    // if (this.root.getDbTimeout()) return;
    // // ensure the root Obj is first populated finish
    // await this.root.isPopulated();
    // this.root.dbTimeout = this.getClock().setTimeout(async () => {
    //   await db.collection(this.dbCollection).updateOne(this.dbID, this.toData());
    //   this.dbTimeout?.clear();
    //   this.dbTimeout = null;
    // }, DB_TIMEOUT);
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
