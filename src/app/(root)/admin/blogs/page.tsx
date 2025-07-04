import BlogManager from "@/components/blog/BlogManager";

const BlogManagerPage = () => {
  return (
    <div>
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            Blog Manager
          </h1>
        </div>
      </section>

      <BlogManager />
    </div>
  );
};

export default BlogManagerPage;
