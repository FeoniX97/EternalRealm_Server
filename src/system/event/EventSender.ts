import EventListener from "./EventListener";

export default interface EventSender {
  eventListeners: Array<EventListener>;
}