export interface IBlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  imageUrl: string;
  slug: string;
  readTime?: string;
  tags?: string[];
  featured?: boolean;
}
