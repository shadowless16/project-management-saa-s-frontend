import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Project Management Made Simple
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Collaborate with your team, organize tasks, and ship projects faster with TaskFlow's intuitive kanban board and real-time collaboration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg" className="gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-card border border-border">
            <Zap className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Fast & Responsive
            </h3>
            <p className="text-muted-foreground">
              Lightning-fast interface with real-time updates to keep your team in sync.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <Users className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Team Collaboration
            </h3>
            <p className="text-muted-foreground">
              Work together seamlessly with role-based access control and permissions.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <BarChart3 className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Track Progress
            </h3>
            <p className="text-muted-foreground">
              Get insights into your project progress with visual kanban boards.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Why choose TaskFlow?
        </h2>
        <div className="space-y-4">
          {[
            "Intuitive drag-and-drop kanban board interface",
            "Real-time task updates and notifications",
            "Organization and project management",
            "Role-based access control",
            "Easy team member management",
            "Secure with Supabase authentication",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join teams already using TaskFlow to manage their projects.
          </p>
        </div>
        <Link href="/auth/sign-up">
          <Button size="lg" className="gap-2">
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
