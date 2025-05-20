// ad-space.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdSpace, AdSpaceResponse } from '../models/ad-space.model';

@Injectable({
  providedIn: 'root',
})
export class AdSpaceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/ad-spaces';

  getAllAdSpaces(): Observable<AdSpaceResponse[]> {
    return this.http.get<AdSpaceResponse[]>(this.apiUrl);
  }

  getAdSpaceById(id: number): Observable<AdSpaceResponse> {
    return this.http.get<AdSpaceResponse>(`${this.apiUrl}/${id}`);
  }

  createAdSpace(adSpace: AdSpace): Observable<AdSpaceResponse> {
    return this.http.post<AdSpaceResponse>(this.apiUrl, adSpace);
  }

  updateAdSpace(id: number, adSpace: AdSpace): Observable<AdSpaceResponse> {
    return this.http.put<AdSpaceResponse>(`${this.apiUrl}/${id}`, adSpace);
  }

  deleteAdSpace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
