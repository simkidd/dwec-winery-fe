import { getMe } from "@/lib/api/auth";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });
}