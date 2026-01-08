import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LogIn, LogOut, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_LOGO_PATH } from '@/lib/logo';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Agencies', href: '/agencies' },
  { name: 'How It Works', href: '/how-it-works' },
];

function LogoWithSkeleton() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative h-8 md:h-9 flex items-center">
      {!isLoaded && (
        <div className="skeleton-logo absolute h-5 w-20 rounded-md bg-muted/30" />
      )}
      <img
        src={APP_LOGO_PATH}
        alt="RentKaro"
        className={cn(
          "h-5 md:h-5 w-auto object-contain hover-bounce transition-all duration-200",
          isLoaded ? "opacity-100" : "opacity-0"
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
      <nav className="container flex h-14 items-center justify-between">
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
              <Link to="/favorites">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}><LogOut className="h-4 w-4" />Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button size="sm" className="gap-2"><LogIn className="h-4 w-4" />Sign In</Button></Link>
              {/* <Link to="/register"><Button size="sm">Sign Up</Button></Link> */}
            </>
          )}
        </div>

        <button type="button" className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden animate-slide-down">
          <div className="container space-y-1 py-3">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className={cn('block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', location.pathname === item.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted')} onClick={() => setMobileMenuOpen(false)}>{item.name}</Link>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              {user ? (
                <>
                  <Link to="/favorites" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full gap-2">
                      <Heart className="h-4 w-4" />
                      Favorites
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full gap-2" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}><LogOut className="h-4 w-4" />Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button size="sm" className="w-full gap-2"><LogIn className="h-4 w-4" />Login</Button></Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}><Button size="sm" className="w-full">Sign Up</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
