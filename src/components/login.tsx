import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Twitter } from "lucide-react";

export function Login() {
  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg border bg-card">
        <h2 className="text-2xl font-bold text-center mb-8">Welcome Back</h2>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="hello@example.com" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>

          <Button className="w-full">Sign In</Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Github className="w-4 h-4 mr-2" />
              Github
            </Button>
            <Button variant="outline" className="w-full">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
