import { Field, ID, ObjectType } from 'type-graphql';

export interface AnimeResponse {
  animes: Anime[];
}

@ObjectType()
export class Anime {
  @Field({ nullable: true })
    english?: string;
  @Field()
    episodes!: number;
  @Field()
    episodesAired!: number;
  @Field(() => ID)
    id!: string;
  @Field({ nullable: true })
    isCensored?: boolean;
  @Field({ nullable: true })
    japanese?: string;
  @Field({ nullable: true })
    kind?: AnimeKindEnum;
  @Field({ nullable: true })
    licenseNameRu?: string;
  @Field(() => ID, { nullable: true })
    malId?: string;
  @Field()
    name!: string;
  @Field({ nullable: true })
    nextEpisodeAt?: Date;
  @Field()
    related!: Related[];
  @Field()
    releasedOn!: IncompleteDate;
  @Field({ nullable: true })
    russian?: string;
  @Field()
    status!: AnimeStatusEnum;
  @Field(() => [ String! ])
    synonyms!: string[];
  @Field()
    updatedAt!: Date;
  @Field()
    url!: string;
  @Field({ nullable: true })
    userRate?: UserRate;
}

enum AnimeKindEnum {
  TV = 'tv',
  Movie = 'movie',
  OVA = 'ova',
  ONA = 'ona',
  Special = 'special',
  TV_Special = 'tv_special',
  Music = 'music',
  PV = 'pv',
  CM = 'cm'
}

enum AnimeStatusEnum {
  Anons = 'anons',
  Ongoing = 'ongoing',
  Released = 'released'
}

type IncompleteDate = {
  date: Date;
};

type Related = {
  anime?: Anime;
  id: string;
  relationKind: RelationKindEnum;
};

enum RelationKindEnum {
  Adaptation = 'adaptation',
  Alternative_Setting = 'alternative_setting',
  Alternative_Version = 'alternative_version',
  Character = 'character',
  Full_Story = 'full_story',
  Other = 'other',
  Parent_Story = 'parent_story',
  Prequel = 'prequel',
  Sequel = 'sequel',
  Side_Story = 'side_story',
  Spin_off = 'spin_off',
  Summary = 'summary'
}

type UserRate = {
  episodes: number;
  id: typeof ID;
  status: UserRateStatusEnum;
};

enum UserRateStatusEnum {
  Planned = 'planned',
  Watching = 'watching',
  Rewatching = 'rewatching',
  Completed = 'completed',
  On_Hold = 'on_hold',
  Dropped = 'dropped'
}