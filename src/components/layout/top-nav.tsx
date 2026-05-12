import { Search, Bell, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface TopNavProps {
  title?: string;
}

export function TopNav({ title }: TopNavProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff] border-b border-[#c2c6d5] shadow-[0_1px_3px_rgba(0,0,0,0.12)] flex items-center justify-between px-4 md:px-6 h-16 w-full">
      {/* Left: Brand + Search */}
      <div className="flex items-center gap-4 md:gap-8">
        <Link to="/" className="text-[20px] font-bold leading-7 text-[#0058bd] shrink-0">
          PROVA
        </Link>
        {title && (
          <span className="hidden md:block text-[14px] font-semibold text-[#424753]">{title}</span>
        )}
        {/* Search — hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424753] w-4 h-4" />
          <input 
            className="bg-[#f2f3fd] border-none rounded-lg pl-9 pr-4 py-2 text-[14px] w-72 focus:ring-2 focus:ring-[#0058bd] focus:outline-none placeholder:text-[#424753]/60" 
            placeholder="Search transactions, entities..." 
            type="text"
          />
        </div>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-[#e7e7f1] transition-colors"
        >
          <Bell className="w-5 h-5 text-[#424753]" />
        </button>

        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-[#c2c6d5]">
          {/* Name/role — hidden on small mobile */}
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-bold text-[#191b22] leading-5">Admin User</p>
            <p className="text-[12px] text-[#424753] leading-4 tracking-wide">System Overseer</p>
          </div>
          <img 
            alt="Admin User Avatar" 
            className="w-9 h-9 rounded-full object-cover bg-[#d8e2ff]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7i6GYT2aVpE4ndExpRx21qhV4Qchy8dk7BwVHi8PYk6bo-oOjZS4mCtDnfwQJriAusw1_XsdVYd6SXk5DDi8c-m8phGpkjYWdI99B34jK7IOsgS5lQisF_Qx88ABn7IHGFTudz5Mgllb43MzZcnIJYd8GEOe3WYagDw7b-BOXV22GBmPMAyUZ9m4XoyXVxdiLC7Hnl51OBjrEvLuqwxq9FgqS6Bw5GrwpeSb4iS62M1-ZGpK18nA8dsH5sAYiqAB_ih32II6ib0g"
          />
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            aria-label="Logout"
            className="ml-3 p-2 rounded-md hover:bg-[#e7e7f1] transition-colors"
          >
            <LogOut className="w-4 h-4 text-[#424753]" />
          </button>
        </div>
      </div>
    </header>
  );
}
