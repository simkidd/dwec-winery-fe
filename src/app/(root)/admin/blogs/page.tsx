import BlogManager from "@/components/blog/BlogManager";
import PageHeader from "@/components/shared/PageHeader";

const BlogManagerPage = () => {
  return (
    <div>
      <PageHeader
        title="Blog Manager"
        description="Create, edit, and manage blog posts and content"
        image="/images/top-view-wine-bottle-marble-background.jpg"
      />

      <div>
        <BlogManager />
      </div>
    </div>
  );
};

export default BlogManagerPage;
