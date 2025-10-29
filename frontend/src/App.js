import "./index.css";
import UserEditPage from "./pages/UserEditPage"; // ✅ 새로 추가
import UserView from "./pages/UserView";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import { getCurrentUser, login, logout as apiLogout } from "./api/auth";
import SignupPage from "./pages/SignupPage";
import MapPage from "./pages/MapPage";
import CommunityPage from "./pages/CommunityPage";
import CommunityDetail from "./pages/CommunityDetail";
import CommunityWrite from "./pages/CommunityWrite";
import MarketPage from "./pages/MarketPage";
import MarketWrite from "./pages/MarketWrite";
import MarketDetail from "./pages/MarketDetail";
import LoginPage from "./pages/LoginPage";
import title from "./images/title.png";

function Header({ user, handleLogout }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 드롭다운 메뉴 토글
  const toggleMenu = () => setOpenMenu((prev) => !prev);

  // 모달 토글
  const toggleModal = () => {
    setShowModal((prev) => !prev);
    setOpenMenu(false); // 모달 열면 드롭다운 닫기
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center relative">
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-blue-700 cursor-pointer flex items-center"
      >
        <img src={title} alt="Title" className="h-16 w-auto" />
      </h1>

      <nav className="flex items-center space-x-4">
        <Link to="/">지도</Link>
        <span className="h-6 border-l border-gray-300 mx-3" aria-hidden="true" />
        <Link to="/community">커뮤니티</Link>
        <span className="h-6 border-l border-gray-300 mx-3" aria-hidden="true" />
        <Link to="/market">중고거래</Link>

        {user ? (
          <div className="relative flex items-center gap-3">
            {/* 사용자 계정 Div */}
            <div
              onClick={toggleMenu}
              className="border 10px black cursor-pointer bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 text-gray-800 font-medium select-none"
            >
              내정보 : {user.name} 
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              로그아웃
            </button>

            {/* 드롭다운 메뉴 */}
            {openMenu && (
              <div className="absolute right-0 top-10 w-44 bg-white text-gray-800 rounded shadow-md z-10">
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/user/view"); // 내 정보 보기 페이지로 이동
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
                >
                  내 정보 보기
                </button>
                
                <button
                  onClick={() => {
                    setOpenMenu(false); // 메뉴 닫기
                    navigate("/user/edit"); // 사용자 정보 수정 페이지로 이동
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  사용자 정보 수정
                </button>
              </div>
            )}

            {/* 사용자 정보 모달 */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-20">
                <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                  <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
                    사용자 정보
                  </h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>ID:</strong> {user.id}
                    </p>
                    <p>
                      <strong>사용자명:</strong> {user.username}
                    </p>
                    <p>
                      <strong>이름:</strong> {user.name}
                    </p>
                    <p>
                      <strong>이메일:</strong> {user.email}
                    </p>
                    <p>
                      <strong>전화번호:</strong> {user.phone}
                    </p>
                  </div>

                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      onClick={() => alert("사용자 정보 수정 기능은 추후 구현 예정")}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={toggleModal}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getCurrentUser();
        if (!mounted) return;
        if (u) {
          console.log("로그인된 사용자:", u);
          setUser(u);
        } else {
          console.log("로그인 안됨");
          setUser(null);
        }
      } catch (e) {
        console.error("getCurrentUser 오류:", e);
        setUser(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const u = await login(credentials);
      setUser(u);
      return u;
    } catch (e) {
      console.error("로그인 실패:", e);
      throw e;
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.warn("서버 로그아웃 실패 (무시):", e);
    }
    setUser(null);
  };

  return (
    <Router>
      <Header user={user} handleLogout={handleLogout} />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/community" element={<CommunityPage user={user} />} />
          <Route path="/community/new" element={<CommunityWrite />} />
          <Route path="/community/edit/:id" element={<CommunityWrite />} />
          <Route
            path="/community/view/:id"
            element={<CommunityDetail user={user} />}
          />
          
          <Route path="/market" element={<MarketPage user={user} />} />
          <Route path="/market/new" element={<MarketWrite />} />
          <Route
            path="/market/view/:id"
            element={<MarketDetail user={user} />}
          />
          <Route path="/market/edit/:id" element={<MarketWrite />} />
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/user/edit" element={<UserEditPage user={user} setUser={setUser} />}/>
          <Route path="/user/view" element={<UserView user={user} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
