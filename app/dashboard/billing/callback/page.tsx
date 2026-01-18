"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function BillingCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (reference) {
      // In a real app, we might poll the backend here to confirm the webhook was processed.
      // For now, we'll just show a success message and allow the user to go back.
      // The webhook handler in the backend is what actually updates the DB.
      setStatus("success");
    } else if (searchParams.get("trxref")) {
        setStatus("success");
    } else {
      setStatus("error");
    }
  }, [reference, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Confirming your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === "success" ? (
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "success" ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {status === "success" 
              ? "Your organization has been upgraded. It may take a few moments for the changes to reflect on your dashboard."
              : "Something went wrong with your transaction. Please try again or contact support."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard/organizations">
            <Button className="w-full min-w-[200px]">Go to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
