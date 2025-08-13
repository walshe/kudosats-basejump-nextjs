import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string, returnUrl?: string };
}) {
  const signIn = async (_prevState: any, formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return redirect(`/login?message=Could not authenticate user&returnUrl=${searchParams.returnUrl}`);
    }

    return redirect(searchParams.returnUrl || "/dashboard");
  };

  const signUp = async (_prevState: any, formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?returnUrl=${searchParams.returnUrl}`,
      },
    });

    if (error) {
      return redirect(`/login?message=Could not authenticate user&returnUrl=${searchParams.returnUrl}`);
    }

    return redirect(`/login?message=Check email to continue sign in process&returnUrl=${searchParams.returnUrl}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <Input
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <SubmitButton
          formAction={signUp}
          variant="outline"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
