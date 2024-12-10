import '#/styles/shiki-anilib/_index.scss';

import { createApp, App as VueApp } from 'vue';
import { createPinia } from 'pinia';

import { library } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from '#/App.vue';

import CustomButton from '#/components/ui/CustomButton.vue';
import CustomContainer from '#/components/ui/CustomContainer.vue';

import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

let app: VueApp<Element>;

export default class Player {

  constructor() {
  }
  
  render() {
    const pinia = createPinia();
    app = createApp(App);
    
    app.use(pinia);

    library.add(faArrowLeft, faArrowRight);
    
    app.component('FontAwesomeIcon', FontAwesomeIcon);

    app.component('CustomContainer', CustomContainer);
    app.component('CustomButton', CustomButton);

    app.mount(
      (() => {
        const $app = $('<div>', {
          id: 'shiki_player',
          class: 'cc shiki-player'
        });

        $('.p-animes .b-db_entry').after($app);

        return $app.get()[0];
      })()
    );
  }

  destroy() {
    if (!app) return;
    app.unmount();
    document.getElementById('shiki_player')?.remove();
  }
};