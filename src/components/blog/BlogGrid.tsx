"use client";
import usePosts from "@/hooks/usePosts";
import { PostFilterInput } from "@/interfaces/blog.interface";
import { cn } from "@/lib/utils";
import { getPaginationRange } from "@/utils/helpers";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import BlogCard from "./BlogCard";
import { Skeleton } from "../ui/skeleton";
import { CalendarDays, Clock } from "lucide-react";

const BlogGrid = () => {
  const [filter, setFilter] = useState<PostFilterInput>({
    page: 1,
    limit: 15,
    isPublished: true,
  });
  const [filterFeatured] = useState<PostFilterInput>({
    page: 1,
    limit: 4,
    isPublished: true,
    featured: true,
  });
  const { posts, isPending, totalPages } = usePosts(filter);
  const { posts: featuredPosts, isPending: loadingFeaturedPosts } =
    usePosts(filterFeatured);

  const onPaginationChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  const FeaturedPostSkeleton = () => (
    <div className="group relative h-full min-h-[540px] overflow-hidden rounded-lg shadow-lg">
      <Skeleton className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="mb-2">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="mb-3 h-8 w-full" />
        <Skeleton className="mb-4 h-6 w-3/4" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="absolute right-4 top-4 h-6 w-16 rounded-full" />
    </div>
  );

  const PostCardSkeleton = () => (
    <div className="group relative h-full min-h-[480px] overflow-hidden rounded-lg shadow-lg">
      <Skeleton className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="mb-2">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="mb-3 h-7 w-full" />
        <Skeleton className="mb-4 h-5 w-3/4" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4 text-transparent" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-transparent" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Featured Post Section */}
      {featuredPosts && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Featured Articles</h2>
          {loadingFeaturedPosts ? (
            <FeaturedPostSkeleton />
          ) : featuredPosts && featuredPosts.length > 0 ? (
            <BlogCard post={featuredPosts[0]} variant="featured" />
          ) : (
            <p className="text-muted-foreground">No featured articles found</p>
          )}
        </div>
      )}

      {/* Regular Posts Grid */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold">Latest Articles</h2>
        {isPending ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>

            {posts.length > 0 && totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPaginationChange(filter?.page - 1)}
                      aria-disabled={filter.page === 1}
                      className={cn(
                        "cursor-pointer",
                        filter.page === 1 && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>

                  {getPaginationRange(filter.page, totalPages).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === filter.page}
                        onClick={() => onPaginationChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPaginationChange(filter.page + 1)}
                      aria-disabled={filter.page >= totalPages}
                      className={cn(
                        "cursor-pointer",
                        filter.page >= totalPages &&
                          "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">No articles found</p>
        )}
      </div>
    </div>
  );
};

export default BlogGrid;
