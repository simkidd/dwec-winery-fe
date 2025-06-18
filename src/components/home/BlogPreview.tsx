import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "../blog/blog-posts";
import BlogCard from "../blog/BlogCard";
import { Button } from "../ui/button";

const BlogPreview = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              From Our Cellar
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover wine tips, cocktail recipes, and stories from our
              vineyards
            </p>
          </div>

          <Button asChild variant={"link"} className="hidden md:flex ">
            <Link href={"/blog"} className="flex items-center gap-1">
              View all articles <ChevronRight />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="gap-2" asChild>
            <Link href={"/blog"}>
              View all articles <ChevronRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
