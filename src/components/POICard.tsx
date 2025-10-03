import React from 'react';
import { MapPin, Star, Clock, ArrowUp, Accessibility, Car, Utensils, Wifi } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export interface POI {
  id: string;
  name: string;
  category: 'lecture' | 'admin' | 'convenience' | 'elevator';
  description?: string;
  distance?: number;
  tags: string[];
  coordinates: { x: number; y: number };
  isOpen?: boolean;
  isFavorite?: boolean;
  hasElevator?: boolean;
  isAccessible?: boolean;
  hasParking?: boolean;
  hasWifi?: boolean;
  rating?: number;
}

interface POICardProps {
  poi: POI;
  onNavigate?: (poi: POI) => void;
  onToggleFavorite?: (poi: POI) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showDistance?: boolean;
  className?: string;
}

const categoryConfig = {
  lecture: {
    icon: MapPin,
    label: '강의동',
    color: 'bg-primary text-primary-foreground'
  },
  admin: {
    icon: MapPin,
    label: '행정',
    color: 'bg-secondary text-secondary-foreground'
  },
  convenience: {
    icon: Utensils,
    label: '편의',
    color: 'bg-orange-500 text-white'
  },
  elevator: {
    icon: ArrowUp,
    label: '엘리베이터',
    color: 'bg-purple-500 text-white'
  }
};

export function POICard({ 
  poi, 
  onNavigate, 
  onToggleFavorite, 
  variant = 'default',
  showDistance = true,
  className = "" 
}: POICardProps) {
  const CategoryIcon = categoryConfig[poi.category].icon;
  
  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const handleNavigate = () => {
    onNavigate?.(poi);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(poi);
  };

  if (variant === 'compact') {
    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${className}`}
        onClick={handleNavigate}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${categoryConfig[poi.category].color}`}>
              <CategoryIcon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{poi.name}</h3>
                {poi.isFavorite && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {categoryConfig[poi.category].label}
                </Badge>
                {showDistance && poi.distance && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistance(poi.distance)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {poi.hasElevator && (
                <ArrowUp className="w-3 h-3 text-muted-foreground" />
              )}
              {poi.isAccessible && (
                <Accessibility className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${className}`}
      onClick={handleNavigate}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${categoryConfig[poi.category].color}`}>
              <CategoryIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{poi.name}</h3>
              {poi.description && (
                <p className="text-sm text-muted-foreground">{poi.description}</p>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className="p-2"
            aria-label={poi.isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
          >
            <Star 
              className={`w-5 h-5 ${
                poi.isFavorite 
                  ? 'text-yellow-500 fill-current' 
                  : 'text-muted-foreground'
              }`} 
            />
          </Button>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">
            {categoryConfig[poi.category].label}
          </Badge>
          {poi.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* 부가 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showDistance && poi.distance && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatDistance(poi.distance)}
                </span>
              </div>
            )}

            {poi.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{poi.rating.toFixed(1)}</span>
              </div>
            )}

            {poi.isOpen !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className={`text-sm ${poi.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {poi.isOpen ? '운영 중' : '운영 종료'}
                </span>
              </div>
            )}
          </div>

          {/* 편의시설 아이콘 */}
          <div className="flex items-center gap-2">
            {poi.hasElevator && (
              <div className="p-1.5 bg-muted rounded" title="엘리베이터 있음">
                <ArrowUp className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
            {poi.isAccessible && (
              <div className="p-1.5 bg-muted rounded" title="접근성 우수">
                <Accessibility className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
            {poi.hasParking && (
              <div className="p-1.5 bg-muted rounded" title="주차 가능">
                <Car className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
            {poi.hasWifi && (
              <div className="p-1.5 bg-muted rounded" title="WiFi 있음">
                <Wifi className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {variant === 'detailed' && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={handleNavigate}
              className="w-full"
              size="sm"
            >
              길찾기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}