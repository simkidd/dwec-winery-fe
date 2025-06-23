"use client";
import React, { useState } from "react";
import VerifyPayment from "./VerifyPayment";
import PaymentVerificationSuccess from "./PaymentVerificationSuccess ";
import PaymentVerificationError from "./PaymentVerificationError ";
import { IOrderDetails } from "@/interfaces/order.interface";

type VerificationState = "pending" | "success" | "error";

const OrderConfirmationComp = ({ reference }: { reference: string }) => {
  const [verificationState, setVerificationState] =
    useState<VerificationState>("pending");

  const [orderData, setOrderData] = useState<IOrderDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleVerificationSuccess = (data: IOrderDetails) => {
    setOrderData(data);
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

      {verificationState === "success" && orderData && (
        <PaymentVerificationSuccess orderData={orderData} />
      )}

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
