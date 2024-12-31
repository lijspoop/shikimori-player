import { BalancersNames, Translation, TranslationsType } from '@/player/balancers';
import { defineStore, storeToRefs } from 'pinia';
import { useMainStore } from './main';

interface SelectedStore {
  balancerName: BalancersNames | null;
  translationType: TranslationsType | null;
  episode: number;
  prevTranslation: Translation<NonNullable<SelectedStore['balancerName']>> | null;
  translation: Translation<NonNullable<SelectedStore['balancerName']>> | null;
}

export const useSelectedStore = defineStore('selected', {
  state: (): SelectedStore => ({
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
      if (balancerName !== null) {
        const mainStore = useMainStore();
        const { balancers } = storeToRefs(mainStore);
        return [ ...(balancers.value[balancerName]?.translations[translationType || 'unknown'] || []) ].sort((a, b) => a.title.localeCompare(b.title, 'en-US'));;
      }
      return [];
    },
    totalEpisodes({ translation }) {
      if (!translation) return 0;
      
      if (!translation.data.totalEpisodes) {
        return translation.data.link ? 1 : 0;
      }
      return ((translation.data.totalEpisodes?.end || 0) - translation.data.totalEpisodes.start || 0) + 1;
    }
  },
  actions: {
    setBalancerName(balancerName: BalancersNames) {
      this.balancerName = balancerName;
    },
    setTranslationType(type: TranslationsType) {
      this.translationType = type;
    },
    setEpisode(episode: number) {
      this.episode = episode;
      
      changeSearch({
        episode: String(episode)
      });
    },
    setTranslation(translation: Translation<NonNullable<SelectedStore['balancerName']>> | null) {
    
      this.prevTranslation = this.translation;
      this.translation = translation;

      const { start = 1, end = 1 } = translation?.data?.totalEpisodes || {};
      this.setEpisode(Math.max(start, Math.min(this.episode, end)));

      changeSearch({
        balancer: String(translation?.balancer),
        team: String(translation?.id),
        translation_type: String(translation?.type)
      });
    },
    isMissingEpisode(targetEpisode: number) {
      const totalEpisodes = this.translation?.data?.totalEpisodes;
      return totalEpisodes && (totalEpisodes.start > targetEpisode || totalEpisodes.end < targetEpisode);
    }
  }
});

function changeSearch(params: object) {
  const searchParams = new URLSearchParams(window.location.search);
  for (const [ key, value ] of Object.entries(params)) {
    searchParams.set(key, value);
  }
  const newUrl = window.location.pathname + '?' + searchParams.toString();
  history.pushState({ path: newUrl }, '', newUrl);
}