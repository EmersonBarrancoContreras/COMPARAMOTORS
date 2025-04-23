import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { News } from '@shared/components/news-infinite/model/news';

/**
 * Servicio para gestionar las noticias con carga infinita
 * Proporciona métodos para obtener noticias paginadas
 */
@Injectable({
  providedIn: 'root',
})
export class NewsInfiniteService {
  // Estado para registrar la última solicitud
  private lastFetchTime = signal<Date | null>(null);

  // Estado para simular errores (útil para pruebas)
  private shouldFail = signal<boolean>(false);

  constructor() {}

  /**
   * Genera un conjunto de noticias ficticias para pruebas
   * @param count Número de noticias a generar
   * @param startIndex Índice inicial para la numeración
   * @returns Array de objetos News
   */
  private generateMockNews(count: number, startIndex: number = 0): News[] {
    return Array.from({ length: count }, (_, i) => ({
      id: startIndex + i + 1,
      title: `Noticia ${startIndex + i + 1}`,
      description: `Esta es la descripción de la noticia ${
        startIndex + i + 1
      }. Contiene información relevante sobre el tema que podría interesar a los lectores.`,
      imageUrl: `/api/placeholder/400/250?text=Noticia+${startIndex + i + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000)
    }));
  }

  /**
   * Obtiene noticias paginadas
   * @param page Número de página solicitada (comienza en 1)
   * @param itemsPerPage Cantidad de elementos por página
   * @returns Observable con el array de noticias
   */
  getNews(page: number, itemsPerPage: number): Observable<News[]> {
    // Actualizamos el timestamp de la última solicitud
    this.lastFetchTime.set(new Date());

    // Simulación de error (útil para pruebas)
    if (this.shouldFail()) {
      return throwError(() => new Error('Error al cargar las noticias')).pipe(
        delay(300)
      );
    }

    const startIndex = (page - 1) * itemsPerPage;
    const news = this.generateMockNews(itemsPerPage, startIndex);

    // Simulamos un retraso en la respuesta para imitar una llamada API real
    return of(news).pipe(
      delay(800),
      catchError(error => {
        console.error('Error obteniendo noticias:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene el timestamp de la última petición realizada
   * @returns Date de la última petición o null
   */
  getLastFetchTime(): Date | null {
    return this.lastFetchTime();
  }

  /**
   * Configura el servicio para simular errores (útil para pruebas)
   * @param shouldFail Indica si las siguientes peticiones deberían fallar
   */
  setShouldFail(shouldFail: boolean): void {
    this.shouldFail.set(shouldFail);
  }
}
