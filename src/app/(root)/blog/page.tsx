import { blogPosts } from "@/components/blog/blog-posts";
import BlogGrid from "@/components/blog/BlogGrid";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { Metadata } from "next";

const pageTitle = "Blog";

export const metadata: Metadata = {
  title: pageTitle,
};

const BlogPage = () => {
  return (
    <div>
      <CustomBreadcrumbs />
      <PageHeader
        title="Blogs"
        description="Discover our latest articles and insights"
      />

      <div className="container mx-auto px-4 py-12">
        <BlogGrid posts={blogPosts} />
      </div>
    </div>
  );
};

export default BlogPage;
