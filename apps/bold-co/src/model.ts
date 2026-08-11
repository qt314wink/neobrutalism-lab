export type TabId = 'home' | 'about' | 'blog' | 'dashboard';

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  color: string;
  date: string;
  readTime: string;
  author: string;
  summary: string;
  content: string;
}

export interface Review {
  id: number;
  name: string;
  role: string;
  stars: number;
  comment: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  subtitle: string;
  url: string;
  badge: string;
}

export interface BlogDraft {
  title: string;
  category: string;
  color: string;
  author: string;
  readTime: string;
  summary: string;
  content: string;
}

export interface ReviewDraft {
  name: string;
  role: string;
  stars: number;
  comment: string;
}
