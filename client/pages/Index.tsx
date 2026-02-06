import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import AppNav from "@/components/Navigation";

export default function Index() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [displayText, setDisplayText] = useState("");

  // Check authentication status
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const user = localStorage.getItem("currentUser");
    const lastUser = localStorage.getItem("lastAuthenticatedUser");

    setIsAuthenticated(!!auth);
    setUserRole(role || "");
    setCurrentUser(user || "");
  }, []);

  // Typing effect for welcome message
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    const welcomeText = `Welcome Back, ${currentUser}!`;
    let index = 0;
    setDisplayText("");

    const timer = setInterval(() => {
      if (index <= welcomeText.length) {
        setDisplayText(welcomeText.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [isAuthenticated, currentUser]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-deep-900 via-blue-deep-800 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Animated Grid Background */}
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0 0h60v60H0z\" fill=\"none\"/><path d=\"M0 0h60v1H0z\" stroke=\"rgba(100,116,139,0.1)\" stroke-width=\"1\"/><path d=\"M0 0v60h1V0z\" stroke=\"rgba(100,116,139,0.1)\" stroke-width=\"1\"/><circle cx=\"30\" cy=\"30\" r=\"1\" fill=\"rgba(100,116,139,0.1)\"/></svg>')] opacity-30"}></div>
      </div>

      {/* Navigation */}
      <AppNav />

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            User Management
            <span className="block text-blue-400">System</span>
          </h1>
          {!isAuthenticated && (
            <>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                A modern solution for user authentication and management. Secure,
                simple, and efficient.
              </p>
              <p className="text-slate-400 text-lg">
                Use the navigation above to login or contact an administrator for
                access.
              </p>
            </>
          )}
        </div>

        {/* Instructions - Only show for non-authenticated users */}
        {!isAuthenticated && (
          <Card className="bg-slate-900/30 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Getting Started
              </h3>
              <div className="space-y-3 text-slate-400 max-w-3xl mx-auto">
                <p className="flex items-center justify-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-blue-400" />
                  <span>
                    Click "Login" in the navigation above to sign in
                  </span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-blue-400" />
                  <span>
                    Default credentials: admin / 123, hr / 123, it / 123
                  </span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-blue-400" />
                  <span>
                    Contact an administrator to create your user account
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

    </div>
  );
}
