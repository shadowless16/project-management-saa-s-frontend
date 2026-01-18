"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2, ArrowLeft, CreditCard, Zap } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Organization } from "@/types";

export default function BillingPage({ orgId, userEmail }: { orgId: string, userEmail: string | undefined }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const data = await apiFetch<Organization>(`/api/orgs/${orgId}`);
        setOrganization(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrg();
  }, [orgId]);

  const handleUpgrade = async () => {
    if (!userEmail) return;
    setIsRedirecting(true);
    setError(null);

    try {
      const response = await apiFetch<{ authorization_url: string }>("/api/billing/initialize", {
        method: "POST",
        body: JSON.stringify({
          orgId,
          plan: "pro",
          email: userEmail
        })
      });

      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      }
    } catch (err: any) {
      setError(err.message);
      setIsRedirecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading billing details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/organizations/${orgId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className={organization?.plan === 'free' ? 'border-primary shadow-lg ring-1 ring-primary/20' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Free
                {organization?.plan === 'free' && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">Current Plan</span>
                )}
              </CardTitle>
              <CardDescription>Perfect for small teams getting started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">₦0 <span className="text-sm text-muted-foreground font-normal">/ month</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Up to 3 projects</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Basic task management</li>
                <li className="flex items-center gap-2 text-muted-foreground"><Zap className="w-4 h-4" /> AI features (Locked)</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={organization?.plan === 'free'}>
                {organization?.plan === 'free' ? 'Currently Active' : 'Switch to Free'}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className={`relative overflow-hidden ${organization?.plan === 'pro' ? 'border-primary shadow-lg ring-1 ring-primary/20' : ''}`}>
            {organization?.plan !== 'pro' && (
               <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-3 py-1 font-bold rounded-bl-lg">
                 RECOMMENDED
               </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Pro
                {organization?.plan === 'pro' && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">Current Plan</span>
                )}
              </CardTitle>
              <CardDescription>Advanced features for growing organizations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">₦5,000 <span className="text-sm text-muted-foreground font-normal">/ month</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited projects</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority support</li>
                <li className="flex items-center gap-2 font-medium text-primary"><Zap className="w-4 h-4 fill-primary" /> Full AI Integration</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Advanced Analytics</li>
              </ul>
            </CardContent>
            < CardFooter>
              <Button 
                onClick={handleUpgrade} 
                className="w-full gap-2" 
                disabled={organization?.plan === 'pro' || isRedirecting}
              >
                {isRedirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {organization?.plan === 'pro' ? 'Currently Active' : 'Upgrade to Pro'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-muted p-6 rounded-lg text-center space-y-2">
            <h3 className="font-semibold text-sm">Secure Nigerian Payments via Paystack</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Payments are handled securely by Paystack. You can pay with your Nigerian Card, Bank Transfer, or USSD.
            </p>
        </div>
      </div>
    </div>
  );
}
