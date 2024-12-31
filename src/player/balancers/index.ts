import { reactive } from 'vue';
import type { EpisodesObject, SearchResponse } from 'kodikwrapper';
import { Anime } from '@/api/shikimori/anime.type';

export type TranslationsType = 'voice' | 'subtitles' | 'unknown';

export type Translations<B extends BalancersNames> = {
  [p in TranslationsType]: Translation<B>[];
}

export interface Translation<B extends BalancersNames> {
  id: number | null;
  title: string;
  type: TranslationsType;
  balancer: BalancersNames;
  data: Partial<{
    quality: string;
    link: string;
    episodes: EpisodesObject;
    totalEpisodes: {
      start: number;
      end: number;
    };
    linkParams: Partial<LinkParams<B>>;
  }>;
}

export type BalancersNames = 'Alloha' | 'Kodik' | 'Cdnmovies' | 'Videocdn';

export type LinkParams<T extends BalancersNames> =
  T extends 'Alloha' ? AllohaParams :
  T extends 'Kodik' ? KodikParams :
  T extends 'Cdnmovies' ? CdnmoviesParams :
  T extends 'Videocdn' ? VideocdnParams :
      never;

export interface AllohaParams {
  episode: number;
  translation: number | string;
  translation_hidden: string;
  hidden: string;
  only_translation: boolean;
  start: number;
  autoplay: 0 | 1;
  directors_cut: any;
  audio: string;
  subtitle: string;
  block: string;
  poster: string | URL;
}

export interface KodikParams {
  translations: boolean;
  hide_translations: string;
  only_translations: string;
  auto_translation: boolean;
  season: number;
  only_season: boolean;
  episode: number;
  only_episode: boolean;
  hide_selectors: boolean;
  start_from: number;
  geoblock: string;
  poster: string | URL;
}

export interface CdnmoviesParams {
  season: number;
  episode: number;
  translation_id: number;
  geo_allow: string;
  geo_block: string;
  poster: string | URL;
}

export interface VideocdnParams {
  translation: number;
  episode: number;
  start_time: number;
  // автовоспроизведение
  autoplay: 0 | 1;
  // выключение выбора озвучки
  select: 0 | 1;
  // скрыть название
  title: 0 | 1;
  // скрыть плейлист
  nocontrol: 0 | 1;
  // качество видео
  source: '240' | '360' | '480' | '720';
  block: string;
  poster: string | URL;
}

export interface Episode {
  number: number;
  scrollTo: boolean;
}

export interface BalancerOptions<B extends BalancersNames> {
  linkParams: Partial<LinkParams<B>> | object;
}

export type BalancerData<B extends BalancersNames> =
  B extends 'Kodik' ? SearchResponse : B extends 'Alloha' ? object : never;

export class Balancer<B extends BalancersNames> {
  title: B;

  options: BalancerOptions<B> = {
    linkParams: {}
  };

  data = reactive<Partial<BalancerData<B>>>({});
  
  translations = reactive<Partial<Translations<B>>>({});

  constructor(title: B) {
    this.title = title;
  }

  async init(anime: Anime): Promise<any> { return this; };
}