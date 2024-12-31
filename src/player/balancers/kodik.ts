import { Client, SeasonObject } from 'kodikwrapper';
import { Balancer, Translation } from '@/player/balancers';
import { Anime } from '@/api/shikimori/anime.type';

export default class Kodik extends Balancer<'Kodik'> {
  client: Client;

  constructor() {
    super('Kodik');
    this.client = Client.fromToken(import.meta.env.KODIK_TOKEN);
    this.options.linkParams = {
      translations: false
    };
  }

  async init(anime: Anime) {
    try {
      const response = await this.client?.search({
        shikimori_id: +anime.id,
        with_episodes: true
      });
  
      const materials = response.results;
  
      if (!materials.length) {
        return console.warn(this.title, 'Переводы не найдены');
      }
  
      this.data = response;
  
      const translations: Translation<'Kodik'>[] = materials.map((material) => {
        if (material.type === 'anime') {
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
        }
        else {
          const season: SeasonObject | undefined = material.seasons?.[material.last_season || 1];
          const episodesKeys = Object.keys(season!.episodes || {});
  
          return {
            id: material.translation.id,
            title: material.translation.title,
            type: material.translation.type,
            balancer: this.title,
            data: {
              quality: material.quality,
              episodes: season!.episodes,
              totalEpisodes: {
                start: Number(episodesKeys.at(0)),
                end: Number(episodesKeys.at(-1))
              }
            }
          };
        }
      });
  
      this.translations = {
        voice: translations.filter((translation) => translation.type === 'voice'),
        subtitles: translations.filter((translation) => translation.type === 'subtitles')
      };
    } catch (error) {
      console.error('Ошибка при инициализации Kodik', error);
    }

    return this;
  }
}