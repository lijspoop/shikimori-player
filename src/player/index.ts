import '#/styles/shiki-anilib/_index.scss';

import { createApp, App as VueApp } from 'vue';
import { createPinia } from 'pinia';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from '#/App.vue';

import VScrollTo from '#/directives/VScrollTo';

let app: VueApp<Element>;

export default class Player {

  constructor() {}
  
  render() {
    const pinia = createPinia(); 

    app = createApp(App);
    app.use(pinia);

    app.directive('scroll-to', VScrollTo);

    app.component('FaIcon', FontAwesomeIcon);

    const $app = $('<div>', {
      id: 'shiki_player',
      class: 'cc shiki-player'
    });

    $('.p-animes .b-db_entry').after($app);

    app.mount($app.get()[0]);
  }

  destroy() {
    document.getElementById('shiki_player')?.remove();
    app?.unmount();
  }
};