import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function LoginPage({ handleLogin }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("로그인 시도:", usernameOrEmail);
      // 전역 상태 업데이트를 위해 상위에서 전달된 handleLogin 사용  12
      await handleLogin({ usernameOrEmail, password });
      navigate("/");
    } catch (err) {
      console.error("로그인 에러:", err);
      setError(err.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  const useMock = process.env.REACT_APP_USE_MOCK === "true";
  const autoLoginMock = async () => {
    setLoading(true);
    try {
      await handleLogin({ id: "202244083", password: "202244083" });
      navigate("/");
    } catch (err) {
      alert(err.message || "자동 로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-10 rounded-xl shadow-xl text-center w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🔐 로그인</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="mb-3 text-left">
          <label className="block text-sm text-gray-600">사용자명 또는 이메일</label>
          <input
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="border w-full p-2 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4 text-left">
          <label className="block text-sm text-gray-600">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full p-2 rounded mt-1"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="mt-4 text-sm">
          아직 계정이 없나요?{" "}
          <Link to="/signup" className="text-blue-600">
            회원가입
          </Link>
        </div>
        {useMock && (
          <div className="mt-3 text-sm">
            <button
              type="button"
              onClick={autoLoginMock}
              className="text-sm text-gray-700 underline"
            >
              테스트 계정으로 자동 로그인 (202244083)
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
