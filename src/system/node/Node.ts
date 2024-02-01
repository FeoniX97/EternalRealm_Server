import Event from "../event/Event";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";
import { Clock } from "colyseus";

export interface NodeOptions {
  /** the unique name in each Node which is the field in DB and to receive action from client */
  nodeID: string | number;

  /** helps for debugging when identifying the correct Node */
  tag?: string;

  /** the room clock of Colyseus */
  clock?: Clock;

  /** the class name of this Node, default to constructor name */
  clsName?: string;

  /** the callback to listen when the Node is populated finish */
  onPopulated?: <T extends Node>(self: T) => void;

  /** the id of this Obj in the DB, `dbCollection` also need to set for proper persistance storage  */
  dbID?: string;

  /** the collection name of this Obj in the DB, `dbID` also need to set for proper persistance storage */
  dbCollection?: string;
}

export default abstract class Node implements EventSender, EventListener {
  eventListeners: EventListener[] = [];

  /** whether the sending of event feature is disabled */
  eventDisabled: boolean;

  /** helps for debugging when identifying the correct Node */
  tag?: string;

  /** the class name of this Node, default to constructor name */
  readonly clsName?: string;

  readonly children: Array<Node> = [];

  /** the callback to listen when the Node is populated finish */
  readonly populatedCallback: <T extends Node>(self: T) => void;

  /** the most top ancestor Node (`Root` class)\
   * access `clock` from root
   */
  protected root: Node;

  /** the unique name in each Node which is the field in DB and to receive action from client */
  protected nodeID: string | number;

  /** the id of this Obj in the DB, `dbCollection` also need to set for proper persistance storage  */
  protected dbID?: string;

  /** the collection name of this Obj in the DB, `dbID` also need to set for proper persistance storage */
  protected dbCollection?: string;

  private parent: Node;

  /** the room clock of Colyseus */
  private clock?: Clock;

  constructor(parent: Node, options: NodeOptions, data: any) {
    this.parent = parent;

    this.nodeID = options.nodeID;
    this.tag = options.tag;
    this.clock = options.clock;
    this.clsName = options.clsName ?? this.constructor.name;
    this.root = parent?.getDbCollection() ? parent : parent?.root;

    this.parent?.children.push(this);
    this.parent?.hookEvent(this);

    this.dbID = options.dbID;
    this.dbCollection = options.dbCollection;

    this.populatedCallback = options.onPopulated;
    this.populate(data, options);
  }

  /** the downstream data is ready, implement this method to set data, create children, hook events etc... */
  protected abstract onPopulate(data: any, options: NodeOptions): void;

  getNodeID() {
    return this.nodeID;
  }

  getRoot() {
    return this.root;
  }

  getParent() {
    return this.parent;
  }

  getClock() {
    return this.clock;
  }

  getDbCollection() {
    return this.dbCollection;
  }

  getDbID() {
    return this.dbID;
  }

  hookEvent(...eventSenders: EventSender[]): void {
    for (let eventSender of eventSenders) {
      const exists = eventSender.eventListeners.find(
        (listener) => listener === this
      );

      if (!exists) eventSender.eventListeners.push(this);
    }
  }

  unhookEvent(...eventSenders: EventSender[]): void {
    for (let eventSender of eventSenders) {
      eventSender.eventListeners = eventSender.eventListeners.filter(
        (listener) => listener != this
      );
    }
  }

  onEventBefore(event: Event): boolean {
    return false;
  }

  /**
   * `note:` will not send after event to self to prevent infinite loop
   */
  onEventAfter(event: Event): void {
    // will not redirect events send by self, to prevent parent from receiving multiple duplicate events
    if (event.sender == this) return;

    // redirect the received events to all hooked listeners also
    for (let eventListener of this.eventListeners) {
      if (eventListener != this) eventListener.onEventAfter(event);
    }
  }

  /** returns the merged nodeID joined by parents, used to update value in DB */
  onMergeNodeID(): string {
    // return "" if reached the Obj
    if (this.dbCollection) return "";

    let parentNodeID = this.parent?.onMergeNodeID();
    return (parentNodeID ? parentNodeID + "." : "") + this.nodeID;
  }

  /** populate the Node with downstream data */
  protected populate(data: any, options: NodeOptions) {
    // get data specifically for this Node
    data = data?.[this.nodeID];

    this.onPopulate(data, options);
  }

  /** convert this Node to a JSON data format, with full data combined by children */
  toData(): any {
    let data: any = {};

    if (this.clsName) data.clsName = this.clsName;
    if (this.children.length <= 0) return data;

    for (let child of this.children) {
      if (child.nodeID) {
        data[child.nodeID] = child.toData();
      }
    }

    return data;
  }
}
