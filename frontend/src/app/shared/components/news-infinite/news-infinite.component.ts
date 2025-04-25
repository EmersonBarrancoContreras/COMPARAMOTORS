import {
  Component,
  DestroyRef,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsInfiniteService } from '@services/news-infinite.service';
import { News } from '@shared/components/news-infinite/model/news';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, take, takeUntil } from 'rxjs/operators';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { EMPTY, Subject, timer } from 'rxjs';

@Component({
  selector: 'app-news-infinite',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './news-infinite.component.html',
  styleUrl: './news-infinite.component.scss',
})
export default class NewsInfiniteComponent implements OnInit, OnDestroy {
  // Constantes - reducimos para mejorar rendimiento
  private readonly INITIAL_VISIBLE_ITEMS = 8;
  private readonly ITEMS_PER_LOAD = 8;
  private readonly ITEMS_PER_PAGE = 12; // Reducido de 12 a 8
  private readonly MAX_PAGES = 5;
  private readonly MAX_TOTAL_ITEMS = 24; // Límite máximo de noticias en memoria

  // Para cancelación manual
  private destroyed$ = new Subject<void>();
  private cancelRequests = new Subject<void>();
  private isDestroyed = false;
  private reloadTimer: any = null;

  // Usando signals para el estado
  news = signal<News[]>([]);
  currentPage = signal<number>(1);
  loading = signal<boolean>(false);
  visibleCount = signal<number>(this.INITIAL_VISIBLE_ITEMS);
  hasReachedEnd = signal<boolean>(false);
  error = signal<boolean>(false);

  // Computed signals - optimizados
  visibleNews = computed(() => {
    const allNews = this.news();
    const count = this.visibleCount();
    return allNews.slice(0, Math.min(count, allNews.length));
  });

  hasMoreNews = computed(() => {
    return this.visibleCount() < this.news().length &&
           this.news().length < this.MAX_TOTAL_ITEMS;
  });

  // Servicios inyectados
  private newsService = inject(NewsInfiniteService);
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // Registrar para limpieza
    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });

    // Cargar noticias iniciales
    this.loadInitialNews();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Método único para limpieza
  private cleanup(): void {
    if (this.isDestroyed) return; // Evitar limpieza múltiple

    this.isDestroyed = true;
    this.cancelAllRequests();

    // Limpiar temporizadores
    if (this.reloadTimer) {
      clearTimeout(this.reloadTimer);
      this.reloadTimer = null;
    }

    // Liberar memoria
    this.news.set([]);
  }

  // Método centralizado para cancelar todas las solicitudes
  private cancelAllRequests(): void {
    this.cancelRequests.next();
    this.cancelRequests.complete();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  // Revisa si el componente está destruido antes de actualizar signals
  private safeUpdate(fn: () => void): void {
    if (!this.isDestroyed) {
      // Ejecutar dentro de ngZone solo si es necesario
      this.ngZone.run(() => {
        fn();
        this.cdr.markForCheck(); // Notificar a Angular sobre los cambios
      });
    }
  }

  // Carga las noticias iniciales
  loadInitialNews(): void {
    if (this.loading() || this.isDestroyed) return;

    this.safeUpdate(() => {
      this.error.set(false);
      this.loading.set(true);
    });

    // Usar take(1) para garantizar la finalización del observable
    this.newsService
      .getNews(1, this.ITEMS_PER_PAGE)
      .pipe(
        take(1), // Garantiza que se complete
        takeUntil(this.cancelRequests),
        takeUntil(this.destroyed$),
        catchError((error) => {
          console.error('Error loading news:', error);
          this.safeUpdate(() => this.error.set(true));
          return EMPTY;
        }),
        finalize(() => {
          this.safeUpdate(() => this.loading.set(false));
        })
      )
      .subscribe({
        next: (newNews) => {
          this.safeUpdate(() => {
            this.news.set(newNews);

            if (newNews.length < this.ITEMS_PER_PAGE) {
              this.hasReachedEnd.set(true);
            }
          });
        },
      });
  }

  // Cargar más noticias del servidor
  loadMoreFromServer(): void {
    if (this.loading() || this.hasReachedEnd() || this.isDestroyed) return;

    // No cargar más si alcanzamos el límite
    if (this.news().length >= this.MAX_TOTAL_ITEMS) {
      this.safeUpdate(() => this.hasReachedEnd.set(true));
      return;
    }

    // Límite máximo de páginas
    if (this.currentPage() >= this.MAX_PAGES) {
      this.safeUpdate(() => this.hasReachedEnd.set(true));
      return;
    }

    this.safeUpdate(() => {
      this.error.set(false);
      this.loading.set(true);
    });

    const nextPage = this.currentPage() + 1;

    // Usar take(1) para garantizar la finalización del observable
    this.newsService
      .getNews(nextPage, this.ITEMS_PER_PAGE)
      .pipe(
        take(1), // Garantiza que se complete
        takeUntil(this.cancelRequests),
        takeUntil(this.destroyed$),
        catchError((error) => {
          console.error('Error loading more news:', error);
          this.safeUpdate(() => this.error.set(true));
          return EMPTY;
        }),
        finalize(() => {
          this.safeUpdate(() => this.loading.set(false));
        })
      )
      .subscribe({
        next: (newNews) => {
          // Omitir si el componente ya se destruyó
          if (this.isDestroyed) return;

          // No seguir si no hay más resultados
          if (newNews.length === 0) {
            this.safeUpdate(() => this.hasReachedEnd.set(true));
            return;
          }

          this.safeUpdate(() => {
            // Limitar la cantidad total de noticias en memoria
            const currentNews = this.news();
            const combinedNews = [...currentNews, ...newNews];

            // Si excedemos el máximo, truncar el array
            if (combinedNews.length > this.MAX_TOTAL_ITEMS) {
              this.news.set(combinedNews.slice(0, this.MAX_TOTAL_ITEMS));
              this.hasReachedEnd.set(true);
            } else {
              this.news.set(combinedNews);
            }

            this.currentPage.set(nextPage);

            // Si llegamos a menos resultados de los esperados, es el final
            if (newNews.length < this.ITEMS_PER_PAGE) {
              this.hasReachedEnd.set(true);
            }
          });
        },
      });
  }

  // Muestra más noticias (botón Ver más)
  loadMoreNews(): void {
    if (this.loading() || this.isDestroyed) return;

    // Incrementamos la cantidad de noticias visibles
    const newVisibleCount = Math.min(
      this.visibleCount() + this.ITEMS_PER_LOAD,
      this.MAX_TOTAL_ITEMS
    );

    this.safeUpdate(() => this.visibleCount.set(newVisibleCount));

    // Si nos acercamos al límite, cargar más
    if (
      newVisibleCount + this.ITEMS_PER_LOAD > this.news().length &&
      !this.hasReachedEnd() &&
      this.news().length < this.MAX_TOTAL_ITEMS
    ) {
      this.loadMoreFromServer();
    }
  }

  // Reiniciar en caso de error
  retry(): void {
    if (this.isDestroyed) return;

    // Evitar múltiples reintentos seguidos
    if (this.reloadTimer) {
      clearTimeout(this.reloadTimer);
    }

    this.safeUpdate(() => {
      this.error.set(false);
      this.news.set([]);
      this.currentPage.set(1);
      this.visibleCount.set(this.INITIAL_VISIBLE_ITEMS);
      this.hasReachedEnd.set(false);
    });

    // Pequeña pausa antes de recargar para evitar múltiples solicitudes
    this.reloadTimer = setTimeout(() => {
      if (!this.isDestroyed) {
        this.loadInitialNews();
      }
    }, 100);
  }
}
