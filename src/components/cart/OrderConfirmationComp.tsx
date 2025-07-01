"use client";
import { useState } from "react";
import PaymentVerificationError from "./PaymentVerificationError ";
import PaymentVerificationSuccess from "./PaymentVerificationSuccess ";
import VerifyPayment from "./VerifyPayment";

type VerificationState = "pending" | "success" | "error";

const OrderConfirmationComp = ({ reference }: { reference: string }) => {
  const [verificationState, setVerificationState] =
    useState<VerificationState>("pending");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleVerificationSuccess = () => {
    setVerificationState("success");
  };

  const handleVerificationError = (message: string) => {
    setErrorMessage(message);
    setVerificationState("error");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {verificationState === "pending" && (
        <VerifyPayment
          reference={reference}
          onSuccess={handleVerificationSuccess}
          onError={handleVerificationError}
        />
      )}

      {verificationState === "success" && <PaymentVerificationSuccess />}

      {verificationState === "error" && (
        <PaymentVerificationError
          message={errorMessage}
          onRetry={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default OrderConfirmationComp;
