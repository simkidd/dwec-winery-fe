"use client";
import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import { logout } from "@/store/features/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const signOut = useCallback(() => {
    router.push("/login");
    try {
      cookies.remove(TOKEN_NAME);
      cookies.remove(USER_DETAILS);
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [dispatch, router]);

  return { signOut };
};

export default useLogout;
