
export interface NewsSource {
  title?: string;
  name?: string;
  icon?: string;
  authors?: string[];
}

export interface NewsAuthor {
  thumbnail?: string;
  name?: string;
  handle?: string;
}

export interface RelatedTopic {
  position?: number;
  name?: string;
  topic_token?: string;
  serpapi_link?: string;
  thumbnail?: string;
  title?: string;
}

export interface NewsItem {
  position?: number;
  title: string;
  link: string;
  snippet?: string;
  source?: NewsSource;
  author?: NewsAuthor;
  thumbnail?: string;
  thumbnail_small?: string;
  type?: string;
  video?: boolean;
  topic_token?: string;
  story_token?: string;
  serpapi_link?: string;
  date?: string;
  related_topics?: RelatedTopic[];
  highlight?: Partial<NewsItem>;
  stories?: Partial<NewsItem>[];
}

export interface MenuLink {
  title: string;
  topic_token?: string;
  serpapi_link?: string;
}

export interface SubMenuLink extends MenuLink {
  section_token?: string;
}

export interface NewsApiResponse {
  top_stories_link?: {
    topic_token?: string;
    serpapi_link?: string;
  };
  title?: string;
  news_results?: NewsItem[];
  menu_links?: MenuLink[];
  sub_menu_links?: SubMenuLink[];
  related_topics?: RelatedTopic[];
  related_publications?: RelatedTopic[];
  search_metadata?: {
    status?: string;
    id?: string;
    error?: string;
  };
}
