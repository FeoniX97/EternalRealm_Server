import Node from "./Node";
import Root, { RootOptions } from "./Root";

export interface ObjOptions extends RootOptions {
  /** the id of this Obj in the DB, `dbCollection` also need to set for proper persistance storage  */
  dbID?: string;

  /** the collection name of this Obj in the DB, `dbID` also need to set for proper persistance storage */
  dbCollection?: string;
}

/** persistent Root Node which can be stored in DB */
export default abstract class Obj extends Root {
  /** the id of this Obj in the DB, `dbCollection` also need to set for proper persistance storage  */
  protected dbID?: string;

  /** the collection name of this Obj in the DB, `dbID` also need to set for proper persistance storage */
  protected dbCollection?: string;

  constructor(parent: Node, options: ObjOptions, data: any) {
    super(parent, options, data);

    this.dbID = options.dbID;
    this.dbCollection = options.dbCollection;
  }
}
