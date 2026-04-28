import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { registerSchema, userRoles } from '@/types/schema';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import logo from '../../assets/logo2.png';
import heroImage from '../../attached_assets/generated_images/modern_family_house_exterior.png';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'buyer',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone,
        role: data.role,
      });
      toast({
        title: 'Account Created!',
        description: 'Welcome to Zivio Living. Your account is ready.',
      });

      // Redirect based on user role
      const roleRoutes: Record<string, string> = {
        buyer: '/dashboard/buyer',
        seller: '/dashboard/seller',
        broker: '/dashboard/broker',
        admin: '/admin',
      };

      const redirectPath = roleRoutes[data.role] || '/dashboard';
      setLocation(redirectPath);
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description:
          error.message || 'Failed to create account. Please try again.',
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

      <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl overflow-hidden rounded-[28px] border border-[#eadfe6] bg-white shadow-[0_28px_90px_rgba(48,35,53,0.16)] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[420px] overflow-hidden bg-[#4f3154] lg:min-h-0">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(46,32,49,0.94)_0%,rgba(117,87,122,0.74)_52%,rgba(232,205,209,0.36)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#241827]/90 via-[#332037]/42 to-transparent" />

          <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-between p-8 text-white sm:p-10 lg:min-h-full lg:p-12 xl:p-14">
            <Link href="/" className="inline-flex w-fit items-center">
              <img
                src={logo}
                alt="ZIVIO"
                className="h-16 w-auto object-contain"
              />
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-md">
                <ShieldCheck className="h-4 w-4" />
                Start with verified access
              </div>
              <h1 className="font-heading text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Create your Zivio Living account.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/82 sm:text-lg">
                Join a refined property workspace built for buyers, sellers, and
                brokers across every step of the journey.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur-md">
                  <p className="font-heading text-2xl font-semibold">Buy</p>
                  <p className="mt-1 text-xs font-medium uppercase text-white/65">
                    Search
                  </p>
                </div>
                <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur-md">
                  <p className="font-heading text-2xl font-semibold">Sell</p>
                  <p className="mt-1 text-xs font-medium uppercase text-white/65">
                    List
                  </p>
                </div>
                <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur-md">
                  <p className="font-heading text-2xl font-semibold">Pro</p>
                  <p className="mt-1 text-xs font-medium uppercase text-white/65">
                    Broker
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 md:px-12 lg:px-12 xl:px-16">
          <Card
            className="w-full max-w-[640px] border-0 bg-transparent shadow-none"
            data-testid="register-card"
          >
            <CardHeader className="px-0 pb-8 pt-0 text-center sm:text-left">
              <Link
                href="/"
                className="mx-auto mb-8 inline-flex sm:mx-0 lg:hidden"
              >
                <img
                  src={logo}
                  alt="ZIVIO"
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#eadfe6] bg-[#fbf7f9] text-[#401F48] shadow-sm sm:mx-0">
                <User className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading text-3xl font-semibold leading-tight text-[#2f2333] sm:text-4xl">
                Create Account
              </CardTitle>
              <CardDescription className="mt-3 text-base leading-7 text-[#736776]">
                Join Zivio Living to buy, sell, or list properties.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-[#3f3343]">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7d8d]" />
                            <Input
                              placeholder="Your full name"
                              className="h-12 rounded-xl border-[#ded3dc] bg-white pl-11 text-[15px] text-[#2f2333] shadow-[0_1px_2px_rgba(48,35,53,0.04)] transition-colors placeholder:text-[#a599a8] focus-visible:border-[#401F48] focus-visible:ring-4 focus-visible:ring-[#401F48]/12 focus-visible:ring-offset-0"
                              {...field}
                              data-testid="input-register-name"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-[#3f3343]">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7d8d]" />
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              className="h-12 rounded-xl border-[#ded3dc] bg-white pl-11 text-[15px] text-[#2f2333] shadow-[0_1px_2px_rgba(48,35,53,0.04)] transition-colors placeholder:text-[#a599a8] focus-visible:border-[#401F48] focus-visible:ring-4 focus-visible:ring-[#401F48]/12 focus-visible:ring-offset-0"
                              {...field}
                              data-testid="input-register-email"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-[#3f3343]">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7d8d]" />
                            <Input
                              type="tel"
                              placeholder="+880 1XXX-XXXXXX"
                              className="h-12 rounded-xl border-[#ded3dc] bg-white pl-11 text-[15px] text-[#2f2333] shadow-[0_1px_2px_rgba(48,35,53,0.04)] transition-colors placeholder:text-[#a599a8] focus-visible:border-[#401F48] focus-visible:ring-4 focus-visible:ring-[#401F48]/12 focus-visible:ring-offset-0"
                              {...field}
                              data-testid="input-register-phone"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-[#3f3343]">
                          I want to
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="h-12 rounded-xl border-[#ded3dc] bg-white text-[15px] text-[#2f2333] shadow-[0_1px_2px_rgba(48,35,53,0.04)] focus:ring-4 focus:ring-[#401F48]/12"
                              data-testid="select-register-role"
                            >
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-[#eadfe6]">
                            <SelectItem value="buyer">
                              Buy or Rent Property
                            </SelectItem>
                            <SelectItem value="seller">
                              Sell or Rent Out Property
                            </SelectItem>
                            <SelectItem value="broker">
                              Register as Agent/Broker
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                              placeholder="Create a password"
                              className="h-12 rounded-xl border-[#ded3dc] bg-white pl-11 pr-12 text-[15px] text-[#2f2333] shadow-[0_1px_2px_rgba(48,35,53,0.04)] transition-colors placeholder:text-[#a599a8] focus-visible:border-[#401F48] focus-visible:ring-4 focus-visible:ring-[#401F48]/12 focus-visible:ring-offset-0"
                              {...field}
                              data-testid="input-register-password"
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-[#3f3343]">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                              <Lock className="h-4 w-4 text-[#8a7d8d]" />
                            </div>

                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              className="h-12 rounded-xl border-[#ded3dc] bg-white pl-11 pr-12 text-[15px] text-[#2f2333] shadow-[0_1px_2px_rgba(48,35,53,0.04)] transition-colors placeholder:text-[#a599a8] focus-visible:border-[#401F48] focus-visible:ring-4 focus-visible:ring-[#401F48]/12 focus-visible:ring-offset-0"
                              {...field}
                              data-testid="input-register-confirm-password"
                            />

                            <div className="absolute inset-y-0 right-2 flex items-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-[#796b7d] hover:bg-[#f4edf2] hover:text-[#2D1235]"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
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
                  <Button
                    type="submit"
                    className="min-h-12 w-full rounded-xl border-[#2D1235] bg-[#401F48] text-base font-semibold text-white shadow-[0_14px_30px_rgba(117,87,122,0.25)] transition-all hover:bg-[#2D1235] hover:shadow-[0_18px_38px_rgba(117,87,122,0.30)] sm:col-span-2"
                    disabled={isLoading}
                    data-testid="button-register"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Account
                  </Button>
                </form>
              </Form>

              <div className="mt-5 rounded-2xl border border-[#eadfe6] bg-[#fbf7f9] px-5 py-4 text-center text-xs leading-5 text-[#736776]">
                By creating an account, you agree to our{' '}
                <Link
                  href="/terms"
                  className="font-semibold text-[#401F48] transition-colors hover:text-[#2D1235] hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#401F48] transition-colors hover:text-[#2D1235] hover:underline"
                >
                  Privacy Policy
                </Link>
              </div>

              <div className="mt-6 text-center text-sm">
                <span className="text-[#736776]">
                  Already have an account?{' '}
                </span>
                <Link
                  href="/login"
                  className="font-semibold text-[#401F48] transition-colors hover:text-[#2D1235] hover:underline"
                  data-testid="link-login"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
