import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publicity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publicity.component.html',
  styleUrl: './publicity.component.scss',
})
export class PublicityComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('galleryContainer') galleryContainer!: ElementRef;

  // Array de imágenes para la galería
  images: string[] = [
    'assets/img/foto.png',
    'assets/img/foto2.jpg',
    'assets/img/foto.png',
    'assets/img/foto.png',
    'assets/img/foto.png',
    'assets/img/foto.png',
  ];

  // Variables para la animación
  private animationFrameId: number = 0;
  private scrollSpeed: number = 1; // Velocidad de desplazamiento (píxeles por frame)
  private itemWidth: number = 0;
  private itemsCount: number = 0;
  private allItems: NodeListOf<HTMLElement> | null = null;
  displayImages: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.displayImages = [...this.images, ...this.images];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Necesario para que Angular complete la renderización
      this.setupGallery();
      this.startAnimation();
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  // Inicialización de la galería
  private setupGallery(): void {
    const container = this.galleryContainer.nativeElement;
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

      // Duplicar suficientes elementos para cubrir al menos 2 veces el ancho visible
      const viewportWidth = window.innerWidth;
      const itemsNeeded = Math.ceil(viewportWidth / this.itemWidth) * 2;

      for (let i = 0; i < itemsNeeded; i++) {
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
    const container = this.galleryContainer.nativeElement;
    let currentPosition = 0;

    const animate = () => {
      // Incrementar posición
      currentPosition += this.scrollSpeed;

      // Verificar si un elemento completo ya salió de la vista
      if (currentPosition >= this.itemWidth) {
        // En lugar de reiniciar la posición, mover el primer elemento al final
        const firstItem = this.allItems?.[0] as HTMLElement;
        if (firstItem) {
          container.appendChild(firstItem);
          // Actualizar la lista de elementos
          this.allItems = container.querySelectorAll('.gallery-item');
          // Restablecer posición para evitar saltos
          currentPosition = 0;
          container.style.transform = `translateX(0px)`;
        }
      } else {
        // Aplicar transformación suave
        container.style.transform = `translateX(-${currentPosition}px)`;
      }

      // Continuar animación
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  // Detener animación
  private stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  // Pausar la animación al pasar el cursor
  pauseAnimation(): void {
    this.stopAnimation();
  }

  // Reanudar la animación al quitar el cursor
  resumeAnimation(): void {
    this.startAnimation();
  }
}
