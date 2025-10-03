import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface LandingHeaderProps {
  className?: string;
}

export function LandingHeader({ className = "" }: LandingHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: '길찾기', href: '#navigation' },
    { name: '장터', href: '#marketplace' },
    { name: '공지', href: '#notices' }
  ];

  return (
    <header className={`bg-surface border-b border-border sticky top-0 z-50 backdrop-blur-sm ${className}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">인</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-foreground">인하공전</h1>
              <p className="text-xs text-muted-foreground leading-none">캠퍼스 라이프</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-3 py-2"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Login Button & Mobile Menu */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="hidden sm:inline-flex focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              로그인
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-accent transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  로그인
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}