"use client";
import { registerUser } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Google } from "iconsax-reactjs";
import { Check, Eye, EyeOff, Loader2Icon, Wine, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
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
import AgeConsentModal from "./AgeConsentModal";
import { Card } from "../ui/card";

// Base schema for all users
const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain at least one special character",
      }),
    confirmPassword: z.string().optional(),
    newsletter: z.boolean(),
    tac: z.boolean().refine((val) => val, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(true);
  const [over18, setOver18] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/login";

  const handleAgeConfirm = () => {
    setOver18(true);
    setShowAgeModal(false);
  };

  const handleAgeCancel = () => {
    router.push(callbackUrl);
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      newsletter: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data?.message);
      router.push(callbackUrl);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const data = {
      fullName: values.firstName + " " + values.lastName,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
      newsletter: values.newsletter,
    };

    // console.log(">>>>>>", data);
    registerMutation.mutate(data);
  };

  return (
    <>
      {showAgeModal ? (
        <AgeConsentModal
          open={showAgeModal && !over18}
          onConfirm={handleAgeConfirm}
          onCancel={handleAgeCancel}
        />
      ) : (
        <Card className="w-full rounded-[6px] md:p-6">
          <div className="flex items-center justify-center p-6 font-bold">
            <Link href={"/"}>
              <div className="flex items-center space-x-2">
                <Wine className="h-6 w-6 text-primary shrink-0" />
                <span className="text-xl font-bold text-nowrap">
                  DWEC Winery
                </span>
              </div>
            </Link>
          </div>
          <div className="px-6 pb-6">
            <h4 className="font-medium leading-[2.375rem] text-2xl mb-1">
              Sign up & sip better
            </h4>
            <p className="text-muted-foreground">
              Access exclusive bottles and special offers
            </p>
          </div>

          <div className="px-6 pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl className="focus-within:border-primary">
                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          defaultCountry="NG"
                          placeholder="Enter phone number"
                          value={field.value}
                          onChange={field.onChange}
                          className={cn(
                            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-none transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                            "[&>input]:h-full [&>input]:outline-none",
                            "[&>div>select]:text-popover-foreground [&>div>select]:bg-popover [&>div>select]:focus:bg-accent [&>div>select]:focus:text-accent-foreground"
                          )}
                          error={
                            field.value
                              ? isValidPhoneNumber(field.value)
                                ? undefined
                                : "Invalid phone number"
                              : "Phone number required"
                          }
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
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
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
                            className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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

                {/* Newsletter Subscription */}
                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md p-4 border">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          className="focus-visible:border-primary focus-visible:ring-0 cursor-pointer"
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Subscribe to our newsletter for exclusive offers and
                          updates
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tac"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md p-4 border">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          className="focus-visible:border-primary focus-visible:ring-0 cursor-pointer"
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          I agree to the Terms and Conditions
                        </FormLabel>
                        {/* <FormMessage /> */}
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full rounded-sm cursor-pointer"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2Icon className="animate-spin" />
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>

            <div className="w-full mt-3 mb-3 flex justify-center">
              <Button
                variant="link"
                className="text-sm text-muted-foreground cursor-pointer"
                type="button"
                asChild
              >
                <Link href={"/login"}>
                  Already have an account? Sign in instead
                </Link>
              </Button>
            </div>
            <div className="w-full flex items-center py-3">
              <Separator className="flex-1" />
              <span className="mx-4 text-neutral-400 dark:text-gray-500">
                or
              </span>
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
      )}
    </>
  );
};

export default SignUpForm;

export function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    {
      text: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      text: "At least 1 uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      text: "At least 1 lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      text: "At least 1 number",
      valid: /[0-9]/.test(password),
    },
    {
      text: "At least 1 special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-muted-foreground">Password must contain:</p>
      <ul className="grid grid-cols-2 gap-1">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-center gap-2">
            {req.valid ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-gray-300" />
            )}
            <span
              className={`text-[10px] ${
                req.valid ? "text-green-600" : "text-muted-foreground"
              }`}
            >
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
