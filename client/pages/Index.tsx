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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  X,
} from "lucide-react";
import AppNav from "@/components/Navigation";

export default function Index() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // Check authentication status
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const user = localStorage.getItem("currentUser");
    const lastUser = localStorage.getItem("lastAuthenticatedUser");

    setIsAuthenticated(!!auth);
    setUserRole(role || "");
    setCurrentUser(user || "");

    // Show welcome modal only on new login
    if (auth && user && user !== lastUser) {
      setShowWelcomeModal(true);
      localStorage.setItem("lastAuthenticatedUser", user);
    }

    setHasSeenWelcome(true);
  }, []);

  // Get role-specific welcome data
  const getRoleWelcomeData = () => {
    switch (userRole) {
      case "admin":
        return {
          title: "Welcome, Admin!",
          subtitle: "You have full system access",
          icon: Shield,
          color: "purple",
          gradient: "from-purple-400 via-purple-300 to-blue-300",
          bgColor: "bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100",
          message: `All systems operational. You have ${isAuthenticated ? "administrative privileges" : "standard access"}.`,
        };
      case "hr":
        return {
          title: "Welcome, HR Manager!",
          subtitle: "Ready to manage your team",
          icon: Users,
          color: "green",
          gradient: "from-green-400 via-emerald-300 to-teal-300",
          bgColor: "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100",
          message: "All employee data is synced and ready. Start managing your team today!",
        };
      case "it":
        return {
          title: "Welcome, IT Specialist!",
          subtitle: "System management ready",
          icon: Zap,
          color: "orange",
          gradient: "from-orange-400 via-amber-300 to-yellow-300",
          bgColor: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100",
          message: "All systems connected. You're ready to manage IT infrastructure.",
        };
      default:
        return {
          title: "Welcome Back!",
          subtitle: "You're logged in",
          icon: Sparkles,
          color: "blue",
          gradient: "from-blue-400 via-cyan-300 to-teal-300",
          bgColor: "bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100",
          message: "Your account is active and ready to use.",
        };
    }
  };

  const welcomeData = getRoleWelcomeData();
  const WelcomeIcon = welcomeData.icon;

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

      {/* Beautiful Welcome Modal */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className={`${welcomeData.bgColor} border-2 border-white/30 text-gray-800 shadow-2xl`}>
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          </div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-20 h-20 bg-gradient-to-br ${welcomeData.gradient} rounded-full flex items-center justify-center backdrop-blur-md animate-bounce shadow-lg`}>
                <WelcomeIcon className="w-10 h-10 text-white" />
              </div>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogTitle className="text-3xl font-bold text-gray-900 text-left">
              {welcomeData.title}
            </DialogTitle>
            <DialogDescription className="text-gray-700 text-lg text-left mt-2">
              {welcomeData.subtitle}
            </DialogDescription>
          </DialogHeader>

          <div className="relative z-10 space-y-6 my-6">
            <p className="text-gray-700 text-base leading-relaxed">
              {welcomeData.message}
            </p>

            <div className="space-y-3">
              {userRole === "admin" && (
                <>
                  <div className="flex items-center space-x-3 bg-purple-100/80 backdrop-blur-sm p-3 rounded-lg hover:bg-purple-200/80 transition-all border border-purple-200">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-gray-800">Full access to all dashboards</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-blue-100/80 backdrop-blur-sm p-3 rounded-lg hover:bg-blue-200/80 transition-all border border-blue-200">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-800">Manage users and permissions</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-indigo-100/80 backdrop-blur-sm p-3 rounded-lg hover:bg-indigo-200/80 transition-all border border-indigo-200">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm text-gray-800">View system analytics</span>
                  </div>
                </>
              )}

              {userRole === "hr" && (
                <>
                  <div className="flex items-center space-x-3 bg-emerald-100/80 backdrop-blur-sm p-3 rounded-lg hover:bg-emerald-200/80 transition-all border border-emerald-200">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-gray-800">Manage HR dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-teal-100/80 backdrop-blur-sm p-3 rounded-lg hover:bg-teal-200/80 transition-all border border-teal-200">
                    <BarChart3 className="h-5 w-5 text-teal-600" />
                    <span className="text-sm text-gray-800">View employee analytics</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-green-100/80 backdrop-blur-sm p-3 rounded-lg hover:bg-green-200/80 transition-all border border-green-200">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-800">Track attendance and leave</span>
                  </div>
                </>
              )}

              {userRole === "it" && (
                <>
                  <div className="flex items-center space-x-3 bg-amber-100/80 backdrop-blur-sm p-3 rounded-lg hover:bg-amber-200/80 transition-all border border-amber-200">
                    <Zap className="h-5 w-5 text-amber-600" />
                    <span className="text-sm text-gray-800">Manage IT systems</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-orange-100/80 backdrop-blur-sm p-3 rounded-lg hover:bg-orange-200/80 transition-all border border-orange-200">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <span className="text-sm text-gray-800">Monitor system health</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-yellow-100/80 backdrop-blur-sm p-3 rounded-lg hover:bg-yellow-200/80 transition-all border border-yellow-200">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-gray-800">Manage assets and inventory</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="relative z-10 flex gap-3 pt-4">
            <Button
              onClick={() => setShowWelcomeModal(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-lg transition-all font-medium"
            >
              Explore
            </Button>
            <Button
              onClick={() => {
                setShowWelcomeModal(false);
                userRole === "admin"
                  ? navigate("/admin")
                  : userRole === "hr"
                    ? navigate("/hr")
                    : userRole === "it"
                      ? navigate("/it-dashboard")
                      : null;
              }}
              className={`flex-1 bg-gradient-to-r ${welcomeData.gradient} text-white hover:shadow-lg font-semibold rounded-lg transition-all`}
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
