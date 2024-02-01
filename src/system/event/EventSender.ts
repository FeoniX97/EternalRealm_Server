import EventListener from "./EventListener";

export default interface EventSender {
  eventListeners: Array<EventListener>;

  /** whether the sending of event feature is disabled */
  eventDisabled: boolean;
}