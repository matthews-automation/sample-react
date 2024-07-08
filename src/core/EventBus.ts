import mitt from "mitt";

type EventBus = {
  HIDE_HEADER: boolean;
  VIDEO_OPEN: boolean;
  TAG_CLICK: Term;
  SHOW_LANG_SELECTOR: boolean;
}

const emitter = mitt<EventBus>();

export default emitter;