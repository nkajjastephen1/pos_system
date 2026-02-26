import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, History, Sun, Moon, Menu, BarChart, Briefcase } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
export function AppLayout() {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigation = [{
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard
  }, {
    name: 'POS',
    href: '/pos',
    icon: ShoppingCart
  }, {
    name: 'Service Sales',
    href: '/service-sales',
    icon: Briefcase
  }, {
    name: 'Products',
    href: '/products',
    icon: Package
  }, {
    name: 'Services',
    href: '/services',
    icon: Briefcase
  }, {
    name: 'Transactions',
    href: '/transactions',
    icon: History
  }, {
    name: 'Reports',
    href: '/reports',
    icon: BarChart
  }];
  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-50">
        <div className="flex h-16 items-center justify-center border-b border-slate-200 dark:border-slate-800 px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-500">
            <ShoppingCart className="h-6 w-6" />
            <span>NexusPOS</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map(item => {
            const isActive = location.pathname === item.href;
            return <NavLink key={item.name} to={item.href} className={({
              isActive
            }) => `
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300'}
                  `}>
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300'}`} />
                  {item.name}
                </NavLink>;
          })}
          </nav>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Theme
            </span>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-500">
          <ShoppingCart className="h-6 w-6" />
          <span>NexusPOS</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 z-30 bg-white dark:bg-slate-900 pt-20 px-4">
          <nav className="space-y-2">
            {navigation.map(item => <NavLink key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className={({
          isActive
        }) => `
                  flex items-center px-4 py-3 text-base font-medium rounded-md
                  ${isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}
                `}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>)}
          </nav>
        </div>}

      {/* Main Content */}
      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>;
}