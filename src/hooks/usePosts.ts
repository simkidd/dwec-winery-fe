"use client";
import { IBlogPost, PostFilterInput } from "@/interfaces/blog.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getAllPosts } from "@/lib/api/blog";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const usePosts = (params?: PostFilterInput) => {
  const { data, isPending, isError, refetch } = useQuery<
    PaginatedResponse<IBlogPost>
  >({
    queryKey: ["allPosts", params],
    queryFn: async () => getAllPosts(params),
  });

  const { posts, totalPosts, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { posts: [], totalPosts: 0, totalPages: 0 };

    return {
      posts: data.data || [],
      totalPosts: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
    };
  }, [data, isPending, isError]);

  return {
    posts,
    totalPosts,
    totalPages,
    isPending,
    isError,
    refetch,
  };
};

export default usePosts;
