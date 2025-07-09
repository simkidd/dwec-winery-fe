import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Login";

export const metadata: Metadata = {
  title: pageTitle,
};

const LoginPage = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
