import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '@services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  providers: [ProductService],
})
export class SliderComponent implements OnInit {
  products: Product[] = [];
  responsiveOptions: any[] | undefined;

  constructor(private productService: ProductService) {}

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
