// news.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News, NewsRequest, NewsResponse } from '../models/news.model';
import { NewsTag } from '../models/enums/news-tags.enum';
import { BaseApiService } from './base-api.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService extends BaseApiService<NewsResponse> {
  private cacheService = inject(CacheService);

  constructor() {
    super('news');
  }
  getAllNews(params?: any): Observable<NewsResponse[]> {
    const cacheKey = `news-all-${JSON.stringify(params || {})}`;

    return this.cacheService.getOrRetrieve(
      cacheKey,
      () => super.getAll(params),
      15 * 60 * 1000 // Cache for 15 minutes
    );
  }
  getNewsById(id: number): Observable<NewsResponse> {
    const cacheKey = `news-${id}`;

    return this.cacheService.getOrRetrieve(
      cacheKey,
      () => super.getById(id),
      15 * 60 * 1000 // Cache for 15 minutes
    );
  }

  createNews(news: NewsRequest): Observable<NewsResponse> {
    const formData = this.createFormData(news);
    return this.http.post<NewsResponse>(`${this.apiUrl}/add`, formData);
  }
  updateNews(id: number, news: NewsRequest): Observable<NewsResponse> {
    const formData = this.createFormData(news);
    const result = this.http.put<NewsResponse>(`${this.apiUrl}/${id}`, formData);

    // Invalidar la caché para esta noticia y la lista de noticias
    result.subscribe({
      next: () => {
        this.cacheService.clearCache(`news-${id}`);
        this.cacheService.clearCache(/^news-all-/); // Limpiar todas las entradas que comienzan con 'news-all-'
      }
    });

    return result;
  }
  deleteNews(id: number): Observable<void> {
    const result = super.delete(id);

    // Invalidar la caché
    result.subscribe({
      next: () => {
        this.cacheService.clearCache(`news-${id}`);
        this.cacheService.clearCache(/^news-all-/);
      }
    });

    return result;
  }

  /**
   * Obtiene noticias filtradas por etiqueta
   */
  getNewsByTag(tag: NewsTag): Observable<NewsResponse[]> {
    const cacheKey = `news-tag-${tag}`;

    return this.cacheService.getOrRetrieve(
      cacheKey,
      () => this.http.get<NewsResponse[]>(`${this.apiUrl}/tag/${tag}`),
      15 * 60 * 1000
    );
  }
}
