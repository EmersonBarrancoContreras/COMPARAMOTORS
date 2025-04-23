import { Component, DestroyRef, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsInfiniteService } from '@services/news-infinite.service';
import { News } from '@shared/components/news-infinite/model/news';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-news-infinite',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './news-infinite.component.html',
  styleUrl: './news-infinite.component.scss',
})
export class NewsInfiniteComponent {
  // Constantes
  private readonly INITIAL_VISIBLE_ITEMS = 12;
  private readonly ITEMS_PER_LOAD = 8;
  private readonly ITEMS_PER_PAGE = 20; // Cantidad a solicitar por página al API

  // Usando signals para el estado
  news = signal<News[]>([]);
  currentPage = signal<number>(1);
  loading = signal<boolean>(false);
  visibleCount = signal<number>(this.INITIAL_VISIBLE_ITEMS);

  // Computed signals
  visibleNews = computed(() => this.news().slice(0, this.visibleCount()));
  hasMoreNews = computed(() => this.visibleCount() < this.news().length);

  // Servicios inyectados
  private newsService = inject(NewsInfiniteService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Cargar noticias iniciales
    this.loadInitialNews();
  }

  // Carga las noticias iniciales
  loadInitialNews(): void {
    this.loading.set(true);

    this.newsService
      .getNews(1, this.ITEMS_PER_PAGE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newNews) => {
          this.news.set(newNews);
          this.loading.set(false);
          // Verificar si hay suficientes noticias o necesitamos cargar más
          if (newNews.length < this.INITIAL_VISIBLE_ITEMS) {
            this.loadMoreFromServer();
          }
        },
        error: (error) => {
          console.error('Error loading news:', error);
          this.loading.set(false);
        },
      });
  }

  // Cargar más noticias del servidor
  loadMoreFromServer(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.currentPage.update((page) => page + 1);

    this.newsService
      .getNews(this.currentPage(), this.ITEMS_PER_PAGE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newNews) => {
          this.news.update((current) => [...current, ...newNews]);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading more news:', error);
          this.loading.set(false);
        },
      });
  }

  // Muestra más noticias (botón Ver más)
  loadMoreNews(): void {
    // Incrementamos la cantidad de noticias visibles
    const newVisibleCount = this.visibleCount() + this.ITEMS_PER_LOAD;
    this.visibleCount.set(newVisibleCount);

    // Si nos estamos acercando al límite de noticias cargadas, solicitamos más
    if (newVisibleCount + this.ITEMS_PER_LOAD > this.news().length) {
      this.loadMoreFromServer();
    }
  }
}
