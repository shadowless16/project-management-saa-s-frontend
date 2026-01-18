import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <svg
                  className="w-8 h-8 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7m0 6v2m0 0v2"
                  />
                </svg>
              </div>
            </div>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>
              An error occurred during authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The authentication process failed. Please try again or contact
              support if the problem persists.
            </p>
            <div className="space-y-2 flex flex-col gap-2">
              <Link href="/auth/login" className="w-full">
                <Button className="w-full">Back to Login</Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full bg-transparent">
                  Go to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
