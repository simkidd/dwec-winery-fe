export interface IBlogPost {
  id: string;
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
