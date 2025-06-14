import React from "react";
import BlogCard from "./BlogCard";
import { IBlogPost } from "@/interfaces/blog.interface";

const BlogGrid = ({ posts }: { posts: IBlogPost[] }) => {
  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  return (
    <div className="space-y-8">
      {/* Featured Post Section */}
      {featuredPost && (
        <div className="mb-12">
          <BlogCard post={featuredPost} variant="featured" />
        </div>
      )}

      {/* Regular Posts Grid */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold">Latest Articles</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;
