import React from 'react';
import { 
  MapPin, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  RefreshCw, 
  Navigation,
  Shield,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  action, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        {icon || <MapPin className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface LocationPermissionStateProps {
  onRequestPermission?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function LocationPermissionState({ 
  onRequestPermission, 
  onDismiss, 
  className = '' 
}: LocationPermissionStateProps) {
  return (
    <div className={`p-6 ${className}`}>
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">위치 권한이 필요합니다</h4>
            <p className="text-sm">
              현재 위치를 확인하고 주변 시설을 찾으려면 위치 접근 권한이 필요합니다.
              위치 정보는 길찾기 서비스 제공을 위해서만 사용됩니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onRequestPermission}>
              <Navigation className="w-4 h-4 mr-2" />
              권한 허용하기
            </Button>
            <Button variant="outline" size="sm" onClick={onDismiss}>
              나중에
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface OfflineStateProps {
  onRetry?: () => void;
  className?: string;
}

export function OfflineState({ onRetry, className = '' }: OfflineStateProps) {
  return (
    <div className={className}>
      <EmptyState
        title="오프라인 상태"
        description="인터넷 연결을 확인해주세요. 네트워크에 연결되면 최신 지도 정보를 불러올 수 있습니다."
        icon={<WifiOff className="w-8 h-8 text-muted-foreground" />}
        action={onRetry ? {
          label: "다시 시도",
          onClick: onRetry
        } : undefined}
      />
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = "오류가 발생했습니다", 
  description, 
  onRetry, 
  className = '' 
}: ErrorStateProps) {
  return (
    <div className={className}>
      <EmptyState
        title={title}
        description={description}
        icon={<AlertTriangle className="w-8 h-8 text-destructive" />}
        action={onRetry ? {
          label: "다시 시도",
          onClick: onRetry
        } : undefined}
      />
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ 
  message = "지도를 불러오는 중...", 
  className = '' 
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

interface MapSkeletonProps {
  className?: string;
}

export function MapSkeleton({ className = '' }: MapSkeletonProps) {
  return (
    <div className={`p-4 space-y-4 ${className}`}>
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-10" />
      </div>

      {/* 지도 영역 스켈레톤 */}
      <div className="relative">
        <Skeleton className="h-64 w-full rounded-lg" />
        
        {/* 모의 마커들 */}
        <div className="absolute inset-0">
          <Skeleton className="absolute top-16 left-20 w-6 h-6 rounded-full" />
          <Skeleton className="absolute top-32 right-24 w-6 h-6 rounded-full" />
          <Skeleton className="absolute bottom-20 left-32 w-6 h-6 rounded-full" />
          <Skeleton className="absolute top-24 right-16 w-6 h-6 rounded-full" />
        </div>

        {/* 컨트롤 버튼들 */}
        <div className="absolute top-4 right-4 space-y-2">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-10 h-10" />
        </div>
      </div>

      {/* POI 목록 스켈레톤 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
        
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
                <Skeleton className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface NoResultsStateProps {
  searchQuery?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export function NoResultsState({ 
  searchQuery, 
  onClearFilters, 
  hasActiveFilters = false,
  className = '' 
}: NoResultsStateProps) {
  const title = searchQuery 
    ? `"${searchQuery}"에 대한 검색 결과가 없습니다`
    : "검색 결과가 없습니다";
    
  const description = hasActiveFilters 
    ? "적용된 필터를 조정하거나 다른 검색어를 시도해보세요."
    : "다른 검색어를 시도하거나 철자를 확인해보세요.";

  return (
    <div className={className}>
      <EmptyState
        title={title}
        description={description}
        icon={<MapPin className="w-8 h-8 text-muted-foreground" />}
        action={hasActiveFilters && onClearFilters ? {
          label: "필터 초기화",
          onClick: onClearFilters
        } : undefined}
      />
    </div>
  );
}

// 상태별 컴포넌트들을 하나의 객체로 내보내기
export const MapStates = {
  Empty: EmptyState,
  LocationPermission: LocationPermissionState,
  Offline: OfflineState,
  Error: ErrorState,
  Loading: LoadingState,
  Skeleton: MapSkeleton,
  NoResults: NoResultsState
};