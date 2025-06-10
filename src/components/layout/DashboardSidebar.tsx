import React from 'react';
import { NavLink } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Settings3DIcon, Bot3DIcon, Database3DIcon, Code3DIcon, Analytics3DIcon, Image3DIcon, Knowledge3DIcon } from '@/components/ui/Icon3D';

const navigationItems = [
  {
    title: 'Widget Configuration',
    icon: Settings3DIcon,
    href: '/dashboard/widget',
    description: 'Customize widget appearance and behavior',
    badge: 'New'
  },
  {
    title: 'Knowledge Base',
    icon: Knowledge3DIcon,
    href: '/dashboard/knowledge',
    description: 'Manage knowledge sources and content'
  },
  {
    title: 'AI Providers',
    icon: Bot3DIcon,
    href: '/dashboard/providers',
    description: 'Manage AI provider configurations'
  },
  {
    title: 'Model Management',
    icon: Database3DIcon,
    href: '/dashboard/models',
    description: 'Configure and test AI models'
  },
  {
    title: 'Embed Code',
    icon: Code3DIcon,
    href: '/dashboard/embed',
    description: 'Generate and test embed code'
  },
  {
    title: 'Analytics',
    icon: Analytics3DIcon,
    href: '/dashboard/analytics',
    description: 'View usage statistics'
  },
  {
    title: 'Media Gallery',
    icon: Image3DIcon,
    href: '/dashboard/media',
    description: 'Manage images and media files',
    badge: 'Beta'
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
                    ? "bg-sidebar-primary/90 text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "relative p-2 rounded-lg transition-all duration-200 transform hover:scale-105",
                    isActive
                      ? "bg-sidebar-primary shadow-lg border border-white/20"
                      : "bg-sidebar-accent group-hover:bg-sidebar-primary/15 group-hover:shadow-md"
                  )}>
                    <item.icon className="h-6 w-6 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
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
