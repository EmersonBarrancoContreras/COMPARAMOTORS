// video.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video, VideoResponse } from '../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/videos';

  getAllVideos(): Observable<VideoResponse[]> {
    return this.http.get<VideoResponse[]>(this.apiUrl);
  }

  syncVideos(channelId: string): Observable<VideoResponse[]> {
    return this.http.post<VideoResponse[]>(`${this.apiUrl}/sync`, {
      channelId,
    });
  }
}
