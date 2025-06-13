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
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const email = Array.isArray(searchParams.email)
    ? searchParams.email[0]
    : searchParams.email;

  return (
    <div>
      <VerifyOtp email={email as string} />
    </div>
  );
};

export default VerifyUser;
