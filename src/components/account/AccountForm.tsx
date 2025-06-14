"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useAppSelector } from "@/store/hooks";

// Base schema for all users
const formSchema = z.object({
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
  tac: z.boolean().refine((val) => val, {
    message: "You must accept the terms and conditions",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

const AccountForm = () => {
  const { user } = useAppSelector((state) => state.auth);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstname || "",
      lastName: user?.lastname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    disabled
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

          <Button type="submit" className="rounded-sm cursor-pointer">
            Update Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AccountForm;
