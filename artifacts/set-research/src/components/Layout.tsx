import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  BarChart3, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const navClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      location === path
        ? 'bg-primary text-primary-foreground font-medium'
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    }`;

  const NavLinks = () => (
    <>
      <Link href="/dashboard" className={navClass('/dashboard')}>
        <BarChart3 className="h-4 w-4" />
        Dashboard
      </Link>
      <Link href="/admin" className={navClass('/admin')}>
        <Settings className="h-4 w-4" />
        Admin
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground">SET Research</h1>
          <p className="text-xs text-sidebar-foreground/60 font-mono mt-1">v1.0.0</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-4">
          <div className="px-3">
            <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-2">User</p>
            <p className="text-sm truncate text-sidebar-foreground font-mono" title={user?.email || ''}>
              {user?.email}
            </p>
          </div>
          
          <div className="flex items-center justify-between px-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only lg:not-sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <h1 className="font-bold text-lg">SET Research</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0 flex flex-col border-r-sidebar-border">
              <div className="p-6 border-b border-sidebar-border">
                <h1 className="text-xl font-bold text-sidebar-foreground">SET Research</h1>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                <NavLinks />
              </nav>
              <div className="p-4 border-t border-sidebar-border space-y-4">
                <div className="px-3">
                  <p className="text-sm truncate text-sidebar-foreground font-mono">{user?.email}</p>
                </div>
                <div className="flex justify-between px-3">
                  <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
