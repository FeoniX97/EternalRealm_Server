import Event from "../event/Event";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";

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

  /** the class name of this Node, default to constructor name */
  clsName?: string;
}

export default abstract class Node implements EventSender, EventListener {
  eventListeners: EventListener[];

  /** helps for debugging when identifying the correct Node */
  tag?: string;

  /** the class name of this Node, default to constructor name */
  readonly clsName?: string;

  /** the most top ancestor Node (`Root` class)\
   * access `clock` from root
   */
  protected root: Node;

  /** the unique name in each Node which is the field in DB and to receive action from client */
  private nodeID: string | number;

  private parent: Node;

  constructor(parent: Node, options: NodeOptions, data: any) {
    this.parent = parent;

    this.nodeID = options.nodeID;
    this.tag = options.tag;
    this.clsName = options.clsName ?? this.constructor.name;
    this.root = options.fromRoot ? parent : parent.root;

    populate(data);
  }

  /** the downstream data is ready, implement this method to create children, hook events etc... */
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
}
