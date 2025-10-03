import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight, CornerDownRight, Navigation, Clock, MapPin, Settings, Share2, QrCode, Wifi, AlertTriangle, Route, Repeat, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Progress } from './ui/progress';
import { POI } from './POICard';

interface NavigationPageProps {
  destination: POI;
  origin?: { x: number; y: number; name?: string };
  onBack: () => void;
  onEndNavigation: () => void;
  className?: string;
}

interface RouteStep {
  id: string;
  instruction: string;
  direction: 'straight' | 'left' | 'right' | 'elevator-up' | 'elevator-down' | 'stairs-up' | 'stairs-down';
  distance: number;
  duration: number;
  landmark?: string;
  floor?: number;
  isCompleted?: boolean;
}

interface RouteOptions {
  preferElevator: boolean;
  minimizeStairs: boolean;
  indoorRoute: boolean;
}

interface AlternativeRoute {
  id: string;
  name: string;
  duration: number;
  distance: number;
  description: string;
  preference: 'fastest' | 'shortest' | 'accessible';
}

export function NavigationPage({ destination, origin, onBack, onEndNavigation, className }: NavigationPageProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [routeOptions, setRouteOptions] = useState<RouteOptions>({
    preferElevator: true,
    minimizeStairs: false,
    indoorRoute: true
  });
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(false);
  const [gpsSignalStrength, setGpsSignalStrength] = useState<'strong' | 'weak' | 'none'>('strong');
  const [isNavigationActive, setIsNavigationActive] = useState(true);
  const [routeProgress, setRouteProgress] = useState(0);

  // 모의 경로 데이터 생성
  const generateRouteSteps = (): RouteStep[] => {
    const steps: RouteStep[] = [
      {
        id: '1',
        instruction: '현재 위치에서 북쪽으로 이동하세요',
        direction: 'straight',
        distance: 50,
        duration: 60,
        landmark: '중앙 광장'
      },
      {
        id: '2',
        instruction: '1호관 입구에서 우회전하세요',
        direction: 'right',
        distance: 30,
        duration: 36,
        landmark: '1호관 정문'
      }
    ];

    if (routeOptions.preferElevator && destination.hasElevator) {
      steps.push({
        id: '3',
        instruction: '엘리베이터를 타고 목적지 층으로 이동하세요',
        direction: 'elevator-up',
        distance: 0,
        duration: 90,
        floor: 3,
        landmark: '중앙 엘리베이터'
      });
    } else if (!routeOptions.minimizeStairs) {
      steps.push({
        id: '3',
        instruction: '계단을 이용해 3층으로 올라가세요',
        direction: 'stairs-up',
        distance: 0,
        duration: 120,
        floor: 3,
        landmark: '동쪽 계단'
      });
    }

    steps.push({
      id: '4',
      instruction: `${destination.name}에 도착했습니다`,
      direction: 'straight',
      distance: 20,
      duration: 24,
      landmark: destination.name,
      isCompleted: false
    });

    return steps;
  };

  const [routeSteps, setRouteSteps] = useState<RouteStep[]>(generateRouteSteps());

  // 총 거리 및 시간 계산
  const totalDistance = routeSteps.reduce((sum, step) => sum + step.distance, 0);
  const totalDuration = routeSteps.reduce((sum, step) => sum + step.duration, 0);

  // 대안 경로 데이터
  const alternativeRoutes: AlternativeRoute[] = [
    {
      id: '1',
      name: '가장 빠른 경로',
      duration: Math.floor(totalDuration * 0.9),
      distance: Math.floor(totalDistance * 1.1),
      description: '계단 이용, 실외 경로',
      preference: 'fastest'
    },
    {
      id: '2',
      name: '접근성 경로',
      duration: Math.floor(totalDuration * 1.2),
      distance: Math.floor(totalDistance * 0.95),
      description: '엘리베이터 이용, 경사로 우선',
      preference: 'accessible'
    },
    {
      id: '3',
      name: '최단 거리',
      duration: Math.floor(totalDuration * 1.1),
      distance: Math.floor(totalDistance * 0.8),
      description: '직선 거리 우선',
      preference: 'shortest'
    }
  ];

  // GPS 신호 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      const signals = ['strong', 'weak', 'strong', 'strong'] as const;
      setGpsSignalStrength(signals[Math.floor(Math.random() * signals.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 경로 진행 시뮬레이션
  useEffect(() => {
    if (!isNavigationActive) return;

    const interval = setInterval(() => {
      setRouteProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          setIsNavigationActive(false);
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isNavigationActive]);

  // 경로 옵션 변경 시 경로 재계산
  useEffect(() => {
    setRouteSteps(generateRouteSteps());
  }, [routeOptions, destination]);

  const getDirectionIcon = (direction: RouteStep['direction']) => {
    switch (direction) {
      case 'straight': return <ArrowUp className="h-5 w-5" />;
      case 'left': return <ArrowLeft className="h-5 w-5 rotate-90" />;
      case 'right': return <CornerDownRight className="h-5 w-5" />;
      case 'elevator-up': return <ArrowUp className="h-5 w-5" />;
      case 'elevator-down': return <ArrowDown className="h-5 w-5" />;
      case 'stairs-up': return <ArrowUp className="h-5 w-5" />;
      case 'stairs-down': return <ArrowDown className="h-5 w-5" />;
      default: return <Navigation className="h-5 w-5" />;
    }
  };

  const getStepStatusColor = (index: number) => {
    if (index < currentStepIndex) return 'bg-success text-white';
    if (index === currentStepIndex) return 'bg-primary text-white';
    return 'bg-muted text-muted-foreground';
  };

  const handleNextStep = () => {
    if (currentStepIndex < routeSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${destination.name} 길찾기`,
      text: `인하공전 캠퍼스 길찾기 - ${destination.name}까지 ${Math.ceil(totalDuration / 60)}분 소요`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('공유 취소됨');
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
    setShowShareDialog(false);
  };

  const generateQRCode = () => {
    // QR 코드 생성 로직 (실제 구현에서는 QR 라이브러리 사용)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`;
  };

  const handleRouteOptionChange = (option: keyof RouteOptions, value: boolean) => {
    setRouteOptions(prev => ({ ...prev, [option]: value }));
  };

  const currentStep = routeSteps[currentStepIndex];
  const nextStep = routeSteps[currentStepIndex + 1];

  // 모바일 확인
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
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
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div>
                <h1 className="font-medium">{destination.name}</h1>
                <p className="text-sm text-muted-foreground">길찾기 안내</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* GPS 신호 상태 */}
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  gpsSignalStrength === 'strong' ? 'bg-success' :
                  gpsSignalStrength === 'weak' ? 'bg-warning' : 'bg-destructive'
                }`} />
                {gpsSignalStrength === 'weak' && (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
              </div>

              {/* 공유 버튼 */}
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>경로 공유하기</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <img 
                        src={generateQRCode()} 
                        alt="경로 QR 코드"
                        className="mx-auto mb-2"
                      />
                      <p className="text-sm text-muted-foreground">QR 코드로 경로 공유</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex gap-2">
                      <Button onClick={handleShare} className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        링크 공유
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="flex-1"
                      >
                        링크 복사
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* 네비게이션 종료 */}
              <Button
                variant="outline"
                size="sm"
                onClick={onEndNavigation}
                className="text-destructive border-destructive hover:bg-destructive hover:text-white"
              >
                종료
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 상단 요약 바 */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{Math.ceil(totalDuration / 60)}분</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{totalDistance}m</span>
              </div>

              {routeProgress > 0 && (
                <div className="flex items-center gap-2 min-w-24">
                  <Progress value={routeProgress} className="flex-1" />
                  <span className="text-sm text-muted-foreground">{Math.round(routeProgress)}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* 대안 경로 */}
              <Sheet open={showAlternativeRoutes} onOpenChange={setShowAlternativeRoutes}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Route className="h-4 w-4 mr-2" />
                    다른 경로
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>대안 경로</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {alternativeRoutes.map((route) => (
                      <Card key={route.id} className="cursor-pointer hover:bg-accent">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{route.name}</h4>
                            <Badge variant="outline">
                              {route.preference === 'fastest' ? '빠름' :
                               route.preference === 'shortest' ? '짧음' : '접근성'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{route.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{Math.ceil(route.duration / 60)}분</span>
                            <span>{route.distance}m</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* 경로 옵션 */}
              <Dialog open={showRouteOptions} onOpenChange={setShowRouteOptions}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    옵션
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>경로 옵션</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="prefer-elevator" className="flex-1">
                        엘리베이터 우선
                        <p className="text-sm text-muted-foreground">가능한 엘리베이터를 이용한 경로</p>
                      </Label>
                      <Switch
                        id="prefer-elevator"
                        checked={routeOptions.preferElevator}
                        onCheckedChange={(checked) => handleRouteOptionChange('preferElevator', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="minimize-stairs" className="flex-1">
                        계단 최소화
                        <p className="text-sm text-muted-foreground">계단 이용을 최소화한 경로</p>
                      </Label>
                      <Switch
                        id="minimize-stairs"
                        checked={routeOptions.minimizeStairs}
                        onCheckedChange={(checked) => handleRouteOptionChange('minimizeStairs', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="indoor-route" className="flex-1">
                        실내 경로 우선
                        <p className="text-sm text-muted-foreground">건물 내부 경로를 우선 이용</p>
                      </Label>
                      <Switch
                        id="indoor-route"
                        checked={routeOptions.indoorRoute}
                        onCheckedChange={(checked) => handleRouteOptionChange('indoorRoute', checked)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={() => setShowRouteOptions(false)}>
                      적용
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* GPS 약함 경고 */}
          {gpsSignalStrength === 'weak' && (
            <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm text-warning">GPS 신호가 약합니다. 실내에서는 정확도가 떨어질 수 있습니다.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-12rem)]">
        {/* 지도 영역 */}
        <main className={`relative bg-muted ${isMobile ? 'w-full' : 'flex-1'}`}>
          {/* 모의 지도 - 경로 하이라이트 포함 */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-2xl aspect-square bg-background border border-border rounded-lg overflow-hidden">
              {/* 지도 배경 */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted opacity-50" />
              
              {/* 경로 라인 */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 100 400 L 200 350 L 300 300 L 400 200 L 450 150"
                  stroke="var(--primary)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="8,4"
                  className="animate-pulse"
                />
              </svg>
              
              {/* 현재 위치 */}
              <div className="absolute top-96 left-24 w-4 h-4 bg-primary rounded-full animate-pulse border-2 border-white shadow-lg" />
              
              {/* 목적지 */}
              <div className="absolute top-36 right-24 w-6 h-6 bg-destructive rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <MapPin className="h-3 w-3 text-white" />
              </div>
              
              {/* 다음 턴 표시 */}
              {nextStep && (
                <div className="absolute top-64 left-64 bg-white border border-border rounded-lg shadow-lg p-2">
                  <div className="flex items-center gap-2 text-sm">
                    {getDirectionIcon(nextStep.direction)}
                    <span className="font-medium">{nextStep.distance}m 후</span>
                  </div>
                </div>
              )}
              
              {/* 지도 범례 */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-primary" />
                  <span>경로</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span>현재 위치</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full" />
                  <span>목적지</span>
                </div>
              </div>
            </div>
          </div>

          {/* 현재 단계 오버레이 (모바일) */}
          {isMobile && currentStep && (
            <div className="absolute bottom-4 left-4 right-4 bg-white border border-border rounded-lg shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepStatusColor(currentStepIndex)}`}>
                  {getDirectionIcon(currentStep.direction)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{currentStep.instruction}</p>
                  {currentStep.landmark && (
                    <p className="text-sm text-muted-foreground">{currentStep.landmark}</p>
                  )}
                </div>
                {currentStep.distance > 0 && (
                  <div className="text-right text-sm">
                    <div className="font-medium">{currentStep.distance}m</div>
                    <div className="text-muted-foreground">{Math.ceil(currentStep.duration / 60)}분</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* 단계 리스트 패널 (데스크톱/태블릿) */}
        {!isMobile && (
          <aside className="w-80 bg-card border-l border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-medium">턴-바이-턴 안내</h2>
              <p className="text-sm text-muted-foreground">
                {routeSteps.length}단계 • {Math.ceil(totalDuration / 60)}분 소요
              </p>
            </div>
            
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4 space-y-3">
                {routeSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      index === currentStepIndex 
                        ? 'bg-primary/10 border-primary' 
                        : index < currentStepIndex
                        ? 'bg-success/10 border-success'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStepStatusColor(index)}`}>
                        {index < currentStepIndex ? (
                          <span className="text-xs">✓</span>
                        ) : (
                          getDirectionIcon(step.direction)
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${index === currentStepIndex ? 'text-primary' : ''}`}>
                          {step.instruction}
                        </p>
                        
                        {step.landmark && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.landmark}
                          </p>
                        )}
                        
                        {step.floor && (
                          <Badge variant="outline" className="mt-2">
                            {step.floor}층
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {step.distance > 0 && <span>{step.distance}m</span>}
                          <span>{Math.ceil(step.duration / 60)}분</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* 단계 네비게이션 */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === routeSteps.length - 1}
                  className="flex-1"
                >
                  다음
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* 하단 시트 (모바일) */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <div className="fixed bottom-20 left-4 right-4">
              <Button variant="outline" className="w-full bg-background">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                전체 경로 보기 ({routeSteps.length}단계)
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <SheetHeader>
              <SheetTitle>턴-바이-턴 안내</SheetTitle>
            </SheetHeader>
            
            <ScrollArea className="h-full mt-4">
              <div className="space-y-3 pb-6">
                {routeSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      index === currentStepIndex 
                        ? 'bg-primary/10 border-primary' 
                        : index < currentStepIndex
                        ? 'bg-success/10 border-success'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStepStatusColor(index)}`}>
                        {index < currentStepIndex ? (
                          <span className="text-xs">✓</span>
                        ) : (
                          getDirectionIcon(step.direction)
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${index === currentStepIndex ? 'text-primary' : ''}`}>
                          {step.instruction}
                        </p>
                        
                        {step.landmark && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.landmark}
                          </p>
                        )}
                        
                        {step.floor && (
                          <Badge variant="outline" className="mt-2">
                            {step.floor}층
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {step.distance > 0 && <span>{step.distance}m</span>}
                          <span>{Math.ceil(step.duration / 60)}분</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

export default NavigationPage;