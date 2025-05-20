// advertisement.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Advertisement,
  AdvertisementResponse,
} from '../models/advertisement.model';
import { AdvertisementTag } from '../models/enums/advertisement-tag.enum';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/advertisement';

  createAdvertisement(advertisement: {
    title: string;
    tag: AdvertisementTag;
    content: string;
    redirectLink?: string;
    images?: File[];
  }): Observable<AdvertisementResponse> {
    const formData = new FormData();
    formData.append('title', advertisement.title);
    formData.append('tag', advertisement.tag.toString());
    formData.append('content', advertisement.content);

    if (advertisement.redirectLink) {
      formData.append('redirectLink', advertisement.redirectLink);
    }

    if (advertisement.images && advertisement.images.length > 0) {
      advertisement.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return this.http.post<AdvertisementResponse>(
      `${this.apiUrl}/add`,
      formData
    );
  }
}
