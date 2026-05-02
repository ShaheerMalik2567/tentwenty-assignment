import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { authOptions } from "@/server/auth";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | ticktock",
  description: "Sign in to ticktock timesheet management",
};

function LoginFormFallback() {
  return (
    <div
      className="mt-8 h-[280px] w-full max-w-md animate-pulse rounded-lg bg-muted/40"
      aria-hidden
    />
  );
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      <section className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-brand-gray-900 md:text-[32px] md:leading-tight">
            Welcome back
          </h1>
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm className="mt-8" />
          </Suspense>
        </div>
      </section>

      <section
        className="relative hidden flex-1 flex-col justify-center bg-brand-600 px-10 py-16 text-white md:flex lg:px-16 xl:px-20"
        aria-labelledby="login-marketing-heading"
      >
        <div className="max-w-lg">
          <p
            id="login-marketing-heading"
            className="text-4xl font-bold tracking-tight lowercase lg:text-5xl"
          >
            ticktock
          </p>
          <p className="mt-6 text-base leading-relaxed text-brand-gray-200 lg:text-[17px] lg:leading-7">
            Introducing ticktock, our cutting-edge web application designed to
            revolutionize how you manage employee work hours. With ticktock, you
            can effortlessly track and monitor employee attendance and
            productivity from anywhere, anytime, using any internet-connected
            device.
          </p>
        </div>
      </section>
    </div>
  );
}
