import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { ChatBot } from '@/components/ChatBot';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-40 flex h-14 sm:h-16 items-center gap-2 sm:gap-3 border-b border-border bg-background/95 backdrop-blur px-3 sm:px-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            
            {title && (
              <div className="flex-1 min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">{title}</h1>
                {description && (
                  <p className="text-xs text-muted-foreground truncate">{description}</p>
                )}
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4">
            {children}
          </main>
        </div>
      </div>
      
      {/* Chat Bot Overlay */}
      <ChatBot />
    </SidebarProvider>
  );
}
