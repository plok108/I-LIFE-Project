// src/api/products.js

// 백엔드 서버 루트 (스프링 부트 주소)
const BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

// mock 모드는 지금 안 쓸 거라 false 유지
const USE_MOCK = false;

/**
 * 공통 요청 함수
 * method: "GET" | "POST" | "PUT" | "DELETE"
 * path:   "/api/market", "/api/market/3" 이런 형태
 * body:   JS 객체 (자동으로 JSON.stringify 해서 보냄)
 */
async function request(method, path, body) {
  const url = `${BASE}${path}`;

  const options = {
    method,
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  if (body !== undefined && body !== null) {
    options.body = JSON.stringify(body);
  }

  // 실제 요청
  const res = await fetch(url, options);

  // 성공/에러 모두에서 내용을 보고 싶으니까 text()로 먼저 읽는다
  const text = await res.text();

  if (!res.ok) {
    // 4xx / 5xx일 때 에러 throw -> 호출한 쪽에서 catch 가능
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  // 응답이 빈 경우 (204 등)
  if (!text) return null;

  // JSON 시도
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * 전체 게시글 목록 조회
 * GET /api/market
 *
 * 기대 응답: MarketPost[] (백엔드 엔티티 그대로 내려옴)
 * 각 MarketPost는 대략 이런 모양:
 * {
 *   id: number,
 *   type: "SELL" | "BUY",
 *   title: string,
 *   description: string,
 *   priceKrw: number,
 *   category: string,
 *   status: "ACTIVE" | "SUSPENDED" | "DELETED",
 *   authorId: number,
 *   createdAt: "2025-10-28T14:35:46.032+09:00",
 *   updatedAt: "...",
 *   images: [
 *     { id, post: {...}, url, isPrimary, createdAt },
 *     ...
 *   ]
 * }
 */
export async function getProducts() {
  if (USE_MOCK) {
    return [];
  }
  return request("GET", "/api/market", null);
}

/**
 * 게시글 단건 조회
 * GET /api/market/{id}
 *
 * 기대 응답: MarketPost (위와 동일 구조 한 개)
 */
export async function getProduct(id) {
  if (USE_MOCK) {
    return null;
  }
  return request("GET", `/api/market/${encodeURIComponent(id)}`, null);
}

/**
 * 게시글 등록
 * POST /api/market
 *
 * 백엔드에서 받는 DTO(CreateMarketPostRequest)는 현재 이렇게 맞춰놨다:
 *
 * {
 *   "type": "SELL" | "BUY",        // 게시글 종류 (판매 / 구해요)
 *   "title": string,               // 제목
 *   "description": string,         // 상세 설명
 *   "priceKrw": number,            // 가격(원). 구해요 글이면 0 같은 값 가능
 *   "category": string,            // 카테고리 텍스트
 *   "authorId": number,            // 작성자 ID
 *   "status": "ACTIVE" | "SUSPENDED" | "DELETED" (옵션, 없으면 서버에서 ACTIVE 기본)
 * }
 *
 * MarketWrite.jsx에서 payload를 이 형태로 만들어서 넘겨주면 된다.
 */
export async function addProduct(payload) {
  console.log("addProduct payload >>>", payload);

  if (USE_MOCK) {
    return { mock: true };
  }

  return request("POST", "/api/market", payload);
}

/**
 * 게시글 수정
 * PUT /api/market/{id}
 *
 * 서버 쪽 updatePost(@PutMapping("/{id}"))는
 * - type (SELL/BUY) 수정 가능
 * - title / description / priceKrw / category 수정 가능
 * - status (ACTIVE/SUSPENDED/DELETED) 수정 가능
 *
 * 프론트에서 수정할 때 payload 예시:
 * {
 *   type: "SELL",
 *   title: "제목 수정",
 *   description: "설명 수정",
 *   priceKrw: 12345,
 *   category: "전자기기",
 *   authorId: 7,                // (필수는 아니지만 유지해도 무방)
 *   status: "SUSPENDED"         // 거래완료(노출 중단) 같은 상태로 바꾸고 싶을 때
 * }
 */
export async function updateProduct(id, payload) {
  console.log("updateProduct payload >>>", id, payload);

  if (USE_MOCK) {
    return { mock: true };
  }

  return request("PUT", `/api/market/${encodeURIComponent(id)}`, payload);
}

/**
 * 게시글 삭제
 * DELETE /api/market/{id}
 *
 * 서버 deletePost(@DeleteMapping("/{id}"))는 실제 레코드 삭제 + 관련 이미지 삭제까지 진행함.
 */
export async function deleteProduct(id) {
  if (USE_MOCK) {
    return { mock: true };
  }

  return request("DELETE", `/api/market/${encodeURIComponent(id)}`, null);
}

// 편의상 default export도 유지
const api = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};

export default api;
