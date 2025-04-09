import { Injectable } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  inventoryStatus: string;
  rating: number;
  images?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  getProductsSmall(): Promise<Product[]> {
    return Promise.resolve([
      {
        id: '1000',
        name: 'Bamboo Watch',
        description: 'Product Description',
        price: 65,
        quantity: 24,
        category: 'Accessories',
        inventoryStatus: 'INSTOCK',
        rating: 5,
        images: ['assets/img/foto.png'],
      },
      {
        id: '1001',
        name: 'Black Watch',
        description: 'Product Description',
        price: 72,
        quantity: 61,
        category: 'Accessories',
        inventoryStatus: 'LOWSTOCK',
        rating: 4,
        images: ['assets/img/foto2.jpg'],
      },
      {
        id: '1002',
        name: 'Blue Band',
        description: 'Product Description',
        price: 79,
        quantity: 2,
        category: 'Fitness',
        inventoryStatus: 'OUTOFSTOCK',
        rating: 3,
        images: ['assets/img/foto.png'],
      },
    ]);
  }
}
