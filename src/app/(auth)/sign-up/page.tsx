import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

const pageTitle = "Create an account";

export const metadata: Metadata = {
  title: pageTitle,
};

const SignUpPage = () => {
  return (
    <div>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
