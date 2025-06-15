import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "../blog/blog-posts";
import BlogCard from "../blog/BlogCard";
import { Button } from "../ui/button";

const BlogPreview = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                From Our Cellar
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover wine tips, cocktail recipes, and stories from our
                vineyards
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant={"link"}>
            <Link href={"/blog"} className="flex items-center gap-1">
              View All Articles <ChevronRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
