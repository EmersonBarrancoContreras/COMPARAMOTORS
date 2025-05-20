// cache.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, Subject, shareReplay, tap } from 'rxjs';

interface CacheEntry {
  data: any;
  expiry: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheClearSubject = new Subject<string>();
  cacheClear$ = this.cacheClearSubject.asObservable();

  // Tiempo de caché por defecto: 5 minutos
  private defaultCacheTime = 5 * 60 * 1000;

  constructor() {
    // Limpiar la caché cada hora
    setInterval(() => this.clearExpiredCache(), 60 * 60 * 1000);
  }

  /**
   * Obtiene datos cacheados o los recupera con la función proporcionada
   * @param key Clave para identificar los datos en caché
   * @param retrievalFn Función para recuperar los datos si no están en caché
   * @param expiryTime Tiempo en milisegundos para que expire la caché, por defecto 5 minutos
   */
  getOrRetrieve<T>(
    key: string,
    retrievalFn: () => Observable<T>,
    expiryTime: number = this.defaultCacheTime
  ): Observable<T> {
    // Comprobar si hay datos en caché válidos
    const cacheEntry = this.cache.get(key);

    if (cacheEntry && cacheEntry.expiry > Date.now()) {
      return of(cacheEntry.data);
    }

    // Si no hay datos o están caducados, obtenerlos y almacenarlos
    return retrievalFn().pipe(
      tap(data => {
        this.cache.set(key, {
          data,
          expiry: Date.now() + expiryTime
        });
      }),
      // shareReplay para compartir la respuesta entre múltiples suscriptores
      shareReplay(1)
    );
  }
  /**
   * Elimina una entrada específica de la caché o varias si se proporciona una RegExp
   * @param key Clave a eliminar o expresión regular para coincidir con varias claves
   */
  clearCache(key: string | RegExp): void {
    if (key instanceof RegExp) {
      // Si es una expresión regular, eliminar todas las claves que coincidan
      const keysToDelete: string[] = [];
      this.cache.forEach((_, k) => {
        if (key.test(k)) {
          keysToDelete.push(k);
        }
      });

      keysToDelete.forEach(k => {
        this.cache.delete(k);
        this.cacheClearSubject.next(k);
      });
    } else {
      // Si es una clave específica
      this.cache.delete(key);
      this.cacheClearSubject.next(key);
    }
  }

  /**
   * Elimina todas las entradas de la caché
   */
  clearAllCache(): void {
    this.cache.clear();
    this.cacheClearSubject.next('ALL');
  }

  /**
   * Elimina las entradas caducadas de la caché
   */
  private clearExpiredCache(): void {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (entry.expiry < now) {
        this.cache.delete(key);
      }
    });
  }
}
