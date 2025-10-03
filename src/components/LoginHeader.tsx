import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface LoginHeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

export function LoginHeader({ 
  onBack, 
  showBackButton = true, 
  className = "" 
}: LoginHeaderProps) {
  return (
    <header className={`bg-surface border-b border-border sticky top-0 z-50 backdrop-blur-sm ${className}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Back button */}
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="이전 페이지"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">뒤로</span>
            </Button>
          )}

          {/* Logo */}
          <div className="flex items-center gap-3 mx-auto">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">인</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">인하공전</h1>
              <p className="text-xs text-muted-foreground leading-none">캠퍼스 라이프</p>
            </div>
          </div>

          {/* Spacer for alignment when back button is present */}
          {showBackButton && <div className="w-16" />}
        </div>
      </div>
    </header>
  );
}