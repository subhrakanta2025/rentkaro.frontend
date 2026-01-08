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
          <header className="sticky top-0 z-40 flex h-11 sm:h-12 items-center gap-2 border-b border-border bg-background/95 backdrop-blur px-2 sm:px-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
            
            {title && (
              <div className="flex-1 min-w-0">
                <h1 className="text-xs sm:text-sm font-semibold text-foreground truncate">{title}</h1>
                {description && (
                  <p className="text-[10px] text-muted-foreground truncate hidden sm:block">{description}</p>
                )}
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 p-2 sm:p-3">
            {children}
          </main>
        </div>
      </div>
      
      {/* Chat Bot Overlay */}
      <ChatBot />
    </SidebarProvider>
  );
}
