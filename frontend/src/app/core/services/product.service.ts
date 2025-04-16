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
        name: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISICING ELIT SUSCIPIT QUIS',
        description:
          'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum',
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
        description:
          'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum',
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
        description:
          'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum',
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
