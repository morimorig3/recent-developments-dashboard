export interface QiitaUser {
  description: string | null;
  facebook_id: string | null;
  followees_count: number;
  followers_count: number;
  github_login_name: string | null;
  id: string;
  items_count: number;
  linkedin_id: string | null;
  location: string | null;
  name: string;
  organization: string | null;
  permanent_id: number;
  profile_image_url: string;
  team_only: boolean;
  twitter_screen_name: string | null;
  website_url: string | null;
}

export interface QiitaArticle {
  rendered_body: string;
  body: string;
  coediting: boolean;
  comments_count: number;
  created_at: string;
  group: any | null;
  id: string;
  likes_count: number;
  private: boolean;
  reactions_count: number;
  stocks_count: number;
  tags: Array<{
    name: string;
    versions: string[];
  }>;
  title: string;
  updated_at: string;
  url: string;
  user: QiitaUser;
  page_views_count: number | null;
  team_membership: any | null;
  organization_url_name: string | null;
  slide: boolean;
}

export type QiitaResponse = QiitaArticle[];
