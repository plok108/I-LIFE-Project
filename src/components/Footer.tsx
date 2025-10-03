import React from 'react';
import { Separator } from './ui/separator';

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "서비스",
      links: [
        { label: "캠퍼스 맵", href: "#" },
        { label: "시간표", href: "#" },
        { label: "학식 메뉴", href: "#" },
        { label: "도서관", href: "#" }
      ]
    },
    {
      title: "커뮤니티",
      links: [
        { label: "자유게시판", href: "#" },
        { label: "중고장터", href: "#" },
        { label: "스터디", href: "#" },
        { label: "동아리", href: "#" }
      ]
    },
    {
      title: "지원",
      links: [
        { label: "공지사항", href: "#" },
        { label: "도움말", href: "#" },
        { label: "문의하기", href: "#" },
        { label: "개인정보처리방침", href: "#" }
      ]
    }
  ];

  return (
    <footer className={`bg-card border-t border-border ${className}`}>
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 로고 및 설명 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">인</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">인하공전</h3>
                <p className="text-xs text-muted-foreground">캠퍼스 라이프</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              인하공업전문대학 학생들을 위한<br />
              통합 캠퍼스 라이프 플랫폼
            </p>
            <div className="text-xs text-muted-foreground">
              <p>인천광역시 미추홀구</p>
              <p>인하로 100</p>
            </div>
          </div>

          {/* 링크 섹션들 */}
          {footerLinks.map((section, index) => (
            <div key={index} className="md:col-span-1">
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* 하단 정보 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted-foreground">
            © {currentYear} 인하공업전문대학. All rights reserved.
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              이용약관
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              쿠키 정책
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}