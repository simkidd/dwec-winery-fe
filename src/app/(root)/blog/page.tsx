import BlogGrid from "@/components/blog/BlogGrid";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { Metadata } from "next";
import ImageBg from "../../../../public/images/top-view-wine-bottle-marble-background.jpg";

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
        image={ImageBg}
      />

      <div className=" py-12">
        <BlogGrid />
      </div>
    </div>
  );
};

export default BlogPage;
