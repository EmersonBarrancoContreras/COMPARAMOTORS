// ad-package.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdPackage, AdPackageResponse } from '../models/ad-package.model';

@Injectable({
  providedIn: 'root',
})
export class AdPackageService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/ad-packages';

  getAllPackages(): Observable<AdPackageResponse[]> {
    return this.http.get<AdPackageResponse[]>(this.apiUrl);
  }

  getPackageById(id: number): Observable<AdPackageResponse> {
    return this.http.get<AdPackageResponse>(`${this.apiUrl}/${id}`);
  }

  createPackage(adPackage: AdPackage): Observable<AdPackageResponse> {
    return this.http.post<AdPackageResponse>(this.apiUrl, adPackage);
  }

  updatePackage(
    id: number,
    adPackage: AdPackage
  ): Observable<AdPackageResponse> {
    return this.http.put<AdPackageResponse>(`${this.apiUrl}/${id}`, adPackage);
  }

  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
