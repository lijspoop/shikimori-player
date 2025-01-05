// ==UserScript==
// @name            Shikimori Player
// @namespace       lijspoop/shikimori-player
// @version         1.0.0+beta1
// @author          lijspoop (https://github.com/lijspoop)
// @description     Adds players for watching anime on shikimori.one website
// @description:ru  Добавляет плееры для просмотра аниме на сайте shikimori.one
// @license         BSD-2-Clause
// @icon            https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @downloadURL     https://github.com/lijspoop/shikimori-player/releases/latest/download/shikimori-player.user.js
// @updateURL       https://github.com/lijspoop/shikimori-player/releases/latest/download/shikimori-player.meta.js
// @match           *://*.shikimori.one/*
// @match           *://*.shikimori.me/*
// @require         https://raw.githubusercontent.com/lijspoop/kodikwrapper/refs/heads/master/dist/index.global.prod.js
// @require         https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js
// @require         https://cdn.jsdelivr.net/npm/vue-demi@latest/lib/index.iife.js
// @require         data:application/javascript,%3Bwindow.Vue%3DVue%3Bwindow.vue%3DVue%3B
// @require         https://cdn.jsdelivr.net/npm/pinia@2.3.0/dist/pinia.iife.prod.js
// @require         https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-svg-core@6.7.1/index.js
// @require         https://cdn.jsdelivr.net/npm/@fortawesome/free-solid-svg-icons@6.7.1/index.js
// @require         https://cdn.jsdelivr.net/npm/@fortawesome/free-regular-svg-icons@6.7.2/index.js
// @grant           GM_addStyle
// @grant           GM_info
// @grant           GM_xmlhttpRequest
// @run-at          document-start
// ==/UserScript==