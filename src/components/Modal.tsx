import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children?: React.ReactNode;
}

interface ConfirmModalProps extends BaseModalProps {
  type: 'confirm';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

interface PhotoPreviewModalProps extends BaseModalProps {
  type: 'photo';
  imageUrl: string;
  imageAlt?: string;
}

interface ReportModalProps extends BaseModalProps {
  type: 'report';
  onSubmit: (reason: string, details: string) => void;
}

type ModalProps = ConfirmModalProps | PhotoPreviewModalProps | ReportModalProps;

export function Modal(props: ModalProps) {
  const { isOpen, onClose, title, description, size = 'md' } = props;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] max-h-[90vh]'
  };

  const renderContent = () => {
    switch (props.type) {
      case 'confirm':
        return (
          <ConfirmModalContent 
            {...props} 
            onClose={onClose}
          />
        );
      case 'photo':
        return (
          <PhotoPreviewContent 
            {...props} 
            onClose={onClose}
          />
        );
      case 'report':
        return (
          <ReportModalContent 
            {...props} 
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[size]} p-0 overflow-hidden`}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

function ConfirmModalContent({ 
  title = "확인", 
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onClose,
  variant = 'default',
  children
}: ConfirmModalProps & { onClose: () => void }) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <DialogHeader className="p-6 pb-4">
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      
      {children && (
        <div className="px-6 pb-4">
          {children}
        </div>
      )}
      
      <DialogFooter className="p-6 pt-4 border-t border-border">
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}

function PhotoPreviewContent({ 
  imageUrl, 
  imageAlt = "이미지 미리보기",
  onClose,
  title
}: PhotoPreviewModalProps & { onClose: () => void }) {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          className="rounded-full p-2 h-auto bg-black/20 hover:bg-black/40 border-0"
        >
          <X className="w-4 h-4 text-white" />
        </Button>
      </div>
      
      <div className="bg-black">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      </div>
      
      {title && (
        <div className="p-4 bg-card border-t border-border">
          <p className="text-sm font-medium text-foreground">{title}</p>
        </div>
      )}
    </div>
  );
}

function ReportModalContent({ 
  title = "신고하기",
  onSubmit,
  onClose
}: ReportModalProps & { onClose: () => void }) {
  const [reason, setReason] = React.useState('');
  const [details, setDetails] = React.useState('');

  const reportReasons = [
    '스팸/광고',
    '욕설/비방',
    '음란물',
    '사기/피싱',
    '개인정보 노출',
    '기타'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason) {
      onSubmit(reason, details);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader className="p-6 pb-4">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          부적절한 콘텐츠를 신고해주세요. 검토 후 적절한 조치를 취하겠습니다.
        </DialogDescription>
      </DialogHeader>
      
      <div className="px-6 pb-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">신고 사유</label>
          <div className="grid grid-cols-2 gap-2">
            {reportReasons.map((reportReason) => (
              <label
                key={reportReason}
                className="flex items-center space-x-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
              >
                <input
                  type="radio"
                  name="reason"
                  value={reportReason}
                  checked={reason === reportReason}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm">{reportReason}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            상세 내용 (선택사항)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="신고 사유에 대한 추가 설명을 입력해주세요..."
            className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
          />
        </div>
      </div>
      
      <DialogFooter className="p-6 pt-4 border-t border-border">
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" variant="destructive" disabled={!reason}>
            신고하기
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}