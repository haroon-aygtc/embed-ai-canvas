
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Bot, Code, Database, Zap, BarChart3, TestTube, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Widget Configuration',
    icon: Settings,
    href: '/dashboard/widget',
    description: 'Customize widget appearance and behavior'
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
    <div className="w-64 bg-card border-r border-border flex flex-col min-h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">ChatWidget Pro</h1>
            <p className="text-xs text-muted-foreground">Enterprise Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-start space-x-3 px-3 py-3 rounded-lg transition-colors group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs opacity-70 leading-tight">{item.description}</div>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center justify-between mb-1">
            <span>Status</span>
            <span className="text-green-500">●</span>
          </div>
          <div>4 providers connected</div>
        </div>
      </div>
    </div>
  );
};
