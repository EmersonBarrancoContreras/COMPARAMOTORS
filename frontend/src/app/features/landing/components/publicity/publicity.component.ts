import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-publicity',
  imports: [],
  templateUrl: './publicity.component.html',
  styleUrl: './publicity.component.scss',
})
export class PublicityComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('galleryContainer') galleryContainer!: ElementRef;

  // Array de imágenes para la galería
  images: string[] = [
    'assets/img/1.png',
    'assets/img/2.png',
    'assets/img/3.png',
    'assets/img/4.png',
    'assets/img/5.png',
    'assets/img/7.png',
  ];

  // Variables para la animación
  private animationFrameId: number = 0;
  private scrollSpeed: number = 1; // Velocidad de desplazamiento (píxeles por frame)
  private itemWidth: number = 0;
  private itemsCount: number = 0;
  private allItems: NodeListOf<HTMLElement> | null = null;
  displayImages: string[] = [];
  private isBrowser: boolean;
  private isDestroyed: boolean = false; // Flag para controlar si el componente está destruido

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone // Inyectamos NgZone para optimizar las animaciones
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.displayImages = [...this.images, ...this.images];
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Reducimos el timeout para mejorar el rendimiento
      setTimeout(() => {
        if (this.isDestroyed) return; // Verificar si el componente ya fue destruido

        // Necesario para que Angular complete la renderización
        this.setupGallery();
        this.startAnimation();
      }, 50); // Reducido de 100ms a 50ms
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.stopAnimation();

    // Eliminar referencias DOM para ayudar al garbage collector
    this.allItems = null;
    if (this.galleryContainer && this.galleryContainer.nativeElement) {
      // Limpiar listeners y referencias
      this.galleryContainer.nativeElement.innerHTML = '';
    }
  }

  // Inicialización de la galería
  private setupGallery(): void {
    if (!this.isBrowser || this.isDestroyed) return;

    const container = this.galleryContainer?.nativeElement;
    if (!container) return;

    this.allItems = container.querySelectorAll('.gallery-item');
    this.itemsCount = this.allItems ? this.allItems.length : 0;

    if (this.itemsCount > 0 && this.allItems) {
      // Calcular el ancho de un elemento (incluyendo margen)
      const firstItem = this.allItems[0];
      const itemStyle = window.getComputedStyle(firstItem);
      this.itemWidth =
        firstItem.offsetWidth +
        parseInt(itemStyle.marginLeft || '0') +
        parseInt(itemStyle.marginRight || '0');

      // Limitamos la cantidad de elementos duplicados para mejorar rendimiento
      const viewportWidth = window.innerWidth;
      // Reducimos la cantidad de duplicados necesarios
      const itemsNeeded = Math.ceil(viewportWidth / this.itemWidth) + 2;

      for (let i = 0; i < itemsNeeded && i < 10; i++) { // Limitamos a 10 máximo
        const index = i % this.itemsCount;
        const clone = this.allItems[index].cloneNode(true) as HTMLElement;
        container.appendChild(clone);
      }

      // Actualizar la lista de elementos
      this.allItems = container.querySelectorAll('.gallery-item');
    }
  }

  // Iniciar animación con efecto continuo
  private startAnimation(): void {
    if (!this.isBrowser || this.isDestroyed) return;

    // Ejecutamos la animación fuera de la zona de detección de cambios de Angular
    this.ngZone.runOutsideAngular(() => {
      const container = this.galleryContainer?.nativeElement;
      if (!container) return;

      let currentPosition = 0;
      let lastTimestamp = 0;

      const animate = (timestamp: number) => {
        if (this.isDestroyed) {
          this.stopAnimation();
          return;
        }

        // Limitar la tasa de fotogramas para mejorar rendimiento
        if (timestamp - lastTimestamp > 16) { // Cerca de 60fps
          lastTimestamp = timestamp;

          // Incrementar posición de forma más eficiente
          currentPosition += this.scrollSpeed;

          // Verificar si un elemento completo ya salió de la vista
          if (currentPosition >= this.itemWidth) {
            // En lugar de reiniciar la posición, mover el primer elemento al final
            const firstItem = this.allItems?.[0] as HTMLElement;
            if (firstItem && container) {
              container.appendChild(firstItem);
              // Actualizar la lista de elementos
              this.allItems = container.querySelectorAll('.gallery-item');
              // Restablecer posición para evitar saltos
              currentPosition = 0;
              container.style.transform = `translateX(0px)`;
            }
          } else if (container) {
            // Usar transform con translateX para mejor rendimiento
            container.style.transform = `translateX(-${currentPosition}px)`;
          }
        }

        // Continuar animación si el componente sigue vivo
        if (!this.isDestroyed) {
          this.animationFrameId = window.requestAnimationFrame(animate);
        }
      };

      // Iniciar el loop de animación
      this.animationFrameId = window.requestAnimationFrame(animate);
    });
  }

  // Detener animación
  private stopAnimation(): void {
    if (this.isBrowser && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  // Pausar la animación al pasar el cursor
  pauseAnimation(): void {
    this.stopAnimation();
  }

  // Reanudar la animación al quitar el cursor
  resumeAnimation(): void {
    if (!this.isDestroyed) {
      this.startAnimation();
    }
  }
}
