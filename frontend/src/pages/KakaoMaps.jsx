import React, { useEffect } from "react";

const KakaoMap = () => {
  useEffect(() => {
    console.log("✅ useEffect 실행됨");
    console.log("Kakao key:", process.env.REACT_APP_KAKAO_KEY);

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log("✅ Kakao SDK 로드 완료");

      if (!window.kakao) {
        console.error("❌ window.kakao 없음");
        return;
      }

      window.kakao.maps.load(() => {
        console.log("✅ Kakao Maps API 준비 완료");
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.4486, 126.6576),
          level: 3,
        };
        new window.kakao.maps.Map(container, options);
      });
    };

    script.onerror = (err) => console.error("❌ Kakao SDK 로드 실패:", err);

    document.head.appendChild(script);
  }, []);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "400px", borderRadius: "8px" }}
    ></div>
  );
};

export default KakaoMap;
