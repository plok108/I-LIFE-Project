import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/products";
import logo from "./../images/logo.png";

export default function MarketPage({ user }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const data = await getProducts(); // 기대 응답: MarketPost[]
      setItems(data || []);
    } catch (e) {
      console.error("상품 불러오기 실패:", e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await fetchItems();
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제에 실패했습니다.");
    }
  };

  // 백엔드 status -> 화면용 텍스트
  const statusToText = (status) => {
  switch (status) {
    case "ACTIVE":
      return "거래중";
    case "SUSPENDED":
      return "거래완료";
    case "DELETED":
      return "삭제됨";
    default:
      return status || "-";
  }
};

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Title"
            className="inline-block h-16 w-auto mr-3 align-middle"
          />
          <span>중고거래 장터</span>
        </div>

        {user && (
          <div className="ml-4">
            <button
              onClick={() => navigate("/market/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              등록
            </button>
          </div>
        )}
      </h1>

      <div className="max-w-6xl mx-auto">
        <div className="border-2 border-gray-300 p-3">
          <div className="grid grid-cols-4 gap-4">
            {items.slice(0, 16).map((item) => {
              // 대표 이미지 뽑기
              const mainImage =
                (item.images &&
                  (item.images.find((img) => img.isPrimary) ||
                    item.images[0])) ||
                null;

              return (
                <div
                  key={item.id}
                  className="bg-white p-4 flex flex-col h-full cursor-pointer"
                  style={{ border: "1px solid #000" }}
                  onClick={() => navigate(`/market/view/${item.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(`/market/view/${item.id}`);
                    }
                  }}
                >
                  <div
                    onClick={() => navigate(`/market/view/${item.id}`)}
                  >
                    <div className="flex-1">
                      {mainImage ? (
                        <div
                          className="mb-2 cursor-pointer"
                          onClick={() =>
                            navigate(`/market/view/${item.id}`)
                          }
                        >
                          <img
                            src={mainImage.url}
                            alt={item.title || "썸네일"}
                            className="w-full h-40 object-cover rounded mb-2"
                          />
                        </div>
                      ) : null}

                      <h2
                        className="text-lg font-semibold mb-2 cursor-pointer"
                        onClick={() => navigate(`/market/view/${item.id}`)}
                      >
                        {item.title}
                      </h2>

                      <p className="text-blue-600 font-bold mb-2">
                        {typeof item.priceKrw === "number"
                          ? item.priceKrw + " 원"
                          : "가격 협의"}
                      </p>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      <div>
                        상태:{" "}
                        <span className="font-medium">
                          {statusToText(item.status)}
                        </span>
                      </div>
                      <div>
                        작성시간:{" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : "-"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <div className="flex items-center space-x-2">
                      {user &&
                        (user.role === "ADMIN" ||
                          String(user.id) === String(item.authorId) ||
                          String(user.uid) === String(item.authorId)) && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/market/edit/${item.id}`);
                              }}
                              className="text-blue-500 hover:text-blue-700 border border-black px-2 py-1 rounded"
                            >
                              수정
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              className="text-red-500 hover:text-red-700 border border-black px-2 py-1 rounded"
                            >
                              삭제
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
