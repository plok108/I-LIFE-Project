import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { POI } from './POICard';

interface MockMapViewProps {
  pois?: POI[];
  selectedPOI?: POI | null;
  onPOIClick?: (poi: POI) => void;
  userLocation?: { x: number; y: number } | null;
  showUserLocation?: boolean;
  className?: string;
}

interface MapMarker extends POI {
  screenX: number;
  screenY: number;
}

const categoryColors = {
  lecture: '#2563EB',      // primary
  admin: '#10B981',        // secondary  
  convenience: '#F59E0B',  // orange
  elevator: '#8B5CF6'      // purple
};

export function MockMapView({
  pois = [],
  selectedPOI,
  onPOIClick,
  userLocation,
  showUserLocation = true,
  className = ''
}: MockMapViewProps) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 400, y: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // POI를 화면 좌표로 변환
  const transformPOIs = (pois: POI[]): MapMarker[] => {
    return pois.map(poi => ({
      ...poi,
      screenX: (poi.coordinates.x * zoom) + center.x + mapOffset.x,
      screenY: (poi.coordinates.y * zoom) + center.y + mapOffset.y
    }));
  };

  const transformedPOIs = transformPOIs(pois);

  // 사용자 위치 변환
  const userLocationScreen = userLocation ? {
    x: (userLocation.x * zoom) + center.x + mapOffset.x,
    y: (userLocation.y * zoom) + center.y + mapOffset.y
  } : null;

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setCenter({ x: 400, y: 300 });
    setMapOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setMapOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePOIClick = (poi: POI, e: React.MouseEvent) => {
    e.stopPropagation();
    onPOIClick?.(poi);
  };

  // 선택된 POI로 중심 이동
  useEffect(() => {
    if (selectedPOI) {
      const targetPOI = transformedPOIs.find(p => p.id === selectedPOI.id);
      if (targetPOI) {
        setCenter({ x: 400, y: 300 });
        setMapOffset({
          x: -(targetPOI.coordinates.x * zoom),
          y: -(targetPOI.coordinates.y * zoom)
        });
      }
    }
  }, [selectedPOI, zoom]);

  return (
    <div className={`relative bg-gray-100 overflow-hidden ${className}`}>
      {/* 지도 배경 */}
      <div
        ref={mapRef}
        className="w-full h-full cursor-move select-none relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* 그리드 배경 */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ 
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* 건물 모양 (모의 캠퍼스 레이아웃) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ 
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* 메인 건물들 */}
          <rect x="100" y="100" width="120" height="80" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" rx="4" />
          <rect x="250" y="120" width="100" height="60" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" rx="4" />
          <rect x="380" y="90" width="140" height="100" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" rx="4" />
          <rect x="150" y="220" width="80" height="60" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" rx="4" />
          <rect x="280" y="240" width="120" height="80" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" rx="4" />
          
          {/* 도로 */}
          <path d="M 0 200 Q 200 200 400 200 Q 600 200 800 200" stroke="#9ca3af" strokeWidth="8" fill="none" />
          <path d="M 300 0 L 300 600" stroke="#9ca3af" strokeWidth="6" fill="none" />
          
          {/* 녹지 영역 */}
          <circle cx="200" cy="350" r="40" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
          <circle cx="450" cy="280" r="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
        </svg>

        {/* 사용자 위치 */}
        {showUserLocation && userLocationScreen && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: userLocationScreen.x - 12,
              top: userLocationScreen.y - 12,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse">
              <div className="w-full h-full bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}

        {/* POI 마커 */}
        {transformedPOIs.map((poi) => (
          <div
            key={poi.id}
            className="absolute z-10 cursor-pointer"
            style={{
              left: poi.screenX,
              top: poi.screenY,
              transform: 'translate(-50%, -100%)'
            }}
            onClick={(e) => handlePOIClick(poi, e)}
          >
            {/* 마커 */}
            <div
              className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all hover:scale-110 ${
                selectedPOI?.id === poi.id 
                  ? 'ring-2 ring-primary ring-offset-2 scale-110' 
                  : ''
              }`}
              style={{ backgroundColor: categoryColors[poi.category] }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>

            {/* 툴팁 */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <Card className="whitespace-nowrap">
                <CardContent className="px-3 py-2">
                  <p className="font-medium text-sm">{poi.name}</p>
                  {poi.distance && (
                    <p className="text-xs text-muted-foreground">
                      {poi.distance < 1000 
                        ? `${Math.round(poi.distance)}m` 
                        : `${(poi.distance / 1000).toFixed(1)}km`
                      }
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}

        {/* 선택된 POI 정보 카드 */}
        {selectedPOI && (
          <div className="absolute bottom-6 left-6 right-6 z-30">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: categoryColors[selectedPOI.category] }}
                    >
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedPOI.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {selectedPOI.category === 'lecture' && '강의동'}
                          {selectedPOI.category === 'admin' && '행정'}
                          {selectedPOI.category === 'convenience' && '편의'}
                          {selectedPOI.category === 'elevator' && '엘리베이터'}
                        </Badge>
                        {selectedPOI.distance && (
                          <span className="text-xs text-muted-foreground">
                            {selectedPOI.distance < 1000 
                              ? `${Math.round(selectedPOI.distance)}m` 
                              : `${(selectedPOI.distance / 1000).toFixed(1)}km`
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button size="sm">
                    <Navigation className="w-4 h-4 mr-2" />
                    길찾기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 지도 컨트롤 */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="bg-background/90 backdrop-blur-sm"
          aria-label="확대"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="bg-background/90 backdrop-blur-sm"
          aria-label="축소"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetView}
          className="bg-background/90 backdrop-blur-sm"
          aria-label="전체 보기"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* 줌 레벨 표시 */}
      <div className="absolute bottom-4 right-4 z-30">
        <Card className="bg-background/90 backdrop-blur-sm">
          <CardContent className="px-3 py-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 범례 */}
      <div className="absolute top-4 left-4 z-30">
        <Card className="bg-background/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <h4 className="font-medium text-sm mb-2">범례</h4>
            <div className="space-y-2">
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">
                    {category === 'lecture' && '강의동'}
                    {category === 'admin' && '행정'}
                    {category === 'convenience' && '편의'}
                    {category === 'elevator' && '엘리베이터'}
                  </span>
                </div>
              ))}
              {showUserLocation && userLocationScreen && (
                <div className="flex items-center gap-2 pt-1 border-t">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-xs">현재 위치</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}