import { db } from "../../app.config";
import Node, { NodeOptions } from "./Node";
import { Delayed } from "colyseus";

export const DB_TIMEOUT = 5000;

export interface ObjOptions extends NodeOptions {
  /** the id of this Obj in the DB, `dbCollection` also need to set for proper persistance storage  */
  dbID?: string;

  /** the collection name of this Obj in the DB, `dbID` also need to set for proper persistance storage */
  dbCollection?: string;
}

/** persistent Root Node which can be stored in DB */
export default abstract class Obj extends Node {
  /** the id of this Obj in the DB, `dbCollection` also need to set for proper persistance storage  */
  protected dbID?: string;

  /** the collection name of this Obj in the DB, `dbID` also need to set for proper persistance storage */
  protected dbCollection?: string;

  /** the promise to wait when calling `isPopulated()` */
  private populatedPromise: Promise<void>;

  /** the timeout left to update DB by calling `saveDB()` */
  private dbTimeout?: Delayed;

  constructor(parent: Node, options: ObjOptions, data: any) {
    super(parent, options, data);

    this.dbID = options.dbID;
    this.dbCollection = options.dbCollection;
  }

  /** @override
   * populate the Node with downstream data, or data from DB document */
  protected async populate(data: any) {
    this.populatedPromise = new Promise(async (resolve, reject) => {
      // get data specifically for this Node
      data = data?.[this.nodeID];

      // get data from DB document if dbID is not null
      let dbData;
      if (this.dbID) {
        if (this.dbCollection) {
          dbData = await db.collection(this.dbCollection).findOne(this.dbID);
        } else {
          throw new Error("Obj does not have collection: " + this.nodeID);
        }
      }

      // start creating child nodes and hook events
      this.onPopulate(dbData ?? data);

      // insert this Obj to DB if does not exist yet
      if (!this.dbID) {
        if (this.dbCollection) {
          this.dbID = await db.collection(this.dbCollection).insertOne(this.toFullData());
        } else {
          throw new Error("Obj does not have collection: " + this.nodeID);
        }
      }

      this.populatedCallback?.(this);
      
      resolve();
    });
  }

  /** convert this Obj to a JSON data format, with full data combined by children */
  private toFullData() {
    return super.toData();
  }

  /** @override
   * convert this Node to a JSON data format, with DB document reference */
  protected toData(): { dbID: string, dbCollection: string, clsName: string } {
    return {
      dbID: this.dbID,
      dbCollection: this.dbCollection,
      clsName: this.clsName
    };
  }

  /** check whether this Obj is populated finish (e.g. load finish from DB)
   * @NOTE even when this Obj is loaded finish, it does not mean all the children will be loaded finish (when some children are persistent Objs)
   */
  async isPopulated() {
    return this.populatedPromise;
  }

  /** save the Obj data to DB */
  async saveDB() {
    // return if a DB timeout is already in progress
    if (this.dbTimeout) return;

    // ensure the Obj is first populated finish
    await this.isPopulated();

    this.dbTimeout = this.getClock().setTimeout(async () => {
      await db.collection(this.dbCollection).updateOne(this.dbID, this.toData());
      this.dbTimeout?.clear();
      this.dbTimeout = null;
    }, DB_TIMEOUT);
  }
}
