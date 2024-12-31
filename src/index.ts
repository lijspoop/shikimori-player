import 'reflect-metadata';
import { defineHandler } from '@lijspoop/event-handler';
import Player from '@/player';

let player: Player;

defineHandler({
  init() {
    player = new Player();
  },
  events: [
    {
      preconditions: {
        predicates: [
          () => !!document.getElementById('animes_show') && !document.getElementById('shiki_player')
        ]
      },
      target: document,
      type: [
        'page:load',
        'turbolinks:load',
        [ 'attachEvent', 'DOMContentLoaded' ]
      ],
      listener: async () => {
        player.render();
      }
    },
    {
      preconditions: {
        predicates: [
          () => !!document.getElementById('shiki_player')
        ]
      },
      target: document,
      type: 'turbolinks:before-cache',
      listener: () => {
        player.destroy();
      }
    }
  ]
});