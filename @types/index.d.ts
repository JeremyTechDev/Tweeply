export interface iAuthData {
  consumer_key: string;
  consumer_secret: string;
  access_token: string;
  access_token_secret: string;
}

export type iTweet =
  | RecentTweetsResponse['data'][0]
  | ConversationResponse['data'][0];

export type iUser =
  | RecentTweetsResponse['includes']['users'][0]
  | ConversationResponse['includes']['users'][0];

// Autogenerated with https://transform.tools/json-to-typescript
export type RecentTweetsResponse = {
  data: Array<{
    created_at: string;
    public_metrics: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
    };
    text: string;
    author_id: string;
    id: string;
    entities?: {
      mentions?: Array<{
        start: number;
        end: number;
        username: string;
        id: string;
      }>;
      annotations?: Array<{
        start: number;
        end: number;
        probability: number;
        type: string;
        normalized_text: string;
      }>;
      urls?: Array<{
        start: number;
        end: number;
        url: string;
        expanded_url: string;
        display_url: string;
        images?: Array<{
          url: string;
          width: number;
          height: number;
        }>;
        status?: number;
        title?: string;
        description?: string;
        unwound_url?: string;
        media_key?: string;
      }>;
    };
    attachments?: {
      poll_ids?: Array<string>;
      media_keys?: Array<string>;
    };
  }>;
  includes: {
    media: Array<{
      media_key: string;
      type: string;
      alt_text: string;
      url?: string;
      preview_image_url?: string;
    }>;
    users: Array<{
      profile_image_url: string;
      name: string;
      username: string;
      id: string;
      url: string;
    }>;
  };
  meta: {
    newest_id: string;
    oldest_id: string;
    result_count: number;
    next_token: string;
  };
};

// Autogenerated with https://transform.tools/json-to-typescript
export type ConversationResponse = {
  data: Array<{
    author_id: string;
    text: string;
    public_metrics: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
    };
    referenced_tweets: Array<{
      type: string;
      id: string;
    }>;
    entities: {
      mentions: Array<{
        start: number;
        end: number;
        username: string;
        id: string;
      }>;
      annotations?: Array<{
        start: number;
        end: number;
        probability: number;
        type: string;
        normalized_text: string;
      }>;
      urls?: Array<{
        start: number;
        end: number;
        url: string;
        expanded_url: string;
        display_url: string;
        media_key: string;
      }>;
    };
    created_at: string;
    id: string;
    attachments?: {
      media_keys: Array<string>;
    };
  }>;
  includes: {
    users: Array<{
      username: string;
      name: string;
      profile_image_url: string;
      id: string;
      url: string;
    }>;
    media: Array<{
      media_key: string;
      type: string;
      alt_text: string;
      url?: string;
      preview_image_url?: string;
    }>;
    tweets: Array<{
      author_id: string;
      text: string;
      attachments?: {
        media_keys: Array<string>;
      };
      public_metrics: {
        retweet_count: number;
        reply_count: number;
        like_count: number;
        quote_count: number;
      };
      entities: {
        mentions: Array<{
          start: number;
          end: number;
          username: string;
          id: string;
        }>;
        urls?: Array<{
          start: number;
          end: number;
          url: string;
          expanded_url: string;
          display_url: string;
          media_key: string;
        }>;
      };
      created_at: string;
      id: string;
      referenced_tweets?: Array<{
        type: string;
        id: string;
      }>;
    }>;
  };
  meta: {
    newest_id: string;
    oldest_id: string;
    result_count: number;
  };
};

// Autogenerated with https://transform.tools/json-to-typescript
export type SingleTweetResponse = {
  data: {
    text: string;
    created_at: string;
    public_metrics: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
    };
    entities: {
      urls: Array<{
        start: number;
        end: number;
        url: string;
        expanded_url: string;
        display_url: string;
        media_key: string;
      }>;
      annotations: Array<{
        start: number;
        end: number;
        probability: number;
        type: string;
        normalized_text: string;
      }>;
    };
    author_id: string;
    attachments: {
      media_keys: Array<string>;
    };
    id: string;
  };
  includes: {
    media: Array<{
      media_key: string;
      type: string;
      alt_text: string;
      url?: string;
      preview_image_url?: string;
    }>;
    users: Array<{
      username: string;
      name: string;
      profile_image_url: string;
      url: string;
      id: string;
    }>;
  };
};
