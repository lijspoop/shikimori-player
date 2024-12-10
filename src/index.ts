import main from '@/main';

main.init?.();

if ('events' in main && Array.isArray(main.events)) {
  handlerEvents(main.events);
}

function handlerEvents(
  events: EventDefinition[] | undefined,
  parentEvent: EventDefinition | undefined = undefined
) {
  events?.forEach((scriptEvent) => {
    if (parentEvent !== undefined) scriptEvent.parentEvent = parentEvent;

    if (Array.isArray(scriptEvent.type)) {
      scriptEvent.type.forEach((type) =>
        registerEventListener(type, scriptEvent)
      );
    } else {
      registerEventListener(scriptEvent.type, scriptEvent);
    }
  });

  function registerEventListener(
    type: RegisterEventListenerType,
    event: EventDefinition
  ) {
    const listener = setListener(event);

    const target = event.target;

    console.assert(!!target, 'Не указано к чему присоединить слушатель событий.');
    console.assert(!!type, 'Не указан тип события.');

    if (Array.isArray(type) && type[0] === 'attachEvent') {
      if (
        document.attachEvent
          ? document.readyState === 'complete'
          : document.readyState !== 'loading'
      ) {
        listener();
      } else if (typeof type[1] === 'string') {
        target.addEventListener(type[1], listener, event?.options);
      }
    } else if (typeof type === 'function') {
      const result = type(listener);
      if (
        typeof result === 'function' ||
        (typeof result === 'boolean' && result)
      ) {
        listener();
      } else if (typeof result === 'string') {
        target.addEventListener(result, listener, event?.options);
      } else if (Array.isArray(result)) {
        target.addEventListener(result[0], result[1], result?.[2]);
      } else if (typeof result === 'object' && Object.hasOwn(result, 'type')) {
        registerEventListener(result.type, result);
      }
    } else if (typeof type === 'string') {
      target.addEventListener(type, listener, event?.options);
    }

    function setListener(event: EventDefinition) {
      return function (evt?: Event) {
        if (
          preventByCondition(event?.preconditions) ||
          (!Object.hasOwn(event, 'parentEvent') &&
            preventByCondition(main?.preconditions))
        ) {
          return;
        }

        if (!Object.hasOwn(event, 'listener')) {
          console.warn('listener не указан', event);
        } else if (typeof event?.listener === 'function') {
          event.listener(evt, event?.parentEvent);
        }
        handlerEvents(event?.children, event);
      };

      function preventByCondition(preconditions: EventPrecondition | undefined) {
        return !!(
          preconditions &&
          (preconditions?.predicates?.some(
            (predicate) => !predicate(preconditions?.paths)
          ) ||
            preconditions?.paths?.some(
              (path) => !window.location.href.match(path)
            ))
        );
      }
    }
  }
}
