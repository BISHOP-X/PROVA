import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Mail, Lock, User, Building, CheckCircle, ArrowRight, Award } from 'lucide-react';

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await signUp(email, password, fullName, 'admin');
      setSuccess(true);
      // Optional: Auto-redirect after a delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('[SignupPage] signup failed', err);
      setErrorMessage(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful</h2>
          <p className="text-gray-600 mb-8">
            Your institutional account has been created. Please check your email to verify your account before logging in.
          </p>
          <Link 
            to="/login" 
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
      <main className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[32px] overflow-hidden shadow-2xl min-h-[700px] border border-gray-100">
        
        {/* Left Side: Registration Form */}
        <section className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-center">
          {/* Logo & Branding */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-blue-600 tracking-tight">PROVA</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Institutional Sign Up</h1>
            <p className="text-gray-500">Create your enterprise account to manage disbursements.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="full_name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" 
                  id="full_name" 
                  placeholder="John Doe" 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="org_name">Organization Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" 
                  id="org_name" 
                  placeholder="Acme Corporation" 
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="work_email">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" 
                  id="work_email" 
                  placeholder="name@company.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="confirm_password">Confirm Password</label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm" 
                    id="confirm_password" 
                    placeholder="••••••••" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4">
              <button 
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Creating Account...' : 'Create Account'}
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an institutional account? 
            <Link className="text-blue-600 font-bold hover:underline ml-1" to="/login">Log in here</Link>
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
