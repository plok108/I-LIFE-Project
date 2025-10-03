import React from 'react';
import { Heart, MapPin, Clock, User, Star, MessageCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
 

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  condition: 'excellent' | 'good' | 'fair';
  category: 'textbook' | 'electronics' | 'clothing' | 'supplies' | 'etc';
  department?: string;
  subject?: string;
  description: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    department: string;
    rating: number;
    isVerified: boolean;
  };
  location: string;
  distance?: number;
  createdAt: string;
  views: number;
  likes: number;
  chatCount: number;
  status: 'available' | 'reserved' | 'sold';
  dealType: 'direct' | 'delivery' | 'both';
  tags: string[];
  isFavorite: boolean;
}

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  onItemClick: (item: MarketplaceItem) => void;
  onToggleFavorite: (item: MarketplaceItem) => void;
  onChatClick: (item: MarketplaceItem) => void;
  className?: string;
}

export function MarketplaceItemCard({ 
  item, 
  onItemClick, 
  onToggleFavorite, 
  onChatClick,
  className 
}: MarketplaceItemCardProps) {
  const [imageErrored, setImageErrored] = React.useState(false);
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
      case 'excellent': return '상';
      case 'good': return '중';
      case 'fair': return '하';
      default: return '-';
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

  const getCategoryEmoji = (category: MarketplaceItem['category']) => {
    switch (category) {
      case 'textbook': return '📚';
      case 'electronics': return '💻';
      case 'clothing': return '👕';
      case 'supplies': return '✏️';
      case 'etc': return '📦';
      default: return '📦';
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

  return (
    <Card className={`group cursor-pointer hover:shadow-md transition-all duration-200 ${className}`}>
      <CardContent className="p-0">
        {/* 이미지 */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {item.images.length > 0 && !imageErrored ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => onItemClick(item)}
              onError={() => setImageErrored(true)}
            />
          ) : (
            <div 
              className="w-full h-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors cursor-pointer"
              onClick={() => onItemClick(item)}
            >
              <div className="text-center">
                <span className="text-4xl mb-2 block">{getCategoryEmoji(item.category)}</span>
                <p className="text-sm text-muted-foreground">이미지 없음</p>
              </div>
            </div>
          )}
          
          {/* 상태 뱃지 */}
          {item.status !== 'available' && (
            <div className="absolute top-2 left-2">
              <Badge className={getStatusColor(item.status)}>
                {getStatusText(item.status)}
              </Badge>
            </div>
          )}
          
          {/* 즐겨찾기 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-1 h-auto bg-white/80 hover:bg-white backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item);
            }}
            aria-label={item.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          >
            <Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </Button>

          {/* 이미지 개수 표시 */}
          {item.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              1/{item.images.length}
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="p-4 space-y-3" onClick={() => onItemClick(item)}>
          {/* 제목 */}
          <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
            {item.title}
          </h3>

          {/* 가격 */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-primary">
              {formatPrice(item.price)}
            </span>
            <Badge variant="outline" className={getConditionColor(item.condition)}>
              {getConditionText(item.condition)}
            </Badge>
          </div>

          {/* 학과/과목 태그 */}
          {(item.department || item.subject) && (
            <div className="flex flex-wrap gap-1">
              {item.department && (
                <Badge variant="secondary" className="text-xs">
                  {item.department}
                </Badge>
              )}
              {item.subject && (
                <Badge variant="outline" className="text-xs">
                  {item.subject}
                </Badge>
              )}
            </div>
          )}

          {/* 위치 및 시간 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{item.location}</span>
              {item.distance && (
                <span>• {item.distance}m</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(item.createdAt)}</span>
            </div>
          </div>

          {/* 판매자 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-primary" />
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">{item.seller.name}</span>
                {item.seller.isVerified && (
                  <span className="ml-1 text-primary">✓</span>
                )}
              </div>
              {item.seller.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span className="text-xs text-muted-foreground">{item.seller.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 상호작용 통계 */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>조회 {item.views}</span>
              <span>관심 {item.likes}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onChatClick(item);
              }}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              채팅 {item.chatCount > 0 && `(${item.chatCount})`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MarketplaceItemCard;