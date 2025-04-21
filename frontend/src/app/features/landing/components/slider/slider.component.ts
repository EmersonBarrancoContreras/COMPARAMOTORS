import { Component, OnInit, ViewChild } from '@angular/core';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '@services/product.service';
import { CommonModule } from '@angular/common';
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
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  providers: [ProductService],
})
export class SliderComponent implements OnInit {
  @ViewChild('carousel') carousel!: Carousel; // Referencia al carrusel de PrimeNG
  visible: boolean = false; // Control para mostrar/ocultar el diálogo
  autoplayerTimer: any; // Temporizador para el carrusel automático

  products: Product[] = []; // Lista de productos a mostrar en el carrusel
  responsiveOptions: any[] | undefined; // Opciones de diseño responsivo para el carrusel
  displayDialog: boolean = false; // Control para mostrar/ocultar el diálogo
  selectedProduct: Product | null = null; // Producto seleccionado para mostrar

  constructor(private productService: ProductService) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.productService.getProductsSmall().then((products) => {
      this.products = products.map((product) => ({
        ...product,
        image: product.images?.[0] || 'assets/img/foto.png',
      }));
    });

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

  // Método para iniciar el carrusel automático
  onPageChange(event: any) {
    if (this.autoplayerTimer) {
      clearTimeout(this.autoplayerTimer);
    }

    this.autoplayerTimer = setTimeout(() => {
      if (this.carousel) {
        this.carousel.startAutoplay();
      }
    }, 5000);
  }

  // Método para mostrar el diálogo con la imagen del producto
  showImage(product: Product) {
    this.selectedProduct = product;
    this.displayDialog = true;
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
