// src/api/auth.js

// 🔧 .env 환경변수
// REACT_APP_API_BASE=http://localhost:8080
// REACT_APP_USE_MOCK=false

const BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";
const USE_MOCK = false; // 임시로 false로 설정

// 🧩 테스트용 더미 유저
const MOCK_USER = {
  id: 202244083,
  uid: "202244083",
  username: "이승종",
  email: "00@00.com",
  nickname: "test",
  phone: "010-0000-0000",
  status: "ACTIVE",
  role: "ADMIN",
};

/**
 * 공통 요청 함수
 */
async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include", // 쿠키 기반 세션 유지 (Spring Boot와 연동 시 필요)
    headers: { "Content-Type": "application/json" },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text();
    let errorMessage = `HTTP ${res.status}: ${text}`;

    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // JSON 파싱 실패 시 기본 메시지 사용
    }

    throw new Error(errorMessage);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return null;
}

/**
 * 현재 로그인된 유저 가져오기
 */
export async function getCurrentUser() {
  console.log("getCurrentUser 호출됨");
  console.log("getCurrentUser - USE_MOCK:", USE_MOCK);

  if (USE_MOCK) {
    try {
      const raw = localStorage.getItem("mock_user");
      console.log("getCurrentUser - USE_MOCK, mock_user:", raw);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("getCurrentUser - USE_MOCK 에러:", e);
      return null;
    }
  }

  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    console.log("getCurrentUser - token:", token);
    console.log("getCurrentUser - userStr:", userStr);

    if (token && userStr) {
      const user = JSON.parse(userStr);
      console.log("getCurrentUser - parsed user:", user);
      return user;
    }
    console.log("getCurrentUser - no token or user");
    return null;
  } catch (e) {
    console.error("getCurrentUser error:", e);
    return null;
  }
}

/**
 * 로그아웃
 */
export async function logout() {
  if (USE_MOCK) {
    localStorage.removeItem("mock_user");
    console.log("🚪 더미 사용자 로그아웃 완료");
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/**
 * 일반 로그인
 * credentials: { usernameOrEmail, password }
 */
export async function login(credentials) {
  if (USE_MOCK) {
    const idStr = String(credentials.id);
    const pwStr = String(credentials.password);

    // 간단한 Mock 인증 로직
    if (
      (idStr === String(MOCK_USER.id) || idStr === MOCK_USER.username) &&
      pwStr === "202244083"
    ) {
      localStorage.setItem("mock_user", JSON.stringify(MOCK_USER));
      console.log("✅ 더미 로그인 성공:", MOCK_USER);
      return MOCK_USER;
    }

    const err = new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    err.status = 401;
    throw err;
  }

  // 실제 백엔드 로그인 API 호출
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      usernameOrEmail: credentials.usernameOrEmail || credentials.id,
      password: credentials.password,
    }),
  });

  // 성공 시 토큰/유저 로컬 저장 (초기 로딩 및 새로고침 유지)
  try {
    if (data && data.token) localStorage.setItem("token", data.token);
    if (data && data.user) localStorage.setItem("user", JSON.stringify(data.user));
  } catch (e) {
    console.warn("로컬 저장 실패:", e);
  }

  return data.user;
}

/**
 * 회원가입
 * user = { username, password, name, email, phone }
 */
export async function register(user) {
  if (USE_MOCK) {
    const mockRegistered = { ...user, uid: String(user.id) };
    localStorage.setItem("mock_user", JSON.stringify(mockRegistered));
    console.log("✅ 더미 회원가입 완료:", mockRegistered);
    return mockRegistered;
  }

  const data = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });

  return data.user;
}

// 기본 export
const api = { getCurrentUser, login, register, logout };
export default api;
