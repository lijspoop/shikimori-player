import Player from '@/player';

let player: Player;

export default <EventHandlerConfig>{
  init() {
    player = new Player();
  },
  preconditions: {
    predicates: [
      () =>
        !!document.getElementById('animes_show') &&
        !document.getElementById('shiki_player')
    ]
  },
  events: [
    {
      target: document,
      type: [
        'page:load',
        'turbolinks:load',
        [ 'attachEvent', 'DOMContentLoaded' ]
      ],
      listener: () => {
        player.render();
      }
    },
    {
      target: document,
      type: 'turbolinks:before-cache',
      listener: () => {
        player.destroy();
      }
    }
  ]
};
