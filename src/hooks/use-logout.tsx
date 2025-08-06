"use client";
import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import { logout } from "@/store/features/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import cookies from "js-cookie";

const useLogout = () => {
  // const router = useRouter();
  const dispatch = useAppDispatch();

  const signOut = () => {
    cookies.remove(TOKEN_NAME);
    cookies.remove(USER_DETAILS);
    dispatch(logout());
    // router.push("/login");
    window.location.href = "/login"
  };

  return { signOut };
};

export default useLogout;
