import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  User,
  Bike,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown,
  Building2,
  Car,
  Wallet,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import rentkaroLogo from '@/assets/rentkaro-logo.png';
import { useAgencyProfile } from '@/hooks/useAgencyProfile';

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile, user } = useAuth();
  const { data: profileData } = useAgencyProfile();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const hasAgency = profileData?.agencyStatus?.hasAgency ?? false;
  const canListVehicles = Boolean(user?.canListVehicles) || hasAgency;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Define status variables
  const agencyPaths = ['/agency/dashboard', '/agency/my-vehicles', '/agency/add-vehicle', '/agency/bookings', '/agency/earnings'];
  const isAgencyActive = agencyPaths.some((path) => location.pathname.startsWith(path));
  const isSettingsActive = location.pathname.includes('/dashboard/settings');

  // Helper for active link state
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border h-20 flex items-center justify-center p-0">
        <Link to={canListVehicles ? '/agency/dashboard' : '/dashboard'} className="flex items-center gap-2">
          <img 
            src={rentkaroLogo} 
            alt="RentKaro" 
            className={cn(
              "h-20 object-contain transition-all",
              isCollapsed ? "w-20 object-cover object-left" : "w-auto"
            )}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                  <Link to="/dashboard" className="flex items-center gap-3">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bookings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/bookings')}>
                  <Link to="/dashboard/bookings" className="flex items-center gap-3">
                    <Calendar className="h-4 w-4" />
                    <span>All bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Agency Module */}
        {canListVehicles && (
          <SidebarGroup>
            <SidebarGroupContent>
              <Collapsible defaultOpen={isAgencyActive} className="group/collapsible">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 hover:text-foreground transition-colors">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {!isCollapsed && <span>Agency</span>}
                    </span>
                    {!isCollapsed && (
                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    )}
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/agency/dashboard')}>
                          <Link to="/agency/dashboard" className="flex items-center gap-3">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Agency Profile</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/agency/my-vehicles')}>
                          <Link to="/agency/my-vehicles" className="flex items-center gap-3">
                            <Car className="h-4 w-4" />
                            <span>Listed Vehicles</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/agency/add-vehicle')}>
                          <Link to="/agency/add-vehicle" className="flex items-center gap-3">
                            <Plus className="h-4 w-4" />
                            <span>Add New Vehicle</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/agency/bookings')}>
                          <Link to="/agency/bookings" className="flex items-center gap-3">
                            <Calendar className="h-4 w-4" />
                            <span>See Bookings</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/agency/earnings')}>
                          <Link to="/agency/earnings" className="flex items-center gap-3">
                            <Wallet className="h-4 w-4" />
                            <span>Earnings</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings Section */}
        <SidebarGroup>
          <Collapsible defaultOpen={isSettingsActive} className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 hover:text-foreground transition-colors">
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {!isCollapsed && <span>Settings</span>}
                </span>
                {!isCollapsed && (
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/dashboard/settings/profile')}>
                      <Link to="/dashboard/settings/profile" className="flex items-center gap-3">
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/dashboard/settings/notifications')}>
                      <Link to="/dashboard/settings/notifications" className="flex items-center gap-3">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/help')}>
                      <Link to="/help" className="flex items-center gap-3">
                        <HelpCircle className="h-4 w-4" />
                        <span>Help & Support</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.fullName || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSignOut}
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </SidebarFooter>

    </Sidebar>
  );
}