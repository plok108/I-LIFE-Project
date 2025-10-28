import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserEditPage({ user, setUser }) {
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSave = async () => {
    const trimmedName = name ? name.trim() : "";
    const trimmedPhone = phone ? phone.trim() : "";

    if (trimmedName === "") {
      alert("이름을 입력하세요!");
      return;
    }
    if (trimmedPhone === "") {
      alert("전화번호를 입력하세요!");
      return;
    }

    try {
      // ✅ 갱신된 유저 데이터 생성
      const updatedUser = {
        ...user,
        name: trimmedName,
        phone: trimmedPhone,
      };

      // ✅ 실제로는 axios.put(`/api/user/${user.id}`, updatedUser)
      console.log("수정된 사용자 데이터:", updatedUser);

      // ✅ App.js의 전역 user 상태 갱신
      if (setUser) setUser(updatedUser);

      alert("사용자 정보가 수정되었습니다!");

      // ✅ 내 정보 페이지로 이동
      navigate("/user/view");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        로그인 후 이용 가능합니다.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-6 text-center">
          사용자 정보 수정
        </h2>

        <div className="space-y-4 text-sm text-gray-800">
          <div>
            <label className="block text-gray-600 mb-1">학번 (아이디)</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-blue-500"
              placeholder="이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">이메일</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">휴대전화번호</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-blue-500"
              placeholder="전화번호를 입력하세요"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserEditPage;
//asdasdasdTlqkf
