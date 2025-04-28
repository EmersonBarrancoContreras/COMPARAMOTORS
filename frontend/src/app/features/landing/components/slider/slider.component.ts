import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '@services/product.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    CarouselModule,
    ButtonModule,
    TagModule,
    CommonModule,
    DialogModule,
    NgOptimizedImage,
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  providers: [ProductService],
})
export default class SliderComponent implements OnInit, OnDestroy {
  @ViewChild('carousel') carousel!: Carousel; // Referencia al carrusel de PrimeNG
  visible: boolean = false; // Control para mostrar/ocultar el diálogo
  autoplayerTimer: number | null = null; // Temporizador para el carrusel automático

  products: Product[] = []; // Lista de productos a mostrar en el carrusel
  responsiveOptions: any[] | undefined; // Opciones de diseño responsivo para el carrusel
  displayDialog: boolean = false; // Control para mostrar/ocultar el diálogo
  selectedProduct: Product | null = null; // Producto seleccionado para mostrar

  // Controlar si el componente está destruido
  private isDestroyed: boolean = false;

  constructor(private productService: ProductService) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.loadProducts();
    this.setupResponsiveOptions();
  }

  // Separamos la lógica en métodos más pequeños para mejor mantenimiento
  private loadProducts(): void {
    this.productService.getProductsSmall().then((products) => {
      if (this.isDestroyed) return;

      this.products = products.map((product) => ({
        ...product,
        image: product.images?.[0] || 'assets/img/1.png',
      }));
    });
  }

  private setupResponsiveOptions(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;

    // Limpiar el temporizador al destruir el componente
    this.clearAutoplayTimer();

    // Limpia el body si el diálogo está abierto al destruir
    if (this.displayDialog) {
      document.body.classList.remove('modal-open');
    }

    // Liberar referencias
    this.selectedProduct = null;
    this.products = [];
  }

  // Método para limpiar el temporizador
  private clearAutoplayTimer(): void {
    if (this.autoplayerTimer !== null) {
      clearTimeout(this.autoplayerTimer);
      this.autoplayerTimer = null;
    }
  }

  // Método para iniciar el carrusel automático
  onPageChange(event: any) {
    // Limpiamos el temporizador anterior
    this.clearAutoplayTimer();

    // Solo creamos un nuevo temporizador si el componente sigue activo
    if (!this.isDestroyed) {
      this.autoplayerTimer = window.setTimeout(() => {
        if (!this.isDestroyed && this.carousel) {
          this.carousel.startAutoplay();
        }
      }, 5000);
    }
  }

  // Método para mostrar el diálogo con la imagen del producto
  showImage(product: Product) {
    if (this.isDestroyed) return;

    this.selectedProduct = product;
    this.displayDialog = true;
    document.body.classList.add('modal-open');
  }

  // Añadimos un setter para detectar cambios en displayDialog
  set dialogVisible(value: boolean) {
    this.displayDialog = value;
    if (!value) {
      document.body.classList.remove('modal-open');
    }
  }

  get dialogVisible(): boolean {
    return this.displayDialog;
  }

  // Método para obtener la clase CSS del producto según su estado
  getSeverity(
    status: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return undefined;
    }
  }
}
