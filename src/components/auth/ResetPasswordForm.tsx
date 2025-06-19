"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { userResetPassword, userVerifyResetCode } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2, Wine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { PasswordRequirements } from "./SignUpForm";
import { useRouter } from "next/navigation";

// Code Verification Form Component
const CodeVerificationForm = ({
  onVerified,
}: {
  onVerified: (code: string) => void;
}) => {
  const formSchema = z.object({
    resetCode: z.string().min(6, {
      message: "Please enter the full 6-digit code",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resetCode: "",
    },
  });

  const verifyResetCodeMutation = useMutation({
    mutationFn: userVerifyResetCode,
    onSuccess: (data) => {
      // toast.success(data?.message || "Code verified successfully");
      onVerified(data.resetCode);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || error?.message
      );
      form.resetField("resetCode");
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    verifyResetCodeMutation.mutate(data.resetCode);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="resetCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Reset Code</FormLabel>
              <FormControl>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    {...field}
                    disabled={verifyResetCodeMutation.isPending}
                  >
                    <InputOTPGroup className="gap-2">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-12 w-12 text-lg border data-[active=true]:ring-0 data-[active=true]:border-primary"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={
            verifyResetCodeMutation.isPending || !form.formState.isValid
          }
        >
          {verifyResetCodeMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </Button>
      </form>
    </Form>
  );
};

// Password Reset Form Component
const PasswordResetForm = ({ verifiedCode }: { verifiedCode: string }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, {
          message: "Must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
          message: "Must contain at least one lowercase letter",
        })
        .regex(/[0-9]/, { message: "Must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, {
          message: "Must contain at least one special character",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: userResetPassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully!");
      router.push("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    resetPasswordMutation.mutate({
      resetCode: verifiedCode,
      password: data.password,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    disabled={resetPasswordMutation.isPending}
                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <PasswordRequirements password={field.value} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    disabled={resetPasswordMutation.isPending}
                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full rounded-sm cursor-pointer mt-2"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? (
            <>
              <Loader2 className="mr-1 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
};

// Main Component
const ResetPasswordForm = () => {
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState("");

  const handleCodeVerified = (code: string) => {
    setVerifiedCode(code);
    setIsCodeVerified(true);
  };

  return (
    <Card className="w-full max-w-md rounded-lg">
      <div className="flex flex-col items-center p-6 space-y-6">
        <Link href="/" className="flex items-center space-x-2">
          <Wine className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">DWEC Winery</span>
        </Link>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">
            {isCodeVerified ? "Reset Your Password" : "Verify Your Account"}
          </h2>
          <p className="text-muted-foreground">
            {isCodeVerified
              ? "Create a new password"
              : "Enter the 6-digit code sent to your email"}
          </p>
        </div>

        {!isCodeVerified ? (
          <CodeVerificationForm onVerified={handleCodeVerified} />
        ) : (
          <PasswordResetForm verifiedCode={verifiedCode} />
        )}
      </div>
    </Card>
  );
};

export default ResetPasswordForm;
