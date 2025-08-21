"use client";
import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import { loginUser } from "@/lib/api/auth";
import { loginFailure, loginSuccess } from "@/store/features/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import cookies from "js-cookie";
import { AlertCircle, Eye, EyeOff, Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
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
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

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
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileStatus, setTurnstileStatus] = useState<
    "success" | "error" | "expired" | "required"
  >("required");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const callbackUrl = searchParams.get("redirect") || "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) => {
      if (!turnstileToken) {
        throw new Error("Please complete the security check");
      }
      return loginUser({ ...values, turnstileToken });
    },
    onSuccess: async (data) => {
      toast.success(data?.message);
      cookies.set(TOKEN_NAME, data?.data?.token);
      // Fetch user data after successful login
      cookies.set(USER_DETAILS, JSON.stringify(data?.data?.user));
      dispatch(loginSuccess({ user: data?.data?.user }));

      window.location.href = callbackUrl;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      dispatch(loginFailure(error?.response?.data?.message || "Login failed"));
      toast.error(error?.response?.data?.message || error?.message);

      // Reset Turnstile on error
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (!turnstileToken) {
      setTurnstileError("Please complete the security check");
      return;
    }
    loginMutation.mutate(values);
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
                      className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
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
                      href="/forgot-password"
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
                        className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm pr-10"
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

            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              options={{
                theme:
                  theme === "dark" || theme === "system" ? "dark" : "light",
                size: "flexible",
              }}
              onError={() => {
                setTurnstileStatus("error");
                setTurnstileError("Security check failed. Please try again.");
              }}
              onExpire={() => {
                setTurnstileStatus("expired");
                setTurnstileError(
                  "Security check expired. Please verify again."
                );
              }}
              onWidgetLoad={() => {
                setTurnstileStatus("required");
                setTurnstileError(null);
              }}
              onSuccess={(token) => {
                setTurnstileStatus("success");
                setTurnstileToken(token);
                setTurnstileError(null);

                console.log("token received:", token);
              }}
              scriptOptions={{
                async: true,
                defer: true,
                appendTo: "head",
              }}
            />
            {turnstileError && (
              <div
                className="flex items-center gap-2 text-red-500 text-sm mb-2"
                aria-live="polite"
              >
                <AlertCircle size={16} />
                <span>{turnstileError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={
                loginMutation.isPending || turnstileStatus !== "success"
              }
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

        <div className="w-full flex justify-center mt-3 mb-3">
          <Button
            variant="link"
            className="text-sm text-muted-foreground cursor-pointer"
            type="button"
            asChild
          >
            <Link href={"/sign-up"}>
              New on our platform? Create an account
            </Link>
          </Button>
        </div>
        {/* <div className="w-full flex items-center py-3">
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
        </div> */}
      </div>
    </Card>
  );
};

export default LoginForm;
