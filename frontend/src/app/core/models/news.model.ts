// news.model.ts
import { NewsTag } from './enums/news-tags.enum';

export interface News {
  id?: number;
  title: string;
  content: string;
  tag: NewsTag;
  redirectLink?: string;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsRequest {
  title: string;
  content: string;
  tag: NewsTag;
  redirectLink?: string;
  images?: File[];
}

export interface NewsResponse {
  id: number;
  title: string;
  content: string;
  tag: NewsTag;
  redirectLink?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
