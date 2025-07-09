import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Reset your password";

export const metadata: Metadata = {
  title: pageTitle,
};

const ResetPasswordPage = () => {
  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
