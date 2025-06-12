"use client";
import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import { loginUser } from "@/lib/api/auth";
import { loginFailure, loginSuccess } from "@/store/features/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import cookies from "js-cookie";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Google } from "iconsax-reactjs";
import { Card } from "../ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(3, { message: "Password is required" }),
  // password: z
  //   .string()
  //   .min(8, { message: "Password must be at least 8 characters." }),
});

export type LoginFormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = searchParams.get("redirect") || "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      toast.success(data?.message);
      cookies.set(TOKEN_NAME, data?.data?.token);
      // Fetch user data after successful login
      cookies.set(USER_DETAILS, JSON.stringify(data?.data?.user));
      dispatch(loginSuccess({ user: data?.data?.user }));

      router.push(callbackUrl);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      dispatch(loginFailure(error?.response?.data?.message || "Login failed"));
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <Card className="w-full rounded-[6px] md:p-6">
      <div className="flex items-center justify-center p-6 font-bold">LOGO</div>
      <div className="px-6 pb-6">
        <h4 className="font-medium leading-[2.375rem] text-2xl mb-1">
          Cheers, you&apos;re back
        </h4>
        <p className="text-muted-foreground">
          Sign in to restock your bar with the best
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
                      className="focus-visible:ring-0 shadow-none rounded-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:underline hover:underline-offset-2"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="focus-visible:ring-0 shadow-none rounded-sm pr-10"
                        {...field}
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-sm cursor-pointer mt-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <div className="w-full text-center text-[15px] leading-[1.375rem] mt-3 mb-3">
          <span>New on our platform?</span>
          <Link
            href={"/sign-up"}
            className="text-primary ml-1 hover:underline hover:underline-offset-2"
          >
            Create an account
          </Link>
        </div>
        <div className="w-full flex items-center py-3">
          <Separator className="flex-1" />
          <span className="mx-4 text-neutral-400 dark:text-gray-500">or</span>
          <Separator className="flex-1" />
        </div>
        <div className="w-full flex items-center py-3">
          <div className="w-full flex justify-center gap-1 flex-wrap">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="cursor-pointer rounded-full"
            >
              <Google color="var(--primary)" variant="Bold" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LoginForm;
