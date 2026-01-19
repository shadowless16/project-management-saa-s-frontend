"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getURL } from "@/lib/url";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev: number) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      if (!showOtp) {
        // Step 1: Request OTP
        const { error: signUpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${getURL()}auth/callback`,
            shouldCreateUser: false,
          },
        });
        if (signUpError) throw signUpError;
        setShowOtp(true);
        setTimer(60); // Start 60s countdown
      } else {
        // Step 2: Verify OTP
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "magiclink",
        });
        if (verifyError) throw verifyError;
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isLoading) return;
    
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${getURL()}auth/callback`,
          shouldCreateUser: false,
        },
      });
      if (resendError) throw resendError;
      setTimer(60);
      setOtp("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-foreground">TaskFlow</h1>
          <p className="text-muted-foreground">Project Management Platform</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {!showOtp ? (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="h-10"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium">
                      Enter Verification Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter code"
                      required
                      value={otp}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                      className="h-12 text-center tracking-[1em] text-xl font-bold"
                      maxLength={8}
                    />
                    <div className="flex items-center justify-between px-1">
                      <p className="text-xs text-muted-foreground">
                        We sent a code to your email.
                      </p>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={timer > 0 || isLoading}
                        className="text-xs font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline"
                      >
                        {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-10 shadow-sm"
                disabled={isLoading}
              >
                {isLoading 
                  ? (showOtp ? "Verifying..." : "Sending...") 
                  : (showOtp ? "Verify Code" : "Send Login Code")}
              </Button>
              {showOtp && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setShowOtp(false)}
                >
                  Change Email
                </Button>
              )}
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-primary font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
