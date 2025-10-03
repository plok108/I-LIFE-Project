import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, Car, Wifi, Users, Clock, MapPin, Flag, Heart, Share2, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { POI } from './POICard';

interface POIDetailPageProps {
  poi: POI;
  onBack: () => void;
  onNavigate: (poi: POI) => void;
  onToggleFavorite: (poi: POI) => void;
  className?: string;
}

interface POIImage {
  id: string;
  url: string;
  alt: string;
  type: 'entrance' | 'interior' | 'exterior';
}

// 모의 POI 상세 데이터
const getMockPOIDetails = (poi: POI) => ({
  ...poi,
  code: poi.id === '1' ? 'ADM001' : poi.id === '2' ? 'LEC002' : poi.id === '3' ? 'CAF003' : `BLD${poi.id.padStart(3, '0')}`,
  fullDescription: poi.id === '1' 
    ? '인하공업전문대학의 본관으로 행정실, 학과사무실, 교수연구실이 위치해 있습니다. 신입생 등록부터 졸업까지 대부분의 행정업무를 처리할 수 있습니다.'
    : poi.id === '2'
    ? '주요 강의실과 컴퓨터실이 위치한 강의동입니다. 프로그래밍 실습실과 각종 전공 강의실을 운영하고 있습니다.'
    : poi.description,
  entranceDescription: poi.id === '1' 
    ? '정문에서 직진 100m, 좌측에 위치한 5층 건물입니다. 엘리베이터는 1층 로비 우측에 있습니다.'
    : '캠퍼스 중앙 광장에서 도보 2분 거리에 위치합니다.',
  operatingHours: poi.category === 'convenience' 
    ? { 
        weekday: '07:00 - 23:00', 
        weekend: '08:00 - 22:00',
        holiday: '09:00 - 21:00'
      }
    : poi.category === 'admin'
    ? {
        weekday: '09:00 - 18:00',
        weekend: '휴무',
        holiday: '휴무'
      }
    : undefined,
  floor: poi.id === '1' ? '1-5층' : poi.id === '2' ? '1-4층' : undefined,
  contactPhone: poi.category === 'admin' ? '032-870-2114' : undefined,
  hasRestroom: true,
  hasRamp: poi.isAccessible,
  hasPrinter: poi.category === 'admin' || poi.category === 'lecture',
  images: [] as POIImage[], // 실제 구현에서는 이미지 데이터
  userReports: [
    { id: '1', type: 'info', content: '엘리베이터 공사로 인해 일시 사용 중단됩니다.', date: '2024-03-15', status: 'verified' },
    { id: '2', type: 'improvement', content: '출입구에 경사로가 추가되었습니다.', date: '2024-03-10', status: 'resolved' }
  ]
});

export function POIDetailPage({ poi, onBack, onNavigate, onToggleFavorite, className }: POIDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportType, setReportType] = useState<'info' | 'issue' | 'improvement'>('info');

  const poiDetails = getMockPOIDetails(poi);
  const placeholderImages = [
    { id: '1', url: '', alt: `${poi.name} 정면 입구`, type: 'entrance' as const },
    { id: '2', url: '', alt: `${poi.name} 내부`, type: 'interior' as const },
    { id: '3', url: '', alt: `${poi.name} 외부`, type: 'exterior' as const }
  ];

  const handleSubmitReport = () => {
    // 실제 구현에서는 서버에 제보 전송
    console.log('제보 제출:', { type: reportType, content: reportContent, poiId: poi.id });
    setShowReportDialog(false);
    setReportContent('');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poi.name,
          text: `${poi.name} - ${poi.description}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('공유 취소됨');
      }
    } else {
      // 폴백: URL 복사
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'admin': return '🏢';
      case 'lecture': return '📚';
      case 'convenience': return '🏪';
      case 'elevator': return '🛗';
      default: return '📍';
    }
  };

  const getStatusColor = (isOpen: boolean) => {
    return isOpen ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground';
  };

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
              
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label={poi.category}>
                  {getCategoryIcon(poi.category)}
                </span>
                <div>
                  <h1 className="text-xl font-medium">{poi.name}</h1>
                  <p className="text-sm text-muted-foreground">건물코드: {poiDetails.code}</p>
                </div>
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
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(poi)}
                className="p-2"
                aria-label={poi.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              >
                <Heart className={`h-5 w-5 ${poi.isFavorite ? 'fill-primary text-primary' : ''}`} />
              </Button>
            </div>
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap items-center gap-2 pb-4">
            <Badge variant={poi.isOpen ? "default" : "secondary"} className={getStatusColor(poi.isOpen || false)}>
              {poi.isOpen ? '운영 중' : '운영 종료'}
            </Badge>
            
            {poi.hasElevator && (
              <Badge variant="outline" className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                엘리베이터
              </Badge>
            )}
            
            {poiDetails.hasRestroom && (
              <Badge variant="outline">화장실</Badge>
            )}
            
            {poiDetails.hasRamp && (
              <Badge variant="outline">경사로</Badge>
            )}
            
            {poi.hasWifi && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                Wi-Fi
              </Badge>
            )}

            {poi.hasParking && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Car className="h-3 w-3" />
                주차 가능
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 space-y-6">
        {/* 이미지 캐러셀 */}
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {placeholderImages.length > 0 ? (
                <>
                  <img
                    src={placeholderImages[currentImageIndex]?.url || ''}
                    alt={placeholderImages[currentImageIndex]?.alt || ''}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* 이미지 인디케이터 */}
                  {placeholderImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {placeholderImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                          aria-label={`이미지 ${index + 1}번 보기`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p>등록된 사진이 없습니다</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{poiDetails.fullDescription}</p>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">입구 위치</h4>
                <p className="text-sm text-muted-foreground">{poiDetails.entranceDescription}</p>
              </div>
              
              {poiDetails.floor && (
                <div>
                  <h4 className="font-medium mb-2">층수</h4>
                  <p className="text-sm text-muted-foreground">{poiDetails.floor}</p>
                </div>
              )}
              
              {poi.distance && (
                <div>
                  <h4 className="font-medium mb-2">현재 위치에서</h4>
                  <p className="text-sm text-muted-foreground">{poi.distance}m (도보 {Math.ceil(poi.distance / 80)}분)</p>
                </div>
              )}
              
              {poiDetails.contactPhone && (
                <div>
                  <h4 className="font-medium mb-2">전화번호</h4>
                  <p className="text-sm text-muted-foreground">{poiDetails.contactPhone}</p>
                </div>
              )}
            </div>

            {/* 운영 시간 */}
            {poiDetails.operatingHours && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    운영 시간
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">평일</span>
                      <span>{poiDetails.operatingHours.weekday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">주말</span>
                      <span>{poiDetails.operatingHours.weekend}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">공휴일</span>
                      <span>{poiDetails.operatingHours.holiday}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 편의시설 */}
            <Separator />
            <div>
              <h4 className="font-medium mb-3">편의시설</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4" />
                  <span className={poi.hasElevator ? '' : 'text-muted-foreground line-through'}>
                    엘리베이터
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className={poiDetails.hasRestroom ? '' : 'text-muted-foreground line-through'}>
                    화장실
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  <span className={poi.hasWifi ? '' : 'text-muted-foreground line-through'}>
                    Wi-Fi
                  </span>
                </div>
                {poiDetails.hasPrinter && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🖨️</span>
                    <span>프린터</span>
                  </div>
                )}
                {poi.hasParking && (
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>주차장</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-lg">♿</span>
                  <span className={poi.isAccessible ? '' : 'text-muted-foreground line-through'}>
                    접근성
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 사용자 제보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                정보 제보
              </span>
              
              <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    제보하기
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{poi.name} 정보 제보</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">제보 유형</label>
                      <div className="flex gap-2">
                        {[
                          { value: 'info', label: '정보' },
                          { value: 'issue', label: '문제' },
                          { value: 'improvement', label: '개선' }
                        ].map((type) => (
                          <Button
                            key={type.value}
                            variant={reportType === type.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setReportType(type.value as any)}
                          >
                            {type.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">내용</label>
                      <Textarea
                        value={reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        placeholder="제보할 내용을 입력해주세요..."
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                      취소
                    </Button>
                    <Button onClick={handleSubmitReport} disabled={!reportContent.trim()}>
                      제보하기
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              건물 정보, 시설 현황, 접근성 등에 대한 정보를 제보해주세요.
            </p>
            
            {poiDetails.userReports.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">최근 제보</h4>
                {poiDetails.userReports.slice(0, 2).map((report) => (
                  <div key={report.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {report.type === 'info' ? '정보' : report.type === 'issue' ? '문제' : '개선'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{report.date}</span>
                    </div>
                    <p className="text-sm">{report.content}</p>
                    {report.status === 'verified' && (
                      <Badge variant="default" className="mt-2 text-xs">확인됨</Badge>
                    )}
                    {report.status === 'resolved' && (
                      <Badge variant="default" className="mt-2 text-xs bg-success text-white">해결됨</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* 고정 CTA 버튼 */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <div className="container mx-auto">
          <Button 
            onClick={() => onNavigate(poi)}
            className="w-full"
            size="lg"
          >
            <Navigation className="h-5 w-5 mr-2" />
            여기로 길찾기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default POIDetailPage;