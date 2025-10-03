import React from 'react';
import { 
  Home, 
  Map, 
  Calendar, 
  MessageSquare, 
  ShoppingCart, 
  BookOpen, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  Bell,
  Star
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeItem?: string;
  onItemSelect?: (itemId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isHot?: boolean;
}

export function Sidebar({ 
  isOpen = true, 
  onClose, 
  activeItem = 'home',
  onItemSelect 
}: SidebarProps) {
  const mainNavItems: NavItem[] = [
    {
      id: 'home',
      label: '홈',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'map',
      label: '캠퍼스 맵',
      icon: <Map className="w-5 h-5" />
    },
    {
      id: 'schedule',
      label: '시간표',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: 'notices',
      label: '공지사항',
      icon: <Bell className="w-5 h-5" />,
      badge: 5
    }
  ];

  const communityNavItems: NavItem[] = [
    {
      id: 'chat',
      label: '자유게시판',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: 12,
      isHot: true
    },
    {
      id: 'market',
      label: '중고장터',
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: 3
    },
    {
      id: 'study',
      label: '스터디',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 'clubs',
      label: '동아리',
      icon: <Users className="w-5 h-5" />
    }
  ];

  const settingsNavItems: NavItem[] = [
    {
      id: 'favorites',
      label: '즐겨찾기',
      icon: <Star className="w-5 h-5" />
    },
    {
      id: 'settings',
      label: '설정',
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 'help',
      label: '도움말',
      icon: <HelpCircle className="w-5 h-5" />
    }
  ];

  const handleItemClick = (itemId: string) => {
    onItemSelect?.(itemId);
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  const NavSection = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div className="mb-6">
      <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <Button
            key={item.id}
            variant={activeItem === item.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleItemClick(item.id)}
            className="w-full justify-start h-10 px-3 text-left font-normal"
          >
            <div className="flex items-center gap-3 flex-1">
              {item.icon}
              <span className="flex-1">{item.label}</span>
              <div className="flex items-center gap-1">
                {item.isHot && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                    HOT
                  </Badge>
                )}
                {item.badge && item.badge > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
            </div>
          </Button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* 사이드바 */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">인</span>
              </div>
              <div>
                <h2 className="font-semibold text-sidebar-foreground">메뉴</h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>

          {/* 네비게이션 */}
          <ScrollArea className="flex-1 p-4">
            <NavSection title="메인" items={mainNavItems} />
            <Separator className="my-4" />
            <NavSection title="커뮤니티" items={communityNavItems} />
            <Separator className="my-4" />
            <NavSection title="기타" items={settingsNavItems} />
          </ScrollArea>

          {/* 푸터 */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                인하공업전문대학
              </p>
              <p className="text-xs text-muted-foreground">
                v1.0.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}