'use client';

import { useState } from 'react';
import { LayoutDashboard, BookOpen, Target, Settings, TrendingUp, Calendar, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trades', label: 'Journal de Trading', icon: BookOpen },
    { id: 'challenge', label: 'Mon Challenge', icon: Target },
    { id: 'planning', label: 'Planning', icon: Calendar },
    { id: 'statistics', label: 'Statistiques', icon: TrendingUp },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-dark-card border border-dark-border"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-primary border-r border-dark-border z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-dark-border">
          <h1 className="text-2xl font-bold text-accent">TGA</h1>
          <p className="text-sm text-text-secondary mt-1">Trading Growth Assistant V2</p>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive
                    ? 'bg-success text-white font-semibold'
                    : 'text-text-secondary hover:bg-dark-card hover:text-text-primary'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border">
          <div className="text-xs text-text-secondary">
            <p>Version 1.0.0</p>
            <p className="mt-1">Made with 💚 for traders</p>
          </div>
        </div>
      </aside>
    </>
  );
}
