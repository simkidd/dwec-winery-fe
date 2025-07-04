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
import { Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card } from "../ui/card";

const formSchema = z.object({
  code: z.string().min(6, {
    message: "Verification code must be 6 digits",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

const RESEND_COOLDOWN = 30;

const VerifyOtp = ({ email }: { email: string }) => {
  const { theme } = useTheme();
  const [cooldown, setCooldown] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

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
      startCooldown();
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
      startCooldown();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const startCooldown = () => {
    setIsCooldownActive(true);
    setCooldown(RESEND_COOLDOWN);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCooldownActive && cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    } else if (cooldown === 0) {
      setIsCooldownActive(false);
    }

    return () => clearTimeout(timer);
  }, [cooldown, isCooldownActive]);

  const onSubmit = async (values: FormValues) => {
    verifyCodeMutation.mutate(values);
  };

  const handleResend = async () => {
    resendVerifyCodeMutation.mutate(email);
  };

  return (
    <Card className="w-full rounded-[6px] md:p-6">
      <div className="flex items-center justify-center p-6 font-bold">
        <Link href={"/"}>
          <div className="h-10">
            <Image
              src={
                theme === "light"
                  ? "/logo/logo-red.png"
                  : "/logo/logo-white.png"
              }
              alt=""
              width={300}
              height={150}
              className="object-contain w-full h-full"
            />
          </div>
        </Link>
      </div>
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
                            className="h-12 w-12 text-lg border data-[active=true]:ring-0 data-[active=true]:border-primary"
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
                className="text-sm text-muted-foreground cursor-pointer disabled:text-gray-400"
                type="button"
                onClick={handleResend}
                disabled={
                  isCooldownActive || resendVerifyCodeMutation.isPending
                }
              >
                {resendVerifyCodeMutation.isPending ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : isCooldownActive ? (
                  `Resend in ${cooldown}s`
                ) : (
                  "Didn't receive code? Resend"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default VerifyOtp;
