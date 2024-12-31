import { Anime } from '@/api/shikimori/anime.type';
import { Balancer, BalancersNames, TranslationsType } from '@/player/balancers';
import { _StoreWithState, defineStore, storeToRefs } from 'pinia';

import * as Api from '@/api/shikimori';
import Kodik from '@/player/balancers/kodik';

import { useOptionsStore } from './options';
import { useSelectedStore } from './selected';

interface MainState {
  anime: Anime;
  data: {
    totalEpisodes: number;
  };
  balancers: Balancers;
}

type Balancers = { [Name in BalancersNames]?: Balancer<Name> };

export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    anime: <Anime>{},
    data: {
      totalEpisodes: 0
    },
    balancers: {
      'Kodik': new Kodik()
    }
  }),
  getters: {
    getBalancerByTitle(state) {
      return (title: BalancersNames) => state.balancers[title];
    },
    getBalancers(state) {
      return Object.values(state.balancers);
    }
  },
  actions: {
    async initBalancers() {
      const animeData = (await Api.getAnimesByIds($('.b-user_rate').data('entry').id.toString()))[0];

      const selectedStore = useSelectedStore();
      const { translationsSorted } = storeToRefs(selectedStore);

      const optionsStore = useOptionsStore();
      optionsStore.setHasEpisodes(animeData && animeData.status !== 'anons'
        && (animeData.status === 'ongoing' && animeData.episodes === 0 || animeData.episodes > 1));
        
      this.anime = animeData;
      this.data.totalEpisodes = animeData.status === 'released' ? animeData.episodes : animeData?.episodesAired || 0;

      const params = new URLSearchParams(window.location.search);
      const paramBalancer = params.get('balancer');
      const paramTranslationType = params.get('translation_type');
      const paramEpisode = params.get('episode');
      const paramTeam = params.get('team');

      if (paramEpisode) {
        selectedStore.setEpisode(+paramEpisode);
      } else {
        const watchedEpisodes: number = animeData?.userRate?.episodes || 0;
        selectedStore.setEpisode(animeData?.userRate
          ? animeData.userRate?.status !== 'completed' ? watchedEpisodes + 1 : this.data.totalEpisodes
          : 1);
      }

      for (const balancer of Object.values(this.balancers)) {
        await balancer.init(this.anime);
      }

      if (paramBalancer) {
        selectedStore.setBalancerName(paramBalancer as BalancersNames);
      } else {
        selectedStore.setBalancerName('Kodik');
      }

      if (paramTranslationType) {
        selectedStore.setTranslationType(paramTranslationType as TranslationsType);
      } else {
        selectedStore.setTranslationType('voice');
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
