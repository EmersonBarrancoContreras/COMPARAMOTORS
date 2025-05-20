// advertisement.model.ts
import { AdvertisementTag } from './enums/advertisement-tag.enum';

export interface Advertisement {
  id?: number;
  title: string;
  content: string;
  tag: AdvertisementTag;
  redirectLink?: string;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdvertisementRequest {
  title: string;
  content: string;
  tag: AdvertisementTag;
  redirectLink?: string;
  images?: File[];
}

export interface AdvertisementResponse {
  id: number;
  title: string;
  content: string;
  tag: AdvertisementTag;
  redirectLink?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
