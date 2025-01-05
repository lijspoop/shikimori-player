// ==UserScript==
// @name            Shikimori Player
// @namespace       lijspoop/shikimori-player
// @version         1.0.0+beta1
// @author          lijspoop (https://github.com/lijspoop)
// @description     Adds players for watching anime on shikimori.one website
// @description:ru  Добавляет плееры для просмотра аниме на сайте shikimori.one
// @license         BSD-2-Clause
// @icon            https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @downloadURL     https://raw.githubusercontent.com/lijspoop/shikimori-player/refs/heads/build/shikimori-player.prod.user.js
// @updateURL       https://raw.githubusercontent.com/lijspoop/shikimori-player/refs/heads/build/shikimori-player.meta.js
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

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const i=document.createElement("style");i.textContent=n,document.head.append(i)})(` :root {
  --sp-background: url(/assets/background/square_bg.png);
  --sp-active-btn-clr: #456;
  --sp-inactive-btn-clr: #8697a7;
  --sp-transition-color: color 0.25s ease;
  --sp-main-indent: 5px;
  --sp-main-size: 32px;
}

.boop {
  --transition-color: inherit;
  --padding-main: 4px;
  --padding-icon: 8.5px;
}

.p-animes-show .shiki-player .tiny {
  font-size: 11px;
}
.p-animes-show .shiki-player :not(.stat_name) > :not(.active, :hover, .disabled) > .size {
  color: var(--color-text-hint, #777);
  margin-left: auto;
}
.p-animes-show .shiki-player .sp-buttons {
  display: flex;
  gap: 12px;
}
.p-animes-show .shiki-player .sp-buttons.group {
  gap: 0;
}
.p-animes-show .shiki-player .sp-buttons.stretch > .b-link_button:not(.is-icon), .p-animes-show .shiki-player .sp-buttons.stretch > .sp-buttons {
  flex: 1 0 0;
}
.p-animes-show .shiki-player .b-link_button {
  white-space: nowrap;
  display: inline-flex;
  gap: 8px;
  margin: 0;
  padding: 4px 1rem;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  min-width: 1px;
  position: relative;
  text-align: center;
}
.p-animes-show .shiki-player .b-link_button .fa-eye, .p-animes-show .shiki-player .b-link_button .fa-bookmark, .p-animes-show .shiki-player .b-link_button .number {
  -webkit-transition: var(--transition-color);
  transition: var(--transition-color);
}
.p-animes-show .shiki-player .b-link_button .fa-eye, .p-animes-show .shiki-player .b-link_button .fa-bookmark {
  color: var(--color-text-hint, #777);
}
.p-animes-show .shiki-player .b-link_button.watched .fa-bookmark {
  color: var(--color-primary-hovered, #4c86c8);
}
.p-animes-show .shiki-player .b-link_button.watched.dark .fa-bookmark {
  color: var(--color-text-on-primary, #4c86c8);
}
.p-animes-show .shiki-player .b-link_button:hover .fa-eye, .p-animes-show .shiki-player .b-link_button:hover .fa-bookmark {
  color: inherit;
}
.p-animes-show .shiki-player .sp-buttons .b-link_button {
  min-width: 32px;
}
.p-animes-show .shiki-player .sp-buttons .b-link_button:first-child {
  border-radius: var(--border-rounded, 0) 0 0 var(--border-rounded, 0);
}
.p-animes-show .shiki-player .sp-buttons .b-link_button:last-child {
  border-radius: 0 var(--border-rounded, 0) var(--border-rounded, 0) 0;
}
.p-animes-show .shiki-player .sp-buttons .b-link_button.is-icon {
  padding: var(--padding-icon, 4px);
}
.p-animes-show .shiki-player .sp-buttons .b-link_button.is-icon.size-lg {
  height: 32px;
  line-height: 32px;
}
.p-animes-show .shiki-player .sp-buttons .b-link_button.is-icon .icon {
  display: flex;
  align-items: center;
}
.p-animes-show .shiki-player .sp-container {
  display: flex;
}
.p-animes-show .shiki-player .sp-container.sp-content {
  max-height: 496px;
  height: 359px;
  min-height: 359px;
}
.p-animes-show .shiki-player .sp-container.sp-content.max-height {
  height: 496px;
}
.p-animes-show .shiki-player .sp-container .sp-viewport {
  width: 100%;
  background: var(--sp-background);
  position: relative;
  backdrop-filter: sepia(1) contrast(0.5) hue-rotate(125deg);
}
.p-animes-show .shiki-player .sp-container .sp-viewport_iframe {
  height: 100%;
  width: 100%;
  position: absolute;
}
.p-animes-show .shiki-player .sp-container .sp-viewport_buttons {
  display: flex;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  overflow: hidden;
  transition: opacity 0.3s ease;
  opacity: 0;
}
.p-animes-show .shiki-player .sp-container .sp-viewport_buttons .b-link_button {
  z-index: 3;
}
.p-animes-show .shiki-player .sp-container .sp-viewport_buttons .b-link_button.is-icon {
  padding-left: 0;
  padding-right: 0;
  width: 30px;
}
.p-animes-show .shiki-player .sp-container .sp-viewport_buttons .b-link_button.is-icon.size-lg {
  height: 32px;
  line-height: 32px;
}
.p-animes-show .shiki-player .sp-container .sp-viewport_buttons.visible, .p-animes-show .shiki-player .sp-container .sp-viewport:hover .sp-viewport_buttons {
  opacity: 1;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar {
  width: 242px;
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  padding-left: var(--sp-main-indent);
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 1px;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-balancers {
  margin-bottom: var(--sp-main-indent);
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-balancers .title {
  color: var(--color-text-hint, #123);
  font-weight: bold;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-balancers .list .b-tag.active {
  background-color: var(--color-primary-hovered, #456);
  color: var(--color-text-on-primary, #fff);
  cursor: default;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-balancers .list .b-tag.disabled {
  color: var(--sp-inactive-btn-clr);
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-translations {
  overflow-y: auto;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-translations .inner {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 2px;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-translations .inner .b-link:hover {
  text-decoration: none;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-translations .inner .b-link.active {
  color: var(--link-hover-color);
  text-decoration: underline;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-translations .inner .b-menu-line.entry {
  line-height: 1.5rem;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-translations .inner .b-menu-line.entry:hover .name {
  text-decoration: underline;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-translations .inner .b-menu-line.entry .size {
  float: right;
  padding: 0 5px;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-tabs {
  min-height: initial;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-tabs .stat_names .stat_name > a:not(.active):has(.size:not([data-total="0"]))::before {
  background-color: var(--color-primary-reduced);
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-tabs .stat_names .stat_name > a.active {
  color: var(--link-hover-color);
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-tabs .stat_names .stat_name > a.active::before {
  background-color: var(--color-primary);
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .sp-tabs .b-link_button {
  min-width: unset;
  margin: 0;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar .sp-selection_panel .b-stats_bar .stat_names .stat_name .size {
  margin-left: 3px;
}
.p-animes-show .shiki-player .sp-container .sp-sidebar > .sp-buttons > .sp-buttons {
  margin-top: var(--sp-main-indent);
}
.p-animes-show .shiki-player .sp-container .sp-sidebar > .sp-buttons .b-link_button {
  margin: 0;
  min-width: 1px;
  width: inherit;
}
.p-animes-show .shiki-player .sp-container[data-player-sidebar=hidden] .sp-sidebar {
  display: none;
}
.p-animes-show .shiki-player .sp-episodes {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--sp-main-indent) 0;
}
.p-animes-show .shiki-player .sp-episodes_buttons {
  display: flex;
  flex-shrink: 0;
  margin-right: var(--sp-main-indent);
}
.p-animes-show .shiki-player .sp-episodes_buttons.sp-buttons .b-link_button {
  border-radius: var(--border-rounded, 0);
}
.p-animes-show .shiki-player .sp-episodes_search {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-right: var(--sp-main-indent);
  width: 200px;
}
.p-animes-show .shiki-player .sp-episodes_search_input {
  position: relative;
  flex-grow: 1;
}
.p-animes-show .shiki-player .sp-episodes_search_input:has(.found-episodes) .b-input input {
  --padding-right: 36px;
}
.p-animes-show .shiki-player .sp-episodes_search_input .b-input {
  position: relative;
  flex-grow: 1;
  margin: 0;
}
.p-animes-show .shiki-player .sp-episodes_search_input .b-input input {
  position: relative;
  line-height: inherit;
  min-height: 24px;
  max-width: 200px;
  padding: var(--padding-main, 0.785px) 10px;
  padding-right: var(--padding-right);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.p-animes-show .shiki-player .sp-episodes_search_input .b-input input::-webkit-outer-spin-button, .p-animes-show .shiki-player .sp-episodes_search_input .b-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.p-animes-show .shiki-player .sp-episodes_search_input .found-episodes {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 8px;
  font-size: 12px;
  box-sizing: border-box;
  color: #8a8a8e;
  color: var(--text-secondary);
  pointer-events: none;
}
.p-animes-show .shiki-player .sp-episodes_search_buttons .b-link_button, .p-animes-show .shiki-player .sp-episodes_search_buttons .b-link_button:first-child {
  border-radius: 0;
}
.p-animes-show .shiki-player .sp-episodes_container {
  min-width: 1px;
  position: relative;
  z-index: 2;
}
.p-animes-show .shiki-player .sp-episodes_container .arrow {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
}
.p-animes-show .shiki-player .sp-episodes_container .arrow.left {
  left: 0;
  background: linear-gradient(to right, var(--color-surface, #fff) 50%, transparent);
  padding-right: 14px;
}
.p-animes-show .shiki-player .sp-episodes_container .arrow.right {
  right: 0;
  background: linear-gradient(to left, var(--color-surface, #fff) 50%, transparent);
  padding-left: 14px;
}
.p-animes-show .shiki-player .sp-episodes_container .arrow.is-icon .icon {
  transition: background 0.3s ease, transform 0.3s ease;
}
.p-animes-show .shiki-player .sp-episodes_container .arrow.left:hover .icon {
  transform: translateX(-4px);
}
.p-animes-show .shiki-player .sp-episodes_container .arrow.right:hover .icon {
  transform: translateX(4px);
}
.p-animes-show .shiki-player .sp-episodes_container .inner {
  overflow-x: auto;
  display: flex;
  justify-content: space-between;
  gap: var(--sp-main-indent);
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.p-animes-show .shiki-player .sp-episodes_container .inner .b-link_button.highlight span {
  background: blueviolet;
  color: #fff;
  padding-left: 2px;
  padding-right: 2px;
  font-weight: 600;
}
.p-animes-show .shiki-player .sp-episodes .fade-enter-active, .p-animes-show .shiki-player .sp-episodes .fade-leave-active {
  transition: opacity 0.5s;
}
.p-animes-show .shiki-player .sp-episodes .fade-enter, .p-animes-show .shiki-player .sp-episodes .fade-leave-to {
  opacity: 0;
}
.p-animes-show .shiki-player .sp-footer .script-info {
  color: var(--color-text-disabled, #9da2a8);
  cursor: default;
  font-size: 12px;
}
.p-animes-show .shiki-player .disabled, .p-animes-show .shiki-player .disabled ::before, .p-animes-show .shiki-player .disabled ::after {
  cursor: not-allowed !important;
} `);

(function (vue, pinia, fontawesomeSvgCore, freeSolidSvgIcons, kodikwrapper, freeRegularSvgIcons) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var commonjsGlobal$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  /*! *****************************************************************************
  Copyright (C) Microsoft. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var Reflect2;
  (function(Reflect3) {
    (function(factory) {
      var root = typeof globalThis === "object" ? globalThis : typeof commonjsGlobal$1 === "object" ? commonjsGlobal$1 : typeof self === "object" ? self : typeof this === "object" ? this : sloppyModeThis();
      var exporter = makeExporter(Reflect3);
      if (typeof root.Reflect !== "undefined") {
        exporter = makeExporter(root.Reflect, exporter);
      }
      factory(exporter, root);
      if (typeof root.Reflect === "undefined") {
        root.Reflect = Reflect3;
      }
      function makeExporter(target, previous) {
        return function(key, value) {
          Object.defineProperty(target, key, { configurable: true, writable: true, value });
          if (previous)
            previous(key, value);
        };
      }
      function functionThis() {
        try {
          return Function("return this;")();
        } catch (_) {
        }
      }
      function indirectEvalThis() {
        try {
          return (void 0, eval)("(function() { return this; })()");
        } catch (_) {
        }
      }
      function sloppyModeThis() {
        return functionThis() || indirectEvalThis();
      }
    })(function(exporter, root) {
      var hasOwn = Object.prototype.hasOwnProperty;
      var supportsSymbol = typeof Symbol === "function";
      var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
      var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
      var supportsCreate = typeof Object.create === "function";
      var supportsProto = { __proto__: [] } instanceof Array;
      var downLevel = !supportsCreate && !supportsProto;
      var HashMap = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: supportsCreate ? function() {
          return MakeDictionary(/* @__PURE__ */ Object.create(null));
        } : supportsProto ? function() {
          return MakeDictionary({ __proto__: null });
        } : function() {
          return MakeDictionary({});
        },
        has: downLevel ? function(map, key) {
          return hasOwn.call(map, key);
        } : function(map, key) {
          return key in map;
        },
        get: downLevel ? function(map, key) {
          return hasOwn.call(map, key) ? map[key] : void 0;
        } : function(map, key) {
          return map[key];
        }
      };
      var functionPrototype = Object.getPrototypeOf(Function);
      var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
      var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
      var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
      var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : void 0;
      var metadataRegistry = GetOrCreateMetadataRegistry();
      var metadataProvider = CreateMetadataProvider(metadataRegistry);
      function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
          if (!IsArray(decorators))
            throw new TypeError();
          if (!IsObject(target))
            throw new TypeError();
          if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
            throw new TypeError();
          if (IsNull(attributes))
            attributes = void 0;
          propertyKey = ToPropertyKey(propertyKey);
          return DecorateProperty(decorators, target, propertyKey, attributes);
        } else {
          if (!IsArray(decorators))
            throw new TypeError();
          if (!IsConstructor(target))
            throw new TypeError();
          return DecorateConstructor(decorators, target);
        }
      }
      exporter("decorate", decorate);
      function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
            throw new TypeError();
          OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
      }
      exporter("metadata", metadata);
      function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
      }
      exporter("defineMetadata", defineMetadata);
      function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
      }
      exporter("hasMetadata", hasMetadata);
      function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
      }
      exporter("hasOwnMetadata", hasOwnMetadata);
      function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
      }
      exporter("getMetadata", getMetadata);
      function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
      }
      exporter("getOwnMetadata", getOwnMetadata);
      function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
      }
      exporter("getMetadataKeys", getMetadataKeys);
      function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
      }
      exporter("getOwnMetadataKeys", getOwnMetadataKeys);
      function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        var provider = GetMetadataProvider(
          target,
          propertyKey,
          /*Create*/
          false
        );
        if (IsUndefined(provider))
          return false;
        return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
      }
      exporter("deleteMetadata", deleteMetadata);
      function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
          var decorator = decorators[i];
          var decorated = decorator(target);
          if (!IsUndefined(decorated) && !IsNull(decorated)) {
            if (!IsConstructor(decorated))
              throw new TypeError();
            target = decorated;
          }
        }
        return target;
      }
      function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
          var decorator = decorators[i];
          var decorated = decorator(target, propertyKey, descriptor);
          if (!IsUndefined(decorated) && !IsNull(decorated)) {
            if (!IsObject(decorated))
              throw new TypeError();
            descriptor = decorated;
          }
        }
        return descriptor;
      }
      function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn2)
          return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
          return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
      }
      function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var provider = GetMetadataProvider(
          O,
          P,
          /*Create*/
          false
        );
        if (IsUndefined(provider))
          return false;
        return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
      }
      function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn2)
          return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
          return OrdinaryGetMetadata(MetadataKey, parent, P);
        return void 0;
      }
      function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var provider = GetMetadataProvider(
          O,
          P,
          /*Create*/
          false
        );
        if (IsUndefined(provider))
          return;
        return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
      }
      function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var provider = GetMetadataProvider(
          O,
          P,
          /*Create*/
          true
        );
        provider.OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
      }
      function OrdinaryMetadataKeys(O, P) {
        var ownKeys2 = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
          return ownKeys2;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
          return ownKeys2;
        if (ownKeys2.length <= 0)
          return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys2; _i < ownKeys_1.length; _i++) {
          var key = ownKeys_1[_i];
          var hasKey = set.has(key);
          if (!hasKey) {
            set.add(key);
            keys.push(key);
          }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
          var key = parentKeys_1[_a];
          var hasKey = set.has(key);
          if (!hasKey) {
            set.add(key);
            keys.push(key);
          }
        }
        return keys;
      }
      function OrdinaryOwnMetadataKeys(O, P) {
        var provider = GetMetadataProvider(
          O,
          P,
          /*create*/
          false
        );
        if (!provider) {
          return [];
        }
        return provider.OrdinaryOwnMetadataKeys(O, P);
      }
      function Type(x) {
        if (x === null)
          return 1;
        switch (typeof x) {
          case "undefined":
            return 0;
          case "boolean":
            return 2;
          case "string":
            return 3;
          case "symbol":
            return 4;
          case "number":
            return 5;
          case "object":
            return x === null ? 1 : 6;
          default:
            return 6;
        }
      }
      function IsUndefined(x) {
        return x === void 0;
      }
      function IsNull(x) {
        return x === null;
      }
      function IsSymbol(x) {
        return typeof x === "symbol";
      }
      function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
      }
      function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
          case 0:
            return input;
          case 1:
            return input;
          case 2:
            return input;
          case 3:
            return input;
          case 4:
            return input;
          case 5:
            return input;
        }
        var hint = "string";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== void 0) {
          var result = exoticToPrim.call(input, hint);
          if (IsObject(result))
            throw new TypeError();
          return result;
        }
        return OrdinaryToPrimitive(input);
      }
      function OrdinaryToPrimitive(O, hint) {
        var valueOf, result;
        {
          var toString_1 = O.toString;
          if (IsCallable(toString_1)) {
            var result = toString_1.call(O);
            if (!IsObject(result))
              return result;
          }
          var valueOf = O.valueOf;
          if (IsCallable(valueOf)) {
            var result = valueOf.call(O);
            if (!IsObject(result))
              return result;
          }
        }
        throw new TypeError();
      }
      function ToBoolean(argument) {
        return !!argument;
      }
      function ToString(argument) {
        return "" + argument;
      }
      function ToPropertyKey(argument) {
        var key = ToPrimitive(argument);
        if (IsSymbol(key))
          return key;
        return ToString(key);
      }
      function IsArray(argument) {
        return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
      }
      function IsCallable(argument) {
        return typeof argument === "function";
      }
      function IsConstructor(argument) {
        return typeof argument === "function";
      }
      function IsPropertyKey(argument) {
        switch (Type(argument)) {
          case 3:
            return true;
          case 4:
            return true;
          default:
            return false;
        }
      }
      function SameValueZero(x, y) {
        return x === y || x !== x && y !== y;
      }
      function GetMethod(V, P) {
        var func = V[P];
        if (func === void 0 || func === null)
          return void 0;
        if (!IsCallable(func))
          throw new TypeError();
        return func;
      }
      function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
          throw new TypeError();
        var iterator = method.call(obj);
        if (!IsObject(iterator))
          throw new TypeError();
        return iterator;
      }
      function IteratorValue(iterResult) {
        return iterResult.value;
      }
      function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
      }
      function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
          f.call(iterator);
      }
      function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
          return proto;
        if (proto !== functionPrototype)
          return proto;
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
          return proto;
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
          return proto;
        if (constructor === O)
          return proto;
        return constructor;
      }
      function CreateMetadataRegistry() {
        var fallback;
        if (!IsUndefined(registrySymbol) && typeof root.Reflect !== "undefined" && !(registrySymbol in root.Reflect) && typeof root.Reflect.defineMetadata === "function") {
          fallback = CreateFallbackProvider(root.Reflect);
        }
        var first;
        var second;
        var rest;
        var targetProviderMap = new _WeakMap();
        var registry = {
          registerProvider,
          getProvider,
          setProvider
        };
        return registry;
        function registerProvider(provider) {
          if (!Object.isExtensible(registry)) {
            throw new Error("Cannot add provider to a frozen registry.");
          }
          switch (true) {
            case fallback === provider:
              break;
            case IsUndefined(first):
              first = provider;
              break;
            case first === provider:
              break;
            case IsUndefined(second):
              second = provider;
              break;
            case second === provider:
              break;
            default:
              if (rest === void 0)
                rest = new _Set();
              rest.add(provider);
              break;
          }
        }
        function getProviderNoCache(O, P) {
          if (!IsUndefined(first)) {
            if (first.isProviderFor(O, P))
              return first;
            if (!IsUndefined(second)) {
              if (second.isProviderFor(O, P))
                return first;
              if (!IsUndefined(rest)) {
                var iterator = GetIterator(rest);
                while (true) {
                  var next = IteratorStep(iterator);
                  if (!next) {
                    return void 0;
                  }
                  var provider = IteratorValue(next);
                  if (provider.isProviderFor(O, P)) {
                    IteratorClose(iterator);
                    return provider;
                  }
                }
              }
            }
          }
          if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) {
            return fallback;
          }
          return void 0;
        }
        function getProvider(O, P) {
          var providerMap = targetProviderMap.get(O);
          var provider;
          if (!IsUndefined(providerMap)) {
            provider = providerMap.get(P);
          }
          if (!IsUndefined(provider)) {
            return provider;
          }
          provider = getProviderNoCache(O, P);
          if (!IsUndefined(provider)) {
            if (IsUndefined(providerMap)) {
              providerMap = new _Map();
              targetProviderMap.set(O, providerMap);
            }
            providerMap.set(P, provider);
          }
          return provider;
        }
        function hasProvider(provider) {
          if (IsUndefined(provider))
            throw new TypeError();
          return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
        }
        function setProvider(O, P, provider) {
          if (!hasProvider(provider)) {
            throw new Error("Metadata provider not registered.");
          }
          var existingProvider = getProvider(O, P);
          if (existingProvider !== provider) {
            if (!IsUndefined(existingProvider)) {
              return false;
            }
            var providerMap = targetProviderMap.get(O);
            if (IsUndefined(providerMap)) {
              providerMap = new _Map();
              targetProviderMap.set(O, providerMap);
            }
            providerMap.set(P, provider);
          }
          return true;
        }
      }
      function GetOrCreateMetadataRegistry() {
        var metadataRegistry2;
        if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
          metadataRegistry2 = root.Reflect[registrySymbol];
        }
        if (IsUndefined(metadataRegistry2)) {
          metadataRegistry2 = CreateMetadataRegistry();
        }
        if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
          Object.defineProperty(root.Reflect, registrySymbol, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: metadataRegistry2
          });
        }
        return metadataRegistry2;
      }
      function CreateMetadataProvider(registry) {
        var metadata2 = new _WeakMap();
        var provider = {
          isProviderFor: function(O, P) {
            var targetMetadata = metadata2.get(O);
            if (IsUndefined(targetMetadata))
              return false;
            return targetMetadata.has(P);
          },
          OrdinaryDefineOwnMetadata: OrdinaryDefineOwnMetadata2,
          OrdinaryHasOwnMetadata: OrdinaryHasOwnMetadata2,
          OrdinaryGetOwnMetadata: OrdinaryGetOwnMetadata2,
          OrdinaryOwnMetadataKeys: OrdinaryOwnMetadataKeys2,
          OrdinaryDeleteMetadata
        };
        metadataRegistry.registerProvider(provider);
        return provider;
        function GetOrCreateMetadataMap(O, P, Create) {
          var targetMetadata = metadata2.get(O);
          var createdTargetMetadata = false;
          if (IsUndefined(targetMetadata)) {
            if (!Create)
              return void 0;
            targetMetadata = new _Map();
            metadata2.set(O, targetMetadata);
            createdTargetMetadata = true;
          }
          var metadataMap = targetMetadata.get(P);
          if (IsUndefined(metadataMap)) {
            if (!Create)
              return void 0;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
            if (!registry.setProvider(O, P, provider)) {
              targetMetadata.delete(P);
              if (createdTargetMetadata) {
                metadata2.delete(O);
              }
              throw new Error("Wrong provider for target.");
            }
          }
          return metadataMap;
        }
        function OrdinaryHasOwnMetadata2(MetadataKey, O, P) {
          var metadataMap = GetOrCreateMetadataMap(
            O,
            P,
            /*Create*/
            false
          );
          if (IsUndefined(metadataMap))
            return false;
          return ToBoolean(metadataMap.has(MetadataKey));
        }
        function OrdinaryGetOwnMetadata2(MetadataKey, O, P) {
          var metadataMap = GetOrCreateMetadataMap(
            O,
            P,
            /*Create*/
            false
          );
          if (IsUndefined(metadataMap))
            return void 0;
          return metadataMap.get(MetadataKey);
        }
        function OrdinaryDefineOwnMetadata2(MetadataKey, MetadataValue, O, P) {
          var metadataMap = GetOrCreateMetadataMap(
            O,
            P,
            /*Create*/
            true
          );
          metadataMap.set(MetadataKey, MetadataValue);
        }
        function OrdinaryOwnMetadataKeys2(O, P) {
          var keys = [];
          var metadataMap = GetOrCreateMetadataMap(
            O,
            P,
            /*Create*/
            false
          );
          if (IsUndefined(metadataMap))
            return keys;
          var keysObj = metadataMap.keys();
          var iterator = GetIterator(keysObj);
          var k = 0;
          while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
              keys.length = k;
              return keys;
            }
            var nextValue = IteratorValue(next);
            try {
              keys[k] = nextValue;
            } catch (e) {
              try {
                IteratorClose(iterator);
              } finally {
                throw e;
              }
            }
            k++;
          }
        }
        function OrdinaryDeleteMetadata(MetadataKey, O, P) {
          var metadataMap = GetOrCreateMetadataMap(
            O,
            P,
            /*Create*/
            false
          );
          if (IsUndefined(metadataMap))
            return false;
          if (!metadataMap.delete(MetadataKey))
            return false;
          if (metadataMap.size === 0) {
            var targetMetadata = metadata2.get(O);
            if (!IsUndefined(targetMetadata)) {
              targetMetadata.delete(P);
              if (targetMetadata.size === 0) {
                metadata2.delete(targetMetadata);
              }
            }
          }
          return true;
        }
      }
      function CreateFallbackProvider(reflect) {
        var defineMetadata2 = reflect.defineMetadata, hasOwnMetadata2 = reflect.hasOwnMetadata, getOwnMetadata2 = reflect.getOwnMetadata, getOwnMetadataKeys2 = reflect.getOwnMetadataKeys, deleteMetadata2 = reflect.deleteMetadata;
        var metadataOwner = new _WeakMap();
        var provider = {
          isProviderFor: function(O, P) {
            var metadataPropertySet = metadataOwner.get(O);
            if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) {
              return true;
            }
            if (getOwnMetadataKeys2(O, P).length) {
              if (IsUndefined(metadataPropertySet)) {
                metadataPropertySet = new _Set();
                metadataOwner.set(O, metadataPropertySet);
              }
              metadataPropertySet.add(P);
              return true;
            }
            return false;
          },
          OrdinaryDefineOwnMetadata: defineMetadata2,
          OrdinaryHasOwnMetadata: hasOwnMetadata2,
          OrdinaryGetOwnMetadata: getOwnMetadata2,
          OrdinaryOwnMetadataKeys: getOwnMetadataKeys2,
          OrdinaryDeleteMetadata: deleteMetadata2
        };
        return provider;
      }
      function GetMetadataProvider(O, P, Create) {
        var registeredProvider = metadataRegistry.getProvider(O, P);
        if (!IsUndefined(registeredProvider)) {
          return registeredProvider;
        }
        if (Create) {
          if (metadataRegistry.setProvider(O, P, metadataProvider)) {
            return metadataProvider;
          }
          throw new Error("Illegal state.");
        }
        return void 0;
      }
      function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (
          /** @class */
          function() {
            function MapIterator2(keys, values, selector) {
              this._index = 0;
              this._keys = keys;
              this._values = values;
              this._selector = selector;
            }
            MapIterator2.prototype["@@iterator"] = function() {
              return this;
            };
            MapIterator2.prototype[iteratorSymbol] = function() {
              return this;
            };
            MapIterator2.prototype.next = function() {
              var index = this._index;
              if (index >= 0 && index < this._keys.length) {
                var result = this._selector(this._keys[index], this._values[index]);
                if (index + 1 >= this._keys.length) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
                } else {
                  this._index++;
                }
                return { value: result, done: false };
              }
              return { value: void 0, done: true };
            };
            MapIterator2.prototype.throw = function(error) {
              if (this._index >= 0) {
                this._index = -1;
                this._keys = arraySentinel;
                this._values = arraySentinel;
              }
              throw error;
            };
            MapIterator2.prototype.return = function(value) {
              if (this._index >= 0) {
                this._index = -1;
                this._keys = arraySentinel;
                this._values = arraySentinel;
              }
              return { value, done: true };
            };
            return MapIterator2;
          }()
        );
        var Map2 = (
          /** @class */
          function() {
            function Map3() {
              this._keys = [];
              this._values = [];
              this._cacheKey = cacheSentinel;
              this._cacheIndex = -2;
            }
            Object.defineProperty(Map3.prototype, "size", {
              get: function() {
                return this._keys.length;
              },
              enumerable: true,
              configurable: true
            });
            Map3.prototype.has = function(key) {
              return this._find(
                key,
                /*insert*/
                false
              ) >= 0;
            };
            Map3.prototype.get = function(key) {
              var index = this._find(
                key,
                /*insert*/
                false
              );
              return index >= 0 ? this._values[index] : void 0;
            };
            Map3.prototype.set = function(key, value) {
              var index = this._find(
                key,
                /*insert*/
                true
              );
              this._values[index] = value;
              return this;
            };
            Map3.prototype.delete = function(key) {
              var index = this._find(
                key,
                /*insert*/
                false
              );
              if (index >= 0) {
                var size = this._keys.length;
                for (var i = index + 1; i < size; i++) {
                  this._keys[i - 1] = this._keys[i];
                  this._values[i - 1] = this._values[i];
                }
                this._keys.length--;
                this._values.length--;
                if (SameValueZero(key, this._cacheKey)) {
                  this._cacheKey = cacheSentinel;
                  this._cacheIndex = -2;
                }
                return true;
              }
              return false;
            };
            Map3.prototype.clear = function() {
              this._keys.length = 0;
              this._values.length = 0;
              this._cacheKey = cacheSentinel;
              this._cacheIndex = -2;
            };
            Map3.prototype.keys = function() {
              return new MapIterator(this._keys, this._values, getKey);
            };
            Map3.prototype.values = function() {
              return new MapIterator(this._keys, this._values, getValue);
            };
            Map3.prototype.entries = function() {
              return new MapIterator(this._keys, this._values, getEntry);
            };
            Map3.prototype["@@iterator"] = function() {
              return this.entries();
            };
            Map3.prototype[iteratorSymbol] = function() {
              return this.entries();
            };
            Map3.prototype._find = function(key, insert) {
              if (!SameValueZero(this._cacheKey, key)) {
                this._cacheIndex = -1;
                for (var i = 0; i < this._keys.length; i++) {
                  if (SameValueZero(this._keys[i], key)) {
                    this._cacheIndex = i;
                    break;
                  }
                }
              }
              if (this._cacheIndex < 0 && insert) {
                this._cacheIndex = this._keys.length;
                this._keys.push(key);
                this._values.push(void 0);
              }
              return this._cacheIndex;
            };
            return Map3;
          }()
        );
        return Map2;
        function getKey(key, _) {
          return key;
        }
        function getValue(_, value) {
          return value;
        }
        function getEntry(key, value) {
          return [key, value];
        }
      }
      function CreateSetPolyfill() {
        var Set2 = (
          /** @class */
          function() {
            function Set3() {
              this._map = new _Map();
            }
            Object.defineProperty(Set3.prototype, "size", {
              get: function() {
                return this._map.size;
              },
              enumerable: true,
              configurable: true
            });
            Set3.prototype.has = function(value) {
              return this._map.has(value);
            };
            Set3.prototype.add = function(value) {
              return this._map.set(value, value), this;
            };
            Set3.prototype.delete = function(value) {
              return this._map.delete(value);
            };
            Set3.prototype.clear = function() {
              this._map.clear();
            };
            Set3.prototype.keys = function() {
              return this._map.keys();
            };
            Set3.prototype.values = function() {
              return this._map.keys();
            };
            Set3.prototype.entries = function() {
              return this._map.entries();
            };
            Set3.prototype["@@iterator"] = function() {
              return this.keys();
            };
            Set3.prototype[iteratorSymbol] = function() {
              return this.keys();
            };
            return Set3;
          }()
        );
        return Set2;
      }
      function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (
          /** @class */
          function() {
            function WeakMap2() {
              this._key = CreateUniqueKey();
            }
            WeakMap2.prototype.has = function(target) {
              var table = GetOrCreateWeakMapTable(
                target,
                /*create*/
                false
              );
              return table !== void 0 ? HashMap.has(table, this._key) : false;
            };
            WeakMap2.prototype.get = function(target) {
              var table = GetOrCreateWeakMapTable(
                target,
                /*create*/
                false
              );
              return table !== void 0 ? HashMap.get(table, this._key) : void 0;
            };
            WeakMap2.prototype.set = function(target, value) {
              var table = GetOrCreateWeakMapTable(
                target,
                /*create*/
                true
              );
              table[this._key] = value;
              return this;
            };
            WeakMap2.prototype.delete = function(target) {
              var table = GetOrCreateWeakMapTable(
                target,
                /*create*/
                false
              );
              return table !== void 0 ? delete table[this._key] : false;
            };
            WeakMap2.prototype.clear = function() {
              this._key = CreateUniqueKey();
            };
            return WeakMap2;
          }()
        );
        function CreateUniqueKey() {
          var key;
          do
            key = "@@WeakMap@@" + CreateUUID();
          while (HashMap.has(keys, key));
          keys[key] = true;
          return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
          if (!hasOwn.call(target, rootKey)) {
            if (!create)
              return void 0;
            Object.defineProperty(target, rootKey, { value: HashMap.create() });
          }
          return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
          for (var i = 0; i < size; ++i)
            buffer[i] = Math.random() * 255 | 0;
          return buffer;
        }
        function GenRandomBytes(size) {
          if (typeof Uint8Array === "function") {
            var array = new Uint8Array(size);
            if (typeof crypto !== "undefined") {
              crypto.getRandomValues(array);
            } else if (typeof msCrypto !== "undefined") {
              msCrypto.getRandomValues(array);
            } else {
              FillRandomBytes(array, size);
            }
            return array;
          }
          return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
          var data = GenRandomBytes(UUID_SIZE);
          data[6] = data[6] & 79 | 64;
          data[8] = data[8] & 191 | 128;
          var result = "";
          for (var offset = 0; offset < UUID_SIZE; ++offset) {
            var byte = data[offset];
            if (offset === 4 || offset === 6 || offset === 8)
              result += "-";
            if (byte < 16)
              result += "0";
            result += byte.toString(16).toLowerCase();
          }
          return result;
        }
      }
      function MakeDictionary(obj) {
        obj.__ = void 0;
        delete obj.__;
        return obj;
      }
    });
  })(Reflect2 || (Reflect2 = {}));
  var l = Object.defineProperty;
  var s = (o, f) => l(o, "name", { value: f, configurable: true });
  function E(o) {
    var _a;
    (_a = o.init) == null ? void 0 : _a.call(o), "events" in o && Array.isArray(o.events) && f(o.events);
    function f(e, n = void 0) {
      e == null ? void 0 : e.forEach((t) => {
        n !== void 0 && (t.parentEvent = n), Array.isArray(t.type) ? t.type.forEach((r) => a(r, t)) : a(t.type, t);
      });
    }
    s(f, "handlerEvents");
    function a(e, n) {
      let t = c(n), r = n.target;
      if (console.assert(!!r, "Не указано к чему присоединить слушатель событий."), console.assert(!!e, "Не указан тип события."), Array.isArray(e) && e[0] === "attachEvent") (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") ? t() : typeof e[1] == "string" && r.addEventListener(e[1], t, n == null ? void 0 : n.options);
      else if (typeof e == "function") {
        let i = e(t);
        typeof i == "function" || typeof i == "boolean" && i ? t() : typeof i == "string" ? r.addEventListener(i, t, n == null ? void 0 : n.options) : Array.isArray(i) ? r.addEventListener(i[0], i[1], i == null ? void 0 : i[2]) : typeof i == "object" && Object.hasOwn(i, "type") && a(i.type, i);
      } else typeof e == "string" && r.addEventListener(e, t, n == null ? void 0 : n.options);
    }
    s(a, "registerEventListener");
    function c(e) {
      return function(n) {
        d(e == null ? void 0 : e.preconditions) || !Object.hasOwn(e, "parentEvent") && d(o == null ? void 0 : o.preconditions) || (Object.hasOwn(e, "listener") ? typeof (e == null ? void 0 : e.listener) == "function" && e.listener(n, e == null ? void 0 : e.parentEvent) : console.warn("listener не указан", e), f(e == null ? void 0 : e.children, e));
      };
    }
    s(c, "setListener");
    function d(e) {
      var _a2, _b;
      return !!(e && (((_a2 = e == null ? void 0 : e.predicates) == null ? void 0 : _a2.some((n) => !n(e == null ? void 0 : e.paths))) || ((_b = e == null ? void 0 : e.paths) == null ? void 0 : _b.some((n) => !window.location.href.match(n)))));
    }
    s(d, "preventByCondition");
  }
  s(E, "defineHandler");
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e, r2).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
        _defineProperty(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var humps$1 = { exports: {} };
  (function(module) {
    (function(global2) {
      var _processKeys = function(convert2, obj, options) {
        if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
          return obj;
        }
        var output, i = 0, l2 = 0;
        if (_isArray(obj)) {
          output = [];
          for (l2 = obj.length; i < l2; i++) {
            output.push(_processKeys(convert2, obj[i], options));
          }
        } else {
          output = {};
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              output[convert2(key, options)] = _processKeys(convert2, obj[key], options);
            }
          }
        }
        return output;
      };
      var separateWords = function(string, options) {
        options = options || {};
        var separator = options.separator || "_";
        var split = options.split || /(?=[A-Z])/;
        return string.split(split).join(separator);
      };
      var camelize = function(string) {
        if (_isNumerical(string)) {
          return string;
        }
        string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
          return chr ? chr.toUpperCase() : "";
        });
        return string.substr(0, 1).toLowerCase() + string.substr(1);
      };
      var pascalize = function(string) {
        var camelized = camelize(string);
        return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
      };
      var decamelize = function(string, options) {
        return separateWords(string, options).toLowerCase();
      };
      var toString = Object.prototype.toString;
      var _isFunction = function(obj) {
        return typeof obj === "function";
      };
      var _isObject = function(obj) {
        return obj === Object(obj);
      };
      var _isArray = function(obj) {
        return toString.call(obj) == "[object Array]";
      };
      var _isDate = function(obj) {
        return toString.call(obj) == "[object Date]";
      };
      var _isRegExp = function(obj) {
        return toString.call(obj) == "[object RegExp]";
      };
      var _isBoolean = function(obj) {
        return toString.call(obj) == "[object Boolean]";
      };
      var _isNumerical = function(obj) {
        obj = obj - 0;
        return obj === obj;
      };
      var _processor = function(convert2, options) {
        var callback = options && "process" in options ? options.process : options;
        if (typeof callback !== "function") {
          return convert2;
        }
        return function(string, options2) {
          return callback(string, convert2, options2);
        };
      };
      var humps2 = {
        camelize,
        decamelize,
        pascalize,
        depascalize: decamelize,
        camelizeKeys: function(object, options) {
          return _processKeys(_processor(camelize, options), object);
        },
        decamelizeKeys: function(object, options) {
          return _processKeys(_processor(decamelize, options), object, options);
        },
        pascalizeKeys: function(object, options) {
          return _processKeys(_processor(pascalize, options), object);
        },
        depascalizeKeys: function() {
          return this.decamelizeKeys.apply(this, arguments);
        }
      };
      if (module.exports) {
        module.exports = humps2;
      } else {
        global2.humps = humps2;
      }
    })(commonjsGlobal);
  })(humps$1);
  var humps = humps$1.exports;
  var _excluded = ["class", "style"];
  function styleToObject(style) {
    return style.split(";").map(function(s2) {
      return s2.trim();
    }).filter(function(s2) {
      return s2;
    }).reduce(function(output, pair) {
      var idx = pair.indexOf(":");
      var prop = humps.camelize(pair.slice(0, idx));
      var value = pair.slice(idx + 1).trim();
      output[prop] = value;
      return output;
    }, {});
  }
  function classToObject(classes) {
    return classes.split(/\s+/).reduce(function(output, className) {
      output[className] = true;
      return output;
    }, {});
  }
  function convert(abstractElement) {
    var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var attrs = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (typeof abstractElement === "string") {
      return abstractElement;
    }
    var children = (abstractElement.children || []).map(function(child) {
      return convert(child);
    });
    var mixins = Object.keys(abstractElement.attributes || {}).reduce(function(mixins2, key) {
      var value = abstractElement.attributes[key];
      switch (key) {
        case "class":
          mixins2.class = classToObject(value);
          break;
        case "style":
          mixins2.style = styleToObject(value);
          break;
        default:
          mixins2.attrs[key] = value;
      }
      return mixins2;
    }, {
      attrs: {},
      class: {},
      style: {}
    });
    attrs.class;
    var _attrs$style = attrs.style, aStyle = _attrs$style === void 0 ? {} : _attrs$style, otherAttrs = _objectWithoutProperties(attrs, _excluded);
    return vue.h(abstractElement.tag, _objectSpread2(_objectSpread2(_objectSpread2({}, props), {}, {
      class: mixins.class,
      style: _objectSpread2(_objectSpread2({}, mixins.style), aStyle)
    }, mixins.attrs), otherAttrs), children);
  }
  var PRODUCTION = false;
  try {
    PRODUCTION = true;
  } catch (e) {
  }
  function log() {
    if (!PRODUCTION && console && typeof console.error === "function") {
      var _console;
      (_console = console).error.apply(_console, arguments);
    }
  }
  function objectWithKey(key, value) {
    return Array.isArray(value) && value.length > 0 || !Array.isArray(value) && value ? _defineProperty({}, key, value) : {};
  }
  function classList(props) {
    var _classes;
    var classes = (_classes = {
      "fa-spin": props.spin,
      "fa-pulse": props.pulse,
      "fa-fw": props.fixedWidth,
      "fa-border": props.border,
      "fa-li": props.listItem,
      "fa-inverse": props.inverse,
      "fa-flip": props.flip === true,
      "fa-flip-horizontal": props.flip === "horizontal" || props.flip === "both",
      "fa-flip-vertical": props.flip === "vertical" || props.flip === "both"
    }, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_classes, "fa-".concat(props.size), props.size !== null), "fa-rotate-".concat(props.rotation), props.rotation !== null), "fa-pull-".concat(props.pull), props.pull !== null), "fa-swap-opacity", props.swapOpacity), "fa-bounce", props.bounce), "fa-shake", props.shake), "fa-beat", props.beat), "fa-fade", props.fade), "fa-beat-fade", props.beatFade), "fa-flash", props.flash), _defineProperty(_defineProperty(_classes, "fa-spin-pulse", props.spinPulse), "fa-spin-reverse", props.spinReverse));
    return Object.keys(classes).map(function(key) {
      return classes[key] ? key : null;
    }).filter(function(key) {
      return key;
    });
  }
  function normalizeIconArgs(icon2) {
    if (icon2 && _typeof(icon2) === "object" && icon2.prefix && icon2.iconName && icon2.icon) {
      return icon2;
    }
    if (fontawesomeSvgCore.parse.icon) {
      return fontawesomeSvgCore.parse.icon(icon2);
    }
    if (icon2 === null) {
      return null;
    }
    if (_typeof(icon2) === "object" && icon2.prefix && icon2.iconName) {
      return icon2;
    }
    if (Array.isArray(icon2) && icon2.length === 2) {
      return {
        prefix: icon2[0],
        iconName: icon2[1]
      };
    }
    if (typeof icon2 === "string") {
      return {
        prefix: "fas",
        iconName: icon2
      };
    }
  }
  var FontAwesomeIcon = vue.defineComponent({
    name: "FontAwesomeIcon",
    props: {
      border: {
        type: Boolean,
        default: false
      },
      fixedWidth: {
        type: Boolean,
        default: false
      },
      flip: {
        type: [Boolean, String],
        default: false,
        validator: function validator(value) {
          return [true, false, "horizontal", "vertical", "both"].indexOf(value) > -1;
        }
      },
      icon: {
        type: [Object, Array, String],
        required: true
      },
      mask: {
        type: [Object, Array, String],
        default: null
      },
      maskId: {
        type: String,
        default: null
      },
      listItem: {
        type: Boolean,
        default: false
      },
      pull: {
        type: String,
        default: null,
        validator: function validator2(value) {
          return ["right", "left"].indexOf(value) > -1;
        }
      },
      pulse: {
        type: Boolean,
        default: false
      },
      rotation: {
        type: [String, Number],
        default: null,
        validator: function validator3(value) {
          return [90, 180, 270].indexOf(Number.parseInt(value, 10)) > -1;
        }
      },
      swapOpacity: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: null,
        validator: function validator4(value) {
          return ["2xs", "xs", "sm", "lg", "xl", "2xl", "1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x"].indexOf(value) > -1;
        }
      },
      spin: {
        type: Boolean,
        default: false
      },
      transform: {
        type: [String, Object],
        default: null
      },
      symbol: {
        type: [Boolean, String],
        default: false
      },
      title: {
        type: String,
        default: null
      },
      titleId: {
        type: String,
        default: null
      },
      inverse: {
        type: Boolean,
        default: false
      },
      bounce: {
        type: Boolean,
        default: false
      },
      shake: {
        type: Boolean,
        default: false
      },
      beat: {
        type: Boolean,
        default: false
      },
      fade: {
        type: Boolean,
        default: false
      },
      beatFade: {
        type: Boolean,
        default: false
      },
      flash: {
        type: Boolean,
        default: false
      },
      spinPulse: {
        type: Boolean,
        default: false
      },
      spinReverse: {
        type: Boolean,
        default: false
      }
    },
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      var icon$1 = vue.computed(function() {
        return normalizeIconArgs(props.icon);
      });
      var classes = vue.computed(function() {
        return objectWithKey("classes", classList(props));
      });
      var transform = vue.computed(function() {
        return objectWithKey("transform", typeof props.transform === "string" ? fontawesomeSvgCore.parse.transform(props.transform) : props.transform);
      });
      var mask = vue.computed(function() {
        return objectWithKey("mask", normalizeIconArgs(props.mask));
      });
      var renderedIcon = vue.computed(function() {
        return fontawesomeSvgCore.icon(icon$1.value, _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, classes.value), transform.value), mask.value), {}, {
          symbol: props.symbol,
          title: props.title,
          titleId: props.titleId,
          maskId: props.maskId
        }));
      });
      vue.watch(renderedIcon, function(value) {
        if (!value) {
          return log("Could not find one or more icon(s)", icon$1.value, mask.value);
        }
      }, {
        immediate: true
      });
      var vnode = vue.computed(function() {
        return renderedIcon.value ? convert(renderedIcon.value.abstract[0], {}, attrs) : null;
      });
      return function() {
        return vnode.value;
      };
    }
  });
  vue.defineComponent({
    name: "FontAwesomeLayers",
    props: {
      fixedWidth: {
        type: Boolean,
        default: false
      }
    },
    setup: function setup2(props, _ref) {
      var slots = _ref.slots;
      var familyPrefix = fontawesomeSvgCore.config.familyPrefix;
      var className = vue.computed(function() {
        return ["".concat(familyPrefix, "-layers")].concat(_toConsumableArray(props.fixedWidth ? ["".concat(familyPrefix, "-fw")] : []));
      });
      return function() {
        return vue.h("div", {
          class: className.value
        }, slots.default ? slots.default() : []);
      };
    }
  });
  vue.defineComponent({
    name: "FontAwesomeLayersText",
    props: {
      value: {
        type: [String, Number],
        default: ""
      },
      transform: {
        type: [String, Object],
        default: null
      },
      counter: {
        type: Boolean,
        default: false
      },
      position: {
        type: String,
        default: null,
        validator: function validator5(value) {
          return ["bottom-left", "bottom-right", "top-left", "top-right"].indexOf(value) > -1;
        }
      }
    },
    setup: function setup3(props, _ref) {
      var attrs = _ref.attrs;
      var familyPrefix = fontawesomeSvgCore.config.familyPrefix;
      var classes = vue.computed(function() {
        return objectWithKey("classes", [].concat(_toConsumableArray(props.counter ? ["".concat(familyPrefix, "-layers-counter")] : []), _toConsumableArray(props.position ? ["".concat(familyPrefix, "-layers-").concat(props.position)] : [])));
      });
      var transform = vue.computed(function() {
        return objectWithKey("transform", typeof props.transform === "string" ? fontawesomeSvgCore.parse.transform(props.transform) : props.transform);
      });
      var abstractElement = vue.computed(function() {
        var _text = fontawesomeSvgCore.text(props.value.toString(), _objectSpread2(_objectSpread2({}, transform.value), classes.value)), abstract = _text.abstract;
        if (props.counter) {
          abstract[0].attributes.class = abstract[0].attributes.class.replace("fa-layers-text", "");
        }
        return abstract[0];
      });
      var vnode = vue.computed(function() {
        return convert(abstractElement.value, {}, attrs);
      });
      return function() {
        return vnode.value;
      };
    }
  });
  const useOptionsStore = pinia.defineStore("options", {
    state: () => ({
      hasEpisodes: true,
      sidebarVisible: true,
      sidebarHeight: false,
      searchVisible: false
    }),
    actions: {
      setHasEpisodes(value) {
        this.hasEpisodes = value;
      },
      setSidebarVisible(value) {
        this.sidebarVisible = value;
      },
      setSidebarHeight(value) {
        this.sidebarHeight = value;
      },
      toggleSearchVisible() {
        this.searchVisible = !this.searchVisible;
      },
      setSearchVisible(value) {
        this.searchVisible = value;
      }
    }
  });
  const _hoisted_1$e = ["title"];
  const _hoisted_2$c = ["title"];
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    __name: "ContentButtons",
    props: {
      isUiVisible: { type: Boolean }
    },
    setup(__props) {
      const optionsStore = useOptionsStore();
      const { sidebarVisible, sidebarHeight } = pinia.storeToRefs(optionsStore);
      const arrowUpDown = vue.computed(() => {
        return sidebarHeight.value ? freeSolidSvgIcons.faArrowUp : freeSolidSvgIcons.faArrowDown;
      });
      const arrowLeftRight = vue.computed(() => {
        return sidebarVisible.value ? freeSolidSvgIcons.faArrowRight : freeSolidSvgIcons.faArrowLeft;
      });
      const toggleSidebarTitleUpDown = vue.computed(() => {
        return sidebarHeight.value ? "Уменьшить по высоте" : "Увеличить по высоте";
      });
      const toggleSidebarTitleLeftRight = vue.computed(() => {
        return sidebarVisible.value ? "Свернуть меню" : "Развернуть меню";
      });
      return (_ctx, _cache) => {
        const _component_fa_icon = vue.resolveComponent("fa-icon");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([
            "sp-viewport_buttons",
            "sp-buttons",
            "group",
            { visible: _ctx.isUiVisible }
          ])
        }, [
          vue.createElementVNode("div", {
            class: "b-link_button is-icon size-lg",
            title: toggleSidebarTitleUpDown.value,
            onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(optionsStore).setSidebarHeight(!vue.unref(sidebarHeight)))
          }, [
            vue.createVNode(_component_fa_icon, { icon: arrowUpDown.value }, null, 8, ["icon"])
          ], 8, _hoisted_1$e),
          vue.createElementVNode("div", {
            class: "b-link_button is-icon size-lg",
            title: toggleSidebarTitleLeftRight.value,
            onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(optionsStore).setSidebarVisible(!vue.unref(sidebarVisible)))
          }, [
            vue.createVNode(_component_fa_icon, { icon: arrowLeftRight.value }, null, 8, ["icon"])
          ], 8, _hoisted_2$c)
        ], 2);
      };
    }
  });
  class ClientError extends Error {
    constructor(response, request) {
      const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({
      response,
      request
    })}`;
      super(message);
      __publicField(this, "response");
      __publicField(this, "request");
      Object.setPrototypeOf(this, ClientError.prototype);
      this.response = response;
      this.request = request;
      if (typeof Error.captureStackTrace === `function`) {
        Error.captureStackTrace(this, ClientError);
      }
    }
    static extractMessage(response) {
      var _a, _b;
      return ((_b = (_a = response.errors) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) ?? `GraphQL Error (Code: ${String(response.status)})`;
    }
  }
  const uppercase = (str) => str.toUpperCase();
  const callOrIdentity = (value) => {
    return typeof value === `function` ? value() : value;
  };
  const zip = (a, b) => a.map((k, i) => [k, b[i]]);
  const HeadersInitToPlainObject = (headers) => {
    let oHeaders = {};
    if (headers instanceof Headers) {
      oHeaders = HeadersInstanceToPlainObject(headers);
    } else if (Array.isArray(headers)) {
      headers.forEach(([name, value]) => {
        if (name && value !== void 0) {
          oHeaders[name] = value;
        }
      });
    } else if (headers) {
      oHeaders = headers;
    }
    return oHeaders;
  };
  const HeadersInstanceToPlainObject = (headers) => {
    const o = {};
    headers.forEach((v, k) => {
      o[k] = v;
    });
    return o;
  };
  const tryCatch = (fn) => {
    try {
      const result = fn();
      if (isPromiseLikeValue(result)) {
        return result.catch((error) => {
          return errorFromMaybeError(error);
        });
      }
      return result;
    } catch (error) {
      return errorFromMaybeError(error);
    }
  };
  const errorFromMaybeError = (maybeError) => {
    if (maybeError instanceof Error)
      return maybeError;
    return new Error(String(maybeError));
  };
  const isPromiseLikeValue = (value) => {
    return typeof value === `object` && value !== null && `then` in value && typeof value.then === `function` && `catch` in value && typeof value.catch === `function` && `finally` in value && typeof value.finally === `function`;
  };
  const casesExhausted = (value) => {
    throw new Error(`Unhandled case: ${String(value)}`);
  };
  const isPlainObject = (value) => {
    return typeof value === `object` && value !== null && !Array.isArray(value);
  };
  const parseBatchRequestArgs = (documentsOrOptions, requestHeaders) => {
    return documentsOrOptions.documents ? documentsOrOptions : {
      documents: documentsOrOptions,
      requestHeaders,
      signal: void 0
    };
  };
  const parseRawRequestArgs = (queryOrOptions, variables, requestHeaders) => {
    return queryOrOptions.query ? queryOrOptions : {
      query: queryOrOptions,
      variables,
      requestHeaders,
      signal: void 0
    };
  };
  function devAssert(condition, message) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
      throw new Error(message);
    }
  }
  function isObjectLike(value) {
    return typeof value == "object" && value !== null;
  }
  function invariant(condition, message) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
      throw new Error(
        "Unexpected invariant triggered."
      );
    }
  }
  const LineRegExp = /\r\n|[\n\r]/g;
  function getLocation(source, position) {
    let lastLineStart = 0;
    let line = 1;
    for (const match of source.body.matchAll(LineRegExp)) {
      typeof match.index === "number" || invariant(false);
      if (match.index >= position) {
        break;
      }
      lastLineStart = match.index + match[0].length;
      line += 1;
    }
    return {
      line,
      column: position + 1 - lastLineStart
    };
  }
  function printLocation(location) {
    return printSourceLocation(
      location.source,
      getLocation(location.source, location.start)
    );
  }
  function printSourceLocation(source, sourceLocation) {
    const firstLineColumnOffset = source.locationOffset.column - 1;
    const body = "".padStart(firstLineColumnOffset) + source.body;
    const lineIndex = sourceLocation.line - 1;
    const lineOffset = source.locationOffset.line - 1;
    const lineNum = sourceLocation.line + lineOffset;
    const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
    const columnNum = sourceLocation.column + columnOffset;
    const locationStr = `${source.name}:${lineNum}:${columnNum}
`;
    const lines = body.split(/\r\n|[\n\r]/g);
    const locationLine = lines[lineIndex];
    if (locationLine.length > 120) {
      const subLineIndex = Math.floor(columnNum / 80);
      const subLineColumnNum = columnNum % 80;
      const subLines = [];
      for (let i = 0; i < locationLine.length; i += 80) {
        subLines.push(locationLine.slice(i, i + 80));
      }
      return locationStr + printPrefixedLines([
        [`${lineNum} |`, subLines[0]],
        ...subLines.slice(1, subLineIndex + 1).map((subLine) => ["|", subLine]),
        ["|", "^".padStart(subLineColumnNum)],
        ["|", subLines[subLineIndex + 1]]
      ]);
    }
    return locationStr + printPrefixedLines([
      // Lines specified like this: ["prefix", "string"],
      [`${lineNum - 1} |`, lines[lineIndex - 1]],
      [`${lineNum} |`, locationLine],
      ["|", "^".padStart(columnNum)],
      [`${lineNum + 1} |`, lines[lineIndex + 1]]
    ]);
  }
  function printPrefixedLines(lines) {
    const existingLines = lines.filter(([_, line]) => line !== void 0);
    const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
    return existingLines.map(([prefix, line]) => prefix.padStart(padLen) + (line ? " " + line : "")).join("\n");
  }
  function toNormalizedOptions(args) {
    const firstArg = args[0];
    if (firstArg == null || "kind" in firstArg || "length" in firstArg) {
      return {
        nodes: firstArg,
        source: args[1],
        positions: args[2],
        path: args[3],
        originalError: args[4],
        extensions: args[5]
      };
    }
    return firstArg;
  }
  class GraphQLError extends Error {
    /**
     * An array of `{ line, column }` locations within the source GraphQL document
     * which correspond to this error.
     *
     * Errors during validation often contain multiple locations, for example to
     * point out two things with the same name. Errors during execution include a
     * single location, the field which produced the error.
     *
     * Enumerable, and appears in the result of JSON.stringify().
     */
    /**
     * An array describing the JSON-path into the execution response which
     * corresponds to this error. Only included for errors during execution.
     *
     * Enumerable, and appears in the result of JSON.stringify().
     */
    /**
     * An array of GraphQL AST Nodes corresponding to this error.
     */
    /**
     * The source GraphQL document for the first location of this error.
     *
     * Note that if this Error represents more than one node, the source may not
     * represent nodes after the first node.
     */
    /**
     * An array of character offsets within the source GraphQL document
     * which correspond to this error.
     */
    /**
     * The original error thrown from a field resolver during execution.
     */
    /**
     * Extension fields to add to the formatted error.
     */
    /**
     * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
     */
    constructor(message, ...rawArgs) {
      var _this$nodes, _nodeLocations$, _ref;
      const { nodes, source, positions, path, originalError, extensions } = toNormalizedOptions(rawArgs);
      super(message);
      this.name = "GraphQLError";
      this.path = path !== null && path !== void 0 ? path : void 0;
      this.originalError = originalError !== null && originalError !== void 0 ? originalError : void 0;
      this.nodes = undefinedIfEmpty(
        Array.isArray(nodes) ? nodes : nodes ? [nodes] : void 0
      );
      const nodeLocations = undefinedIfEmpty(
        (_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.map((node) => node.loc).filter((loc) => loc != null)
      );
      this.source = source !== null && source !== void 0 ? source : nodeLocations === null || nodeLocations === void 0 ? void 0 : (_nodeLocations$ = nodeLocations[0]) === null || _nodeLocations$ === void 0 ? void 0 : _nodeLocations$.source;
      this.positions = positions !== null && positions !== void 0 ? positions : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => loc.start);
      this.locations = positions && source ? positions.map((pos) => getLocation(source, pos)) : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => getLocation(loc.source, loc.start));
      const originalExtensions = isObjectLike(
        originalError === null || originalError === void 0 ? void 0 : originalError.extensions
      ) ? originalError === null || originalError === void 0 ? void 0 : originalError.extensions : void 0;
      this.extensions = (_ref = extensions !== null && extensions !== void 0 ? extensions : originalExtensions) !== null && _ref !== void 0 ? _ref : /* @__PURE__ */ Object.create(null);
      Object.defineProperties(this, {
        message: {
          writable: true,
          enumerable: true
        },
        name: {
          enumerable: false
        },
        nodes: {
          enumerable: false
        },
        source: {
          enumerable: false
        },
        positions: {
          enumerable: false
        },
        originalError: {
          enumerable: false
        }
      });
      if (originalError !== null && originalError !== void 0 && originalError.stack) {
        Object.defineProperty(this, "stack", {
          value: originalError.stack,
          writable: true,
          configurable: true
        });
      } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, GraphQLError);
      } else {
        Object.defineProperty(this, "stack", {
          value: Error().stack,
          writable: true,
          configurable: true
        });
      }
    }
    get [Symbol.toStringTag]() {
      return "GraphQLError";
    }
    toString() {
      let output = this.message;
      if (this.nodes) {
        for (const node of this.nodes) {
          if (node.loc) {
            output += "\n\n" + printLocation(node.loc);
          }
        }
      } else if (this.source && this.locations) {
        for (const location of this.locations) {
          output += "\n\n" + printSourceLocation(this.source, location);
        }
      }
      return output;
    }
    toJSON() {
      const formattedError = {
        message: this.message
      };
      if (this.locations != null) {
        formattedError.locations = this.locations;
      }
      if (this.path != null) {
        formattedError.path = this.path;
      }
      if (this.extensions != null && Object.keys(this.extensions).length > 0) {
        formattedError.extensions = this.extensions;
      }
      return formattedError;
    }
  }
  function undefinedIfEmpty(array) {
    return array === void 0 || array.length === 0 ? void 0 : array;
  }
  function syntaxError(source, position, description) {
    return new GraphQLError(`Syntax Error: ${description}`, {
      source,
      positions: [position]
    });
  }
  class Location {
    /**
     * The character offset at which this Node begins.
     */
    /**
     * The character offset at which this Node ends.
     */
    /**
     * The Token at which this Node begins.
     */
    /**
     * The Token at which this Node ends.
     */
    /**
     * The Source document the AST represents.
     */
    constructor(startToken, endToken, source) {
      this.start = startToken.start;
      this.end = endToken.end;
      this.startToken = startToken;
      this.endToken = endToken;
      this.source = source;
    }
    get [Symbol.toStringTag]() {
      return "Location";
    }
    toJSON() {
      return {
        start: this.start,
        end: this.end
      };
    }
  }
  class Token {
    /**
     * The kind of Token.
     */
    /**
     * The character offset at which this Node begins.
     */
    /**
     * The character offset at which this Node ends.
     */
    /**
     * The 1-indexed line number on which this Token appears.
     */
    /**
     * The 1-indexed column number at which this Token begins.
     */
    /**
     * For non-punctuation tokens, represents the interpreted value of the token.
     *
     * Note: is undefined for punctuation tokens, but typed as string for
     * convenience in the parser.
     */
    /**
     * Tokens exist as nodes in a double-linked-list amongst all tokens
     * including ignored tokens. <SOF> is always the first node and <EOF>
     * the last.
     */
    constructor(kind, start, end, line, column, value) {
      this.kind = kind;
      this.start = start;
      this.end = end;
      this.line = line;
      this.column = column;
      this.value = value;
      this.prev = null;
      this.next = null;
    }
    get [Symbol.toStringTag]() {
      return "Token";
    }
    toJSON() {
      return {
        kind: this.kind,
        value: this.value,
        line: this.line,
        column: this.column
      };
    }
  }
  const QueryDocumentKeys = {
    Name: [],
    Document: ["definitions"],
    OperationDefinition: [
      "name",
      "variableDefinitions",
      "directives",
      "selectionSet"
    ],
    VariableDefinition: ["variable", "type", "defaultValue", "directives"],
    Variable: ["name"],
    SelectionSet: ["selections"],
    Field: ["alias", "name", "arguments", "directives", "selectionSet"],
    Argument: ["name", "value"],
    FragmentSpread: ["name", "directives"],
    InlineFragment: ["typeCondition", "directives", "selectionSet"],
    FragmentDefinition: [
      "name",
      // Note: fragment variable definitions are deprecated and will removed in v17.0.0
      "variableDefinitions",
      "typeCondition",
      "directives",
      "selectionSet"
    ],
    IntValue: [],
    FloatValue: [],
    StringValue: [],
    BooleanValue: [],
    NullValue: [],
    EnumValue: [],
    ListValue: ["values"],
    ObjectValue: ["fields"],
    ObjectField: ["name", "value"],
    Directive: ["name", "arguments"],
    NamedType: ["name"],
    ListType: ["type"],
    NonNullType: ["type"],
    SchemaDefinition: ["description", "directives", "operationTypes"],
    OperationTypeDefinition: ["type"],
    ScalarTypeDefinition: ["description", "name", "directives"],
    ObjectTypeDefinition: [
      "description",
      "name",
      "interfaces",
      "directives",
      "fields"
    ],
    FieldDefinition: ["description", "name", "arguments", "type", "directives"],
    InputValueDefinition: [
      "description",
      "name",
      "type",
      "defaultValue",
      "directives"
    ],
    InterfaceTypeDefinition: [
      "description",
      "name",
      "interfaces",
      "directives",
      "fields"
    ],
    UnionTypeDefinition: ["description", "name", "directives", "types"],
    EnumTypeDefinition: ["description", "name", "directives", "values"],
    EnumValueDefinition: ["description", "name", "directives"],
    InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
    DirectiveDefinition: ["description", "name", "arguments", "locations"],
    SchemaExtension: ["directives", "operationTypes"],
    ScalarTypeExtension: ["name", "directives"],
    ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
    InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
    UnionTypeExtension: ["name", "directives", "types"],
    EnumTypeExtension: ["name", "directives", "values"],
    InputObjectTypeExtension: ["name", "directives", "fields"]
  };
  const kindValues = new Set(Object.keys(QueryDocumentKeys));
  function isNode(maybeNode) {
    const maybeKind = maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
    return typeof maybeKind === "string" && kindValues.has(maybeKind);
  }
  var OperationTypeNode;
  (function(OperationTypeNode2) {
    OperationTypeNode2["QUERY"] = "query";
    OperationTypeNode2["MUTATION"] = "mutation";
    OperationTypeNode2["SUBSCRIPTION"] = "subscription";
  })(OperationTypeNode || (OperationTypeNode = {}));
  var DirectiveLocation;
  (function(DirectiveLocation2) {
    DirectiveLocation2["QUERY"] = "QUERY";
    DirectiveLocation2["MUTATION"] = "MUTATION";
    DirectiveLocation2["SUBSCRIPTION"] = "SUBSCRIPTION";
    DirectiveLocation2["FIELD"] = "FIELD";
    DirectiveLocation2["FRAGMENT_DEFINITION"] = "FRAGMENT_DEFINITION";
    DirectiveLocation2["FRAGMENT_SPREAD"] = "FRAGMENT_SPREAD";
    DirectiveLocation2["INLINE_FRAGMENT"] = "INLINE_FRAGMENT";
    DirectiveLocation2["VARIABLE_DEFINITION"] = "VARIABLE_DEFINITION";
    DirectiveLocation2["SCHEMA"] = "SCHEMA";
    DirectiveLocation2["SCALAR"] = "SCALAR";
    DirectiveLocation2["OBJECT"] = "OBJECT";
    DirectiveLocation2["FIELD_DEFINITION"] = "FIELD_DEFINITION";
    DirectiveLocation2["ARGUMENT_DEFINITION"] = "ARGUMENT_DEFINITION";
    DirectiveLocation2["INTERFACE"] = "INTERFACE";
    DirectiveLocation2["UNION"] = "UNION";
    DirectiveLocation2["ENUM"] = "ENUM";
    DirectiveLocation2["ENUM_VALUE"] = "ENUM_VALUE";
    DirectiveLocation2["INPUT_OBJECT"] = "INPUT_OBJECT";
    DirectiveLocation2["INPUT_FIELD_DEFINITION"] = "INPUT_FIELD_DEFINITION";
  })(DirectiveLocation || (DirectiveLocation = {}));
  var Kind;
  (function(Kind2) {
    Kind2["NAME"] = "Name";
    Kind2["DOCUMENT"] = "Document";
    Kind2["OPERATION_DEFINITION"] = "OperationDefinition";
    Kind2["VARIABLE_DEFINITION"] = "VariableDefinition";
    Kind2["SELECTION_SET"] = "SelectionSet";
    Kind2["FIELD"] = "Field";
    Kind2["ARGUMENT"] = "Argument";
    Kind2["FRAGMENT_SPREAD"] = "FragmentSpread";
    Kind2["INLINE_FRAGMENT"] = "InlineFragment";
    Kind2["FRAGMENT_DEFINITION"] = "FragmentDefinition";
    Kind2["VARIABLE"] = "Variable";
    Kind2["INT"] = "IntValue";
    Kind2["FLOAT"] = "FloatValue";
    Kind2["STRING"] = "StringValue";
    Kind2["BOOLEAN"] = "BooleanValue";
    Kind2["NULL"] = "NullValue";
    Kind2["ENUM"] = "EnumValue";
    Kind2["LIST"] = "ListValue";
    Kind2["OBJECT"] = "ObjectValue";
    Kind2["OBJECT_FIELD"] = "ObjectField";
    Kind2["DIRECTIVE"] = "Directive";
    Kind2["NAMED_TYPE"] = "NamedType";
    Kind2["LIST_TYPE"] = "ListType";
    Kind2["NON_NULL_TYPE"] = "NonNullType";
    Kind2["SCHEMA_DEFINITION"] = "SchemaDefinition";
    Kind2["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
    Kind2["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
    Kind2["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
    Kind2["FIELD_DEFINITION"] = "FieldDefinition";
    Kind2["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
    Kind2["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
    Kind2["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
    Kind2["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
    Kind2["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
    Kind2["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
    Kind2["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
    Kind2["SCHEMA_EXTENSION"] = "SchemaExtension";
    Kind2["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
    Kind2["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
    Kind2["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
    Kind2["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
    Kind2["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
    Kind2["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
  })(Kind || (Kind = {}));
  function isWhiteSpace(code) {
    return code === 9 || code === 32;
  }
  function isDigit(code) {
    return code >= 48 && code <= 57;
  }
  function isLetter(code) {
    return code >= 97 && code <= 122 || // A-Z
    code >= 65 && code <= 90;
  }
  function isNameStart(code) {
    return isLetter(code) || code === 95;
  }
  function isNameContinue(code) {
    return isLetter(code) || isDigit(code) || code === 95;
  }
  function dedentBlockStringLines(lines) {
    var _firstNonEmptyLine2;
    let commonIndent = Number.MAX_SAFE_INTEGER;
    let firstNonEmptyLine = null;
    let lastNonEmptyLine = -1;
    for (let i = 0; i < lines.length; ++i) {
      var _firstNonEmptyLine;
      const line = lines[i];
      const indent2 = leadingWhitespace(line);
      if (indent2 === line.length) {
        continue;
      }
      firstNonEmptyLine = (_firstNonEmptyLine = firstNonEmptyLine) !== null && _firstNonEmptyLine !== void 0 ? _firstNonEmptyLine : i;
      lastNonEmptyLine = i;
      if (i !== 0 && indent2 < commonIndent) {
        commonIndent = indent2;
      }
    }
    return lines.map((line, i) => i === 0 ? line : line.slice(commonIndent)).slice(
      (_firstNonEmptyLine2 = firstNonEmptyLine) !== null && _firstNonEmptyLine2 !== void 0 ? _firstNonEmptyLine2 : 0,
      lastNonEmptyLine + 1
    );
  }
  function leadingWhitespace(str) {
    let i = 0;
    while (i < str.length && isWhiteSpace(str.charCodeAt(i))) {
      ++i;
    }
    return i;
  }
  function printBlockString(value, options) {
    const escapedValue = value.replace(/"""/g, '\\"""');
    const lines = escapedValue.split(/\r\n|[\n\r]/g);
    const isSingleLine = lines.length === 1;
    const forceLeadingNewLine = lines.length > 1 && lines.slice(1).every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0)));
    const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""');
    const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
    const hasTrailingSlash = value.endsWith("\\");
    const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
    const printAsMultipleLines = (
      // add leading and trailing new lines only if it improves readability
      !isSingleLine || value.length > 70 || forceTrailingNewline || forceLeadingNewLine || hasTrailingTripleQuotes
    );
    let result = "";
    const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));
    if (printAsMultipleLines && !skipLeadingNewLine || forceLeadingNewLine) {
      result += "\n";
    }
    result += escapedValue;
    if (printAsMultipleLines || forceTrailingNewline) {
      result += "\n";
    }
    return '"""' + result + '"""';
  }
  var TokenKind;
  (function(TokenKind2) {
    TokenKind2["SOF"] = "<SOF>";
    TokenKind2["EOF"] = "<EOF>";
    TokenKind2["BANG"] = "!";
    TokenKind2["DOLLAR"] = "$";
    TokenKind2["AMP"] = "&";
    TokenKind2["PAREN_L"] = "(";
    TokenKind2["PAREN_R"] = ")";
    TokenKind2["SPREAD"] = "...";
    TokenKind2["COLON"] = ":";
    TokenKind2["EQUALS"] = "=";
    TokenKind2["AT"] = "@";
    TokenKind2["BRACKET_L"] = "[";
    TokenKind2["BRACKET_R"] = "]";
    TokenKind2["BRACE_L"] = "{";
    TokenKind2["PIPE"] = "|";
    TokenKind2["BRACE_R"] = "}";
    TokenKind2["NAME"] = "Name";
    TokenKind2["INT"] = "Int";
    TokenKind2["FLOAT"] = "Float";
    TokenKind2["STRING"] = "String";
    TokenKind2["BLOCK_STRING"] = "BlockString";
    TokenKind2["COMMENT"] = "Comment";
  })(TokenKind || (TokenKind = {}));
  class Lexer {
    /**
     * The previously focused non-ignored token.
     */
    /**
     * The currently focused non-ignored token.
     */
    /**
     * The (1-indexed) line containing the current token.
     */
    /**
     * The character offset at which the current line begins.
     */
    constructor(source) {
      const startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0);
      this.source = source;
      this.lastToken = startOfFileToken;
      this.token = startOfFileToken;
      this.line = 1;
      this.lineStart = 0;
    }
    get [Symbol.toStringTag]() {
      return "Lexer";
    }
    /**
     * Advances the token stream to the next non-ignored token.
     */
    advance() {
      this.lastToken = this.token;
      const token = this.token = this.lookahead();
      return token;
    }
    /**
     * Looks ahead and returns the next non-ignored token, but does not change
     * the state of Lexer.
     */
    lookahead() {
      let token = this.token;
      if (token.kind !== TokenKind.EOF) {
        do {
          if (token.next) {
            token = token.next;
          } else {
            const nextToken = readNextToken(this, token.end);
            token.next = nextToken;
            nextToken.prev = token;
            token = nextToken;
          }
        } while (token.kind === TokenKind.COMMENT);
      }
      return token;
    }
  }
  function isPunctuatorTokenKind(kind) {
    return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
  }
  function isUnicodeScalarValue(code) {
    return code >= 0 && code <= 55295 || code >= 57344 && code <= 1114111;
  }
  function isSupplementaryCodePoint(body, location) {
    return isLeadingSurrogate(body.charCodeAt(location)) && isTrailingSurrogate(body.charCodeAt(location + 1));
  }
  function isLeadingSurrogate(code) {
    return code >= 55296 && code <= 56319;
  }
  function isTrailingSurrogate(code) {
    return code >= 56320 && code <= 57343;
  }
  function printCodePointAt(lexer, location) {
    const code = lexer.source.body.codePointAt(location);
    if (code === void 0) {
      return TokenKind.EOF;
    } else if (code >= 32 && code <= 126) {
      const char = String.fromCodePoint(code);
      return char === '"' ? `'"'` : `"${char}"`;
    }
    return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
  }
  function createToken(lexer, kind, start, end, value) {
    const line = lexer.line;
    const col = 1 + start - lexer.lineStart;
    return new Token(kind, start, end, line, col, value);
  }
  function readNextToken(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let position = start;
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      switch (code) {
        case 65279:
        case 9:
        case 32:
        case 44:
          ++position;
          continue;
        case 10:
          ++position;
          ++lexer.line;
          lexer.lineStart = position;
          continue;
        case 13:
          if (body.charCodeAt(position + 1) === 10) {
            position += 2;
          } else {
            ++position;
          }
          ++lexer.line;
          lexer.lineStart = position;
          continue;
        case 35:
          return readComment(lexer, position);
        case 33:
          return createToken(lexer, TokenKind.BANG, position, position + 1);
        case 36:
          return createToken(lexer, TokenKind.DOLLAR, position, position + 1);
        case 38:
          return createToken(lexer, TokenKind.AMP, position, position + 1);
        case 40:
          return createToken(lexer, TokenKind.PAREN_L, position, position + 1);
        case 41:
          return createToken(lexer, TokenKind.PAREN_R, position, position + 1);
        case 46:
          if (body.charCodeAt(position + 1) === 46 && body.charCodeAt(position + 2) === 46) {
            return createToken(lexer, TokenKind.SPREAD, position, position + 3);
          }
          break;
        case 58:
          return createToken(lexer, TokenKind.COLON, position, position + 1);
        case 61:
          return createToken(lexer, TokenKind.EQUALS, position, position + 1);
        case 64:
          return createToken(lexer, TokenKind.AT, position, position + 1);
        case 91:
          return createToken(lexer, TokenKind.BRACKET_L, position, position + 1);
        case 93:
          return createToken(lexer, TokenKind.BRACKET_R, position, position + 1);
        case 123:
          return createToken(lexer, TokenKind.BRACE_L, position, position + 1);
        case 124:
          return createToken(lexer, TokenKind.PIPE, position, position + 1);
        case 125:
          return createToken(lexer, TokenKind.BRACE_R, position, position + 1);
        case 34:
          if (body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
            return readBlockString(lexer, position);
          }
          return readString(lexer, position);
      }
      if (isDigit(code) || code === 45) {
        return readNumber(lexer, position, code);
      }
      if (isNameStart(code)) {
        return readName(lexer, position);
      }
      throw syntaxError(
        lexer.source,
        position,
        code === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position) ? `Unexpected character: ${printCodePointAt(lexer, position)}.` : `Invalid character: ${printCodePointAt(lexer, position)}.`
      );
    }
    return createToken(lexer, TokenKind.EOF, bodyLength, bodyLength);
  }
  function readComment(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let position = start + 1;
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (code === 10 || code === 13) {
        break;
      }
      if (isUnicodeScalarValue(code)) {
        ++position;
      } else if (isSupplementaryCodePoint(body, position)) {
        position += 2;
      } else {
        break;
      }
    }
    return createToken(
      lexer,
      TokenKind.COMMENT,
      start,
      position,
      body.slice(start + 1, position)
    );
  }
  function readNumber(lexer, start, firstCode) {
    const body = lexer.source.body;
    let position = start;
    let code = firstCode;
    let isFloat = false;
    if (code === 45) {
      code = body.charCodeAt(++position);
    }
    if (code === 48) {
      code = body.charCodeAt(++position);
      if (isDigit(code)) {
        throw syntaxError(
          lexer.source,
          position,
          `Invalid number, unexpected digit after 0: ${printCodePointAt(
          lexer,
          position
        )}.`
        );
      }
    } else {
      position = readDigits(lexer, position, code);
      code = body.charCodeAt(position);
    }
    if (code === 46) {
      isFloat = true;
      code = body.charCodeAt(++position);
      position = readDigits(lexer, position, code);
      code = body.charCodeAt(position);
    }
    if (code === 69 || code === 101) {
      isFloat = true;
      code = body.charCodeAt(++position);
      if (code === 43 || code === 45) {
        code = body.charCodeAt(++position);
      }
      position = readDigits(lexer, position, code);
      code = body.charCodeAt(position);
    }
    if (code === 46 || isNameStart(code)) {
      throw syntaxError(
        lexer.source,
        position,
        `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        position
      )}.`
      );
    }
    return createToken(
      lexer,
      isFloat ? TokenKind.FLOAT : TokenKind.INT,
      start,
      position,
      body.slice(start, position)
    );
  }
  function readDigits(lexer, start, firstCode) {
    if (!isDigit(firstCode)) {
      throw syntaxError(
        lexer.source,
        start,
        `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        start
      )}.`
      );
    }
    const body = lexer.source.body;
    let position = start + 1;
    while (isDigit(body.charCodeAt(position))) {
      ++position;
    }
    return position;
  }
  function readString(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let position = start + 1;
    let chunkStart = position;
    let value = "";
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (code === 34) {
        value += body.slice(chunkStart, position);
        return createToken(lexer, TokenKind.STRING, start, position + 1, value);
      }
      if (code === 92) {
        value += body.slice(chunkStart, position);
        const escape = body.charCodeAt(position + 1) === 117 ? body.charCodeAt(position + 2) === 123 ? readEscapedUnicodeVariableWidth(lexer, position) : readEscapedUnicodeFixedWidth(lexer, position) : readEscapedCharacter(lexer, position);
        value += escape.value;
        position += escape.size;
        chunkStart = position;
        continue;
      }
      if (code === 10 || code === 13) {
        break;
      }
      if (isUnicodeScalarValue(code)) {
        ++position;
      } else if (isSupplementaryCodePoint(body, position)) {
        position += 2;
      } else {
        throw syntaxError(
          lexer.source,
          position,
          `Invalid character within String: ${printCodePointAt(
          lexer,
          position
        )}.`
        );
      }
    }
    throw syntaxError(lexer.source, position, "Unterminated string.");
  }
  function readEscapedUnicodeVariableWidth(lexer, position) {
    const body = lexer.source.body;
    let point = 0;
    let size = 3;
    while (size < 12) {
      const code = body.charCodeAt(position + size++);
      if (code === 125) {
        if (size < 5 || !isUnicodeScalarValue(point)) {
          break;
        }
        return {
          value: String.fromCodePoint(point),
          size
        };
      }
      point = point << 4 | readHexDigit(code);
      if (point < 0) {
        break;
      }
    }
    throw syntaxError(
      lexer.source,
      position,
      `Invalid Unicode escape sequence: "${body.slice(
      position,
      position + size
    )}".`
    );
  }
  function readEscapedUnicodeFixedWidth(lexer, position) {
    const body = lexer.source.body;
    const code = read16BitHexCode(body, position + 2);
    if (isUnicodeScalarValue(code)) {
      return {
        value: String.fromCodePoint(code),
        size: 6
      };
    }
    if (isLeadingSurrogate(code)) {
      if (body.charCodeAt(position + 6) === 92 && body.charCodeAt(position + 7) === 117) {
        const trailingCode = read16BitHexCode(body, position + 8);
        if (isTrailingSurrogate(trailingCode)) {
          return {
            value: String.fromCodePoint(code, trailingCode),
            size: 12
          };
        }
      }
    }
    throw syntaxError(
      lexer.source,
      position,
      `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`
    );
  }
  function read16BitHexCode(body, position) {
    return readHexDigit(body.charCodeAt(position)) << 12 | readHexDigit(body.charCodeAt(position + 1)) << 8 | readHexDigit(body.charCodeAt(position + 2)) << 4 | readHexDigit(body.charCodeAt(position + 3));
  }
  function readHexDigit(code) {
    return code >= 48 && code <= 57 ? code - 48 : code >= 65 && code <= 70 ? code - 55 : code >= 97 && code <= 102 ? code - 87 : -1;
  }
  function readEscapedCharacter(lexer, position) {
    const body = lexer.source.body;
    const code = body.charCodeAt(position + 1);
    switch (code) {
      case 34:
        return {
          value: '"',
          size: 2
        };
      case 92:
        return {
          value: "\\",
          size: 2
        };
      case 47:
        return {
          value: "/",
          size: 2
        };
      case 98:
        return {
          value: "\b",
          size: 2
        };
      case 102:
        return {
          value: "\f",
          size: 2
        };
      case 110:
        return {
          value: "\n",
          size: 2
        };
      case 114:
        return {
          value: "\r",
          size: 2
        };
      case 116:
        return {
          value: "	",
          size: 2
        };
    }
    throw syntaxError(
      lexer.source,
      position,
      `Invalid character escape sequence: "${body.slice(
      position,
      position + 2
    )}".`
    );
  }
  function readBlockString(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let lineStart = lexer.lineStart;
    let position = start + 3;
    let chunkStart = position;
    let currentLine = "";
    const blockLines = [];
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
        currentLine += body.slice(chunkStart, position);
        blockLines.push(currentLine);
        const token = createToken(
          lexer,
          TokenKind.BLOCK_STRING,
          start,
          position + 3,
          // Return a string of the lines joined with U+000A.
          dedentBlockStringLines(blockLines).join("\n")
        );
        lexer.line += blockLines.length - 1;
        lexer.lineStart = lineStart;
        return token;
      }
      if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
        currentLine += body.slice(chunkStart, position);
        chunkStart = position + 1;
        position += 4;
        continue;
      }
      if (code === 10 || code === 13) {
        currentLine += body.slice(chunkStart, position);
        blockLines.push(currentLine);
        if (code === 13 && body.charCodeAt(position + 1) === 10) {
          position += 2;
        } else {
          ++position;
        }
        currentLine = "";
        chunkStart = position;
        lineStart = position;
        continue;
      }
      if (isUnicodeScalarValue(code)) {
        ++position;
      } else if (isSupplementaryCodePoint(body, position)) {
        position += 2;
      } else {
        throw syntaxError(
          lexer.source,
          position,
          `Invalid character within String: ${printCodePointAt(
          lexer,
          position
        )}.`
        );
      }
    }
    throw syntaxError(lexer.source, position, "Unterminated string.");
  }
  function readName(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let position = start + 1;
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (isNameContinue(code)) {
        ++position;
      } else {
        break;
      }
    }
    return createToken(
      lexer,
      TokenKind.NAME,
      start,
      position,
      body.slice(start, position)
    );
  }
  const MAX_ARRAY_LENGTH = 10;
  const MAX_RECURSIVE_DEPTH = 2;
  function inspect(value) {
    return formatValue(value, []);
  }
  function formatValue(value, seenValues) {
    switch (typeof value) {
      case "string":
        return JSON.stringify(value);
      case "function":
        return value.name ? `[function ${value.name}]` : "[function]";
      case "object":
        return formatObjectValue(value, seenValues);
      default:
        return String(value);
    }
  }
  function formatObjectValue(value, previouslySeenValues) {
    if (value === null) {
      return "null";
    }
    if (previouslySeenValues.includes(value)) {
      return "[Circular]";
    }
    const seenValues = [...previouslySeenValues, value];
    if (isJSONable(value)) {
      const jsonValue = value.toJSON();
      if (jsonValue !== value) {
        return typeof jsonValue === "string" ? jsonValue : formatValue(jsonValue, seenValues);
      }
    } else if (Array.isArray(value)) {
      return formatArray(value, seenValues);
    }
    return formatObject(value, seenValues);
  }
  function isJSONable(value) {
    return typeof value.toJSON === "function";
  }
  function formatObject(object, seenValues) {
    const entries = Object.entries(object);
    if (entries.length === 0) {
      return "{}";
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
      return "[" + getObjectTag(object) + "]";
    }
    const properties = entries.map(
      ([key, value]) => key + ": " + formatValue(value, seenValues)
    );
    return "{ " + properties.join(", ") + " }";
  }
  function formatArray(array, seenValues) {
    if (array.length === 0) {
      return "[]";
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
      return "[Array]";
    }
    const len = Math.min(MAX_ARRAY_LENGTH, array.length);
    const remaining = array.length - len;
    const items = [];
    for (let i = 0; i < len; ++i) {
      items.push(formatValue(array[i], seenValues));
    }
    if (remaining === 1) {
      items.push("... 1 more item");
    } else if (remaining > 1) {
      items.push(`... ${remaining} more items`);
    }
    return "[" + items.join(", ") + "]";
  }
  function getObjectTag(object) {
    const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
    if (tag === "Object" && typeof object.constructor === "function") {
      const name = object.constructor.name;
      if (typeof name === "string" && name !== "") {
        return name;
      }
    }
    return tag;
  }
  const isProduction = globalThis.process && // eslint-disable-next-line no-undef
  true;
  const instanceOf = (
    /* c8 ignore next 6 */
    // FIXME: https://github.com/graphql/graphql-js/issues/2317
    isProduction ? function instanceOf2(value, constructor) {
      return value instanceof constructor;
    } : function instanceOf3(value, constructor) {
      if (value instanceof constructor) {
        return true;
      }
      if (typeof value === "object" && value !== null) {
        var _value$constructor;
        const className = constructor.prototype[Symbol.toStringTag];
        const valueClassName = (
          // We still need to support constructor's name to detect conflicts with older versions of this library.
          Symbol.toStringTag in value ? value[Symbol.toStringTag] : (_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name
        );
        if (className === valueClassName) {
          const stringifiedValue = inspect(value);
          throw new Error(`Cannot use ${className} "${stringifiedValue}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
        }
      }
      return false;
    }
  );
  class Source {
    constructor(body, name = "GraphQL request", locationOffset = {
      line: 1,
      column: 1
    }) {
      typeof body === "string" || devAssert(false, `Body must be a string. Received: ${inspect(body)}.`);
      this.body = body;
      this.name = name;
      this.locationOffset = locationOffset;
      this.locationOffset.line > 0 || devAssert(
        false,
        "line in locationOffset is 1-indexed and must be positive."
      );
      this.locationOffset.column > 0 || devAssert(
        false,
        "column in locationOffset is 1-indexed and must be positive."
      );
    }
    get [Symbol.toStringTag]() {
      return "Source";
    }
  }
  function isSource(source) {
    return instanceOf(source, Source);
  }
  function parse(source, options) {
    const parser = new Parser(source, options);
    return parser.parseDocument();
  }
  class Parser {
    constructor(source, options = {}) {
      const sourceObj = isSource(source) ? source : new Source(source);
      this._lexer = new Lexer(sourceObj);
      this._options = options;
      this._tokenCounter = 0;
    }
    /**
     * Converts a name lex token into a name parse node.
     */
    parseName() {
      const token = this.expectToken(TokenKind.NAME);
      return this.node(token, {
        kind: Kind.NAME,
        value: token.value
      });
    }
    // Implements the parsing rules in the Document section.
    /**
     * Document : Definition+
     */
    parseDocument() {
      return this.node(this._lexer.token, {
        kind: Kind.DOCUMENT,
        definitions: this.many(
          TokenKind.SOF,
          this.parseDefinition,
          TokenKind.EOF
        )
      });
    }
    /**
     * Definition :
     *   - ExecutableDefinition
     *   - TypeSystemDefinition
     *   - TypeSystemExtension
     *
     * ExecutableDefinition :
     *   - OperationDefinition
     *   - FragmentDefinition
     *
     * TypeSystemDefinition :
     *   - SchemaDefinition
     *   - TypeDefinition
     *   - DirectiveDefinition
     *
     * TypeDefinition :
     *   - ScalarTypeDefinition
     *   - ObjectTypeDefinition
     *   - InterfaceTypeDefinition
     *   - UnionTypeDefinition
     *   - EnumTypeDefinition
     *   - InputObjectTypeDefinition
     */
    parseDefinition() {
      if (this.peek(TokenKind.BRACE_L)) {
        return this.parseOperationDefinition();
      }
      const hasDescription = this.peekDescription();
      const keywordToken = hasDescription ? this._lexer.lookahead() : this._lexer.token;
      if (keywordToken.kind === TokenKind.NAME) {
        switch (keywordToken.value) {
          case "schema":
            return this.parseSchemaDefinition();
          case "scalar":
            return this.parseScalarTypeDefinition();
          case "type":
            return this.parseObjectTypeDefinition();
          case "interface":
            return this.parseInterfaceTypeDefinition();
          case "union":
            return this.parseUnionTypeDefinition();
          case "enum":
            return this.parseEnumTypeDefinition();
          case "input":
            return this.parseInputObjectTypeDefinition();
          case "directive":
            return this.parseDirectiveDefinition();
        }
        if (hasDescription) {
          throw syntaxError(
            this._lexer.source,
            this._lexer.token.start,
            "Unexpected description, descriptions are supported only on type definitions."
          );
        }
        switch (keywordToken.value) {
          case "query":
          case "mutation":
          case "subscription":
            return this.parseOperationDefinition();
          case "fragment":
            return this.parseFragmentDefinition();
          case "extend":
            return this.parseTypeSystemExtension();
        }
      }
      throw this.unexpected(keywordToken);
    }
    // Implements the parsing rules in the Operations section.
    /**
     * OperationDefinition :
     *  - SelectionSet
     *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
     */
    parseOperationDefinition() {
      const start = this._lexer.token;
      if (this.peek(TokenKind.BRACE_L)) {
        return this.node(start, {
          kind: Kind.OPERATION_DEFINITION,
          operation: OperationTypeNode.QUERY,
          name: void 0,
          variableDefinitions: [],
          directives: [],
          selectionSet: this.parseSelectionSet()
        });
      }
      const operation = this.parseOperationType();
      let name;
      if (this.peek(TokenKind.NAME)) {
        name = this.parseName();
      }
      return this.node(start, {
        kind: Kind.OPERATION_DEFINITION,
        operation,
        name,
        variableDefinitions: this.parseVariableDefinitions(),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    /**
     * OperationType : one of query mutation subscription
     */
    parseOperationType() {
      const operationToken = this.expectToken(TokenKind.NAME);
      switch (operationToken.value) {
        case "query":
          return OperationTypeNode.QUERY;
        case "mutation":
          return OperationTypeNode.MUTATION;
        case "subscription":
          return OperationTypeNode.SUBSCRIPTION;
      }
      throw this.unexpected(operationToken);
    }
    /**
     * VariableDefinitions : ( VariableDefinition+ )
     */
    parseVariableDefinitions() {
      return this.optionalMany(
        TokenKind.PAREN_L,
        this.parseVariableDefinition,
        TokenKind.PAREN_R
      );
    }
    /**
     * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
     */
    parseVariableDefinition() {
      return this.node(this._lexer.token, {
        kind: Kind.VARIABLE_DEFINITION,
        variable: this.parseVariable(),
        type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
        defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseConstValueLiteral() : void 0,
        directives: this.parseConstDirectives()
      });
    }
    /**
     * Variable : $ Name
     */
    parseVariable() {
      const start = this._lexer.token;
      this.expectToken(TokenKind.DOLLAR);
      return this.node(start, {
        kind: Kind.VARIABLE,
        name: this.parseName()
      });
    }
    /**
     * ```
     * SelectionSet : { Selection+ }
     * ```
     */
    parseSelectionSet() {
      return this.node(this._lexer.token, {
        kind: Kind.SELECTION_SET,
        selections: this.many(
          TokenKind.BRACE_L,
          this.parseSelection,
          TokenKind.BRACE_R
        )
      });
    }
    /**
     * Selection :
     *   - Field
     *   - FragmentSpread
     *   - InlineFragment
     */
    parseSelection() {
      return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
    }
    /**
     * Field : Alias? Name Arguments? Directives? SelectionSet?
     *
     * Alias : Name :
     */
    parseField() {
      const start = this._lexer.token;
      const nameOrAlias = this.parseName();
      let alias;
      let name;
      if (this.expectOptionalToken(TokenKind.COLON)) {
        alias = nameOrAlias;
        name = this.parseName();
      } else {
        name = nameOrAlias;
      }
      return this.node(start, {
        kind: Kind.FIELD,
        alias,
        name,
        arguments: this.parseArguments(false),
        directives: this.parseDirectives(false),
        selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0
      });
    }
    /**
     * Arguments[Const] : ( Argument[?Const]+ )
     */
    parseArguments(isConst) {
      const item = isConst ? this.parseConstArgument : this.parseArgument;
      return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
    }
    /**
     * Argument[Const] : Name : Value[?Const]
     */
    parseArgument(isConst = false) {
      const start = this._lexer.token;
      const name = this.parseName();
      this.expectToken(TokenKind.COLON);
      return this.node(start, {
        kind: Kind.ARGUMENT,
        name,
        value: this.parseValueLiteral(isConst)
      });
    }
    parseConstArgument() {
      return this.parseArgument(true);
    }
    // Implements the parsing rules in the Fragments section.
    /**
     * Corresponds to both FragmentSpread and InlineFragment in the spec.
     *
     * FragmentSpread : ... FragmentName Directives?
     *
     * InlineFragment : ... TypeCondition? Directives? SelectionSet
     */
    parseFragment() {
      const start = this._lexer.token;
      this.expectToken(TokenKind.SPREAD);
      const hasTypeCondition = this.expectOptionalKeyword("on");
      if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
        return this.node(start, {
          kind: Kind.FRAGMENT_SPREAD,
          name: this.parseFragmentName(),
          directives: this.parseDirectives(false)
        });
      }
      return this.node(start, {
        kind: Kind.INLINE_FRAGMENT,
        typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    /**
     * FragmentDefinition :
     *   - fragment FragmentName on TypeCondition Directives? SelectionSet
     *
     * TypeCondition : NamedType
     */
    parseFragmentDefinition() {
      const start = this._lexer.token;
      this.expectKeyword("fragment");
      if (this._options.allowLegacyFragmentVariables === true) {
        return this.node(start, {
          kind: Kind.FRAGMENT_DEFINITION,
          name: this.parseFragmentName(),
          variableDefinitions: this.parseVariableDefinitions(),
          typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet()
        });
      }
      return this.node(start, {
        kind: Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    /**
     * FragmentName : Name but not `on`
     */
    parseFragmentName() {
      if (this._lexer.token.value === "on") {
        throw this.unexpected();
      }
      return this.parseName();
    }
    // Implements the parsing rules in the Values section.
    /**
     * Value[Const] :
     *   - [~Const] Variable
     *   - IntValue
     *   - FloatValue
     *   - StringValue
     *   - BooleanValue
     *   - NullValue
     *   - EnumValue
     *   - ListValue[?Const]
     *   - ObjectValue[?Const]
     *
     * BooleanValue : one of `true` `false`
     *
     * NullValue : `null`
     *
     * EnumValue : Name but not `true`, `false` or `null`
     */
    parseValueLiteral(isConst) {
      const token = this._lexer.token;
      switch (token.kind) {
        case TokenKind.BRACKET_L:
          return this.parseList(isConst);
        case TokenKind.BRACE_L:
          return this.parseObject(isConst);
        case TokenKind.INT:
          this.advanceLexer();
          return this.node(token, {
            kind: Kind.INT,
            value: token.value
          });
        case TokenKind.FLOAT:
          this.advanceLexer();
          return this.node(token, {
            kind: Kind.FLOAT,
            value: token.value
          });
        case TokenKind.STRING:
        case TokenKind.BLOCK_STRING:
          return this.parseStringLiteral();
        case TokenKind.NAME:
          this.advanceLexer();
          switch (token.value) {
            case "true":
              return this.node(token, {
                kind: Kind.BOOLEAN,
                value: true
              });
            case "false":
              return this.node(token, {
                kind: Kind.BOOLEAN,
                value: false
              });
            case "null":
              return this.node(token, {
                kind: Kind.NULL
              });
            default:
              return this.node(token, {
                kind: Kind.ENUM,
                value: token.value
              });
          }
        case TokenKind.DOLLAR:
          if (isConst) {
            this.expectToken(TokenKind.DOLLAR);
            if (this._lexer.token.kind === TokenKind.NAME) {
              const varName = this._lexer.token.value;
              throw syntaxError(
                this._lexer.source,
                token.start,
                `Unexpected variable "$${varName}" in constant value.`
              );
            } else {
              throw this.unexpected(token);
            }
          }
          return this.parseVariable();
        default:
          throw this.unexpected();
      }
    }
    parseConstValueLiteral() {
      return this.parseValueLiteral(true);
    }
    parseStringLiteral() {
      const token = this._lexer.token;
      this.advanceLexer();
      return this.node(token, {
        kind: Kind.STRING,
        value: token.value,
        block: token.kind === TokenKind.BLOCK_STRING
      });
    }
    /**
     * ListValue[Const] :
     *   - [ ]
     *   - [ Value[?Const]+ ]
     */
    parseList(isConst) {
      const item = () => this.parseValueLiteral(isConst);
      return this.node(this._lexer.token, {
        kind: Kind.LIST,
        values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R)
      });
    }
    /**
     * ```
     * ObjectValue[Const] :
     *   - { }
     *   - { ObjectField[?Const]+ }
     * ```
     */
    parseObject(isConst) {
      const item = () => this.parseObjectField(isConst);
      return this.node(this._lexer.token, {
        kind: Kind.OBJECT,
        fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R)
      });
    }
    /**
     * ObjectField[Const] : Name : Value[?Const]
     */
    parseObjectField(isConst) {
      const start = this._lexer.token;
      const name = this.parseName();
      this.expectToken(TokenKind.COLON);
      return this.node(start, {
        kind: Kind.OBJECT_FIELD,
        name,
        value: this.parseValueLiteral(isConst)
      });
    }
    // Implements the parsing rules in the Directives section.
    /**
     * Directives[Const] : Directive[?Const]+
     */
    parseDirectives(isConst) {
      const directives = [];
      while (this.peek(TokenKind.AT)) {
        directives.push(this.parseDirective(isConst));
      }
      return directives;
    }
    parseConstDirectives() {
      return this.parseDirectives(true);
    }
    /**
     * ```
     * Directive[Const] : @ Name Arguments[?Const]?
     * ```
     */
    parseDirective(isConst) {
      const start = this._lexer.token;
      this.expectToken(TokenKind.AT);
      return this.node(start, {
        kind: Kind.DIRECTIVE,
        name: this.parseName(),
        arguments: this.parseArguments(isConst)
      });
    }
    // Implements the parsing rules in the Types section.
    /**
     * Type :
     *   - NamedType
     *   - ListType
     *   - NonNullType
     */
    parseTypeReference() {
      const start = this._lexer.token;
      let type;
      if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
        const innerType = this.parseTypeReference();
        this.expectToken(TokenKind.BRACKET_R);
        type = this.node(start, {
          kind: Kind.LIST_TYPE,
          type: innerType
        });
      } else {
        type = this.parseNamedType();
      }
      if (this.expectOptionalToken(TokenKind.BANG)) {
        return this.node(start, {
          kind: Kind.NON_NULL_TYPE,
          type
        });
      }
      return type;
    }
    /**
     * NamedType : Name
     */
    parseNamedType() {
      return this.node(this._lexer.token, {
        kind: Kind.NAMED_TYPE,
        name: this.parseName()
      });
    }
    // Implements the parsing rules in the Type Definition section.
    peekDescription() {
      return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
    }
    /**
     * Description : StringValue
     */
    parseDescription() {
      if (this.peekDescription()) {
        return this.parseStringLiteral();
      }
    }
    /**
     * ```
     * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
     * ```
     */
    parseSchemaDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("schema");
      const directives = this.parseConstDirectives();
      const operationTypes = this.many(
        TokenKind.BRACE_L,
        this.parseOperationTypeDefinition,
        TokenKind.BRACE_R
      );
      return this.node(start, {
        kind: Kind.SCHEMA_DEFINITION,
        description,
        directives,
        operationTypes
      });
    }
    /**
     * OperationTypeDefinition : OperationType : NamedType
     */
    parseOperationTypeDefinition() {
      const start = this._lexer.token;
      const operation = this.parseOperationType();
      this.expectToken(TokenKind.COLON);
      const type = this.parseNamedType();
      return this.node(start, {
        kind: Kind.OPERATION_TYPE_DEFINITION,
        operation,
        type
      });
    }
    /**
     * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
     */
    parseScalarTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("scalar");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.SCALAR_TYPE_DEFINITION,
        description,
        name,
        directives
      });
    }
    /**
     * ObjectTypeDefinition :
     *   Description?
     *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
     */
    parseObjectTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("type");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      return this.node(start, {
        kind: Kind.OBJECT_TYPE_DEFINITION,
        description,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * ImplementsInterfaces :
     *   - implements `&`? NamedType
     *   - ImplementsInterfaces & NamedType
     */
    parseImplementsInterfaces() {
      return this.expectOptionalKeyword("implements") ? this.delimitedMany(TokenKind.AMP, this.parseNamedType) : [];
    }
    /**
     * ```
     * FieldsDefinition : { FieldDefinition+ }
     * ```
     */
    parseFieldsDefinition() {
      return this.optionalMany(
        TokenKind.BRACE_L,
        this.parseFieldDefinition,
        TokenKind.BRACE_R
      );
    }
    /**
     * FieldDefinition :
     *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
     */
    parseFieldDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      const name = this.parseName();
      const args = this.parseArgumentDefs();
      this.expectToken(TokenKind.COLON);
      const type = this.parseTypeReference();
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.FIELD_DEFINITION,
        description,
        name,
        arguments: args,
        type,
        directives
      });
    }
    /**
     * ArgumentsDefinition : ( InputValueDefinition+ )
     */
    parseArgumentDefs() {
      return this.optionalMany(
        TokenKind.PAREN_L,
        this.parseInputValueDef,
        TokenKind.PAREN_R
      );
    }
    /**
     * InputValueDefinition :
     *   - Description? Name : Type DefaultValue? Directives[Const]?
     */
    parseInputValueDef() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      const name = this.parseName();
      this.expectToken(TokenKind.COLON);
      const type = this.parseTypeReference();
      let defaultValue;
      if (this.expectOptionalToken(TokenKind.EQUALS)) {
        defaultValue = this.parseConstValueLiteral();
      }
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.INPUT_VALUE_DEFINITION,
        description,
        name,
        type,
        defaultValue,
        directives
      });
    }
    /**
     * InterfaceTypeDefinition :
     *   - Description? interface Name Directives[Const]? FieldsDefinition?
     */
    parseInterfaceTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("interface");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      return this.node(start, {
        kind: Kind.INTERFACE_TYPE_DEFINITION,
        description,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * UnionTypeDefinition :
     *   - Description? union Name Directives[Const]? UnionMemberTypes?
     */
    parseUnionTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("union");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const types = this.parseUnionMemberTypes();
      return this.node(start, {
        kind: Kind.UNION_TYPE_DEFINITION,
        description,
        name,
        directives,
        types
      });
    }
    /**
     * UnionMemberTypes :
     *   - = `|`? NamedType
     *   - UnionMemberTypes | NamedType
     */
    parseUnionMemberTypes() {
      return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
    }
    /**
     * EnumTypeDefinition :
     *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
     */
    parseEnumTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("enum");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const values = this.parseEnumValuesDefinition();
      return this.node(start, {
        kind: Kind.ENUM_TYPE_DEFINITION,
        description,
        name,
        directives,
        values
      });
    }
    /**
     * ```
     * EnumValuesDefinition : { EnumValueDefinition+ }
     * ```
     */
    parseEnumValuesDefinition() {
      return this.optionalMany(
        TokenKind.BRACE_L,
        this.parseEnumValueDefinition,
        TokenKind.BRACE_R
      );
    }
    /**
     * EnumValueDefinition : Description? EnumValue Directives[Const]?
     */
    parseEnumValueDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      const name = this.parseEnumValueName();
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.ENUM_VALUE_DEFINITION,
        description,
        name,
        directives
      });
    }
    /**
     * EnumValue : Name but not `true`, `false` or `null`
     */
    parseEnumValueName() {
      if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null") {
        throw syntaxError(
          this._lexer.source,
          this._lexer.token.start,
          `${getTokenDesc(
          this._lexer.token
        )} is reserved and cannot be used for an enum value.`
        );
      }
      return this.parseName();
    }
    /**
     * InputObjectTypeDefinition :
     *   - Description? input Name Directives[Const]? InputFieldsDefinition?
     */
    parseInputObjectTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("input");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const fields = this.parseInputFieldsDefinition();
      return this.node(start, {
        kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
        description,
        name,
        directives,
        fields
      });
    }
    /**
     * ```
     * InputFieldsDefinition : { InputValueDefinition+ }
     * ```
     */
    parseInputFieldsDefinition() {
      return this.optionalMany(
        TokenKind.BRACE_L,
        this.parseInputValueDef,
        TokenKind.BRACE_R
      );
    }
    /**
     * TypeSystemExtension :
     *   - SchemaExtension
     *   - TypeExtension
     *
     * TypeExtension :
     *   - ScalarTypeExtension
     *   - ObjectTypeExtension
     *   - InterfaceTypeExtension
     *   - UnionTypeExtension
     *   - EnumTypeExtension
     *   - InputObjectTypeDefinition
     */
    parseTypeSystemExtension() {
      const keywordToken = this._lexer.lookahead();
      if (keywordToken.kind === TokenKind.NAME) {
        switch (keywordToken.value) {
          case "schema":
            return this.parseSchemaExtension();
          case "scalar":
            return this.parseScalarTypeExtension();
          case "type":
            return this.parseObjectTypeExtension();
          case "interface":
            return this.parseInterfaceTypeExtension();
          case "union":
            return this.parseUnionTypeExtension();
          case "enum":
            return this.parseEnumTypeExtension();
          case "input":
            return this.parseInputObjectTypeExtension();
        }
      }
      throw this.unexpected(keywordToken);
    }
    /**
     * ```
     * SchemaExtension :
     *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
     *  - extend schema Directives[Const]
     * ```
     */
    parseSchemaExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("schema");
      const directives = this.parseConstDirectives();
      const operationTypes = this.optionalMany(
        TokenKind.BRACE_L,
        this.parseOperationTypeDefinition,
        TokenKind.BRACE_R
      );
      if (directives.length === 0 && operationTypes.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.SCHEMA_EXTENSION,
        directives,
        operationTypes
      });
    }
    /**
     * ScalarTypeExtension :
     *   - extend scalar Name Directives[Const]
     */
    parseScalarTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("scalar");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      if (directives.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.SCALAR_TYPE_EXTENSION,
        name,
        directives
      });
    }
    /**
     * ObjectTypeExtension :
     *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
     *  - extend type Name ImplementsInterfaces? Directives[Const]
     *  - extend type Name ImplementsInterfaces
     */
    parseObjectTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("type");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.OBJECT_TYPE_EXTENSION,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * InterfaceTypeExtension :
     *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
     *  - extend interface Name ImplementsInterfaces? Directives[Const]
     *  - extend interface Name ImplementsInterfaces
     */
    parseInterfaceTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("interface");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.INTERFACE_TYPE_EXTENSION,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * UnionTypeExtension :
     *   - extend union Name Directives[Const]? UnionMemberTypes
     *   - extend union Name Directives[Const]
     */
    parseUnionTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("union");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const types = this.parseUnionMemberTypes();
      if (directives.length === 0 && types.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.UNION_TYPE_EXTENSION,
        name,
        directives,
        types
      });
    }
    /**
     * EnumTypeExtension :
     *   - extend enum Name Directives[Const]? EnumValuesDefinition
     *   - extend enum Name Directives[Const]
     */
    parseEnumTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("enum");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const values = this.parseEnumValuesDefinition();
      if (directives.length === 0 && values.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.ENUM_TYPE_EXTENSION,
        name,
        directives,
        values
      });
    }
    /**
     * InputObjectTypeExtension :
     *   - extend input Name Directives[Const]? InputFieldsDefinition
     *   - extend input Name Directives[Const]
     */
    parseInputObjectTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("input");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const fields = this.parseInputFieldsDefinition();
      if (directives.length === 0 && fields.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
        name,
        directives,
        fields
      });
    }
    /**
     * ```
     * DirectiveDefinition :
     *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
     * ```
     */
    parseDirectiveDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("directive");
      this.expectToken(TokenKind.AT);
      const name = this.parseName();
      const args = this.parseArgumentDefs();
      const repeatable = this.expectOptionalKeyword("repeatable");
      this.expectKeyword("on");
      const locations = this.parseDirectiveLocations();
      return this.node(start, {
        kind: Kind.DIRECTIVE_DEFINITION,
        description,
        name,
        arguments: args,
        repeatable,
        locations
      });
    }
    /**
     * DirectiveLocations :
     *   - `|`? DirectiveLocation
     *   - DirectiveLocations | DirectiveLocation
     */
    parseDirectiveLocations() {
      return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
    }
    /*
     * DirectiveLocation :
     *   - ExecutableDirectiveLocation
     *   - TypeSystemDirectiveLocation
     *
     * ExecutableDirectiveLocation : one of
     *   `QUERY`
     *   `MUTATION`
     *   `SUBSCRIPTION`
     *   `FIELD`
     *   `FRAGMENT_DEFINITION`
     *   `FRAGMENT_SPREAD`
     *   `INLINE_FRAGMENT`
     *
     * TypeSystemDirectiveLocation : one of
     *   `SCHEMA`
     *   `SCALAR`
     *   `OBJECT`
     *   `FIELD_DEFINITION`
     *   `ARGUMENT_DEFINITION`
     *   `INTERFACE`
     *   `UNION`
     *   `ENUM`
     *   `ENUM_VALUE`
     *   `INPUT_OBJECT`
     *   `INPUT_FIELD_DEFINITION`
     */
    parseDirectiveLocation() {
      const start = this._lexer.token;
      const name = this.parseName();
      if (Object.prototype.hasOwnProperty.call(DirectiveLocation, name.value)) {
        return name;
      }
      throw this.unexpected(start);
    }
    // Core parsing utility functions
    /**
     * Returns a node that, if configured to do so, sets a "loc" field as a
     * location object, used to identify the place in the source that created a
     * given parsed object.
     */
    node(startToken, node) {
      if (this._options.noLocation !== true) {
        node.loc = new Location(
          startToken,
          this._lexer.lastToken,
          this._lexer.source
        );
      }
      return node;
    }
    /**
     * Determines if the next token is of a given kind
     */
    peek(kind) {
      return this._lexer.token.kind === kind;
    }
    /**
     * If the next token is of the given kind, return that token after advancing the lexer.
     * Otherwise, do not change the parser state and throw an error.
     */
    expectToken(kind) {
      const token = this._lexer.token;
      if (token.kind === kind) {
        this.advanceLexer();
        return token;
      }
      throw syntaxError(
        this._lexer.source,
        token.start,
        `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`
      );
    }
    /**
     * If the next token is of the given kind, return "true" after advancing the lexer.
     * Otherwise, do not change the parser state and return "false".
     */
    expectOptionalToken(kind) {
      const token = this._lexer.token;
      if (token.kind === kind) {
        this.advanceLexer();
        return true;
      }
      return false;
    }
    /**
     * If the next token is a given keyword, advance the lexer.
     * Otherwise, do not change the parser state and throw an error.
     */
    expectKeyword(value) {
      const token = this._lexer.token;
      if (token.kind === TokenKind.NAME && token.value === value) {
        this.advanceLexer();
      } else {
        throw syntaxError(
          this._lexer.source,
          token.start,
          `Expected "${value}", found ${getTokenDesc(token)}.`
        );
      }
    }
    /**
     * If the next token is a given keyword, return "true" after advancing the lexer.
     * Otherwise, do not change the parser state and return "false".
     */
    expectOptionalKeyword(value) {
      const token = this._lexer.token;
      if (token.kind === TokenKind.NAME && token.value === value) {
        this.advanceLexer();
        return true;
      }
      return false;
    }
    /**
     * Helper function for creating an error when an unexpected lexed token is encountered.
     */
    unexpected(atToken) {
      const token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
      return syntaxError(
        this._lexer.source,
        token.start,
        `Unexpected ${getTokenDesc(token)}.`
      );
    }
    /**
     * Returns a possibly empty list of parse nodes, determined by the parseFn.
     * This list begins with a lex token of openKind and ends with a lex token of closeKind.
     * Advances the parser to the next lex token after the closing token.
     */
    any(openKind, parseFn, closeKind) {
      this.expectToken(openKind);
      const nodes = [];
      while (!this.expectOptionalToken(closeKind)) {
        nodes.push(parseFn.call(this));
      }
      return nodes;
    }
    /**
     * Returns a list of parse nodes, determined by the parseFn.
     * It can be empty only if open token is missing otherwise it will always return non-empty list
     * that begins with a lex token of openKind and ends with a lex token of closeKind.
     * Advances the parser to the next lex token after the closing token.
     */
    optionalMany(openKind, parseFn, closeKind) {
      if (this.expectOptionalToken(openKind)) {
        const nodes = [];
        do {
          nodes.push(parseFn.call(this));
        } while (!this.expectOptionalToken(closeKind));
        return nodes;
      }
      return [];
    }
    /**
     * Returns a non-empty list of parse nodes, determined by the parseFn.
     * This list begins with a lex token of openKind and ends with a lex token of closeKind.
     * Advances the parser to the next lex token after the closing token.
     */
    many(openKind, parseFn, closeKind) {
      this.expectToken(openKind);
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    /**
     * Returns a non-empty list of parse nodes, determined by the parseFn.
     * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
     * Advances the parser to the next lex token after last item in the list.
     */
    delimitedMany(delimiterKind, parseFn) {
      this.expectOptionalToken(delimiterKind);
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (this.expectOptionalToken(delimiterKind));
      return nodes;
    }
    advanceLexer() {
      const { maxTokens } = this._options;
      const token = this._lexer.advance();
      if (maxTokens !== void 0 && token.kind !== TokenKind.EOF) {
        ++this._tokenCounter;
        if (this._tokenCounter > maxTokens) {
          throw syntaxError(
            this._lexer.source,
            token.start,
            `Document contains more that ${maxTokens} tokens. Parsing aborted.`
          );
        }
      }
    }
  }
  function getTokenDesc(token) {
    const value = token.value;
    return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : "");
  }
  function getTokenKindDesc(kind) {
    return isPunctuatorTokenKind(kind) ? `"${kind}"` : kind;
  }
  function printString(str) {
    return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
  }
  const escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
  function escapedReplacer(str) {
    return escapeSequences[str.charCodeAt(0)];
  }
  const escapeSequences = [
    "\\u0000",
    "\\u0001",
    "\\u0002",
    "\\u0003",
    "\\u0004",
    "\\u0005",
    "\\u0006",
    "\\u0007",
    "\\b",
    "\\t",
    "\\n",
    "\\u000B",
    "\\f",
    "\\r",
    "\\u000E",
    "\\u000F",
    "\\u0010",
    "\\u0011",
    "\\u0012",
    "\\u0013",
    "\\u0014",
    "\\u0015",
    "\\u0016",
    "\\u0017",
    "\\u0018",
    "\\u0019",
    "\\u001A",
    "\\u001B",
    "\\u001C",
    "\\u001D",
    "\\u001E",
    "\\u001F",
    "",
    "",
    '\\"',
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // 2F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // 3F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // 4F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "\\\\",
    "",
    "",
    "",
    // 5F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // 6F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "\\u007F",
    "\\u0080",
    "\\u0081",
    "\\u0082",
    "\\u0083",
    "\\u0084",
    "\\u0085",
    "\\u0086",
    "\\u0087",
    "\\u0088",
    "\\u0089",
    "\\u008A",
    "\\u008B",
    "\\u008C",
    "\\u008D",
    "\\u008E",
    "\\u008F",
    "\\u0090",
    "\\u0091",
    "\\u0092",
    "\\u0093",
    "\\u0094",
    "\\u0095",
    "\\u0096",
    "\\u0097",
    "\\u0098",
    "\\u0099",
    "\\u009A",
    "\\u009B",
    "\\u009C",
    "\\u009D",
    "\\u009E",
    "\\u009F"
  ];
  const BREAK = Object.freeze({});
  function visit(root, visitor, visitorKeys = QueryDocumentKeys) {
    const enterLeaveMap = /* @__PURE__ */ new Map();
    for (const kind of Object.values(Kind)) {
      enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
    }
    let stack = void 0;
    let inArray = Array.isArray(root);
    let keys = [root];
    let index = -1;
    let edits = [];
    let node = root;
    let key = void 0;
    let parent = void 0;
    const path = [];
    const ancestors = [];
    do {
      index++;
      const isLeaving = index === keys.length;
      const isEdited = isLeaving && edits.length !== 0;
      if (isLeaving) {
        key = ancestors.length === 0 ? void 0 : path[path.length - 1];
        node = parent;
        parent = ancestors.pop();
        if (isEdited) {
          if (inArray) {
            node = node.slice();
            let editOffset = 0;
            for (const [editKey, editValue] of edits) {
              const arrayKey = editKey - editOffset;
              if (editValue === null) {
                node.splice(arrayKey, 1);
                editOffset++;
              } else {
                node[arrayKey] = editValue;
              }
            }
          } else {
            node = Object.defineProperties(
              {},
              Object.getOwnPropertyDescriptors(node)
            );
            for (const [editKey, editValue] of edits) {
              node[editKey] = editValue;
            }
          }
        }
        index = stack.index;
        keys = stack.keys;
        edits = stack.edits;
        inArray = stack.inArray;
        stack = stack.prev;
      } else if (parent) {
        key = inArray ? index : keys[index];
        node = parent[key];
        if (node === null || node === void 0) {
          continue;
        }
        path.push(key);
      }
      let result;
      if (!Array.isArray(node)) {
        var _enterLeaveMap$get, _enterLeaveMap$get2;
        isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
        const visitFn = isLeaving ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get === void 0 ? void 0 : _enterLeaveMap$get.leave : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get2 === void 0 ? void 0 : _enterLeaveMap$get2.enter;
        result = visitFn === null || visitFn === void 0 ? void 0 : visitFn.call(visitor, node, key, parent, path, ancestors);
        if (result === BREAK) {
          break;
        }
        if (result === false) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== void 0) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (isNode(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
      if (result === void 0 && isEdited) {
        edits.push([key, node]);
      }
      if (isLeaving) {
        path.pop();
      } else {
        var _node$kind;
        stack = {
          inArray,
          index,
          keys,
          edits,
          prev: stack
        };
        inArray = Array.isArray(node);
        keys = inArray ? node : (_node$kind = visitorKeys[node.kind]) !== null && _node$kind !== void 0 ? _node$kind : [];
        index = -1;
        edits = [];
        if (parent) {
          ancestors.push(parent);
        }
        parent = node;
      }
    } while (stack !== void 0);
    if (edits.length !== 0) {
      return edits[edits.length - 1][1];
    }
    return root;
  }
  function getEnterLeaveForKind(visitor, kind) {
    const kindVisitor = visitor[kind];
    if (typeof kindVisitor === "object") {
      return kindVisitor;
    } else if (typeof kindVisitor === "function") {
      return {
        enter: kindVisitor,
        leave: void 0
      };
    }
    return {
      enter: visitor.enter,
      leave: visitor.leave
    };
  }
  function print(ast) {
    return visit(ast, printDocASTReducer);
  }
  const MAX_LINE_LENGTH = 80;
  const printDocASTReducer = {
    Name: {
      leave: (node) => node.value
    },
    Variable: {
      leave: (node) => "$" + node.name
    },
    // Document
    Document: {
      leave: (node) => join(node.definitions, "\n\n")
    },
    OperationDefinition: {
      leave(node) {
        const varDefs = wrap("(", join(node.variableDefinitions, ", "), ")");
        const prefix = join(
          [
            node.operation,
            join([node.name, varDefs]),
            join(node.directives, " ")
          ],
          " "
        );
        return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
      }
    },
    VariableDefinition: {
      leave: ({ variable, type, defaultValue, directives }) => variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " "))
    },
    SelectionSet: {
      leave: ({ selections }) => block(selections)
    },
    Field: {
      leave({ alias, name, arguments: args, directives, selectionSet }) {
        const prefix = wrap("", alias, ": ") + name;
        let argsLine = prefix + wrap("(", join(args, ", "), ")");
        if (argsLine.length > MAX_LINE_LENGTH) {
          argsLine = prefix + wrap("(\n", indent(join(args, "\n")), "\n)");
        }
        return join([argsLine, join(directives, " "), selectionSet], " ");
      }
    },
    Argument: {
      leave: ({ name, value }) => name + ": " + value
    },
    // Fragments
    FragmentSpread: {
      leave: ({ name, directives }) => "..." + name + wrap(" ", join(directives, " "))
    },
    InlineFragment: {
      leave: ({ typeCondition, directives, selectionSet }) => join(
        [
          "...",
          wrap("on ", typeCondition),
          join(directives, " "),
          selectionSet
        ],
        " "
      )
    },
    FragmentDefinition: {
      leave: ({ name, typeCondition, variableDefinitions, directives, selectionSet }) => (
        // or removed in the future.
        `fragment ${name}${wrap("(", join(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap("", join(directives, " "), " ")}` + selectionSet
      )
    },
    // Value
    IntValue: {
      leave: ({ value }) => value
    },
    FloatValue: {
      leave: ({ value }) => value
    },
    StringValue: {
      leave: ({ value, block: isBlockString }) => isBlockString ? printBlockString(value) : printString(value)
    },
    BooleanValue: {
      leave: ({ value }) => value ? "true" : "false"
    },
    NullValue: {
      leave: () => "null"
    },
    EnumValue: {
      leave: ({ value }) => value
    },
    ListValue: {
      leave: ({ values }) => "[" + join(values, ", ") + "]"
    },
    ObjectValue: {
      leave: ({ fields }) => "{" + join(fields, ", ") + "}"
    },
    ObjectField: {
      leave: ({ name, value }) => name + ": " + value
    },
    // Directive
    Directive: {
      leave: ({ name, arguments: args }) => "@" + name + wrap("(", join(args, ", "), ")")
    },
    // Type
    NamedType: {
      leave: ({ name }) => name
    },
    ListType: {
      leave: ({ type }) => "[" + type + "]"
    },
    NonNullType: {
      leave: ({ type }) => type + "!"
    },
    // Type System Definitions
    SchemaDefinition: {
      leave: ({ description, directives, operationTypes }) => wrap("", description, "\n") + join(["schema", join(directives, " "), block(operationTypes)], " ")
    },
    OperationTypeDefinition: {
      leave: ({ operation, type }) => operation + ": " + type
    },
    ScalarTypeDefinition: {
      leave: ({ description, name, directives }) => wrap("", description, "\n") + join(["scalar", name, join(directives, " ")], " ")
    },
    ObjectTypeDefinition: {
      leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
        [
          "type",
          name,
          wrap("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields)
        ],
        " "
      )
    },
    FieldDefinition: {
      leave: ({ description, name, arguments: args, type, directives }) => wrap("", description, "\n") + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + ": " + type + wrap(" ", join(directives, " "))
    },
    InputValueDefinition: {
      leave: ({ description, name, type, defaultValue, directives }) => wrap("", description, "\n") + join(
        [name + ": " + type, wrap("= ", defaultValue), join(directives, " ")],
        " "
      )
    },
    InterfaceTypeDefinition: {
      leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
        [
          "interface",
          name,
          wrap("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields)
        ],
        " "
      )
    },
    UnionTypeDefinition: {
      leave: ({ description, name, directives, types }) => wrap("", description, "\n") + join(
        ["union", name, join(directives, " "), wrap("= ", join(types, " | "))],
        " "
      )
    },
    EnumTypeDefinition: {
      leave: ({ description, name, directives, values }) => wrap("", description, "\n") + join(["enum", name, join(directives, " "), block(values)], " ")
    },
    EnumValueDefinition: {
      leave: ({ description, name, directives }) => wrap("", description, "\n") + join([name, join(directives, " ")], " ")
    },
    InputObjectTypeDefinition: {
      leave: ({ description, name, directives, fields }) => wrap("", description, "\n") + join(["input", name, join(directives, " "), block(fields)], " ")
    },
    DirectiveDefinition: {
      leave: ({ description, name, arguments: args, repeatable, locations }) => wrap("", description, "\n") + "directive @" + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + (repeatable ? " repeatable" : "") + " on " + join(locations, " | ")
    },
    SchemaExtension: {
      leave: ({ directives, operationTypes }) => join(
        ["extend schema", join(directives, " "), block(operationTypes)],
        " "
      )
    },
    ScalarTypeExtension: {
      leave: ({ name, directives }) => join(["extend scalar", name, join(directives, " ")], " ")
    },
    ObjectTypeExtension: {
      leave: ({ name, interfaces, directives, fields }) => join(
        [
          "extend type",
          name,
          wrap("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields)
        ],
        " "
      )
    },
    InterfaceTypeExtension: {
      leave: ({ name, interfaces, directives, fields }) => join(
        [
          "extend interface",
          name,
          wrap("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields)
        ],
        " "
      )
    },
    UnionTypeExtension: {
      leave: ({ name, directives, types }) => join(
        [
          "extend union",
          name,
          join(directives, " "),
          wrap("= ", join(types, " | "))
        ],
        " "
      )
    },
    EnumTypeExtension: {
      leave: ({ name, directives, values }) => join(["extend enum", name, join(directives, " "), block(values)], " ")
    },
    InputObjectTypeExtension: {
      leave: ({ name, directives, fields }) => join(["extend input", name, join(directives, " "), block(fields)], " ")
    }
  };
  function join(maybeArray, separator = "") {
    var _maybeArray$filter$jo;
    return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter((x) => x).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : "";
  }
  function block(array) {
    return wrap("{\n", indent(join(array, "\n")), "\n}");
  }
  function wrap(start, maybeString, end = "") {
    return maybeString != null && maybeString !== "" ? start + maybeString + end : "";
  }
  function indent(str) {
    return wrap("  ", str.replace(/\n/g, "\n  "));
  }
  function hasMultilineItems(maybeArray) {
    var _maybeArray$some;
    return (_maybeArray$some = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.some((str) => str.includes("\n"))) !== null && _maybeArray$some !== void 0 ? _maybeArray$some : false;
  }
  const ACCEPT_HEADER = `Accept`;
  const CONTENT_TYPE_HEADER = `Content-Type`;
  const CONTENT_TYPE_JSON = `application/json`;
  const CONTENT_TYPE_GQL = `application/graphql-response+json`;
  const cleanQuery = (str) => str.replace(/([\s,]|#[^\n\r]+)+/g, ` `).trim();
  const isGraphQLContentType = (contentType) => {
    const contentTypeLower = contentType.toLowerCase();
    return contentTypeLower.includes(CONTENT_TYPE_GQL) || contentTypeLower.includes(CONTENT_TYPE_JSON);
  };
  const parseGraphQLExecutionResult = (result) => {
    try {
      if (Array.isArray(result)) {
        return {
          _tag: `Batch`,
          executionResults: result.map(parseExecutionResult)
        };
      } else if (isPlainObject(result)) {
        return {
          _tag: `Single`,
          executionResult: parseExecutionResult(result)
        };
      } else {
        throw new Error(`Invalid execution result: result is not object or array. 
Got:
${String(result)}`);
      }
    } catch (e) {
      return e;
    }
  };
  const parseExecutionResult = (result) => {
    if (typeof result !== `object` || result === null) {
      throw new Error(`Invalid execution result: result is not object`);
    }
    let errors = void 0;
    let data = void 0;
    let extensions = void 0;
    if (`errors` in result) {
      if (!isPlainObject(result.errors) && !Array.isArray(result.errors)) {
        throw new Error(`Invalid execution result: errors is not plain object OR array`);
      }
      errors = result.errors;
    }
    if (`data` in result) {
      if (!isPlainObject(result.data) && result.data !== null) {
        throw new Error(`Invalid execution result: data is not plain object`);
      }
      data = result.data;
    }
    if (`extensions` in result) {
      if (!isPlainObject(result.extensions))
        throw new Error(`Invalid execution result: extensions is not plain object`);
      extensions = result.extensions;
    }
    return {
      data,
      errors,
      extensions
    };
  };
  const isRequestResultHaveErrors = (result) => result._tag === `Batch` ? result.executionResults.some(isExecutionResultHaveErrors) : isExecutionResultHaveErrors(result.executionResult);
  const isExecutionResultHaveErrors = (result) => Array.isArray(result.errors) ? result.errors.length > 0 : Boolean(result.errors);
  const isOperationDefinitionNode = (definition) => {
    return typeof definition === `object` && definition !== null && `kind` in definition && definition.kind === Kind.OPERATION_DEFINITION;
  };
  const extractOperationName = (document2) => {
    var _a;
    let operationName = void 0;
    const defs = document2.definitions.filter(isOperationDefinitionNode);
    if (defs.length === 1) {
      operationName = (_a = defs[0].name) == null ? void 0 : _a.value;
    }
    return operationName;
  };
  const extractIsMutation = (document2) => {
    let isMutation = false;
    const defs = document2.definitions.filter(isOperationDefinitionNode);
    if (defs.length === 1) {
      isMutation = defs[0].operation === OperationTypeNode.MUTATION;
    }
    return isMutation;
  };
  const analyzeDocument = (document2, excludeOperationName) => {
    const expression = typeof document2 === `string` ? document2 : print(document2);
    let isMutation = false;
    let operationName = void 0;
    if (excludeOperationName) {
      return { expression, isMutation, operationName };
    }
    const docNode = tryCatch(() => typeof document2 === `string` ? parse(document2) : document2);
    if (docNode instanceof Error) {
      return { expression, isMutation, operationName };
    }
    operationName = extractOperationName(docNode);
    isMutation = extractIsMutation(docNode);
    return { expression, operationName, isMutation };
  };
  const defaultJsonSerializer = JSON;
  const runRequest = async (input) => {
    const config2 = {
      ...input,
      method: input.request._tag === `Single` ? input.request.document.isMutation ? `POST` : uppercase(input.method ?? `post`) : input.request.hasMutations ? `POST` : uppercase(input.method ?? `post`),
      fetchOptions: {
        ...input.fetchOptions,
        errorPolicy: input.fetchOptions.errorPolicy ?? `none`
      }
    };
    const fetcher = createFetcher(config2.method);
    const fetchResponse = await fetcher(config2);
    if (!fetchResponse.ok) {
      return new ClientError({ status: fetchResponse.status, headers: fetchResponse.headers }, {
        query: input.request._tag === `Single` ? input.request.document.expression : input.request.query,
        variables: input.request.variables
      });
    }
    const result = await parseResultFromResponse(fetchResponse, input.fetchOptions.jsonSerializer ?? defaultJsonSerializer);
    if (result instanceof Error)
      throw result;
    const clientResponseBase = {
      status: fetchResponse.status,
      headers: fetchResponse.headers
    };
    if (isRequestResultHaveErrors(result) && config2.fetchOptions.errorPolicy === `none`) {
      const clientResponse = result._tag === `Batch` ? { ...result.executionResults, ...clientResponseBase } : {
        ...result.executionResult,
        ...clientResponseBase
      };
      return new ClientError(clientResponse, {
        query: input.request._tag === `Single` ? input.request.document.expression : input.request.query,
        variables: input.request.variables
      });
    }
    switch (result._tag) {
      case `Single`:
        return {
          ...clientResponseBase,
          ...executionResultClientResponseFields(config2)(result.executionResult)
        };
      case `Batch`:
        return {
          ...clientResponseBase,
          data: result.executionResults.map(executionResultClientResponseFields(config2))
        };
      default:
        casesExhausted(result);
    }
  };
  const executionResultClientResponseFields = ($params) => (executionResult) => {
    return {
      extensions: executionResult.extensions,
      data: executionResult.data,
      errors: $params.fetchOptions.errorPolicy === `all` ? executionResult.errors : void 0
    };
  };
  const parseResultFromResponse = async (response, jsonSerializer) => {
    const contentType = response.headers.get(CONTENT_TYPE_HEADER);
    const text2 = await response.text();
    if (contentType && isGraphQLContentType(contentType)) {
      return parseGraphQLExecutionResult(jsonSerializer.parse(text2));
    } else {
      return parseGraphQLExecutionResult(text2);
    }
  };
  const createFetcher = (method) => async (params) => {
    const headers = new Headers(params.headers);
    let searchParams = null;
    let body = void 0;
    if (!headers.has(ACCEPT_HEADER)) {
      headers.set(ACCEPT_HEADER, [CONTENT_TYPE_GQL, CONTENT_TYPE_JSON].join(`, `));
    }
    if (method === `POST`) {
      const $jsonSerializer = params.fetchOptions.jsonSerializer ?? defaultJsonSerializer;
      body = $jsonSerializer.stringify(buildBody(params));
      if (typeof body === `string` && !headers.has(CONTENT_TYPE_HEADER)) {
        headers.set(CONTENT_TYPE_HEADER, CONTENT_TYPE_JSON);
      }
    } else {
      searchParams = buildQueryParams(params);
    }
    const init = { method, headers, body, ...params.fetchOptions };
    let url = new URL(params.url);
    let initResolved = init;
    if (params.middleware) {
      const result = await Promise.resolve(params.middleware({
        ...init,
        url: params.url,
        operationName: params.request._tag === `Single` ? params.request.document.operationName : void 0,
        variables: params.request.variables
      }));
      const { url: urlNew, ...initNew } = result;
      url = new URL(urlNew);
      initResolved = initNew;
    }
    if (searchParams) {
      searchParams.forEach((value, name) => {
        url.searchParams.append(name, value);
      });
    }
    const $fetch = params.fetch ?? fetch;
    return await $fetch(url, initResolved);
  };
  const buildBody = (params) => {
    switch (params.request._tag) {
      case `Single`:
        return {
          query: params.request.document.expression,
          variables: params.request.variables,
          operationName: params.request.document.operationName
        };
      case `Batch`:
        return zip(params.request.query, params.request.variables ?? []).map(([query, variables]) => ({
          query,
          variables
        }));
      default:
        throw casesExhausted(params.request);
    }
  };
  const buildQueryParams = (params) => {
    var _a;
    const $jsonSerializer = params.fetchOptions.jsonSerializer ?? defaultJsonSerializer;
    const searchParams = new URLSearchParams();
    switch (params.request._tag) {
      case `Single`: {
        searchParams.append(`query`, cleanQuery(params.request.document.expression));
        if (params.request.variables) {
          searchParams.append(`variables`, $jsonSerializer.stringify(params.request.variables));
        }
        if (params.request.document.operationName) {
          searchParams.append(`operationName`, params.request.document.operationName);
        }
        return searchParams;
      }
      case `Batch`: {
        const variablesSerialized = ((_a = params.request.variables) == null ? void 0 : _a.map((v) => $jsonSerializer.stringify(v))) ?? [];
        const queriesCleaned = params.request.query.map(cleanQuery);
        const payload = zip(queriesCleaned, variablesSerialized).map(([query, variables]) => ({
          query,
          variables
        }));
        searchParams.append(`query`, $jsonSerializer.stringify(payload));
        return searchParams;
      }
      default:
        throw casesExhausted(params.request);
    }
  };
  class GraphQLClient {
    constructor(url, requestConfig = {}) {
      __publicField(this, "url");
      __publicField(this, "requestConfig");
      /**
       * Send a GraphQL query to the server.
       */
      __publicField(this, "rawRequest", async (...args) => {
        const [queryOrOptions, variables, requestHeaders] = args;
        const rawRequestOptions = parseRawRequestArgs(queryOrOptions, variables, requestHeaders);
        const { headers, fetch: fetch2 = globalThis.fetch, method = `POST`, requestMiddleware, responseMiddleware, excludeOperationName, ...fetchOptions } = this.requestConfig;
        const { url } = this;
        if (rawRequestOptions.signal !== void 0) {
          fetchOptions.signal = rawRequestOptions.signal;
        }
        const document2 = analyzeDocument(rawRequestOptions.query, excludeOperationName);
        const response = await runRequest({
          url,
          request: {
            _tag: `Single`,
            document: document2,
            variables: rawRequestOptions.variables
          },
          headers: {
            ...HeadersInitToPlainObject(callOrIdentity(headers)),
            ...HeadersInitToPlainObject(rawRequestOptions.requestHeaders)
          },
          fetch: fetch2,
          method,
          fetchOptions,
          middleware: requestMiddleware
        });
        if (responseMiddleware) {
          await responseMiddleware(response, {
            operationName: document2.operationName,
            variables,
            url: this.url
          });
        }
        if (response instanceof Error) {
          throw response;
        }
        return response;
      });
      this.url = url;
      this.requestConfig = requestConfig;
    }
    async request(documentOrOptions, ...variablesAndRequestHeaders) {
      const [variables, requestHeaders] = variablesAndRequestHeaders;
      const requestOptions = parseRequestArgs(documentOrOptions, variables, requestHeaders);
      const { headers, fetch: fetch2 = globalThis.fetch, method = `POST`, requestMiddleware, responseMiddleware, excludeOperationName, ...fetchOptions } = this.requestConfig;
      const { url } = this;
      if (requestOptions.signal !== void 0) {
        fetchOptions.signal = requestOptions.signal;
      }
      const analyzedDocument = analyzeDocument(requestOptions.document, excludeOperationName);
      const response = await runRequest({
        url,
        request: {
          _tag: `Single`,
          document: analyzedDocument,
          variables: requestOptions.variables
        },
        headers: {
          ...HeadersInitToPlainObject(callOrIdentity(headers)),
          ...HeadersInitToPlainObject(requestOptions.requestHeaders)
        },
        fetch: fetch2,
        method,
        fetchOptions,
        middleware: requestMiddleware
      });
      if (responseMiddleware) {
        await responseMiddleware(response, {
          operationName: analyzedDocument.operationName,
          variables: requestOptions.variables,
          url: this.url
        });
      }
      if (response instanceof Error) {
        throw response;
      }
      return response.data;
    }
    async batchRequests(documentsOrOptions, requestHeaders) {
      const batchRequestOptions = parseBatchRequestArgs(documentsOrOptions, requestHeaders);
      const { headers, excludeOperationName, ...fetchOptions } = this.requestConfig;
      if (batchRequestOptions.signal !== void 0) {
        fetchOptions.signal = batchRequestOptions.signal;
      }
      const analyzedDocuments = batchRequestOptions.documents.map(({ document: document2 }) => analyzeDocument(document2, excludeOperationName));
      const expressions = analyzedDocuments.map(({ expression }) => expression);
      const hasMutations = analyzedDocuments.some(({ isMutation }) => isMutation);
      const variables = batchRequestOptions.documents.map(({ variables: variables2 }) => variables2);
      const response = await runRequest({
        url: this.url,
        request: {
          _tag: `Batch`,
          operationName: void 0,
          query: expressions,
          hasMutations,
          variables
        },
        headers: {
          ...HeadersInitToPlainObject(callOrIdentity(headers)),
          ...HeadersInitToPlainObject(batchRequestOptions.requestHeaders)
        },
        fetch: this.requestConfig.fetch ?? globalThis.fetch,
        method: this.requestConfig.method || `POST`,
        fetchOptions,
        middleware: this.requestConfig.requestMiddleware
      });
      if (this.requestConfig.responseMiddleware) {
        await this.requestConfig.responseMiddleware(response, {
          operationName: void 0,
          variables,
          url: this.url
        });
      }
      if (response instanceof Error) {
        throw response;
      }
      return response.data;
    }
    setHeaders(headers) {
      this.requestConfig.headers = headers;
      return this;
    }
    /**
     * Attach a header to the client. All subsequent requests will have this header.
     */
    setHeader(key, value) {
      const { headers } = this.requestConfig;
      if (headers) {
        headers[key] = value;
      } else {
        this.requestConfig.headers = { [key]: value };
      }
      return this;
    }
    /**
     * Change the client endpoint. All subsequent requests will send to this endpoint.
     */
    setEndpoint(value) {
      this.url = value;
      return this;
    }
  }
  const parseRequestArgs = (documentOrOptions, variables, requestHeaders) => {
    return documentOrOptions.document ? documentOrOptions : {
      document: documentOrOptions,
      variables,
      requestHeaders,
      signal: void 0
    };
  };
  const _gql_source = `query ($ids: String) {
    animes(ids: $ids) {
        english
        episodes
        episodesAired
        id
        isCensored
        japanese
        kind
        licenseNameRu
        malId
        name
        nextEpisodeAt
        related {
            anime {
                id
            }
            id
            relationKind
        }
        releasedOn {
            date
        }
        russian
        status
        synonyms
        updatedAt
        url
        userRate { id episodes status }
    }
}
`;
  const _gql_doc = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "ids" } }, "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "String" } }, "directives": [] }], "directives": [], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "animes" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "ids" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "ids" } } }], "directives": [], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "english" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "episodes" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "episodesAired" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "id" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "isCensored" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "japanese" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "kind" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "licenseNameRu" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "malId" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "name" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "nextEpisodeAt" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "related" }, "arguments": [], "directives": [], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "anime" }, "arguments": [], "directives": [], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" }, "arguments": [], "directives": [] }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "id" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "relationKind" }, "arguments": [], "directives": [] }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "releasedOn" }, "arguments": [], "directives": [], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "date" }, "arguments": [], "directives": [] }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "russian" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "status" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "synonyms" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "updatedAt" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "url" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "userRate" }, "arguments": [], "directives": [], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "episodes" }, "arguments": [], "directives": [] }, { "kind": "Field", "name": { "kind": "Name", "value": "status" }, "arguments": [], "directives": [] }] } }] } }] } }], "loc": { "start": 0, "end": 566, "source": { "name": "GraphQL request", "locationOffset": { "line": 1, "column": 1 }, "body": _gql_source } } };
  const endpoint = "https://shikimori.one/api/graphql";
  const client = new GraphQLClient(endpoint);
  async function getAnimesByIds(ids) {
    const response = await client.request(_gql_doc, { ids });
    return response.animes;
  }
  class Balancer {
    constructor(title) {
      __publicField(this, "title");
      __publicField(this, "options", {
        linkParams: {}
      });
      __publicField(this, "data", vue.reactive({}));
      __publicField(this, "translations", vue.reactive({}));
      this.title = title;
    }
    async init(anime) {
      return this;
    }
  }
  class Kodik extends Balancer {
    constructor() {
      super("Kodik");
      __publicField(this, "client");
      this.client = kodikwrapper.Client.fromToken("447d179e875efe44217f20d1ee2146be");
      this.options.linkParams = {
        translations: false
      };
    }
    async init(anime) {
      var _a;
      try {
        const response = await ((_a = this.client) == null ? void 0 : _a.search({
          shikimori_id: +anime.id,
          with_episodes: true
        }));
        const materials = response.results;
        if (!materials.length) {
          return console.warn(this.title, "Переводы не найдены");
        }
        this.data = response;
        const translations = materials.map((material) => {
          var _a2;
          if (material.type === "anime") {
            return {
              id: material.translation.id,
              title: material.translation.title,
              type: material.translation.type,
              balancer: this.title,
              data: {
                link: material.link,
                quality: material.quality
              }
            };
          } else {
            const season = (_a2 = material.seasons) == null ? void 0 : _a2[material.last_season || 1];
            const episodesKeys = Object.keys(season.episodes || {});
            return {
              id: material.translation.id,
              title: material.translation.title,
              type: material.translation.type,
              balancer: this.title,
              data: {
                quality: material.quality,
                episodes: season.episodes,
                totalEpisodes: {
                  start: Number(episodesKeys.at(0)),
                  end: Number(episodesKeys.at(-1))
                }
              }
            };
          }
        });
        this.translations = {
          voice: translations.filter((translation) => translation.type === "voice"),
          subtitles: translations.filter((translation) => translation.type === "subtitles")
        };
      } catch (error) {
        console.error("Ошибка при инициализации Kodik", error);
      }
      return this;
    }
  }
  const useMainStore = pinia.defineStore("main", {
    state: () => ({
      anime: {},
      data: {
        totalEpisodes: 0
      },
      balancers: {
        "Kodik": new Kodik()
      }
    }),
    getters: {
      getBalancerByTitle(state) {
        return (title) => state.balancers[title];
      },
      getBalancers(state) {
        return Object.values(state.balancers);
      }
    },
    actions: {
      async initBalancers() {
        var _a, _b;
        const animeData = (await getAnimesByIds($(".b-user_rate").data("entry").id.toString()))[0];
        const selectedStore = useSelectedStore();
        const { translationsSorted } = pinia.storeToRefs(selectedStore);
        const optionsStore = useOptionsStore();
        optionsStore.setHasEpisodes(animeData && animeData.status !== "anons" && (animeData.status === "ongoing" && animeData.episodes === 0 || animeData.episodes > 1));
        this.anime = animeData;
        this.data.totalEpisodes = animeData.status === "released" ? animeData.episodes : (animeData == null ? void 0 : animeData.episodesAired) || 0;
        const params = new URLSearchParams(window.location.search);
        const paramBalancer = params.get("balancer");
        const paramTranslationType = params.get("translation_type");
        const paramEpisode = params.get("episode");
        const paramTeam = params.get("team");
        if (paramEpisode) {
          selectedStore.setEpisode(+paramEpisode);
        } else {
          const watchedEpisodes = ((_a = animeData == null ? void 0 : animeData.userRate) == null ? void 0 : _a.episodes) || 0;
          selectedStore.setEpisode((animeData == null ? void 0 : animeData.userRate) ? ((_b = animeData.userRate) == null ? void 0 : _b.status) !== "completed" ? watchedEpisodes + 1 : this.data.totalEpisodes : 1);
        }
        for (const balancer of Object.values(this.balancers)) {
          await balancer.init(this.anime);
        }
        if (paramBalancer) {
          selectedStore.setBalancerName(paramBalancer);
        } else {
          selectedStore.setBalancerName("Kodik");
        }
        if (paramTranslationType) {
          selectedStore.setTranslationType(paramTranslationType);
        } else {
          selectedStore.setTranslationType("voice");
        }
        const translations = translationsSorted.value;
        if (paramTeam) {
          const _translation = translations.find((translation) => translation.id === +paramTeam);
          if (!_translation) return;
          selectedStore.setTranslation(_translation);
        } else {
          selectedStore.setTranslation(translations[0] || null);
        }
      }
    }
  });
  const useSelectedStore = pinia.defineStore("selected", {
    state: () => ({
      balancerName: null,
      translationType: null,
      episode: 0,
      prevTranslation: null,
      translation: null
    }),
    getters: {
      getBalancer({ balancerName }) {
        if (balancerName !== null) {
          return useMainStore().balancers[balancerName];
        }
        return null;
      },
      translationWasChanged({ prevTranslation, translation }) {
        return prevTranslation !== translation;
      },
      translationsSorted({ translationType, balancerName }) {
        var _a;
        if (balancerName !== null) {
          const mainStore = useMainStore();
          const { balancers } = pinia.storeToRefs(mainStore);
          return [...((_a = balancers.value[balancerName]) == null ? void 0 : _a.translations[translationType || "unknown"]) || []].sort((a, b) => a.title.localeCompare(b.title, "en-US"));
        }
        return [];
      },
      totalEpisodes({ translation }) {
        var _a;
        if (!translation) return 0;
        if (!translation.data.totalEpisodes) {
          return translation.data.link ? 1 : 0;
        }
        return ((((_a = translation.data.totalEpisodes) == null ? void 0 : _a.end) || 0) - translation.data.totalEpisodes.start || 0) + 1;
      }
    },
    actions: {
      setBalancerName(balancerName) {
        this.balancerName = balancerName;
      },
      setTranslationType(type) {
        this.translationType = type;
      },
      setEpisode(episode) {
        this.episode = episode;
        changeSearch({
          episode: String(episode)
        });
      },
      setTranslation(translation) {
        var _a;
        this.prevTranslation = this.translation;
        this.translation = translation;
        const { start = 1, end = 1 } = ((_a = translation == null ? void 0 : translation.data) == null ? void 0 : _a.totalEpisodes) || {};
        this.setEpisode(Math.max(start, Math.min(this.episode, end)));
        changeSearch({
          balancer: String(translation == null ? void 0 : translation.balancer),
          team: String(translation == null ? void 0 : translation.id),
          translation_type: String(translation == null ? void 0 : translation.type)
        });
      },
      isMissingEpisode(targetEpisode) {
        var _a, _b;
        const totalEpisodes = (_b = (_a = this.translation) == null ? void 0 : _a.data) == null ? void 0 : _b.totalEpisodes;
        return totalEpisodes && (totalEpisodes.start > targetEpisode || totalEpisodes.end < targetEpisode);
      }
    }
  });
  function changeSearch(params) {
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(params)) {
      searchParams.set(key, value);
    }
    const newUrl = window.location.pathname + "?" + searchParams.toString();
    history.pushState({ path: newUrl }, "", newUrl);
  }
  const _hoisted_1$d = { class: "sp-viewport" };
  const _hoisted_2$b = {
    id: "anime_video",
    class: "sp-viewport_video-player",
    "data-video-player": ""
  };
  const _hoisted_3$6 = ["src"];
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    __name: "PlayerContent",
    setup(__props) {
      const selectedStore = useSelectedStore();
      const { translation, episode, getBalancer } = pinia.storeToRefs(selectedStore);
      const playerLink = vue.computed(() => {
        var _a, _b, _c, _d;
        const _translation = translation.value;
        const result = ((_b = (_a = _translation == null ? void 0 : _translation.data) == null ? void 0 : _a.episodes) == null ? void 0 : _b[episode.value]) || ((_c = _translation == null ? void 0 : _translation.data) == null ? void 0 : _c.link);
        if (!result) return "";
        const params = new URLSearchParams();
        const balancerParams = ((_d = getBalancer.value) == null ? void 0 : _d.options.linkParams) || {};
        for (const [key, value] of Object.entries(balancerParams)) {
          params.set(key, value);
        }
        return (typeof result === "object" ? result == null ? void 0 : result.link : result) + `?${params.toString()}`;
      });
      const isUiVisible = vue.ref(true);
      const kodikHandler = (ev) => {
        var _a, _b;
        if (((_a = ev.data) == null ? void 0 : _a.key) === "kodik_player_pause") {
          isUiVisible.value = true;
        } else if (((_b = ev.data) == null ? void 0 : _b.key) === "kodik_player_play") {
          isUiVisible.value = false;
        }
      };
      vue.onMounted(() => {
        window.addEventListener("message", kodikHandler);
      });
      vue.onUnmounted(() => {
        window.removeEventListener("message", kodikHandler);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$d, [
          vue.createElementVNode("div", _hoisted_2$b, [
            vue.createElementVNode("iframe", {
              class: "sp-viewport_iframe",
              src: playerLink.value,
              frameborder: "0",
              allowfullscreen: ""
            }, null, 8, _hoisted_3$6)
          ]),
          vue.createVNode(_sfc_main$f, { "is-ui-visible": isUiVisible.value }, null, 8, ["is-ui-visible"])
        ]);
      };
    }
  });
  const _hoisted_1$c = ["data-title"];
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    __name: "BalancerItem",
    props: {
      active: { type: Boolean },
      disabled: { type: Boolean },
      content: {}
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([
            "b-tag",
            {
              active: _ctx.active,
              disabled: _ctx.disabled
            },
            "balancer"
          ]),
          "data-title": _ctx.content,
          href: ""
        }, [
          vue.createElementVNode("span", null, vue.toDisplayString(_ctx.content), 1)
        ], 10, _hoisted_1$c);
      };
    }
  });
  const _hoisted_1$b = { class: "sp-balancers" };
  const _hoisted_2$a = { class: "title" };
  const _hoisted_3$5 = { class: "list" };
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "BalancerList",
    setup(__props) {
      const headline = vue.ref("Плеер");
      const mainStore = useMainStore();
      const { getBalancers } = pinia.storeToRefs(mainStore);
      const selectedStore = useSelectedStore();
      const { balancerName } = pinia.storeToRefs(selectedStore);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$b, [
          vue.createElementVNode("div", _hoisted_2$a, vue.toDisplayString(headline.value), 1),
          vue.createElementVNode("div", _hoisted_3$5, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(getBalancers), (balancer, index) => {
              return vue.openBlock(), vue.createBlock(_sfc_main$d, vue.mergeProps({
                key: index,
                ref_for: true
              }, {
                content: balancer.title,
                active: vue.unref(balancerName) === balancer.title
              }, {
                onClick: ($event) => vue.unref(selectedStore).setBalancerName(balancer.title)
              }), null, 16, ["onClick"]);
            }), 128))
          ])
        ]);
      };
    }
  });
  const _hoisted_1$a = {
    key: 0,
    class: "size tiny"
  };
  const _hoisted_2$9 = ["data-title"];
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    __name: "TranslationItem",
    props: {
      active: { type: Boolean },
      disabled: { type: Boolean },
      content: {},
      size: {}
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("a", {
          class: vue.normalizeClass([
            "b-menu-line",
            "entry",
            "b-link",
            {
              active: _ctx.active,
              disabled: _ctx.disabled
            }
          ])
        }, [
          _ctx.size !== 0 ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$a, vue.toDisplayString(_ctx.size), 1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            class: "name",
            "data-title": _ctx.content
          }, vue.toDisplayString(_ctx.content), 9, _hoisted_2$9)
        ], 2);
      };
    }
  });
  const _hoisted_1$9 = { class: "sp-translations" };
  const _hoisted_2$8 = { "data-scroll-container": "" };
  const _hoisted_3$4 = {
    class: "inner",
    "data-scroll-content": ""
  };
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "TranslationList",
    setup(__props) {
      const selectedStore = useSelectedStore();
      const { translation: selectedTranslation, translationsSorted } = pinia.storeToRefs(selectedStore);
      const getTotalEpisodes = (targetTranslation) => {
        var _a;
        if (!targetTranslation.data.totalEpisodes) {
          return targetTranslation.data.link ? 1 : 0;
        }
        return (((_a = targetTranslation.data.totalEpisodes) == null ? void 0 : _a.end) - targetTranslation.data.totalEpisodes.start || 0) + 1;
      };
      const title = (value) => {
        let result = "1 эпизод";
        if (!value.data.link && value.data.totalEpisodes) {
          result = (value.data.totalEpisodes.start === value.data.totalEpisodes.end ? `${value.data.totalEpisodes.start}` : `с ${value.data.totalEpisodes.start} по ${value.data.totalEpisodes.end}`) + " эпизод";
        }
        if ("quality" in value.data)
          result += ` [${value.data.quality}]`;
        return result;
      };
      return (_ctx, _cache) => {
        const _directive_scroll_to = vue.resolveDirective("scroll-to");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$9, [
          vue.createElementVNode("div", _hoisted_2$8, [
            vue.createElementVNode("div", _hoisted_3$4, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(translationsSorted), (translation, index) => {
                var _a, _b, _c, _d;
                return vue.withDirectives((vue.openBlock(), vue.createBlock(_sfc_main$b, vue.mergeProps({
                  key: index,
                  ref_for: true
                }, {
                  content: translation.title,
                  active: vue.unref(selectedTranslation) === translation,
                  size: getTotalEpisodes(translation)
                }, {
                  "data-ep-start": ((_b = (_a = translation.data) == null ? void 0 : _a.totalEpisodes) == null ? void 0 : _b.start) || 1,
                  "data-ep-end": ((_d = (_c = translation.data) == null ? void 0 : _c.totalEpisodes) == null ? void 0 : _d.end) || 1,
                  title: title(translation),
                  onClick: ($event) => vue.unref(selectedStore).setTranslation(translation)
                }), null, 16, ["data-ep-start", "data-ep-end", "title", "onClick"])), [
                  [
                    _directive_scroll_to,
                    vue.unref(selectedTranslation) === translation,
                    void 0,
                    {
                      mounted: true,
                      vertical: true
                    }
                  ]
                ]);
              }), 128))
            ])
          ])
        ]);
      };
    }
  });
  const _hoisted_1$8 = { class: "stat_name" };
  const _hoisted_2$7 = ["data-total"];
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "TranslationTypeItem",
    props: {
      active: { type: Boolean },
      content: {},
      total: {}
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$8, [
          vue.createElementVNode("a", {
            class: vue.normalizeClass([
              "b-link",
              {
                active: _ctx.active
              }
            ])
          }, [
            vue.createTextVNode(vue.toDisplayString(_ctx.content), 1),
            vue.createElementVNode("span", {
              class: "size",
              "data-total": _ctx.total
            }, vue.toDisplayString(_ctx.total), 9, _hoisted_2$7)
          ], 2)
        ]);
      };
    }
  });
  const _hoisted_1$7 = { class: "sp-tabs b-stats_bar" };
  const _hoisted_2$6 = { class: "stat_names" };
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "TranslationTypes",
    setup(__props) {
      const selectedStore = useSelectedStore();
      const { translationType, getBalancer } = pinia.storeToRefs(selectedStore);
      const translationTypes = vue.computed(() => {
        var _a, _b, _c, _d;
        const translations = (_a = getBalancer.value) == null ? void 0 : _a.translations;
        return [
          {
            id: 0,
            title: "Озвучка",
            type: "voice",
            total: ((_b = translations == null ? void 0 : translations.voice) == null ? void 0 : _b.length) || 0,
            hidden: false
          },
          {
            id: 1,
            title: "Субтитры",
            type: "subtitles",
            total: ((_c = translations == null ? void 0 : translations.subtitles) == null ? void 0 : _c.length) || 0,
            hidden: false
          },
          {
            id: 2,
            title: ". . .",
            type: "unknown",
            total: 0,
            hidden: (((_d = translations == null ? void 0 : translations.unknown) == null ? void 0 : _d.length) || 0) === 0
          }
        ].filter((item) => !item.hidden);
      });
      const selectTranslationType = (type, disabled) => {
        if (disabled) return;
        selectedStore.setTranslationType(type);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, [
          vue.createElementVNode("div", _hoisted_2$6, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(translationTypes.value, (item) => {
              return vue.openBlock(), vue.createBlock(_sfc_main$9, vue.mergeProps({
                key: item.id,
                ref_for: true
              }, {
                content: item.title,
                total: item.total,
                active: vue.unref(translationType) === item.type
              }, {
                onClick: ($event) => selectTranslationType(item.type, item.hidden)
              }), null, 16, ["onClick"]);
            }), 128))
          ])
        ]);
      };
    }
  });
  const _hoisted_1$6 = { class: "sp-sidebar" };
  const _hoisted_2$5 = { class: "sp-selection_panel" };
  const _hoisted_3$3 = {
    key: 0,
    class: "sp-buttons stretch"
  };
  const _hoisted_4$2 = { class: "sp-buttons group stretch" };
  const _hoisted_5$1 = { class: "number" };
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "PlayerSidebar",
    setup(__props) {
      const mainStore = useMainStore();
      const { anime } = pinia.storeToRefs(mainStore);
      const selectedStore = useSelectedStore();
      const { episode } = pinia.storeToRefs(selectedStore);
      const watched = vue.computed(() => {
        var _a, _b;
        return (((_b = (_a = anime.value) == null ? void 0 : _a.userRate) == null ? void 0 : _b.episodes) || 0) > episode.value;
      });
      const lastWatched = vue.computed(() => {
        var _a, _b;
        return ((_b = (_a = anime.value) == null ? void 0 : _a.userRate) == null ? void 0 : _b.episodes) === episode.value;
      });
      const bookmark = vue.computed(() => {
        return lastWatched.value ? freeSolidSvgIcons.faBookmark : watched.value ? freeSolidSvgIcons.faEye : freeRegularSvgIcons.faBookmark;
      });
      const watchedTitle = vue.computed(() => {
        return lastWatched.value ? "В закладках" : watched.value ? "Просмотрен" : "В просмотренное";
      });
      const submitWatch = async () => {
        var _a, _b;
        if (((_b = (_a = anime.value) == null ? void 0 : _a.userRate) == null ? void 0 : _b.episodes) === episode.value) return;
        const user_rate = $(".b-user_rate.anime-" + anime.value.id);
        const model = user_rate.data("view_object").model;
        const method = user_rate.find("form").data("method").toLowerCase();
        const requestData = {
          episodes: String(episode.value)
        };
        if (method === "post") {
          requestData.status = "watching";
        } else if (method === "patch") {
          if (model.status === "completed") {
            requestData.status = "rewatching";
          } else if (episode.value === anime.value.episodes) {
            requestData.status = "completed";
            if (model.status === "rewatching") {
              requestData.rewatches = String(model.rewatches + 1);
            }
          } else if (model.status !== "rewatching" && model.status !== "watching") {
            requestData.status = "watching";
          }
        }
        const response = await fetch(`/user_rates/${model.id}/edit`, {
          method: "GET"
        });
        const data = await response.text();
        const doc = new DOMParser().parseFromString(data, "text/html");
        const $form = $(doc).find("form");
        $form.find('input[name="user_rate[episodes]"]').val(requestData.episodes);
        if ("status" in requestData) {
          $form.find('select[name="user_rate[status]"]').val(requestData.status);
        }
        if ("rewatches" in requestData) {
          $form.find('input[name="user_rate[rewatches]"]').val(requestData.rewatches);
        }
        $form.addClass("hidden");
        user_rate.find(".b-add_to_list").after($form);
        $form.submit();
      };
      console.log($(document.body).data("user"));
      const isSignedIn = vue.ref($(document.body).data("user").id ? true : false);
      return (_ctx, _cache) => {
        const _component_FaIcon = vue.resolveComponent("FaIcon");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          vue.createElementVNode("div", _hoisted_2$5, [
            vue.createVNode(_sfc_main$c),
            vue.createVNode(_sfc_main$8),
            vue.createVNode(_sfc_main$a)
          ]),
          isSignedIn.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$3, [
            vue.createElementVNode("div", _hoisted_4$2, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["b-link_button", { watched: lastWatched.value }]),
                onClick: _cache[0] || (_cache[0] = ($event) => submitWatch())
              }, [
                vue.createVNode(_component_FaIcon, {
                  icon: bookmark.value,
                  class: "fa-sm"
                }, null, 8, ["icon"]),
                vue.createElementVNode("span", _hoisted_5$1, vue.toDisplayString(watchedTitle.value), 1)
              ], 2)
            ])
          ])) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  const _hoisted_1$5 = { class: "sp-footer" };
  const _hoisted_2$4 = ["data-name", "data-version", "data-version-major", "data-version-minor", "data-version-patch"];
  const _hoisted_3$2 = { class: "name" };
  const _hoisted_4$1 = { class: "version" };
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "PlayerFooter",
    setup(__props) {
      const version = _GM_info.script.version.split(".");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
          vue.createElementVNode("div", {
            class: "script-info",
            "data-name": vue.unref(_GM_info).script.name,
            "data-version": vue.unref(_GM_info).script.version,
            "data-version-major": vue.unref(version)[0],
            "data-version-minor": vue.unref(version)[1],
            "data-version-patch": vue.unref(version)[2]
          }, [
            vue.createElementVNode("span", _hoisted_3$2, vue.toDisplayString(vue.unref(_GM_info).script.name), 1),
            vue.createElementVNode("span", _hoisted_4$1, " v" + vue.toDisplayString(vue.unref(_GM_info).script.version), 1)
          ], 8, _hoisted_2$4)
        ]);
      };
    }
  });
  const _hoisted_1$4 = ["data-episode-number"];
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "EpisodeItem",
    props: {
      active: { type: Boolean },
      disabled: { type: Boolean },
      episode: {},
      watched: { type: Boolean }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_FaIcon = vue.resolveComponent("FaIcon");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([
            "b-link_button",
            {
              dark: _ctx.active || _ctx.disabled,
              disabled: _ctx.disabled
            },
            { watched: _ctx.watched },
            "episode"
          ])
        }, [
          vue.createVNode(_component_FaIcon, {
            icon: vue.unref(freeSolidSvgIcons.faBookmark),
            class: vue.normalizeClass(["fa-sm", { hidden: !_ctx.watched }])
          }, null, 8, ["icon", "class"]),
          vue.createElementVNode("span", {
            class: "number",
            "data-episode-number": _ctx.episode
          }, vue.toDisplayString(_ctx.episode) + " эпизод", 9, _hoisted_1$4)
        ], 2);
      };
    }
  });
  const _hoisted_1$3 = {
    ref: "root",
    class: /* @__PURE__ */ vue.normalizeClass(["sp-episodes_search"])
  };
  const _hoisted_2$3 = {
    class: /* @__PURE__ */ vue.normalizeClass(["sp-episodes_search_input"])
  };
  const _hoisted_3$1 = {
    class: /* @__PURE__ */ vue.normalizeClass(["b-input", "integer"])
  };
  const _hoisted_4 = ["min", "max", "icon-left"];
  const _hoisted_5 = {
    key: 0,
    class: /* @__PURE__ */ vue.normalizeClass(["found-episodes"])
  };
  const _hoisted_6 = {
    key: 0,
    class: /* @__PURE__ */ vue.normalizeClass([
      "sp-episodes_search_buttons",
      "sp-buttons",
      "group"
    ])
  };
  const _hoisted_7 = { class: "icon" };
  const _hoisted_8 = { class: "icon" };
  const _hoisted_9 = { class: "icon" };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "PlayerEpisodesSearch",
    props: {
      episodes: {},
      scrollContainer: { type: Function },
      horizontal: { type: Boolean },
      minEpisodeNumber: {},
      maxEpisodeNumber: {}
    },
    emits: ["hide-click"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const arrowPrev = vue.computed(() => props.horizontal ? freeSolidSvgIcons.faChevronLeft : freeSolidSvgIcons.faChevronUp);
      const arrowNext = vue.computed(() => props.horizontal ? freeSolidSvgIcons.faChevronRight : freeSolidSvgIcons.faChevronDown);
      let scrollOffset = 0;
      const filteredEpisodes = vue.ref([]);
      const currentIndex = vue.ref(0);
      const searchQuery = vue.ref("");
      let scrollElement = null;
      let inputElement = null;
      const resetSearch = () => {
        searchQuery.value = "";
        filteredEpisodes.value = [];
        scrollToIndex(0, true);
        emit("hide-click", false);
      };
      vue.watch(searchQuery, (newValue, oldValue) => {
        if (!oldValue && scrollElement) {
          scrollOffset = props.horizontal ? scrollElement.scrollLeft : scrollElement.scrollTop;
        }
        newValue = newValue.toString().trim();
        if (newValue.length && /\d+/.test(newValue)) {
          filteredEpisodes.value = props.episodes.filter((episode) => String(episode).includes(newValue));
        } else {
          resetScroll(scrollOffset);
          filteredEpisodes.value = [];
        }
        scrollToIndex(0, true);
      });
      const scrollToIndex = (index, shouldFocus = false) => {
        let targetElement;
        if (filteredEpisodes.value.length) {
          currentIndex.value = index;
          const episode = String(filteredEpisodes.value[currentIndex.value]);
          if (episode) {
            if (!scrollElement) return;
            targetElement = scrollElement.querySelector(`[data-scroll-id="${episode}"]`);
            let scrollPosition = 0;
            if (props.horizontal) {
              scrollPosition = targetElement.offsetLeft - targetElement.offsetWidth;
            } else {
              scrollPosition = targetElement.offsetTop - targetElement.offsetHeight;
            }
            setScrollPosition(scrollPosition);
          }
        }
        highlightElement(targetElement, shouldFocus);
      };
      const setScrollPosition = (position) => {
        if (!scrollElement) return;
        if (props.horizontal) {
          scrollElement.scrollLeft = position;
        } else {
          scrollElement.scrollTop = position;
        }
      };
      const highlightElement = (element, shouldFocus) => {
        const highlightClass = "highlight";
        const currentHighlight = scrollElement == null ? void 0 : scrollElement.querySelector(`.${highlightClass}`);
        if (currentHighlight) currentHighlight.classList.remove(highlightClass);
        if (element) element.classList.add(highlightClass);
        if (shouldFocus && inputElement) inputElement.focus();
      };
      const resetScroll = (scrollOffset2) => {
        if (!scrollElement) return;
        if (props.horizontal) {
          scrollElement.scrollLeft = scrollOffset2;
        } else {
          scrollElement.scrollTop = scrollOffset2;
        }
      };
      vue.onMounted(() => {
        scrollElement = props.scrollContainer();
        inputElement = scrollElement == null ? void 0 : scrollElement.querySelector("input");
      });
      return (_ctx, _cache) => {
        const _component_fa_icon = vue.resolveComponent("fa-icon");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          vue.createElementVNode("div", _hoisted_2$3, [
            vue.createElementVNode("div", _hoisted_3$1, [
              vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
                class: vue.normalizeClass(["numeric", "integer"]),
                min: _ctx.minEpisodeNumber,
                max: _ctx.maxEpisodeNumber,
                "icon-left": !_ctx.horizontal ? "search" : void 0,
                placeholder: "№ Эпизода",
                inputmode: "numeric",
                pattern: "\\\\d*",
                type: "number"
              }, null, 8, _hoisted_4), [
                [vue.vModelText, searchQuery.value]
              ])
            ]),
            searchQuery.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, vue.toDisplayString(currentIndex.value + 1) + " / " + vue.toDisplayString(filteredEpisodes.value.length), 1)) : vue.createCommentVNode("", true)
          ]),
          _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "sp-divider vertical" }, null, -1)),
          _ctx.horizontal || searchQuery.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
            vue.createElementVNode("div", {
              class: "b-link_button is-icon",
              onClick: _cache[1] || (_cache[1] = () => {
                if (currentIndex.value < _ctx.minEpisodeNumber) return;
                scrollToIndex(currentIndex.value - 1);
              })
            }, [
              vue.createElementVNode("div", _hoisted_7, [
                vue.createVNode(_component_fa_icon, { icon: arrowPrev.value }, null, 8, ["icon"])
              ])
            ]),
            vue.createElementVNode("div", {
              class: "b-link_button is-icon",
              onClick: _cache[2] || (_cache[2] = () => {
                if (currentIndex.value + 2 > filteredEpisodes.value.length) return;
                scrollToIndex(currentIndex.value + 1);
              })
            }, [
              vue.createElementVNode("div", _hoisted_8, [
                vue.createVNode(_component_fa_icon, { icon: arrowNext.value }, null, 8, ["icon"])
              ])
            ]),
            vue.createElementVNode("div", {
              class: "b-link_button is-icon",
              onClick: resetSearch
            }, [
              vue.createElementVNode("div", _hoisted_9, [
                vue.createVNode(_component_fa_icon, { icon: vue.unref(freeSolidSvgIcons.faTimes) }, null, 8, ["icon"])
              ])
            ])
          ])) : vue.createCommentVNode("", true)
        ], 512);
      };
    }
  });
  const _hoisted_1$2 = {
    key: 0,
    class: /* @__PURE__ */ vue.normalizeClass([
      "sp-episodes_buttons",
      "sp-buttons",
      "group"
    ])
  };
  const _hoisted_2$2 = { class: "icon" };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "EpisodesButtons",
    setup(__props) {
      const optionsStore = useOptionsStore();
      const { searchVisible } = pinia.storeToRefs(optionsStore);
      const selectedStore = useSelectedStore();
      const { translation, totalEpisodes } = pinia.storeToRefs(selectedStore);
      return (_ctx, _cache) => {
        var _a, _b, _c, _d;
        const _component_FaIcon = vue.resolveComponent("FaIcon");
        return !vue.unref(searchVisible) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createElementVNode("div", {
            class: "b-link_button is-icon",
            onClick: _cache[0] || (_cache[0] = ($event) => searchVisible.value = true)
          }, [
            vue.createElementVNode("div", _hoisted_2$2, [
              vue.createVNode(_component_FaIcon, { icon: vue.unref(freeSolidSvgIcons.faMagnifyingGlass) }, null, 8, ["icon"])
            ])
          ])
        ])) : (vue.openBlock(), vue.createBlock(_sfc_main$4, {
          key: 0,
          episodes: Array.from({ length: vue.unref(totalEpisodes) }, (_, i) => {
            var _a2, _b2;
            return (((_b2 = (_a2 = vue.unref(translation)) == null ? void 0 : _a2.data.totalEpisodes) == null ? void 0 : _b2.start) || 1) + i;
          }),
          "scroll-container": () => _ctx.$el.parentElement.querySelector("[data-scroll-content]"),
          horizontal: true,
          "min-episode-number": ((_b = (_a = vue.unref(translation)) == null ? void 0 : _a.data.totalEpisodes) == null ? void 0 : _b.start) || 1,
          "max-episode-number": ((_d = (_c = vue.unref(translation)) == null ? void 0 : _c.data.totalEpisodes) == null ? void 0 : _d.end) || 1,
          onHideClick: _cache[1] || (_cache[1] = ($event) => searchVisible.value = false)
        }, null, 8, ["episodes", "scroll-container", "min-episode-number", "max-episode-number"]));
      };
    }
  });
  const _hoisted_1$1 = {
    class: /* @__PURE__ */ vue.normalizeClass(["icon"])
  };
  const _hoisted_2$1 = {
    class: /* @__PURE__ */ vue.normalizeClass(["icon"])
  };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "HorizontalScroll",
    props: {
      container: {},
      scrollTo: {},
      scrollPositionKey: {},
      arrowStyle: {},
      disableArrows: { type: Boolean },
      enableWheelScroll: { type: Boolean }
    },
    setup(__props) {
      const props = __props;
      function getScrollDelta(event) {
        return event.detail ? event.wheelDelta ? event.wheelDelta / event.detail / 40 * (event.detail > 0 ? 1 : -1) : -event.detail / 3 : (event.wheelDelta || 1) / 120;
      }
      function createScrollHandler(container, scrollStep, animationDuration, direction = "horizontal") {
        let isScrolling = false;
        let isAnimating = false;
        let targetScrollLeft = container.scrollLeft;
        let currentScrollLeft = container.scrollLeft;
        function onScrollEvent(event) {
          event.preventDefault();
          const delta = getScrollDelta(event);
          targetScrollLeft += -delta * scrollStep;
          if (direction === "vertical") {
            targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, container.scrollHeight - container.clientHeight));
          } else {
            targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth));
          }
          if (!isAnimating) {
            animateScroll();
          }
        }
        function animateScroll() {
          const scrollDifference = (targetScrollLeft - currentScrollLeft) / animationDuration;
          isAnimating = true;
          currentScrollLeft = parseFloat((currentScrollLeft + scrollDifference).toFixed(2));
          container.scrollLeft = currentScrollLeft;
          if (Math.abs(scrollDifference) > 0.5) {
            requestAnimationFrame(animateScroll);
          } else {
            isAnimating = false;
          }
        }
        function onScroll() {
          if (!isAnimating) {
            currentScrollLeft = targetScrollLeft = container.scrollLeft;
          }
        }
        function onWheelEvent(event) {
          let isValidWheelEvent = false;
          if (event.wheelDeltaY) {
            isValidWheelEvent = event.wheelDeltaY === (event.deltaY || 0) * -3;
          } else if (event.deltaMode === 0) {
            isValidWheelEvent = true;
          }
          if (isValidWheelEvent) {
            startScroll();
          } else {
            stopScroll();
          }
        }
        function stopScroll() {
          container.removeEventListener("mousewheel", onWheelEvent);
          container.removeEventListener("DOMMouseScroll", onWheelEvent);
        }
        function startScroll() {
          stopScroll();
          if (!isScrolling) {
            container.removeEventListener("mousewheel", onScrollEvent);
            container.removeEventListener("DOMMouseScroll", onScrollEvent);
            container.removeEventListener("scroll", onScroll);
            isScrolling = true;
          }
        }
        container.addEventListener("scroll", onScroll, { passive: false });
        container.addEventListener("mousewheel", onWheelEvent, { passive: false });
        container.addEventListener("DOMMouseScroll", onWheelEvent, { passive: false });
        container.addEventListener("mousewheel", onScrollEvent, { passive: false });
        container.addEventListener("DOMMouseScroll", onScrollEvent, { passive: false });
        return stopScroll;
      }
      let scrollPositions = {};
      const trimObject = (obj, keysToKeep) => {
        const trimmedObject = {};
        keysToKeep.forEach((key) => {
          if (key in obj) {
            trimmedObject[key] = obj[key];
          }
        });
        return trimmedObject;
      };
      const handleScrollPosition = (scrollContainer2, key) => {
        if (key) {
          vue.nextTick(() => {
            if (scrollPositions[key]) {
              scrollContainer2.value.scrollLeft = scrollPositions[key];
            }
          });
          vue.watchEffect(() => {
            const keys = Object.keys(scrollPositions);
            scrollPositions = trimObject(scrollPositions, keys.slice(0, 99));
            scrollPositions[key] = scrollContainer2.value.scrollLeft;
          });
        }
      };
      const isTablet = vue.ref(false);
      const scrollContainer = vue.ref({});
      const dragState = vue.reactive({ dragging: false, pageX: 0, scrollLeft: 0 });
      const arrowVisibility = vue.reactive({ left: false, right: false });
      handleScrollPosition(scrollContainer, props.scrollPositionKey);
      const onMouseDown = (event) => {
        if (!isTablet.value) {
          dragState.dragging = true;
          dragState.pageX = event.pageX;
          dragState.scrollLeft = scrollContainer.value.scrollLeft;
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }
      };
      const onMouseMove = (event) => {
        const deltaX = event.pageX - dragState.pageX;
        scrollContainer.value.scrollLeft = dragState.scrollLeft - deltaX;
      };
      const onMouseUp = () => {
        if (dragState.dragging) {
          dragState.dragging = false;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        }
      };
      const updateArrowVisibility = () => {
        if (scrollContainer.value) {
          const isAtEnd = scrollContainer.value.offsetWidth === scrollContainer.value.scrollWidth;
          arrowVisibility.left = scrollContainer.value.scrollLeft >= 25;
          const rightStep = scrollContainer.value.scrollWidth - scrollContainer.value.offsetWidth;
          arrowVisibility.right = !isAtEnd && scrollContainer.value.scrollLeft <= rightStep - 25;
        }
      };
      const scrollByAmount = (direction) => {
        const scrollAmount = scrollContainer.value.offsetWidth * 0.7;
        let newScrollLeft = direction === "right" ? Math.min(scrollContainer.value.scrollLeft + scrollAmount, scrollContainer.value.scrollWidth) : Math.max(scrollContainer.value.scrollLeft - scrollAmount, 0);
        scrollContainer.value.scrollTo({
          left: newScrollLeft,
          behavior: "smooth"
        });
      };
      const scrollById = (scrollId, smoothScroll) => {
        if (scrollId !== void 0) {
          const el = scrollContainer.value.querySelector(`[data-scroll-id="${scrollId}"]`);
          if (el) {
            const K = el.offsetLeft + el.offsetWidth / 2 - scrollContainer.value.parentElement.offsetWidth / 2;
            scrollContainer.value.scrollTo({
              left: K,
              behavior: smoothScroll ? "smooth" : "auto"
            });
          }
        }
      };
      let wheelScrollHandler;
      vue.watch(() => props.scrollTo, (scrollId) => {
        scrollById(scrollId, true);
      });
      vue.onMounted(() => {
        updateArrowVisibility();
        scrollById(props.scrollTo, false);
        if (props.enableWheelScroll) {
          wheelScrollHandler = createScrollHandler(scrollContainer.value, 120, 20);
        }
      });
      vue.onBeforeUnmount(() => {
        if (props.enableWheelScroll && wheelScrollHandler) {
          wheelScrollHandler();
        }
      });
      const containerClasses = vue.computed(() => ({
        [props.container]: true,
        drag: dragState.dragging
      }));
      const arrowClasses = {
        arrow: true,
        "is-icon": true
      };
      const arrowLeftClasses = vue.computed(function() {
        return {
          ...arrowClasses,
          left: true
        };
      });
      const arrowRightClasses = vue.computed(() => ({
        ...arrowClasses,
        right: true
      }));
      return (_ctx, _cache) => {
        const _component_fa_icon = vue.resolveComponent("fa-icon");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(containerClasses.value),
          "data-scroll-container": ""
        }, [
          vue.createVNode(vue.Transition, { name: "fade" }, {
            default: vue.withCtx(() => [
              !_ctx.disableArrows ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(arrowLeftClasses.value),
                onClick: _cache[0] || (_cache[0] = ($event) => scrollByAmount("left"))
              }, [
                vue.createElementVNode("div", _hoisted_1$1, [
                  vue.createVNode(_component_fa_icon, { icon: vue.unref(freeSolidSvgIcons.faChevronLeft) }, null, 8, ["icon"])
                ])
              ], 2)), [
                [vue.vShow, arrowVisibility.left]
              ]) : vue.createCommentVNode("", true)
            ]),
            _: 1
          }),
          vue.createVNode(vue.Transition, { name: "fade" }, {
            default: vue.withCtx(() => [
              !_ctx.disableArrows ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(arrowRightClasses.value),
                onClick: _cache[1] || (_cache[1] = ($event) => scrollByAmount("right"))
              }, [
                vue.createElementVNode("div", _hoisted_2$1, [
                  vue.createVNode(_component_fa_icon, { icon: vue.unref(freeSolidSvgIcons.faChevronRight) }, null, 8, ["icon"])
                ])
              ], 2)), [
                [vue.vShow, arrowVisibility.right]
              ]) : vue.createCommentVNode("", true)
            ]),
            _: 1
          }),
          vue.createElementVNode("div", {
            ref_key: "scrollContainer",
            ref: scrollContainer,
            "data-scroll-content": "",
            class: vue.normalizeClass(["inner"]),
            onScrollPassive: updateArrowVisibility,
            onDragstart: _cache[2] || (_cache[2] = vue.withModifiers(() => {
            }, ["prevent"])),
            onMousedown: onMouseDown,
            onClickCapture: _cache[3] || (_cache[3] = vue.withModifiers(() => {
            }, ["prevent"]))
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 544)
        ], 2);
      };
    }
  });
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "PlayerEpisodesList",
    setup(__props) {
      const mainStore = useMainStore();
      const { anime, data } = pinia.storeToRefs(mainStore);
      const selectedStore = useSelectedStore();
      const { episode } = pinia.storeToRefs(selectedStore);
      const selectEpisode = (targetEpisode) => {
        if (selectedStore.isMissingEpisode(targetEpisode)) return;
        selectedStore.setEpisode(targetEpisode);
      };
      return (_ctx, _cache) => {
        const _directive_scroll_to = vue.resolveDirective("scroll-to");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_sfc_main$3),
          vue.createVNode(_sfc_main$2, {
            container: "sp-episodes_container",
            "enable-wheel-scroll": true,
            "scroll-to": vue.unref(episode)
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(data).totalEpisodes, (targetEpisode) => {
                var _a, _b;
                return vue.withDirectives((vue.openBlock(), vue.createBlock(_sfc_main$5, vue.mergeProps({
                  key: targetEpisode,
                  ref_for: true
                }, {
                  active: vue.unref(episode) === targetEpisode,
                  disabled: vue.unref(selectedStore).isMissingEpisode(targetEpisode),
                  episode: targetEpisode,
                  watched: ((_b = (_a = vue.unref(anime)) == null ? void 0 : _a.userRate) == null ? void 0 : _b.episodes) === targetEpisode
                }, {
                  episode: targetEpisode,
                  "data-scroll-id": targetEpisode,
                  onClick: ($event) => selectEpisode(targetEpisode)
                }), null, 16, ["episode", "data-scroll-id", "onClick"])), [
                  [
                    _directive_scroll_to,
                    vue.unref(episode) === targetEpisode,
                    void 0,
                    {
                      mounted: true,
                      horizontal: true
                    }
                  ]
                ]);
              }), 128))
            ]),
            _: 1
          }, 8, ["scroll-to"])
        ], 64);
      };
    }
  });
  const _hoisted_1 = { class: "subheadline" };
  const _hoisted_2 = ["data-player-sidebar"];
  const _hoisted_3 = {
    key: 0,
    class: "sp-container sp-episodes"
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const mainStore = useMainStore();
      const { anime } = pinia.storeToRefs(mainStore);
      const optionsStore = useOptionsStore();
      const { hasEpisodes, sidebarVisible, sidebarHeight } = pinia.storeToRefs(optionsStore);
      const selectedStore = useSelectedStore();
      const headline = vue.ref("Смотреть");
      mainStore.initBalancers();
      const nextEpisode = (watchedEpisodes) => {
        return watchedEpisodes + (selectedStore.isMissingEpisode(watchedEpisodes + 1) ? 0 : 1);
      };
      const hasColorTextHint = vue.ref(false);
      vue.onMounted(() => {
        $(document).on("ajax:success", () => {
          var _a, _b;
          const $user_rate = $(".b-user_rate.anime-" + anime.value.id);
          anime.value.userRate = (_a = $user_rate.data("view_object")) == null ? void 0 : _a.model;
          if ((_b = anime.value.userRate) == null ? void 0 : _b.episodes) {
            let episode = nextEpisode(anime.value.userRate.episodes);
            if (episode > anime.value.episodes) {
              episode = anime.value.userRate.episodes;
            }
            selectedStore.setEpisode(episode);
          }
        });
        if (getComputedStyle(document.documentElement).getPropertyValue("--color-text-hint")) {
          hasColorTextHint.value = true;
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", _hoisted_1, vue.toDisplayString(headline.value), 1),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["block", { "boop": hasColorTextHint.value }])
          }, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["sp-container", "sp-content", { "max-height": vue.unref(sidebarHeight) }]),
              "data-player-sidebar": vue.unref(sidebarVisible) ? "visible" : "hidden",
              "data-player-container": ""
            }, [
              vue.createVNode(_sfc_main$e),
              vue.createVNode(_sfc_main$7)
            ], 10, _hoisted_2),
            vue.unref(hasEpisodes) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
              vue.createVNode(_sfc_main$1)
            ])) : vue.createCommentVNode("", true),
            vue.createVNode(_sfc_main$6)
          ], 2)
        ], 64);
      };
    }
  });
  function scrollTo(element, binding) {
    let parent = element.parentElement;
    for (let i = 0; i < 3; i++) {
      if (!parent) break;
      const hasScroll = parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth;
      if (hasScroll) {
        break;
      }
      parent = parent.parentElement;
    }
    if (!parent) return;
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const scrollOptions = {
      behavior: binding.modifiers.smooth ? "smooth" : "auto"
    };
    if (binding.modifiers.vertical || !binding.modifiers.horizontal) {
      scrollOptions.top = elementRect.top - parentRect.top + parent.scrollTop - parentRect.height / 2 + elementRect.height / 2;
    }
    if (binding.modifiers.horizontal || !binding.modifiers.vertical) {
      scrollOptions.left = elementRect.left - parentRect.left + parent.scrollLeft - parentRect.width / 2 + elementRect.width / 2;
    }
    parent.scrollTo(scrollOptions);
  }
  const VScrollTo = {
    updated: (element, binding) => {
      if (!binding.modifiers.updated || !binding.value) return;
      scrollTo(element, binding);
    },
    mounted: (element, binding) => {
      if (!binding.modifiers.mounted || !binding.value) return;
      scrollTo(element, binding);
    }
  };
  let app;
  class Player {
    constructor() {
    }
    render() {
      const pinia$1 = pinia.createPinia();
      app = vue.createApp(_sfc_main);
      app.use(pinia$1);
      app.directive("scroll-to", VScrollTo);
      app.component("FaIcon", FontAwesomeIcon);
      const $app = $("<div>", {
        id: "shiki_player",
        class: "cc shiki-player"
      });
      $(".p-animes .b-db_entry").after($app);
      app.mount($app.get()[0]);
    }
    destroy() {
      var _a;
      (_a = document.getElementById("shiki_player")) == null ? void 0 : _a.remove();
      app == null ? void 0 : app.unmount();
    }
  }
  let player;
  E({
    init() {
      player = new Player();
    },
    events: [
      {
        preconditions: {
          predicates: [
            () => !!document.getElementById("animes_show") && !document.getElementById("shiki_player")
          ]
        },
        target: document,
        type: [
          "page:load",
          "turbolinks:load",
          ["attachEvent", "DOMContentLoaded"]
        ],
        listener: async () => {
          player.render();
        }
      },
      {
        preconditions: {
          predicates: [
            () => !!document.getElementById("shiki_player")
          ]
        },
        target: document,
        type: "turbolinks:before-cache",
        listener: () => {
          player.destroy();
        }
      }
    ]
  });

})(Vue, Pinia, window["fontawesome-svg-core"], window["free-solid-svg-icons"], KodikWrapper, window["free-regular-svg-icons"]);