import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  authApi,
  formatApiErrors,
  isNetworkError,
  getErrorMessage,
} from "@/services/auth";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Zap,
  CheckCircle,
  Shield,
  Rocket,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        toast({
          title: "Welcome back!",
          description:
            response.message || "You have been successfully logged in.",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        // Redirect to dashboard
        navigate("/dashboard/widget");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (isNetworkError(error)) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description:
            "Unable to connect to the server. Please check your internet connection and try again.",
        });
      } else if (error.errors) {
        // Handle validation errors from API
        const apiErrors = formatApiErrors(error.errors);
        setErrors(apiErrors);

        toast({
          variant: "destructive",
          title: "Login Failed",
          description:
            error.message || "Please check your credentials and try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: getErrorMessage(error),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpolygon%20points%3D%2250%200%2060%2040%20100%2050%2060%2060%2050%20100%2040%2060%200%2050%2040%2040%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold">ChatWidget Pro</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Welcome back to the future of customer engagement
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Sign in to access your AI-powered chat widgets and transform your
              customer experience.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">99.99% Uptime SLA</div>
                <div className="text-blue-100 text-sm">
                  Enterprise-grade reliability
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Bank-Grade Security</div>
                <div className="text-blue-100 text-sm">
                  SOC 2 compliant & GDPR ready
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Lightning Fast</div>
                <div className="text-blue-100 text-sm">
                  Sub-100ms response times
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Branding */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChatWidget Pro
              </span>
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold mb-2">Sign In</CardTitle>
              <CardDescription className="text-lg">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      onBlur={(e) => handleFieldBlur("email", e.target.value)}
                      className={cn(
                        "pl-10 h-12",
                        errors.email &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50 dark:bg-red-950/20",
                      )}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      aria-invalid={!!errors.email}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-sm text-red-600 flex items-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <PasswordInput
                      id="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      onBlur={(e) =>
                        handleFieldBlur("password", e.target.value)
                      }
                      className={cn(
                        "pl-10 h-12",
                        errors.password &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50 dark:bg-red-950/20",
                      )}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      aria-invalid={!!errors.password}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-sm text-red-600 flex items-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/auth/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
