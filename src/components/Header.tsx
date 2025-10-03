import React from 'react';
import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  isDark?: boolean;
  onThemeToggle?: () => void;
  onMenuToggle?: () => void;
  user?: {
    name: string;
    avatar?: string;
    notifications?: number;
  };
}

export function Header({ 
  isDark = false, 
  onThemeToggle, 
  onMenuToggle,
  user = { name: "학생", notifications: 3 }
}: HeaderProps) {
  const searchSuggestions = [
    "학식 메뉴",
    "시간표 조회",
    "공지사항",
    "도서관 좌석",
    "강의실 위치",
    "동아리 활동",
    "취업 정보"
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* 로고 및 모바일 메뉴 */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">인</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-primary">인하공전</h1>
                <p className="text-xs text-muted-foreground">캠퍼스 라이프</p>
              </div>
            </div>
          </div>

          {/* 검색바 - 데스크톱 */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar
              placeholder="학식, 공지사항, 시간표..."
              suggestions={searchSuggestions}
              onSearch={(query) => console.log('검색:', query)}
            />
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center gap-2">
            {/* 검색 - 모바일 */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
            >
              <Bell className="w-5 h-5" />
            </Button>

            {/* 알림 */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 hidden sm:flex"
            >
              <Bell className="w-5 h-5" />
              {user.notifications && user.notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 px-1 min-w-5 h-5 text-xs flex items-center justify-center"
                >
                  {user.notifications > 9 ? '9+' : user.notifications}
                </Badge>
              )}
            </Button>

            {/* 다크모드 토글 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="p-2"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* 사용자 프로필 */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium">
                {user.name}
              </span>
            </Button>
          </div>
        </div>

        {/* 모바일 검색바 */}
        <div className="md:hidden px-4 pb-4">
          <SearchBar
            placeholder="학식, 공지사항, 시간표..."
            suggestions={searchSuggestions}
            onSearch={(query) => console.log('검색:', query)}
          />
        </div>
      </div>
    </header>
  );
}