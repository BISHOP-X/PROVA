import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, ArrowRight, Fingerprint } from 'lucide-react';

export function LoginPage() {
  const [userType, setUserType] = useState<'admin' | 'beneficiary'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('[LoginPage] attempting login', { email, userType });
      await login(email, userType);
      console.log('[LoginPage] login succeeded, session saved');

      // if redirected here, return to original destination
      const state = (location.state as any) || {};
      const dest = state.from?.pathname;
      console.log('[LoginPage] navigation decision', { dest, userType });
      
      if (dest && dest !== '/login') {
        console.log('[LoginPage] navigating to from state', { dest });
        navigate(dest, { replace: true });
        return;
      }

      const finalDest = userType === 'admin' ? '/admin/dashboard' : '/onboarding';
      console.log('[LoginPage] navigating to finalDest', { finalDest });
      navigate(finalDest, { replace: true });
    } catch (err) {
      console.error('[LoginPage] login failed', err);
      alert('Login failed. Check console for details.');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-sans overflow-x-hidden min-h-screen flex items-center justify-center">
      <div className="flex w-full max-w-[1440px] h-screen lg:h-[921px] lg:m-8 overflow-hidden lg:rounded-xl shadow-2xl bg-white">
        {/* Left Side: Interactive Branding & Trust */}
        <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-primary-container text-on-primary-container overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-20" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB00cjGc_0NX2EdPJ19UXkP3dmOxP2tKVsQNlu8jKOtj-NCApFIRbte5Sr-ddYiTkR9jGxrOTVttRnLdmevprBoejLvv1f9teY4Rm1u8YeCx1pioaaJWBNS7fKZdNwI0JBN_Be1uQjymIC74BXEb88zWnM6NbvyF830_f8jYSOJyol-maPFPQL47qaXR2aMMXgSMQm57CZA26JCADDX6bRrLX9plPkDNH6nSy_OgRsruKmKvbEDYupViYr-eyOs18-tpgxKrX-ECls"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-primary-container/90 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <ShieldCheck className="text-4xl text-white w-10 h-10" />
              <span className="text-3xl text-white font-black tracking-tight">PROVA</span>
            </div>
            <h1 className="text-3xl text-white mb-6 leading-tight max-w-md font-bold">
              The Next Standard in Institutional Disbursements.
            </h1>
            <p className="text-white/80 text-lg max-w-sm">
              Leveraging AI-driven verification to ensure every payment reaches the right recipient with absolute certainty.
            </p>
          </div>
          <div className="relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                <ShieldCheck className="text-white mb-2 w-6 h-6" />
                <div className="text-[11px] font-bold text-white/60 mb-1 uppercase tracking-wider">COMPLIANCE</div>
                <div className="text-xl text-white font-bold">ISO 27001</div>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                <ArrowRight className="text-white mb-2 w-6 h-6" />
                <div className="text-[11px] font-bold text-white/60 mb-1 uppercase tracking-wider">LATENCY</div>
                <div className="text-xl text-white font-bold">&lt; 200ms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Portal */}
        <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 bg-white overflow-y-auto">
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <ShieldCheck className="text-primary text-3xl w-8 h-8" />
            <span className="text-2xl text-primary font-bold">PROVA</span>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl text-on-surface mb-2 font-bold">Welcome back</h2>
            <p className="text-on-surface-variant">Access your secure Prova dashboard.</p>
          </div>

          {/* Dual-Entry Toggle */}
          <div className="flex p-1 bg-surface-container rounded-lg mb-8">
            <button 
              onClick={() => setUserType('admin')}
              className={`flex-1 py-2 px-4 rounded-md text-xs transition-all font-bold ${userType === 'admin' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Institutional Admin
            </button>
            <button 
              onClick={() => setUserType('beneficiary')}
              className={`flex-1 py-2 px-4 rounded-md text-xs transition-all font-bold ${userType === 'beneficiary' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Beneficiary
            </button>
          </div>

          {/* SSO Options */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 border border-outline-variant rounded-lg py-3 hover:bg-surface-container-low transition-colors">
              <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6O6Hp2W12iJGBrteR-OHr2RL39KWcAXcIokVulPtJ7NIG_u7jZ66sSowRLp3qBK0Ty5jkOyuYM_cnlnC2ZXf8NXEbmbOsEbFnzT6LDyKF5svotJczdCD0GVM2VrfyW7afVHu9cbJlf1byokKgGVY_vtu93rlFscde53qb0xedgna4fQ-LqLc5qXJiP663LG8hIKYBw2XKwLeAyMaYClpzEDnNPk9iSib87KRdtWjnodX6pvBFvhHHfqo6x7W1cvQIcedUovLoI0Q"/>
              <span className="text-xs font-medium">Google SSO</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-outline-variant rounded-lg py-3 hover:bg-surface-container-low transition-colors">
              <Fingerprint className="text-xl w-5 h-5" />
              <span className="text-xs font-medium">Okta / SAML</span>
            </button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="flex-shrink mx-4 text-[10px] text-outline font-bold uppercase tracking-widest">OR CONTINUE WITH EMAIL</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-2" htmlFor="email">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                  id="email" 
                  placeholder={userType === 'admin' ? "admin@organization.com" : "beneficiary@email.com"}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-medium text-on-surface-variant" htmlFor="password">Password</label>
                <a className="text-xs text-primary font-bold hover:underline" href="#">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-10 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline" type="button">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <input className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary" id="remember" type="checkbox"/>
              <label className="text-sm text-on-surface-variant" htmlFor="remember">Remember device for 30 days</label>
            </div>
            <button 
              className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-lg text-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" 
              type="submit"
            >
              Sign In to PROVA
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-auto pt-12 text-center border-t border-outline-variant/30">
            <p className="text-xs text-on-surface-variant">
              Authorized use only. By logging in, you agree to our 
              <a className="text-primary hover:underline font-medium" href="#"> Terms of Service</a> and 
              <a className="text-primary hover:underline font-medium" href="#"> Privacy Policy</a>.
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-1 text-[10px] font-bold text-outline uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                SOC2 Compliant
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-outline uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-primary" />
                256-bit AES
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
