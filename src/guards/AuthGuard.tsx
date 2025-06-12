"use client";
import React from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // const dispatch = useAppDispatch();
  // const token = cookies.get(TOKEN_NAME);

  // useEffect(() => {
  //   if (token) {
  //     dispatch(setLoading(true));
  //     if (data) {
  //       cookies.set(USER_DETAILS, JSON.stringify(data?.data?.user));
  //       dispatch(loginSuccess({ user: data?.data }));
  //     }
  //   }
  // }, [dispatch, data, token]);

  // useEffect(() => {
  //   // Set loading to false when user data is done loading
  //   if (!isPending) {
  //     dispatch(setLoading(false));
  //   }
  // }, [isPending, dispatch]);

  return <>{children}</>;
};

export default AuthGuard;
