import { IBlogPost } from "@/interfaces/blog.interface";

export const blogPosts: IBlogPost[] = [
  {
    id: "1",
    title: "The Science Behind Wine Fermentation",
    excerpt:
      "Discover how yeast transforms grape juice into complex wines through fermentation.",
    content: "...full article content...",
    date: "2023-10-15",
    category: "Wine Making",
    imageUrl:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    slug: "wine-fermentation-science",
    readTime: "6 min read",
    tags: ["fermentation", "winemaking", "yeast"],
  },
  {
    id: "2",
    title: "Vodka Distillation: From Grain to Glass",
    excerpt: "Learn the traditional and modern methods of vodka production.",
    content: "...full article content...",
    date: "2023-11-02",
    category: "Spirits Production",
    imageUrl:
      "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    slug: "vodka-distillation-process",
    readTime: "5 min read",
    tags: ["vodka", "distillation", "spirits"],
    featured: true,
  },
  {
    id: "3",
    title: "Aging Whiskey: The Impact of Oak Barrels",
    excerpt:
      "How different oak barrels contribute to whiskey's flavor profile.",
    content: "...full article content...",
    date: "2023-11-18",
    category: "Whiskey Knowledge",
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    slug: "whiskey-aging-process",
    readTime: "7 min read",
    tags: ["whiskey", "aging", "oak"],
  },
  {
    id: "4",
    title: "Craft Cocktails with Premium Spirits",
    excerpt:
      "Elevate your home bar with these sophisticated spirit combinations.",
    content: "...full article content...",
    date: "2023-12-05",
    category: "Mixology",
    imageUrl:
      "https://images.unsplash.com/photo-1551751299-1b51cab2694c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1458&q=80",
    slug: "premium-spirit-cocktails",
    readTime: "4 min read",
    tags: ["cocktails", "mixology", "spirits"],
  },
  {
    id: "5",
    title: "Sustainable Practices in Modern Wineries",
    excerpt: "How wineries are reducing their environmental impact.",
    content: "...full article content...",
    date: "2023-12-20",
    category: "Sustainability",
    imageUrl:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    slug: "sustainable-winery-practices",
    readTime: "8 min read",
    tags: ["sustainability", "eco-friendly", "winery"],
  },
];
