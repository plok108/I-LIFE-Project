import React from "react";
import { useNavigate } from "react-router-dom";
//sdas아 씨발 이것까지안되면 걍 자퇴함 개새끼야.
function UserView({ user }) {
  const navigate = useNavigate();

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
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          내 정보
        </h2>

        <div className="space-y-4 text-gray-700 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">학번</span>
            <span>{user.username}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">이름</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">이메일</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">휴대전화번호</span>
            <span>{user.phone}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            돌아가기
          </button>

          <button
            onClick={() => navigate("/user/edit")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserView;
