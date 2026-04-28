import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { loginSchema } from '@/types/schema';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import logo from '../../assets/logo2.png';
import heroImage from '../../attached_assets/generated_images/dhaka_skyline_hero_image.png';

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });

      // Wait a moment for user state to update, then redirect
      setTimeout(() => {
        // Redirect to dashboard after successful login
        setLocation('/dashboard');
      }, 100);
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description:
          error.message || 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#fbf8fa] px-4 py-8 sm:px-6 lg:px-10 xl:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#fbf8fa_42%,#f4edf2_100%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-[#e8cdd1]/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#401F48]/12 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl overflow-hidden rounded-[28px] border border-[#eadfe6] bg-white shadow-[0_28px_90px_rgba(48,35,53,0.16)] lg:grid-cols-[1.12fr_0.88fr]">
        <div className="relative min-h-[420px] overflow-hidden bg-[#4f3154] lg:min-h-0">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(46,32,49,0.94)_0%,rgba(117,87,122,0.72)_52%,rgba(232,205,209,0.38)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#241827]/90 via-[#332037]/42 to-transparent" />

          <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-between p-8 text-white sm:p-10 lg:min-h-full lg:p-12 xl:p-14">
            <Link href="/" className="inline-flex w-fit items-center">
              <img src={logo} alt="ZIVIO" className="h-16 w-auto object-contain" />
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-md">
                <ShieldCheck className="h-4 w-4" />
                Trusted real estate access
              </div>
              <h1 className="font-heading text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Sign in to manage your property journey.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/82 sm:text-lg">
                Access your dashboard, saved homes, messages, and listing activity in one polished workspace.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur-md">
                  <p className="font-heading text-2xl font-semibold">24/7</p>
                  <p className="mt-1 text-xs font-medium uppercase text-white/65">
                    Access
                  </p>
                </div>
                <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur-md">
                  <p className="font-heading text-2xl font-semibold">Live</p>
                  <p className="mt-1 text-xs font-medium uppercase text-white/65">
                    Updates
                  </p>
                </div>
                <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur-md">
                  <p className="font-heading text-2xl font-semibold">Pro</p>
                  <p className="mt-1 text-xs font-medium uppercase text-white/65">
                    Tools
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 md:px-12 lg:px-14 xl:px-16">
          <Card
            className="w-full max-w-[470px] border-0 bg-transparent shadow-none"
            data-testid="login-card"
          >
            <CardHeader className="px-0 pb-8 pt-0 text-center sm:text-left">
              <Link href="/" className="mx-auto mb-8 inline-flex sm:mx-0 lg:hidden">
                <img src={logo} alt="ZIVIO" className="h-16 w-auto object-contain" />
              </Link>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#eadfe6] bg-[#fbf7f9] text-[#401F48] shadow-sm sm:mx-0">
                <Lock className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading text-3xl font-semibold leading-tight text-[#2f2333] sm:text-4xl">
                Welcome Back
              </CardTitle>
              <CardDescription className="mt-3 text-base leading-7 text-[#736776]">
                Sign in with your Zivio Living account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-[#3f3343]">
                          Email address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7d8d]" />
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              className="h-12 rounded-xl border-[#ded3dc] bg-white pl-11 text-[15px] text-[#2f2333] shadow-[0_1px_2px_rgba(48,35,53,0.04)] transition-colors placeholder:text-[#a599a8] focus-visible:border-[#401F48] focus-visible:ring-4 focus-visible:ring-[#401F48]/12 focus-visible:ring-offset-0"
                              {...field}
                              data-testid="input-login-email"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-[#3f3343]">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                              <Lock className="h-4 w-4 text-[#8a7d8d]" />
                            </div>

                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              className="h-12 rounded-xl border-[#ded3dc] bg-white pl-11 pr-12 text-[15px] text-[#2f2333] shadow-[0_1px_2px_rgba(48,35,53,0.04)] transition-colors placeholder:text-[#a599a8] focus-visible:border-[#401F48] focus-visible:ring-4 focus-visible:ring-[#401F48]/12 focus-visible:ring-offset-0"
                              {...field}
                              data-testid="input-login-password"
                            />

                            <div className="absolute inset-y-0 right-2 flex items-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-[#796b7d] hover:bg-[#f4edf2] hover:text-[#2D1235]"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-semibold text-[#401F48] transition-colors hover:text-[#2D1235] hover:underline"
                      data-testid="link-forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="min-h-12 w-full rounded-xl border-[#2D1235] bg-[#401F48] text-base font-semibold text-white shadow-[0_14px_30px_rgba(117,87,122,0.25)] transition-all hover:bg-[#2D1235] hover:shadow-[0_18px_38px_rgba(117,87,122,0.30)]"
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In
                  </Button>
                </form>
              </Form>

              <div className="mt-8 rounded-2xl border border-[#eadfe6] bg-[#fbf7f9] px-5 py-4 text-center text-sm">
                <span className="text-[#736776]">
                  Don't have an account?{' '}
                </span>
                <Link
                  href="/register"
                  className="font-semibold text-[#401F48] transition-colors hover:text-[#2D1235] hover:underline"
                  data-testid="link-register"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
