import { blogPosts } from "@/components/blog/blog-posts";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ShareButtons from "@/components/blog/ShareButtons";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { config } from "@/utils/config";
// import { IBlogPost } from "@/interfaces/blog.interface";
// import { config } from "@/utils/config";
import { CalendarDays, Clock, Tag } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  try {
    const { slug } = await params;
    const post = blogPosts.find((post) => post.slug === slug);

    if (!post) {
      throw new Error("Post not found");
    }

    return {
      title: post.title,
      description: post.excerpt,
      canonical: `${config.SITE_URL}/blog/${post.slug}`,
      openGraph: {
        type: "website",
        url: `${config.SITE_URL}/blog/${post.slug}`,
        title: post.title,
        description: post.excerpt,
        images: [
          {
            url: post.imageUrl,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        cardType: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        image: post.imageUrl,
      },
    };
  } catch (error) {
    console.error("Failed to fetch post metadata:", error);

    return {
      title: "post Not Found",
      description: "The requested post could not be found.",
      canonical: `${config.SITE_URL}/post-not-found`,
      openGraph: {
        type: "website",
        url: `${config.SITE_URL}/post-not-found`,
        title: "post Not Found",
        description: "The requested post could not be found.",
        images: [],
      },
      twitter: {
        cardType: "summary",
        title: "post Not Found",
        description: "The requested post could not be found.",
        image: "",
      },
    };
  }
};

// export const generateStaticParams = async () => {
//   try {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     return blogPosts.map((post: any) => ({
//       // id: post?._id,
//       slug: post?.slug,
//     }));
//   } catch (error) {
//     console.log(error);
//   }
// };

const BlogPost = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = blogPosts.find((post) => post.slug === slug);

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <CustomBreadcrumbs blogPost={post} />
      {/* Hero Section */}
      <div className="relative h-96 w-full md:h-[500px]">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 flex h-full items-end pb-8 lg:pb-12 text-white">
          <div className="max-w-3xl">
            <Badge className="mb-3 text-sm rounded-full">{post.category}</Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {post.readTime}
              </span>
              {post.tags?.map((tag) => (
                <span key={tag} className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 pb-20">
        <div className="mx-auto max-w-4xl">
          {/* Article Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div className="mb-8 border-b pb-6">
              <p className="text-xl italic text-gray-600 dark:text-gray-300">
                {post.excerpt}
              </p>
            </div>

            {/* Your actual blog content would go here */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Example content sections */}
            <h2>Introduction</h2>
            <p>This is where your rich blog content would appear...</p>
            <h3>Subheading</h3>
            <p>More detailed content sections...</p>
          </article>

          {/* Share Buttons */}
          <div className="my-12">
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {/* Related Posts */}
          <RelatedPosts currentPostId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
