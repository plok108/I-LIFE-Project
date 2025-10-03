import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, Filter, List, Grid3X3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { POI, POICard } from './POICard';
import { CategoryFilter } from './MapSidebar';

interface MapBottomSheetProps {
  pois?: POI[];
  selectedPOI?: POI | null;
  onPOIClick?: (poi: POI) => void;
  onToggleFavorite?: (poi: POI) => void;
  onFilterOpen?: () => void;
  filteredPOIsCount?: number;
  isFilterActive?: boolean;
  className?: string;
}

type SheetState = 'collapsed' | 'partial' | 'expanded';
type ViewMode = 'list' | 'grid';

const COLLAPSED_HEIGHT = 120;
const PARTIAL_HEIGHT = 320;
const EXPANDED_HEIGHT_OFFSET = 100;

export function MapBottomSheet({
  pois = [],
  selectedPOI,
  onPOIClick,
  onToggleFavorite,
  onFilterOpen,
  filteredPOIsCount = 0,
  isFilterActive = false,
  className = ''
}: MapBottomSheetProps) {
  const [sheetState, setSheetState] = useState<SheetState>('partial');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // 화면 높이에 따른 확장 높이 계산
  const expandedHeight = typeof window !== 'undefined' 
    ? window.innerHeight - EXPANDED_HEIGHT_OFFSET 
    : 600;

  // 상태에 따른 높이 계산
  const getHeightForState = (state: SheetState) => {
    switch (state) {
      case 'collapsed':
        return COLLAPSED_HEIGHT;
      case 'partial':
        return PARTIAL_HEIGHT;
      case 'expanded':
        return expandedHeight;
      default:
        return PARTIAL_HEIGHT;
    }
  };

  const currentHeight = getHeightForState(sheetState);

  // 드래그 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientY);
    setInitialHeight(currentHeight);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientY);
    setInitialHeight(currentHeight);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaY = dragStart - e.touches[0].clientY;
    const newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(expandedHeight, initialHeight + deltaY));
    
    if (sheetRef.current) {
      sheetRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = dragStart - e.clientY;
    const newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(expandedHeight, initialHeight + deltaY));
    
    if (sheetRef.current) {
      sheetRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleEnd = () => {
    if (!isDragging || !sheetRef.current) return;
    
    const currentSheetHeight = parseInt(sheetRef.current.style.height) || currentHeight;
    
    // 스냅 포인트 결정
    const snapPoints = [COLLAPSED_HEIGHT, PARTIAL_HEIGHT, expandedHeight];
    let closestSnap = snapPoints[0];
    let minDistance = Math.abs(currentSheetHeight - snapPoints[0]);
    
    snapPoints.forEach(point => {
      const distance = Math.abs(currentSheetHeight - point);
      if (distance < minDistance) {
        minDistance = distance;
        closestSnap = point;
      }
    });
    
    // 상태 업데이트
    if (closestSnap === COLLAPSED_HEIGHT) {
      setSheetState('collapsed');
    } else if (closestSnap === PARTIAL_HEIGHT) {
      setSheetState('partial');
    } else {
      setSheetState('expanded');
    }
    
    setIsDragging(false);
  };

  // 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
      };
    }
  }, [isDragging, dragStart, initialHeight]);

  // 핸들 클릭으로 상태 토글
  const handleToggle = () => {
    if (sheetState === 'collapsed') {
      setSheetState('partial');
    } else if (sheetState === 'partial') {
      setSheetState('expanded');
    } else {
      setSheetState('collapsed');
    }
  };

  return (
    <div
      ref={sheetRef}
      className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-xl shadow-lg transition-all duration-300 ease-out z-40 ${className}`}
      style={{ 
        height: isDragging ? undefined : currentHeight,
        transform: 'translateZ(0)' // GPU 가속
      }}
    >
      {/* 드래그 핸들 */}
      <div
        ref={handleRef}
        className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
        onClick={handleToggle}
      >
        <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* 헤더 */}
      <div className="px-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg">주변 장소</h2>
            {filteredPOIsCount > 0 && (
              <Badge variant="secondary">
                {filteredPOIsCount}개
              </Badge>
            )}
            {isFilterActive && (
              <Badge variant="outline" className="text-primary">
                필터 적용됨
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* 보기 모드 토글 */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>

            {/* 필터 버튼 */}
            <Button
              variant={isFilterActive ? 'default' : 'outline'}
              size="sm"
              onClick={onFilterOpen}
            >
              <Filter className="w-4 h-4" />
              {!isFilterActive && <span className="ml-2">필터</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-hidden">
        {sheetState === 'collapsed' ? (
          // 축소 상태: 요약만 표시
          <div className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {pois.length}개의 장소를 찾았습니다
              </p>
              <Button variant="ghost" size="sm" onClick={() => setSheetState('partial')}>
                <ChevronUp className="w-4 h-4" />
                더보기
              </Button>
            </div>
          </div>
        ) : (
          // 부분/확장 상태: 전체 목록
          <ScrollArea className="h-full">
            <div className="p-4">
              {pois.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <List className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">검색 결과가 없습니다</h3>
                  <p className="text-sm text-muted-foreground">
                    다른 검색어를 시도하거나 필터를 조정해보세요
                  </p>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                    : 'space-y-3'
                }>
                  {pois.map((poi) => (
                    <POICard
                      key={poi.id}
                      poi={poi}
                      variant={viewMode === 'grid' ? 'compact' : 'default'}
                      onNavigate={onPOIClick}
                      onToggleFavorite={onToggleFavorite}
                      showDistance={true}
                      className={selectedPOI?.id === poi.id ? 'ring-2 ring-primary' : ''}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* 확장 상태에서만 보이는 하단 안전 영역 */}
      {sheetState === 'expanded' && (
        <div className="h-8 bg-background" />
      )}
    </div>
  );
}