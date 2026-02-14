import { Link, useRouterState } from '@tanstack/react-router';
import { Heart, Image, Mail, Clock, Sparkles, BookHeart, Menu, X, Edit } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';

export default function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', label: 'Home', icon: Heart },
    { path: '/memories', label: 'Our Memories', icon: Image },
    { path: '/messages', label: 'Love Messages', icon: Mail },
    { path: '/timeline', label: 'Timeline', icon: Clock },
    { path: '/surprise', label: 'Surprise', icon: Sparkles },
    { path: '/dedication', label: 'Dedication', icon: BookHeart }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Heart className="w-6 h-6 text-primary fill-primary group-hover:animate-heartbeat" />
            <span className="font-script text-2xl text-primary hidden sm:inline">For My Love</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-romantic'
                      : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/edit"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ml-2 border-2 ${
                currentPath === '/edit'
                  ? 'bg-primary text-primary-foreground border-primary shadow-romantic'
                  : 'text-primary border-primary/30 hover:bg-primary/10'
              }`}
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </Link>
          </div>

          {/* Login Button (Desktop) */}
          <div className="hidden lg:block">
            <LoginButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-romantic'
                      : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/edit"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-2 ${
                currentPath === '/edit'
                  ? 'bg-primary text-primary-foreground border-primary shadow-romantic'
                  : 'text-primary border-primary/30 hover:bg-primary/10'
              }`}
            >
              <Edit className="w-5 h-5" />
              <span className="font-medium">Edit</span>
            </Link>
            <div className="pt-2">
              <LoginButton />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
