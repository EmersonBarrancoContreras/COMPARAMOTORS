export interface News {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  date?: Date | string;
  author?: string;
  category?: string;
  url?: string;
  tags?: string[];
}
