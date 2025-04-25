import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError, shareReplay } from 'rxjs/operators';
import { News } from '@shared/components/news-infinite/model/news';

@Injectable({
  providedIn: 'root',
})
export class NewsInfiniteService {
  // Estado para registrar la última solicitud
  private lastFetchTime = signal<Date | null>(null);

  // Estado para simular errores
  private shouldFail = signal<boolean>(false);

  // Cache limitada con capacidad máxima
  private readonly MAX_CACHE_ENTRIES = 5;
  private newsCache = new Map<number, News[]>();

  // Imágenes con rutas estables
  private imagesPaths: string[] = [
    'assets/img/1.png',
    'assets/img/2.png',
    'assets/img/3.png',
    'assets/img/4.png',
    'assets/img/5.png',
  ];

  // Categorías para diversificar el contenido mock
  private categories: string[] = [
    'Automóviles',
    'Motocicletas',
    'Repuestos',
    'Accesorios',
    'Talleres',
  ];

  // Genera noticias con menor consumo de memoria
  private generateMockNews(count: number, startIndex: number = 0): News[] {
    // Limitamos el número máximo de noticias para evitar problemas de memoria
    const safeCount = Math.min(count, 24); // Limitamos a 24 noticias máximo

    return Array.from({ length: safeCount }, (_, i) => {
      const imageIndex = (startIndex + i) % this.imagesPaths.length;
      const categoryIndex = (startIndex + i) % this.categories.length;

      // Creamos objetos más ligeros y evitamos crear demasiados datos
      return {
        id: startIndex + i + 1, // Mantenemos el id como número para cumplir con la interfaz News
        title: `${this.categories[categoryIndex]}: Noticia ${startIndex + i + 1}`,
        description: `Esta es una noticia sobre ${this.categories[categoryIndex].toLowerCase()}.`,
        imageUrl: this.imagesPaths[imageIndex],
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Reducimos el rango a 7 días
      };
    });
  }

  /**
   * Gestiona el tamaño de la caché para evitar fugas de memoria
   */
  private manageCache(): void {
    // Si la caché excede el tamaño máximo, eliminamos las entradas más antiguas
    if (this.newsCache.size > this.MAX_CACHE_ENTRIES) {
      // Encontrar la página más antigua y eliminarla
      const oldestPage = Math.min(...Array.from(this.newsCache.keys()));
      this.newsCache.delete(oldestPage);
    }
  }

  /**
   * Obtiene noticias paginadas con caché
   */
  getNews(page: number, itemsPerPage: number): Observable<News[]> {
    // Limitamos la cantidad de items por página para prevenir problemas de memoria
    const safeItemsPerPage = Math.min(itemsPerPage, 20);

    // Verificar caché primero
    if (this.newsCache.has(page)) {
      return of(this.newsCache.get(page) || []);
    }

    // Actualizar timestamp
    this.lastFetchTime.set(new Date());

    // Simulación de error (con probabilidad reducida)
    if (this.shouldFail()) {
      return throwError(() => new Error('Error al cargar noticias')).pipe(
        delay(200) // Reducimos el delay para mejor rendimiento
      );
    }

    // Calcular índice
    const startIndex = (page - 1) * safeItemsPerPage;

    // Generar noticias
    const news = this.generateMockNews(safeItemsPerPage, startIndex);

    // Guardar en caché y gestionar su tamaño
    this.newsCache.set(page, news);
    this.manageCache();

    // Simular latencia REDUCIDA (menos tiempo de espera)
    const latency = Math.min(150 + Math.floor(Math.random() * 100), 250);

    // Retornar con latencia simulada
    return of(news).pipe(
      delay(latency),
      shareReplay(1), // Compartir la respuesta para evitar múltiples generaciones
      catchError((error) => {
        console.error('Error obteniendo noticias:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Limpia la caché de noticias
   */
  clearCache(): void {
    this.newsCache.clear();
  }

  /**
   * Limpia una página específica de la caché
   */
  clearPageFromCache(page: number): void {
    this.newsCache.delete(page);
  }

  getLastFetchTime(): Date | null {
    return this.lastFetchTime();
  }

  setShouldFail(shouldFail: boolean): void {
    this.shouldFail.set(shouldFail);
  }
}
