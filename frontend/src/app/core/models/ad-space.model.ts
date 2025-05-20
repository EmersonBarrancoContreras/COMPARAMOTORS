// ad-space.model.ts
export interface AdSpace {
  id?: number;
  name: string;
  description?: string;
  location: string;
  price: number;
  available: boolean;
}

export interface AdSpaceResponse {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  available: boolean;
}
