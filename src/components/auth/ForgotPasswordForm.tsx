"use client";
import { userForgotPassword } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export type FormValues = z.infer<typeof formSchema>;

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: userForgotPassword,
    onSuccess: async (data) => {
      toast.success(data?.message || "Password reset link sent to your email");
      router.push("/reset-password");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = async (values: FormValues) => {
    forgotPasswordMutation.mutate(values);
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
          Forgot your password?
        </h4>
        <p className="text-muted-foreground">
          Enter your email to receive a password reset link
        </p>
      </div>

      <div className="px-6 md:pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full rounded-sm cursor-pointer mt-2"
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>

        <div className="w-full flex justify-center mt-3 mb-3">
          <Button
            variant="link"
            className="text-sm text-muted-foreground cursor-pointer"
            type="button"
            asChild
          >
            <Link href={"/login"}>Remember your password? Sign in</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ForgotPasswordForm;
