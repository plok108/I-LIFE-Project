import React from 'react';
import { Separator } from './ui/separator';

interface LandingFooterProps {
  className?: string;
}

export function LandingFooter({ className = "" }: LandingFooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: '문의하기', href: '#contact' },
    { label: '개인정보처리방침', href: '#privacy' },
    { label: '이용약관', href: '#terms' }
  ];

  return (
    <footer className={`bg-muted border-t border-border ${className}`}>
      <div className="container mx-auto py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">인</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">인하공전 캠퍼스 라이프</h3>
                <p className="text-xs text-muted-foreground">QR로 접속하는 스마트 캠퍼스</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              설치 없이 QR 코드 하나로<br />
              캠퍼스의 모든 것을 경험하세요
            </p>
            <div className="text-xs text-muted-foreground">
              <p>인하공업전문대학</p>
              <p>인천광역시 미추홀구 인하로 100</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">바로가기</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#navigation"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                >
                  캠퍼스 길찾기
                </a>
              </li>
              <li>
                <a
                  href="#marketplace"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                >
                  중고장터
                </a>
              </li>
              <li>
                <a
                  href="#notices"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                >
                  공지사항
                </a>
              </li>
            </ul>
          </div>

          {/* Contact and Version */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">지원</h4>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                버전 2.0.1
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                최근 업데이트: 2024.12.20
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted-foreground">
            © {currentYear} 인하공업전문대학. All rights reserved.
          </div>
          <div className="text-xs text-muted-foreground">
            Made with ❤️ for 인하공전 학생들
          </div>
        </div>
      </div>
    </footer>
  );
}