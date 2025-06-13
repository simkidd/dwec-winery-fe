import VerifyOtp from "@/components/auth/VerifyOtp";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Verify account";

export const metadata: Metadata = {
  title: pageTitle,
};

const VerifyUser = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { email } = await searchParams;

  return (
    <div>
      <VerifyOtp email={email as string} />
    </div>
  );
};

export default VerifyUser;
