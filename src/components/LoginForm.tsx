import React, { useState, useRef } from "react";
import {
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

interface LoginFormProps {
  onLogin?: (email: string) => Promise<void>;
  className?: string;
}

type FormState = "idle" | "loading" | "success" | "error";

interface FormErrors {
  email?: string;
  terms?: string;
  general?: string;
}

export function LoginForm({
  onLogin,
  className = "",
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  const emailInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const schoolDomains = [
      "inha.ac.kr",
      "itc.ac.kr",
      "student.inha.ac.kr",
    ];

    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "이메일을 입력해주세요.",
      }));
      return false;
    }

    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      return false;
    }

    const domain = email.split("@")[1];
    if (!schoolDomains.includes(domain)) {
      setErrors((prev) => ({
        ...prev,
        email:
          "인하공전 이메일 주소만 사용할 수 있습니다. (@inha.ac.kr, @itc.ac.kr, @student.inha.ac.kr)",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, email: undefined }));
    return true;
  };

  const validateTerms = (): boolean => {
    if (!agreedToTerms || !agreedToPrivacy) {
      setErrors((prev) => ({
        ...prev,
        terms: "이용약관과 개인정보처리방침에 동의해주세요.",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, terms: undefined }));
    return true;
  };

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setEmail(value);

    // 실시간 검증
    if (value && errors.email) {
      validateEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 검증
    const isEmailValid = validateEmail(email);
    const areTermsValid = validateTerms();

    if (!isEmailValid || !areTermsValid) {
      // 첫 번째 에러 필드로 포커스 이동
      if (!isEmailValid) {
        emailInputRef.current?.focus();
      }
      return;
    }

    setFormState("loading");
    setErrors({});

    try {
      // 실제 로그인 로직이 있다면 여기서 호출
      if (onLogin) {
        await onLogin(email);
      } else {
        // 모의 로그인 - 2초 후 성공
        await new Promise((resolve) =>
          setTimeout(resolve, 2000),
        );

        // 30% 확률로 에러 시뮬레이션
        if (Math.random() < 0.3) {
          throw new Error(
            "인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.",
          );
        }
      }

      setFormState("success");
    } catch (error) {
      setFormState("error");
      setErrors((prev) => ({
        ...prev,
        general:
          error instanceof Error
            ? error.message
            : "로그인 처리 중 문제가 발생했습니다.",
      }));

      // 에러 메시지에 포커스 이동 (스크린 리더를 위해)
      setTimeout(() => {
        errorRef.current?.focus();
      }, 100);
    }
  };

  const handleRetry = () => {
    setFormState("idle");
    setErrors({});
    emailInputRef.current?.focus();
  };

  const isLoading = formState === "loading";
  const isSuccess = formState === "success";
  const hasError = formState === "error";

  if (isSuccess) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-secondary" />
            </div>
            <CardTitle className="mb-2">
              인증 메일 발송 완료
            </CardTitle>
            <CardDescription className="mb-6">
              <strong>{email}</strong>로<br />
              인증 메일이 발송되었습니다.
              <br />
              메일함을 확인하고 인증을 완료해주세요.
            </CardDescription>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={handleRetry}
                className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                다른 이메일로 로그인
              </Button>
              <p className="text-xs text-muted-foreground">
                메일이 오지 않나요? 스팸함도 확인해보세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <CardTitle>학교 이메일로 로그인</CardTitle>
        <CardDescription>
          인하공전 이메일 주소로 간편하게 로그인하세요.
          <br />
          인증 메일을 보내드립니다.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* 일반 에러 메시지 */}
        {hasError && errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription
              ref={errorRef}
              tabIndex={-1}
              aria-live="polite"
              aria-atomic="true"
            >
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이메일 입력 */}
          <div className="space-y-2">
            <Label htmlFor="email">이메일 주소</Label>
            <div className="relative">
              <Input
                id="email"
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@inha.ac.kr"
                disabled={isLoading}
                className={`pr-10 ${errors.email ? "border-destructive focus:border-destructive" : ""}`}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "email-error" : undefined
                }
                autoComplete="email"
                required
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {errors.email && (
              <p
                id="email-error"
                className="text-sm text-destructive flex items-center gap-1"
                aria-live="polite"
              >
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              @inha.ac.kr, @itc.ac.kr, @student.inha.ac.kr
              도메인만 사용 가능
            </p>
          </div>

          {/* 약관 동의 */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                  disabled={isLoading}
                  aria-describedby={
                    errors.terms ? "terms-error" : undefined
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm cursor-pointer"
                  >
                    <a
                      href="#terms"
                      className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      이용약관
                    </a>
                    에 동의합니다{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={setAgreedToPrivacy}
                  disabled={isLoading}
                  aria-describedby={
                    errors.terms ? "terms-error" : undefined
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="privacy"
                    className="text-sm cursor-pointer"
                  >
                    <a
                      href="#privacy"
                      className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      개인정보처리방침
                    </a>
                    에 동의합니다{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                </div>
              </div>
            </div>

            {errors.terms && (
              <p
                id="terms-error"
                className="text-sm text-destructive flex items-center gap-1"
                aria-live="polite"
              >
                <AlertCircle className="w-3 h-3" />
                {errors.terms}
              </p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                인증 메일 발송 중...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                학교 이메일 로그인
              </>
            )}
          </Button>

          {/* 추가 안내 */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              처음 이용하시나요? 이메일 인증 후 자동으로
              회원가입됩니다.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}