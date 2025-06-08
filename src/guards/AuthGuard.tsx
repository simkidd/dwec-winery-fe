"use client";
import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import { useUser } from "@/hooks/use-user";
import { loginSuccess, setLoading } from "@/store/features/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import cookies from "js-cookie";
import React, { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data, isPending } = useUser();
  const token = cookies.get(TOKEN_NAME);

  useEffect(() => {
    if (token) {
      dispatch(setLoading(true));
      if (data) {
        cookies.set(USER_DETAILS, JSON.stringify(data?.data));
        dispatch(loginSuccess({ user: data?.data }));
      }
    }
  }, [dispatch, data, token]);

  useEffect(() => {
    // Set loading to false when user data is done loading
    if (!isPending) {
      dispatch(setLoading(false));
    }
  }, [isPending, dispatch]);

  return <>{children}</>;
};

export default AuthGuard;
