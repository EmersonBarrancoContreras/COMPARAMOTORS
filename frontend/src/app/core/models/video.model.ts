// video.model.ts
export interface Video {
  id?: number;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoId: string;
  publishedAt: Date;
}

export interface VideoRequest {
  channelId: string;
}

export interface VideoResponse {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoId: string;
  publishedAt: Date;
}
