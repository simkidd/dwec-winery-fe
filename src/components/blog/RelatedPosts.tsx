"use client";
import { IBlogPost } from "@/interfaces/blog.interface";
import { getRelatedPosts } from "@/lib/api/blog";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export default function RelatedPosts({
  currentPostId,
}: {
  currentPostId: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["related-posts", currentPostId],
    queryFn: () => getRelatedPosts(currentPostId),
    enabled: !!currentPostId,
  });

  const relatedPosts = data?.data as IBlogPost[];

  if (!isLoading && (!relatedPosts || relatedPosts.length === 0 || error)) {
    return null;
  }

  return (
    <div className="mt-12 border-t pt-6">
      <h4 className="mb-6 text-lg font-medium">You might also like</h4>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {relatedPosts!.map((post) => (
            <div key={post._id} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
                  <Image
                    src={post.image?.imageUrl || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h5 className="mb-1 text-sm font-medium text-primary">
                  {post.category || "Uncategorized"}
                </h5>
                <h3 className="text-lg font-bold group-hover:text-primary">
                  {post.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
