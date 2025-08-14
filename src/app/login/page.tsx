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
      const returnUrl = searchParams.returnUrl && searchParams.returnUrl !== 'undefined' ? `&returnUrl=${searchParams.returnUrl}` : '';
      return redirect(`/login?message=Could not authenticate user${returnUrl}`);
    }

    const returnUrl = searchParams.returnUrl && searchParams.returnUrl !== 'undefined' ? searchParams.returnUrl : "/dashboard";
    return redirect(returnUrl);
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
      const returnUrl = searchParams.returnUrl && searchParams.returnUrl !== 'undefined' ? `&returnUrl=${searchParams.returnUrl}` : '';
      return redirect(`/login?message=Could not authenticate user${returnUrl}`);
    }

    const returnUrl = searchParams.returnUrl && searchParams.returnUrl !== 'undefined' ? `&returnUrl=${searchParams.returnUrl}` : '';
    return redirect(`/login?message=Check email to continue sign in process${returnUrl}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-6">
      {/* KudoSats Branding */}
      <div className="text-center mb-8">
        <h1 className="font-bold text-4xl mb-2 flex items-center justify-center gap-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kudo</span><span className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">Sats</span>
          <span className="text-yellow-400 text-3xl">⚡</span>
        </h1>
        <p className="text-gray-500 text-sm italic">Where kudos meet sats</p>
        <p className="text-gray-600 mt-4">Sign in to your account</p>
      </div>

      <form className="animate-in flex flex-col gap-4 text-foreground">
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
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Sign In
        </SubmitButton>
        <SubmitButton
          formAction={signUp}
          variant="outline"
          pendingText="Signing Up..."
          className="border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-center text-sm">
            {searchParams.message}
          </div>
        )}
        
        <div className="text-center mt-6">
          <a 
            href="/"
            className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
          >
            ← Back to home
          </a>
        </div>
      </form>
    </div>
  );
}
