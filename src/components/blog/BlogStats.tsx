"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBlogStats } from "@/lib/api/blog";

const BlogStats = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blog-stats"],
    queryFn: getBlogStats,
  });

  if (error) return <p className="text-red-500">Failed to load blog stats.</p>;

  const renderCard = (title: string, value?: number, loading?: boolean) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16 rounded-md" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );

  const { totalPosts, publishedPosts, unpublishedPosts, featuredPosts } =
    data?.data || {};

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {renderCard("Total Posts", totalPosts, isLoading)}
      {renderCard("Published", publishedPosts, isLoading)}
      {renderCard("Unpublished", unpublishedPosts, isLoading)}
      {renderCard("Featured", featuredPosts, isLoading)}
    </div>
  );
};

export default BlogStats;
