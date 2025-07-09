import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Forgot your password";

export const metadata: Metadata = {
  title: pageTitle,
};

const ForgotPassword = () => {
  return (
    <div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
