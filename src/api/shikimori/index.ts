/* https://shikimori.one/api/doc/graphql */
import { GraphQLClient } from 'graphql-request';

import GetAnimesByIds from './queries/GetAnimesByIds.graphql';
import type { AnimeResponse } from '@/api/shikimori/anime.type';

const endpoint = 'https://shikimori.one/api/graphql';

export const client = new GraphQLClient(endpoint);

export async function getAnimesByIds(ids: string | string[]) {
  const response = await client.request<AnimeResponse>(GetAnimesByIds, { ids });
  return response.animes;
}
