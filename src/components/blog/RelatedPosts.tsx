import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "./blog-posts";

interface RelatedPostsProps {
  currentPostId: number;
}

export default function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  const relatedPosts = blogPosts
    .filter((post) => post.id !== currentPostId)
    .slice(0, 3);

  return (
    <div className="mt-12 border-t pt-6">
      <h4 className="mb-6 text-lg font-medium">You might also like</h4>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <div key={post.id} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h5 className="mb-1 text-sm font-medium text-primary">
                {post.category}
              </h5>
              <h3 className="text-lg font-bold group-hover:text-primary">
                {post.title}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
