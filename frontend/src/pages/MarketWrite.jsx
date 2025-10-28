import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addProduct, getProduct, updateProduct } from "../api/products";
import { getCurrentUser } from "../api/auth";

export default function MarketWrite() {
  const [form, setForm] = useState({
    type: "SELL",        // SELL = 판매합니다 / BUY = 구해요
    title: "",
    description: "",
    priceKrw: "",
    category: "",
    status: "ACTIVE",    // ACTIVE=판매중 / SUSPENDED=예약중 / DELETED=판매완료
  });

  // 아직 실제 업로드는 안 붙였지만, 필드 자체는 유지
  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);

  const navigate = useNavigate();
  const { id: editingId } = useParams();

  // 로그인 사용자 정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        const u = await getCurrentUser();
        setMe(u);
      } catch (e) {
        console.warn("현재 사용자 정보 로드 실패:", e);
      }
    })();
  }, []);

  // 수정 모드면 기존 게시글 로드해서 form 채우기
  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const p = await getProduct(editingId);
        if (!p) {
          alert("존재하지 않는 상품입니다.");
          return;
        }
        setForm({
          type: p.type || "SELL", // DB에 'SELL' / 'BUY' 들어있음
          title: p.title || "",
          description: p.description || "",
          priceKrw:
            typeof p.priceKrw === "number" ? String(p.priceKrw) : "",
          category: p.category || "",
          status: p.status || "ACTIVE", // ACTIVE / SUSPENDED / DELETED
        });
      } catch (e) {
        console.error(e);
        alert("상품을 불러오지 못했습니다.");
      }
    })();
  }, [editingId]);

  const onSubmit = async (e) => {
    e?.preventDefault();

    const { type, title, description, priceKrw, category, status } = form;

    if (!title.trim() || priceKrw === "") {
      alert("제목과 가격은 필수입니다.");
      return;
    }

    if (!me || !me.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    setSaving(true);

    try {
      // 서버에 보낼 payload
      const payload = {
        type: (type || "SELL").toUpperCase(), // "SELL" | "BUY"
        title,
        description,
        priceKrw: parseInt(priceKrw, 10) || 0,
        category,
        authorId: me.id || null,
        status: status || "ACTIVE", // ACTIVE / SUSPENDED / DELETED
      };

      if (editingId) {
        // 수정
        await updateProduct(editingId, payload);
      } else {
        // 신규 등록
        await addProduct(payload);
      }

      navigate("/market");
    } catch (err) {
      console.error(err);
      alert("상품 등록/수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? "상품 수정" : "상품 등록"}
      </h1>

      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        {/* 1행: 거래 상태 + 거래 종류 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 거래 상태 (판매중/예약중/판매완료) -> DB status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              거래 상태
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="border w-full p-2 rounded"
            >
              {/* ACTIVE = 판매중 */}
              <option value="ACTIVE">판매중</option>
              {/* SUSPENDED = 예약중 */}
              <option value="SUSPENDED">예약중</option>
              {/* DELETED = 판매완료 */}
              <option value="DELETED">판매완료</option>
            </select>
          </div>

          {/* 거래 종류 (글 성격: 판매합니다 / 구해요) -> DB type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              글 종류
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="border w-full p-2 rounded"
            >
              <option value="SELL">판매합니다</option>
              <option value="BUY">구해요</option>
            </select>
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            카테고리
          </label>
          <input
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="border w-full p-2 rounded"
            placeholder="예: 전자기기"
          />
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            제품 이름
          </label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="border w-full p-2 rounded"
            placeholder="예: 맥북 에어 M1 13인치"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            제품 설명
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border w-full p-2 rounded"
            rows={4}
            placeholder="상태, 사용기간 등 상세 설명"
          />
        </div>

        {/* 가격 + 이미지 업로드(아직 서버 미연결) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              가격 (원)
            </label>
            <input
              type="number"
              value={form.priceKrw}
              onChange={(e) =>
                setForm({ ...form, priceKrw: e.target.value })
              }
              className="border w-full p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              이미지 (선택)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {/* 파일 업로드 API는 추후 /api/market/{postId}/images 로 따로 붙일 예정 */}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {saving
              ? editingId
                ? "수정중..."
                : "등록중..."
              : editingId
              ? "수정"
              : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
