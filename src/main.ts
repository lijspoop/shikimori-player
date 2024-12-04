import { createApp } from 'vue';
import '#/style.css';
import App from '#/App.vue';

export default <EventHandlerConfig>{
  events: [
    {
      preconditions: {
        paths: [ /animes/ ],
        predicates: [
          () =>
            !!document.getElementById('animes_show') &&
            !document.getElementById('shikimori_player')
        ]
      },
      target: document,
      type: [
        'page:load',
        'turbolinks:load',
        [ 'attachEvent', 'DOMContentLoaded' ]
      ],
      listener: async () => {
        const app = createApp(App);

        app.mount(
          (() => {
            const $app = $('<div>', {
              class: 'cc anime-player',
              id: 'shikimori_player'
            });

            $('.p-animes .b-db_entry').after($app);

            return $app.get()[0];
          })()
        );
      }
    },
    {
      target: document,
      type: 'turbolinks:before-cache',
      listener: () => {}
    }
  ]
};
