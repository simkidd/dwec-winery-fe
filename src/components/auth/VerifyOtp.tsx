"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { userRequestVerification, userVerify } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card } from "../ui/card";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  code: z.string().min(6, {
    message: "Verification code must be 6 digits",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

const VerifyOtp = ({ email }: { email: string }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: userVerify,
    onSuccess: async (data) => {
      toast.success(data?.message || "Account verified successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const resendVerifyCodeMutation = useMutation({
    mutationFn: userRequestVerification,
    onSuccess: async (data) => {
      toast.success(data?.message || "Account verified successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  console.log("email>>", email)

  const onSubmit = async (values: FormValues) => {
    verifyCodeMutation.mutate(values);
  };

  const handleResend = async () => {
    resendVerifyCodeMutation.mutate(email);
  };

  return (
    <Card className="w-full rounded-[6px] md:p-6">
      <div className="flex items-center justify-center p-6 font-bold">LOGO</div>
      <div className="px-6 pb-6">
        <h4 className="font-medium leading-[2.375rem] text-2xl mb-1">
          Verify Your Account
        </h4>
        <p className="text-muted-foreground">
          Enter the 6-digit code sent to your email
        </p>
      </div>
      <div className="px-6 md:pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="mx-auto max-w-xs">
                  <FormLabel className="text-center block mb-4">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-12 w-12 text-lg border-2"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-center mt-4">
                    Check your email for the verification code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col items-center space-y-4">
              <Button
                type="submit"
                className="w-full  rounded-sm cursor-pointer"
                disabled={verifyCodeMutation.isPending}
              >
                {verifyCodeMutation.isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Verify Account"
                )}
              </Button>

              <Button
                variant="link"
                className="text-sm text-muted-foreground cursor-pointer"
                type="button"
                onClick={handleResend}
              >
                Didn&apos;t receive code? Resend
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default VerifyOtp;
