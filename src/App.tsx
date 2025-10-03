import React, { useState, useEffect } from 'react';
import { MapHeader, MapProvider } from './components/MapHeader';
import { MapSidebar, CategoryFilter } from './components/MapSidebar';
import { MockMapView } from './components/MockMapView';
import { MapBottomSheet } from './components/MapBottomSheet';
import { MapStates } from './components/MapStates';
import { POI } from './components/POICard';
import { POIDetailPage } from './components/POIDetailPage';
import { NavigationPage } from './components/NavigationPage';
import { MarketplacePage } from './components/MarketplacePage';
import { MarketplaceItemDetail } from './components/MarketplaceItemDetail';
import { MarketplaceCreatePage } from './components/MarketplaceCreatePage';
import { MarketplaceItem } from './components/MarketplaceItem';

type AppState = 'loading' | 'ready' | 'error' | 'offline' | 'no-permission';
type CurrentPage = 'map' | 'poi-detail' | 'navigation' | 'marketplace' | 'marketplace-detail' | 'marketplace-create';

// 모의 POI 데이터
const MOCK_POIS: POI[] = [
  {
    id: '1',
    name: '1호관 (본관)',
    category: 'admin',
    description: '행정실, 학과사무실',
    coordinates: { x: 160, y: 140 },
    distance: 45,
    tags: ['행정', '안내데스크', '학과사무실'],
    hasElevator: true,
    isAccessible: true,
    hasWifi: true,
    rating: 4.2,
    isOpen: true,
    isFavorite: false
  },
  {
    id: '2',
    name: '2호관 (강의동)',
    category: 'lecture',
    description: '일반강의실, 컴퓨터실',
    coordinates: { x: 300, y: 150 },
    distance: 120,
    tags: ['강의실', '컴퓨터실', '스터디룸'],
    hasElevator: true,
    isAccessible: true,
    hasWifi: true,
    rating: 4.0,
    isOpen: true,
    isFavorite: true
  },
  {
    id: '3',
    name: '학생식당',
    category: 'convenience',
    description: '학생식당, 카페테리아',
    coordinates: { x: 440, y: 130 },
    distance: 200,
    tags: ['식당', '카페', '휴게공간'],
    hasElevator: false,
    isAccessible: true,
    hasWifi: true,
    hasParking: true,
    rating: 3.8,
    isOpen: true,
    isFavorite: false
  },
  {
    id: '4',
    name: '3호관 엘리베이터',
    category: 'elevator',
    description: '3호관 중앙 엘리베이터',
    coordinates: { x: 180, y: 250 },
    distance: 80,
    tags: ['엘리베이터', '접근성'],
    hasElevator: true,
    isAccessible: true,
    isFavorite: false
  },
  {
    id: '5',
    name: '도서관',
    category: 'admin',
    description: '중앙도서관, 열람실',
    coordinates: { x: 340, y: 280 },
    distance: 300,
    tags: ['도서관', '열람실', '그룹스터디룸'],
    hasElevator: true,
    isAccessible: true,
    hasWifi: true,
    rating: 4.5,
    isOpen: true,
    isFavorite: true
  },
  {
    id: '6',
    name: '편의점',
    category: 'convenience',
    description: 'GS25 인하공전점',
    coordinates: { x: 200, y: 360 },
    distance: 150,
    tags: ['편의점', '생필품', '간식'],
    hasElevator: false,
    isAccessible: true,
    hasWifi: false,
    isOpen: true,
    isFavorite: false
  }
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [currentPage, setCurrentPage] = useState<CurrentPage>('map');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapProvider, setMapProvider] = useState<MapProvider>('mock');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryFilter[]>([]);
  const [showElevatorOnly, setShowElevatorOnly] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '학생식당', '도서관', '1호관', '편의점'
  ]);
  const [favoritesPOIs, setFavoritesPOIs] = useState<POI[]>(
    MOCK_POIS.filter(poi => poi.isFavorite)
  );
  const [selectedMarketplaceItem, setSelectedMarketplaceItem] = useState<MarketplaceItem | null>(null);

  // 반응형 체크
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 초기 로딩
  useEffect(() => {
    const timer = setTimeout(() => {
      // 네트워크 상태 체크 시뮬레이션
      if (!navigator.onLine) {
        setAppState('offline');
      } else {
        setAppState('ready');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 필터링된 POI 계산
  const filteredPOIs = MOCK_POIS.filter(poi => {
    // 카테고리 필터
    if (selectedCategories.length > 0 && !selectedCategories.includes(poi.category)) {
      return false;
    }

    // 엘리베이터 필터
    if (showElevatorOnly && !poi.hasElevator) {
      return false;
    }

    // 검색 쿼리 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return poi.name.toLowerCase().includes(query) ||
             poi.description?.toLowerCase().includes(query) ||
             poi.tags.some(tag => tag.toLowerCase().includes(query));
    }

    return true;
  });

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // 최근 검색어에 추가
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 9)]);
    }
  };

  // 현재 위치 가져오기
  const handleGetCurrentLocation = async () => {
    setIsLocationLoading(true);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('위치 서비스가 지원되지 않습니다.');
      }

      // 권한 요청
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'denied') {
        setHasLocationPermission(false);
        setAppState('no-permission');
        return;
      }

      // 위치 가져오기 (모의)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 모의 사용자 위치 설정
      setUserLocation({ x: 250, y: 200 });
      setHasLocationPermission(true);
      
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
      setHasLocationPermission(false);
    } finally {
      setIsLocationLoading(false);
    }
  };

  // 위치 권한 요청
  const handleRequestLocationPermission = async () => {
    await handleGetCurrentLocation();
    if (hasLocationPermission) {
      setAppState('ready');
    }
  };

  // POI 클릭 핸들러
  const handlePOIClick = (poi: POI) => {
    setSelectedPOI(poi);
  };

  // POI 상세 페이지로 이동
  const handleNavigateToPOIDetail = (poi: POI) => {
    setSelectedPOI(poi);
    setCurrentPage('poi-detail');
  };

  // 지도로 돌아가기
  const handleBackToMap = () => {
    setCurrentPage('map');
  };

  // 길찾기 시작
  const handleStartNavigation = (poi: POI) => {
    // 네비게이션 페이지로 이동
    setSelectedPOI(poi);
    setCurrentPage('navigation');
  };

  // 네비게이션 종료
  const handleEndNavigation = () => {
    setCurrentPage('map');
  };

  // 장터 페이지로 이동
  const handleGoToMarketplace = () => {
    setCurrentPage('marketplace');
  };

  // 장터 아이템 상세 페이지로 이동
  const handleNavigateToMarketplaceDetail = (item: MarketplaceItem) => {
    setSelectedMarketplaceItem(item);
    setCurrentPage('marketplace-detail');
  };

  // 장터 아이템 즐겨찾기 토글
  const handleToggleMarketplaceFavorite = (item: MarketplaceItem) => {
    // 실제 구현에서는 여기서 서버에 업데이트 요청
    console.log('장터 아이템 즐겨찾기 토글:', item.title);
  };

  // 장터 아이템 채팅 시작
  const handleMarketplaceChatClick = (item: MarketplaceItem) => {
    // 실제 구현에서는 채팅 페이지로 이동
    console.log('장터 아이템 채팅 시작:', item.title);
  };

  // 장터 아이템 공유
  const handleMarketplaceShare = (item: MarketplaceItem) => {
    // 실제 구현에서는 공유 기능 구현
    console.log('장터 아이템 공유:', item.title);
  };

  // 장터 아이템 등록 페이지로 이동
  const handleGoToMarketplaceCreate = () => {
    setCurrentPage('marketplace-create');
  };

  // 장터 아이템 등록 제출
  const handleMarketplaceSubmit = async (data: any) => {
    // 실제 구현에서는 서버에 데이터 전송
    console.log('장터 아이템 등록:', data);
    // 등록 성공 후 장터 목록으로 이동
    setCurrentPage('marketplace');
  };

  // 장터 아이템 임시저장
  const handleMarketplaceSaveDraft = async (data: any) => {
    // 실제 구현에서는 로컬 스토리지나 서버에 임시저장
    console.log('장터 아이템 임시저장:', data);
  };

  // 즐겨찾기 토글
  const handleToggleFavorite = (poi: POI) => {
    const updatedPOI = { ...poi, isFavorite: !poi.isFavorite };
    
    // 선택된 POI 업데이트
    if (selectedPOI && selectedPOI.id === poi.id) {
      setSelectedPOI(updatedPOI);
    }
    
    if (updatedPOI.isFavorite) {
      setFavoritesPOIs(prev => [...prev, updatedPOI]);
    } else {
      setFavoritesPOIs(prev => prev.filter(p => p.id !== poi.id));
    }

    // 실제 앱에서는 여기서 서버에 업데이트 요청
  };

  // 최근 검색어 관리
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  // 재시도 핸들러
  const handleRetry = () => {
    setAppState('loading');
    setTimeout(() => {
      setAppState(navigator.onLine ? 'ready' : 'offline');
    }, 1000);
  };

  // POI 상세 페이지 렌더링
  if (currentPage === 'poi-detail' && selectedPOI) {
    return (
      <POIDetailPage
        poi={selectedPOI}
        onBack={handleBackToMap}
        onNavigate={handleStartNavigation}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }

  // 네비게이션 페이지 렌더링
  if (currentPage === 'navigation' && selectedPOI) {
    return (
      <NavigationPage
        destination={selectedPOI}
        origin={userLocation ? { x: userLocation.x, y: userLocation.y, name: '현재 위치' } : undefined}
        onBack={handleBackToMap}
        onEndNavigation={handleEndNavigation}
      />
    );
  }

  // 장터 페이지 렌더링
  if (currentPage === 'marketplace') {
    return (
      <MarketplacePage
        onBack={handleBackToMap}
        onItemClick={handleNavigateToMarketplaceDetail}
        onToggleFavorite={handleToggleMarketplaceFavorite}
        onChatClick={handleMarketplaceChatClick}
        onCreateItem={handleGoToMarketplaceCreate}
      />
    );
  }

  // 장터 상세 페이지 렌더링
  if (currentPage === 'marketplace-detail' && selectedMarketplaceItem) {
    return (
      <MarketplaceItemDetail
        item={selectedMarketplaceItem}
        onBack={() => setCurrentPage('marketplace')}
        onToggleFavorite={handleToggleMarketplaceFavorite}
        onChatClick={handleMarketplaceChatClick}
        onShare={handleMarketplaceShare}
      />
    );
  }

  // 장터 등록 페이지 렌더링
  if (currentPage === 'marketplace-create') {
    return (
      <MarketplaceCreatePage
        onBack={() => setCurrentPage('marketplace')}
        onSubmit={handleMarketplaceSubmit}
        onSaveDraft={handleMarketplaceSaveDraft}
      />
    );
  }

  // 로딩 상태
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <MapStates.Skeleton />
      </div>
    );
  }

  // 오프라인 상태
  if (appState === 'offline') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <MapStates.Offline onRetry={handleRetry} />
      </div>
    );
  }

  // 위치 권한 필요 상태
  if (appState === 'no-permission') {
    return (
      <div className="min-h-screen bg-background">
        <MapHeader
          onSearch={handleSearch}
          onGetCurrentLocation={handleGetCurrentLocation}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onMapProviderChange={setMapProvider}
          onGoToMarketplace={handleGoToMarketplace}
          currentProvider={mapProvider}
          searchQuery={searchQuery}
          isLocationLoading={isLocationLoading}
          hasLocationPermission={hasLocationPermission}
          notificationCount={3}
          isMobile={isMobile}
        />
        <div className="container mx-auto py-8">
          <MapStates.LocationPermission
            onRequestPermission={handleRequestLocationPermission}
            onDismiss={() => setAppState('ready')}
          />
        </div>
      </div>
    );
  }

  // 메인 앱
  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content */}
      <a 
        href="#main-content" 
        className="skip-to-main focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        메인 콘텐츠로 바로가기
      </a>

      {/* 헤더 */}
      <MapHeader
        onSearch={handleSearch}
        onGetCurrentLocation={handleGetCurrentLocation}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onMapProviderChange={setMapProvider}
        onGoToMarketplace={handleGoToMarketplace}
        currentProvider={mapProvider}
        searchQuery={searchQuery}
        isLocationLoading={isLocationLoading}
        hasLocationPermission={hasLocationPermission}
        notificationCount={3}
        isMobile={isMobile}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* 사이드바 (데스크톱) */}
        {!isMobile && (
          <MapSidebar
            isOpen={sidebarOpen}
            onCategoryFilter={setSelectedCategories}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToPOI={handleNavigateToPOIDetail}
            favoritesPOIs={favoritesPOIs}
            recentSearches={recentSearches}
            onClearRecentSearches={handleClearRecentSearches}
            onRemoveRecentSearch={handleRemoveRecentSearch}
            selectedCategories={selectedCategories}
            showElevatorOnly={showElevatorOnly}
            onToggleElevatorFilter={setShowElevatorOnly}
            isMobile={false}
          />
        )}

        {/* 사이드바 (모바일) */}
        {isMobile && (
          <MapSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onCategoryFilter={setSelectedCategories}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToPOI={handleNavigateToPOIDetail}
            favoritesPOIs={favoritesPOIs}
            recentSearches={recentSearches}
            onClearRecentSearches={handleClearRecentSearches}
            onRemoveRecentSearch={handleRemoveRecentSearch}
            selectedCategories={selectedCategories}
            showElevatorOnly={showElevatorOnly}
            onToggleElevatorFilter={setShowElevatorOnly}
            isMobile={true}
          />
        )}

        {/* 지도 영역 */}
        <main 
          id="main-content"
          className="flex-1 relative"
          role="main"
          aria-label="길찾기 지도"
        >
          <MockMapView
            pois={filteredPOIs}
            selectedPOI={selectedPOI}
            onPOIClick={handleNavigateToPOIDetail}
            userLocation={userLocation}
            showUserLocation={hasLocationPermission}
            className="w-full h-full"
          />

          {/* 검색 결과 없음 */}
          {filteredPOIs.length === 0 && searchQuery && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="max-w-md">
                <MapStates.NoResults
                  searchQuery={searchQuery}
                  hasActiveFilters={selectedCategories.length > 0 || showElevatorOnly}
                  onClearFilters={() => {
                    setSelectedCategories([]);
                    setShowElevatorOnly(false);
                  }}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 하단 시트 (모바일) */}
      {isMobile && (
        <MapBottomSheet
          pois={filteredPOIs}
          selectedPOI={selectedPOI}
          onPOIClick={handleNavigateToPOIDetail}
          onToggleFavorite={handleToggleFavorite}
          onFilterOpen={() => setSidebarOpen(true)}
          filteredPOIsCount={filteredPOIs.length}
          isFilterActive={selectedCategories.length > 0 || showElevatorOnly}
        />
      )}
    </div>
  );
}