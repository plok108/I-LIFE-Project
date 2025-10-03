import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Grid3X3, List, ChevronDown, ArrowUpDown, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { MarketplaceItem, MarketplaceItemCard } from './MarketplaceItem';

interface MarketplacePageProps {
  onBack: () => void;
  onItemClick?: (item: MarketplaceItem) => void;
  onToggleFavorite?: (item: MarketplaceItem) => void;
  onChatClick?: (item: MarketplaceItem) => void;
  onCreateItem?: () => void;
  className?: string;
}

interface MarketplaceFilters {
  categories: string[];
  priceRange: [number, number];
  departments: string[];
  subjects: string[];
  conditions: string[];
  dealTypes: string[];
  status: string[];
}

type SortOption = 'latest' | 'price-low' | 'price-high' | 'popular' | 'nearby';

const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: '1',
    title: '컴퓨터프로그래밍 기초 교재 (거의 새것)',
    price: 25000,
    condition: 'excellent',
    category: 'textbook',
    department: '컴퓨터정보과',
    subject: '컴퓨터프로그래밍',
    description: '한 학기 사용한 교재입니다. 필기 거의 없고 상태 매우 좋습니다.',
    images: ['https://images.unsplash.com/photo-1580121441575-41bcb5c6b47c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwdGV4dGJvb2t8ZW58MXx8fHwxNzU4Nzc5MDc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    seller: {
      id: 'seller1',
      name: '김학생',
      department: '컴퓨터정보과',
      rating: 4.8,
      isVerified: true
    },
    location: '1호관',
    distance: 50,
    createdAt: '2024-03-15T10:30:00Z',
    views: 45,
    likes: 12,
    chatCount: 3,
    status: 'available',
    dealType: 'both',
    tags: ['프로그래밍', '교재', '컴정과'],
    isFavorite: false
  },
  {
    id: '2',
    title: '아이패드 프로 11인치 (2021) 256GB',
    price: 780000,
    condition: 'good',
    category: 'electronics',
    description: '수업용으로 사용했던 아이패드입니다. 애플펜슬 포함',
    images: ['https://images.unsplash.com/photo-1628866971124-5d506bf12915?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGFkJTIwcHJvJTIwdGFibGV0fGVufDF8fHx8MTc1ODc3OTA5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    seller: {
      id: 'seller2',
      name: '박학생',
      department: '디자인과',
      rating: 4.5,
      isVerified: true
    },
    location: '2호관',
    distance: 120,
    createdAt: '2024-03-14T15:20:00Z',
    views: 89,
    likes: 23,
    chatCount: 8,
    status: 'available',
    dealType: 'direct',
    tags: ['아이패드', '애플펜슬', '태블릿'],
    isFavorite: true
  },
  {
    id: '3',
    title: '기계제도 실습 도구 세트',
    price: 45000,
    condition: 'good',
    category: 'supplies',
    department: '기계과',
    subject: '기계제도',
    description: '제도 실습용 도구 일체입니다. 컴퍼스, 삼각자, 곡선자 등 포함',
    images: ['https://images.unsplash.com/photo-1725916631418-7c000895345f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwZHJhd2luZyUyMHRvb2xzfGVufDF8fHx8MTc1ODc3OTA5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    seller: {
      id: 'seller3',
      name: '이학생',
      department: '기계과',
      rating: 4.2,
      isVerified: false
    },
    location: '3호관',
    distance: 200,
    createdAt: '2024-03-13T09:15:00Z',
    views: 34,
    likes: 8,
    chatCount: 2,
    status: 'reserved',
    dealType: 'direct',
    tags: ['제도', '실습', '기계과'],
    isFavorite: false
  },
  {
    id: '4',
    title: '노트북 삼성 갤럭시북 프로',
    price: 850000,
    condition: 'excellent',
    category: 'electronics',
    description: '작년에 구입한 삼성 갤럭시북 프로입니다. 사용 빈도가 낮아 판매합니다.',
    images: ['https://images.unsplash.com/photo-1661595676903-ef93e28bb121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwbGFwdG9wJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzU4Nzc5MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    seller: {
      id: 'seller4',
      name: '최학생',
      department: '경영과',
      rating: 4.9,
      isVerified: true
    },
    location: '도서관',
    distance: 80,
    createdAt: '2024-03-12T14:45:00Z',
    views: 67,
    likes: 19,
    chatCount: 5,
    status: 'available',
    dealType: 'both',
    tags: ['노트북', '삼성', '갤럭시북'],
    isFavorite: false
  },
  {
    id: '5',
    title: '회계원리 교재와 문제집 세트',
    price: 35000,
    condition: 'good',
    category: 'textbook',
    department: '경영과',
    subject: '회계원리',
    description: '회계원리 수업에 사용한 교재와 문제집입니다. 답안지 포함',
    images: ['https://images.unsplash.com/photo-1636819483716-854492c76683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2NvdW50aW5nJTIwdGV4dGJvb2t8ZW58MXx8fHwxNzU4Nzc5MTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    seller: {
      id: 'seller5',
      name: '정학생',
      department: '경영과',
      rating: 4.3,
      isVerified: true
    },
    location: '학생식당',
    distance: 150,
    createdAt: '2024-03-11T11:30:00Z',
    views: 28,
    likes: 6,
    chatCount: 1,
    status: 'sold',
    dealType: 'direct',
    tags: ['회계', '교재', '경영과'],
    isFavorite: false
  },
  {
    id: '6',
    title: '캠퍼스 자켓 (M 사이즈)',
    price: 18000,
    condition: 'fair',
    category: 'clothing',
    description: '인하공전 로고가 있는 캠퍼스 자켓입니다. M 사이즈',
    images: ['https://images.unsplash.com/photo-1533656812321-1868a4d2b72a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwamFja2V0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU4Nzc5MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    seller: {
      id: 'seller6',
      name: '강학생',
      department: '전기과',
      rating: 4.0,
      isVerified: false
    },
    location: '편의점',
    distance: 300,
    createdAt: '2024-03-10T16:20:00Z',
    views: 15,
    likes: 3,
    chatCount: 0,
    status: 'available',
    dealType: 'direct',
    tags: ['자켓', '의류', 'M사이즈'],
    isFavorite: false
  }
];

const CATEGORIES = [
  { value: 'textbook', label: '교재/도서', emoji: '📚' },
  { value: 'electronics', label: '전자기기', emoji: '💻' },
  { value: 'clothing', label: '의류', emoji: '👕' },
  { value: 'supplies', label: '학용품', emoji: '✏️' },
  { value: 'etc', label: '기타', emoji: '📦' }
];

const DEPARTMENTS = [
  '컴퓨터정보과', '기계과', '전기과', '전자과', '건축과', '디자인과', '경영과', '항공과'
];

const CONDITIONS = [
  { value: 'excellent', label: '상 (거의 새것)' },
  { value: 'good', label: '중 (사용감 있음)' },
  { value: 'fair', label: '하 (많이 사용됨)' }
];

const DEAL_TYPES = [
  { value: 'direct', label: '직거래' },
  { value: 'delivery', label: '택배거래' },
  { value: 'both', label: '직거래/택배' }
];

const STATUS_OPTIONS = [
  { value: 'available', label: '판매중' },
  { value: 'reserved', label: '예약중' },
  { value: 'sold', label: '판매완료' }
];

export function MarketplacePage({ onBack, onItemClick, onToggleFavorite, onChatClick, onCreateItem, className }: MarketplacePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [filters, setFilters] = useState<MarketplaceFilters>({
    categories: [],
    priceRange: [0, 1000000],
    departments: [],
    subjects: [],
    conditions: [],
    dealTypes: [],
    status: ['available']
  });

  // 반응형 체크
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 필터링된 아이템 계산
  const filteredItems = MOCK_MARKETPLACE_ITEMS.filter(item => {
    // 검색 쿼리 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesDescription = item.description.toLowerCase().includes(query);
      const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(query));
      const matchesDepartment = item.department?.toLowerCase().includes(query);
      const matchesSubject = item.subject?.toLowerCase().includes(query);
      
      if (!matchesTitle && !matchesDescription && !matchesTags && !matchesDepartment && !matchesSubject) {
        return false;
      }
    }

    // 카테고리 필터
    if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
      return false;
    }

    // 가격 범위 필터
    if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) {
      return false;
    }

    // 학과 필터
    if (filters.departments.length > 0 && item.department && !filters.departments.includes(item.department)) {
      return false;
    }

    // 상태 필터
    if (filters.conditions.length > 0 && !filters.conditions.includes(item.condition)) {
      return false;
    }

    // 거래 방식 필터
    if (filters.dealTypes.length > 0 && !filters.dealTypes.includes(item.dealType)) {
      return false;
    }

    // 판매 상태 필터
    if (filters.status.length > 0 && !filters.status.includes(item.status)) {
      return false;
    }

    return true;
  });

  // 정렬된 아이템 계산
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return (b.views + b.likes) - (a.views + a.likes);
      case 'nearby':
        return (a.distance || 0) - (b.distance || 0);
      default:
        return 0;
    }
  });

  const handleFilterChange = (key: keyof MarketplaceFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleFilter = (key: keyof MarketplaceFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000000],
      departments: [],
      subjects: [],
      conditions: [],
      dealTypes: [],
      status: ['available']
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) count++;
    if (filters.departments.length > 0) count++;
    if (filters.conditions.length > 0) count++;
    if (filters.dealTypes.length > 0) count++;
    if (filters.status.length !== 1 || !filters.status.includes('available')) count++;
    return count;
  };

  const handleItemClick = (item: MarketplaceItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      console.log('아이템 클릭:', item.title);
    }
  };

  const handleToggleFavorite = (item: MarketplaceItem) => {
    if (onToggleFavorite) {
      onToggleFavorite(item);
    } else {
      console.log('즐겨찾기 토글:', item.title);
    }
  };

  const handleChatClick = (item: MarketplaceItem) => {
    if (onChatClick) {
      onChatClick(item);
    } else {
      console.log('채팅 시작:', item.title);
    }
  };

  // 로딩 스켈레톤
  const LoadingSkeleton = () => (
    <div className={`grid gap-4 ${
      isMobile 
        ? 'grid-cols-2' 
        : 'grid-cols-3 xl:grid-cols-4'
    }`}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-0">
            <Skeleton className="aspect-square w-full rounded-t-lg" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // 필터 패널 컨텐츠
  const FilterContent = () => (
    <div className="space-y-6">
      {/* 카테고리 */}
      <div>
        <h4 className="font-medium mb-3">카테고리</h4>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.value}`}
                checked={filters.categories.includes(category.value)}
                onCheckedChange={() => handleToggleFilter('categories', category.value)}
              />
              <Label htmlFor={`category-${category.value}`} className="flex items-center gap-2">
                <span>{category.emoji}</span>
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 가격 범위 */}
      <div>
        <h4 className="font-medium mb-3">가격 범위</h4>
        <div className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value)}
            max={1000000}
            step={10000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filters.priceRange[0].toLocaleString()}원</span>
            <span>{filters.priceRange[1].toLocaleString()}원</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* 학과 */}
      <div>
        <h4 className="font-medium mb-3">학과</h4>
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {DEPARTMENTS.map((dept) => (
              <div key={dept} className="flex items-center space-x-2">
                <Checkbox
                  id={`dept-${dept}`}
                  checked={filters.departments.includes(dept)}
                  onCheckedChange={() => handleToggleFilter('departments', dept)}
                />
                <Label htmlFor={`dept-${dept}`}>{dept}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* 상태 */}
      <div>
        <h4 className="font-medium mb-3">상품 상태</h4>
        <div className="space-y-2">
          {CONDITIONS.map((condition) => (
            <div key={condition.value} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition.value}`}
                checked={filters.conditions.includes(condition.value)}
                onCheckedChange={() => handleToggleFilter('conditions', condition.value)}
              />
              <Label htmlFor={`condition-${condition.value}`}>{condition.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 거래 방식 */}
      <div>
        <h4 className="font-medium mb-3">거래 방식</h4>
        <div className="space-y-2">
          {DEAL_TYPES.map((dealType) => (
            <div key={dealType.value} className="flex items-center space-x-2">
              <Checkbox
                id={`deal-${dealType.value}`}
                checked={filters.dealTypes.includes(dealType.value)}
                onCheckedChange={() => handleToggleFilter('dealTypes', dealType.value)}
              />
              <Label htmlFor={`deal-${dealType.value}`}>{dealType.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 판매 상태 */}
      <div>
        <h4 className="font-medium mb-3">판매 상태</h4>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((status) => (
            <div key={status.value} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status.value}`}
                checked={filters.status.includes(status.value)}
                onCheckedChange={() => handleToggleFilter('status', status.value)}
              />
              <Label htmlFor={`status-${status.value}`}>{status.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
                aria-label="뒤로가기"
              >
                <ArrowUpDown className="h-5 w-5 rotate-90" />
              </Button>
              
              <div>
                <h1 className="font-medium">인하공전 장터</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredItems.length}개의 상품
                </p>
              </div>
            </div>

            <Button 
              className="flex items-center gap-2"
              onClick={onCreateItem}
            >
              <Plus className="h-4 w-4" />
              판매하기
            </Button>
          </div>

          {/* 검색 및 필터 */}
          <div className="pb-4 space-y-4">
            {/* 검색창 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="상품명, 학과, 과목으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 필터 및 정렬 */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {/* 필터 버튼 */}
                {isMobile ? (
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        필터
                        {getActiveFilterCount() > 0 && (
                          <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                            {getActiveFilterCount()}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh]">
                      <SheetHeader>
                        <SheetTitle>필터</SheetTitle>
                      </SheetHeader>
                      <ScrollArea className="h-full mt-4">
                        <FilterContent />
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <Dialog open={showFilters} onOpenChange={setShowFilters}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        필터
                        {getActiveFilterCount() > 0 && (
                          <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                            {getActiveFilterCount()}
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>필터</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-full">
                        <FilterContent />
                      </ScrollArea>
                      <DialogFooter>
                        <Button variant="outline" onClick={clearFilters}>
                          초기화
                        </Button>
                        <Button onClick={() => setShowFilters(false)}>
                          적용
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {/* 활성 필터 표시 */}
                {getActiveFilterCount() > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    필터 초기화
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* 정렬 */}
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="price-low">저가순</SelectItem>
                    <SelectItem value="price-high">고가순</SelectItem>
                    <SelectItem value="popular">인기순</SelectItem>
                    <SelectItem value="nearby">가까운순</SelectItem>
                  </SelectContent>
                </Select>

                {/* 뷰 모드 (데스크톱만) */}
                {!isMobile && (
                  <div className="flex border border-border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto py-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : sortedItems.length > 0 ? (
          <div className={`grid gap-4 ${
            viewMode === 'list' && !isMobile 
              ? 'grid-cols-1' 
              : isMobile 
                ? 'grid-cols-2' 
                : 'grid-cols-3 xl:grid-cols-4'
          }`}>
            {sortedItems.map((item) => (
              <MarketplaceItemCard
                key={item.id}
                item={item}
                onItemClick={handleItemClick}
                onToggleFavorite={handleToggleFavorite}
                onChatClick={handleChatClick}
              />
            ))}
          </div>
        ) : (
          /* 빈 상태 */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-lg font-medium">검색 결과가 없습니다</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {searchQuery 
                ? `"${searchQuery}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보세요.`
                : '설정한 필터 조건에 맞는 상품이 없습니다. 필터를 조정해보세요.'
              }
            </p>
            {(searchQuery || getActiveFilterCount() > 0) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  clearFilters();
                }}
              >
                검색 및 필터 초기화
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default MarketplacePage;