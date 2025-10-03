import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Clock, 
  ArrowUp, 
  Building, 
  Coffee, 
  Settings, 
  X,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Separator } from './ui/separator';
import { POI } from './POICard';

export type CategoryFilter = 'lecture' | 'admin' | 'convenience' | 'elevator';

interface MapSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCategoryFilter?: (categories: CategoryFilter[]) => void;
  onToggleFavorite?: (poi: POI) => void;
  onNavigateToPOI?: (poi: POI) => void;
  favoritesPOIs?: POI[];
  recentSearches?: string[];
  onClearRecentSearches?: () => void;
  onRemoveRecentSearch?: (search: string) => void;
  selectedCategories?: CategoryFilter[];
  showElevatorOnly?: boolean;
  onToggleElevatorFilter?: (enabled: boolean) => void;
  isMobile?: boolean;
  className?: string;
}

const categoryConfig = {
  lecture: {
    icon: Building,
    label: '강의동',
    color: 'text-primary',
    description: '강의실, 실습실, 연구실'
  },
  admin: {
    icon: Settings,
    label: '행정',
    color: 'text-secondary',
    description: '행정실, 학과사무실, 서비스센터'
  },
  convenience: {
    icon: Coffee,
    label: '편의시설',
    color: 'text-orange-500',
    description: '카페, 식당, 편의점, 휴게실'
  },
  elevator: {
    icon: ArrowUp,
    label: '엘리베이터',
    color: 'text-purple-500',
    description: '엘리베이터, 에스컬레이터'
  }
};

export function MapSidebar({
  isOpen = true,
  onClose,
  onCategoryFilter,
  onToggleFavorite,
  onNavigateToPOI,
  favoritesPOIs = [],
  recentSearches = [],
  onClearRecentSearches,
  onRemoveRecentSearch,
  selectedCategories = [],
  showElevatorOnly = false,
  onToggleElevatorFilter,
  isMobile = false,
  className = ''
}: MapSidebarProps) {
  const [filterOpen, setFilterOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(false);

  const handleCategoryToggle = (category: CategoryFilter, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    onCategoryFilter?.(newCategories);
  };

  const handleElevatorFilterToggle = (checked: boolean) => {
    onToggleElevatorFilter?.(checked);
  };

  if (!isOpen && isMobile) return null;

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : `w-[296px] bg-background border-r border-border flex-shrink-0`;

  return (
    <>
      {/* 모바일 오버레이 */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-label="사이드바 닫기"
        />
      )}

      <aside className={`${sidebarClasses} ${className}`}>
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-lg">길찾기</h2>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="사이드바 닫기"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* 카테고리 필터 */}
            <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
              <div className="p-4 border-b border-border">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <span>카테고리 필터</span>
                    </div>
                    {filterOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-4 mt-4">
                  {/* 카테고리 체크박스 */}
                  <div className="space-y-3">
                    {Object.entries(categoryConfig).map(([key, config]) => {
                      const CategoryIcon = config.icon;
                      const isSelected = selectedCategories.includes(key as CategoryFilter);
                      
                      return (
                        <div key={key} className="flex items-start space-x-3">
                          <Checkbox
                            id={`category-${key}`}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleCategoryToggle(key as CategoryFilter, !!checked)
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <Label
                              htmlFor={`category-${key}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <CategoryIcon className={`w-4 h-4 ${config.color}`} />
                              <span className="font-medium">{config.label}</span>
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              {config.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  {/* 접근성 필터 */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="elevator-filter"
                        checked={showElevatorOnly}
                        onCheckedChange={handleElevatorFilterToggle}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="elevator-filter"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">엘리베이터 있는 곳만</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          접근성이 우수한 장소만 표시
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* 즐겨찾기 */}
            <Collapsible open={favoritesOpen} onOpenChange={setFavoritesOpen}>
              <div className="p-4 border-b border-border">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>즐겨찾기</span>
                      {favoritesPOIs.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {favoritesPOIs.length}
                        </Badge>
                      )}
                    </div>
                    {favoritesOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4">
                  {favoritesPOIs.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        즐겨찾기한 장소가 없습니다
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {favoritesPOIs.map((poi) => {
                        const CategoryIcon = categoryConfig[poi.category].icon;
                        return (
                          <Card
                            key={poi.id}
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => onNavigateToPOI?.(poi)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <CategoryIcon 
                                  className={`w-4 h-4 ${categoryConfig[poi.category].color}`} 
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{poi.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {categoryConfig[poi.category].label}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-auto"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite?.(poi);
                                  }}
                                >
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* 최근 검색 */}
            <Collapsible open={recentOpen} onOpenChange={setRecentOpen}>
              <div className="p-4">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>최근 검색</span>
                      {recentSearches.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {recentSearches.length}
                        </Badge>
                      )}
                    </div>
                    {recentOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4">
                  {recentSearches.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        최근 검색 기록이 없습니다
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">
                          최근 검색어
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onClearRecentSearches}
                          className="text-xs h-auto p-1"
                        >
                          전체 삭제
                        </Button>
                      </div>
                      
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors"
                        >
                          <button
                            className="flex-1 text-left text-sm"
                            onClick={() => {
                              // 검색어 클릭 시 검색 실행
                              window.dispatchEvent(
                                new CustomEvent('search', { detail: search })
                              );
                            }}
                          >
                            {search}
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={() => onRemoveRecentSearch?.(search)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
      </aside>
    </>
  );
}