// https://github.com/dimaslanjaka/js-prototypes/blob/7005460fd7c4fd117edf58b64d2520ce11a490e9/src/globals.d.ts#L105
interface Document {
  /**
   * window.addEventListener
   *
   * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback
   * that will be invoked when the event is dispatched.
   *
   * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the
   * method behaves exactly as if the value was specified as options's capture.
   */
  attachEvent: any;
}

type CamelCase<S extends string> = S extends `${infer T}-${infer U}`
  ? `${T}${Capitalize<CamelCase<U>>}`
  : S;

interface EventHandlerConfig {
  // предварительные проверки в начале выполнения слушателя события
  preconditions?: EventPrecondition;
  init?: () => void;
  events?: EventDefinition[];
}

// предотвращает обработку события, если указанный `path` не найден в `window.location.href`
// или, если `predicate` возвращает false
interface EventPrecondition {
  // Пути, которые будут проверяться в начале события для предотвращения обработки события.
  // <br>Если `window.location.href.includes()` возвращает <b>true</b>, то обработка события продолжается,
  // если <b>false</b>, то обработка события предотвращается.
  paths?: (string | RegExp)[];
  // Функции-предикаты, которые будут вызваны в начале события для предотвращения обработки события.
  // <br>Если функция возвращает <b>true</b>, то обработка события продолжается,
  // если <b>false</b>, то обработка события предотвращается.
  predicates?: ((paths: (string | RegExp)[] | undefined) => boolean)[];
}

interface EventDefinition {
  target: Window | Document | HTMLElement;
  type: EventType | CustomEventType | EventListenerPredicate;
  listener?: EventScriptListener;
  options?: boolean | AddEventListenerOptions;
  // события, которые регистрируются при срабатывании родительского события
  children?: ScriptChildrenEvent[];
  // предварительные проверки в начале выполнения слушателя события
  preconditions?: EventPrecondition;
  parentEvent?: EventDefinition;
}

type EventType = EventScriptMap | EventScriptMap[];

type CustomEventType = (
  | EventScriptMap
  | ['attachEvent', EventScriptMap]
  | EventListenerPredicate
)[];

type EventListenerPredicate = (
  listener: EventScriptListener,
) =>
  | EventScriptMap
  | [EventScriptMap, (ev?: Event) => void, AddEventListenerOptions?]
  | EventDefinition
  | boolean;

type EventScriptMap = keyof DocumentEventMap | keyof TurbolinksEventMap;

type EventScriptListener = (
  ev?: DocumentEventMap[keyof DocumentEventMap],
  parentEv?: EventDefinition,
) => any;

type RegisterEventListenerType =
  | EventType
  | CustomEventType
  | EventListenerPredicate
  | ['attachEvent', EventScriptMap];

// https://github.com/turbolinks/turbolinks?tab=readme-ov-file#full-list-of-events
interface TurbolinksEventMap {
  'turbolinks:click': Event;
  'turbolinks:before-visit': Event;
  'turbolinks:visit': Event;
  'turbolinks:request-start': Event;
  'turbolinks:request-end': Event;
  'turbolinks:before-cache': Event;
  'turbolinks:before-render': Event;
  'turbolinks:render': Event;
  'turbolinks:load': Event;
}

interface ScriptChildrenEvent extends EventDefinition {
  listener: EventScriptListener;
}
