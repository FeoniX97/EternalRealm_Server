import Event from "../event/Event";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";
import { Clock } from "colyseus";

export interface NodeOptions {
  /** the unique name in each Node which is the field in DB and to receive action from client */
  nodeID: string | number;

  /** helps for debugging when identifying the correct Node */
  tag?: string;

  /** whether parent is a Root Node
   * @NOTE Root Nodes do not forget to pass this option to created children\
   * @NOTE Root Nodes can be children of another Node
   */
  fromRoot?: boolean;

  /** the room clock of Colyseus */
  clock?: Clock;

  /** the class name of this Node, default to constructor name */
  clsName?: string;

  /** the callback to listen when the Node is populated finish */
  onPopulated?: <T extends Node>(self: T) => void;
}

export default abstract class Node implements EventSender, EventListener {
  eventListeners: EventListener[];

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

  private parent: Node;

  /** the room clock of Colyseus */
  private clock?: Clock;

  constructor(parent: Node, options: NodeOptions, data: any) {
    this.parent = parent;

    this.nodeID = options.nodeID;
    this.tag = options.tag;
    this.clock = options.clock;
    this.clsName = options.clsName ?? this.constructor.name;
    this.root = options.fromRoot ? parent : parent.root;

    this.parent?.children.push(this);
    this.parent?.hookEvent(this);

    this.populatedCallback = options.onPopulated;
    this.populate(data);
  }

  /** the downstream data is ready, implement this method to set data, create children, hook events etc... */
  abstract onPopulate(data: any): void;

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

  /** populate the Node with downstream data */
  protected populate(data: any) {
    // get data specifically for this Node
    data = data?.[this.nodeID];

    this.onPopulate(data);
  }

  /** convert this Node to a JSON data format, with full data combined by children */
  protected toData(): any {
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
