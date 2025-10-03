import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, MapPin, Clock, User, Star, ShieldCheck, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { MarketplaceItem } from './MarketplaceItem';

interface MarketplaceItemDetailProps {
  item: MarketplaceItem;
  onBack: () => void;
  onToggleFavorite: (item: MarketplaceItem) => void;
  onChatClick: (item: MarketplaceItem) => void;
  onShare?: (item: MarketplaceItem) => void;
  className?: string;
}

interface PriceHistory {
  id: string;
  price: number;
  date: string;
  type: 'increase' | 'decrease' | 'initial';
}

// 모의 가격 변경 이력 데이터
const MOCK_PRICE_HISTORY: Record<string, PriceHistory[]> = {
  '1': [
    { id: '1-1', price: 30000, date: '2024-03-10T10:00:00Z', type: 'initial' },
    { id: '1-2', price: 25000, date: '2024-03-12T15:30:00Z', type: 'decrease' }
  ],
  '2': [
    { id: '2-1', price: 850000, date: '2024-03-08T09:00:00Z', type: 'initial' },
    { id: '2-2', price: 800000, date: '2024-03-10T14:20:00Z', type: 'decrease' },
    { id: '2-3', price: 780000, date: '2024-03-13T11:45:00Z', type: 'decrease' }
  ]
};

export function MarketplaceItemDetail({ 
  item, 
  onBack, 
  onToggleFavorite, 
  onChatClick, 
  onShare,
  className 
}: MarketplaceItemDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageErrored, setImageErrored] = useState(false);

  // 반응형 체크
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setImageErrored(false);
  }, [currentImageIndex]);

  const getConditionColor = (condition: MarketplaceItem['condition']) => {
    switch (condition) {
      case 'excellent': return 'bg-success/10 text-success border-success/20';
      case 'good': return 'bg-warning/10 text-warning border-warning/20';
      case 'fair': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConditionText = (condition: MarketplaceItem['condition']) => {
    switch (condition) {
      case 'excellent': return '상 (거의 새것)';
      case 'good': return '중 (사용감 있음)';
      case 'fair': return '하 (많이 사용됨)';
      default: return '';
    }
  };

  const getStatusColor = (status: MarketplaceItem['status']) => {
    switch (status) {
      case 'available': return 'bg-success/10 text-success border-success/20';
      case 'reserved': return 'bg-warning/10 text-warning border-warning/20';
      case 'sold': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status: MarketplaceItem['status']) => {
    switch (status) {
      case 'available': return '판매중';
      case 'reserved': return '예약중';
      case 'sold': return '판매완료';
      default: return '';
    }
  };

  const getDealTypeText = (dealType: MarketplaceItem['dealType']) => {
    switch (dealType) {
      case 'direct': return '직거래만';
      case 'delivery': return '택배거래만';
      case 'both': return '직거래/택배';
      default: return '';
    }
  };

  const getCategoryText = (category: MarketplaceItem['category']) => {
    switch (category) {
      case 'textbook': return '교재/도서';
      case 'electronics': return '전자기기';
      case 'clothing': return '의류';
      case 'supplies': return '학용품';
      case 'etc': return '기타';
      default: return '';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  const formatStudentId = (sellerId: string) => {
    // 학번을 일부만 표시 (예: 202312*** 형태)
    return `202312***`;
  };

  const priceHistory = MOCK_PRICE_HISTORY[item.id] || [];
  const hasMultipleImages = item.images.length > 1;

  const handleShare = () => {
    if (onShare) {
      onShare(item);
    } else {
      // 기본 공유 기능
      if (navigator.share) {
        navigator.share({
          title: item.title,
          text: `${item.title} - ${formatPrice(item.price)}`,
          url: window.location.href
        });
      } else {
        // 폴백: 클립보드에 복사
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  const PriceHistoryContent = () => (
    <div className="space-y-4">
      <h3 className="font-medium">가격 변경 이력</h3>
      <div className="space-y-3">
        {priceHistory.map((price, index) => (
          <div key={price.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-full ${
                price.type === 'decrease' ? 'bg-success/10' : 
                price.type === 'increase' ? 'bg-destructive/10' : 'bg-muted'
              }`}>
                {price.type === 'decrease' && <TrendingDown className="h-3 w-3 text-success" />}
                {price.type === 'increase' && <TrendingUp className="h-3 w-3 text-destructive" />}
                {price.type === 'initial' && <div className="h-3 w-3 bg-muted-foreground rounded-full" />}
              </div>
              <div>
                <p className="font-medium">{formatPrice(price.price)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatTimeAgo(price.date)}
                </p>
              </div>
            </div>
            {index === 0 && (
              <Badge variant="outline" className="text-xs">
                현재 가격
              </Badge>
            )}
          </div>
        ))}
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
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-sm text-muted-foreground">상품 상세</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2"
                aria-label="공유하기"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto py-0">
        <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}`}>
          {/* 이미지 및 기본 정보 */}
          <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-6`}>
            {/* 이미지 캐러셀 */}
            <div className="relative">
              {item.images.length > 0 && !imageErrored ? (
                <div className="relative">
                  <div className="aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={item.images[currentImageIndex]}
                      alt={`${item.title} - 이미지 ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => setImageErrored(true)}
                    />
                  </div>
                  
                  {/* 이미지 네비게이션 */}
                  {hasMultipleImages && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                        onClick={() => setCurrentImageIndex(prev => 
                          prev > 0 ? prev - 1 : item.images.length - 1
                        )}
                        aria-label="이전 이미지"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                        onClick={() => setCurrentImageIndex(prev => 
                          prev < item.images.length - 1 ? prev + 1 : 0
                        )}
                        aria-label="다음 이미지"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      {/* 이미지 인디케이터 */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        {item.images.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                            aria-label={`이미지 ${index + 1}로 이동`}
                          />
                        ))}
                      </div>
                      
                      {/* 이미지 카운터 */}
                      <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-2 py-1 rounded">
                        {currentImageIndex + 1}/{item.images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-muted-foreground">이미지가 없습니다</p>
                  </div>
                </div>
              )}

              {/* 상태 뱃지 */}
              {item.status !== 'available' && (
                <div className="absolute top-4 left-4">
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusText(item.status)}
                  </Badge>
                </div>
              )}
            </div>

            {/* 상품 기본 정보 */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-medium mb-2">{item.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">
                    {getCategoryText(item.category)}
                  </Badge>
                  {item.department && (
                    <Badge variant="secondary">
                      {item.department}
                    </Badge>
                  )}
                  {item.subject && (
                    <Badge variant="outline">
                      {item.subject}
                    </Badge>
                  )}
                </div>
              </div>

              {/* 가격 및 상태 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-medium text-primary">
                    {formatPrice(item.price)}
                  </span>
                  {priceHistory.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPriceHistory(true)}
                      className="text-xs text-muted-foreground"
                    >
                      가격변경 {priceHistory.length}회
                    </Button>
                  )}
                </div>
                <Badge variant="outline" className={getConditionColor(item.condition)}>
                  {getConditionText(item.condition)}
                </Badge>
              </div>

              {/* 거래 정보 */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                  {item.distance && (
                    <span>• {item.distance}m</span>
                  )}
                </div>
                <span>•</span>
                <span>{getDealTypeText(item.dealType)}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeAgo(item.createdAt)}</span>
                </div>
              </div>

              {/* 설명 */}
              <div>
                <h3 className="font-medium mb-2">상품 설명</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* 태그 */}
              {item.tags.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">관련 태그</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 조회/관심 통계 */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>조회 {item.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>관심 {item.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>채팅 {item.chatCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 판매자 정보 (사이드바) */}
          <div className={`${isMobile ? '' : 'lg:col-span-1'}`}>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                {/* 판매자 프로필 */}
                <div>
                  <h3 className="font-medium mb-4">판매자 정보</h3>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {item.seller.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{item.seller.name}</span>
                        {item.seller.isVerified && (
                          <ShieldCheck className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.seller.department} • {formatStudentId(item.seller.id)}
                      </p>
                      {item.seller.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span className="text-sm text-muted-foreground">
                            {item.seller.rating.toFixed(1)} (거래후기 기준)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 신뢰도 정보 */}
                <div>
                  <h4 className="font-medium mb-3">신뢰도</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">학교 인증</span>
                      <Badge variant={item.seller.isVerified ? 'default' : 'outline'} className="text-xs">
                        {item.seller.isVerified ? '인증됨' : '미인증'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">거래 평점</span>
                      <span className="font-medium">
                        {item.seller.rating > 0 ? `${item.seller.rating.toFixed(1)}/5.0` : '평가 없음'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 고정 CTA (하단) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="container mx-auto py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onToggleFavorite(item)}
              className="flex-shrink-0"
              aria-label={item.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            >
              <Heart className={`h-5 w-5 ${item.isFavorite ? 'fill-primary text-primary' : ''}`} />
            </Button>
            <Button
              size="lg"
              onClick={() => onChatClick(item)}
              disabled={item.status === 'sold'}
              className="flex-1"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {item.status === 'sold' ? '판매완료' : '채팅하기'}
            </Button>
          </div>
        </div>
      </div>

      {/* 가격 이력 다이얼로그/시트 */}
      {priceHistory.length > 1 && (
        <>
          {isMobile ? (
            <Sheet open={showPriceHistory} onOpenChange={setShowPriceHistory}>
              <SheetContent side="bottom" className="h-[60vh]">
                <SheetHeader>
                  <SheetTitle>가격 변경 이력</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <PriceHistoryContent />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Dialog open={showPriceHistory} onOpenChange={setShowPriceHistory}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>가격 변경 이력</DialogTitle>
                </DialogHeader>
                <PriceHistoryContent />
              </DialogContent>
            </Dialog>
          )}
        </>
      )}

      {/* 하단 여백 (고정 CTA로 인한) */}
      <div className="h-20" />
    </div>
  );
}

export default MarketplaceItemDetail;