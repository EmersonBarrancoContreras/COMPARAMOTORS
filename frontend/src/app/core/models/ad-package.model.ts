import { AdSpace } from './ad-space.model';

// ad-package.model.ts
export interface AdPackage {
  id?: number;
  name: string;
  description?: string;
  price: number;
  adSpaces?: number[];
  duration: number; // en días
}

export interface AdPackageResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  adSpaces: AdSpace[];
  duration: number;
}
