import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료되었습니다! 로그인해주세요.");
        navigate("/login");
      } else {
        setError(data.message || "회원가입 실패");
      }
    } catch (err) {
      setError("서버 연결 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-10 rounded-xl shadow-xl text-center w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 회원가입</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm text-gray-600">사용자명 *</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1"
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">비밀번호 *</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">비밀번호 확인 *</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">이름 *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">이메일 *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1"
              required
              maxLength={120}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">전화번호</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1"
              maxLength={30}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition w-full"
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>

        <div className="mt-4 text-sm">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="text-blue-600">
            로그인
          </Link>
        </div>
      </form>
    </div>
  );
}