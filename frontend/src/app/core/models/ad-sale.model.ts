// ad-sale.model.ts
export interface AdSale {
  id?: number;
  userId: number;
  packageId?: number;
  adSpaceId?: number;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: string;
  content?: string;
  imageUrl?: string;
  redirectUrl?: string;
}

export interface AdSaleResponse {
  id: number;
  user: {
    id: number;
    username: string;
  };
  package?: {
    id: number;
    name: string;
  };
  adSpace?: {
    id: number;
    name: string;
  };
  startDate: Date;
  endDate: Date;
  amount: number;
  status: string;
  content?: string;
  imageUrl?: string;
  redirectUrl?: string;
}
