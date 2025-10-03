import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, Upload, X, GripVertical, AlertCircle, Save, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

interface MarketplaceCreatePageProps {
  onBack: () => void;
  onSubmit?: (data: CreateItemData) => void;
  onSaveDraft?: (data: CreateItemData) => void;
  className?: string;
}

interface CreateItemData {
  title: string;
  category: string;
  department: string;
  subject: string;
  description: string;
  price: number;
  condition: 'excellent' | 'good' | 'fair';
  dealType: 'direct' | 'delivery' | 'both';
  images: File[];
  tags: string[];
}

interface ValidationErrors {
  title?: string;
  category?: string;
  price?: string;
  condition?: string;
  description?: string;
  images?: string;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const CATEGORIES = [
  { value: 'textbook', label: '교재/도서', emoji: '📚' },
  { value: 'electronics', label: '전자기기', emoji: '💻' },
  { value: 'clothing', label: '의류', emoji: '👕' },
  { value: 'supplies', label: '학용품', emoji: '✏️' },
  { value: 'etc', label: '기타', emoji: '📦' }
];

const DEPARTMENTS = [
  '컴퓨터정보과', '기계과', '전기과', '전자과', '건축과', '디자인과', '경영과', '항공과'
];

const CONDITIONS = [
  { value: 'excellent', label: '상 (거의 새것)', description: '구매한 지 얼마 안 됐거나 거의 사용하지 않은 상태' },
  { value: 'good', label: '중 (사용감 있음)', description: '사용감은 있지만 기능상 문제없는 상태' },
  { value: 'fair', label: '하 (많이 사용됨)', description: '사용감이 많지만 기능상 문제없는 상태' }
];

const DEAL_TYPES = [
  { value: 'direct', label: '직거래만', description: '캠퍼스 내에서 직접 만나서 거래' },
  { value: 'delivery', label: '택배거래만', description: '택배로만 거래 (별도 택배비)' },
  { value: 'both', label: '직거래/택배', description: '직거래와 택배거래 모두 가능' }
];

export function MarketplaceCreatePage({ onBack, onSubmit, onSaveDraft, className }: MarketplaceCreatePageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateItemData>({
    title: '',
    category: '',
    department: '',
    subject: '',
    description: '',
    price: 0,
    condition: 'good',
    dealType: 'both',
    images: [],
    tags: []
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customTag, setCustomTag] = useState('');

  // 반응형 체크
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 현재 단계에 따른 진행률 계산
  const getProgress = () => {
    return (currentStep / 3) * 100;
  };

  // 폼 데이터 업데이트
  const updateFormData = (field: keyof CreateItemData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 클리어
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // 1단계 검증
  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length < 5) {
      newErrors.title = '제목을 5자 이상 입력해주세요.';
    } else if (formData.title.length > 50) {
      newErrors.title = '제목은 50자를 초과할 수 없습니다.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 2단계 검증
  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = '올바른 가격을 입력해주세요.';
    } else if (formData.price > 10000000) {
      newErrors.price = '가격은 1000만원을 초과할 수 없습니다.';
    }

    if (!formData.condition) {
      newErrors.condition = '상품 상태를 선택해주세요.';
    }

    if (!formData.description.trim()) {
      newErrors.description = '상품 설명을 입력해주세요.';
    } else if (formData.description.length < 10) {
      newErrors.description = '상품 설명을 10자 이상 입력해주세요.';
    } else if (formData.description.length > 1000) {
      newErrors.description = '상품 설명은 1000자를 초과할 수 없습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3단계 검증
  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (uploadedImages.length === 0) {
      newErrors.images = '최소 1장의 사진을 업로드해주세요.';
    } else if (uploadedImages.length > 10) {
      newErrors.images = '최대 10장까지 업로드할 수 있습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 다음 단계로
  const handleNext = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // 이전 단계로
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // 이미지 업로드 처리
  const handleFileUpload = useCallback((files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      // 이미지 파일만 허용
      if (!file.type.startsWith('image/')) {
        return false;
      }
      // 5MB 제한
      if (file.size > 5 * 1024 * 1024) {
        return false;
      }
      return true;
    });

    // 최대 10장 제한
    const remainingSlots = 10 - uploadedImages.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    const newImages: UploadedImage[] = filesToUpload.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    updateFormData('images', [...formData.images, ...filesToUpload]);
  }, [uploadedImages.length, formData.images]);

  // 드래그&드롭 이벤트
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  // 이미지 삭제
  const handleImageDelete = (imageId: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      const newFiles = updated.map(img => img.file);
      updateFormData('images', newFiles);
      return updated;
    });
  };

  // 이미지 순서 변경
  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    setUploadedImages(prev => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      
      const newFiles = updated.map(img => img.file);
      updateFormData('images', newFiles);
      return updated;
    });
  };

  // 태그 추가
  const handleAddTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      const newTags = [...formData.tags, customTag.trim()];
      updateFormData('tags', newTags);
      setCustomTag('');
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = formData.tags.filter(tag => tag !== tagToRemove);
    updateFormData('tags', newTags);
  };

  // 임시저장
  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      setIsSubmitting(true);
      try {
        await onSaveDraft(formData);
        // 성공 피드백
      } catch (error) {
        console.error('임시저장 실패:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 최종 제출
  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        // 성공 시 목록으로 이동
      } catch (error) {
        console.error('등록 실패:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 스텝 헤더 렌더링
  const renderStepHeader = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
            <h1 className="font-medium">물품 등록</h1>
            <p className="text-sm text-muted-foreground">
              {currentStep}/3 단계
            </p>
          </div>
        </div>
      </div>

      {/* 진행률 표시 */}
      <div className="space-y-2">
        <Progress value={getProgress()} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className={currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>
            기본정보
          </span>
          <span className={currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
            가격/상태
          </span>
          <span className={currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
            사진업로드
          </span>
        </div>
      </div>
    </div>
  );

  // 1단계: 기본정보
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4">기본 정보를 입력해주세요</h2>
        
        {/* 제목 */}
        <div className="space-y-2">
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            placeholder="어떤 물품인지 간단히 설명해주세요"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            className={errors.title ? 'border-destructive' : ''}
            maxLength={50}
          />
          <div className="flex justify-between text-sm">
            {errors.title ? (
              <span className="text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </span>
            ) : (
              <span className="text-muted-foreground">예: 컴퓨터프로그래밍 교재 (거의 새것)</span>
            )}
            <span className="text-muted-foreground">{formData.title.length}/50</span>
          </div>
        </div>

        {/* 카테고리 */}
        <div className="space-y-2">
          <Label htmlFor="category">카테고리 *</Label>
          <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
            <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
              <SelectValue placeholder="카테고리를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center gap-2">
                    <span>{category.emoji}</span>
                    {category.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <span className="text-destructive text-sm flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.category}
            </span>
          )}
        </div>

        {/* 학과 */}
        <div className="space-y-2">
          <Label htmlFor="department">학과 (선택)</Label>
          <Select value={formData.department} onValueChange={(value) => updateFormData('department', value)}>
            <SelectTrigger>
              <SelectValue placeholder="학과를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground text-sm">관련 과목이 있는 경우 선택해주세요</span>
        </div>

        {/* 과목 */}
        <div className="space-y-2">
          <Label htmlFor="subject">과목명 (선택)</Label>
          <Input
            id="subject"
            placeholder="관련 과목명이 있다면 입력해주세요"
            value={formData.subject}
            onChange={(e) => updateFormData('subject', e.target.value)}
            maxLength={30}
          />
          <span className="text-muted-foreground text-sm">예: 컴퓨터프로그래밍, 회계원리</span>
        </div>
      </div>
    </div>
  );

  // 2단계: 가격/상태
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4">가격과 상태를 입력해주세요</h2>

        {/* 가격 */}
        <div className="space-y-2">
          <Label htmlFor="price">판매 가격 *</Label>
          <div className="relative">
            <Input
              id="price"
              type="number"
              placeholder="0"
              value={formData.price || ''}
              onChange={(e) => updateFormData('price', parseInt(e.target.value) || 0)}
              className={`pr-12 ${errors.price ? 'border-destructive' : ''}`}
              min={0}
              max={10000000}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">원</span>
          </div>
          {errors.price && (
            <span className="text-destructive text-sm flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.price}
            </span>
          )}
        </div>

        {/* 상품 상태 */}
        <div className="space-y-4">
          <Label>상품 상태 *</Label>
          <RadioGroup
            value={formData.condition}
            onValueChange={(value) => updateFormData('condition', value)}
            className="space-y-3"
          >
            {CONDITIONS.map((condition) => (
              <div key={condition.value} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={condition.value}
                  id={condition.value}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={condition.value}
                    className="font-medium cursor-pointer"
                  >
                    {condition.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {condition.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
          {errors.condition && (
            <span className="text-destructive text-sm flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.condition}
            </span>
          )}
        </div>

        {/* 거래 방식 */}
        <div className="space-y-4">
          <Label>거래 방식</Label>
          <RadioGroup
            value={formData.dealType}
            onValueChange={(value) => updateFormData('dealType', value)}
            className="space-y-3"
          >
            {DEAL_TYPES.map((dealType) => (
              <div key={dealType.value} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={dealType.value}
                  id={dealType.value}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={dealType.value}
                    className="font-medium cursor-pointer"
                  >
                    {dealType.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {dealType.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 상품 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description">상품 설명 *</Label>
          <Textarea
            id="description"
            placeholder="상품의 상태, 구매 시기, 사용 기간 등을 자세히 설명해주세요"
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            className={`min-h-[120px] ${errors.description ? 'border-destructive' : ''}`}
            maxLength={1000}
          />
          <div className="flex justify-between text-sm">
            {errors.description ? (
              <span className="text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </span>
            ) : (
              <span className="text-muted-foreground">자세한 설명일수록 빠른 거래가 가능해요</span>
            )}
            <span className="text-muted-foreground">{formData.description.length}/1000</span>
          </div>
        </div>

        {/* 태그 */}
        <div className="space-y-3">
          <Label htmlFor="tags">태그 (선택)</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="태그를 입력하고 엔터를 누르세요"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              maxLength={20}
            />
            <Button type="button" onClick={handleAddTag} disabled={!customTag.trim()}>
              추가
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`${tag} 태그 삭제`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <span className="text-muted-foreground text-sm">관련 키워드를 태그로 추가하면 검색에 도움됩니다</span>
        </div>
      </div>
    </div>
  );

  // 3단계: 사진 업로드
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4">사진을 업로드해주세요</h2>
        
        {/* 업로드 영역 */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : errors.images 
                ? 'border-destructive bg-destructive/5' 
                : 'border-border hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="space-y-2">
            <p className="font-medium">
              {isDragging ? '이곳에 파일을 놓아주세요' : '사진을 드래그하거나 클릭해서 업로드'}
            </p>
            <p className="text-sm text-muted-foreground">
              최대 10장, 각 파일당 5MB 이하 (JPG, PNG)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {errors.images && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.images}</AlertDescription>
          </Alert>
        )}

        {/* 업로드된 이미지 그리드 */}
        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>업로드된 사진 ({uploadedImages.length}/10)</Label>
              <span className="text-sm text-muted-foreground">드래그해서 순서 변경</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-square bg-muted rounded-lg overflow-hidden group cursor-move"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', index.toString());
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    if (fromIndex !== index) {
                      handleImageReorder(fromIndex, index);
                    }
                  }}
                >
                  <img
                    src={image.preview}
                    alt={`업로드 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* 순서 표시 */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                  
                  {/* 드래그 핸들 */}
                  <div className="absolute top-2 right-8 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-3 w-3" />
                  </div>
                  
                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image.id)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                    aria-label={`이미지 ${index + 1} 삭제`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto py-4">
          {renderStepHeader()}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </CardContent>
        </Card>
      </main>

      {/* 하단 액션 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="container mx-auto py-4">
          <div className="flex items-center gap-3">
            {/* 이전 버튼 */}
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={isSubmitting}
              >
                이전
              </Button>
            )}
            
            {/* 임시저장 버튼 */}
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              임시저장
            </Button>
            
            {/* 다음/등록 버튼 */}
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex-1"
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                등록하기
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 하단 여백 (고정 버튼으로 인한) */}
      <div className="h-20" />
    </div>
  );
}

export default MarketplaceCreatePage;