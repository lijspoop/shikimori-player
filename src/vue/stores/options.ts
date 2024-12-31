import { defineStore } from 'pinia';

interface OptionsState {
  hasEpisodes: boolean;
  sidebarVisible: boolean;
  sidebarHeight: boolean;
  searchVisible: boolean;
}

export const useOptionsStore = defineStore('options', {
  state: (): OptionsState => ({
    hasEpisodes: true,
    sidebarVisible: true,
    sidebarHeight: false,
    searchVisible: false
  }),
  actions: {
    setHasEpisodes(value: boolean) {
      this.hasEpisodes = value;
    },
    setSidebarVisible(value: boolean) {
      this.sidebarVisible = value;
    },
    setSidebarHeight(value: boolean) {
      this.sidebarHeight = value;
    },
    toggleSearchVisible() {
      this.searchVisible = !this.searchVisible;
    },
    setSearchVisible(value: boolean) {
      this.searchVisible = value;
    }
  }
});
