import Event from "./Event";
import EventSender from "./EventSender";

export default interface EventListener {
  
  /**
   * add self to the event sender's listener list
   * @param eventSender
   */
  hookEvent(...eventSenders: EventSender[]): void;

  unhookEvent(...eventSenders: EventSender[]): void;

  /**
   * return `true` to inform child that this event has been blocked, and should not be further processed
   * @param event
   */
  onEventBefore(event: Event): boolean;

  onEventAfter(event: Event): void;
}