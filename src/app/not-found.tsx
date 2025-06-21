import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Warning2 } from "iconsax-reactjs";
import { Home } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex flex-col items-center justify-center p-4 text-center relative">
      <div className="absolute top-6 left-6">
        <Logo />
      </div>
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex justify-center">
            <Warning2 className="h-16 w-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            404 Not Found
          </h1>
          <p className="text-lg text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg" className="rounded-sm">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Still lost? Try searching or check out our{" "}
            <Link
              href="/help"
              className="font-medium text-primary hover:underline"
            >
              help center
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
