/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
//// <reference types="vite-plugin-monkey/global" />

declare module '*.gql';
declare module '*.graphql';

declare module '*.gql' {
  const Query: import('graphql').DocumentNode;
  export default Query;
  export const _queries: Record<string, import('graphql').DocumentNode>;
  export const _fragments: Record<
      string,
      import('graphql').FragmentDefinitionNode
  >;
}

// https://github.com/turbolinks/turbolinks?tab=readme-ov-file#full-list-of-events
interface TurbolinksEventMap {
  'turbolinks:click': Event;
  'turbolinks:before-visit': Event;
  'turbolinks:visit': Event;
  'turbolinks:request-start': Event;
  'turbolinks:request-end': Event;
  'turbolinks:before-cache': Event;
  'turbolinks:before-render': Event;
  'turbolinks:render': Event;
  'turbolinks:load': Event;
}

interface ShikiUser {
  id: string | null;
  isCommentsAutoCollapsed: boolean;
  isCommentsAutoLoaded: boolean;
  isDayRegistered: boolean;
  isModerator: boolean;
  isSignedIn: boolean;
  isWeekRegistered: boolean;
  url: string | null;
  isSignedIn: boolean;
}

interface Window {
  SHIKI_USER: ShikiUser;
}