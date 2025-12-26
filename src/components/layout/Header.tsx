import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Bike, LogIn, LogOut, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import rentkaroLogo from '@/assets/rentkaro-logo.png';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Agencies', href: '/agencies' },
  { name: 'How It Works', href: '/how-it-works' },
];

function LogoWithSkeleton() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative h-16 flex items-center">
      {!isLoaded && (
        <div className="skeleton-logo h-10 w-40 absolute" />
      )}
      <img 
        src={rentkaroLogo} 
        alt="RentKaro" 
        className={cn(
          "h-10 md:h-12 object-contain hover-bounce",
          isLoaded ? "animate-fade-in" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const dashboardLink = userRole === 'agency' ? '/agency/dashboard' : '/dashboard';
  const isOnSetupPage = location.pathname === '/agency/setup';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to={isOnSetupPage ? '#' : "/"} onClick={(e) => isOnSetupPage && e.preventDefault()} className="flex items-center gap-2">
          <LogoWithSkeleton />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} className={cn('px-4 py-2 text-sm font-medium transition-colors rounded-lg', location.pathname === item.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>{item.name}</Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}><LogOut className="h-4 w-4" />Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button size="sm" className="gap-2"><LogIn className="h-4 w-4" />Sign In</Button></Link>
              {/* <Link to="/register"><Button size="sm">Sign Up</Button></Link> */}
            </>
          )}
        </div>

        <button type="button" className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden animate-slide-down">
          <div className="container space-y-1 py-4">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className={cn('block rounded-lg px-4 py-3 text-sm font-medium transition-colors', location.pathname === item.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted')} onClick={() => setMobileMenuOpen(false)}>{item.name}</Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <>
                  <Button variant="ghost" className="w-full gap-2" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}><LogOut className="h-4 w-4" />Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button className="w-full gap-2"><LogIn className="h-4 w-4" />Login</Button></Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}><Button className="w-full">Sign Up</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
