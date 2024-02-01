import { Clock } from "colyseus";
import Node, { NodeOptions } from "../../../Node";
import RangeVal from "../../../value/RangeVal";
import Character from "../Character";

export default class Player extends Character {
  exp: RangeVal;

  constructor(parent: Node, dbID: string, clock: Clock) {
    super(parent, { nodeID: "player", dbID: dbID, dbCollection: "players", clock: clock }, null);
  }

  protected onPopulate(data: any, options: NodeOptions): void {
    super.onPopulate(data, options);

    this.exp = new RangeVal(this, { nodeID: "exp", max: 100 }, data);
  }
}
