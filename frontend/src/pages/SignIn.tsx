import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User, Lock, Mail, UserPlus, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth/useAuth";

// Define validation schema for sign-in form
const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

// Define validation schema for sign-up form
const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignIn = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");

  const { login } = useAuth();

  // Initialize forms
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Submit handlers
  const onSignInSubmit = async (values: z.infer<typeof signInSchema>) => {
    const { ok, message } = await login(values.username, values.password);

    if (ok) {
      toast.dismiss();
      toast.success("Signed in successfully!");
      navigate("/");
    } else {
      signInForm.setError("username", {
        type: "manual",
        message: "",
      });

      signInForm.setError("password", {
        type: "manual",
        message: "",
      });

      toast.error(message || "Sign In error occurred");
    }
  };

  const onSignUpSubmit = (values: z.infer<typeof signUpSchema>) => {
    // This would be replaced with actual API call
    console.log("Sign up submitted:", values);

    // Simulate API call with timeout
    toast.loading("Creating your account...");

    setTimeout(() => {
      toast.dismiss();
      toast.success("Account created successfully!");
      setActiveTab("signin");
      signInForm.setValue("username", values.username);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-12">
        <div className="space-y-6 bg-card shadow-lg rounded-lg p-8 border border-border">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-muted-foreground">
              Sign in to access your account or create a new one
            </p>
          </div>

          <Tabs
            defaultValue="signin"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In Form */}
            <TabsContent value="signin" className="space-y-6">
              <Form {...signInForm}>
                <form
                  onSubmit={signInForm.handleSubmit(onSignInSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={signInForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="username"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="link"
                      className="px-0"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info(
                          "Password reset functionality would be implemented here, with a reset password email sent to the user."
                        );
                      }}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup" className="space-y-6">
              <Form {...signUpForm}>
                <form
                  onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="John Doe"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="john.doe@example.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="johndoe"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the terms of service and privacy policy
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
