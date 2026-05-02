"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: LoginValues) {
    setSubmitError(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setSubmitError("Invalid email or password. Please try again.");
      return;
    }

    if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("w-full max-w-md space-y-5", className)}
      noValidate
    >
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-semibold text-brand-gray-900"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className={cn(
            "h-11 rounded-lg border-gray-200 bg-white px-3 text-base text-brand-gray-900 md:text-sm",
            "placeholder:text-brand-gray-300",
            "focus-visible:border-brand-600 focus-visible:ring-brand-600/25",
          )}
          aria-invalid={!!form.formState.errors.email}
          {...form.register("email")}
        />
        {form.formState.errors.email?.message ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-semibold text-brand-gray-900"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="•••••••••"
          className={cn(
            "h-11 rounded-lg border-gray-200 bg-white px-3 text-base text-brand-gray-900 md:text-sm",
            "placeholder:text-brand-gray-300",
            "focus-visible:border-brand-600 focus-visible:ring-brand-600/25",
          )}
          aria-invalid={!!form.formState.errors.password}
          {...form.register("password")}
        />
        {form.formState.errors.password?.message ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <Controller
        control={form.control}
        name="remember"
        render={({ field }) => (
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="remember"
              checked={field.value}
              onCheckedChange={(v) => field.onChange(v === true)}
              className="border-gray-300 data-checked:border-brand-700 data-checked:bg-brand-700"
            />
            <Label
              htmlFor="remember"
              className="cursor-pointer text-sm font-normal text-neutral-600"
            >
              Remember me
            </Label>
          </div>
        )}
      />

      {submitError ? (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-700 text-base font-medium text-white shadow-none outline-none transition-colors hover:bg-brand-700/90 focus-visible:ring-4 focus-visible:ring-brand-600/35 disabled:pointer-events-none disabled:opacity-50"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
