import React from 'react';
import { Clock, MapPin, Users, Star, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export interface POICardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  openHours?: string;
  image?: string;
  rating?: number;
  isOpen?: boolean;
  crowdLevel?: 'low' | 'medium' | 'high';
}

export interface MarketItemProps {
  id: string;
  title: string;
  price: number;
  seller: {
    name: string;
    avatar?: string;
    rating: number;
  };
  image?: string;
  condition: '새상품' | '거의새것' | '사용감있음' | '많은사용';
  createdAt: string;
  isLiked?: boolean;
  category: string;
}

export interface ChatThreadProps {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  participants: number;
  unreadCount?: number;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  isHot?: boolean;
}

export function POICard({ 
  title, 
  category, 
  description, 
  location, 
  openHours, 
  image, 
  rating, 
  isOpen = true,
  crowdLevel = 'medium'
}: POICardProps) {
  const crowdColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const crowdTexts = {
    low: '여유',
    medium: '보통',
    high: '혼잡'
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <img
          src={image || ''}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={isOpen ? "default" : "secondary"} className="text-xs">
            {isOpen ? '운영중' : '운영종료'}
          </Badge>
          <Badge className={`text-xs ${crowdColors[crowdLevel]}`}>
            {crowdTexts[crowdLevel]}
          </Badge>
        </div>
        {rating && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            {rating.toFixed(1)}
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="text-xs mb-2">{category}</Badge>
            <h3 className="font-semibold line-clamp-1">{title}</h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          {openHours && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{openHours}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MarketItemCard({ 
  title, 
  price, 
  seller, 
  image, 
  condition, 
  createdAt, 
  isLiked = false,
  category 
}: MarketItemProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <img
          src={image || ''}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <Badge variant="outline" className="text-xs mb-2">{category}</Badge>
        <h3 className="font-semibold mb-2 line-clamp-1">{title}</h3>
        <p className="text-lg font-bold text-primary mb-2">
          {price.toLocaleString()}원
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={seller.avatar} />
              <AvatarFallback className="text-xs">{seller.name[0]}</AvatarFallback>
            </Avatar>
            <span>{seller.name}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-yellow-400" />
              <span className="text-xs">{seller.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs">{condition}</Badge>
          <span>{createdAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChatThreadCard({ 
  title, 
  lastMessage, 
  lastMessageTime, 
  participants, 
  unreadCount = 0,
  category, 
  author,
  isHot = false 
}: ChatThreadProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">{category}</Badge>
              {isHot && (
                <Badge variant="destructive" className="text-xs">HOT</Badge>
              )}
            </div>
            <h3 className="font-semibold line-clamp-1 mb-1">{title}</h3>
          </div>
          {unreadCount > 0 && (
            <Badge className="ml-2 px-2 py-1 min-w-6 h-6 text-xs flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {lastMessage}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Avatar className="w-4 h-4">
                <AvatarImage src={author.avatar} />
                <AvatarFallback className="text-xs">{author.name[0]}</AvatarFallback>
              </Avatar>
              <span>{author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{participants}</span>
            </div>
          </div>
          <span>{lastMessageTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}