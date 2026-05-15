import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Fingerprint, CheckCircle, Award } from 'lucide-react';

export function LoginPage() {
  const [userType, setUserType] = useState<'admin' | 'beneficiary'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    try {
      const signedInUser = await login(email, password);

      const state = (location.state as { from?: { pathname?: string } } | null) || {};
      const dest = state.from?.pathname;
      
      if (dest && dest !== '/login') {
        navigate(dest, { replace: true });
        return;
      }

      const finalDest = signedInUser.role === 'admin' ? '/admin/dashboard' : '/onboarding';
      navigate(finalDest, { replace: true });
    } catch (err) {
      console.error('[LoginPage] login failed', err);
      setErrorMessage(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
      <main className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[32px] overflow-hidden shadow-2xl min-h-[700px] border border-gray-100">
        
        {/* Left Side: Login Form Section */}
        <section className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-center">
          {/* Logo & Branding */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-blue-600 tracking-tight">PROVA</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome Back</h1>
            <p className="text-gray-500">Institutional-grade verification for secure disbursements.</p>
          </div>

          {/* Role Selector Toggle */}
          <div className="bg-gray-100 p-1 rounded-full flex mb-8 max-w-sm">
            <button 
              onClick={() => setUserType('admin')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${userType === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Institutional Admin
            </button>
            <button 
              onClick={() => setUserType('beneficiary')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${userType === 'beneficiary' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Beneficiary
            </button>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="email">
                {userType === 'admin' ? "Admin Email" : "Beneficiary Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" 
                  id="email" 
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Form Options */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" type="checkbox"/>
                <span>Remember me</span>
              </label>
              <a className="text-blue-600 font-semibold hover:underline" href="#">Forgot Password?</a>
            </div>

            {/* Login Button */}
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
              {!submitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* SSO Options */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase text-gray-400 font-semibold">
                <span className="bg-white px-2">Enterprise SSO</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <img alt="Google" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6O6Hp2W12iJGBrteR-OHr2RL39KWcAXcIokVulPtJ7NIG_u7jZ66sSowRLp3qBK0Ty5jkOyuYM_cnlnC2ZXf8NXEbmbOsEbFnzT6LDyKF5svotJczdCD0GVM2VrfyW7afVHu9cbJlf1byokKgGVY_vtu93rlFscde53qb0xedgna4fQ-LqLc5qXJiP663LG8hIKYBw2XKwLeAyMaYClpzEDnNPk9iSib87KRdtWjnodX6pvBFvhHHfqo6x7W1cvQIcedUovLoI0Q"/>
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <Fingerprint className="w-4 h-4 text-gray-600" />
                <span>Okta / SAML</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Don't have an account? <Link className="text-blue-600 font-bold hover:underline ml-1" to="/signup">Sign up here</Link>
          </p>
        </section>

        {/* Right Side: Visual & Trust Indicators */}
        <section className="hidden md:flex flex-1 relative overflow-hidden flex-col justify-between p-12 text-white bg-[#001a41]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <img 
              alt="Digital Abstract" 
              className="w-full h-full object-cover mix-blend-overlay" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA522tqGsLsgCPNm0l8u-IaU3ZjZnIrEpk0ydzhTzoWvEmUYC54NFtlnqsJbNGqSSrjQTZw4UaE8eFWUcwJskw1mrwficT1frwizjkRKnL6UCMmDybczt66EoOWYuT0KsrMlm6U4FLkPhmk1YTiVECs7GswF9ml6A_0e_58B7cZ5ixpMAo5fcIwc9tie9SZScn9ihBKdR1Qc6BmFJZWTAEI5yt59ja2xL5mV8MrqS8VYrmsXsLQFVWA0naXBfVDoBRnvh6sWeHFgEg"
            />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-400" />
              <span className="text-xs font-medium">Trusted by 500+ Institutions</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 leading-tight">Secure Financial Infrastructure for Global Operations.</h2>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">Automated Disbursements</p>
                  <p className="text-sm opacity-80">Streamline payroll and vendor payments at scale.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">Real-time Verification</p>
                  <p className="text-sm opacity-80">KYC/KYB integrated directly into your workflow.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Trust Indicators Footer */}
          <div className="relative z-10">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-white/10">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Security Protocol</p>
                  <p className="text-sm font-bold text-white">256-bit AES Encryption</p>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-white/10 hidden lg:block"></div>
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Compliance</p>
                  <p className="text-sm font-bold text-white">ISO 27001 Certified</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-xs opacity-60">© 2025 PROVA Financial Systems. All rights reserved.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
