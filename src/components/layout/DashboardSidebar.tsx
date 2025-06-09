
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Bot, Code, Database, Zap, BarChart3, TestTube, Monitor, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Widget Configuration',
    icon: Settings,
    href: '/dashboard/widget',
    description: 'Customize widget appearance and behavior',
    badge: 'New'
  },
  {
    title: 'AI Providers',
    icon: Bot,
    href: '/dashboard/providers',
    description: 'Manage AI provider configurations'
  },
  {
    title: 'Model Management',
    icon: Database,
    href: '/dashboard/models',
    description: 'Configure and test AI models'
  },
  {
    title: 'Embed Code',
    icon: Code,
    href: '/dashboard/embed',
    description: 'Generate and test embed code'
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    description: 'View usage statistics'
  }
];

export const DashboardSidebar = () => {
  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">
      {/* Header with enhanced branding */}
      <div className="p-6 border-b border-sidebar-border bg-gradient-to-r from-sidebar-primary/5 to-sidebar-accent/5">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-sidebar-background"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-sidebar-primary to-sidebar-accent bg-clip-text text-transparent">
              ChatWidget Pro
            </h1>
            <p className="text-xs text-sidebar-foreground/70 font-medium">Enterprise Platform</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-start space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "relative p-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-sidebar-accent group-hover:bg-sidebar-primary/10"
                  )}>
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm">{item.title}</div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-sidebar-primary/20 text-sidebar-primary rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs opacity-70 leading-tight mt-0.5">{item.description}</div>
                  </div>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Enhanced status section */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="bg-sidebar-background/50 rounded-lg p-3 border border-sidebar-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-sidebar-foreground">System Status</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
            </div>
          </div>
          <div className="text-xs text-sidebar-foreground/70">
            <div className="flex justify-between">
              <span>AI Providers</span>
              <span className="font-medium">4 connected</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Widgets Active</span>
              <span className="font-medium">12 running</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
