
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Bot, Code, Database, Zap, BarChart3 } from 'lucide-react';
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
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">ChatWidget Pro</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
