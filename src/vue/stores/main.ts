import { defineStore } from 'pinia';

interface MainStore {
  hasEpisodes: boolean;
  sidebarVisible: boolean;
}

export const useMainStore = defineStore('main', {
  state: () => (<MainStore>{
    // anime: <Anime>{},
    hasEpisodes: true,
    sidebarVisible: true
    // balancers: <(Balancer|ChildBalancer)[]>[]
  })
});
