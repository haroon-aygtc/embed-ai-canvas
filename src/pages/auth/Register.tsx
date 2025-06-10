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
  User,
  Mail,
  Lock,
  ArrowLeft,
  Zap,
  CheckCircle,
  Shield,
  Rocket,
  Building,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "fullName":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 2) {
          error = "Full name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "Full name can only contain letters and spaces";
        }
        break;
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
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = "Password must contain uppercase, lowercase, and number";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (formData.password !== value) {
          error = "Passwords do not match";
        }
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const fullNameError = validateField("fullName", formData.fullName);
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    const confirmPasswordError = validateField(
      "confirmPassword",
      formData.confirmPassword,
    );

    if (fullNameError) newErrors.fullName = fullNameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

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
      const response = await authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        company: formData.company,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.success) {
        toast({
          title: "Account Created Successfully!",
          description:
            response.message ||
            "Welcome to ChatWidget Pro. You can now sign in to your account.",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        // Redirect to login
        navigate("/auth/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

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
        setErrors((prev) => ({ ...prev, ...apiErrors }));

        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message || "Please check the form and try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
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
    // Special handling for confirm password when password changes
    if (
      field === "password" &&
      errors.confirmPassword &&
      formData.confirmPassword
    ) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword,
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 relative overflow-hidden">
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
              Join thousands of companies transforming customer engagement
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Create your account and start building AI-powered chat widgets in
              minutes.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Free 14-Day Trial</div>
                <div className="text-purple-100 text-sm">
                  No credit card required
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Enterprise Security</div>
                <div className="text-purple-100 text-sm">
                  Your data is always protected
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">5-Minute Setup</div>
                <div className="text-purple-100 text-sm">
                  Get started instantly
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Register Form */}
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ChatWidget Pro
              </span>
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold mb-2">
                Create Account
              </CardTitle>
              <CardDescription className="text-lg">
                Start your free trial today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      onBlur={(e) =>
                        handleFieldBlur("fullName", e.target.value)
                      }
                      className={cn(
                        "pl-10 h-12",
                        errors.fullName &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50 dark:bg-red-950/20",
                      )}
                      aria-describedby={
                        errors.fullName ? "fullName-error" : undefined
                      }
                      aria-invalid={!!errors.fullName}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      className="text-sm text-red-600 flex items-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
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
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company Name{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      className="pl-10 h-12"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <PasswordInput
                      id="password"
                      placeholder="Create a strong password"
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

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      onBlur={(e) =>
                        handleFieldBlur("confirmPassword", e.target.value)
                      }
                      className={cn(
                        "pl-10 h-12",
                        errors.confirmPassword &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50 dark:bg-red-950/20",
                      )}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                      aria-invalid={!!errors.confirmPassword}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p
                      id="confirmPassword-error"
                      className="text-sm text-red-600 flex items-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        if (errors.terms) {
                          setErrors((prev) => ({ ...prev, terms: "" }));
                        }
                      }}
                      className={cn(
                        "mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                        errors.terms && "border-red-500",
                      )}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{errors.terms}</span>
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Sign in
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

export default Register;
