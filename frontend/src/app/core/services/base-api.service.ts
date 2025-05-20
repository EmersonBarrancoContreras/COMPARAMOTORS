// base-api.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject, Inject, Optional, InjectionToken } from '@angular/core';
import { environment } from '@environments/environments';

export const RESOURCE_PATH = new InjectionToken<string>('RESOURCE_PATH');

@Injectable()
export class BaseApiService<T> {
  protected http = inject(HttpClient);
  protected apiUrl: string;

  constructor(@Optional() @Inject(RESOURCE_PATH) protected resourcePath: string = '') {
    this.apiUrl = `${environment.apiUrl}/${resourcePath}`;
  }

  getAll(params?: any): Observable<T[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<T[]>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(item: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}`, item);
  }

  update(id: number, item: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para crear un FormData a partir de un objeto
  protected createFormData(data: any): FormData {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value) && value[0] instanceof File) {
          // Si es un array de archivos
          value.forEach((file: File) => {
            formData.append(key, file);
          });
        } else if (typeof value === 'object' && !(value instanceof File)) {
          // Si es un objeto pero no un archivo, convertir a JSON
          formData.append(key, JSON.stringify(value));
        } else {
          // Valores primitivos y archivos individuales
          formData.append(key, value);
        }
      }
    });
    return formData;
  }
}
