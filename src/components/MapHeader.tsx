import React, { useState } from 'react';
import { Search, MapPin, Bell, Menu, RotateCcw, Map, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export type MapProvider = 'kakao' | 'osm' | 'mock';

interface MapHeaderProps {
  onSearch?: (query: string) => void;
  onGetCurrentLocation?: () => void;
  onToggleSidebar?: () => void;
  onMapProviderChange?: (provider: MapProvider) => void;
  onGoToMarketplace?: () => void;
  currentProvider?: MapProvider;
  searchQuery?: string;
  isLocationLoading?: boolean;
  hasLocationPermission?: boolean;
  notificationCount?: number;
  isMobile?: boolean;
  className?: string;
}

const mapProviderConfig = {
  kakao: {
    label: 'Kakao Map',
    description: '카카오맵 (위성/거리뷰 지원)'
  },
  osm: {
    label: 'OpenStreetMap',
    description: '오픈스트리트맵 (오픈소스)'
  },
  mock: {
    label: 'Mock Map',
    description: '모의 지도 (개발용)'
  }
};

export function MapHeader({
  onSearch,
  onGetCurrentLocation,
  onToggleSidebar,
  onMapProviderChange,
  onGoToMarketplace,
  currentProvider = 'mock',
  searchQuery = '',
  isLocationLoading = false,
  hasLocationPermission = true,
  notificationCount = 0,
  isMobile = false,
  className = ''
}: MapHeaderProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleCurrentLocation = () => {
    onGetCurrentLocation?.();
  };

  const handleMapProviderChange = (provider: MapProvider) => {
    onMapProviderChange?.(provider);
  };

  return (
    <header className={`bg-surface border-b border-border sticky top-0 z-50 backdrop-blur-sm ${className}`}>
      <div className="container mx-auto">
        <div className="flex items-center gap-4 h-16">
          {/* 사이드바 토글 (모바일) */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              aria-label="메뉴 열기"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          {/* 로고 (데스크톱) */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">길찾기</span>
            </div>
          )}

          {/* 검색창 */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={localSearchQuery}
                onChange={handleSearchChange}
                placeholder="건물/강의실/시설 검색"
                className="pl-10 pr-4"
                aria-label="장소 검색"
              />
            </div>
          </form>

          {/* 현재 위치 버튼 */}
          <Button
            variant={hasLocationPermission ? "outline" : "destructive"}
            size="sm"
            onClick={handleCurrentLocation}
            disabled={isLocationLoading}
            aria-label="현재 위치"
            title={
              hasLocationPermission 
                ? "현재 위치로 이동" 
                : "위치 권한이 필요합니다"
            }
          >
            {isLocationLoading ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            {!isMobile && (
              <span className="ml-2">
                {isLocationLoading ? '위치 확인 중' : '현재 위치'}
              </span>
            )}
          </Button>

          {/* 장터 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={onGoToMarketplace}
            aria-label="장터"
            title="인하공전 장터"
          >
            <ShoppingBag className="w-4 h-4" />
            {!isMobile && (
              <span className="ml-2">장터</span>
            )}
          </Button>

          {/* 지도 타입 토글 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Map className="w-4 h-4" />
                {!isMobile && (
                  <span className="ml-2">
                    {mapProviderConfig[currentProvider].label}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">지도 제공업체</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    사용할 지도 서비스를 선택하세요
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(mapProviderConfig).map(([key, config]) => (
                    <div 
                      key={key}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <Label htmlFor={`provider-${key}`} className="font-medium">
                          {config.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                      <Switch
                        id={`provider-${key}`}
                        checked={currentProvider === key}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMapProviderChange(key as MapProvider);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    일부 기능은 지도 제공업체에 따라 제한될 수 있습니다.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* 알림 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            aria-label={`알림 ${notificationCount > 0 ? `${notificationCount}개` : ''}`}
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}