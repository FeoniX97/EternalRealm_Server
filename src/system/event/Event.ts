import EventListener from "./EventListener";
import EventSender from "./EventSender";

export default abstract class Event {
  readonly sender: EventSender;

  blocked: boolean;
  errCode: string;
  errMessage: string;

  constructor(sender: EventSender) {
    this.sender = sender;
  }

  /**
   * send this event object to all listeners of this event sender\
   * returns `true` if this event is blocked
   */
  protected sendEventBefore(): boolean {
    for (let eventListener of this.sender.eventListeners) {
      if (!this.blocked) eventListener.onEventBefore(this);
    }

    return this.blocked;
  }

  protected sendEventAfter(): void {
    for (let eventListener of this.sender.eventListeners) {
      if (!this.blocked) eventListener.onEventAfter(this);
    }
  }

  static instanceOfListener(obj: any): obj is EventListener {
    return "hookEvent" in obj;
  }

  static instanceOfSender(obj: any): obj is EventSender {
    return "eventListeners" in obj;
  }
}
